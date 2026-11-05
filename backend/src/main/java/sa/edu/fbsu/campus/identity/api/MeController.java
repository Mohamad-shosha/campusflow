package sa.edu.fbsu.campus.identity.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.identity.application.ProfileService;
import sa.edu.fbsu.campus.identity.dto.ChangePasswordRequest;
import sa.edu.fbsu.campus.identity.dto.UpdateProfileRequest;
import sa.edu.fbsu.campus.identity.dto.UserProfileResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/me")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "User Profile & Settings", description = "إدارة الملف الشخصي للمستخدم المسجل حالياً وتغيير الإعدادات")
public class MeController {

    private final ProfileService profileService;

    public MeController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    @Operation(summary = "عرض الملف الشخصي", description = "إرجاع كافة بيانات المستخدم وسياراته المسجلة من واقع الـ JWT")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserProfileResponse response = profileService.getProfile(principal.getUserId());
        return ResponseEntity.ok(response);
    }

    @PatchMapping
    @Operation(summary = "تحديث الملف الشخصي", description = "تحديث الاسم ورقم الجوال واللغة والثيم والتخصص")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse response = profileService.updateProfile(principal.getUserId(), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    @Operation(summary = "تغيير كلمة المرور", description = "تغيير كلمة المرور بعد التحقق من صحة كلمة المرور الحالية")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        profileService.changePassword(principal.getUserId(), request);
        return ResponseEntity.ok(Map.of("message", "تم تغيير كلمة المرور بنجاح."));
    }
}

