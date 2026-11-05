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
@Tag(name = "Authentication & Identity", description = "بوابة تسجيل الدخول والهوية الجامعية وإدارة التوكنات")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "تسجيل مستخدم جديد", description = "إنشاء حساب طالب أو عضو هيئة تدريس مع إمكانية تسجيل سيارة")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "تسجيل الدخول", description = "تسجيل الدخول بالرقم الجامعي أو البريد الإلكتروني وإصدار JWT")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "تجديد التوكن", description = "تدوير رمز التجديد وإصدار Access Token جديد")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    @Operation(summary = "تسجيل الخروج", description = "إبطال جميع رموز التجديد للمستخدم الحالي")
    public ResponseEntity<Map<String, String>> logout(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal != null) {
            authService.logout(principal.getUserId());
        }
        return ResponseEntity.ok(Map.of("message", "تم تسجيل الخروج بنجاح وإبطال الجلسة."));
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "BearerAuth")
    @Operation(summary = "بيانات الجلسة الحالية", description = "إرجاع بيانات ومعرفات المستخدم المسجل حالياً من واقع الـ JWT")
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
    @Operation(summary = "فحص صلاحية المدير", description = "محمي بدور CAMPUS_ADMIN للتأكد من عمل الـ RBAC")
    public ResponseEntity<Map<String, String>> adminOnlyEndpoint() {
        return ResponseEntity.ok(Map.of("status", "ACCESS_GRANTED", "scope", "CAMPUS_ADMIN_PANEL"));
    }
}
