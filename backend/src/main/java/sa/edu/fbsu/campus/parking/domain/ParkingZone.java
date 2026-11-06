package sa.edu.fbsu.campus.parking.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;

import java.util.UUID;

@Entity
@Table(name = "parking_zone")
public class ParkingZone extends BaseTenantEntity {

    @Column(name = "code", nullable = false, length = 20)
    private String code;

    @Column(name = "name_ar", nullable = false)
    private String nameAr;

    @Column(name = "name_en", nullable = false)
    private String nameEn;

    @Column(name = "college_id")
    private UUID collegeId;

    @Column(name = "total_spots", nullable = false)
    private int totalSpots;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    protected ParkingZone() {
    }

    public ParkingZone(UUID universityId, String code, String nameAr, String nameEn, UUID collegeId, int totalSpots) {
        setUniversityId(universityId);
        this.code = code;
        this.nameAr = nameAr;
        this.nameEn = nameEn;
        this.collegeId = collegeId;
        this.totalSpots = totalSpots;
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

    public UUID getCollegeId() {
        return collegeId;
    }

    public void setCollegeId(UUID collegeId) {
        this.collegeId = collegeId;
    }

    public int getTotalSpots() {
        return totalSpots;
    }

    public void setTotalSpots(int totalSpots) {
        this.totalSpots = totalSpots;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

