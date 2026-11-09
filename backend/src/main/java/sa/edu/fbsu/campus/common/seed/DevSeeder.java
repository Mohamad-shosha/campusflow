package sa.edu.fbsu.campus.common.seed;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
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

import sa.edu.fbsu.campus.wallet.domain.LedgerEntry;
import sa.edu.fbsu.campus.wallet.domain.TransactionDirection;
import sa.edu.fbsu.campus.wallet.domain.TransactionType;
import sa.edu.fbsu.campus.wallet.domain.Wallet;
import sa.edu.fbsu.campus.wallet.infra.LedgerEntryRepository;
import sa.edu.fbsu.campus.wallet.infra.WalletRepository;
import sa.edu.fbsu.campus.wallet.tuition.domain.TuitionInvoice;
import sa.edu.fbsu.campus.wallet.tuition.infra.TuitionInvoiceRepository;
import sa.edu.fbsu.campus.parking.domain.ParkingZone;
import sa.edu.fbsu.campus.parking.domain.ParkingSpot;
import sa.edu.fbsu.campus.parking.domain.ParkingTariff;
import sa.edu.fbsu.campus.parking.domain.SpotAssignment;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.domain.SpotType;
import sa.edu.fbsu.campus.parking.infra.ParkingZoneRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingTariffRepository;
import sa.edu.fbsu.campus.parking.infra.SpotAssignmentRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Dev/Demo Seed Data Generator for local development and UI testing.
 * Runs strictly when spring.profiles.active contains "dev".
 * Fully idempotent: safe to run multiple times without duplicating entities.
 */
@Component
@Profile("dev")
@ConditionalOnProperty(name = "fbsu.seed.demo-data", havingValue = "true")
@Order(1)
public class DevSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DevSeeder.class);

    private final UniversityRepository universityRepository;
    private final CollegeRepository collegeRepository;
    private final BuildingRepository buildingRepository;
    private final AcademicTermRepository termRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordService passwordService;
    private final WalletRepository walletRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final TuitionInvoiceRepository tuitionInvoiceRepository;
    private final ParkingZoneRepository parkingZoneRepository;
    private final ParkingSpotRepository parkingSpotRepository;
    private final ParkingTariffRepository parkingTariffRepository;
    private final SpotAssignmentRepository spotAssignmentRepository;

    public DevSeeder(
            UniversityRepository universityRepository,
            CollegeRepository collegeRepository,
            BuildingRepository buildingRepository,
            AcademicTermRepository termRepository,
            UserRepository userRepository,
            VehicleRepository vehicleRepository,
            PasswordService passwordService,
            WalletRepository walletRepository,
            LedgerEntryRepository ledgerEntryRepository,
            TuitionInvoiceRepository tuitionInvoiceRepository,
            ParkingZoneRepository parkingZoneRepository,
            ParkingSpotRepository parkingSpotRepository,
            ParkingTariffRepository parkingTariffRepository,
            SpotAssignmentRepository spotAssignmentRepository) {
        this.universityRepository = universityRepository;
        this.collegeRepository = collegeRepository;
        this.buildingRepository = buildingRepository;
        this.termRepository = termRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.passwordService = passwordService;
        this.walletRepository = walletRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.tuitionInvoiceRepository = tuitionInvoiceRepository;
        this.parkingZoneRepository = parkingZoneRepository;
        this.parkingSpotRepository = parkingSpotRepository;
        this.parkingTariffRepository = parkingTariffRepository;
        this.spotAssignmentRepository = spotAssignmentRepository;
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
        seedUser(uniId, "FAC-8821", "r.alnefaie@fbsu.edu.sa", defaultHashedPass,
                "د. رغد بنت فهد النفيعي", "Dr. Raghad F. Al-Nefaie",
                UserType.FACULTY, Role.FACULTY, "0561234567", ccis.getId(), "هندسة البرمجيات والذكاء الاصطناعي",
                "ن م ر", "3301", "Audi A6 2024");

        User drMezher = seedUser(uniId, "FAC-7700", "m.mezher@fbsu.edu.sa", defaultHashedPass,
                "د. محمد مزهر", "Dr. Mohammad Mezher",
                UserType.FACULTY, Role.FACULTY, "0567654321", ccis.getId(), "حوسبة سحابية ونظم موزعة",
                "س ع د", "7700", "BMW 520i 2023");

        User drGhamdi = seedUser(uniId, "FAC-9912", "a.ghamdi@fbsu.edu.sa", defaultHashedPass,
                "د. عبدالله الغامدي", "Dr. Abdullah Al-Ghamdi",
                UserType.FACULTY, Role.FACULTY, "0569876543", ccis.getId(), "شبكات الحاسب وأمن المعلومات",
                "ط ر ق", "9912", "Mercedes E300 2023");

        User drFahad = seedUser(uniId, "FAC-3001", "fahad.atwi@fbsu.edu.sa", defaultHashedPass,
                "د. فهد بن أحمد العطوي", "Dr. Fahad A. Al-Atwi",
                UserType.FACULTY, Role.FACULTY, "0503330003", ccis.getId(), "ذكاء اصطناعي",
                "ط ر ق", "4040", "Lexus RX 2024");

        User drSarah = seedUser(uniId, "FAC-3002", "sarah.balawi@fbsu.edu.sa", defaultHashedPass,
                "د. سارة بنت خالد البلوي", "Dr. Sarah K. Al-Balawi",
                UserType.FACULTY, Role.FACULTY, "0503330004", eng.getId(), "هندسة مدنية",
                "س ع د", "2020", "Genesis G80");

        // 5.4 Students with Vehicles (Prototype Personas & Demo Users)
        seedUser(uniId, "20210045", "eyad.harbi@fbsu.edu.sa", defaultHashedPass,
                "إياد الحربي", "Eyad Al-Harbi",
                UserType.STUDENT, Role.STUDENT, "0501234567", eng.getId(), "هندسة مدنية",
                "ب ط ك", "5021", "Toyota Camry 2022");

        seedUser(uniId, "20220088", "rakan.mutairi@fbsu.edu.sa", defaultHashedPass,
                "راكان المطيري", "Rakan Al-Mutairi",
                UserType.STUDENT, Role.STUDENT, "0559876543", ccis.getId(), "هندسة البرمجيات",
                "د ر ع", "8812", "Hyundai Tucson 2023");

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

        // 6. Tuition Invoices for Demo Students
        termRepository.findByUniversityIdAndCode(uniId, "2026-FALL").ifPresent(fallTerm -> {
            if (tuitionInvoiceRepository.findByInvoiceNumber("INV-2026-ENG-101").isEmpty()) {
                userRepository.findByUniversityNumber("20210045").ifPresent(eyad -> {
                    tuitionInvoiceRepository.save(new TuitionInvoice(
                            uniId,
                            eyad,
                            fallTerm,
                            "INV-2026-ENG-101",
                            new BigDecimal("650.00"),
                            LocalDate.of(2026, 11, 28)
                    ));
                    tuitionInvoiceRepository.save(new TuitionInvoice(
                            uniId,
                            eyad,
                            fallTerm,
                            "INV-2026-ENG-102",
                            new BigDecimal("1850.00"),
                            LocalDate.of(2026, 12, 25)
                    ));
                });
            }

            if (tuitionInvoiceRepository.findByInvoiceNumber("INV-2026-CCIS-101").isEmpty()) {
                userRepository.findByUniversityNumber("20220088").ifPresent(rakan -> {
                    tuitionInvoiceRepository.save(new TuitionInvoice(
                            uniId,
                            rakan,
                            fallTerm,
                            "INV-2026-CCIS-101",
                            new BigDecimal("500.00"),
                            LocalDate.of(2026, 11, 30)
                    ));
                });
            }

            if (tuitionInvoiceRepository.findByInvoiceNumber("INV-2026-CCIS-001").isEmpty()) {
                userRepository.findByUniversityNumber("STD-202410101").ifPresent(student -> {
                    tuitionInvoiceRepository.save(new TuitionInvoice(
                            uniId,
                            student,
                            fallTerm,
                            "INV-2026-CCIS-001",
                            new BigDecimal("450.00"),
                            LocalDate.of(2026, 11, 30)
                    ));
                    tuitionInvoiceRepository.save(new TuitionInvoice(
                            uniId,
                            student,
                            fallTerm,
                            "INV-2026-CCIS-002",
                            new BigDecimal("1500.00"),
                            LocalDate.of(2026, 12, 31)
                    ));
                });
            }
        });

        // 7. Seed Parking Zones
        ParkingZone zoneA = seedParkingZone(uniId, "A", "الحاسب والهندسة", "Computing & Engineering", eng.getId(), 10);
        ParkingZone zoneB = seedParkingZone(uniId, "B", "إدارة الأعمال والطب", "Business & Medicine", bus.getId(), 8);
        ParkingZone zoneC = seedParkingZone(uniId, "C", "كادر التدريس (دكاترة)", "Faculty Members", ccis.getId(), 6);
        ParkingZone zoneD = seedParkingZone(uniId, "D", "شحن كهربائي وذوي الهمم", "EV & Accessible", null, 11);
        ParkingZone zoneE = seedParkingZone(uniId, "E", "البوابة الرئيسية والمبنى المركزي", "Central Gate & Administration", null, 5);

        // 8. Seed Parking Tariffs
        seedTariff(uniId, UserType.STUDENT, new BigDecimal("5.75"), new BigDecimal("25.00"), new BigDecimal("5.75"));
        seedTariff(uniId, UserType.FACULTY, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        seedTariff(uniId, UserType.STAFF, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);

        // 9. Seed 40 Complete Campus Parking Bays (Idempotent per-bay)
        // Zone A (Bays 1 - 10)
        seedSpotIfMissing(uniId, zoneA, 1, SpotType.STANDARD, SpotStatus.OCCUPIED, 30, true, "إياد الحربي", "Eyad Al-Harbi", "تويوتا كامري", "ب ط ك", "1234", "بريك بعد 15 د");
        seedSpotIfMissing(uniId, zoneA, 2, SpotType.STANDARD, SpotStatus.AVAILABLE, 35, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneA, 3, SpotType.STANDARD, SpotStatus.AVAILABLE, 40, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneA, 4, SpotType.STANDARD, SpotStatus.OCCUPIED, 45, false, "سعود الشهري", "Saud Al-Shehri", "شيفروليه كابرس", "ع س ر", "4040", "1 س 45 د");
        seedSpotIfMissing(uniId, zoneA, 5, SpotType.STANDARD, SpotStatus.AVAILABLE, 50, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneA, 6, SpotType.STANDARD, SpotStatus.OCCUPIED, 55, false, "فيصل العطوي", "Faisal Al-Atwi", "لكزس ES", "ط ب ك", "2030", "2 س 10 د");
        seedSpotIfMissing(uniId, zoneA, 7, SpotType.STANDARD, SpotStatus.AVAILABLE, 60, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneA, 8, SpotType.STANDARD, SpotStatus.FLEX_SHARE, 65, true, "محمد الحويطي (في بريك)", "Mohammad Al-Hwaiti (Break)", "نيسان التيما", "ر ح ل", "7711", "متاح للتبادل: 2 س 15 د");
        seedSpotIfMissing(uniId, zoneA, 9, SpotType.STANDARD, SpotStatus.AVAILABLE, 70, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneA, 10, SpotType.STANDARD, SpotStatus.OCCUPIED, 75, false, "عمر البلوي", "Omar Al-Balawi", "فورد تورس", "د ر ع", "9090", "45 د");

        // Zone B (Bays 11 - 18)
        seedSpotIfMissing(uniId, zoneB, 11, SpotType.STANDARD, SpotStatus.AVAILABLE, 40, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneB, 12, SpotType.STANDARD, SpotStatus.OCCUPIED, 45, false, "خالد العنزي", "Khalid Al-Anazi", "هوندا أكورد", "ن ج م", "3321", "3 س");
        seedSpotIfMissing(uniId, zoneB, 13, SpotType.STANDARD, SpotStatus.AVAILABLE, 50, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneB, 14, SpotType.STANDARD, SpotStatus.FLEX_SHARE, 55, true, "سلطان القحطاني (بريك)", "Sultan Al-Qahtani (Break)", "تويوتا أفالون", "ق ح ط", "5050", "متاح للتبادل: 1 س 50 د");
        seedSpotIfMissing(uniId, zoneB, 15, SpotType.STANDARD, SpotStatus.AVAILABLE, 60, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneB, 16, SpotType.STANDARD, SpotStatus.OCCUPIED, 65, false, "ماجد الرشيدي", "Majid Al-Rashidi", "كيا K5", "س هـ م", "1400", "1 س 15 د");
        seedSpotIfMissing(uniId, zoneB, 17, SpotType.STANDARD, SpotStatus.AVAILABLE, 70, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneB, 18, SpotType.STANDARD, SpotStatus.AVAILABLE, 75, false, null, null, null, null, null, null);

        // Zone C: Faculty Dedicated (Bays 19 - 24)
        seedSpotIfMissing(uniId, zoneC, 19, SpotType.FACULTY, SpotStatus.FACULTY_ASSIGNED, 15, false, "د. عبدالله الغامدي", "Dr. Abdullah Al-Ghamdi", "جينيسيس G80", "أ ح م", "5501", "محجوز يوم كامل");
        seedSpotIfMissing(uniId, zoneC, 20, SpotType.FACULTY, SpotStatus.FACULTY_ASSIGNED, 20, false, "د. سمير كمال", "Dr. Samir Kamal", "مرسيدس E300", "س م ر", "2020", "محاضرة حتى 02:00 م");
        seedSpotIfMissing(uniId, zoneC, 21, SpotType.FACULTY, SpotStatus.AVAILABLE, 25, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneC, 22, SpotType.FACULTY, SpotStatus.FACULTY_ASSIGNED, 20, false, "د. ريم العمراني", "Dr. Reem Al-Amrani", "بي إم دبليو X5", "ر ي م", "7070", "معمل حتى 01:00 م");
        seedSpotIfMissing(uniId, zoneC, 23, SpotType.FACULTY, SpotStatus.AVAILABLE, 25, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneC, 24, SpotType.FACULTY, SpotStatus.FACULTY_ASSIGNED, 25, false, "د. طارق السعيد", "Dr. Tariq Al-Saeed", "أودي A6", "ط ر ق", "1111", "اجتماع مجلس الكلية");

        // Zone D: EV Charging & Accessible (Bays 25 - 35)
        seedSpotIfMissing(uniId, zoneD, 25, SpotType.EV_CHARGING, SpotStatus.AVAILABLE, 50, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneD, 26, SpotType.EV_CHARGING, SpotStatus.OCCUPIED, 55, false, "لوسيد آير (طالب ماجستير)", "Lucid Air (Master Student)", "Lucid Air Pure", "ل و س", "2024", "شحن 84% - متبقي 20 د");
        seedSpotIfMissing(uniId, zoneD, 27, SpotType.EV_CHARGING, SpotStatus.AVAILABLE, 60, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneD, 28, SpotType.ACCESSIBLE, SpotStatus.AVAILABLE, 10, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneD, 29, SpotType.ACCESSIBLE, SpotStatus.OCCUPIED, 10, false, "طالب ذوي همم", "Special Needs Student", "تويوتا برادو", "أ م ل", "1010", "محاضرة حتى 12:00 ظ");
        seedSpotIfMissing(uniId, zoneD, 30, SpotType.EV_CHARGING, SpotStatus.AVAILABLE, 65, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneD, 31, SpotType.EV_CHARGING, SpotStatus.OCCUPIED, 70, false, "سلطان القحطاني", "Sultan Al-Qahtani", "Tesla Model Y", "س ل ط", "3333", "شحن 92% - متبقي 12 د");
        seedSpotIfMissing(uniId, zoneD, 32, SpotType.EV_CHARGING, SpotStatus.AVAILABLE, 75, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneD, 33, SpotType.EV_CHARGING, SpotStatus.OCCUPIED, 80, false, "د. خالد الحربي", "Dr. Khalid Al-Harbi", "Porsche Taycan 4S", "ب و ر", "9110", "شحن 65% - متبقي 35 د");
        seedSpotIfMissing(uniId, zoneD, 34, SpotType.EV_CHARGING, SpotStatus.AVAILABLE, 85, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneD, 35, SpotType.EV_CHARGING, SpotStatus.AVAILABLE, 90, false, null, null, null, null, null, null);

        // Zone E: Main Gate & Central Administration Accessible Bays (36 - 40)
        seedSpotIfMissing(uniId, zoneE, 36, SpotType.ACCESSIBLE, SpotStatus.AVAILABLE, 5, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneE, 37, SpotType.ACCESSIBLE, SpotStatus.OCCUPIED, 5, false, "أحمد الغامدي (طالب دراسات)", "Ahmed Al-Ghamdi (Graduate)", "تويوتا لاندكروزر", "أ ح م", "2020", "محاضرة حتى 01:30 م");
        seedSpotIfMissing(uniId, zoneE, 38, SpotType.STANDARD, SpotStatus.AVAILABLE, 15, false, null, null, null, null, null, null);
        seedSpotIfMissing(uniId, zoneE, 39, SpotType.STANDARD, SpotStatus.OCCUPIED, 20, false, "عبدالرحمن الشهري", "Abdulrahman Al-Shehri", "نيسان باترول", "ن س ن", "5555", "اجتماع عمادة القبول");
        seedSpotIfMissing(uniId, zoneE, 40, SpotType.STANDARD, SpotStatus.AVAILABLE, 25, false, null, null, null, null, null, null);

        // 10. Seed Dedicated Faculty Spot Assignments (Zone C)
        seedFacultyAssignment(uniId, drGhamdi, 19);
        seedFacultyAssignment(uniId, drMezher, 20);
        seedFacultyAssignment(uniId, drFahad, 22);
        seedFacultyAssignment(uniId, drSarah, 24);

        log.info("--- [DevSeeder] Completed FBSU dev/demo seeding successfully ---");
    }

    private void seedFacultyAssignment(UUID universityId, User faculty, int bayNumber) {
        if (spotAssignmentRepository.findByUserIdAndActiveTrue(faculty.getId()).isEmpty()) {
            parkingSpotRepository.findByUniversityIdAndBayNumber(universityId, bayNumber).ifPresent(spot -> {
                if (spotAssignmentRepository.findBySpotIdAndActiveTrue(spot.getId()).isEmpty()) {
                    spotAssignmentRepository.save(new SpotAssignment(
                            universityId,
                            spot.getId(),
                            faculty.getId(),
                            "FACULTY_DEDICATED",
                            LocalDate.of(2026, 9, 1),
                            LocalDate.of(2027, 6, 30)
                    ));
                }
            });
        }
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

        // Seed initial wallet and ledger entry if not exists
        if (!walletRepository.existsByUserId(user.getId())) {
            BigDecimal seedBalance = switch (type) {
                case STUDENT -> new BigDecimal("720.00");
                case FACULTY -> new BigDecimal("1500.00");
                case STAFF -> new BigDecimal("2500.00");
            };
            Wallet w = walletRepository.save(new Wallet(universityId, user, seedBalance, "SAR"));
            ledgerEntryRepository.save(new LedgerEntry(
                    w,
                    TransactionType.TOP_UP,
                    TransactionDirection.CREDIT,
                    seedBalance,
                    seedBalance,
                    "seed-init-" + user.getUniversityNumber(),
                    "FBSU_SEED",
                    "Initial institutional seed balance allocation"
            ));
        }

        return user;
    }

    private ParkingZone seedParkingZone(UUID universityId, String code, String nameAr, String nameEn, UUID collegeId, int totalSpots) {
        return parkingZoneRepository.findByUniversityIdAndCode(universityId, code)
                .orElseGet(() -> parkingZoneRepository.save(new ParkingZone(universityId, code, nameAr, nameEn, collegeId, totalSpots)));
    }

    private void seedTariff(UUID universityId, UserType userType, BigDecimal hourly, BigDecimal dailyCap, BigDecimal cashback) {
        if (!parkingTariffRepository.existsByUniversityIdAndUserType(universityId, userType)) {
            parkingTariffRepository.save(new ParkingTariff(universityId, userType, hourly, dailyCap, cashback));
        }
    }

    private void seedSpotIfMissing(
            UUID universityId,
            ParkingZone zone,
            int bayNumber,
            SpotType type,
            SpotStatus status,
            int distance,
            boolean isFlex,
            String occupantAr,
            String occupantEn,
            String car,
            String plateLetters,
            String plateDigits,
            String timeLeft) {
        seedSpot(universityId, zone, bayNumber, type, status, distance, isFlex, occupantAr, occupantEn, car, plateLetters, plateDigits, timeLeft);
    }

    private void seedSpot(
            UUID universityId,
            ParkingZone zone,
            int bayNumber,
            SpotType type,
            SpotStatus status,
            int distance,
            boolean isFlex,
            String occupantAr,
            String occupantEn,
            String car,
            String plateLetters,
            String plateDigits,
            String timeLeft) {
        ParkingSpot s = parkingSpotRepository.findByUniversityIdAndBayNumber(universityId, bayNumber)
                .orElseGet(() -> new ParkingSpot(universityId, zone, bayNumber, type, status, distance, isFlex));
        if (occupantAr != null) s.setOccupantNameAr(occupantAr);
        if (occupantEn != null) s.setOccupantNameEn(occupantEn);
        if (car != null) s.setVehicleModel(car);
        if (plateLetters != null) s.setPlateLettersAr(plateLetters);
        if (plateDigits != null) s.setPlateDigits(plateDigits);
        if (timeLeft != null) s.setTimeLeftText(timeLeft);
        if (isFlex) s.setFlexEligible(true);
        parkingSpotRepository.save(s);
    }
}
