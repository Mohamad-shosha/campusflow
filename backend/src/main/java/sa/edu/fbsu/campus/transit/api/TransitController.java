package sa.edu.fbsu.campus.transit.api;

import io.swagger.v3.oas.annotations.Operation;
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
import sa.edu.fbsu.campus.transit.application.TransitService;
import sa.edu.fbsu.campus.transit.dto.BookTransitPassRequest;
import sa.edu.fbsu.campus.transit.dto.ShuttleBusResponse;
import sa.edu.fbsu.campus.transit.dto.TransitPassResponse;
import sa.edu.fbsu.campus.transit.dto.TransitRouteResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transit")
@Tag(name = "Transit & Eco-Shuttles", description = "Endpoints for smart campus bus lines, stops, real-time shuttle fleet, and student boarding passes")
public class TransitController {

    private final TransitService transitService;
    private final UniversityRepository universityRepository;

    public TransitController(TransitService transitService, UniversityRepository universityRepository) {
        this.transitService = transitService;
        this.universityRepository = universityRepository;
    }

    @GetMapping("/routes")
    @Operation(summary = "Get all campus transit routes and their ordered stoppage points")
    public ResponseEntity<List<TransitRouteResponse>> getRoutes(
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(transitService.getAllRoutes(uniId));
    }

    @GetMapping("/shuttles/live")
    @Operation(summary = "Get real-time locations, ETAs, battery levels, and seat availability of eco-shuttles")
    public ResponseEntity<List<ShuttleBusResponse>> getLiveShuttles(
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(transitService.getLiveShuttles(uniId));
    }

    @PostMapping("/passes/book")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Issue a digital transit boarding pass with verifiable QR code")
    public ResponseEntity<TransitPassResponse> bookPass(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody BookTransitPassRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transitService.bookBoardingPass(principal.getUserId(), request));
    }

    @GetMapping("/passes/my")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List current student's active and previous transit boarding passes")
    public ResponseEntity<List<TransitPassResponse>> getMyPasses(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(transitService.getMyPasses(principal.getUserId()));
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

