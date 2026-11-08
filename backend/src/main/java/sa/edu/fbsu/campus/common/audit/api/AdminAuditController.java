package sa.edu.fbsu.campus.common.audit.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import sa.edu.fbsu.campus.common.audit.application.AdminAuditService;
import sa.edu.fbsu.campus.common.security.UserPrincipal;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/audit-logs")
@Tag(name = "Admin Audit Logs", description = "Privileged campus audit trail guarded by CAMPUS_ADMIN")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('CAMPUS_ADMIN')")
public class AdminAuditController {

    private final AdminAuditService auditService;

    public AdminAuditController(AdminAuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    @Operation(summary = "Get Audit Logs", description = "Lists admin operations audit logs with optional filters")
    public ResponseEntity<List<AdminAuditResponse>> getAuditLogs(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String action,
            @RequestParam(defaultValue = "50") int limit
    ) {
        UUID uniId = principal != null && principal.getUniversityId() != null
                ? principal.getUniversityId()
                : UUID.fromString("00000000-0000-0000-0000-000000000001");
        List<AdminAuditResponse> logs = auditService.listAuditLogs(uniId, entityType, action, limit);
        return ResponseEntity.ok(logs);
    }
}

