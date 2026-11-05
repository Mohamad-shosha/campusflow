package sa.edu.fbsu.campus.wallet.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import sa.edu.fbsu.campus.wallet.domain.LedgerEntry;
import sa.edu.fbsu.campus.wallet.domain.TransactionDirection;
import sa.edu.fbsu.campus.wallet.domain.TransactionType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Schema(description = "Immutable Financial Ledger Audit Transaction")
public record LedgerEntryResponse(
        @Schema(description = "Ledger transaction unique identifier", example = "c8f1e2d3-4a5b-6c7d-8e9f-0a1b2c3d4e5f")
        UUID id,

        @Schema(description = "Campus institutional transaction category", example = "TOP_UP")
        TransactionType transactionType,

        @Schema(description = "Accounting balance change direction", example = "CREDIT")
        TransactionDirection direction,

        @Schema(description = "Transaction nominal amount", example = "100.00")
        BigDecimal amount,

        @Schema(description = "Resulting wallet balance after execution", example = "820.00")
        BigDecimal balanceAfter,

        @Schema(description = "Cryptographic idempotency key", example = "topup-uuid-2026-11-05")
        String idempotencyKey,

        @Schema(description = "Institutional reference identifier", example = "MADA-GATEWAY-TX-987654")
        String referenceId,

        @Schema(description = "Audit transaction description", example = "Mada digital top-up")
        String description,

        @Schema(description = "Timestamp of ledger finalization", example = "2026-11-05T15:45:00Z")
        Instant createdAt
) {
    public static LedgerEntryResponse fromEntity(LedgerEntry entry) {
        return new LedgerEntryResponse(
                entry.getId(),
                entry.getTransactionType(),
                entry.getDirection(),
                entry.getAmount(),
                entry.getBalanceAfter(),
                entry.getIdempotencyKey(),
                entry.getReferenceId(),
                entry.getDescription(),
                entry.getCreatedAt()
        );
    }
}
