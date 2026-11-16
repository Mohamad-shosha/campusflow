package sa.edu.fbsu.campus.parking.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.parking.domain.BookingStatus;
import sa.edu.fbsu.campus.parking.domain.FlexOffer;
import sa.edu.fbsu.campus.parking.domain.FlexOfferStatus;
import sa.edu.fbsu.campus.parking.domain.ParkingBooking;
import sa.edu.fbsu.campus.parking.domain.ParkingSpot;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.infra.FlexOfferRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingBookingRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Closes parking bookings and Flex-Share offers whose time window has ended and frees their bays.
 *
 * <p>Without this, an ended booking stayed CONFIRMED/ACTIVE forever and its bay stayed RESERVED or
 * OCCUPIED, so the lot slowly filled up with ghost reservations (found in the P8-01 live run).
 * Faculty-assigned and maintenance bays are never touched.
 */
@Service
public class ParkingLifecycleService {

    private static final Logger log = LoggerFactory.getLogger(ParkingLifecycleService.class);
    private static final Set<BookingStatus> LIVE_BOOKING = Set.of(BookingStatus.CONFIRMED, BookingStatus.ACTIVE);
    private static final Set<FlexOfferStatus> LIVE_OFFER = Set.of(FlexOfferStatus.AVAILABLE, FlexOfferStatus.CLAIMED);
    private static final Set<SpotStatus> RELEASABLE = Set.of(SpotStatus.RESERVED, SpotStatus.OCCUPIED, SpotStatus.FLEX_SHARE);

    private final ParkingBookingRepository bookingRepository;
    private final FlexOfferRepository flexOfferRepository;
    private final ParkingSpotRepository spotRepository;

    public ParkingLifecycleService(
            ParkingBookingRepository bookingRepository,
            FlexOfferRepository flexOfferRepository,
            ParkingSpotRepository spotRepository) {
        this.bookingRepository = bookingRepository;
        this.flexOfferRepository = flexOfferRepository;
        this.spotRepository = spotRepository;
    }

    // @Transactional here (not only on expireEnded): a self-call bypasses the Spring proxy.
    @Scheduled(fixedDelayString = "${fbsu.parking.lifecycle-interval:PT1M}", initialDelayString = "PT20S")
    @Transactional
    public void scheduledExpiry() {
        try {
            expireEnded(Instant.now());
        } catch (RuntimeException ex) {
            log.warn("Parking lifecycle expiry failed; will retry on next run", ex);
        }
    }

    /** Completes everything that ended before {@code now}. Returns the number of bookings + offers closed. */
    @Transactional
    public int expireEnded(Instant now) {
        Map<UUID, ParkingSpot> touched = new LinkedHashMap<>();

        List<ParkingBooking> endedBookings = bookingRepository.findByStatusInAndEndTimeBefore(LIVE_BOOKING, now);
        for (ParkingBooking booking : endedBookings) {
            booking.complete();
            touched.put(booking.getSpot().getId(), booking.getSpot());
        }
        bookingRepository.saveAll(endedBookings);

        List<FlexOffer> endedOffers = flexOfferRepository.findByStatusInAndEndTimeBefore(LIVE_OFFER, now);
        for (FlexOffer offer : endedOffers) {
            if (offer.getStatus() == FlexOfferStatus.AVAILABLE) {
                offer.cancel(); // never claimed: the offer simply lapses
            } else {
                offer.complete();
            }
            touched.put(offer.getSpot().getId(), offer.getSpot());
        }
        flexOfferRepository.saveAll(endedOffers);

        // Bays still marked taken although every booking/offer on them has ended (e.g. left over
        // from before this job existed). Bays never used by a booking or offer (demo cars) are kept.
        for (ParkingSpot spot : spotRepository.findAll()) {
            if (RELEASABLE.contains(spot.getStatus()) && !touched.containsKey(spot.getId())
                    && (bookingRepository.existsBySpotId(spot.getId()) || flexOfferRepository.existsBySpotId(spot.getId()))) {
                touched.put(spot.getId(), spot);
            }
        }

        for (ParkingSpot spot : touched.values()) {
            releaseIfIdle(spot, now);
        }

        int closed = endedBookings.size() + endedOffers.size();
        if (closed > 0) {
            log.info("Parking lifecycle: closed {} booking(s) and {} flex offer(s), checked {} bay(s)",
                    endedBookings.size(), endedOffers.size(), touched.size());
        }
        return closed;
    }

    private void releaseIfIdle(ParkingSpot spot, Instant now) {
        if (!RELEASABLE.contains(spot.getStatus())) {
            return;
        }
        boolean stillBooked = bookingRepository.existsBySpotIdAndStatusInAndEndTimeAfter(spot.getId(), LIVE_BOOKING, now);
        boolean stillShared = flexOfferRepository.existsBySpotIdAndStatusInAndEndTimeAfter(spot.getId(), LIVE_OFFER, now);
        if (stillBooked || stillShared) {
            return;
        }
        spot.setStatus(SpotStatus.AVAILABLE);
        spot.setCurrentOccupantId(null);
        spot.setOccupantNameAr(null);
        spot.setOccupantNameEn(null);
        spot.setVehicleModel(null);
        spot.setPlateLettersAr(null);
        spot.setPlateDigits(null);
        spot.setTimeLeftText(null);
        spot.setSessionEndsAt(null);
        spotRepository.save(spot);
    }
}
