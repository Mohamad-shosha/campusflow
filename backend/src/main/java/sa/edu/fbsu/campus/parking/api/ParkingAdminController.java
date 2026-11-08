package sa.edu.fbsu.campus.parking.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.parking.application.ParkingAdminService;
import sa.edu.fbsu.campus.parking.dto.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/parking")
@Tag(name = "Admin Parking", description = "Privileged smart parking management guarded by CAMPUS_ADMIN")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('CAMPUS_ADMIN')")
public class ParkingAdminController {

    private final ParkingAdminService adminService;

    public ParkingAdminController(ParkingAdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/spots")
    @Operation(summary = "List all parking spots", description = "Returns all parking spots with zone and occupancy details")
    public ResponseEntity<List<ParkingSpotResponse>> getAllSpots(@AuthenticationPrincipal UserPrincipal principal) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.listAllSpots(uniId));
    }

    @PatchMapping("/spots/{id}/status")
    @Operation(summary = "Update spot status", description = "Updates spot status (e.g. MAINTENANCE, AVAILABLE) and logs action")
    public ResponseEntity<ParkingSpotResponse> updateSpotStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSpotStatusRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.updateSpotStatus(uniId, id, request.status(), request.reason(), principal));
    }

    @PatchMapping("/spots/{id}/type")
    @Operation(summary = "Update spot type", description = "Updates spot type (e.g. EV_CHARGING, ACCESSIBLE) and flex eligibility")
    public ResponseEntity<ParkingSpotResponse> updateSpotType(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSpotTypeRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.updateSpotType(uniId, id, request.spotType(), request.flexEligible(), principal));
    }

    @GetMapping("/tariffs")
    @Operation(summary = "List parking tariffs", description = "Returns active parking tariffs for all user roles")
    public ResponseEntity<List<ParkingTariffResponse>> getTariffs(@AuthenticationPrincipal UserPrincipal principal) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.listTariffs(uniId));
    }

    @PutMapping("/tariffs/{userType}")
    @Operation(summary = "Update tariff", description = "Updates parking tariff rates for specified user type")
    public ResponseEntity<ParkingTariffResponse> updateTariff(
            @PathVariable UserType userType,
            @Valid @RequestBody UpdateTariffRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.updateTariff(uniId, userType, request, principal));
    }

    private UUID resolveUniversityId(UserPrincipal principal) {
        return principal != null && principal.getUniversityId() != null
                ? principal.getUniversityId()
                : UUID.fromString("00000000-0000-0000-0000-000000000001");
    }
}

