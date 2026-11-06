package sa.edu.fbsu.campus.parking.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.domain.Vehicle;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "parking_booking")
public class ParkingBooking extends BaseTenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "spot_id", nullable = false)
    private ParkingSpot spot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Column(name = "duration_hours", nullable = false, precision = 4, scale = 1)
    private BigDecimal durationHours;

    @Column(name = "rate_per_hour", nullable = false, precision = 10, scale = 2)
    private BigDecimal ratePerHour;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "SAR";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private BookingStatus status = BookingStatus.CONFIRMED;

    @Column(name = "digital_pass_code", nullable = false, unique = true, length = 50)
    private String digitalPassCode;

    @Column(name = "qr_token", nullable = false, unique = true, length = 255)
    private String qrToken;

    protected ParkingBooking() {
    }

    public ParkingBooking(
            UUID universityId,
            User user,
            ParkingSpot spot,
            Vehicle vehicle,
            Instant startTime,
            Instant endTime,
            BigDecimal durationHours,
            BigDecimal ratePerHour,
            BigDecimal totalAmount,
            String currency,
            String digitalPassCode,
            String qrToken
    ) {
        setUniversityId(universityId);
        this.user = user;
        this.spot = spot;
        this.vehicle = vehicle;
        this.startTime = startTime;
        this.endTime = endTime;
        this.durationHours = durationHours;
        this.ratePerHour = ratePerHour;
        this.totalAmount = totalAmount;
        this.currency = (currency != null && !currency.isBlank()) ? currency : "SAR";
        this.digitalPassCode = digitalPassCode;
        this.qrToken = qrToken;
        this.status = BookingStatus.CONFIRMED;
    }

    public void cancel() {
        this.status = BookingStatus.CANCELLED;
    }

    public void activate() {
        this.status = BookingStatus.ACTIVE;
    }

    public void complete() {
        this.status = BookingStatus.COMPLETED;
    }

    public User getUser() {
        return user;
    }

    public ParkingSpot getSpot() {
        return spot;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public BigDecimal getDurationHours() {
        return durationHours;
    }

    public BigDecimal getRatePerHour() {
        return ratePerHour;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getCurrency() {
        return currency;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public String getDigitalPassCode() {
        return digitalPassCode;
    }

    public String getQrToken() {
        return qrToken;
    }
}
