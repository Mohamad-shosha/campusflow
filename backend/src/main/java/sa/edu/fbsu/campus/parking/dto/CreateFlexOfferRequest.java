package sa.edu.fbsu.campus.parking.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;
import java.util.UUID;

public record CreateFlexOfferRequest(
        @NotNull(message = "Spot ID is required")
        UUID spotId,

        @Min(value = 30, message = "Minimum flex exchange duration is 30 minutes")
        @Max(value = 360, message = "Maximum flex exchange duration is 360 minutes (6 hours)")
        int durationMinutes,

        Instant startTime
) {
    public CreateFlexOfferRequest {
        if (durationMinutes <= 0) {
            durationMinutes = 60;
        }
        if (startTime == null) {
            startTime = Instant.now();
        }
    }
}

