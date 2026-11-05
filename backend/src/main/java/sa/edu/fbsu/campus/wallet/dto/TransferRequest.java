package sa.edu.fbsu.campus.wallet.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Schema(description = "Peer-to-Peer Campus Balance Transfer Request")
public record TransferRequest(
        @NotBlank(message = "Recipient identification (university number or email) is required")
        @Schema(description = "Recipient university ID number or email", example = "STD-202410102")
        String recipientIdentifier,

        @NotNull(message = "Transfer amount is required")
        @DecimalMin(value = "1.00", message = "Minimum transfer amount is 1.00 SAR")
        @Schema(description = "Amount in SAR to transfer", example = "50.00")
        BigDecimal amount,

        @NotBlank(message = "Idempotency key is required")
        @Size(min = 8, max = 100, message = "Idempotency key must be between 8 and 100 characters")
        @Schema(description = "Unique transfer idempotency key", example = "transfer-idem-1730825000")
        String idempotencyKey,

        @Schema(description = "Transfer memo or note", example = "Tutoring study session contribution")
        String description
) {
}
