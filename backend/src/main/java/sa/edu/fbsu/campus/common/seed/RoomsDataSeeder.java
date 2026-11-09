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

        // 5. LAB-101 (AI & Deep Learning)
        if (!roomRepository.existsByRoomCode("LAB-101")) {
            roomRepository.save(new StudyRoom(
                    uniId,
                    "LAB-101",
                    "معمل الذكاء الاصطناعي وتعلم الآلة (AI & Deep Learning Lab 101)",
                    "Artificial Intelligence & Deep Learning Lab 101",
                    "مبنى كلية الحاسب - الدور الأرضي",
                    "College of Computing - Ground Floor",
                    "30 محطة عمل مجهزة بـ GPU",
                    "30 Workstations with GPU",
                    "معمل ذكاء اصطناعي",
                    "AI & ML Lab",
                    List.of(
                            "30 محطة عمل مزودة بكروت شاشة NVIDIA RTX 4090 لتدريب النماذج العصبية",
                            "بيئة برمجية جاهزة: PyTorch, TensorFlow, CUDA Toolkit, JupyterHub",
                            "شاشة عرض تفاعلية 98 بوصة لمناقشة أداء نماذج الرؤية الحاسوبية",
                            "اتصال شبكي فائق السرعة بسرعة 10 Gbps مع خوادم الحوسبة السحابية"
                    ),
                    List.of(
                            "30 High-end Workstations with NVIDIA RTX 4090 GPUs",
                            "Preloaded environments: PyTorch, TensorFlow, CUDA, JupyterHub",
                            "98-inch 4K interactive whiteboard for deep learning discussions",
                            "Dedicated 10 Gbps low-latency link to campus compute cluster"
                    ),
                    "متاح للحجز الفوري الآن",
                    "Available for immediate reservation",
                    RoomStatus.AVAILABLE,
                    5
            ));
        }

        // 6. LAB-103 (Cybersecurity & NOC)
        if (!roomRepository.existsByRoomCode("LAB-103")) {
            roomRepository.save(new StudyRoom(
                    uniId,
                    "LAB-103",
                    "معمل الأمن السيبراني وعمليات الشبكات (Cybersecurity & NOC 103)",
                    "Cybersecurity & Network Operations Center (NOC) 103",
                    "مبنى كلية الحاسب - الدور الأول",
                    "College of Computing - 1st Floor",
                    "20 محطة هجوم ودفاع سيبراني",
                    "20 Red/Blue Team Stations",
                    "معمل أمن سيبراني",
                    "Cyber & NOC Lab",
                    List.of(
                            "شبكة معزولة Air-Gapped لمحاكاة الهجمات السيبرانية واختبار الاختراق",
                            "أجهزة راوتر وسويتشات Cisco Catalyst مع جدران حماية فورتينت Fortinet",
                            "شاشة مركز عمليات الأمن (SOC Wall) لمراقبة حركة حزم البيانات اللحظية",
                            "توزيعات كالي لينكس Kali Linux وأدوات تحليل الحزم Wireshark و Metasploit"
                    ),
                    List.of(
                            "Air-gapped cyber sandbox for attack/defense simulation",
                            "Cisco Catalyst routers & switches with Fortinet firewalls",
                            "SOC Wall multi-monitor dashboard for live packet traffic analysis",
                            "Preloaded Kali Linux, Wireshark, Metasploit, and SIEM tooling"
                    ),
                    "متاح للحجز الفوري الآن",
                    "Available for immediate reservation",
                    RoomStatus.AVAILABLE,
                    6
            ));
        }

        // 7. LAB-104 (Robotics & Embedded Systems)
        if (!roomRepository.existsByRoomCode("LAB-104")) {
            roomRepository.save(new StudyRoom(
                    uniId,
                    "LAB-104",
                    "معمل النظم المدمجة والروبوتات (Robotics & Embedded Workshop 104)",
                    "Robotics & Embedded Systems Workshop 104",
                    "مبنى كلية الهندسة - الدور الأرضي",
                    "College of Engineering - Ground Floor",
                    "18 طاولة تصنيع وتجارب",
                    "18 Prototyping Workbenches",
                    "معمل روبوتات وعتاذة",
                    "Robotics Workshop",
                    List.of(
                            "حقائب تطوير أردوينو Arduino و STM32 و Raspberry Pi 5",
                            "أذرع روبوتية سداسية المحاور 6-DOF Robotic Arms قابلة للبرمجة",
                            "محطات لحام رقمية مجهزة بشفاطات أدخنة وفاحصات دوائر إلكترونية",
                            "طابعات ثلاثية الأبعاد Resin & FDM لصناعة هياكل الروبوتات"
                    ),
                    List.of(
                            "Arduino, STM32, and Raspberry Pi 5 development toolkits",
                            "6-DOF programmable robotic arms for industrial automation labs",
                            "Digital soldering stations with fume extractors and multimeters",
                            "Resin and FDM 3D printers for custom robotic chassis printing"
                    ),
                    "متاح للحجز الفوري الآن",
                    "Available for immediate reservation",
                    RoomStatus.AVAILABLE,
                    7
            ));
        }

        // 8. ROOM-B08 (Academic Seminar Pod)
        if (!roomRepository.existsByRoomCode("ROOM-B08")) {
            roomRepository.save(new StudyRoom(
                    uniId,
                    "ROOM-B08",
                    "قاعة النقاش الأكاديمي والسيمنار (Academic Seminar Pod B-08)",
                    "Academic Seminar & Discussion Pod B-08",
                    "مبنى كلية إدارة الأعمال - الدور الثاني",
                    "College of Business - 2nd Floor",
                    "10 طلاب وباحثين",
                    "10 Students & Researchers",
                    "قاعة نقاش أكاديمي",
                    "Seminar Pod",
                    List.of(
                            "نظام مؤتمرات فيديو متكامل Logitech Rally يدعم Zoom و Microsoft Teams",
                            "طاولة نقاش بيضاوية مزودة بميكروفونات مدمجة لكل مقعد",
                            "شاشة عرض تفاعلية 75 بوصة تدعم اللمس المتعدد ومشاركة الشاشات اللاسلكية",
                            "نظام عزل صوتي مزدوج يمنع تسرب الصوت للقاعات المجاورة"
                    ),
                    List.of(
                            "Logitech Rally 4K conference system for Zoom & MS Teams meetings",
                            "Executive boardroom oval table with integrated array microphones",
                            "75-inch touch screen with seamless multi-device screen mirroring",
                            "Double acoustic glazing ensuring complete sound isolation"
                    ),
                    "متاح للحجز الفوري الآن",
                    "Available for immediate reservation",
                    RoomStatus.AVAILABLE,
                    8
            ));
        }

        // 9. POD-D01 (Silent Focus Pod)
        if (!roomRepository.existsByRoomCode("POD-D01")) {
            roomRepository.save(new StudyRoom(
                    uniId,
                    "POD-D01",
                    "كابينة التركيز الفردي والمذاكرة الهادئة (Silent Focus Pod D-01)",
                    "Silent Focus & Solo Study Pod D-01",
                    "المكتبة المركزية - الدور الأول",
                    "Central Library - 1st Floor",
                    "طالب واحد (فردي)",
                    "1 Student (Solo)",
                    "كابينة تركيز فردي",
                    "Quiet Pod",
                    List.of(
                            "عزل صوتي فائق الدرجة 40dB يمنع أي ضوضاء خارجية تماماً",
                            "كرسي مريح معتمد صحياً Ergonomic Chair مع طاولة قابلة لتعديل الارتفاع",
                            "إضاءة دراسة قابلة لتعديل درجة الحرارة اللونية (دافئة / طبيعية / بيضاء)",
                            "منافذ طاقة وشحن سريع Type-C PD 100W للابتوب والهواتف الذكية"
                    ),
                    List.of(
                            "Ultra-high acoustic isolation rated at 40dB sound attenuation",
                            "Ergonomic mesh chair with height-adjustable sit/stand study desk",
                            "Circadian study lamp with adjustable warm-to-cool color temperatures",
                            "High-output 100W USB-C PD power ports for laptops and mobile devices"
                    ),
                    "متاح للحجز الفوري الآن",
                    "Available for immediate reservation",
                    RoomStatus.AVAILABLE,
                    9
            ));
        }

        // 10. POD-D02 (Virtual Interview Pod)
        if (!roomRepository.existsByRoomCode("POD-D02")) {
            roomRepository.save(new StudyRoom(
                    uniId,
                    "POD-D02",
                    "كابينة المقابلات الافتراضية والتسجيل (Virtual Interview Pod D-02)",
                    "Virtual Interview & Media Recording Pod D-02",
                    "المكتبة المركزية - الدور الأول",
                    "Central Library - 1st Floor",
                    "طالب واحد (فردي)",
                    "1 Student (Solo)",
                    "كابينة مقابلات افتراضية",
                    "Media / Interview Pod",
                    List.of(
                            "كاميرا احترافية 4K مع إضاءة استوديو دائرية Ring Light مخصصة للمقابلات الوظيفية",
                            "ميكروفون مكتبي مكثف بنمط إلغاء الضجيج المحيط Studio Condenser Mic",
                            "خلفية استوديو أنيقة ومحايدة تتوافق مع معايير المقابلات والتقديم الوظيفي",
                            "اتصال إنترنت سلكي مباشر Gigabit Ethernet لضمان عدم انقطاع البث والمقابلات"
                    ),
                    List.of(
                            "Professional 4K webcam with dual dimmable ring lights for job interviews",
                            "Studio condenser microphone with active noise cancellation",
                            "Professional acoustic backdrop tailored for high-stakes video interviews",
                            "Direct wired Gigabit Ethernet connection ensuring zero streaming latency"
                    ),
                    "متاح للحجز الفوري الآن",
                    "Available for immediate reservation",
                    RoomStatus.AVAILABLE,
                    10
            ));
        }

        log.info("--- [RoomsDataSeeder] Initialized collaborative study rooms and lab bookings ---");
    }
}

