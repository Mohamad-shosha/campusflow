package sa.edu.fbsu.campus.tutoring.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.tutoring.application.TutoringBookingService;
import sa.edu.fbsu.campus.tutoring.application.TutoringService;
import sa.edu.fbsu.campus.tutoring.dto.BookTutoringRequest;
import sa.edu.fbsu.campus.tutoring.dto.CreateTutoringSessionRequest;
import sa.edu.fbsu.campus.tutoring.dto.SubmitTutoringReviewRequest;
import sa.edu.fbsu.campus.tutoring.dto.TutoringEnrollmentResponse;
import sa.edu.fbsu.campus.tutoring.dto.TutoringSessionResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tutoring")
@Tag(name = "Peer Tutoring Marketplace", description = "Endpoints for listing, filtering, publishing, and booking student peer tutoring sessions")
public class TutoringController {

    private final TutoringService tutoringService;
    private final TutoringBookingService bookingService;

    public TutoringController(
            TutoringService tutoringService,
            TutoringBookingService bookingService
    ) {
        this.tutoringService = tutoringService;
        this.bookingService = bookingService;
    }

    @GetMapping("/sessions")
    @Operation(summary = "List available peer tutoring sessions with optional category filtering")
    public ResponseEntity<List<TutoringSessionResponse>> listSessions(
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(tutoringService.listSessions(category));
    }

    @GetMapping("/sessions/{idOrCode}")
    @Operation(summary = "Get detailed peer tutoring session by UUID or session code")
    public ResponseEntity<TutoringSessionResponse> getSession(
            @PathVariable String idOrCode
    ) {
        return ResponseEntity.ok(tutoringService.getSession(idOrCode));
    }

    @PostMapping("/sessions")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Publish a new peer tutoring session (restricted to eligible students and campus admins)")
    public ResponseEntity<TutoringSessionResponse> createSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateTutoringSessionRequest request
    ) {
        TutoringSessionResponse created = tutoringService.createSession(principal.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/sessions/{idOrCode}/book")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Enroll in a peer tutoring session with atomic wallet transfer to the student tutor")
    public ResponseEntity<TutoringEnrollmentResponse> bookSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String idOrCode,
            @Valid @RequestBody(required = false) BookTutoringRequest request
    ) {
        TutoringEnrollmentResponse booked = bookingService.bookSession(principal.getUserId(), idOrCode, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(booked);
    }

    @GetMapping("/enrollments/my")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List peer tutoring enrollments for the current authenticated student")
    public ResponseEntity<List<TutoringEnrollmentResponse>> getMyEnrollments(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(bookingService.getMyEnrollments(principal.getUserId()));
    }

    @PostMapping("/sessions/{idOrCode}/reviews")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Submit a verified 1-5 star peer review for an enrolled tutoring session")
    public ResponseEntity<TutoringSessionResponse> submitReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String idOrCode,
            @Valid @RequestBody SubmitTutoringReviewRequest request
    ) {
        TutoringSessionResponse updated = tutoringService.submitReview(principal.getUserId(), idOrCode, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(updated);
    }
}
