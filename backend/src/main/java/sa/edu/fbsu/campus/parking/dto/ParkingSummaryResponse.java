package sa.edu.fbsu.campus.parking.dto;

public record ParkingSummaryResponse(
        int totalSpots,
        long availableSpots,
        long occupiedSpots,
        long flexSpots,
        long reservedSpots,
        long facultySpots,
        double occupancyRatePercent
) {}

