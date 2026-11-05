package sa.edu.fbsu.campus.wallet.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(
        name = "ledger_entry",
        indexes = {
                @Index(name = "idx_ledger_wallet_created", columnList = "wallet_id, created_at DESC"),
                @Index(name = "idx_ledger_idempotency_key", columnList = "idempotency_key"),
                @Index(name = "idx_ledger_reference_id", columnList = "reference_id")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_ledger_idempotency_key", columnNames = {"idempotency_key"})
        }
)
public class LedgerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "wallet_id", nullable = false, updatable = false)
    private Wallet wallet;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, updatable = false, length = 50)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "direction", nullable = false, updatable = false, length = 10)
    private TransactionDirection direction;

    @Column(name = "amount", nullable = false, updatable = false, precision = 14, scale = 2)
    private BigDecimal amount;

    @Column(name = "balance_after", nullable = false, updatable = false, precision = 14, scale = 2)
    private BigDecimal balanceAfter;

    @Column(name = "idempotency_key", nullable = false, updatable = false, length = 100)
    private String idempotencyKey;

    @Column(name = "reference_id", updatable = false, length = 100)
    private String referenceId;

    @Column(name = "description", nullable = false, updatable = false, length = 255)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected LedgerEntry() {
    }

    public LedgerEntry(
            Wallet wallet,
            TransactionType transactionType,
            TransactionDirection direction,
            BigDecimal amount,
            BigDecimal balanceAfter,
            String idempotencyKey,
            String referenceId,
            String description
    ) {
        this.wallet = Objects.requireNonNull(wallet, "Wallet cannot be null");
        this.transactionType = Objects.requireNonNull(transactionType, "TransactionType cannot be null");
        this.direction = Objects.requireNonNull(direction, "Direction cannot be null");
        this.amount = Objects.requireNonNull(amount, "Amount cannot be null");
        this.balanceAfter = Objects.requireNonNull(balanceAfter, "BalanceAfter cannot be null");
        this.idempotencyKey = Objects.requireNonNull(idempotencyKey, "IdempotencyKey cannot be null");
        this.referenceId = referenceId;
        this.description = Objects.requireNonNull(description, "Description cannot be null");
        this.createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public Wallet getWallet() {
        return wallet;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public TransactionDirection getDirection() {
        return direction;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public BigDecimal getBalanceAfter() {
        return balanceAfter;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public String getDescription() {
        return description;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LedgerEntry that)) return false;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
