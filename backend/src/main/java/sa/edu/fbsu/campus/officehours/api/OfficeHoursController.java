package sa.edu.fbsu.campus.officehours.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.officehours.application.OfficeHoursService;
import sa.edu.fbsu.campus.officehours.dto.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/office-hours")
@Tag(name = "Faculty Office Hours", description = "Endpoints for faculty office-hour windows and conflict-free student appointments")
public class OfficeHoursController {

    private final OfficeHoursService officeHoursService;

    public OfficeHoursController(OfficeHoursService officeHoursService) {
        this.officeHoursService = officeHoursService;
    }

    @GetMapping("/faculty")
    @Operation(summary = "List faculty members and their current office-hour slots")
    public ResponseEntity<List<FacultyOfficeResponse>> listFaculty() {
        return ResponseEntity.ok(officeHoursService.listFacultyWithSlots());
    }

    @PostMapping("/slots")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Create an office-hour window (faculty manages own windows only)")
    public ResponseEntity<OfficeHourSlotDto> createSlot(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateOfficeHourSlotRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(officeHoursService.createSlot(principal.getUserId(), request));
    }

    @DeleteMapping("/slots/{slotId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete an unbooked office-hour window (faculty manages own windows only)")
    public ResponseEntity<Void> deleteSlot(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID slotId
    ) {
        officeHoursService.deleteSlot(principal.getUserId(), slotId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/appointments")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Book an available faculty office-hour slot without overlap")
    public ResponseEntity<OfficeHourAppointmentResponse> bookAppointment(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody BookOfficeHourRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(officeHoursService.bookAppointment(principal.getUserId(), request));
    }

    @GetMapping("/appointments/my")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List office-hour appointments for the current student or faculty member")
    public ResponseEntity<List<OfficeHourAppointmentResponse>> getMyAppointments(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(officeHoursService.getMyAppointments(principal.getUserId()));
    }

    @PostMapping("/appointments/{appointmentId}/cancel")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Cancel an office-hour appointment and reopen the slot")
    public ResponseEntity<OfficeHourAppointmentResponse> cancelAppointment(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID appointmentId
    ) {
        return ResponseEntity.ok(officeHoursService.cancelAppointment(principal.getUserId(), appointmentId));
    }
}
