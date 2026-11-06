package sa.edu.fbsu.campus.parking.api;

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
import sa.edu.fbsu.campus.parking.application.FlexShareService;
import sa.edu.fbsu.campus.parking.dto.CreateFlexOfferRequest;
import sa.edu.fbsu.campus.parking.dto.FlexOfferResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/parking/flex")
@Tag(name = "Flex-Share Parking Exchange", description = "Endpoints for sharing bays during breaks, peer claiming, and cashback rewards")
public class FlexShareController {

    private final FlexShareService flexShareService;
    private final UniversityRepository universityRepository;

    public FlexShareController(FlexShareService flexShareService, UniversityRepository universityRepository) {
        this.flexShareService = flexShareService;
        this.universityRepository = universityRepository;
    }

    @PostMapping("/offers")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Offer current parking bay for peer exchange during lectures/breaks")
    public ResponseEntity<FlexOfferResponse> createOffer(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateFlexOfferRequest request) {
        FlexOfferResponse response = flexShareService.createOffer(principal.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/offers")
    @Operation(summary = "List all active Flex-Share offers available for peer claiming")
    public ResponseEntity<List<FlexOfferResponse>> getActiveOffers(
            @AuthenticationPrincipal UserPrincipal principal) {
        UUID uniId = principal != null && principal.getUniversityId() != null
                ? principal.getUniversityId()
                : universityRepository.findByCode("FBSU")
                .map(University::getId)
                .orElseThrow(() -> new ResourceNotFoundException("FBSU university not configured"));

        return ResponseEntity.ok(flexShareService.getActiveOffers(uniId));
    }

    @PostMapping("/offers/{offerId}/claim")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Claim an available Flex-Share spot and automatically reward the original owner")
    public ResponseEntity<FlexOfferResponse> claimOffer(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID offerId) {
        return ResponseEntity.ok(flexShareService.claimOffer(principal.getUserId(), offerId));
    }

    @PostMapping("/offers/{offerId}/cancel")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Cancel an unclaimed Flex-Share offer")
    public ResponseEntity<FlexOfferResponse> cancelOffer(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID offerId) {
        return ResponseEntity.ok(flexShareService.cancelOffer(principal.getUserId(), offerId));
    }

    @GetMapping("/my-offers")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get all Flex-Share offers created by the authenticated user")
    public ResponseEntity<List<FlexOfferResponse>> getMyOffers(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(flexShareService.getMyOffers(principal.getUserId()));
    }
}

