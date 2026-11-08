package sa.edu.fbsu.campus.common.audit.api;

import sa.edu.fbsu.campus.common.audit.domain.AdminAuditLog;

import java.time.Instant;
import java.util.UUID;

public record AdminAuditResponse(
        UUID id,
        UUID actorId,
        String actorEmail,
        String actorName,
        String action,
        String entityType,
        String entityId,
        String descriptionAr,
        String descriptionEn,
        String detailsJson,
        Instant createdAt
) {
    public static AdminAuditResponse fromEntity(AdminAuditLog entity) {
        return new AdminAuditResponse(
                entity.getId(),
                entity.getActorId(),
                entity.getActorEmail(),
                entity.getActorName(),
                entity.getAction(),
                entity.getEntityType(),
                entity.getEntityId(),
                entity.getDescriptionAr(),
                entity.getDescriptionEn(),
                entity.getDetailsJson(),
                entity.getCreatedAt()
        );
    }
}

