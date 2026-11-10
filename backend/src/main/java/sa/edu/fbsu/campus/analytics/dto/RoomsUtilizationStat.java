package sa.edu.fbsu.campus.analytics.dto;

/**
 * Study rooms & smart labs inventory and active utilization derived exclusively
 * from persisted {@code study_room} and {@code room_booking} records.
 */
public record RoomsUtilizationStat(
        int totalRooms,
        int availableRooms,
        int inUseRooms,
        int reservedRooms,
        int maintenanceRooms,
        double activeUtilizationPercent,
        int activeBookingsCount
) {}
