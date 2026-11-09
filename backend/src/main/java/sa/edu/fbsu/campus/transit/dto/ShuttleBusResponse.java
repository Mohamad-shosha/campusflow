package sa.edu.fbsu.campus.transit.dto;

import sa.edu.fbsu.campus.transit.domain.ShuttleBus;
import sa.edu.fbsu.campus.transit.domain.ShuttleStatus;

import java.util.UUID;

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
        int batteryPercentage
) {
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
                bus.getBatteryPercentage()
        );
    }
}
