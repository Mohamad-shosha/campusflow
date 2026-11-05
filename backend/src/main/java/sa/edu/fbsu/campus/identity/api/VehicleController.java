package sa.edu.fbsu.campus.identity.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.identity.application.VehicleService;
import sa.edu.fbsu.campus.identity.dto.CreateVehicleRequest;
import sa.edu.fbsu.campus.identity.dto.UpdateVehicleRequest;
import sa.edu.fbsu.campus.identity.dto.VehicleDto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vehicles")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Vehicles Management", description = "Campus vehicle permits and Saudi license plate operations with IDOR authorization protection")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    @Operation(summary = "List Authenticated User Vehicles", description = "Retrieve all active registered vehicles associated with the current user account")
    public ResponseEntity<List<VehicleDto>> getMyVehicles(@AuthenticationPrincipal UserPrincipal principal) {
        List<VehicleDto> vehicles = vehicleService.getUserVehicles(principal.getUserId());
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Vehicle Details", description = "Retrieve details for a specific registered vehicle with strict user ownership verification")
    public ResponseEntity<VehicleDto> getVehicle(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        VehicleDto vehicle = vehicleService.getVehicleById(principal.getUserId(), id);
        return ResponseEntity.ok(vehicle);
    }

    @PostMapping
    @Operation(summary = "Register New Vehicle", description = "Register a new vehicle with Moroor Saudi license plate validation and uniqueness checks")
    public ResponseEntity<VehicleDto> addVehicle(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateVehicleRequest request) {
        VehicleDto created = vehicleService.addVehicle(principal.getUserId(), principal.getUniversityId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Vehicle", description = "Update vehicle model, color, or primary designation with ownership enforcement")
    public ResponseEntity<VehicleDto> updateVehicle(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateVehicleRequest request) {
        VehicleDto updated = vehicleService.updateVehicle(principal.getUserId(), id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/primary")
    @Operation(summary = "Designate Primary Vehicle", description = "Set vehicle as the primary registered vehicle for automated campus gate access")
    public ResponseEntity<VehicleDto> setPrimary(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        VehicleDto updated = vehicleService.setPrimaryVehicle(principal.getUserId(), id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate Vehicle", description = "Soft-delete and revoke campus gate permit for the specified vehicle")
    public ResponseEntity<Map<String, String>> deleteVehicle(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        vehicleService.deleteVehicle(principal.getUserId(), id);
        return ResponseEntity.ok(Map.of("message", "Vehicle successfully deactivated."));
    }
}

