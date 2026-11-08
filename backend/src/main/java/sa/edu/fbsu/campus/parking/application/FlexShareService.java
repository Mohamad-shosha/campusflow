package sa.edu.fbsu.campus.parking.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.common.events.WalletTransactionEvent;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.parking.domain.FlexOffer;
import sa.edu.fbsu.campus.parking.domain.FlexOfferStatus;
import sa.edu.fbsu.campus.parking.domain.ParkingSpot;
import sa.edu.fbsu.campus.parking.domain.ParkingTariff;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.dto.CreateFlexOfferRequest;
import sa.edu.fbsu.campus.parking.dto.FlexOfferResponse;
import sa.edu.fbsu.campus.parking.infra.FlexOfferRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingTariffRepository;
import sa.edu.fbsu.campus.wallet.application.WalletService;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
public class FlexShareService {

    private static final Logger log = LoggerFactory.getLogger(FlexShareService.class);

    private final FlexOfferRepository flexOfferRepository;
    private final ParkingSpotRepository spotRepository;
    private final ParkingTariffRepository tariffRepository;
    private final UserRepository userRepository;
    private final WalletService walletService;
    private final ApplicationEventPublisher eventPublisher;

    public FlexShareService(
            FlexOfferRepository flexOfferRepository,
            ParkingSpotRepository spotRepository,
            ParkingTariffRepository tariffRepository,
            UserRepository userRepository,
            WalletService walletService,
            ApplicationEventPublisher eventPublisher
    ) {
        this.flexOfferRepository = flexOfferRepository;
        this.spotRepository = spotRepository;
        this.tariffRepository = tariffRepository;
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
                .orElseThrow(() -> new ResourceNotFoundException("Parking spot not found: " + request.spotId()));

        if (flexOfferRepository.existsBySpotIdAndStatusIn(spot.getId(), Set.of(FlexOfferStatus.AVAILABLE, FlexOfferStatus.CLAIMED))) {
            throw new IllegalStateException("An active Flex-Share offer already exists for spot " + spot.getBayCode());
        }

        Instant startTime = request.startTime() != null ? request.startTime() : Instant.now();
        Instant endTime = startTime.plus(Duration.ofMinutes(request.durationMinutes()));

        // Resolve reward amount from tariff
        BigDecimal rewardAmount = new BigDecimal("5.75");
        var tariffOpt = tariffRepository.findByUniversityIdAndUserType(offerer.getUniversityId(), offerer.getUserType());
        if (tariffOpt.isPresent()) {
            ParkingTariff tariff = tariffOpt.get();
            if (tariff.getFlexCashbackRate() != null && tariff.getFlexCashbackRate().compareTo(BigDecimal.ZERO) > 0) {
                rewardAmount = tariff.getFlexCashbackRate();
            }
        }

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
                .orElseThrow(() -> new ResourceNotFoundException("Flex-Share offer not found: " + offerId));

        offer.claim(claimer);

        // Idempotent reward credit to offerer's wallet
        if (!offer.isRewardPaid() && offer.getRewardAmount().compareTo(BigDecimal.ZERO) > 0) {
            String rewardIdempotencyKey = "FLEX-REWARD-" + offer.getId();
            String desc = "Flex-Share cashback reward: Bay " + offer.getSpot().getBayCode() + " claimed by peer";
            walletService.refund(
                    offer.getOfferer().getId(),
                    offer.getRewardAmount(),
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
        spot.setTimeLeftText("تبادل مرن ينتهي " + offer.getEndTime());
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

        ParkingSpot spot = offer.getSpot();
        if (spot.getStatus() == SpotStatus.FLEX_SHARE) {
            spot.setStatus(SpotStatus.AVAILABLE);
            spotRepository.save(spot);
        }

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

