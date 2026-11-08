package sa.edu.fbsu.campus.identity.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.identity.application.UserAdminService;
import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.UserStatus;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.dto.AdminUserResponse;
import sa.edu.fbsu.campus.identity.dto.UpdateUserRolesRequest;
import sa.edu.fbsu.campus.identity.dto.UpdateUserStatusRequest;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/users")
@Tag(name = "Admin Users", description = "Privileged user account and RBAC management guarded by CAMPUS_ADMIN")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('CAMPUS_ADMIN')")
public class UserAdminController {

    private final UserAdminService adminService;

    public UserAdminController(UserAdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    @Operation(summary = "List campus users", description = "Searches and filters users by role, type, status, or keyword")
    public ResponseEntity<List<AdminUserResponse>> getUsers(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) UserType userType,
            @RequestParam(required = false) UserStatus status
    ) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.listUsers(uniId, search, role, userType, status));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update user status", description = "Activates or suspends a user account")
    public ResponseEntity<AdminUserResponse> updateUserStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserStatusRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.updateUserStatus(uniId, id, request.status(), request.reason(), principal));
    }

    @PatchMapping("/{id}/roles")
    @Operation(summary = "Update user roles", description = "Modifies security roles assigned to user")
    public ResponseEntity<AdminUserResponse> updateUserRoles(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRolesRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.updateUserRoles(uniId, id, request.roles(), principal));
    }

    private UUID resolveUniversityId(UserPrincipal principal) {
        return principal != null && principal.getUniversityId() != null
                ? principal.getUniversityId()
                : UUID.fromString("00000000-0000-0000-0000-000000000001");
    }
}

