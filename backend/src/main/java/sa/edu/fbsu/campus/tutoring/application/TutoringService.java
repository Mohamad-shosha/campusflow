package sa.edu.fbsu.campus.tutoring.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.domain.UserStatus;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.tutoring.domain.TutoringEnrollment;
import sa.edu.fbsu.campus.tutoring.domain.TutoringEnrollmentStatus;
import sa.edu.fbsu.campus.tutoring.domain.TutoringReview;
import sa.edu.fbsu.campus.tutoring.domain.TutoringSession;
import sa.edu.fbsu.campus.tutoring.dto.CreateTutoringSessionRequest;
import sa.edu.fbsu.campus.tutoring.dto.SubmitTutoringReviewRequest;
import sa.edu.fbsu.campus.tutoring.dto.TutoringSessionResponse;
import sa.edu.fbsu.campus.tutoring.infra.TutoringEnrollmentRepository;
import sa.edu.fbsu.campus.tutoring.infra.TutoringReviewRepository;
import sa.edu.fbsu.campus.tutoring.infra.TutoringSessionRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TutoringService {

    private static final Logger log = LoggerFactory.getLogger(TutoringService.class);
    private static final BigDecimal OFFICIAL_HOURLY_RATE = new BigDecimal("70.00");
    private static final Set<String> ALLOWED_CATEGORIES = Set.of("math", "programming", "hardware", "science", "general");

    private final TutoringSessionRepository sessionRepository;
    private final TutoringEnrollmentRepository enrollmentRepository;
    private final TutoringReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;

    public TutoringService(
            TutoringSessionRepository sessionRepository,
            TutoringEnrollmentRepository enrollmentRepository,
            TutoringReviewRepository reviewRepository,
            UserRepository userRepository,
            UniversityRepository universityRepository
    ) {
        this.sessionRepository = sessionRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.universityRepository = universityRepository;
    }

    @Transactional(readOnly = true)
    public List<TutoringSessionResponse> listSessions(String category) {
        UUID universityId = resolveDefaultUniversityId();
        List<TutoringSession> sessions;
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("all")) {
            sessions = sessionRepository.findAllByUniversityIdAndCategoryWithTutor(universityId, category.trim().toLowerCase());
        } else {
            sessions = sessionRepository.findAllByUniversityIdWithTutor(universityId);
        }

        if (sessions.isEmpty()) {
            return List.of();
        }

        List<UUID> sessionIds = sessions.stream().map(TutoringSession::getId).toList();
        Map<UUID, List<TutoringEnrollment>> enrollmentsBySession = enrollmentRepository
                .findBySessionIdsAndStatusWithStudent(sessionIds, TutoringEnrollmentStatus.CONFIRMED)
                .stream()
                .collect(Collectors.groupingBy(e -> e.getSession().getId()));
        Map<UUID, RatingAggregate> ratingMap = loadRatingStats(sessionIds);

        return sessions.stream()
                .map(s -> {
                    RatingAggregate agg = ratingMap.get(s.getId());
                    return TutoringSessionResponse.fromEntity(
                            s,
                            enrollmentsBySession.getOrDefault(s.getId(), List.of()),
                            agg != null ? agg.rating() : null,
                            agg != null ? agg.count() : 0
                    );
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public TutoringSessionResponse getSession(String idOrCode) {
        TutoringSession session = findSessionByIdOrCode(idOrCode);
        return buildSessionResponse(session);
    }

    @Transactional
    public TutoringSessionResponse submitReview(
            UUID studentUserId,
            String idOrCode,
            SubmitTutoringReviewRequest request
    ) {
        Objects.requireNonNull(studentUserId, "Authenticated user ID cannot be null");
        Objects.requireNonNull(request, "SubmitTutoringReviewRequest cannot be null");

        User student = userRepository.findById(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student user not found: " + studentUserId));

        TutoringSession session = findSessionByIdOrCode(idOrCode);

        if (session.getTutor().getId().equals(studentUserId)) {
            throw new IllegalArgumentException("Tutors cannot submit reviews for their own tutoring sessions.");
        }

        boolean isEnrolled = enrollmentRepository.existsBySessionIdAndStudentIdAndStatus(
                session.getId(), studentUserId, TutoringEnrollmentStatus.CONFIRMED);
        if (!isEnrolled) {
            throw new AccessDeniedException("Only confirmed enrolled students may rate and review this tutoring session.");
        }

        if (reviewRepository.existsBySessionIdAndStudentId(session.getId(), studentUserId)) {
            throw new IllegalStateException("You have already submitted a review for session " + session.getSessionCode() + ".");
        }

        reviewRepository.saveAndFlush(new TutoringReview(
                session.getUniversityId(),
                session,
                student,
                request.rating(),
                request.comment()
        ));

        log.info("Recorded {} star review for tutoring session {} by student {}",
                request.rating(), session.getSessionCode(), student.getUniversityNumber());

        return buildSessionResponse(session);
    }

    private TutoringSessionResponse buildSessionResponse(TutoringSession session) {
        List<TutoringEnrollment> enrollments = enrollmentRepository
                .findBySessionIdAndStatusWithStudent(session.getId(), TutoringEnrollmentStatus.CONFIRMED);
        RatingAggregate agg = loadRatingStats(List.of(session.getId())).get(session.getId());
        return TutoringSessionResponse.fromEntity(
                session,
                enrollments,
                agg != null ? agg.rating() : null,
                agg != null ? agg.count() : 0
        );
    }

    private Map<UUID, RatingAggregate> loadRatingStats(List<UUID> sessionIds) {
        if (sessionIds == null || sessionIds.isEmpty()) {
            return Map.of();
        }
        Map<UUID, RatingAggregate> map = new HashMap<>();
        for (Object[] row : reviewRepository.findRatingStatsBySessionIds(sessionIds)) {
            UUID sessionId = (UUID) row[0];
            double avgRaw = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
            int count = row[2] != null ? ((Number) row[2]).intValue() : 0;
            if (count > 0) {
                BigDecimal avg = BigDecimal.valueOf(avgRaw).setScale(2, RoundingMode.HALF_UP);
                map.put(sessionId, new RatingAggregate(avg, count));
            }
        }
        return map;
    }

    private record RatingAggregate(BigDecimal rating, int count) {}

    @Transactional
    public TutoringSessionResponse createSession(UUID userId, CreateTutoringSessionRequest request) {
        Objects.requireNonNull(userId, "Authenticated user ID cannot be null");
        Objects.requireNonNull(request, "CreateTutoringSessionRequest cannot be null");

        User tutor = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Campus user not found: " + userId));

        if (tutor.getStatus() != UserStatus.ACTIVE) {
            throw new AccessDeniedException("Only active campus members may publish peer tutoring sessions.");
        }

        boolean eligibleStudentOrAdmin = tutor.getUserType() == UserType.STUDENT || tutor.hasRole(Role.CAMPUS_ADMIN);
        if (!eligibleStudentOrAdmin) {
            throw new AccessDeniedException("Peer tutoring sessions may only be published by eligible student tutors or campus administrators.");
        }

        String normalizedCategory = request.category().trim().toLowerCase();
        if (!ALLOWED_CATEGORIES.contains(normalizedCategory)) {
            throw new IllegalArgumentException("Invalid tutoring category '" + request.category()
                    + "'. Supported categories: " + ALLOWED_CATEGORIES);
        }

        BigDecimal durationHours = request.durationHours() != null ? request.durationHours() : BigDecimal.ONE;
        int maxCapacity = request.maxCapacity() != null ? request.maxCapacity() : 10;

        String sessionCode = "TUT-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String courseNameEn = (request.courseNameEn() != null && !request.courseNameEn().isBlank())
                ? request.courseNameEn().trim()
                : request.courseNameAr().trim();

        String specialtySuffixAr = (tutor.getSpecialty() != null && !tutor.getSpecialty().isBlank())
                ? " - " + tutor.getSpecialty()
                : "";
        String tutorRoleAr = "طالب متميز" + specialtySuffixAr;
        String tutorRoleEn = "Honor Peer Tutor";

        TutoringSession session = new TutoringSession(
                tutor.getUniversityId(),
                sessionCode,
                tutor,
                tutorRoleAr,
                tutorRoleEn,
                "#116E63",
                request.courseCode().trim(),
                request.courseNameAr().trim(),
                courseNameEn,
                request.coveredLectures().trim(),
                request.coveredScope().trim(),
                normalizedCategory,
                OFFICIAL_HOURLY_RATE,
                durationHours,
                request.scheduleText().trim(),
                request.location().trim(),
                maxCapacity
        );

        TutoringSession saved = sessionRepository.save(session);
        log.info("Published new peer tutoring session {} [{}] by student {} ({} SAR)",
                saved.getSessionCode(), saved.getCourseCode(), tutor.getUniversityNumber(), saved.getTotalPrice());

        return TutoringSessionResponse.fromEntity(saved, List.of());
    }

    public TutoringSession findSessionByIdOrCode(String idOrCode) {
        if (idOrCode == null || idOrCode.isBlank()) {
            throw new IllegalArgumentException("Session identifier is required.");
        }
        try {
            UUID id = UUID.fromString(idOrCode.trim());
            return sessionRepository.findDetailedById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Tutoring session not found: " + idOrCode));
        } catch (IllegalArgumentException ignored) {
            return sessionRepository.findDetailedBySessionCode(idOrCode.trim())
                    .orElseThrow(() -> new ResourceNotFoundException("Tutoring session not found: " + idOrCode));
        }
    }

    private UUID resolveDefaultUniversityId() {
        return universityRepository.findByCode("FBSU")
                .map(University::getId)
                .orElseGet(() -> universityRepository.findAll().stream()
                        .findFirst()
                        .map(University::getId)
                        .orElseThrow(() -> new ResourceNotFoundException("Default FBSU university tenant not initialized")));
    }
}

