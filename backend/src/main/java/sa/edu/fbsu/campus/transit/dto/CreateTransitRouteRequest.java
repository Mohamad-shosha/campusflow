package sa.edu.fbsu.campus.transit.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import sa.edu.fbsu.campus.transit.domain.TransitRouteStatus;

import java.util.List;

public record CreateTransitRouteRequest(
        @NotBlank(message = "Route code is required")
        @Size(max = 30)
        String routeCode,

        @NotBlank(message = "Arabic route name is required")
        @Size(max = 200)
        String nameAr,

        @NotBlank(message = "English route name is required")
        @Size(max = 200)
        String nameEn,

        @Size(max = 20)
        String colorHex,

        @Size(max = 100)
        String operatingHoursAr,

        @Size(max = 100)
        String operatingHoursEn,

        @Min(1)
        @Max(120)
        Integer frequencyMinutes,

        TransitRouteStatus status,

        Integer displayOrder,

        List<CreateStopRequest> stops
) {
    public record CreateStopRequest(
            @NotBlank @Size(max = 30) String stopCode,
            @NotBlank @Size(max = 200) String nameAr,
            @NotBlank @Size(max = 200) String nameEn,
            @Size(max = 300) String locationDescAr,
            @Size(max = 300) String locationDescEn,
            Integer stopOrder,
            Integer etaMinutesFromStart,
            Boolean hasShelter,
            Boolean hasAc
    ) {}
}

