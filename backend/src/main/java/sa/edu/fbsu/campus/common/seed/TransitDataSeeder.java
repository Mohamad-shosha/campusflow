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
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.transit.domain.ShuttleBus;
import sa.edu.fbsu.campus.transit.domain.ShuttleStatus;
import sa.edu.fbsu.campus.transit.domain.TransitRoute;
import sa.edu.fbsu.campus.transit.domain.TransitRouteStatus;
import sa.edu.fbsu.campus.transit.domain.TransitStop;
import sa.edu.fbsu.campus.transit.infra.ShuttleBusRepository;
import sa.edu.fbsu.campus.transit.infra.TransitRouteRepository;

import java.util.List;
import java.util.UUID;

/**
 * Dev-only idempotent transit demo data seeder per ADR-0004 follow-up.
 * Ensures sample routes, stops, and electric shuttles are available in dev/test
 * even on clean schemas where V15 demo rows were retired or omitted.
 */
@Component
@Profile("dev")
@ConditionalOnProperty(name = "fbsu.seed.demo-data", havingValue = "true")
@Order(6)
public class TransitDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(TransitDataSeeder.class);

    private final UniversityRepository universityRepository;
    private final TransitRouteRepository routeRepository;
    private final ShuttleBusRepository shuttleRepository;

    public TransitDataSeeder(
            UniversityRepository universityRepository,
            TransitRouteRepository routeRepository,
            ShuttleBusRepository shuttleRepository
    ) {
        this.universityRepository = universityRepository;
        this.routeRepository = routeRepository;
        this.shuttleRepository = shuttleRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        University fbsu = universityRepository.findByCode("FBSU").orElse(null);
        if (fbsu == null) {
            return;
        }
        UUID uniId = fbsu.getId();

        TransitRoute express = ensureRoute(
                uniId,
                "ROUTE-EXPRESS",
                "المسار السريع الأخضر (البوابة الرئيسية ↔ كليات الهندسة والحاسب)",
                "Express Green Line (Main Gate ↔ Engineering & Computing)",
                "#10b981",
                "07:30 ص - 05:30 م",
                "07:30 AM - 05:30 PM",
                8,
                1,
                List.of(
                        new StopDef("STOP-EX-01", "محطة البوابة الشمالية الرئيسية (North Gate)", "Main North Gate Station", "أمام البوابة الرئيسية وبجوار مواقف الزوار قطاع E", "In front of Main Gate next to Zone E parking", 1, 0),
                        new StopDef("STOP-EX-02", "محطة كلية الحاسب وتقنية المعلومات (IT Stop)", "College of Computing & IT Station", "المدخل الشرقي لمبنى كلية الحاسب الدور الأرضي", "East entrance of Computing College, Ground Floor", 2, 4),
                        new StopDef("STOP-EX-03", "محطة مجمع المعامل والهندسة ومواقف قطاع A", "Engineering Complex & Zone A Labs", "أمام مبنى الورش الهندسية ومعامل الذكاء الاصطناعي", "Facing Engineering Labs & AI Research Center", 3, 8)
                )
        );

        TransitRoute golden = ensureRoute(
                uniId,
                "ROUTE-GOLDEN",
                "المسار الذهبي الدائري (كافة الكليات والمكتبة المركزية وصالة القبول)",
                "Golden Campus Loop (All Colleges, Library & Admissions)",
                "#d7a237",
                "07:30 ص - 06:00 م",
                "07:30 AM - 06:00 PM",
                10,
                2,
                List.of(
                        new StopDef("STOP-GL-01", "محطة كلية إدارة الأعمال ومواقف قطاع B", "College of Business & Zone B Hub", "الساحة الخارجية لكلية إدارة الأعمال ومطعم ستاربكس", "Business College courtyard next to Starbucks", 1, 0),
                        new StopDef("STOP-GL-02", "محطة المكتبة المركزية وصالة القبول والتسجيل", "Central Library & Admissions Hall", "المدخل الرئيسي للمكتبة المركزية وصالة الخدمات الطلابية", "Main entrance of Central Library & Student Services", 2, 5),
                        new StopDef("STOP-GL-03", "محطة مبنى الإدارة العامة وعمادة شؤون الطلاب", "University Administration & Deanship", "بجوار مبنى إدارة الجامعة والمواقف الشرفية قطاع C", "Next to Admin Building & Zone C Faculty Parking", 3, 10)
                )
        );

        TransitRoute dorms = ensureRoute(
                uniId,
                "ROUTE-DORMS",
                "مسار السكن الجامعي والصالة الرياضية (السكن ↔ الكليات)",
                "Residential Dorms & Sports Arena Line (Dorms ↔ Colleges)",
                "#06b6d4",
                "07:00 ص - 09:30 م",
                "07:00 AM - 09:30 PM",
                15,
                3,
                List.of(
                        new StopDef("STOP-DR-01", "محطة مجمع السكن الطلابي والأنشطة", "Student Housing Complex & Club", "أمام مبنى سكن الطلاب رقم 3 وصالة اللياقة البدنية", "In front of Dorm Building 3 & Fitness Arena", 1, 0),
                        new StopDef("STOP-DR-02", "محطة الصالة الرياضية المغلقة والملاعب", "Sports Arena & Campus Stadium", "بوابة الصالة الرياضية متعددة الأغراض", "Main Gate of Multi-purpose Sports Arena", 2, 7)
                )
        );

        ensureShuttle(uniId, express, "FBSU-BUS-01", "أ ح د", "4582", "BYD K8 Pure Electric Eco-Shuttle", 28, 12, "عبدالله السعدي", "Abdullah Al-Saadi", ShuttleStatus.IN_TRANSIT, 0, 2, 3, 92);
        ensureShuttle(uniId, golden, "FBSU-BUS-02", "ر ق م", "8812", "Yutong E10 Smart Autonomous-Ready Bus", 32, 19, "سالم البلوي", "Salem Al-Balawi", ShuttleStatus.BOARDING, 0, 1, 1, 86);
        ensureShuttle(uniId, dorms, "FBSU-BUS-03", "ط ب ق", "3190", "BYD K8 Pure Electric Eco-Shuttle", 28, 6, "منصور العنزي", "Mansour Al-Anazi", ShuttleStatus.IN_TRANSIT, 0, 1, 5, 78);
    }

    private TransitRoute ensureRoute(
            UUID uniId,
            String routeCode,
            String nameAr,
            String nameEn,
            String colorHex,
            String hoursAr,
            String hoursEn,
            int freqMins,
            int displayOrder,
            List<StopDef> stopDefs
    ) {
        return routeRepository.findByRouteCode(routeCode).orElseGet(() -> {
            TransitRoute route = new TransitRoute(
                    uniId, routeCode, nameAr, nameEn, colorHex, hoursAr, hoursEn,
                    freqMins, TransitRouteStatus.ACTIVE, displayOrder
            );
            route.setSource("DEV_SEED");
            for (StopDef def : stopDefs) {
                TransitStop stop = new TransitStop(
                        uniId, route, def.code, def.nameAr, def.nameEn,
                        def.descAr, def.descEn, def.order, def.etaMins, true, true
                );
                route.getStops().add(stop);
            }
            TransitRoute saved = routeRepository.save(route);
            log.debug("TransitDataSeeder created dev route {}", routeCode);
            return saved;
        });
    }

    private void ensureShuttle(
            UUID uniId,
            TransitRoute route,
            String busNumber,
            String plateLettersAr,
            String plateDigits,
            String modelName,
            int capacity,
            int occupied,
            String driverAr,
            String driverEn,
            ShuttleStatus status,
            int currentStopIdx,
            int nextStopIdx,
            int etaMins,
            int batteryPct
    ) {
        if (shuttleRepository.existsByBusNumber(busNumber)) {
            return;
        }
        List<TransitStop> stops = route.getStops();
        TransitStop currentStop = stops.size() > currentStopIdx ? stops.get(currentStopIdx) : null;
        TransitStop nextStop = stops.size() > nextStopIdx ? stops.get(nextStopIdx) : null;

        ShuttleBus bus = new ShuttleBus(
                uniId, route, busNumber, plateLettersAr, plateDigits, modelName,
                capacity, occupied, true, driverAr, driverEn, status,
                currentStop, nextStop, etaMins, batteryPct
        );
        bus.setSource("DEV_SEED");
        shuttleRepository.save(bus);
        log.debug("TransitDataSeeder created dev shuttle {}", busNumber);
    }

    private record StopDef(
            String code,
            String nameAr,
            String nameEn,
            String descAr,
            String descEn,
            int order,
            int etaMins
    ) {}
}

