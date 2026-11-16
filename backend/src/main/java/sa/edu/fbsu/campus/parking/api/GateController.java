package sa.edu.fbsu.campus.parking.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.parking.application.GateDecisionService;
import sa.edu.fbsu.campus.parking.application.GateHistoryService;
import sa.edu.fbsu.campus.parking.dto.GateDecisionResponse;
import sa.edu.fbsu.campus.parking.dto.GateEventPageResponse;
import sa.edu.fbsu.campus.parking.dto.GateScanRequest;


@RestController
@RequestMapping("/api/v1/parking/gate")
@Tag(name = "Gate Barrier & ALPR Decision Engine", description = "Endpoints for camera plate scanning, access verification, and barrier opening decisions")
public class GateController {

    private final GateDecisionService gateDecisionService;
    private final GateHistoryService gateHistoryService;

    public GateController(
            GateDecisionService gateDecisionService,
            GateHistoryService gateHistoryService) {
        this.gateDecisionService = gateDecisionService;
        this.gateHistoryService = gateHistoryService;
    }

    @GetMapping("/events")
    @PreAuthorize("hasAnyRole('SECURITY_OFFICER', 'CAMPUS_ADMIN')")
    @Operation(summary = "Recorded gate scan decisions for the caller's university, newest first",
            description = "Restricted to SECURITY_OFFICER and CAMPUS_ADMIN because results include license plates. "
                    + "Optional decision filter: GRANTED or DENIED. size is 1-100.")
    public ResponseEntity<GateEventPageResponse> getEvents(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String decision) {
        return ResponseEntity.ok(gateHistoryService.getEvents(principal.getUniversityId(), page, size, decision));
    }

    @PostMapping("/scan")
    @PreAuthorize("hasAnyRole('SECURITY_OFFICER', 'CAMPUS_ADMIN')")
    @Operation(summary = "Evaluate vehicle license plate at barrier entrance and decide whether to open barrier")
    public ResponseEntity<GateDecisionResponse> scanPlate(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody GateScanRequest request) {
        return ResponseEntity.ok(gateDecisionService.evaluateScan(principal.getUniversityId(), request));
    }
}

