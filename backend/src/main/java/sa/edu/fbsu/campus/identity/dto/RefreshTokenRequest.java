package sa.edu.fbsu.campus.identity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Token Refresh Request Payload")
public record RefreshTokenRequest(
        @NotBlank(message = "رمز التجديد مطلوب")
        @Schema(description = "Opaque cryptographically secure refresh token string", example = "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
        String refreshToken
) {
}
