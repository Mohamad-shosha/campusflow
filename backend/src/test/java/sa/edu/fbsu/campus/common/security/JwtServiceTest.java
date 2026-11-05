package sa.edu.fbsu.campus.common.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.UserType;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private JwtService jwtService;
    private final String secretHex = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(secretHex, 15, 7);
    }

    @Test
    @DisplayName("Should generate valid JWT access token and extract all claims accurately")
    void shouldGenerateAndExtractClaims() {
        UUID userId = UUID.randomUUID();
        UUID universityId = UUID.randomUUID();
        String uniNumber = "20241099";

        String token = jwtService.generateAccessToken(
                userId,
                universityId,
                uniNumber,
                Set.of(Role.STUDENT, Role.CAMPUS_ADMIN),
                UserType.STUDENT,
                "ar"
        );

        assertThat(token).isNotBlank();
        assertThat(jwtService.isTokenValid(token)).isTrue();
        assertThat(jwtService.extractUserId(token)).isEqualTo(userId);
        assertThat(jwtService.extractUniversityId(token)).isEqualTo(universityId);
        assertThat(jwtService.extractUniversityNumber(token)).isEqualTo(uniNumber);

        List<String> roles = jwtService.extractRoles(token);
        assertThat(roles).containsExactlyInAnyOrder("ROLE_STUDENT", "ROLE_CAMPUS_ADMIN");
    }

    @Test
    @DisplayName("Should reject tampered or corrupted JWT tokens")
    void shouldRejectTamperedToken() {
        String token = jwtService.generateAccessToken(
                UUID.randomUUID(),
                UUID.randomUUID(),
                "20241010",
                Set.of(Role.STUDENT),
                UserType.STUDENT,
                "ar"
        );

        String tampered = token.substring(0, token.length() - 5) + "abcde";
        assertThat(jwtService.isTokenValid(tampered)).isFalse();
    }
}
