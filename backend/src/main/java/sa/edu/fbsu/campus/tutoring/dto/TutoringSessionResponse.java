package sa.edu.fbsu.campus.tutoring.dto;

import sa.edu.fbsu.campus.tutoring.domain.TutoringEnrollment;
import sa.edu.fbsu.campus.tutoring.domain.TutoringSession;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record TutoringSessionResponse(
        UUID id,
        String sessionCode,
        UUID tutorUserId,
        String tutorUniversityNumber,
        String tutorNameAr,
        String tutorNameEn,
        String tutorRoleAr,
        String tutorRoleEn,
        String tutorAvatarColor,
        String courseCode,
        String courseNameAr,
        String courseNameEn,
        String coveredLectures,
        String coveredScope,
        String category,
        BigDecimal hourlyRate,
        BigDecimal durationHours,
        BigDecimal totalPrice,
        String currency,
        String scheduleText,
        String location,
        int maxCapacity,
        int enrolledCount,
        BigDecimal rating,
        int reviewsCount,
        String status,
        List<String> enrolledStudents,
        List<String> enrolledStudentNumbers,
        Instant createdAt
) {
    public static TutoringSessionResponse fromEntity(TutoringSession s, List<TutoringEnrollment> enrollments) {
        List<String> names = enrollments.stream()
                .map(e -> e.getStudent().getFullNameAr())
                .toList();
        List<String> numbers = enrollments.stream()
                .map(e -> e.getStudent().getUniversityNumber())
                .toList();

        return new TutoringSessionResponse(
                s.getId(),
                s.getSessionCode(),
                s.getTutor().getId(),
                s.getTutor().getUniversityNumber(),
                s.getTutor().getFullNameAr(),
                s.getTutor().getFullNameEn(),
                s.getTutorRoleAr(),
                s.getTutorRoleEn(),
                s.getTutorAvatarColor(),
                s.getCourseCode(),
                s.getCourseNameAr(),
                s.getCourseNameEn(),
                s.getCoveredLectures(),
                s.getCoveredScope(),
                s.getCategory(),
                s.getHourlyRate(),
                s.getDurationHours(),
                s.getTotalPrice(),
                s.getCurrency(),
                s.getScheduleText(),
                s.getLocation(),
                s.getMaxCapacity(),
                enrollments.size(),
                s.getRating(),
                s.getReviewsCount(),
                s.getStatus().name(),
                names,
                numbers,
                s.getCreatedAt()
        );
    }
}

