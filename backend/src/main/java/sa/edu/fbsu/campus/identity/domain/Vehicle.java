package sa.edu.fbsu.campus.identity.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;

import java.util.UUID;

@Entity
@Table(
    name = "vehicle",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_vehicle_tenant_plate", columnNames = {"university_id", "plate_letters_ar", "plate_digits"})
    }
)
public class Vehicle extends BaseTenantEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Embedded
    private SaudiPlate plate;

    @Column(name = "make_model", length = 100)
    private String makeModel;

    @Column(name = "color", length = 50)
    private String color;

    @Column(name = "is_primary", nullable = false)
    private boolean primary = true;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    public Vehicle() {
    }

    public Vehicle(UUID universityId, UUID userId, SaudiPlate plate, String makeModel, String color) {
        setUniversityId(universityId);
        this.userId = userId;
        this.plate = plate;
        this.makeModel = makeModel;
        this.color = color;
        this.primary = true;
        this.active = true;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public SaudiPlate getPlate() {
        return plate;
    }

    public void setPlate(SaudiPlate plate) {
        this.plate = plate;
    }

    public String getMakeModel() {
        return makeModel;
    }

    public void setMakeModel(String makeModel) {
        this.makeModel = makeModel;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public boolean isPrimary() {
        return primary;
    }

    public void setPrimary(boolean primary) {
        this.primary = primary;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}

