package sa.edu.fbsu.campus.parking.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.events.GateAccessEvent;
import sa.edu.fbsu.campus.identity.domain.SaudiPlate;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.domain.Vehicle;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.identity.infra.VehicleRepository;
import sa.edu.fbsu.campus.parking.domain.*;
import sa.edu.fbsu.campus.parking.dto.GateDecisionResponse;
import sa.edu.fbsu.campus.parking.dto.GateScanRequest;
import sa.edu.fbsu.campus.parking.infra.*;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class GateDecisionService {

    private static final Logger log = LoggerFactory.getLogger(GateDecisionService.class);

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final ParkingSpotRepository spotRepository;
    private final ParkingBookingRepository bookingRepository;
    private final SpotAssignmentRepository spotAssignmentRepository;
    private final FlexOfferRepository flexOfferRepository;
    private final GateEventLogRepository gateEventLogRepository;
    private final ApplicationEventPublisher eventPublisher;

    public GateDecisionService(
            VehicleRepository vehicleRepository,
            UserRepository userRepository,
            ParkingSpotRepository spotRepository,
            ParkingBookingRepository bookingRepository,
            SpotAssignmentRepository spotAssignmentRepository,
            FlexOfferRepository flexOfferRepository,
            GateEventLogRepository gateEventLogRepository,
            ApplicationEventPublisher eventPublisher
    ) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
        this.spotRepository = spotRepository;
        this.bookingRepository = bookingRepository;
        this.spotAssignmentRepository = spotAssignmentRepository;
        this.flexOfferRepository = flexOfferRepository;
        this.gateEventLogRepository = gateEventLogRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public GateDecisionResponse evaluateScan(UUID universityId, GateScanRequest request) {
        SaudiPlate plate;
        try {
            plate = SaudiPlate.fromArabic(request.plateLettersAr(), request.plateDigits());
        } catch (Exception ex) {
            String rawPlate = request.plateLettersAr() + " " + request.plateDigits();
            log.warn("Invalid plate scan input: {}", rawPlate);
            recordGateEvent(universityId, request.gateId(), request.plateLettersAr(), request.plateDigits(),
                    "DENIED", "MALFORMED_PLATE", null, null, null, null);
            return GateDecisionResponse.denied(
                    "MALFORMED_PLATE",
                    "صيغة اللوحة غير صالحة. يرجى مسح لوحة سعودية صحيحة.",
                    "Invalid plate format. Please scan a valid Saudi moroor plate.",
                    rawPlate
            );
        }

        String formattedPlate = plate.toFormattedAr();

        // 1. Find registered vehicle
        Optional<Vehicle> vehicleOpt = vehicleRepository.findByUniversityIdAndPlateLettersArAndPlateDigits(
                universityId, plate.getLettersAr(), plate.getDigits()
        );

        if (vehicleOpt.isEmpty()) {
            recordGateEvent(universityId, request.gateId(), plate.getLettersAr(), plate.getDigits(),
                    "DENIED", "UNREGISTERED_VEHICLE", null, null, null, null);
            return GateDecisionResponse.denied(
                    "UNREGISTERED_VEHICLE",
                    "عذراً، المركبة (" + formattedPlate + ") غير مسجلة في نظام الجامعة.",
                    "Vehicle (" + plate.toFormattedEn() + ") is not registered in the campus security registry.",
                    formattedPlate
            );
        }

        Vehicle vehicle = vehicleOpt.get();
        User driver = userRepository.findById(vehicle.getUserId()).orElse(null);
        if (driver == null) {
            recordGateEvent(universityId, request.gateId(), plate.getLettersAr(), plate.getDigits(),
                    "DENIED", "ORPHANED_VEHICLE", null, null, null, vehicle);
            return GateDecisionResponse.denied(
                    "ORPHANED_VEHICLE",
                    "بيانات مالك المركبة غير مكتملة. يرجى مراجعة إدارة الأمن.",
                    "Driver profile incomplete. Please visit campus security.",
                    formattedPlate
            );
        }

        Instant now = Instant.now();

        // 2. Check Faculty Spot Assignment
        if (driver.getUserType() == UserType.FACULTY) {
            Optional<SpotAssignment> activeAssignment = spotAssignmentRepository.findByUserIdAndActiveTrue(driver.getId());
            if (activeAssignment.isPresent()) {
                UUID spotId = activeAssignment.get().getSpotId();
                Optional<ParkingSpot> spotOpt = spotRepository.findById(spotId);
                if (spotOpt.isPresent()) {
                    ParkingSpot spot = spotOpt.get();
                    recordGateEvent(universityId, request.gateId(), plate.getLettersAr(), plate.getDigits(),
                            "GRANTED", "FACULTY_PERMIT", spot.getBayNumber(), spot.getBayCode(), driver, vehicle);

                    return GateDecisionResponse.granted(
                            "FACULTY_PERMIT",
                            "أهلاً وسهلاً د. " + driver.getFullNameAr() + " — موقفك المخصص: " + spot.getBayCode(),
                            "Welcome Dr. " + driver.getFullNameEn() + " — Reserved Bay: " + spot.getBayCode(),
                            spot.getBayNumber(),
                            spot.getBayCode(),
                            spot.getZone().getCode(),
                            spot.getZone().getNameAr(),
                            spot.getZone().getNameEn(),
                            driver.getFullNameAr(),
                            driver.getFullNameEn(),
                            driver.getUserType().name(),
                            formattedPlate
                    );
                }
            }

            // General Faculty Permit (Zone C)
            recordGateEvent(universityId, request.gateId(), plate.getLettersAr(), plate.getDigits(),
                    "GRANTED", "FACULTY_PERMIT", null, "ZONE-C", driver, vehicle);

            return GateDecisionResponse.granted(
                    "FACULTY_PERMIT",
                    "أهلاً وسهلاً د. " + driver.getFullNameAr() + " — تصريح أعضاء هيئة التدريس سارٍ (المنطقة C)",
                    "Welcome Dr. " + driver.getFullNameEn() + " — Faculty Permit Active (Zone C)",
                    null,
                    "ZONE-C",
                    "ZONE-C",
                    "مواقف أعضاء هيئة التدريس",
                    "Faculty Parking Zone",
                    driver.getFullNameAr(),
                    driver.getFullNameEn(),
                    driver.getUserType().name(),
                    formattedPlate
            );
        }

        // 3. Check Active Parking Booking
        List<ParkingBooking> activeBookings = bookingRepository.findByUserIdAndStatusInOrderByStartTimeDesc(
                driver.getId(), Set.of(BookingStatus.CONFIRMED, BookingStatus.ACTIVE)
        );

        Optional<ParkingBooking> currentBooking = activeBookings.stream()
                .filter(b -> {
                    Instant entryEarlyAllowed = b.getStartTime().minus(Duration.ofMinutes(20));
                    Instant entryLateAllowed = b.getEndTime().plus(Duration.ofMinutes(30));
                    return now.isAfter(entryEarlyAllowed) && now.isBefore(entryLateAllowed);
                })
                .findFirst();

        if (currentBooking.isPresent()) {
            ParkingBooking booking = currentBooking.get();
            if (booking.getStatus() == BookingStatus.CONFIRMED) {
                booking.activate();
                bookingRepository.save(booking);
            }

            ParkingSpot spot = booking.getSpot();
            recordGateEvent(universityId, request.gateId(), plate.getLettersAr(), plate.getDigits(),
                    "GRANTED", "ACTIVE_BOOKING", spot.getBayNumber(), spot.getBayCode(), driver, vehicle);

            return GateDecisionResponse.granted(
                    "ACTIVE_BOOKING",
                    "أهلاً بك " + driver.getFullNameAr() + "! تم التحقق من الحجز — موقفك: " + spot.getBayCode(),
                    "Welcome " + driver.getFullNameEn() + "! Reservation verified — Bay: " + spot.getBayCode(),
                    spot.getBayNumber(),
                    spot.getBayCode(),
                    spot.getZone().getCode(),
                    spot.getZone().getNameAr(),
                    spot.getZone().getNameEn(),
                    driver.getFullNameAr(),
                    driver.getFullNameEn(),
                    driver.getUserType().name(),
                    formattedPlate
            );
        }

        // 4. Check Claimed Flex-Share
        List<FlexOffer> claimedOffers = flexOfferRepository.findByClaimerId(driver.getId());
        Optional<FlexOffer> activeFlex = claimedOffers.stream()
                .filter(o -> o.getStatus() == FlexOfferStatus.CLAIMED && now.isAfter(o.getStartTime().minus(Duration.ofMinutes(15))) && now.isBefore(o.getEndTime().plus(Duration.ofMinutes(15))))
                .findFirst();

        if (activeFlex.isPresent()) {
            FlexOffer offer = activeFlex.get();
            ParkingSpot spot = offer.getSpot();
            recordGateEvent(universityId, request.gateId(), plate.getLettersAr(), plate.getDigits(),
                    "GRANTED", "FLEX_SHARE_CLAIM", spot.getBayNumber(), spot.getBayCode(), driver, vehicle);

            return GateDecisionResponse.granted(
                    "FLEX_SHARE_CLAIM",
                    "أهلاً بك! تم التحقق من التبادل المرن — موقفك: " + spot.getBayCode(),
                    "Welcome! Flex-Share verified — Bay: " + spot.getBayCode(),
                    spot.getBayNumber(),
                    spot.getBayCode(),
                    spot.getZone().getCode(),
                    spot.getZone().getNameAr(),
                    spot.getZone().getNameEn(),
                    driver.getFullNameAr(),
                    driver.getFullNameEn(),
                    driver.getUserType().name(),
                    formattedPlate
            );
        }

        // 5. No active booking
        recordGateEvent(universityId, request.gateId(), plate.getLettersAr(), plate.getDigits(),
                "DENIED", "NO_ACTIVE_BOOKING", null, null, driver, vehicle);

        return GateDecisionResponse.denied(
                "NO_ACTIVE_BOOKING",
                "عذراً " + driver.getFullNameAr() + "، لا يوجد حجز نشط لهذه المركبة حالياً. يرجى حجز موقف عبر التطبيق.",
                "Access Denied: No active parking booking found for this vehicle. Please book a spot in advance.",
                formattedPlate
        );
    }

    private void recordGateEvent(
            UUID universityId,
            String gateId,
            String lettersAr,
            String digits,
            String decision,
            String reason,
            Integer bayNumber,
            String bayCode,
            User user,
            Vehicle vehicle
    ) {
        GateEventLog logEntry = new GateEventLog(
                universityId,
                gateId,
                lettersAr,
                digits,
                decision,
                reason,
                bayNumber,
                bayCode,
                user,
                vehicle
        );
        gateEventLogRepository.save(logEntry);
        log.info("[ALPR-GATE] Gate: {} | Plate: {} {} | Decision: {} ({}) | Bay: {}",
                gateId, lettersAr, digits, decision, reason, bayCode);

        if ("GRANTED".equalsIgnoreCase(decision) && user != null) {
            String gateNameAr = "GATE-01-NORTH".equalsIgnoreCase(gateId) ? "البوابة الشمالية الرئيسية" : "بوابة الحرم الجامعي";
            String gateNameEn = "GATE-01-NORTH".equalsIgnoreCase(gateId) ? "Main North Gate" : "Campus Gate";
            eventPublisher.publishEvent(new GateAccessEvent(
                    user.getId(),
                    universityId,
                    lettersAr + " " + digits,
                    gateNameAr,
                    gateNameEn,
                    true
            ));
        }
    }
}
