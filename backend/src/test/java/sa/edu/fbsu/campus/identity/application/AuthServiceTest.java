package sa.edu.fbsu.campus.identity.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import sa.edu.fbsu.campus.common.security.JwtService;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.identity.domain.*;
import sa.edu.fbsu.campus.identity.dto.*;
import sa.edu.fbsu.campus.identity.infra.RefreshTokenRepository;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.identity.infra.VehicleRepository;
import sa.edu.fbsu.campus.infra.UniversityRepository;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private UniversityRepository universityRepository;

    @Mock
    private PasswordService passwordService;

    @Mock
    private JwtService jwtService;

    private AuthService authService;

    private University fbsu;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                userRepository,
                vehicleRepository,
                refreshTokenRepository,
                universityRepository,
                passwordService,
                jwtService
        );

        fbsu = new University("FBSU", "جامعة فهد بن سلطان", "Fahad Bin Sultan University");
        fbsu.setId(UUID.randomUUID());
    }

    @Test
    @DisplayName("Should register new student with vehicle and return valid auth tokens")
    void shouldRegisterUserSuccessfully() {
        RegisterRequest req = new RegisterRequest(
                "FBSU",
                "20261010",
                "tariq@fbsu.edu.sa",
                "StrongPass2026!",
                "طارق بن زياد",
                "Tariq Bin Ziyad",
                UserType.STUDENT,
                "0501234567",
                "ط ر ق",
                "4040",
                "Camry",
                "White"
        );

        when(passwordService.isStrong("StrongPass2026!")).thenReturn(true);
        when(universityRepository.findByCode("FBSU")).thenReturn(Optional.of(fbsu));
        when(userRepository.existsByEmail("tariq@fbsu.edu.sa")).thenReturn(false);
        when(userRepository.existsByUniversityIdAndUniversityNumber(fbsu.getId(), "20261010")).thenReturn(false);
        when(passwordService.hash("StrongPass2026!")).thenReturn("hashed-bcrypt-pass");

        User savedUser = new User(fbsu.getId(), "20261010", "tariq@fbsu.edu.sa", "hashed-bcrypt-pass",
                "طارق بن زياد", "Tariq Bin Ziyad", UserType.STUDENT);
        savedUser.setId(UUID.randomUUID());
        savedUser.addRole(Role.STUDENT);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateAccessToken(any(), any(), any(), any(), any(), any())).thenReturn("mock-access-token");
        when(jwtService.getAccessTokenExpirationSeconds()).thenReturn(900L);
        when(jwtService.getRefreshTokenExpirationDays()).thenReturn(7L);

        AuthResponse resp = authService.register(req);

        assertThat(resp).isNotNull();
        assertThat(resp.accessToken()).isEqualTo("mock-access-token");
        assertThat(resp.refreshToken()).isNotNull();
        assertThat(resp.user().universityNumber()).isEqualTo("20261010");
        assertThat(resp.user().roles()).contains(Role.STUDENT);

        verify(vehicleRepository, times(1)).save(any(Vehicle.class));
        verify(refreshTokenRepository, times(1)).save(any(RefreshToken.class));
    }

    @Test
    @DisplayName("Should reject registration when password is weak")
    void shouldRejectWeakPassword() {
        RegisterRequest req = new RegisterRequest(
                "FBSU", "20261010", "tariq@fbsu.edu.sa", "123",
                "طارق", "Tariq", UserType.STUDENT, null, null, null, null, null
        );

        when(passwordService.isStrong("123")).thenReturn(false);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("كلمة المرور");
    }

    @Test
    @DisplayName("Should login successfully with valid email and password")
    void shouldLoginSuccessfully() {
        LoginRequest req = new LoginRequest("FBSU", "tariq@fbsu.edu.sa", "CorrectPass1!");

        when(universityRepository.findByCode("FBSU")).thenReturn(Optional.of(fbsu));

        User user = new User(fbsu.getId(), "20261010", "tariq@fbsu.edu.sa", "hashed-pass",
                "طارق", "Tariq", UserType.STUDENT);
        user.setId(UUID.randomUUID());
        user.addRole(Role.STUDENT);

        when(userRepository.findByEmail("tariq@fbsu.edu.sa")).thenReturn(Optional.of(user));
        when(passwordService.matches("CorrectPass1!", "hashed-pass")).thenReturn(true);
        when(jwtService.generateAccessToken(any(), any(), any(), any(), any(), any())).thenReturn("login-jwt-token");
        when(jwtService.getAccessTokenExpirationSeconds()).thenReturn(900L);
        when(jwtService.getRefreshTokenExpirationDays()).thenReturn(7L);

        AuthResponse resp = authService.login(req);

        assertThat(resp.accessToken()).isEqualTo("login-jwt-token");
        assertThat(resp.user().email()).isEqualTo("tariq@fbsu.edu.sa");
    }

    @Test
    @DisplayName("Should throw BadCredentialsException on invalid password without revealing user existence")
    void shouldRejectBadPassword() {
        LoginRequest req = new LoginRequest("FBSU", "tariq@fbsu.edu.sa", "WrongPassword!");

        when(universityRepository.findByCode("FBSU")).thenReturn(Optional.of(fbsu));

        User user = new User(fbsu.getId(), "20261010", "tariq@fbsu.edu.sa", "hashed-pass",
                "طارق", "Tariq", UserType.STUDENT);
        when(userRepository.findByEmail("tariq@fbsu.edu.sa")).thenReturn(Optional.of(user));
        when(passwordService.matches("WrongPassword!", "hashed-pass")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
}
