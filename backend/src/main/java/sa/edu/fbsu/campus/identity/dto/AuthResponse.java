package sa.edu.fbsu.campus.identity.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresInSeconds,
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
