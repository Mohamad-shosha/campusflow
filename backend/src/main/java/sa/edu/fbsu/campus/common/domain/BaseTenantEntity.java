package sa.edu.fbsu.campus.common.domain;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import java.util.UUID;

@MappedSuperclass
public abstract class BaseTenantEntity extends BaseEntity {

    @Column(name = "university_id", nullable = false)
    private UUID universityId;

    public UUID getUniversityId() {
        return universityId;
    }

    public void setUniversityId(UUID universityId) {
        this.universityId = universityId;
    }
}
