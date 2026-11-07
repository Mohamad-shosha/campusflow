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
import sa.edu.fbsu.campus.tutoring.application.TutoringService;
import sa.edu.fbsu.campus.tutoring.dto.CreateTutoringSessionRequest;
import sa.edu.fbsu.campus.tutoring.dto.TutoringSessionResponse;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tutoring")
@Tag(name = "Peer Tutoring Marketplace", description = "Endpoints for listing, filtering, and publishing student peer tutoring sessions")
public class TutoringController {

    private final TutoringService tutoringService;

    public TutoringController(TutoringService tutoringService) {
        this.tutoringService = tutoringService;
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
}

