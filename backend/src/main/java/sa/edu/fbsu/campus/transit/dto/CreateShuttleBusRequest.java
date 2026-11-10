package sa.edu.fbsu.campus.transit.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import sa.edu.fbsu.campus.transit.domain.ShuttleStatus;

import java.util.UUID;

public record CreateShuttleBusRequest(
        UUID routeId,

        @NotBlank(message = "Bus number is required")
        @Size(max = 30)
        String busNumber,

        @NotBlank(message = "Arabic plate letters are required")
        @Size(max = 20)
        String plateLettersAr,

        @NotBlank(message = "Plate digits are required")
        @Size(max = 10)
        String plateDigits,

        @NotBlank(message = "Model name is required")
        @Size(max = 100)
        String modelName,

        @Min(1)
        @Max(120)
        Integer totalCapacity,

        @Min(0)
        @Max(120)
        Integer occupiedSeats,

        Boolean isElectric,

        @NotBlank(message = "Driver Arabic name is required")
        @Size(max = 150)
        String driverNameAr,

        @NotBlank(message = "Driver English name is required")
        @Size(max = 150)
        String driverNameEn,

        ShuttleStatus status,

        @Min(0)
        @Max(120)
        Integer nextStopEtaMins,

        @Min(0)
        @Max(100)
        Integer batteryPercentage
) {}

