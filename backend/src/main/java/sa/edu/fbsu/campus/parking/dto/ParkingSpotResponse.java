package sa.edu.fbsu.campus.parking.dto;

import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.domain.SpotType;

import java.time.Instant;
import java.util.UUID;

public record ParkingSpotResponse(
        UUID id,
        int bayNumber,
        String zoneCode,
        String zoneNameAr,
        String zoneNameEn,
        SpotType spotType,
        SpotStatus status,
        int distanceMeters,
        boolean flexEligible,
        UUID currentOccupantId,
        String occupantNameAr,
        String occupantNameEn,
        String vehicleModel,
        String plateLettersAr,
        String plateDigits,
        String timeLeftText,
        Instant sessionEndsAt
) {}

