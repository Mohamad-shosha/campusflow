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
        return fromEntity(s, enrollments, null, 0);
    }

    public static TutoringSessionResponse fromEntity(
            TutoringSession s,
            List<TutoringEnrollment> enrollments,
            BigDecimal rating,
            int reviewsCount
    ) {
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
                reviewsCount > 0 ? rating : null,
                reviewsCount,
                s.getStatus().name(),
                names,
                numbers,
                s.getCreatedAt()
        );
    }

    /**
     * Sessions are listed publicly, so the enrolled-student roster is personal data. The tutor and
     * staff see everyone; any other viewer only sees their own entry (enough for "already enrolled").
     */
    public TutoringSessionResponse visibleTo(UUID viewerUserId, String viewerUniversityNumber, boolean staff) {
        if (staff || (viewerUserId != null && viewerUserId.equals(tutorUserId))) {
            return this;
        }
        List<String> names = new java.util.ArrayList<>();
        List<String> numbers = new java.util.ArrayList<>();
        for (int i = 0; i < enrolledStudentNumbers.size(); i++) {
            if (viewerUniversityNumber != null && viewerUniversityNumber.equals(enrolledStudentNumbers.get(i))) {
                numbers.add(enrolledStudentNumbers.get(i));
                if (i < enrolledStudents.size()) names.add(enrolledStudents.get(i));
            }
        }
        return new TutoringSessionResponse(id, sessionCode, tutorUserId, null, tutorNameAr, tutorNameEn,
                tutorRoleAr, tutorRoleEn, tutorAvatarColor, courseCode, courseNameAr, courseNameEn,
                coveredLectures, coveredScope, category, hourlyRate, durationHours, totalPrice, currency,
                scheduleText, location, maxCapacity, enrolledCount, rating, reviewsCount, status,
                List.copyOf(names), List.copyOf(numbers), createdAt);
    }
}
