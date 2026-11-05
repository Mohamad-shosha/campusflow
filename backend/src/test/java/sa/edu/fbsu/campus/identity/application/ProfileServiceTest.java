package sa.edu.fbsu.campus.identity.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.identity.domain.PasswordService;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.dto.ChangePasswordRequest;
import sa.edu.fbsu.campus.identity.dto.UpdateProfileRequest;
import sa.edu.fbsu.campus.identity.dto.UserProfileResponse;
import sa.edu.fbsu.campus.identity.infra.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VehicleService vehicleService;

    @Mock
    private PasswordService passwordService;

    private ProfileService profileService;

    private final UUID userId = UUID.randomUUID();
    private final UUID universityId = UUID.randomUUID();
    private User testUser;

    @BeforeEach
    void setUp() {
        profileService = new ProfileService(userRepository, vehicleService, passwordService);

        testUser = new User(
                universityId,
                "STD-2026",
                "test@fbsu.edu.sa",
                "$2a$12$hashedPasswordPlaceholder",
                "محمد العطوي",
                "Mohammed Al-Atwi",
                UserType.STUDENT
        );
        testUser.setId(userId);
    }

    @Test
    @DisplayName("Should return complete user profile with vehicles")
    void shouldReturnCompleteProfile() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(vehicleService.getUserVehicles(userId)).thenReturn(List.of());

        UserProfileResponse profile = profileService.getProfile(userId);

        assertThat(profile).isNotNull();
        assertThat(profile.email()).isEqualTo("test@fbsu.edu.sa");
        assertThat(profile.fullNameAr()).isEqualTo("محمد العطوي");
        verify(userRepository).findById(userId);
    }

    @Test
    @DisplayName("Should update profile fields and save user")
    void shouldUpdateProfileFields() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(vehicleService.getUserVehicles(userId)).thenReturn(List.of());

        UpdateProfileRequest updateReq = new UpdateProfileRequest(
                "محمد أحمد العطوي",
                "Mohammed A. Al-Atwi",
                "0512345678",
                "علوم الحاسب",
                "en",
                "light"
        );

        UserProfileResponse updated = profileService.updateProfile(userId, updateReq);

        assertThat(updated.fullNameAr()).isEqualTo("محمد أحمد العطوي");
        assertThat(updated.phone()).isEqualTo("0512345678");
        assertThat(updated.locale()).isEqualTo("en");
        assertThat(updated.theme()).isEqualTo("light");
        verify(userRepository).save(testUser);
    }

    @Test
    @DisplayName("Should change password successfully when current password matches")
    void shouldChangePasswordSuccessfully() {
        String oldHash = testUser.getPasswordHash();
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(passwordService.matches("OldPass123!", oldHash)).thenReturn(true);
        when(passwordService.hash("NewSecretPass2026!")).thenReturn("$2a$12$newHashedPassword");

        ChangePasswordRequest changeReq = new ChangePasswordRequest("OldPass123!", "NewSecretPass2026!");
        profileService.changePassword(userId, changeReq);

        verify(passwordService).matches("OldPass123!", oldHash);
        verify(passwordService).hash("NewSecretPass2026!");
        verify(userRepository).save(testUser);
        assertThat(testUser.getPasswordHash()).isEqualTo("$2a$12$newHashedPassword");
    }

    @Test
    @DisplayName("Should throw BadCredentialsException when current password does not match")
    void shouldRejectPasswordChangeWhenCurrentPasswordIncorrect() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(passwordService.matches("WrongPass!", testUser.getPasswordHash())).thenReturn(false);

        ChangePasswordRequest changeReq = new ChangePasswordRequest("WrongPass!", "NewSecretPass2026!");

        assertThatThrownBy(() -> profileService.changePassword(userId, changeReq))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("كلمة المرور الحالية غير صحيحة");

        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when user does not exist")
    void shouldThrowWhenUserNotFound() {
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> profileService.getProfile(userId))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}

