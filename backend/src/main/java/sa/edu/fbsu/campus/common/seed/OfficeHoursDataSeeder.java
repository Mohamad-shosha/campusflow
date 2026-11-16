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
import sa.edu.fbsu.campus.officehours.domain.FacultyOfficeProfile;
import sa.edu.fbsu.campus.officehours.domain.OfficeHourSlot;
import sa.edu.fbsu.campus.officehours.infra.FacultyOfficeProfileRepository;
import sa.edu.fbsu.campus.officehours.infra.OfficeHourSlotRepository;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

@Component
@Profile("dev")
@ConditionalOnProperty(name = "fbsu.seed.demo-data", havingValue = "true")
@Order(3)
public class OfficeHoursDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(OfficeHoursDataSeeder.class);

    private final UniversityRepository universityRepository;
    private final UserRepository userRepository;
    private final FacultyOfficeProfileRepository profileRepository;
    private final OfficeHourSlotRepository slotRepository;

    public OfficeHoursDataSeeder(
            UniversityRepository universityRepository,
            UserRepository userRepository,
            FacultyOfficeProfileRepository profileRepository,
            OfficeHourSlotRepository slotRepository
    ) {
        this.universityRepository = universityRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.slotRepository = slotRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        University fbsu = universityRepository.findByCode("FBSU").orElse(null);
        if (fbsu == null) {
            return;
        }
        UUID uniId = fbsu.getId();
        LocalDate baseDay = LocalDate.now().plusDays(1);

        User drRaghad = userRepository.findByUniversityNumber("FAC-8821").orElse(null);
        User drMezher = userRepository.findByUniversityNumber("FAC-7700").orElse(null);
        User drGhamdi = userRepository.findByUniversityNumber("FAC-9912").orElse(null);

        if (drRaghad != null && !profileRepository.existsByProfileCode("drRaghad")) {
            FacultyOfficeProfile p1 = profileRepository.save(new FacultyOfficeProfile(
                    uniId,
                    "drRaghad",
                    drRaghad,
                    "رئيسة قسم كلية الحاسبات وتكنولوجيا المعلومات",
                    "Chairperson - Computer Science & Engineering Dept",
                    "كلية الحاسب الآلي",
                    "College of Computing",
                    "مكتب رئيسة القسم - مبنى الحاسب C-105",
                    "رئيسة القسم",
                    "Dept Chairperson",
                    "#116E63",
                    "الأحد والثلاثاء (10:00 ص - 12:30 م)",
                    "Sun & Tue (10:00 AM - 12:30 PM)",
                    "اليوم الأحد: 11:15 ص",
                    "Sunday: 11:15 AM",
                    List.of(
                            "التصميم المنطقي (Logic Design)",
                            "معمارية الحاسب (Computer Architecture)",
                            "الإشراف على مشاريع التخرج",
                            "الإرشاد الأكاديمي ومعادلة المقررات"
                    ),
                    1
            ));
            seedSlot(uniId, p1, baseDay, 11, 0, 15, "11:00 ص", "11:00 AM", true, null);
            seedSlot(uniId, p1, baseDay, 11, 15, 15, "11:15 ص", "11:15 AM", true, null);
            seedSlot(uniId, p1, baseDay, 11, 30, 30, "11:30 ص", "11:30 AM", false, "محجوز - مناقشة مشروع تخرج");
            seedSlot(uniId, p1, baseDay, 12, 0, 15, "12:00 م", "12:00 PM", true, null);
            seedSlot(uniId, p1, baseDay, 12, 15, 15, "12:15 م", "12:15 PM", true, null);
        }

        if (drMezher != null && !profileRepository.existsByProfileCode("drMezher")) {
            FacultyOfficeProfile p2 = profileRepository.save(new FacultyOfficeProfile(
                    uniId,
                    "drMezher",
                    drMezher,
                    "عميد كلية الحاسب الآلي وتقنية المعلومات",
                    "Dean - College of Computing & Information Technology",
                    "كلية الحاسب الآلي",
                    "College of Computing",
                    "جناح العميد - مبنى الإدارة الأكاديمية C-201",
                    "عميد الكلية",
                    "College Dean",
                    "#d7a237",
                    "الاثنين والأربعاء (11:00 ص - 02:00 م)",
                    "Mon & Wed (11:00 AM - 02:00 PM)",
                    "الاثنين القادم: 01:15 م",
                    "Monday: 01:15 PM",
                    List.of(
                            "مبادرات الذكاء الاصطناعي والحوسبة المتقدمة",
                            "مناقشة الأفكار البحثية ومشاريع التخرج الكبرى",
                            "الشؤون الأكاديمية والخطط الدراسية",
                            "اعتماد الشراكات والهاكاثونات الطلابية"
                    ),
                    2
            ));
            seedSlot(uniId, p2, baseDay.plusDays(1), 13, 0, 15, "01:00 م", "01:00 PM", true, null);
            seedSlot(uniId, p2, baseDay.plusDays(1), 13, 15, 30, "01:15 م", "01:15 PM", true, null);
            seedSlot(uniId, p2, baseDay.plusDays(1), 13, 45, 15, "01:45 م", "01:45 PM", false, "اجتماع مجلس الكلية");
            seedSlot(uniId, p2, baseDay.plusDays(1), 14, 0, 30, "02:00 م", "02:00 PM", true, null);
        }

        if (drGhamdi != null && !profileRepository.existsByProfileCode("doctor")) {
            FacultyOfficeProfile p3 = profileRepository.save(new FacultyOfficeProfile(
                    uniId,
                    "doctor",
                    drGhamdi,
                    "أستاذ مشارك - منسق مشاريع التخرج",
                    "Associate Professor - Capstone Coordinator",
                    "كلية الحاسب والهندسة",
                    "College of Computing & Engineering",
                    "مبنى الهندسة - مكتب A-114",
                    "أستاذ مشارك",
                    "Associate Professor",
                    "#8b5cf6",
                    "يومياً (01:00 م - 02:00 م)",
                    "Daily (01:00 PM - 02:00 PM)",
                    "اليوم: 01:30 م",
                    "Today: 01:30 PM",
                    List.of(
                            "هندسة البرمجيات وتطوير النظم",
                            "قواعد البيانات ونظم المعلومات",
                            "لجنة تحكيم مشاريع التخرج"
                    ),
                    3
            ));
            seedSlot(uniId, p3, baseDay, 13, 0, 15, "01:00 م", "01:00 PM", true, null);
            seedSlot(uniId, p3, baseDay, 13, 15, 15, "01:15 م", "01:15 PM", true, null);
            seedSlot(uniId, p3, baseDay, 13, 30, 15, "01:30 م", "01:30 PM", true, null);
            seedSlot(uniId, p3, baseDay, 13, 45, 15, "01:45 م", "01:45 PM", true, null);
        }

        applyEnglishToDemoProfiles();
        refreshStaleDemoSlots(uniId, baseDay);

        log.info("--- [OfficeHoursDataSeeder] Initialized faculty office-hour profiles and windows ---");
    }

    /**
     * Demo slots are seeded once with dates relative to the first startup, so after a few days every
     * slot is in the past and nothing can be booked. Give each demo profile with no upcoming free slot
     * a fresh set for tomorrow (dev profile only; past slots are kept as history).
     */
    private void refreshStaleDemoSlots(UUID uniId, LocalDate day) {
        Instant now = Instant.now();
        for (FacultyOfficeProfile profile : profileRepository.findAll()) {
            if (!uniId.equals(profile.getUniversityId())) {
                continue;
            }
            boolean hasUpcoming = slotRepository.findByProfileIdOrderByStartTimeAsc(profile.getId()).stream()
                    .anyMatch(sl -> sl.isAvailable() && sl.getStartTime().isAfter(now));
            if (!hasUpcoming) {
                seedSlot(uniId, profile, day, 10, 0, 15, "10:00 ص", "10:00 AM", true, null);
                seedSlot(uniId, profile, day, 10, 30, 15, "10:30 ص", "10:30 AM", true, null);
                seedSlot(uniId, profile, day, 11, 0, 30, "11:00 ص", "11:00 AM", true, null);
                log.info("[OfficeHoursDataSeeder] Added upcoming demo slots for profile {}", profile.getProfileCode());
            }
        }
    }

    private void seedSlot(
            UUID uniId,
            FacultyOfficeProfile profile,
            LocalDate day,
            int hour,
            int minute,
            int durationMins,
            String labelAr,
            String labelEn,
            boolean available,
            String note
    ) {
        Instant start = day.atTime(LocalTime.of(hour, minute)).toInstant(ZoneOffset.ofHours(3));
        Instant end = start.plus(Duration.ofMinutes(durationMins));
        slotRepository.save(new OfficeHourSlot(
                uniId, profile, start, end, labelAr, labelEn, durationMins, available, note
        ));
    }

    /** English office location and courses for the demo profiles (also fills rows seeded before V21). */
    private static final java.util.Map<String, java.util.Map.Entry<String, List<String>>> DEMO_ENGLISH = java.util.Map.of(
            "drRaghad", java.util.Map.entry("Chairperson's office - Computing building C-105", List.of(
                    "Logic Design", "Computer Architecture", "Graduation project supervision",
                    "Academic advising and course equivalency")),
            "drMezher", java.util.Map.entry("Dean's suite - Academic Administration building C-201", List.of(
                    "AI and advanced computing initiatives", "Research ideas and major graduation projects",
                    "Academic affairs and study plans", "Student partnerships and hackathons")),
            "doctor", java.util.Map.entry("Engineering building - Office A-114", List.of(
                    "Software engineering and systems development", "Databases and information systems",
                    "Graduation project judging committee"))
    );

    private void applyEnglishToDemoProfiles() {
        DEMO_ENGLISH.forEach((code, english) -> profileRepository.findAll().stream()
                .filter(p -> code.equals(p.getProfileCode()) && !p.hasEnglish())
                .forEach(p -> {
                    p.setEnglish(english.getKey(), english.getValue());
                    profileRepository.save(p);
                }));
    }
}
