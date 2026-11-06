package sa.edu.fbsu.campus.parking.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record CreateBookingRequest(
        @NotNull(message = "Spot ID is required")
        UUID spotId,

        UUID vehicleId,

        @NotNull(message = "Duration in hours is required")
        @DecimalMin(value = "0.5", message = "Minimum booking duration is 0.5 hours (30 minutes)")
        @DecimalMax(value = "12.0", message = "Maximum single booking duration is 12 hours")
        BigDecimal durationHours,

        Instant startTime,

        boolean autoDebitWallet,

        @NotBlank(message = "Idempotency key is required")
        String idempotencyKey
) {
    public CreateBookingRequest {
        if (durationHours == null) {
            durationHours = BigDecimal.ONE;
        }
        if (startTime == null) {
            startTime = Instant.now();
        }
    }
}

