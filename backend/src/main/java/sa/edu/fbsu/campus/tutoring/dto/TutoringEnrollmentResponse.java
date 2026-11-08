package sa.edu.fbsu.campus.tutoring.dto;

import sa.edu.fbsu.campus.tutoring.domain.TutoringEnrollment;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TutoringEnrollmentResponse(
        UUID enrollmentId,
        UUID sessionId,
        String sessionCode,
        String courseCode,
        String courseNameAr,
        String courseNameEn,
        String tutorUniversityNumber,
        String tutorNameAr,
        String tutorNameEn,
        String studentUniversityNumber,
        String studentNameAr,
        BigDecimal amountPaid,
        String currency,
        BigDecimal studentWalletBalance,
        String status,
        Instant createdAt,
        TutoringSessionResponse session
) {
    public static TutoringEnrollmentResponse fromEntity(
            TutoringEnrollment enrollment,
            BigDecimal studentWalletBalance,
            TutoringSessionResponse sessionResponse
    ) {
        var s = enrollment.getSession();
        return new TutoringEnrollmentResponse(
                enrollment.getId(),
                s.getId(),
                s.getSessionCode(),
                s.getCourseCode(),
                s.getCourseNameAr(),
                s.getCourseNameEn(),
                s.getTutor().getUniversityNumber(),
                s.getTutor().getFullNameAr(),
                s.getTutor().getFullNameEn(),
                enrollment.getStudent().getUniversityNumber(),
                enrollment.getStudent().getFullNameAr(),
                enrollment.getAmountPaid(),
                enrollment.getCurrency(),
                studentWalletBalance,
                enrollment.getStatus().name(),
                enrollment.getCreatedAt(),
                sessionResponse
        );
    }
}

