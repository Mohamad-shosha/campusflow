package sa.edu.fbsu.campus.identity.api;

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
import sa.edu.fbsu.campus.identity.application.AuthService;
import sa.edu.fbsu.campus.identity.dto.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication & Identity", description = "Institutional Single Sign-On, Authentication & JWT Lifecycle Management")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register New User", description = "Create a new student or faculty profile with optional campus vehicle registration")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "User Authentication", description = "Authenticate with university ID or email and issue access/refresh JWT tokens")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Rotate & Refresh JWT Token", description = "Rotate refresh token and issue a new 15-minute access token")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "User Logout", description = "Revoke and invalidate all active refresh tokens for current authenticated session")
    public ResponseEntity<Map<String, String>> logout(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal != null) {
            authService.logout(principal.getUserId());
        }
        return ResponseEntity.ok(Map.of("message", "User session successfully terminated and tokens revoked."));
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Get Current Session Profile", description = "Retrieve identity, university ID, and authorities of the authenticated session from JWT")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(Map.of(
                "userId", principal.getUserId(),
                "universityId", principal.getUniversityId(),
                "universityNumber", principal.getUniversityNumber(),
                "authorities", principal.getAuthorities()
        ));
    }

    @GetMapping("/admin-check")
    @PreAuthorize("hasRole('CAMPUS_ADMIN')")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "Admin Authority Verification", description = "Privileged endpoint guarded by CAMPUS_ADMIN authority to verify RBAC rules")
    public ResponseEntity<Map<String, String>> adminOnlyEndpoint() {
        return ResponseEntity.ok(Map.of("status", "ACCESS_GRANTED", "scope", "CAMPUS_ADMIN_PANEL"));
    }
}
