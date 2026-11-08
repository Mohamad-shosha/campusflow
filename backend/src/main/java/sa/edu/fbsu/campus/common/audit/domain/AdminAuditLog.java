package sa.edu.fbsu.campus.common.audit.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;

import java.util.UUID;

@Entity
@Table(name = "admin_audit_log")
public class AdminAuditLog extends BaseTenantEntity {

    @Column(name = "actor_id", nullable = false)
    private UUID actorId;

    @Column(name = "actor_email", nullable = false, length = 255)
    private String actorEmail;

    @Column(name = "actor_name", nullable = false, length = 255)
    private String actorName;

    @Column(name = "action", nullable = false, length = 100)
    private String action;

    @Column(name = "entity_type", nullable = false, length = 100)
    private String entityType;

    @Column(name = "entity_id", nullable = false, length = 100)
    private String entityId;

    @Column(name = "description_ar", nullable = false, length = 500)
    private String descriptionAr;

    @Column(name = "description_en", nullable = false, length = 500)
    private String descriptionEn;

    @Column(name = "details_json", columnDefinition = "TEXT")
    private String detailsJson;

    protected AdminAuditLog() {
    }

    public AdminAuditLog(
            UUID universityId,
            UUID actorId,
            String actorEmail,
            String actorName,
            String action,
            String entityType,
            String entityId,
            String descriptionAr,
            String descriptionEn,
            String detailsJson
    ) {
        setUniversityId(universityId);
        this.actorId = actorId;
        this.actorEmail = actorEmail;
        this.actorName = actorName;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.descriptionAr = descriptionAr;
        this.descriptionEn = descriptionEn;
        this.detailsJson = detailsJson;
    }

    public UUID getActorId() {
        return actorId;
    }

    public String getActorEmail() {
        return actorEmail;
    }

    public String getActorName() {
        return actorName;
    }

    public String getAction() {
        return action;
    }

    public String getEntityType() {
        return entityType;
    }

    public String getEntityId() {
        return entityId;
    }

    public String getDescriptionAr() {
        return descriptionAr;
    }

    public String getDescriptionEn() {
        return descriptionEn;
    }

    public String getDetailsJson() {
        return detailsJson;
    }
}

