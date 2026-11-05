package sa.edu.fbsu.campus.identity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Change Password Request")
public record ChangePasswordRequest(
        @NotBlank(message = "كلمة المرور الحالية مطلوبة")
        @Schema(description = "Current active password", example = "OldSecretPass123!")
        String currentPassword,

        @NotBlank(message = "كلمة المرور الجديدة مطلوبة")
        @Size(min = 8, message = "كلمة المرور الجديدة يجب ألا تقل عن 8 خانات")
        @Schema(description = "New secure password", example = "NewSecretPass456!")
        String newPassword
) {
}

