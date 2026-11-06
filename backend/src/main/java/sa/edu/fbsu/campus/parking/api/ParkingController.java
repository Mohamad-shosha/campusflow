package sa.edu.fbsu.campus.parking.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.parking.application.ParkingService;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.dto.ParkingSpotResponse;
import sa.edu.fbsu.campus.parking.dto.ParkingSummaryResponse;
import sa.edu.fbsu.campus.parking.dto.ParkingTariffResponse;
import sa.edu.fbsu.campus.parking.dto.ParkingZoneResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/parking")
@Tag(name = "Parking Management", description = "Endpoints for parking zones, spots, tariffs, and real-time occupancy")
public class ParkingController {

    private final ParkingService parkingService;
    private final UniversityRepository universityRepository;

    public ParkingController(ParkingService parkingService, UniversityRepository universityRepository) {
        this.parkingService = parkingService;
        this.universityRepository = universityRepository;
    }

    @GetMapping("/zones")
    @Operation(summary = "Get all parking zones with spot occupancy breakdown")
    public ResponseEntity<List<ParkingZoneResponse>> getZones(
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(parkingService.getZones(uniId));
    }

    @GetMapping("/spots")
    @Operation(summary = "Get parking spots with optional filtering by zone code and status")
    public ResponseEntity<List<ParkingSpotResponse>> getSpots(
            @RequestParam(name = "zone", required = false) String zone,
            @RequestParam(name = "status", required = false) SpotStatus status,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(parkingService.getSpots(uniId, zone, status));
    }

    @GetMapping("/spots/{bayNumber}")
    @Operation(summary = "Get specific parking spot details by bay number (1 - 30)")
    public ResponseEntity<ParkingSpotResponse> getSpotByBay(
            @PathVariable int bayNumber,
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(parkingService.getSpotByBay(uniId, bayNumber));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get real-time parking capacity, availability, and occupancy summary")
    public ResponseEntity<ParkingSummaryResponse> getSummary(
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(parkingService.getSummary(uniId));
    }

    @GetMapping("/tariffs")
    @Operation(summary = "Get active parking pricing tariffs and flex cashback rates")
    public ResponseEntity<List<ParkingTariffResponse>> getTariffs(
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID uniId = resolveUniversityId(principal);
        return ResponseEntity.ok(parkingService.getTariffs(uniId));
    }

    private UUID resolveUniversityId(UserPrincipal principal) {
        if (principal != null && principal.getUniversityId() != null) {
            return principal.getUniversityId();
        }
        return universityRepository.findByCode("FBSU")
                .map(University::getId)
                .orElseThrow(() -> new ResourceNotFoundException("Default university tenant FBSU not configured"));
    }
}

