package sa.edu.fbsu.campus.parking.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;
import sa.edu.fbsu.campus.identity.domain.User;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "flex_offer")
public class FlexOffer extends BaseTenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "spot_id", nullable = false)
    private ParkingSpot spot;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "offerer_user_id", nullable = false)
    private User offerer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claimer_user_id")
    private User claimer;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Column(name = "reward_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal rewardAmount;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "SAR";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private FlexOfferStatus status = FlexOfferStatus.AVAILABLE;

    @Column(name = "reward_paid", nullable = false)
    private boolean rewardPaid = false;

    protected FlexOffer() {
    }

    public FlexOffer(
            UUID universityId,
            ParkingSpot spot,
            User offerer,
            Instant startTime,
            Instant endTime,
            BigDecimal rewardAmount,
            String currency
    ) {
        setUniversityId(universityId);
        this.spot = spot;
        this.offerer = offerer;
        this.startTime = startTime;
        this.endTime = endTime;
        this.rewardAmount = rewardAmount;
        this.currency = (currency != null && !currency.isBlank()) ? currency : "SAR";
        this.status = FlexOfferStatus.AVAILABLE;
        this.rewardPaid = false;
    }

    public void claim(User claimer) {
        if (this.status != FlexOfferStatus.AVAILABLE) {
            throw new IllegalStateException("Flex-Share offer is no longer available. Status: " + this.status);
        }
        if (this.offerer.getId().equals(claimer.getId())) {
            throw new IllegalArgumentException("You cannot claim your own Flex-Share offer.");
        }
        this.claimer = claimer;
        this.status = FlexOfferStatus.CLAIMED;
    }

    public void markRewardPaid() {
        this.rewardPaid = true;
    }

    public void cancel() {
        if (this.status != FlexOfferStatus.AVAILABLE) {
            throw new IllegalStateException("Cannot cancel a Flex-Share offer that is already " + this.status);
        }
        this.status = FlexOfferStatus.CANCELLED;
    }

    public void complete() {
        this.status = FlexOfferStatus.COMPLETED;
    }

    // Getters
    public ParkingSpot getSpot() {
        return spot;
    }

    public User getOfferer() {
        return offerer;
    }

    public User getClaimer() {
        return claimer;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public BigDecimal getRewardAmount() {
        return rewardAmount;
    }

    public String getCurrency() {
        return currency;
    }

    public FlexOfferStatus getStatus() {
        return status;
    }

    public boolean isRewardPaid() {
        return rewardPaid;
    }
}

