package sa.edu.fbsu.campus.wallet.tuition.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

@Schema(description = "Tuition Settlement Payment Request")
public record PayTuitionRequest(
        @NotNull(message = "Invoice ID is required")
        @Schema(description = "Tuition invoice unique identifier", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID invoiceId,

        @NotNull(message = "Payment amount is required")
        @DecimalMin(value = "1.00", message = "Minimum payment is 1.00 SAR")
        @Schema(description = "Amount in SAR to settle from wallet", example = "720.00")
        BigDecimal amount,

        @NotBlank(message = "Idempotency key is required")
        @Size(min = 8, max = 100, message = "Idempotency key must be between 8 and 100 characters")
        @Schema(description = "Client transaction idempotency token", example = "pay-tuition-idem-1730826000")
        String idempotencyKey
) {
}

