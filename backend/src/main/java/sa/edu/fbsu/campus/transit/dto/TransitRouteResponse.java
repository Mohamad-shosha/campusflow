package sa.edu.fbsu.campus.transit.dto;

import sa.edu.fbsu.campus.transit.domain.TransitRoute;
import sa.edu.fbsu.campus.transit.domain.TransitRouteStatus;

import java.util.List;
import java.util.UUID;

public record TransitRouteResponse(
        UUID id,
        String routeCode,
        String nameAr,
        String nameEn,
        String colorHex,
        String operatingHoursAr,
        String operatingHoursEn,
        int frequencyMinutes,
        TransitRouteStatus status,
        int displayOrder,
        List<TransitStopResponse> stops
) {
    public static TransitRouteResponse fromEntity(TransitRoute route) {
        if (route == null) return null;
        List<TransitStopResponse> stopResponses = route.getStops() != null
                ? route.getStops().stream().map(TransitStopResponse::fromEntity).toList()
                : List.of();

        return new TransitRouteResponse(
                route.getId(),
                route.getRouteCode(),
                route.getNameAr(),
                route.getNameEn(),
                route.getColorHex(),
                route.getOperatingHoursAr(),
                route.getOperatingHoursEn(),
                route.getFrequencyMinutes(),
                route.getStatus(),
                route.getDisplayOrder(),
                stopResponses
        );
    }
}
