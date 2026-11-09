package sa.edu.fbsu.campus.transit.dto;

import sa.edu.fbsu.campus.transit.domain.ShuttleBus;
import sa.edu.fbsu.campus.transit.domain.ShuttleStatus;

import java.time.Instant;
import java.util.UUID;

/**
 * Shuttle status as stored in the database. There is no telemetry ingestion yet, so
 * position, occupancy, ETA and battery are the last values written to {@code shuttle_bus}
 * (see {@link #dataSource} and {@link #lastUpdatedAt}); clients must not present them as live.
 */
public record ShuttleBusResponse(
        UUID id,
        UUID routeId,
        String routeCode,
        String routeNameAr,
        String routeNameEn,
        String routeColor,
        String busNumber,
        String plateLettersAr,
        String plateDigits,
        String modelName,
        int totalCapacity,
        int occupiedSeats,
        int availableSeats,
        boolean isElectric,
        String driverNameAr,
        String driverNameEn,
        ShuttleStatus status,
        UUID currentStopId,
        String currentStopNameAr,
        String currentStopNameEn,
        UUID nextStopId,
        String nextStopNameAr,
        String nextStopNameEn,
        int nextStopEtaMins,
        int batteryPercentage,
        /** Provenance of the status fields. Currently always {@value #DATA_SOURCE_STORED}. */
        String dataSource,
        /** When this shuttle record was last written. */
        Instant lastUpdatedAt
) {
    /** Status fields come from the stored shuttle record, not from a live vehicle feed. */
    public static final String DATA_SOURCE_STORED = "STORED_STATUS";

    public static ShuttleBusResponse fromEntity(ShuttleBus bus) {
        if (bus == null) return null;
        return new ShuttleBusResponse(
                bus.getId(),
                bus.getCurrentRoute() != null ? bus.getCurrentRoute().getId() : null,
                bus.getCurrentRoute() != null ? bus.getCurrentRoute().getRouteCode() : null,
                bus.getCurrentRoute() != null ? bus.getCurrentRoute().getNameAr() : null,
                bus.getCurrentRoute() != null ? bus.getCurrentRoute().getNameEn() : null,
                bus.getCurrentRoute() != null ? bus.getCurrentRoute().getColorHex() : "#10b981",
                bus.getBusNumber(),
                bus.getPlateLettersAr(),
                bus.getPlateDigits(),
                bus.getModelName(),
                bus.getTotalCapacity(),
                bus.getOccupiedSeats(),
                bus.getAvailableSeats(),
                bus.isElectric(),
                bus.getDriverNameAr(),
                bus.getDriverNameEn(),
                bus.getStatus(),
                bus.getCurrentStop() != null ? bus.getCurrentStop().getId() : null,
                bus.getCurrentStop() != null ? bus.getCurrentStop().getNameAr() : null,
                bus.getCurrentStop() != null ? bus.getCurrentStop().getNameEn() : null,
                bus.getNextStop() != null ? bus.getNextStop().getId() : null,
                bus.getNextStop() != null ? bus.getNextStop().getNameAr() : null,
                bus.getNextStop() != null ? bus.getNextStop().getNameEn() : null,
                bus.getNextStopEtaMins(),
                bus.getBatteryPercentage(),
                DATA_SOURCE_STORED,
                bus.getUpdatedAt()
        );
    }
}

