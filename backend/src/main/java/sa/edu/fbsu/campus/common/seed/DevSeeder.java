package sa.edu.fbsu.campus.common.seed;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.domain.AcademicTerm;
import sa.edu.fbsu.campus.domain.Building;
import sa.edu.fbsu.campus.domain.College;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.identity.domain.*;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.identity.infra.VehicleRepository;
import sa.edu.fbsu.campus.infra.AcademicTermRepository;
import sa.edu.fbsu.campus.infra.BuildingRepository;
import sa.edu.fbsu.campus.infra.CollegeRepository;
import sa.edu.fbsu.campus.infra.UniversityRepository;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Dev/Demo Seed Data Generator for local development and UI testing.
 * Runs strictly when spring.profiles.active contains "dev".
 * Fully idempotent: safe to run multiple times without duplicating entities.
 */
@Component
@Profile("dev")
public class DevSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DevSeeder.class);

    private final UniversityRepository universityRepository;
    private final CollegeRepository collegeRepository;
    private final BuildingRepository buildingRepository;
    private final AcademicTermRepository termRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordService passwordService;

    public DevSeeder(
            UniversityRepository universityRepository,
            CollegeRepository collegeRepository,
            BuildingRepository buildingRepository,
            AcademicTermRepository termRepository,
            UserRepository userRepository,
            VehicleRepository vehicleRepository,
            PasswordService passwordService) {
        this.universityRepository = universityRepository;
        this.collegeRepository = collegeRepository;
        this.buildingRepository = buildingRepository;
        this.termRepository = termRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.passwordService = passwordService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("--- [DevSeeder] Checking and initializing dev/demo seed dataset for FBSU ---");

        // 1. Ensure primary university tenant exists
        University fbsu = universityRepository.findByCode("FBSU")
                .orElseGet(() -> universityRepository.save(new University(
                        "FBSU",
                        "جامعة فهد بن سلطان",
                        "Fahad Bin Sultan University"
                )));
        UUID uniId = fbsu.getId();

        // 2. Colleges
        College ccis = seedCollege(uniId, "CCIS", "كلية الحاسب ونظم المعلومات", "College of Computing & Information Systems");
        College eng = seedCollege(uniId, "ENG", "كلية الهندسة", "College of Engineering");
        College bus = seedCollege(uniId, "CBA", "كلية إدارة الأعمال", "College of Business Administration");

        // 3. Buildings
        seedBuilding(uniId, "ADM-01", "مبنى الإدارة الرئيسي", "Main Administration Complex", 4);
        seedBuilding(uniId, "CCIS-01", "مبنى كلية الحاسب", "CCIS Academic Building", 3);
        seedBuilding(uniId, "ENG-01", "مبنى كلية الهندسة والمختبرات", "Engineering & Labs Complex", 3);
        seedBuilding(uniId, "LIB-01", "مبنى المكتبة المركزية", "Central Academic Library", 2);

        // 4. Academic Terms
        seedTerm(uniId, "2026-FALL", "الفصل الدراسي الأول 2026/2027", "Fall Semester 2026/2027",
                LocalDate.of(2026, 9, 1), LocalDate.of(2027, 1, 15), true);
        seedTerm(uniId, "2027-SPRING", "الفصل الدراسي الثاني 2026/2027", "Spring Semester 2026/2027",
                LocalDate.of(2027, 2, 1), LocalDate.of(2027, 6, 20), false);

        // 5. Seed Users & Vehicles
        String defaultHashedPass = passwordService.hash("FbsuDev2026!");

        // 5.1 Campus Admin
        seedUser(uniId, "ADM-1001", "admin@fbsu.edu.sa", defaultHashedPass,
                "عبدالله بن فهد النجار", "Abdullah F. Al-Najjar",
                UserType.STAFF, Role.CAMPUS_ADMIN, "0501110001", null, "إدارة تقنية المعلومات", null, null, null);

        // 5.2 Security Officer
        seedUser(uniId, "SEC-2001", "security@fbsu.edu.sa", defaultHashedPass,
                "سالم بن مصلح البلوي", "Salem M. Al-Balawi",
                UserType.STAFF, Role.SECURITY_OFFICER, "0502220002", null, "الأمن والسلامة الجامعية", null, null, null);

        // 5.3 Faculty Members
        User drFahad = seedUser(uniId, "FAC-3001", "fahad.atwi@fbsu.edu.sa", defaultHashedPass,
                "د. فهد بن أحمد العطوي", "Dr. Fahad A. Al-Atwi",
                UserType.FACULTY, Role.FACULTY, "0503330003", ccis.getId(), "ذكاء اصطناعي",
                "ط ر ق", "4040", "Lexus RX 2024");

        User drSarah = seedUser(uniId, "FAC-3002", "sarah.balawi@fbsu.edu.sa", defaultHashedPass,
                "د. سارة بنت خالد البلوي", "Dr. Sarah K. Al-Balawi",
                UserType.FACULTY, Role.FACULTY, "0503330004", eng.getId(), "هندسة مدنية",
                "س ع د", "2020", "Genesis G80");

        // 5.4 Students with Vehicles
        seedUser(uniId, "STD-202410101", "ahmed.student@fbsu.edu.sa", defaultHashedPass,
                "أحمد بن منصور العطوي", "Ahmed M. Al-Atwi",
                UserType.STUDENT, Role.STUDENT, "0504440001", ccis.getId(), "هندسة البرمجيات",
                "أ ب ح", "1234", "Toyota Camry 2023");

        seedUser(uniId, "STD-202410102", "fatima.student@fbsu.edu.sa", defaultHashedPass,
                "فاطمة بنت ناصر العنزي", "Fatima N. Al-Anazi",
                UserType.STUDENT, Role.STUDENT, "0504440002", ccis.getId(), "علوم الحاسب",
                "ن م ر", "5678", "Hyundai Elantra 2024");

        seedUser(uniId, "STD-202410103", "omar.student@fbsu.edu.sa", defaultHashedPass,
                "عمر بن راشد الشمري", "Omar R. Al-Shammari",
                UserType.STUDENT, Role.STUDENT, "0504440003", bus.getId(), "إدارة الأعمال الدولية",
                "د ر ع", "9090", "Kia K5 2023");

        log.info("--- [DevSeeder] Completed FBSU dev/demo seeding successfully ---");
    }

    private College seedCollege(UUID universityId, String code, String nameAr, String nameEn) {
        return collegeRepository.findByUniversityIdAndCode(universityId, code)
                .orElseGet(() -> collegeRepository.save(new College(universityId, code, nameAr, nameEn)));
    }

    private Building seedBuilding(UUID universityId, String code, String nameAr, String nameEn, int floors) {
        return buildingRepository.findByUniversityIdAndCode(universityId, code)
                .orElseGet(() -> buildingRepository.save(new Building(universityId, code, nameAr, nameEn, floors)));
    }

    private void seedTerm(UUID universityId, String code, String nameAr, String nameEn,
                          LocalDate start, LocalDate end, boolean isCurrent) {
        if (!termRepository.existsByUniversityIdAndCode(universityId, code)) {
            AcademicTerm term = new AcademicTerm(universityId, code, nameAr, nameEn, start, end, isCurrent);
            termRepository.save(term);
        }
    }

    private User seedUser(
            UUID universityId, String uniNumber, String email, String passwordHash,
            String nameAr, String nameEn, UserType type, Role role,
            String phone, UUID collegeId, String specialty,
            String plateLettersAr, String plateDigits, String vehicleModel) {

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User(universityId, uniNumber, email, passwordHash, nameAr, nameEn, type);
            u.setPhone(phone);
            u.setCollegeId(collegeId);
            u.setSpecialty(specialty);
            u.addRole(role);
            return userRepository.save(u);
        });

        if (plateLettersAr != null && plateDigits != null) {
            SaudiPlate plate = SaudiPlate.of(plateLettersAr, plateDigits);
            if (!vehicleRepository.existsByUniversityIdAndPlateLettersArAndPlateDigits(
                    universityId, plate.getLettersAr(), plate.getDigits())) {
                Vehicle v = new Vehicle(universityId, user.getId(), plate, vehicleModel, "Silver");
                v.setPrimary(true);
                vehicleRepository.save(v);
            }
        }

        return user;
    }
}
