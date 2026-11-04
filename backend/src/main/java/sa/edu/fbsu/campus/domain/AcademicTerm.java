package sa.edu.fbsu.campus.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
    name = "academic_term",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_academic_term_tenant_code", columnNames = {"university_id", "code"})
    }
)
public class AcademicTerm extends BaseTenantEntity {

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "name_ar", nullable = false, length = 255)
    private String nameAr;

    @Column(name = "name_en", nullable = false, length = 255)
    private String nameEn;

    @Column(name = "starts_at", nullable = false)
    private LocalDate startsAt;

    @Column(name = "ends_at", nullable = false)
    private LocalDate endsAt;

    @Column(name = "is_current", nullable = false)
    private boolean current = false;

    public AcademicTerm() {
    }

    public AcademicTerm(UUID universityId, String code, String nameAr, String nameEn, LocalDate startsAt, LocalDate endsAt, boolean current) {
        setUniversityId(universityId);
        this.code = code;
        this.nameAr = nameAr;
        this.nameEn = nameEn;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.current = current;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNameAr() {
        return nameAr;
    }

    public void setNameAr(String nameAr) {
        this.nameAr = nameAr;
    }

    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public LocalDate getStartsAt() {
        return startsAt;
    }

    public void setStartsAt(LocalDate startsAt) {
        this.startsAt = startsAt;
    }

    public LocalDate getEndsAt() {
        return endsAt;
    }

    public void setEndsAt(LocalDate endsAt) {
        this.endsAt = endsAt;
    }

    public boolean isCurrent() {
        return current;
    }

    public void setCurrent(boolean current) {
        this.current = current;
    }
}
