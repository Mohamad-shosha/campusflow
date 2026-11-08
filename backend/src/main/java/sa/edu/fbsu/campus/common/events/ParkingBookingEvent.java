package sa.edu.fbsu.campus.common.events;

import java.util.UUID;

public record ParkingBookingEvent(
        UUID recipientUserId,
        UUID universityId,
        String bayCode,
        String action, // "BOOKED", "CANCELLED"
        String startLabel,
        String endLabel
) {
}
