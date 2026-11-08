package sa.edu.fbsu.campus.rooms.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.rooms.application.RoomsAdminService;
import sa.edu.fbsu.campus.rooms.dto.CreateRoomRequest;
import sa.edu.fbsu.campus.rooms.dto.StudyRoomResponse;
import sa.edu.fbsu.campus.rooms.dto.UpdateRoomRequest;
import sa.edu.fbsu.campus.rooms.dto.UpdateRoomStatusRequest;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/rooms")
@Tag(name = "Admin Rooms", description = "Privileged campus rooms and labs management guarded by CAMPUS_ADMIN")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('CAMPUS_ADMIN')")
public class RoomsAdminController {

    private final RoomsAdminService adminService;

    public RoomsAdminController(RoomsAdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    @Operation(summary = "List all study rooms and labs", description = "Returns all rooms including maintenance status")
    public ResponseEntity<List<StudyRoomResponse>> getAllRooms(@AuthenticationPrincipal UserPrincipal principal) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.listAllRooms(uniId));
    }

    @PostMapping
    @Operation(summary = "Create study room or lab", description = "Adds a new room or lab to campus inventory")
    public ResponseEntity<StudyRoomResponse> createRoom(
            @Valid @RequestBody CreateRoomRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID uniId = resolveUniversityId(principal);
        StudyRoomResponse created = adminService.createRoom(uniId, request, principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update study room", description = "Updates room details, capacity, specs, or display order")
    public ResponseEntity<StudyRoomResponse> updateRoom(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRoomRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.updateRoom(uniId, id, request, principal));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update room status", description = "Quickly sets room status (AVAILABLE, MAINTENANCE, etc.)")
    public ResponseEntity<StudyRoomResponse> updateRoomStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRoomStatusRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(adminService.updateRoomStatus(uniId, id, request.status(), request.reason(), principal));
    }

    private UUID resolveUniversityId(UserPrincipal principal) {
        return principal != null && principal.getUniversityId() != null
                ? principal.getUniversityId()
                : UUID.fromString("00000000-0000-0000-0000-000000000001");
    }
}

