package sa.edu.fbsu.campus.transit.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import sa.edu.fbsu.campus.transit.domain.ShuttleStatus;

import java.util.UUID;

public record UpdateShuttleBusRequest(
        ShuttleStatus status,
        UUID routeId,
        UUID currentStopId,
        UUID nextStopId,

        @Min(0)
        @Max(120)
        Integer occupiedSeats,

        @Min(0)
        @Max(100)
        Integer batteryPercentage,

        @Min(0)
        @Max(120)
        Integer nextStopEtaMins,

        @Size(max = 150)
        String driverNameAr,

        @Size(max = 150)
        String driverNameEn,

        @Size(max = 300)
        String reason
) {}

