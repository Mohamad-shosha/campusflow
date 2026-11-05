package sa.edu.fbsu.campus.wallet.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Schema(description = "Wallet Balance Top-Up Request")
public record TopUpRequest(
        @NotNull(message = "Amount is required")
        @DecimalMin(value = "1.00", message = "Minimum top-up amount is 1.00 SAR")
        @Schema(description = "Amount in SAR to credit to wallet", example = "100.00")
        BigDecimal amount,

        @NotBlank(message = "Idempotency key is required")
        @Size(min = 8, max = 100, message = "Idempotency key must be between 8 and 100 characters")
        @Schema(description = "Unique client transaction idempotency token", example = "topup-idem-1730825000")
        String idempotencyKey,

        @Schema(description = "Source payment method or simulated gateway", example = "MADA")
        String paymentMethod,

        @Schema(description = "Transaction note or label", example = "Semester parking allowance top-up")
        String description
) {
}
