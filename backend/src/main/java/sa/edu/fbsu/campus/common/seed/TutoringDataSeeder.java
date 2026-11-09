package sa.edu.fbsu.campus.common.seed;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.tutoring.domain.TutoringEnrollment;
import sa.edu.fbsu.campus.tutoring.domain.TutoringSession;
import sa.edu.fbsu.campus.tutoring.infra.TutoringEnrollmentRepository;
import sa.edu.fbsu.campus.tutoring.infra.TutoringSessionRepository;

import java.math.BigDecimal;
import java.util.UUID;

@Component
@Profile("dev")
@ConditionalOnProperty(name = "fbsu.seed.demo-data", havingValue = "true")
@Order(2)
public class TutoringDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(TutoringDataSeeder.class);

    private final UniversityRepository universityRepository;
    private final UserRepository userRepository;
    private final TutoringSessionRepository sessionRepository;
    private final TutoringEnrollmentRepository enrollmentRepository;

    public TutoringDataSeeder(
            UniversityRepository universityRepository,
            UserRepository userRepository,
            TutoringSessionRepository sessionRepository,
            TutoringEnrollmentRepository enrollmentRepository
    ) {
        this.universityRepository = universityRepository;
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.enrollmentRepository = enrollmentRepository;
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
        User fatima = userRepository.findByUniversityNumber("STD-202410102").orElse(null);
        User omar = userRepository.findByUniversityNumber("STD-202410103").orElse(null);

        if (eyad == null || rakan == null || fatima == null) {
            return;
        }

        if (!sessionRepository.existsBySessionCode("TUT-101")) {
            TutoringSession s1 = new TutoringSession(
                    uniId,
                    "TUT-101",
                    eyad,
                    "طالب متميز - كلية الهندسة",
                    "Honor Student - College of Engineering",
                    "#116E63",
                    "MATH 101 / MATH 201",
                    "حساب التفاضل والتكامل والرياضيات الهندسية",
                    "Calculus & Engineering Mathematics",
                    "المحاضرات 1 إلى 4 (Lectures 1, 2, 3, 4)",
                    "شرح مبسط لمفاهيم النهايات والاشتقاق، وحل أسئلة الواجبات ونماذج الاختبارات السابقة حتى نهاية الشابتر.",
                    "math",
                    new BigDecimal("70.00"),
                    new BigDecimal("1.00"),
                    "اليوم الأحد - 04:30 م",
                    "قاعة المذاكرة الذكية A-04 (أو أونلاين عبر المنصة)",
                    10
            );
            TutoringSession savedS1 = sessionRepository.save(s1);
            enrollmentRepository.save(new TutoringEnrollment(
                    uniId, savedS1, rakan, savedS1.getTotalPrice(), "seed-enroll-TUT-101-rakan"
            ));
        }

        if (!sessionRepository.existsBySessionCode("TUT-102")) {
            TutoringSession s2 = new TutoringSession(
                    uniId,
                    "TUT-102",
                    rakan,
                    "طالب متميز - كلية الحاسب الآلي",
                    "Honor Student - College of Computing",
                    "#d7a237",
                    "CS 110 / CS 210",
                    "مبادئ البرمجة وهياكل البيانات (Python & C++)",
                    "Programming & Data Structures",
                    "الشابتر الأول والثاني كاملاً (Chapters 1 & 2)",
                    "كتابة الأكواد العملية، خوارزميات الترتيب والبحث، وحل أسئلة الكلاس وورك والتكليف الأسبوعي.",
                    "programming",
                    new BigDecimal("70.00"),
                    new BigDecimal("1.00"),
                    "غداً الاثنين - 02:00 م",
                    "معمل الحاسب 102 (Computer Lab 102)",
                    10
            );
            TutoringSession savedS2 = sessionRepository.save(s2);
            if (omar != null) {
                enrollmentRepository.save(new TutoringEnrollment(
                        uniId, savedS2, omar, savedS2.getTotalPrice(), "seed-enroll-TUT-102-omar"
                ));
            }
        }

        if (!sessionRepository.existsBySessionCode("TUT-103")) {
            TutoringSession s3 = new TutoringSession(
                    uniId,
                    "TUT-103",
                    fatima,
                    "طالبة متميزة - علوم الحاسب",
                    "Honor Student - Computer Science",
                    "#ec4899",
                    "CEN 220",
                    "التصميم المنطقي الرقمي (Digital Logic Design)",
                    "Digital Logic & Circuit Design",
                    "المحاضرات 1 إلى 4 (Lectures 1, 2, 3, 4)",
                    "شرح خرائط كارنوف (K-Maps)، تبسيط الدوائر المنطقية، وبوابات NAND/NOR والتطبيق على حقائب المعمل.",
                    "hardware",
                    new BigDecimal("70.00"),
                    new BigDecimal("1.00"),
                    "الثلاثاء - 01:15 م",
                    "معمل التصميم المنطقي Lab 205",
                    10
            );
            sessionRepository.save(s3);
        }

        if (!sessionRepository.existsBySessionCode("TUT-104")) {
            TutoringSession s4 = new TutoringSession(
                    uniId,
                    "TUT-104",
                    eyad,
                    "طالب متميز - كلية الهندسة",
                    "Honor Student - College of Engineering",
                    "#116E63",
                    "PHYS 101",
                    "الفيزياء العامة (الميكانيكا والديناميكا)",
                    "General Physics & Mechanics",
                    "مراجعة الميدتيرم الشاملة (المحاضرة 1 حتى 5)",
                    "قوانين نيوتن للحركة وحفظ الطاقة الميكانيكية وتطبيقات المسائل الهندسية المعقدة.",
                    "math",
                    new BigDecimal("70.00"),
                    new BigDecimal("1.50"),
                    "الأربعاء - 05:00 م",
                    "قاعة المذاكرة B-12",
                    10
            );
            sessionRepository.save(s4);
        }

        log.info("--- [TutoringDataSeeder] Initialized peer tutoring demo sessions ---");
    }
}

