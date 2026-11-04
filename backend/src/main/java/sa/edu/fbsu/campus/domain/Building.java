package sa.edu.fbsu.campus.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;

import java.util.UUID;

@Entity
@Table(
    name = "building",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_building_tenant_code", columnNames = {"university_id", "code"})
    }
)
public class Building extends BaseTenantEntity {

    @Column(name = "code", nullable = false, length = 50)
    private String code;

    @Column(name = "name_ar", nullable = false, length = 255)
    private String nameAr;

    @Column(name = "name_en", nullable = false, length = 255)
    private String nameEn;

    @Column(name = "floors", nullable = false)
    private int floors = 1;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    public Building() {
    }

    public Building(UUID universityId, String code, String nameAr, String nameEn, int floors) {
        setUniversityId(universityId);
        this.code = code;
        this.nameAr = nameAr;
        this.nameEn = nameEn;
        this.floors = floors;
        this.active = true;
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

    public int getFloors() {
        return floors;
    }

    public void setFloors(int floors) {
        this.floors = floors;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
