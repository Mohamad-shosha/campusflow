package sa.edu.fbsu.campus.rooms.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.rooms.application.RoomsService;
import sa.edu.fbsu.campus.rooms.dto.BookRoomRequest;
import sa.edu.fbsu.campus.rooms.dto.StudyRoomResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rooms")
@Tag(name = "Study Rooms & Labs", description = "Endpoints for collaborative study pods, labs, live booking windows, and extensions")
public class RoomsController {

    private final RoomsService roomsService;

    public RoomsController(RoomsService roomsService) {
        this.roomsService = roomsService;
    }

    @GetMapping
    @Operation(summary = "List all campus study rooms and specialized labs with current booking status")
    public ResponseEntity<List<StudyRoomResponse>> listRooms() {
        return ResponseEntity.ok(roomsService.listRooms());
    }

    @GetMapping("/{idOrCode}")
    @Operation(summary = "Get detailed information and active session for a specific study room")
    public ResponseEntity<StudyRoomResponse> getRoom(@PathVariable String idOrCode) {
        return ResponseEntity.ok(roomsService.getRoom(idOrCode));
    }

    @PostMapping("/{idOrCode}/book")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Book a study room or specialized lab with conflict checking")
    public ResponseEntity<StudyRoomResponse> bookRoom(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String idOrCode,
            @Valid @RequestBody BookRoomRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roomsService.bookRoom(principal.getUserId(), idOrCode, request));
    }

    @PostMapping("/bookings/{bookingId}/extend")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Extend an active study room booking (+10 minutes, max 3 times)")
    public ResponseEntity<StudyRoomResponse> extendBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID bookingId
    ) {
        return ResponseEntity.ok(roomsService.extendBooking(principal.getUserId(), bookingId));
    }

    @PostMapping("/bookings/{bookingId}/release")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Release a study room early, making it available for immediate booking")
    public ResponseEntity<StudyRoomResponse> releaseBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID bookingId
    ) {
        return ResponseEntity.ok(roomsService.releaseBooking(principal.getUserId(), bookingId));
    }
}

