package sa.edu.fbsu.campus.parking.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.parking.domain.BookingStatus;
import sa.edu.fbsu.campus.parking.domain.FlexOffer;
import sa.edu.fbsu.campus.parking.domain.FlexOfferStatus;
import sa.edu.fbsu.campus.parking.domain.ParkingBooking;
import sa.edu.fbsu.campus.parking.domain.ParkingSpot;
import sa.edu.fbsu.campus.parking.domain.SpotAssignment;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.infra.FlexOfferRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingBookingRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;
import sa.edu.fbsu.campus.parking.infra.SpotAssignmentRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * Closes parking bookings and Flex-Share offers whose time window has ended and frees their bays.
 *
 * <p>Without this, an ended booking stayed CONFIRMED/ACTIVE forever and its bay stayed RESERVED or
 * OCCUPIED, so the lot slowly filled up with ghost reservations (found in the P8-01 live run).
 * Faculty-assigned and maintenance bays are never touched.
 *
 * <p>When a bay is no longer flex-shared it goes back to whoever owns it: the holder of a live
 * booking, else the faculty member it is assigned to, else it becomes available ({@link #settle}).
 */
@Service
public class ParkingLifecycleService {

    private static final Logger log = LoggerFactory.getLogger(ParkingLifecycleService.class);
    private static final Set<BookingStatus> LIVE_BOOKING = Set.of(BookingStatus.CONFIRMED, BookingStatus.ACTIVE);
    private static final Set<FlexOfferStatus> LIVE_OFFER = Set.of(FlexOfferStatus.AVAILABLE, FlexOfferStatus.CLAIMED);
    private static final Set<SpotStatus> RELEASABLE = Set.of(SpotStatus.RESERVED, SpotStatus.OCCUPIED, SpotStatus.FLEX_SHARE);
    static final ZoneId CAMPUS_ZONE = ZoneId.of("Asia/Riyadh");

    private final ParkingBookingRepository bookingRepository;
    private final FlexOfferRepository flexOfferRepository;
    private final ParkingSpotRepository spotRepository;
    private final SpotAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    public ParkingLifecycleService(
            ParkingBookingRepository bookingRepository,
            FlexOfferRepository flexOfferRepository,
            ParkingSpotRepository spotRepository,
            SpotAssignmentRepository assignmentRepository,
            UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.flexOfferRepository = flexOfferRepository;
        this.spotRepository = spotRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
    }

    /** True if the assignment is active and covers {@code now}'s campus-local date. */
    static boolean isCurrent(SpotAssignment assignment, Instant now) {
        if (assignment == null || !assignment.isActive()) {
            return false;
        }
        LocalDate today = LocalDate.ofInstant(now, CAMPUS_ZONE);
        return (assignment.getStartDate() == null || !today.isBefore(assignment.getStartDate()))
                && (assignment.getEndDate() == null || !today.isAfter(assignment.getEndDate()));
    }

    /** The faculty bay currently assigned to {@code userId}, if any. */
    public Optional<SpotAssignment> currentAssignmentOf(UUID userId, Instant now) {
        return assignmentRepository.findByUserIdAndActiveTrue(userId).filter(a -> isCurrent(a, now));
    }

    /** The faculty assignment that currently owns {@code spotId}, if any. */
    public Optional<SpotAssignment> currentAssignment(UUID spotId, Instant now) {
        return assignmentRepository.findBySpotIdAndActiveTrue(spotId).filter(a -> isCurrent(a, now));
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
            settle(spot, now);
        }

        int closed = endedBookings.size() + endedOffers.size();
        if (closed > 0) {
            log.info("Parking lifecycle: closed {} booking(s) and {} flex offer(s), checked {} bay(s)",
                    endedBookings.size(), endedOffers.size(), touched.size());
        }
        return closed;
    }

    /**
     * Puts a bay whose flex offer or booking has ended back into the right state. A bay with a live
     * offer is left alone; otherwise it goes to the holder of a live booking, else to its assigned
     * faculty member, else becomes available. Faculty-assigned and maintenance bays are untouched.
     */
    @Transactional
    public void settle(ParkingSpot spot, Instant now) {
        if (!RELEASABLE.contains(spot.getStatus())) {
            return;
        }
        if (flexOfferRepository.existsBySpotIdAndStatusInAndEndTimeAfter(spot.getId(), LIVE_OFFER, now)) {
            return;
        }

        Optional<ParkingBooking> booking = bookingRepository
                .findFirstBySpotIdAndStatusInAndEndTimeAfterOrderByStartTimeAsc(spot.getId(), LIVE_BOOKING, now);
        if (booking.isPresent()) {
            ParkingBooking b = booking.get();
            spot.setStatus(b.getStatus() == BookingStatus.ACTIVE ? SpotStatus.OCCUPIED : SpotStatus.RESERVED);
            setOccupant(spot, b.getUser());
            if (b.getVehicle() != null) {
                spot.setVehicleModel(b.getVehicle().getMakeModel());
                if (b.getVehicle().getPlate() != null) {
                    spot.setPlateLettersAr(b.getVehicle().getPlate().getLettersAr());
                    spot.setPlateDigits(b.getVehicle().getPlate().getDigits());
                }
            }
            spot.setTimeLeftText("محجوز");
            spot.setSessionEndsAt(b.getEndTime());
            spotRepository.save(spot);
            return;
        }

        Optional<User> assignee = currentAssignment(spot.getId(), now)
                .flatMap(a -> userRepository.findById(a.getUserId()));
        if (assignee.isPresent()) {
            spot.setStatus(SpotStatus.FACULTY_ASSIGNED);
            setOccupant(spot, assignee.get());
            spot.setTimeLeftText(null);
            spot.setSessionEndsAt(null);
            spotRepository.save(spot);
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

    private static void setOccupant(ParkingSpot spot, User user) {
        spot.setCurrentOccupantId(user.getId());
        spot.setOccupantNameAr(user.getFullNameAr());
        spot.setOccupantNameEn(user.getFullNameEn());
    }
}
