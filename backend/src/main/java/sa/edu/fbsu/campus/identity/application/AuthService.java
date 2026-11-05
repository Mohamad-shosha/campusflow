package sa.edu.fbsu.campus.identity.application;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.common.security.JwtService;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.identity.domain.*;
import sa.edu.fbsu.campus.identity.dto.*;
import sa.edu.fbsu.campus.identity.infra.RefreshTokenRepository;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.identity.infra.VehicleRepository;
import sa.edu.fbsu.campus.infra.UniversityRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UniversityRepository universityRepository;
    private final PasswordService passwordService;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            VehicleRepository vehicleRepository,
            RefreshTokenRepository refreshTokenRepository,
            UniversityRepository universityRepository,
            PasswordService passwordService,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.universityRepository = universityRepository;
        this.passwordService = passwordService;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest req) {
        if (!passwordService.isStrong(req.password())) {
            throw new IllegalArgumentException("كلمة المرور يجب أن تحتوي على 8 خانات على الأقل وتتضمن حروفاً كبيرة وصغيرة وأرقاماً.");
        }

        String uniCode = (req.universityCode() != null && !req.universityCode().isBlank()) 
                ? req.universityCode().trim() : "FBSU";

        University university = universityRepository.findByCode(uniCode)
                .orElseThrow(() -> new ResourceNotFoundException("الجامعة غير مسجلة بالنظام: " + uniCode));

        if (userRepository.existsByEmail(req.email())) {
            throw new IllegalArgumentException("البريد الإلكتروني مسجل بالفعل: " + req.email());
        }

        if (userRepository.existsByUniversityIdAndUniversityNumber(university.getId(), req.universityNumber())) {
            throw new IllegalArgumentException("الرقم الجامعي مسجل بالفعل لدى هذه الجامعة: " + req.universityNumber());
        }

        String hashedPassword = passwordService.hash(req.password());

        User user = new User(
                university.getId(),
                req.universityNumber().trim(),
                req.email().trim().toLowerCase(),
                hashedPassword,
                req.fullNameAr().trim(),
                req.fullNameEn().trim(),
                req.userType()
        );
        user.setPhone(req.phone());

        // Assign default role based on user type
        switch (req.userType()) {
            case STUDENT -> user.addRole(Role.STUDENT);
            case FACULTY -> user.addRole(Role.FACULTY);
            case STAFF -> user.addRole(Role.STAFF);
        }

        User savedUser = userRepository.save(user);

        // Optional vehicle registration
        String primaryPlateFormatted = null;
        if (req.plateLettersAr() != null && !req.plateLettersAr().isBlank() 
                && req.plateDigits() != null && !req.plateDigits().isBlank()) {
            SaudiPlate plate = SaudiPlate.fromArabic(req.plateLettersAr(), req.plateDigits());
            Vehicle vehicle = new Vehicle(
                    university.getId(),
                    savedUser.getId(),
                    plate,
                    req.makeModel(),
                    req.color()
            );
            vehicleRepository.save(vehicle);
            primaryPlateFormatted = plate.toFormattedAr();
        }

        String accessToken = jwtService.generateAccessToken(
                savedUser.getId(),
                savedUser.getUniversityId(),
                savedUser.getUniversityNumber(),
                savedUser.getRoles(),
                savedUser.getUserType(),
                savedUser.getLocale()
        );

        String refreshTokenRaw = generateAndStoreRefreshToken(savedUser.getId());

        UserSummaryDto userDto = new UserSummaryDto(
                savedUser.getId(),
                savedUser.getUniversityId(),
                savedUser.getUniversityNumber(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getFullNameAr(),
                savedUser.getFullNameEn(),
                savedUser.getUserType(),
                savedUser.getRoles(),
                primaryPlateFormatted
        );

        return AuthResponse.of(accessToken, refreshTokenRaw, jwtService.getAccessTokenExpirationSeconds(), userDto);
    }

    public AuthResponse login(LoginRequest req) {
        String uniCode = (req.universityCode() != null && !req.universityCode().isBlank()) 
                ? req.universityCode().trim() : "FBSU";

        University university = universityRepository.findByCode(uniCode)
                .orElseThrow(() -> new BadCredentialsException("اسم المستخدم أو كلمة المرور غير صحيحة"));

        String identifier = req.identifier().trim();
        Optional<User> userOpt = identifier.contains("@")
                ? userRepository.findByEmail(identifier.toLowerCase())
                : userRepository.findByUniversityIdAndUniversityNumber(university.getId(), identifier);

        if (userOpt.isEmpty()) {
            throw new BadCredentialsException("اسم المستخدم أو كلمة المرور غير صحيحة");
        }

        User user = userOpt.get();

        if (!passwordService.matches(req.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("اسم المستخدم أو كلمة المرور غير صحيحة");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalStateException("الحساب غير نشط حالياً. يرجى التواصل مع عمادة القبول والتسجيل.");
        }

        String accessToken = jwtService.generateAccessToken(
                user.getId(),
                user.getUniversityId(),
                user.getUniversityNumber(),
                user.getRoles(),
                user.getUserType(),
                user.getLocale()
        );

        String refreshTokenRaw = generateAndStoreRefreshToken(user.getId());

        List<Vehicle> vehicles = vehicleRepository.findByUserId(user.getId());
        String primaryPlate = vehicles.stream()
                .filter(Vehicle::isPrimary)
                .findFirst()
                .map(v -> v.getPlate().toFormattedAr())
                .orElse(null);

        UserSummaryDto userDto = new UserSummaryDto(
                user.getId(),
                user.getUniversityId(),
                user.getUniversityNumber(),
                user.getEmail(),
                user.getPhone(),
                user.getFullNameAr(),
                user.getFullNameEn(),
                user.getUserType(),
                user.getRoles(),
                primaryPlate
        );

        return AuthResponse.of(accessToken, refreshTokenRaw, jwtService.getAccessTokenExpirationSeconds(), userDto);
    }

    public AuthResponse refreshToken(RefreshTokenRequest req) {
        RefreshToken token = refreshTokenRepository.findByTokenHash(req.refreshToken())
                .orElseThrow(() -> new BadCredentialsException("رمز التجديد (Refresh Token) غير صالح"));

        if (!token.isActive()) {
            throw new BadCredentialsException("رمز التجديد تم إبطاله أو انتهت صلاحيته");
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new BadCredentialsException("المستخدم غير موجود"));

        // Rotate token
        String newRefreshTokenRaw = UUID.randomUUID().toString();
        token.revoke(newRefreshTokenRaw);
        refreshTokenRepository.save(token);

        Instant expiresAt = Instant.now().plus(jwtService.getRefreshTokenExpirationDays(), ChronoUnit.DAYS);
        RefreshToken newRefreshToken = new RefreshToken(user.getId(), newRefreshTokenRaw, expiresAt);
        refreshTokenRepository.save(newRefreshToken);

        String accessToken = jwtService.generateAccessToken(
                user.getId(),
                user.getUniversityId(),
                user.getUniversityNumber(),
                user.getRoles(),
                user.getUserType(),
                user.getLocale()
        );

        List<Vehicle> vehicles = vehicleRepository.findByUserId(user.getId());
        String primaryPlate = vehicles.stream()
                .filter(Vehicle::isPrimary)
                .findFirst()
                .map(v -> v.getPlate().toFormattedAr())
                .orElse(null);

        UserSummaryDto userDto = new UserSummaryDto(
                user.getId(),
                user.getUniversityId(),
                user.getUniversityNumber(),
                user.getEmail(),
                user.getPhone(),
                user.getFullNameAr(),
                user.getFullNameEn(),
                user.getUserType(),
                user.getRoles(),
                primaryPlate
        );

        return AuthResponse.of(accessToken, newRefreshTokenRaw, jwtService.getAccessTokenExpirationSeconds(), userDto);
    }

    public void logout(UUID userId) {
        List<RefreshToken> activeTokens = refreshTokenRepository.findByUserIdAndRevokedAtIsNull(userId);
        for (RefreshToken t : activeTokens) {
            t.revoke("LOGOUT");
        }
        refreshTokenRepository.saveAll(activeTokens);
    }

    private String generateAndStoreRefreshToken(UUID userId) {
        String rawToken = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plus(jwtService.getRefreshTokenExpirationDays(), ChronoUnit.DAYS);
        RefreshToken entity = new RefreshToken(userId, rawToken, expiresAt);
        refreshTokenRepository.save(entity);
        return rawToken;
    }
}
