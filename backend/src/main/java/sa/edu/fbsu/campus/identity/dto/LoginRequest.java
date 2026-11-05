package sa.edu.fbsu.campus.identity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Institutional User Login Credentials")
public record LoginRequest(
        @Schema(description = "Institutional university code", example = "FBSU")
        String universityCode,

        @NotBlank(message = "الرقم الجامعي أو البريد الإلكتروني مطلوب")
        @Schema(description = "University identification number or email", example = "202410123")
        String identifier,

        @NotBlank(message = "كلمة المرور مطلوبة")
        @Schema(description = "User account password", example = "SecretPass123!")
        String password
) {
}
