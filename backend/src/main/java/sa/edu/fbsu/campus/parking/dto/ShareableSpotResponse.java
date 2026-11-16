package sa.edu.fbsu.campus.parking.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * A bay the current user is allowed to offer on Flex-Share.
 *
 * @param source         {@code BOOKING} (the user holds a live booking on the bay) or
 *                       {@code ASSIGNMENT} (the bay is assigned to the user as faculty)
 * @param availableUntil latest instant an offer may end (the booking's end), or {@code null}
 *                       for an assigned bay (only the request's own duration limit applies)
 */
public record ShareableSpotResponse(
        UUID spotId,
        int bayNumber,
        String zoneCode,
        String zoneNameAr,
        String zoneNameEn,
        String source,
        Instant availableUntil
) {
}
