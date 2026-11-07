package sa.edu.fbsu.campus.common.seed;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.rooms.domain.RoomBooking;
import sa.edu.fbsu.campus.rooms.domain.RoomBookingStatus;
import sa.edu.fbsu.campus.rooms.domain.RoomStatus;
import sa.edu.fbsu.campus.rooms.domain.StudyRoom;
import sa.edu.fbsu.campus.rooms.infra.RoomBookingRepository;
import sa.edu.fbsu.campus.rooms.infra.StudyRoomRepository;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Component
@Profile("dev")
@Order(4)
public class RoomsDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(RoomsDataSeeder.class);

    private final UniversityRepository universityRepository;
    private final UserRepository userRepository;
    private final StudyRoomRepository roomRepository;
    private final RoomBookingRepository bookingRepository;

    public RoomsDataSeeder(
            UniversityRepository universityRepository,
            UserRepository userRepository,
            StudyRoomRepository roomRepository,
            RoomBookingRepository bookingRepository
    ) {
        this.universityRepository = universityRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        University fbsu = universityRepository.findByCode("FBSU").orElse(null);
        if (fbsu == null) {
            return;
        }
        UUID uniId = fbsu.getId();

        User eyad = userRepository.findByUniversityNumber("20210045").orElse(null);
        User rakan = userRepository.findByUniversityNumber("20220088").orElse(null);

        // 1. LAB-102 (In Use with active booking)
        if (!roomRepository.existsByRoomCode("LAB-102")) {
            StudyRoom r1 = roomRepository.save(new StudyRoom(
                    uniId,
                    "LAB-102",
                    "معمل الحاسب وتطوير البرمجيات (Computer Lab 102)",
                    "Computer Software Lab 102",
                    "مبنى كلية الحاسب - الدور الأرضي",
                    "College of Computing - Ground Floor",
                    "24 جهاز ورك ستيشن / طالب",
                    "24 Workstations / Students",
                    "معمل حاسب",
                    "Computer Lab",
                    List.of(
                            "24 جهاز iMac و HP Workstation مجهزة بـ Python و Java و VS Code",
                            "إنترنت ألياف ضوئية فائق السرعة مخصص للمشاريع والتحميل",
                            "شاشة ذكية 85 بوصة للعرض والمراجعة الجماعية للأكواد",
                            "طابعة ليزر سريعة لطباعة التقارير والأبحاث"
                    ),
                    List.of(
                            "24 iMac & HP Workstations configured with Python, Java, VS Code",
                            "High-speed fiber internet for large downloads and builds",
                            "85-inch smart display for collaborative code reviews",
                            "Fast laser printer for project documentation"
                    ),
                    "09:20 ص (بعد انتهاء الجلسة المحددة)",
                    "09:20 AM (after current session)",
                    RoomStatus.IN_USE,
                    1
            ));

            if (eyad != null) {
                bookingRepository.save(new RoomBooking(
                        uniId,
                        r1,
                        eyad,
                        List.of("إياد الحربي (Classwork)", "راكان المطيري (Assignment)", "عبد العزيز البلوي (Homework)"),
                        "إنجاز التكاليف والمهام المشتركة (Classwork & Assignment)",
                        Instant.now().minus(Duration.ofMinutes(9)),
                        Instant.now().plus(Duration.ofMinutes(11)),
                        "09:00 ص",
                        "09:20 ص",
                        RoomBookingStatus.ACTIVE
                ));
            }
        }

        // 2. ROOM-A04 (Available)
        if (!roomRepository.existsByRoomCode("ROOM-A04")) {
            roomRepository.save(new StudyRoom(
                    uniId,
                    "ROOM-A04",
                    "قاعة المذاكرة والعمل الجماعي الذكية (Study Room A-04)",
                    "Collaborative Study Pod A-04",
                    "مبنى كلية الهندسة - الدور الأول",
                    "College of Engineering - 1st Floor",
                    "6 إلى 8 طلاب",
                    "6 to 8 Students",
                    "قاعة نقاش",
                    "Study Pod",
                    List.of(
                            "طاولة اجتماعات تفاعلية مع منافذ طاقة وشواحن Type-C متعددة",
                            "سبورة ذكية تفاعلية Interactive Whiteboard مع خاصية حفظ الملاحظات",
                            "شاشة عرض لاسلكية تدعم AirPlay و Miracast",
                            "عازل صوتي متكامل لضمان هدوء المذاكرة والتركيز"
                    ),
                    List.of(
                            "Interactive table with Type-C power docks",
                            "Smart Interactive Whiteboard with note export",
                            "Wireless projection supporting AirPlay and Miracast",
                            "Acoustic isolation for quiet group focus"
                    ),
                    "متاحة للحجز الفوري الآن",
                    "Available for immediate reservation",
                    RoomStatus.AVAILABLE,
                    2
            ));
        }

        // 3. LAB-205 (Available)
        if (!roomRepository.existsByRoomCode("LAB-205")) {
            roomRepository.save(new StudyRoom(
                    uniId,
                    "LAB-205",
                    "معمل التصميم المنطقي والدوائر الرقمية (Logic Design Lab 205)",
                    "Digital Logic & Circuit Lab 205",
                    "مبنى كلية الهندسة والحاسب - الدور الثاني",
                    "College of Engineering - 2nd Floor",
                    "16 محطة تجارب هندسية",
                    "16 Hardware Stations",
                    "معمل عتاد ودوائر",
                    "Logic Design Lab",
                    List.of(
                            "حقائب تدريبية متقدمة FPGA و Digital Logic Trainers",
                            "أجهزة راسم إشارة Oscilloscopes ومولدات إشارات ترددية",
                            "أطقم بوابات منطقية متكاملة (AND, OR, NOT, NAND, XOR)",
                            "إشراف فني متخصص وتجهيزات سلامة مهنية"
                    ),
                    List.of(
                            "Advanced FPGA trainers and digital logic testbeds",
                            "Digital oscilloscopes and waveform generators",
                            "Integrated circuit logic gate packages (TTL/CMOS)",
                            "Specialized lab safety and technical assistance"
                    ),
                    "متاحة للحجز الفوري الآن",
                    "Available for immediate reservation",
                    RoomStatus.AVAILABLE,
                    3
            ));
        }

        // 4. ROOM-C12 (Reserved)
        if (!roomRepository.existsByRoomCode("ROOM-C12")) {
            StudyRoom r4 = roomRepository.save(new StudyRoom(
                    uniId,
                    "ROOM-C12",
                    "حاضنة مشاريع التخرج والابتكار (Capstone Hub C-12)",
                    "Senior Capstone & Innovation Hub C-12",
                    "مبنى عمادة الحاسب - الدور الثاني",
                    "Computing Deanship - 2nd Floor",
                    "12 طالب",
                    "12 Students",
                    "حاضنة مشاريع",
                    "Capstone Pod",
                    List.of(
                            "طابعات ثلاثية الأبعاد 3D Printers ومحطات تصنيع نماذج أولية",
                            "حقائب إنترنت الأشياء IoT وحساسات ESP32 وكاميرات ALPR",
                            "شاشات عرض مزدوجة Dual 4K لمراجعة البرمجيات"
                    ),
                    List.of(
                            "3D Printers and rapid prototyping stations",
                            "IoT development kits, ESP32 boards, and ALPR cameras",
                            "Dual 4K displays for software architecture reviews"
                    ),
                    "11:00 ص",
                    "11:00 AM",
                    RoomStatus.RESERVED,
                    4
            ));

            if (rakan != null) {
                bookingRepository.save(new RoomBooking(
                        uniId,
                        r4,
                        rakan,
                        List.of("إياد الحربي", "راكان المطيري", "عبد العزيز البلوي"),
                        "استعراض النموذج النهائي واختبار الربط المباشر مع الدكاترة",
                        Instant.now().plus(Duration.ofMinutes(20)),
                        Instant.now().plus(Duration.ofMinutes(80)),
                        "10:00 ص",
                        "11:00 ص",
                        RoomBookingStatus.RESERVED
                ));
            }
        }

        log.info("--- [RoomsDataSeeder] Initialized collaborative study rooms and lab bookings ---");
    }
}

