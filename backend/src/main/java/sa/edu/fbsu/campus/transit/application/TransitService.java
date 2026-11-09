package sa.edu.fbsu.campus.transit.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.transit.domain.ShuttleBus;
import sa.edu.fbsu.campus.transit.domain.TransitPass;
import sa.edu.fbsu.campus.transit.domain.TransitRoute;
import sa.edu.fbsu.campus.transit.domain.TransitStop;
import sa.edu.fbsu.campus.transit.dto.BookTransitPassRequest;
import sa.edu.fbsu.campus.transit.dto.ShuttleBusResponse;
import sa.edu.fbsu.campus.transit.dto.TransitPassResponse;
import sa.edu.fbsu.campus.transit.dto.TransitRouteResponse;
import sa.edu.fbsu.campus.transit.infra.ShuttleBusRepository;
import sa.edu.fbsu.campus.transit.infra.TransitPassRepository;
import sa.edu.fbsu.campus.transit.infra.TransitRouteRepository;
import sa.edu.fbsu.campus.transit.infra.TransitStopRepository;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class TransitService {

    private static final Logger log = LoggerFactory.getLogger(TransitService.class);

    private final TransitRouteRepository routeRepository;
    private final TransitStopRepository stopRepository;
    private final ShuttleBusRepository shuttleRepository;
    private final TransitPassRepository passRepository;
    private final UserRepository userRepository;

    public TransitService(
            TransitRouteRepository routeRepository,
            TransitStopRepository stopRepository,
            ShuttleBusRepository shuttleRepository,
            TransitPassRepository passRepository,
            UserRepository userRepository
    ) {
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
        this.shuttleRepository = shuttleRepository;
        this.passRepository = passRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TransitRouteResponse> getAllRoutes(UUID universityId) {
        Objects.requireNonNull(universityId, "University ID cannot be null");
        return routeRepository.findAllWithStopsByUniversityId(universityId)
                .stream()
                .map(TransitRouteResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ShuttleBusResponse> getLiveShuttles(UUID universityId) {
        Objects.requireNonNull(universityId, "University ID cannot be null");
        return shuttleRepository.findAllDetailedByUniversityId(universityId)
                .stream()
                .map(ShuttleBusResponse::fromEntity)
                .toList();
    }

    @Transactional
    public TransitPassResponse bookBoardingPass(UUID userId, BookTransitPassRequest request) {
        Objects.requireNonNull(userId, "User ID cannot be null");
        Objects.requireNonNull(request, "Request cannot be null");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        TransitRoute route = routeRepository.findById(request.routeId())
                .orElseThrow(() -> new ResourceNotFoundException("Transit route not found: " + request.routeId()));

        TransitStop pickup = stopRepository.findById(request.pickupStopId())
                .orElseThrow(() -> new ResourceNotFoundException("Pickup stop not found: " + request.pickupStopId()));

        TransitStop dropoff = stopRepository.findById(request.dropoffStopId())
                .orElseThrow(() -> new ResourceNotFoundException("Dropoff stop not found: " + request.dropoffStopId()));

        ShuttleBus shuttle = null;
        if (request.shuttleId() != null) {
            shuttle = shuttleRepository.findById(request.shuttleId()).orElse(null);
        }

        // Generate digital pass code & verifiable QR token
        String passCode = "FBSU-TR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String qrToken = "fbsu://transit/v1?pass=" + passCode + "&uid=" + user.getUniversityNumber() + "&rid=" + route.getRouteCode();

        LocalTime now = LocalTime.now();
        String boardingWindow = now.format(DateTimeFormatter.ofPattern("hh:mm a")) + " - " +
                now.plusMinutes(45).format(DateTimeFormatter.ofPattern("hh:mm a"));

        TransitPass pass = new TransitPass(
                user.getUniversityId(),
                user,
                route,
                shuttle,
                pickup,
                dropoff,
                passCode,
                qrToken,
                boardingWindow,
                BigDecimal.ZERO
        );

        TransitPass saved = passRepository.save(pass);
        log.info("Issued digital transit boarding pass {} for user {} on route {}",
                saved.getPassCode(), user.getUniversityNumber(), route.getRouteCode());

        return TransitPassResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<TransitPassResponse> getMyPasses(UUID userId) {
        Objects.requireNonNull(userId, "User ID cannot be null");
        return passRepository.findByUserIdDetailed(userId)
                .stream()
                .map(TransitPassResponse::fromEntity)
                .toList();
    }
}

