package sa.edu.fbsu.campus.identity.application;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.identity.domain.PasswordService;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.dto.ChangePasswordRequest;
import sa.edu.fbsu.campus.identity.dto.UpdateProfileRequest;
import sa.edu.fbsu.campus.identity.dto.UserProfileResponse;
import sa.edu.fbsu.campus.identity.dto.VehicleDto;
import sa.edu.fbsu.campus.identity.infra.UserRepository;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ProfileService {

    private final UserRepository userRepository;
    private final VehicleService vehicleService;
    private final PasswordService passwordService;

    public ProfileService(UserRepository userRepository,
                          VehicleService vehicleService,
                          PasswordService passwordService) {
        this.userRepository = userRepository;
        this.vehicleService = vehicleService;
        this.passwordService = passwordService;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("المستخدم غير موجود"));

        List<VehicleDto> vehicles = vehicleService.getUserVehicles(userId);
        return toResponse(user, vehicles);
    }

    public UserProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("المستخدم غير موجود"));

        if (request.fullNameAr() != null && !request.fullNameAr().isBlank()) {
            user.setFullNameAr(request.fullNameAr().trim());
        }

        if (request.fullNameEn() != null && !request.fullNameEn().isBlank()) {
            user.setFullNameEn(request.fullNameEn().trim());
        }

        if (request.phone() != null) {
            user.setPhone(request.phone().trim());
        }

        if (request.specialty() != null) {
            user.setSpecialty(request.specialty().trim());
        }

        if (request.locale() != null && !request.locale().isBlank()) {
            String locale = request.locale().trim().toLowerCase();
            if (locale.equals("ar") || locale.equals("en")) {
                user.setLocale(locale);
            }
        }

        if (request.theme() != null && !request.theme().isBlank()) {
            String theme = request.theme().trim().toLowerCase();
            if (theme.equals("dark") || theme.equals("light")) {
                user.setTheme(theme);
            }
        }

        User updated = userRepository.save(user);
        List<VehicleDto> vehicles = vehicleService.getUserVehicles(userId);
        return toResponse(updated, vehicles);
    }

    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("المستخدم غير موجود"));

        if (!passwordService.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("كلمة المرور الحالية غير صحيحة");
        }

        if (request.newPassword().length() < 8) {
            throw new IllegalArgumentException("كلمة المرور الجديدة يجب ألا تقل عن 8 خانات");
        }

        user.setPasswordHash(passwordService.hash(request.newPassword()));
        userRepository.save(user);
    }

    private UserProfileResponse toResponse(User user, List<VehicleDto> vehicles) {
        return new UserProfileResponse(
                user.getId(),
                user.getUniversityId(),
                user.getUniversityNumber(),
                user.getEmail(),
                user.getPhone(),
                user.getFullNameAr(),
                user.getFullNameEn(),
                user.getUserType(),
                user.getStatus(),
                user.getCollegeId(),
                user.getSpecialty(),
                user.getLocale(),
                user.getTheme(),
                user.getRoles(),
                vehicles
        );
    }
}

