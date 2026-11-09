package sa.edu.fbsu.campus.transit.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;
import sa.edu.fbsu.campus.identity.domain.User;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "transit_pass")
public class TransitPass extends BaseTenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "route_id", nullable = false)
    private TransitRoute route;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shuttle_id")
    private ShuttleBus shuttle;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pickup_stop_id", nullable = false)
    private TransitStop pickupStop;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dropoff_stop_id", nullable = false)
    private TransitStop dropoffStop;

    @Column(name = "pass_code", nullable = false, unique = true, length = 60)
    private String passCode;

    @Column(name = "qr_token", nullable = false, length = 255)
    private String qrToken;

    @Column(name = "boarding_window", nullable = false, length = 100)
    private String boardingWindow;

    @Column(name = "fare_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal fareAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TransitPassStatus status = TransitPassStatus.ACTIVE;

    protected TransitPass() {
    }

    public TransitPass(
            UUID universityId,
            User user,
            TransitRoute route,
            ShuttleBus shuttle,
            TransitStop pickupStop,
            TransitStop dropoffStop,
            String passCode,
            String qrToken,
            String boardingWindow,
            BigDecimal fareAmount
    ) {
        setUniversityId(universityId);
        this.user = user;
        this.route = route;
        this.shuttle = shuttle;
        this.pickupStop = pickupStop;
        this.dropoffStop = dropoffStop;
        this.passCode = passCode;
        this.qrToken = qrToken;
        this.boardingWindow = boardingWindow;
        this.fareAmount = fareAmount != null ? fareAmount : BigDecimal.ZERO;
        this.status = TransitPassStatus.ACTIVE;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TransitRoute getRoute() {
        return route;
    }

    public void setRoute(TransitRoute route) {
        this.route = route;
    }

    public ShuttleBus getShuttle() {
        return shuttle;
    }

    public void setShuttle(ShuttleBus shuttle) {
        this.shuttle = shuttle;
    }

    public TransitStop getPickupStop() {
        return pickupStop;
    }

    public void setPickupStop(TransitStop pickupStop) {
        this.pickupStop = pickupStop;
    }

    public TransitStop getDropoffStop() {
        return dropoffStop;
    }

    public void setDropoffStop(TransitStop dropoffStop) {
        this.dropoffStop = dropoffStop;
    }

    public String getPassCode() {
        return passCode;
    }

    public void setPassCode(String passCode) {
        this.passCode = passCode;
    }

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken;
    }

    public String getBoardingWindow() {
        return boardingWindow;
    }

    public void setBoardingWindow(String boardingWindow) {
        this.boardingWindow = boardingWindow;
    }

    public BigDecimal getFareAmount() {
        return fareAmount;
    }

    public void setFareAmount(BigDecimal fareAmount) {
        this.fareAmount = fareAmount;
    }

    public TransitPassStatus getStatus() {
        return status;
    }

    public void setStatus(TransitPassStatus status) {
        this.status = status;
    }
}

