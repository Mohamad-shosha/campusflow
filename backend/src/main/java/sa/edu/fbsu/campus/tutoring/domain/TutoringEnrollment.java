package sa.edu.fbsu.campus.tutoring.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;
import sa.edu.fbsu.campus.identity.domain.User;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Entity
@Table(
        name = "tutoring_enrollment",
        uniqueConstraints = {
                @UniqueConstraint(name = "uq_tutoring_session_student", columnNames = {"session_id", "student_user_id"})
        }
)
public class TutoringEnrollment extends BaseTenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private TutoringSession session;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_user_id", nullable = false)
    private User student;

    @Column(name = "amount_paid", nullable = false, precision = 10, scale = 2)
    private BigDecimal amountPaid;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "SAR";

    @Column(name = "idempotency_key", nullable = false, unique = true, length = 100)
    private String idempotencyKey;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TutoringEnrollmentStatus status = TutoringEnrollmentStatus.CONFIRMED;

    protected TutoringEnrollment() {
    }

    public TutoringEnrollment(
            UUID universityId,
            TutoringSession session,
            User student,
            BigDecimal amountPaid,
            String idempotencyKey
    ) {
        setUniversityId(universityId);
        this.session = session;
        this.student = student;
        this.amountPaid = amountPaid.setScale(2, RoundingMode.HALF_UP);
        this.idempotencyKey = idempotencyKey;
        this.status = TutoringEnrollmentStatus.CONFIRMED;
    }

    public TutoringSession getSession() {
        return session;
    }

    public User getStudent() {
        return student;
    }

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    public String getCurrency() {
        return currency;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public TutoringEnrollmentStatus getStatus() {
        return status;
    }

    public void setStatus(TutoringEnrollmentStatus status) {
        this.status = status;
    }
}

