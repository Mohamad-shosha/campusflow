package sa.edu.fbsu.campus.tutoring.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.tutoring.domain.TutoringEnrollment;
import sa.edu.fbsu.campus.tutoring.domain.TutoringEnrollmentStatus;
import sa.edu.fbsu.campus.tutoring.domain.TutoringSession;
import sa.edu.fbsu.campus.tutoring.domain.TutoringSessionStatus;
import sa.edu.fbsu.campus.tutoring.dto.BookTutoringRequest;
import sa.edu.fbsu.campus.tutoring.dto.TutoringEnrollmentResponse;
import sa.edu.fbsu.campus.tutoring.dto.TutoringSessionResponse;
import sa.edu.fbsu.campus.tutoring.infra.TutoringEnrollmentRepository;
import sa.edu.fbsu.campus.tutoring.infra.TutoringSessionRepository;
import sa.edu.fbsu.campus.wallet.application.WalletService;
import sa.edu.fbsu.campus.wallet.dto.TransferRequest;
import sa.edu.fbsu.campus.wallet.dto.WalletResponse;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class TutoringBookingService {

    private static final Logger log = LoggerFactory.getLogger(TutoringBookingService.class);

    private final TutoringSessionRepository sessionRepository;
    private final TutoringEnrollmentRepository enrollmentRepository;
    private final TutoringService tutoringService;
    private final UserRepository userRepository;
    private final WalletService walletService;

    public TutoringBookingService(
            TutoringSessionRepository sessionRepository,
            TutoringEnrollmentRepository enrollmentRepository,
            TutoringService tutoringService,
            UserRepository userRepository,
            WalletService walletService
    ) {
        this.sessionRepository = sessionRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.tutoringService = tutoringService;
        this.userRepository = userRepository;
        this.walletService = walletService;
    }

    @Transactional
    public TutoringEnrollmentResponse bookSession(
            UUID studentUserId,
            String sessionIdOrCode,
            BookTutoringRequest request
    ) {
        Objects.requireNonNull(studentUserId, "Authenticated student user ID cannot be null");

        User student = userRepository.findById(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student user not found: " + studentUserId));

        TutoringSession session = lockSessionByIdOrCode(sessionIdOrCode);

        String explicitKey = (request != null && request.idempotencyKey() != null && !request.idempotencyKey().isBlank())
                ? request.idempotencyKey().trim()
                : null;

        // 1. Idempotency check if caller supplied an explicit key
        if (explicitKey != null) {
            var existingOpt = enrollmentRepository.findByIdempotencyKey(explicitKey);
            if (existingOpt.isPresent() && existingOpt.get().getStudent().getId().equals(studentUserId)) {
                TutoringEnrollment existing = existingOpt.get();
                WalletResponse wallet = walletService.getWalletResponse(studentUserId);
                List<TutoringEnrollment> activeEnrollments = enrollmentRepository
                        .findBySessionIdAndStatusWithStudent(session.getId(), TutoringEnrollmentStatus.CONFIRMED);
                return TutoringEnrollmentResponse.fromEntity(
                        existing,
                        wallet.balance(),
                        TutoringSessionResponse.fromEntity(session, activeEnrollments)
                );
            }
        }

        // 2. Prevent self-booking
        if (session.getTutor().getId().equals(studentUserId)) {
            throw new IllegalArgumentException("Tutors cannot book their own peer tutoring sessions.");
        }

        // 3. Prevent duplicate enrollment by the same student
        if (enrollmentRepository.existsBySessionIdAndStudentIdAndStatus(
                session.getId(), studentUserId, TutoringEnrollmentStatus.CONFIRMED)) {
            throw new IllegalStateException("You are already enrolled in tutoring session " + session.getSessionCode() + ".");
        }

        // 4. Validate session status and capacity under pessimistic write lock
        if (session.getStatus() != TutoringSessionStatus.OPEN) {
            throw new IllegalStateException("Tutoring session " + session.getSessionCode() + " is not open for enrollment.");
        }

        long currentEnrolled = enrollmentRepository.countBySessionIdAndStatus(
                session.getId(), TutoringEnrollmentStatus.CONFIRMED);
        if (currentEnrolled >= session.getMaxCapacity()) {
            session.setStatus(TutoringSessionStatus.BOOKED);
            sessionRepository.save(session);
            throw new IllegalStateException("Tutoring session " + session.getSessionCode() + " has reached full capacity.");
        }

        // 5. Execute atomic wallet transfer from student to peer tutor
        String transferKey = explicitKey != null
                ? explicitKey
                : "TUT-BOOK-" + session.getId() + "-" + studentUserId;

        String transferDesc = "Peer tutoring session " + session.getCourseCode() + " (" + session.getSessionCode() + ")";
        WalletResponse updatedStudentWallet = walletService.transfer(
                studentUserId,
                new TransferRequest(
                        session.getTutor().getUniversityNumber(),
                        session.getTotalPrice(),
                        transferKey,
                        transferDesc
                )
        );

        // 6. Save enrollment and update session status if capacity is reached
        TutoringEnrollment enrollment = enrollmentRepository.save(new TutoringEnrollment(
                student.getUniversityId(),
                session,
                student,
                session.getTotalPrice(),
                transferKey
        ));

        if (currentEnrolled + 1 >= session.getMaxCapacity()) {
            session.setStatus(TutoringSessionStatus.BOOKED);
            sessionRepository.save(session);
        }

        List<TutoringEnrollment> updatedEnrollments = enrollmentRepository
                .findBySessionIdAndStatusWithStudent(session.getId(), TutoringEnrollmentStatus.CONFIRMED);

        log.info("Student {} enrolled in tutoring session {} [{}] — transferred {} SAR to tutor {}",
                student.getUniversityNumber(),
                session.getSessionCode(),
                session.getCourseCode(),
                session.getTotalPrice(),
                session.getTutor().getUniversityNumber());

        return TutoringEnrollmentResponse.fromEntity(
                enrollment,
                updatedStudentWallet.balance(),
                TutoringSessionResponse.fromEntity(session, updatedEnrollments)
        );
    }

    @Transactional(readOnly = true)
    public List<TutoringEnrollmentResponse> getMyEnrollments(UUID studentUserId) {
        WalletResponse wallet = walletService.getWalletResponse(studentUserId);
        return enrollmentRepository.findByStudentIdWithSession(studentUserId).stream()
                .map(e -> {
                    List<TutoringEnrollment> enrollments = enrollmentRepository
                            .findBySessionIdAndStatusWithStudent(e.getSession().getId(), TutoringEnrollmentStatus.CONFIRMED);
                    return TutoringEnrollmentResponse.fromEntity(
                            e,
                            wallet.balance(),
                            TutoringSessionResponse.fromEntity(e.getSession(), enrollments)
                    );
                })
                .toList();
    }

    private TutoringSession lockSessionByIdOrCode(String idOrCode) {
        if (idOrCode == null || idOrCode.isBlank()) {
            throw new IllegalArgumentException("Session identifier is required.");
        }
        try {
            UUID id = UUID.fromString(idOrCode.trim());
            return sessionRepository.findByIdForUpdate(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Tutoring session not found: " + idOrCode));
        } catch (IllegalArgumentException ignored) {
            return sessionRepository.findBySessionCodeForUpdate(idOrCode.trim())
                    .orElseThrow(() -> new ResourceNotFoundException("Tutoring session not found: " + idOrCode));
        }
    }
}

