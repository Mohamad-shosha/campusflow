package sa.edu.fbsu.campus.wallet.tuition.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;
import sa.edu.fbsu.campus.domain.AcademicTerm;
import sa.edu.fbsu.campus.identity.domain.User;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(
        name = "tuition_invoice",
        indexes = {
                @Index(name = "idx_tuition_invoice_student", columnList = "student_id"),
                @Index(name = "idx_tuition_invoice_term", columnList = "term_id"),
                @Index(name = "idx_tuition_invoice_status", columnList = "status")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_invoice_number", columnNames = {"invoice_number"})
        }
)
public class TuitionInvoice extends BaseTenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "term_id", nullable = false)
    private AcademicTerm term;

    @Column(name = "invoice_number", nullable = false, length = 50)
    private String invoiceNumber;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal paidAmount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private InvoiceStatus status = InvoiceStatus.UNPAID;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    protected TuitionInvoice() {
    }

    public TuitionInvoice(
            UUID universityId,
            User student,
            AcademicTerm term,
            String invoiceNumber,
            BigDecimal totalAmount,
            LocalDate dueDate
    ) {
        setUniversityId(universityId);
        this.student = Objects.requireNonNull(student, "Student cannot be null");
        this.term = Objects.requireNonNull(term, "Term cannot be null");
        this.invoiceNumber = Objects.requireNonNull(invoiceNumber, "InvoiceNumber cannot be null");
        this.totalAmount = Objects.requireNonNull(totalAmount, "TotalAmount cannot be null").setScale(2, RoundingMode.HALF_UP);
        this.paidAmount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        this.status = InvoiceStatus.UNPAID;
        this.dueDate = Objects.requireNonNull(dueDate, "DueDate cannot be null");
    }

    public BigDecimal getRemainingAmount() {
        return totalAmount.subtract(paidAmount).setScale(2, RoundingMode.HALF_UP);
    }

    public void applyPayment(BigDecimal amount) {
        Objects.requireNonNull(amount, "Payment amount cannot be null");
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Payment amount must be positive: " + amount);
        }
        BigDecimal remaining = getRemainingAmount();
        if (amount.compareTo(remaining) > 0) {
            throw new IllegalArgumentException(String.format(
                    "Payment amount %s exceeds remaining invoice balance %s", amount, remaining
            ));
        }

        this.paidAmount = this.paidAmount.add(amount).setScale(2, RoundingMode.HALF_UP);
        if (this.paidAmount.compareTo(this.totalAmount) >= 0) {
            this.status = InvoiceStatus.PAID;
        } else {
            this.status = InvoiceStatus.PARTIALLY_PAID;
        }
    }

    public User getStudent() {
        return student;
    }

    public AcademicTerm getTerm() {
        return term;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public BigDecimal getPaidAmount() {
        return paidAmount;
    }

    public InvoiceStatus getStatus() {
        return status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }
}

