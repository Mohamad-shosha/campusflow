package sa.edu.fbsu.campus.parking.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.domain.Vehicle;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.identity.infra.VehicleRepository;
import sa.edu.fbsu.campus.parking.domain.BookingStatus;
import sa.edu.fbsu.campus.parking.domain.ParkingBooking;
import sa.edu.fbsu.campus.parking.domain.ParkingSpot;
import sa.edu.fbsu.campus.parking.domain.ParkingTariff;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.dto.BookingResponse;
import sa.edu.fbsu.campus.parking.dto.CreateBookingRequest;
import sa.edu.fbsu.campus.parking.dto.DigitalPassResponse;
import sa.edu.fbsu.campus.parking.infra.ParkingBookingRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingTariffRepository;
import sa.edu.fbsu.campus.wallet.application.WalletService;
import sa.edu.fbsu.campus.wallet.domain.TransactionType;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);

    private final ParkingBookingRepository bookingRepository;
    private final ParkingSpotRepository spotRepository;
    private final ParkingTariffRepository tariffRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final WalletService walletService;

    public BookingService(
            ParkingBookingRepository bookingRepository,
            ParkingSpotRepository spotRepository,
            ParkingTariffRepository tariffRepository,
            UserRepository userRepository,
            VehicleRepository vehicleRepository,
            WalletService walletService
    ) {
        this.bookingRepository = bookingRepository;
        this.spotRepository = spotRepository;
        this.tariffRepository = tariffRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.walletService = walletService;
    }

    @Transactional
    public BookingResponse createBooking(UUID userId, CreateBookingRequest request) {
        Objects.requireNonNull(userId, "User ID cannot be null");
        Objects.requireNonNull(request, "CreateBookingRequest cannot be null");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Campus user not found: " + userId));

        ParkingSpot spot = spotRepository.findById(request.spotId())
                .orElseThrow(() -> new ResourceNotFoundException("Parking spot not found: " + request.spotId()));

        if (spot.getStatus() == SpotStatus.FACULTY_ASSIGNED && user.getUserType() != sa.edu.fbsu.campus.identity.domain.UserType.FACULTY) {
            throw new IllegalStateException("Parking spot " + spot.getBayCode() + " is restricted to faculty members.");
        }

        // Resolve vehicle (requested or primary user vehicle)
        Vehicle vehicle = null;
        if (request.vehicleId() != null) {
            vehicle = vehicleRepository.findByIdAndUserId(request.vehicleId(), userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found for user: " + request.vehicleId()));
        } else {
            List<Vehicle> vehicles = vehicleRepository.findByUserId(userId);
            if (!vehicles.isEmpty()) {
                vehicle = vehicles.stream().filter(Vehicle::isPrimary).findFirst().orElse(vehicles.get(0));
            }
        }

        // Calculate time window
        Instant startTime = request.startTime() != null ? request.startTime() : Instant.now();
        BigDecimal durationHours = request.durationHours().setScale(1, RoundingMode.HALF_UP);
        long durationMinutes = (long) (durationHours.doubleValue() * 60);
        Instant endTime = startTime.plus(Duration.ofMinutes(durationMinutes));

        // Check for active overlapping bookings
        if (bookingRepository.existsOverlappingActiveBooking(spot.getId(), startTime, endTime)) {
            throw new IllegalStateException("Parking spot " + spot.getBayCode() + " is already booked for the selected time window.");
        }

        // Calculate pricing from active institutional tariff
        BigDecimal ratePerHour = new BigDecimal("5.75");
        BigDecimal dailyCap = new BigDecimal("25.00");
        var tariffOpt = tariffRepository.findByUniversityIdAndUserType(user.getUniversityId(), user.getUserType());
        if (tariffOpt.isPresent()) {
            ParkingTariff tariff = tariffOpt.get();
            ratePerHour = tariff.getHourlyRate();
            dailyCap = tariff.getDailyCap();
        }

        BigDecimal calculatedTotal = ratePerHour.multiply(durationHours).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = calculatedTotal.min(dailyCap);

        // Atomic wallet debit if required
        if (request.autoDebitWallet() && totalAmount.compareTo(BigDecimal.ZERO) > 0) {
            String desc = "Parking reservation: Bay " + spot.getBayCode() + " (" + durationHours + "h)";
            walletService.debit(
                    userId,
                    totalAmount,
                    TransactionType.PARKING_FEE,
                    request.idempotencyKey(),
                    spot.getBayCode(),
                    desc
            );
            log.info("Debited {} SAR from user {} for parking bay {}", totalAmount, userId, spot.getBayCode());
        }

        // Generate digital pass code & verifiable QR token
        String passCode = "FBSU-" + spot.getZone().getCode() + "-" + String.format("%02d", spot.getBayNumber()) +
                "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String qrToken = "fbsu://pass/v1?code=" + passCode + "&bay=" + spot.getBayNumber() + "&exp=" + endTime.getEpochSecond();

        ParkingBooking booking = new ParkingBooking(
                user.getUniversityId(),
                user,
                spot,
                vehicle,
                startTime,
                endTime,
                durationHours,
                ratePerHour,
                totalAmount,
                "SAR",
                passCode,
                qrToken
        );

        ParkingBooking saved = bookingRepository.save(booking);

        // Update spot status if starting now
        if (startTime.isBefore(Instant.now().plus(Duration.ofMinutes(15)))) {
            spot.setStatus(SpotStatus.RESERVED);
            spotRepository.save(spot);
        }

        log.info("Created parking booking {} for user {} on bay {}", saved.getId(), userId, spot.getBayCode());
        return BookingResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(UUID userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(BookingResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public DigitalPassResponse getDigitalPass(UUID userId, UUID bookingId) {
        ParkingBooking booking = bookingRepository.findDetailedById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking booking not found: " + bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Access denied: You can only view your own digital pass.");
        }

        return DigitalPassResponse.fromEntity(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(UUID userId, UUID bookingId, String cancelReason) {
        ParkingBooking booking = bookingRepository.findDetailedById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking booking not found: " + bookingId));

        if (!booking.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Access denied: You can only cancel your own bookings.");
        }

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new IllegalStateException("Only CONFIRMED bookings can be cancelled. Current status: " + booking.getStatus());
        }

        booking.cancel();
        ParkingBooking updated = bookingRepository.save(booking);

        // Refund wallet if amount > 0
        if (booking.getTotalAmount().compareTo(BigDecimal.ZERO) > 0) {
            String refundKey = "REFUND-" + booking.getId() + "-" + UUID.randomUUID().toString().substring(0, 6);
            String desc = "Refund for cancelled parking booking: Bay " + booking.getSpot().getBayCode();
            walletService.refund(
                    userId,
                    booking.getTotalAmount(),
                    refundKey,
                    booking.getSpot().getBayCode(),
                    desc
            );
            log.info("Refunded {} SAR to user {} for cancelled booking {}", booking.getTotalAmount(), userId, booking.getId());
        }

        // Check if spot should be marked available
        ParkingSpot spot = booking.getSpot();
        if (spot.getStatus() == SpotStatus.RESERVED) {
            spot.setStatus(SpotStatus.AVAILABLE);
            spotRepository.save(spot);
        }

        return BookingResponse.fromEntity(updated);
    }
}
