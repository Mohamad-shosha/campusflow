package sa.edu.fbsu.campus.wallet.tuition.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.wallet.domain.LedgerEntry;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(
        name = "tuition_receipt",
        indexes = {
                @Index(name = "idx_tuition_receipt_invoice", columnList = "invoice_id"),
                @Index(name = "idx_tuition_receipt_payer", columnList = "payer_user_id"),
                @Index(name = "idx_tuition_receipt_code", columnList = "verification_code")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_receipt_number", columnNames = {"receipt_number"}),
                @UniqueConstraint(name = "uq_receipt_verification_code", columnNames = {"verification_code"})
        }
)
public class TuitionReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "invoice_id", nullable = false)
    private TuitionInvoice invoice;

    @Column(name = "receipt_number", nullable = false, length = 50)
    private String receiptNumber;

    @Column(name = "amount_paid", nullable = false, precision = 12, scale = 2)
    private BigDecimal amountPaid;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ledger_entry_id", nullable = false)
    private LedgerEntry ledgerEntry;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payer_user_id", nullable = false)
    private User payer;

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod = "DIGITAL_WALLET";

    @Column(name = "verification_code", nullable = false, length = 100)
    private String verificationCode;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected TuitionReceipt() {
    }

    public TuitionReceipt(
            TuitionInvoice invoice,
            String receiptNumber,
            BigDecimal amountPaid,
            LedgerEntry ledgerEntry,
            User payer,
            String paymentMethod,
            String verificationCode
    ) {
        this.invoice = Objects.requireNonNull(invoice, "Invoice cannot be null");
        this.receiptNumber = Objects.requireNonNull(receiptNumber, "ReceiptNumber cannot be null");
        this.amountPaid = Objects.requireNonNull(amountPaid, "AmountPaid cannot be null");
        this.ledgerEntry = Objects.requireNonNull(ledgerEntry, "LedgerEntry cannot be null");
        this.payer = Objects.requireNonNull(payer, "Payer cannot be null");
        this.paymentMethod = (paymentMethod != null && !paymentMethod.isBlank()) ? paymentMethod : "DIGITAL_WALLET";
        this.verificationCode = Objects.requireNonNull(verificationCode, "VerificationCode cannot be null");
        this.createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public TuitionInvoice getInvoice() {
        return invoice;
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    public LedgerEntry getLedgerEntry() {
        return ledgerEntry;
    }

    public User getPayer() {
        return payer;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}

