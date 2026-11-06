package sa.edu.fbsu.campus.parking.dto;

import java.util.UUID;

public record ParkingZoneResponse(
        UUID id,
        String code,
        String nameAr,
        String nameEn,
        int totalSpots,
        long availableSpots,
        long occupiedSpots,
        long flexSpots
) {}

