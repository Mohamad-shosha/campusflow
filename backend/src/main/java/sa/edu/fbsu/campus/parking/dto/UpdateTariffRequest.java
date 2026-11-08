package sa.edu.fbsu.campus.parking.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record UpdateTariffRequest(
        @NotNull(message = "Hourly rate is required")
        @DecimalMin(value = "0.00", message = "Hourly rate must be non-negative")
        BigDecimal hourlyRate,

        @NotNull(message = "Daily cap is required")
        @DecimalMin(value = "0.00", message = "Daily cap must be non-negative")
        BigDecimal dailyCap,

        @NotNull(message = "Flex cashback rate is required")
        @DecimalMin(value = "0.00", message = "Flex cashback rate must be non-negative")
        BigDecimal flexCashbackRate
) {}

