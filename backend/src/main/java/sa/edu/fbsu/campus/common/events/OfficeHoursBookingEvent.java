package sa.edu.fbsu.campus.common.events;

import java.util.UUID;

public record OfficeHoursBookingEvent(
        UUID studentId,
        UUID facultyId,
        UUID universityId,
        String facultyNameAr,
        String facultyNameEn,
        String studentName,
        String slotTime,
        String action // "BOOKED", "CANCELLED"
) {
}
