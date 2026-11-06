package sa.edu.fbsu.campus.parking.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
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

        Instant endTime,

        Boolean autoDebitWallet,

        @NotBlank(message = "Idempotency key is required")
        String idempotencyKey
) {
    public CreateBookingRequest {
        if (startTime == null) {
            startTime = Instant.now();
        }
        if (durationHours == null) {
            if (endTime != null && endTime.isAfter(startTime)) {
                long minutes = Duration.between(startTime, endTime).toMinutes();
                double hours = Math.max(0.5, Math.min(12.0, minutes / 60.0));
                durationHours = BigDecimal.valueOf(hours).setScale(1, RoundingMode.HALF_UP);
            } else {
                durationHours = new BigDecimal("3.0");
            }
        }
        if (endTime == null) {
            long durationMinutes = durationHours.multiply(BigDecimal.valueOf(60)).longValue();
            endTime = startTime.plus(Duration.ofMinutes(durationMinutes));
        }
        if (autoDebitWallet == null) {
            autoDebitWallet = Boolean.TRUE;
        }
    }

    public CreateBookingRequest(
            UUID spotId,
            UUID vehicleId,
            BigDecimal durationHours,
            Instant startTime,
            boolean autoDebitWallet,
            String idempotencyKey
    ) {
        this(spotId, vehicleId, durationHours, startTime, null, autoDebitWallet, idempotencyKey);
    }
}
