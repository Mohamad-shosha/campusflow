package sa.edu.fbsu.campus.identity.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PasswordServiceTest {

    private PasswordService passwordService;

    @BeforeEach
    void setUp() {
        passwordService = new PasswordService();
    }

    @Test
    @DisplayName("Should hash password with BCrypt cost factor 12")
    void shouldHashPasswordWithBcrypt12() {
        String rawPassword = "FbsuSecurePassword2026!";
        String hash = passwordService.hash(rawPassword);

        assertThat(hash).isNotNull();
        // Standard BCrypt hash prefix with strength 12 is $2a$12$ or $2b$12$
        assertThat(hash).matches("^\\$2[ab]\\$12\\$[./A-Za-z0-9]{53}$");

        // Verification matches
        assertThat(passwordService.matches(rawPassword, hash)).isTrue();
        assertThat(passwordService.matches("WrongPassword", hash)).isFalse();
    }

    @Test
    @DisplayName("Should generate distinct salts for identical plain passwords")
    void shouldGenerateRandomSalt() {
        String rawPassword = "SmartCampusPass123";
        String hash1 = passwordService.hash(rawPassword);
        String hash2 = passwordService.hash(rawPassword);

        assertThat(hash1).isNotEqualTo(hash2);
        assertThat(passwordService.matches(rawPassword, hash1)).isTrue();
        assertThat(passwordService.matches(rawPassword, hash2)).isTrue();
    }

    @Test
    @DisplayName("Should reject empty or null passwords for hashing")
    void shouldRejectEmptyPassword() {
        assertThatThrownBy(() -> passwordService.hash(""))
                .isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> passwordService.hash(null))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Should validate password complexity correctly")
    void shouldValidatePasswordComplexity() {
        // Must contain upper, lower, digit and length >= 8
        assertThat(passwordService.isStrong("Fbsu2026Secure")).isTrue();
        assertThat(passwordService.isStrong("short1A")).isFalse(); // length < 8
        assertThat(passwordService.isStrong("alllowercase123")).isFalse(); // no uppercase
        assertThat(passwordService.isStrong("ALLUPPERCASE123")).isFalse(); // no lowercase
        assertThat(passwordService.isStrong("NoDigitsPassword")).isFalse(); // no digit
    }
}

