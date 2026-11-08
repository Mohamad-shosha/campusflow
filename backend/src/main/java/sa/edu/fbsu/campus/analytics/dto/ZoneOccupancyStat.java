package sa.edu.fbsu.campus.analytics.dto;

public record ZoneOccupancyStat(
        String zoneCode,
        String zoneNameAr,
        String zoneNameEn,
        int totalSpots,
        int occupiedSpots,
        double occupancyRate
) {}

