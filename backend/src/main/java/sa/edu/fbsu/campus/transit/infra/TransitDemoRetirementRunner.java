package sa.edu.fbsu.campus.transit.infra;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.transit.domain.ShuttleBus;
import sa.edu.fbsu.campus.transit.domain.ShuttleStatus;
import sa.edu.fbsu.campus.transit.domain.TransitRoute;
import sa.edu.fbsu.campus.transit.domain.TransitRouteStatus;

import java.util.List;

/**
 * Production-only non-destructive retirement runner per ADR-0004 (Option C).
 * Marks V15-seeded demo transit routes INACTIVE and demo shuttles OUT_OF_SERVICE
 * without deleting rows so historical transit_pass foreign keys remain intact.
 */
@Component
@Profile("prod")
public class TransitDemoRetirementRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(TransitDemoRetirementRunner.class);
    public static final String DEMO_V15_SOURCE = "DEMO_V15";

    private final TransitRouteRepository routeRepository;
    private final ShuttleBusRepository shuttleRepository;

    public TransitDemoRetirementRunner(
            TransitRouteRepository routeRepository,
            ShuttleBusRepository shuttleRepository
    ) {
        this.routeRepository = routeRepository;
        this.shuttleRepository = shuttleRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        retireDemoData();
    }

    @Transactional
    public void retireDemoData() {
        int retiredRoutes = 0;
        List<TransitRoute> demoRoutes = routeRepository.findBySource(DEMO_V15_SOURCE);
        for (TransitRoute route : demoRoutes) {
            if (route.getStatus() != TransitRouteStatus.INACTIVE) {
                route.setStatus(TransitRouteStatus.INACTIVE);
                routeRepository.save(route);
                retiredRoutes++;
            }
        }

        int retiredShuttles = 0;
        List<ShuttleBus> demoShuttles = shuttleRepository.findBySource(DEMO_V15_SOURCE);
        for (ShuttleBus shuttle : demoShuttles) {
            if (shuttle.getStatus() != ShuttleStatus.OUT_OF_SERVICE) {
                shuttle.setStatus(ShuttleStatus.OUT_OF_SERVICE);
                shuttleRepository.save(shuttle);
                retiredShuttles++;
            }
        }

        if (retiredRoutes > 0 || retiredShuttles > 0) {
            log.info("ADR-0004 prod retirement completed: retired {} DEMO_V15 routes and {} DEMO_V15 shuttles",
                    retiredRoutes, retiredShuttles);
        }
    }
}

