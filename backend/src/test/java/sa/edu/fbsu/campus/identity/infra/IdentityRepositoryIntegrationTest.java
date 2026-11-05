package sa.edu.fbsu.campus.identity.infra;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import sa.edu.fbsu.campus.common.AbstractPostgresIntegrationTest;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.identity.domain.*;
import sa.edu.fbsu.campus.infra.UniversityRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class IdentityRepositoryIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private PasswordService passwordService;

    @Test
    @DisplayName("Should persist User with roles and query by university number")
    void shouldPersistUserWithRoles() {
        University uni = universityRepository.save(
                new University("UNI-ID-" + UUID.randomUUID().toString().substring(0, 6), "جامعة الهوية", "Identity University")
        );

        String passwordHash = passwordService.hash("StudentPass2026!");
        User user = new User(
                uni.getId(),
                "20260001",
                "student-" + UUID.randomUUID().toString().substring(0, 6) + "@fbsu.edu.sa",
                passwordHash,
                "طارق بن زياد",
                "Tariq Bin Ziyad",
                UserType.STUDENT
        );
        user.addRole(Role.STUDENT);
        user.addRole(Role.CAMPUS_ADMIN);

        User saved = userRepository.save(user);
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getRoles()).containsExactlyInAnyOrder(Role.STUDENT, Role.CAMPUS_ADMIN);

        Optional<User> found = userRepository.findByUniversityIdAndUniversityNumber(uni.getId(), "20260001");
        assertThat(found).isPresent();
        assertThat(found.get().getFullNameAr()).isEqualTo("طارق بن زياد");
        assertThat(passwordService.matches("StudentPass2026!", found.get().getPasswordHash())).isTrue();
    }

    @Test
    @DisplayName("Should enforce tenant isolation: two universities can share same student university number")
    void shouldAllowSameUniversityNumberAcrossDifferentTenants() {
        University uniA = universityRepository.save(
                new University("UNI-A-" + UUID.randomUUID().toString().substring(0, 6), "جامعة أ", "University A")
        );
        University uniB = universityRepository.save(
                new University("UNI-B-" + UUID.randomUUID().toString().substring(0, 6), "جامعة ب", "University B")
        );

        String sharedNumber = "20241099";

        User userA = new User(uniA.getId(), sharedNumber, "userA-" + UUID.randomUUID() + "@a.edu", "hash1", "طالب أ", "Student A", UserType.STUDENT);
        User userB = new User(uniB.getId(), sharedNumber, "userB-" + UUID.randomUUID() + "@b.edu", "hash2", "طالب ب", "Student B", UserType.STUDENT);

        userRepository.save(userA);
        userRepository.save(userB);

        Optional<User> foundA = userRepository.findByUniversityIdAndUniversityNumber(uniA.getId(), sharedNumber);
        Optional<User> foundB = userRepository.findByUniversityIdAndUniversityNumber(uniB.getId(), sharedNumber);

        assertThat(foundA).isPresent();
        assertThat(foundB).isPresent();
        assertThat(foundA.get().getId()).isNotEqualTo(foundB.get().getId());
    }

    @Test
    @DisplayName("Should reject duplicate student university number within the SAME tenant")
    void shouldRejectDuplicateUniversityNumberInSameTenant() {
        University uni = universityRepository.save(
                new University("UNI-DUP-" + UUID.randomUUID().toString().substring(0, 6), "جامعة التكرار", "Dup University")
        );

        User user1 = new User(uni.getId(), "STD-100", "std1-" + UUID.randomUUID() + "@fbsu.edu", "h1", "طالب 1", "Student 1", UserType.STUDENT);
        userRepository.save(user1);

        User user2 = new User(uni.getId(), "STD-100", "std2-" + UUID.randomUUID() + "@fbsu.edu", "h2", "طالب 2", "Student 2", UserType.STUDENT);

        assertThatThrownBy(() -> userRepository.saveAndFlush(user2))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    @DisplayName("Should persist Vehicle with embedded SaudiPlate and verify uniqueness per tenant")
    void shouldPersistVehicleWithSaudiPlate() {
        University uni = universityRepository.save(
                new University("UNI-VEH-" + UUID.randomUUID().toString().substring(0, 6), "جامعة السيارات", "Vehicle University")
        );

        User owner = userRepository.save(
                new User(uni.getId(), "OWNER-1", "owner-" + UUID.randomUUID() + "@fbsu.edu", "h", "مالك السيارة", "Car Owner", UserType.STUDENT)
        );

        SaudiPlate plate = SaudiPlate.fromArabic("ط ر ق", "4040");
        Vehicle vehicle = new Vehicle(uni.getId(), owner.getId(), plate, "Toyota Camry 2024", "White");
        Vehicle saved = vehicleRepository.save(vehicle);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getPlate().getLettersAr()).isEqualTo("ط ر ق");
        assertThat(saved.getPlate().getLettersEn()).isEqualTo("T R G");
        assertThat(saved.getPlate().getDigits()).isEqualTo("4040");

        // Attempting to register the exact same plate under the same university must fail
        User owner2 = userRepository.save(
                new User(uni.getId(), "OWNER-2", "owner2-" + UUID.randomUUID() + "@fbsu.edu", "h", "مالك 2", "Car Owner 2", UserType.STUDENT)
        );
        Vehicle duplicateVehicle = new Vehicle(uni.getId(), owner2.getId(), SaudiPlate.fromArabic("ط ر ق", "4040"), "Nissan", "Black");

        assertThatThrownBy(() -> vehicleRepository.saveAndFlush(duplicateVehicle))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    @DisplayName("Should persist, query active, and revoke RefreshToken")
    void shouldHandleRefreshTokenLifecycle() {
        University uni = universityRepository.save(
                new University("UNI-TOK-" + UUID.randomUUID().toString().substring(0, 6), "جامعة التوكنات", "Token University")
        );

        User user = userRepository.save(
                new User(uni.getId(), "TOK-USER", "token-" + UUID.randomUUID() + "@fbsu.edu", "h", "مستخدم توكن", "Token User", UserType.STUDENT)
        );

        String initialHash = "token-hash-" + UUID.randomUUID();
        Instant expiresAt = Instant.now().plus(7, ChronoUnit.DAYS);

        RefreshToken token = new RefreshToken(user.getId(), initialHash, expiresAt);
        refreshTokenRepository.save(token);

        Optional<RefreshToken> found = refreshTokenRepository.findByTokenHash(initialHash);
        assertThat(found).isPresent();
        assertThat(found.get().isActive()).isTrue();
        assertThat(found.get().isRevoked()).isFalse();

        // Revoke token with rotation
        String newHash = "token-hash-" + UUID.randomUUID();
        found.get().revoke(newHash);
        RefreshToken revoked = refreshTokenRepository.save(found.get());

        assertThat(revoked.isRevoked()).isTrue();
        assertThat(revoked.isActive()).isFalse();
        assertThat(revoked.getReplacedByTokenHash()).isEqualTo(newHash);

        List<RefreshToken> activeTokens = refreshTokenRepository.findByUserIdAndRevokedAtIsNull(user.getId());
        assertThat(activeTokens).isEmpty();
    }
}
