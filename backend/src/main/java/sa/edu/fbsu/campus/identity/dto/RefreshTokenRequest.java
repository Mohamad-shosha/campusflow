package sa.edu.fbsu.campus.identity.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
        @NotBlank(message = "رمز التجديد (Refresh Token) مطلوب")
        String refreshToken
) {
}
