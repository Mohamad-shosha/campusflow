package sa.edu.fbsu.campus.common.events;

import java.util.UUID;

public record StudyRoomBookingEvent(
        UUID recipientUserId,
        UUID universityId,
        String roomCode,
        String roomNameAr,
        String roomNameEn,
        String action, // "BOOKED", "EXTENDED", "RELEASED"
        String timeWindow
) {
}
