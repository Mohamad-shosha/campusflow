package sa.edu.fbsu.campus.transit.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.transit.application.TransitAdminService;
import sa.edu.fbsu.campus.transit.dto.CreateShuttleBusRequest;
import sa.edu.fbsu.campus.transit.dto.CreateTransitRouteRequest;
import sa.edu.fbsu.campus.transit.dto.ShuttleBusResponse;
import sa.edu.fbsu.campus.transit.dto.TransitRouteResponse;
import sa.edu.fbsu.campus.transit.dto.UpdateShuttleBusRequest;
import sa.edu.fbsu.campus.transit.dto.UpdateTransitRouteStatusRequest;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/transit")
@Tag(name = "Admin Transit", description = "Privileged campus transit routes and eco-shuttle fleet console guarded by CAMPUS_ADMIN")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('CAMPUS_ADMIN')")
public class TransitAdminController {

    private final TransitAdminService adminService;
    private final UniversityRepository universityRepository;

    public TransitAdminController(TransitAdminService adminService, UniversityRepository universityRepository) {
        this.adminService = adminService;
        this.universityRepository = universityRepository;
    }

    @GetMapping("/routes")
    @Operation(summary = "List all transit routes including retired/inactive lines")
    public ResponseEntity<List<TransitRouteResponse>> listRoutes(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.listAllRoutes(uniId));
    }

    @PostMapping("/routes")
    @Operation(summary = "Create a manual transit route with optional initial stops")
    public ResponseEntity<TransitRouteResponse> createRoute(
            @Valid @RequestBody CreateTransitRouteRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID uniId = resolveUniversityId(principal);
        TransitRouteResponse created = adminService.createRoute(uniId, request, principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/routes/{id}/status")
    @Operation(summary = "Update transit route lifecycle status (ACTIVE, MAINTENANCE, OFF_PEAK, INACTIVE)")
    public ResponseEntity<TransitRouteResponse> updateRouteStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTransitRouteStatusRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.updateRouteStatus(uniId, id, request, principal));
    }

    @GetMapping("/shuttles")
    @Operation(summary = "List all campus shuttle buses including OUT_OF_SERVICE fleet")
    public ResponseEntity<List<ShuttleBusResponse>> listShuttles(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.listAllShuttles(uniId));
    }

    @PostMapping("/shuttles")
    @Operation(summary = "Register a manual electric/campus shuttle bus")
    public ResponseEntity<ShuttleBusResponse> createShuttle(
            @Valid @RequestBody CreateShuttleBusRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID uniId = resolveUniversityId(principal);
        ShuttleBusResponse created = adminService.createShuttle(uniId, request, principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/shuttles/{id}")
    @Operation(summary = "Update shuttle status, assigned route, stop, occupancy, battery, or ETA")
    public ResponseEntity<ShuttleBusResponse> updateShuttle(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateShuttleBusRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.updateShuttle(uniId, id, request, principal));
    }

    private UUID resolveUniversityId(UserPrincipal principal) {
        if (principal != null && principal.getUniversityId() != null) {
            return principal.getUniversityId();
        }
        return universityRepository.findByCode("FBSU")
                .map(University::getId)
                .orElseThrow(() -> new ResourceNotFoundException("Default university FBSU not found"));
    }
}

