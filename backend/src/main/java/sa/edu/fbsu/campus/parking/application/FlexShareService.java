package sa.edu.fbsu.campus.parking.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.common.events.WalletTransactionEvent;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.parking.domain.BookingStatus;
import sa.edu.fbsu.campus.parking.domain.FlexOffer;
import sa.edu.fbsu.campus.parking.domain.FlexOfferStatus;
import sa.edu.fbsu.campus.parking.domain.ParkingBooking;
import sa.edu.fbsu.campus.parking.domain.ParkingSpot;
import sa.edu.fbsu.campus.parking.domain.ParkingTariff;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.dto.CreateFlexOfferRequest;
import sa.edu.fbsu.campus.parking.dto.FlexOfferResponse;
import sa.edu.fbsu.campus.parking.dto.ShareableSpotResponse;
import sa.edu.fbsu.campus.parking.infra.FlexOfferRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingBookingRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;

import sa.edu.fbsu.campus.wallet.application.WalletService;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
public class FlexShareService {

    private static final Logger log = LoggerFactory.getLogger(FlexShareService.class);
    private static final Set<BookingStatus> LIVE_BOOKING = Set.of(BookingStatus.CONFIRMED, BookingStatus.ACTIVE);
    private static final Set<FlexOfferStatus> LIVE_OFFER = Set.of(FlexOfferStatus.AVAILABLE, FlexOfferStatus.CLAIMED);
    private static final DateTimeFormatter HH_MM = DateTimeFormatter.ofPattern("HH:mm")
            .withZone(ParkingLifecycleService.CAMPUS_ZONE);

    private final FlexOfferRepository flexOfferRepository;
    private final ParkingSpotRepository spotRepository;
    private final TariffResolver tariffResolver;
    private final UserRepository userRepository;
    private final WalletService walletService;
    private final ApplicationEventPublisher eventPublisher;
    private final ParkingBookingRepository bookingRepository;
    private final ParkingLifecycleService lifecycleService;

    public FlexShareService(
            FlexOfferRepository flexOfferRepository,
            ParkingSpotRepository spotRepository,
            TariffResolver tariffResolver,
            UserRepository userRepository,
            WalletService walletService,
            ApplicationEventPublisher eventPublisher,
            ParkingBookingRepository bookingRepository,
            ParkingLifecycleService lifecycleService
    ) {
        this.bookingRepository = bookingRepository;
        this.lifecycleService = lifecycleService;
        this.flexOfferRepository = flexOfferRepository;
        this.spotRepository = spotRepository;
        this.tariffResolver = tariffResolver;
        this.userRepository = userRepository;
        this.walletService = walletService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public FlexOfferResponse createOffer(UUID offererId, CreateFlexOfferRequest request) {
        Objects.requireNonNull(offererId, "Offerer user ID cannot be null");
        Objects.requireNonNull(request, "CreateFlexOfferRequest cannot be null");

        User offerer = userRepository.findById(offererId)
                .orElseThrow(() -> new ResourceNotFoundException("Campus user not found: " + offererId));

        ParkingSpot spot = spotRepository.findById(request.spotId())
                .filter(sp -> offerer.getUniversityId().equals(sp.getUniversityId()))
                .orElseThrow(() -> new ResourceNotFoundException("Parking spot not found: " + request.spotId()));

        if (flexOfferRepository.existsBySpotIdAndStatusIn(spot.getId(), Set.of(FlexOfferStatus.AVAILABLE, FlexOfferStatus.CLAIMED))) {
            throw new IllegalStateException("An active Flex-Share offer already exists for spot " + spot.getBayCode());
        }

        Instant now = Instant.now();
        Instant startTime = request.startTime() != null ? request.startTime() : now;
        if (startTime.isBefore(now.minus(Duration.ofMinutes(15)))) {
            throw new IllegalArgumentException("Flex-Share start time cannot be in the past.");
        }
        Instant endTime = startTime.plus(Duration.ofMinutes(request.durationMinutes()));
        requireRightToShare(offerer, spot, startTime, endTime, now);

        // Reward strictly from the offerer's active tariff; no hardcoded fallback amount.
        // flex_cashback_rate is NOT NULL in the schema; zero means "no cashback".
        ParkingTariff tariff = tariffResolver.requireActiveTariff(offerer.getUniversityId(), offerer.getUserType());
        BigDecimal rewardAmount = tariff.getFlexCashbackRate() != null
                ? tariff.getFlexCashbackRate().max(BigDecimal.ZERO)
                : BigDecimal.ZERO;

        FlexOffer offer = new FlexOffer(
                offerer.getUniversityId(),
                spot,
                offerer,
                startTime,
                endTime,
                rewardAmount,
                "SAR"
        );

        FlexOffer saved = flexOfferRepository.save(offer);

        // Update spot status to FLEX_SHARE
        spot.setStatus(SpotStatus.FLEX_SHARE);
        spot.setFlexEligible(true);
        spotRepository.save(spot);

        log.info("Flex-Share offer created by user {} on bay {} (Reward: {} SAR)",
                offerer.getUniversityNumber(), spot.getBayCode(), rewardAmount);

        return FlexOfferResponse.fromEntity(saved);
    }

    /**
     * Only the owner of a bay may share it (P8-01 M7): the holder of a live booking on it, for a
     * window inside that booking, or the faculty member the bay is currently assigned to.
     * Without this anyone could list any bay and farm the cashback with an accomplice.
     */
    private void requireRightToShare(User offerer, ParkingSpot spot, Instant start, Instant end, Instant now) {
        List<ParkingBooking> ownBookings = bookingRepository.findLiveByUserId(offerer.getId(), LIVE_BOOKING, now)
                .stream()
                .filter(b -> b.getSpot().getId().equals(spot.getId()))
                .toList();
        for (ParkingBooking booking : ownBookings) {
            if (!start.isBefore(booking.getStartTime()) && !end.isAfter(booking.getEndTime())) {
                return;
            }
        }
        boolean assignedToOfferer = lifecycleService.currentAssignment(spot.getId(), now)
                .map(a -> a.getUserId().equals(offerer.getId()))
                .orElse(false);
        if (assignedToOfferer) {
            return;
        }
        if (!ownBookings.isEmpty()) {
            ParkingBooking last = ownBookings.get(ownBookings.size() - 1);
            throw new IllegalArgumentException("The Flex-Share window must fit inside your booking on bay "
                    + spot.getBayCode() + " (" + HH_MM.format(last.getStartTime()) + " - "
                    + HH_MM.format(last.getEndTime()) + ").");
        }
        throw new AccessDeniedException("You can only share a bay you have booked or that is assigned to you.");
    }

    /** Bays the user may offer now: bays they hold a live booking on, and their current faculty bay. */
    @Transactional(readOnly = true)
    public List<ShareableSpotResponse> getShareableSpots(UUID userId) {
        Instant now = Instant.now();
        List<ShareableSpotResponse> result = new ArrayList<>();
        Set<UUID> seen = new HashSet<>();

        lifecycleService.currentAssignmentOf(userId, now)
                .flatMap(a -> spotRepository.findById(a.getSpotId()))
                .filter(spot -> seen.add(spot.getId()) && !hasLiveOffer(spot))
                .ifPresent(spot -> result.add(toShareable(spot, "ASSIGNMENT", null)));

        for (ParkingBooking booking : bookingRepository.findLiveByUserId(userId, LIVE_BOOKING, now)) {
            ParkingSpot spot = booking.getSpot();
            // An offer starts now, so a booking that has not started yet cannot be shared yet.
            if (booking.getStartTime().isAfter(now)) {
                continue;
            }
            if (seen.add(spot.getId()) && !hasLiveOffer(spot)) {
                result.add(toShareable(spot, "BOOKING", booking.getEndTime()));
            }
        }
        return result;
    }

    private boolean hasLiveOffer(ParkingSpot spot) {
        return flexOfferRepository.existsBySpotIdAndStatusIn(spot.getId(), LIVE_OFFER);
    }

    private static ShareableSpotResponse toShareable(ParkingSpot spot, String source, Instant until) {
        return new ShareableSpotResponse(
                spot.getId(),
                spot.getBayNumber(),
                spot.getZone().getCode(),
                spot.getZone().getNameAr(),
                spot.getZone().getNameEn(),
                source,
                until
        );
    }

    @Transactional(readOnly = true)
    public List<FlexOfferResponse> getActiveOffers(UUID universityId) {
        return flexOfferRepository.findByUniversityIdAndStatus(universityId, FlexOfferStatus.AVAILABLE)
                .stream()
                .map(FlexOfferResponse::fromEntity)
                .toList();
    }

    @Transactional
    public FlexOfferResponse claimOffer(UUID claimerId, UUID offerId) {
        Objects.requireNonNull(claimerId, "Claimer user ID cannot be null");
        Objects.requireNonNull(offerId, "Offer ID cannot be null");

        User claimer = userRepository.findById(claimerId)
                .orElseThrow(() -> new ResourceNotFoundException("Claimer user not found: " + claimerId));

        FlexOffer offer = flexOfferRepository.findDetailedById(offerId)
                .filter(o -> claimer.getUniversityId().equals(o.getUniversityId()))
                .orElseThrow(() -> new ResourceNotFoundException("Flex-Share offer not found: " + offerId));

        offer.claim(claimer);

        // Idempotent reward credit to offerer's wallet
        if (!offer.isRewardPaid() && offer.getRewardAmount().compareTo(BigDecimal.ZERO) > 0) {
            String rewardIdempotencyKey = "FLEX-REWARD-" + offer.getId();
            String desc = "Flex-Share cashback reward: Bay " + offer.getSpot().getBayCode() + " claimed by peer";
            walletService.credit(
                    offer.getOfferer().getId(),
                    offer.getRewardAmount(),
                    sa.edu.fbsu.campus.wallet.domain.TransactionType.PARKING_REWARD,
                    rewardIdempotencyKey,
                    offer.getSpot().getBayCode(),
                    desc
            );
            offer.markRewardPaid();
            log.info("Credited {} SAR Flex reward to offerer {}", offer.getRewardAmount(), offer.getOfferer().getUniversityNumber());

            eventPublisher.publishEvent(new WalletTransactionEvent(
                    offer.getOfferer().getId(),
                    offer.getUniversityId(),
                    offer.getRewardAmount(),
                    "FLEX_REWARD",
                    offer.getSpot().getBayCode()
            ));
        }

        // Update parking spot to show claimer's session
        ParkingSpot spot = offer.getSpot();
        spot.setStatus(SpotStatus.OCCUPIED);
        spot.setCurrentOccupantId(claimer.getId());
        spot.setOccupantNameAr(claimer.getFullNameAr());
        spot.setOccupantNameEn(claimer.getFullNameEn());
        spot.setTimeLeftText("تبادل مرن حتى " + HH_MM.format(offer.getEndTime()));
        spotRepository.save(spot);

        FlexOffer updated = flexOfferRepository.save(offer);
        log.info("Flex-Share offer {} claimed by {}", offerId, claimer.getUniversityNumber());

        return FlexOfferResponse.fromEntity(updated);
    }

    @Transactional
    public FlexOfferResponse cancelOffer(UUID offererId, UUID offerId) {
        FlexOffer offer = flexOfferRepository.findDetailedById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Flex-Share offer not found: " + offerId));

        if (!offer.getOfferer().getId().equals(offererId)) {
            throw new IllegalArgumentException("Access denied: You can only cancel your own Flex-Share offers.");
        }

        offer.cancel();
        FlexOffer updated = flexOfferRepository.save(offer);

        // Give the bay back to its owner (booking holder or assigned faculty) instead of freeing it.
        lifecycleService.settle(offer.getSpot(), Instant.now());

        log.info("Flex-Share offer {} cancelled by offerer", offerId);
        return FlexOfferResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<FlexOfferResponse> getMyOffers(UUID userId) {
        return flexOfferRepository.findByOffererId(userId)
                .stream()
                .map(FlexOfferResponse::fromEntity)
                .toList();
    }
}

