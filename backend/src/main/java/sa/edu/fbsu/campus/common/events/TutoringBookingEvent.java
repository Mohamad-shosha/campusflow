package sa.edu.fbsu.campus.common.events;

import java.util.UUID;

public record TutoringBookingEvent(
        UUID studentId,
        UUID tutorId,
        UUID universityId,
        String courseCode,
        String courseNameAr,
        String courseNameEn,
        String studentName,
        String tutorName
) {
}
