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
import sa.edu.fbsu.campus.tutoring.domain.TutoringSession;
import sa.edu.fbsu.campus.tutoring.dto.CreateTutoringSessionRequest;
import sa.edu.fbsu.campus.tutoring.dto.TutoringSessionResponse;
import sa.edu.fbsu.campus.tutoring.infra.TutoringEnrollmentRepository;
import sa.edu.fbsu.campus.tutoring.infra.TutoringSessionRepository;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TutoringService {

    private static final Logger log = LoggerFactory.getLogger(TutoringService.class);
    private static final BigDecimal OFFICIAL_HOURLY_RATE = new BigDecimal("70.00");
    private static final Set<String> ALLOWED_CATEGORIES = Set.of("math", "programming", "hardware", "science", "general");

    private final TutoringSessionRepository sessionRepository;
    private final TutoringEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;

    public TutoringService(
            TutoringSessionRepository sessionRepository,
            TutoringEnrollmentRepository enrollmentRepository,
            UserRepository userRepository,
            UniversityRepository universityRepository
    ) {
        this.sessionRepository = sessionRepository;
        this.enrollmentRepository = enrollmentRepository;
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

        return sessions.stream()
                .map(s -> TutoringSessionResponse.fromEntity(s, enrollmentsBySession.getOrDefault(s.getId(), List.of())))
                .toList();
    }

    @Transactional(readOnly = true)
    public TutoringSessionResponse getSession(String idOrCode) {
        TutoringSession session = findSessionByIdOrCode(idOrCode);
        List<TutoringEnrollment> enrollments = enrollmentRepository
                .findBySessionIdAndStatusWithStudent(session.getId(), TutoringEnrollmentStatus.CONFIRMED);
        return TutoringSessionResponse.fromEntity(session, enrollments);
    }

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

