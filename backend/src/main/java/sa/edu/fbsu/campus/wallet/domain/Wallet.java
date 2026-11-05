package sa.edu.fbsu.campus.wallet.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;
import sa.edu.fbsu.campus.identity.domain.User;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(
        name = "wallet",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_wallet_user_currency", columnNames = {"user_id", "currency"})
        }
)
public class Wallet extends BaseTenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "balance", nullable = false, precision = 14, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "SAR";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private WalletStatus status = WalletStatus.ACTIVE;

    protected Wallet() {
    }

    public Wallet(UUID universityId, User user, String currency) {
        setUniversityId(universityId);
        this.user = Objects.requireNonNull(user, "User cannot be null for wallet creation");
        this.currency = (currency != null && !currency.isBlank()) ? currency.toUpperCase() : "SAR";
        this.balance = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        this.status = WalletStatus.ACTIVE;
    }

    public Wallet(UUID universityId, User user, BigDecimal initialBalance, String currency) {
        this(universityId, user, currency);
        if (initialBalance != null && initialBalance.compareTo(BigDecimal.ZERO) > 0) {
            this.balance = initialBalance.setScale(2, RoundingMode.HALF_UP);
        }
    }

    public void credit(BigDecimal amount) {
        Objects.requireNonNull(amount, "Credit amount cannot be null");
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Credit amount must be strictly positive: " + amount);
        }
        if (this.status != WalletStatus.ACTIVE) {
            throw new IllegalStateException("Cannot credit wallet in non-active status: " + this.status);
        }
        this.balance = this.balance.add(amount).setScale(2, RoundingMode.HALF_UP);
    }

    public void debit(BigDecimal amount) {
        Objects.requireNonNull(amount, "Debit amount cannot be null");
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Debit amount must be strictly positive: " + amount);
        }
        if (this.status != WalletStatus.ACTIVE) {
            throw new IllegalStateException("Cannot debit wallet in non-active status: " + this.status);
        }
        if (!hasSufficientBalance(amount)) {
            throw new IllegalStateException(String.format(
                    "Insufficient wallet balance. Required: %s %s, Available: %s %s",
                    amount, this.currency, this.balance, this.currency
            ));
        }
        this.balance = this.balance.subtract(amount).setScale(2, RoundingMode.HALF_UP);
    }

    public boolean hasSufficientBalance(BigDecimal amount) {
        return amount != null && this.balance.compareTo(amount) >= 0;
    }

    public User getUser() {
        return user;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public String getCurrency() {
        return currency;
    }

    public WalletStatus getStatus() {
        return status;
    }

    public void setStatus(WalletStatus status) {
        this.status = status;
    }
}
