package sa.edu.fbsu.campus.common.audit.application;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.audit.api.AdminAuditResponse;
import sa.edu.fbsu.campus.common.audit.domain.AdminAuditLog;
import sa.edu.fbsu.campus.common.audit.infra.AdminAuditLogRepository;
import sa.edu.fbsu.campus.common.security.UserPrincipal;

import java.util.List;
import java.util.UUID;

@Service
public class AdminAuditService {

    private static final Logger log = LoggerFactory.getLogger(AdminAuditService.class);

    private final AdminAuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    public AdminAuditService(AdminAuditLogRepository auditLogRepository, ObjectMapper objectMapper) {
        this.auditLogRepository = auditLogRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public AdminAuditLog record(
            UUID universityId,
            UserPrincipal actor,
            String action,
            String entityType,
            String entityId,
            String descriptionAr,
            String descriptionEn,
            Object details
    ) {
        String detailsJson = null;
        if (details != null) {
            try {
                detailsJson = objectMapper.writeValueAsString(details);
            } catch (JsonProcessingException e) {
                log.warn("Failed to serialize audit log details for action {}: {}", action, e.getMessage());
                detailsJson = String.valueOf(details);
            }
        }

        UUID actorId = actor != null ? actor.getUserId() : UUID.fromString("00000000-0000-0000-0000-000000000000");
        String actorEmail = actor != null ? actor.getUsername() : "system@fbsu.edu.sa";
        String actorName = actor != null ? actor.getUsername() : "System Administrator";

        AdminAuditLog auditLog = new AdminAuditLog(
                universityId,
                actorId,
                actorEmail,
                actorName,
                action,
                entityType,
                entityId,
                descriptionAr,
                descriptionEn,
                detailsJson
        );

        AdminAuditLog saved = auditLogRepository.save(auditLog);
        log.info("Admin audit event recorded: action={}, entityType={}, entityId={}, actor={}",
                action, entityType, entityId, actorEmail);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<AdminAuditResponse> listAuditLogs(
            UUID universityId,
            String entityType,
            String action,
            int limit
    ) {
        int cappedLimit = Math.min(Math.max(limit, 1), 200);
        PageRequest pageRequest = PageRequest.of(0, cappedLimit);

        List<AdminAuditLog> logs;
        if (entityType != null && !entityType.isBlank()) {
            logs = auditLogRepository.findAllByUniversityIdAndEntityTypeOrderByCreatedAtDesc(
                    universityId, entityType.trim(), pageRequest);
        } else if (action != null && !action.isBlank()) {
            logs = auditLogRepository.findAllByUniversityIdAndActionOrderByCreatedAtDesc(
                    universityId, action.trim(), pageRequest);
        } else {
            logs = auditLogRepository.findAllByUniversityIdOrderByCreatedAtDesc(universityId, pageRequest);
        }

        return logs.stream().map(AdminAuditResponse::fromEntity).toList();
    }
}

