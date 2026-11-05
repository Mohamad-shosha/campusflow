package sa.edu.fbsu.campus.identity.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Authentication Response Payload with JWT Tokens")
public record AuthResponse(
        @Schema(description = "Stateless JWT access token (15-minute expiration)", example = "eyJhbGciOiJIUzUxMiJ9...")
        String accessToken,

        @Schema(description = "Cryptographically secure refresh token (7-day validity)", example = "f81d4fae-7dec-11d0-a765-00a0c91e6bf6")
        String refreshToken,

        @Schema(description = "HTTP Authorization header type", example = "Bearer")
        String tokenType,

        @Schema(description = "Access token validity in seconds", example = "900")
        long expiresInSeconds,

        @Schema(description = "Summary profile of authenticated university member")
        UserSummaryDto user
) {
    public static AuthResponse of(
            String accessToken,
            String refreshToken,
            long expiresInSeconds,
            UserSummaryDto user
    ) {
        return new AuthResponse(accessToken, refreshToken, "Bearer", expiresInSeconds, user);
    }
}
