package sa.edu.fbsu.campus.parking.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;
import sa.edu.fbsu.campus.identity.domain.UserType;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "parking_tariff")
public class ParkingTariff extends BaseTenantEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false, length = 30)
    private UserType userType;

    @Column(name = "hourly_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal hourlyRate = new BigDecimal("5.75");

    @Column(name = "daily_cap", nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyCap = new BigDecimal("25.00");

    @Column(name = "flex_cashback_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal flexCashbackRate = new BigDecimal("5.75");

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    protected ParkingTariff() {
    }

    public ParkingTariff(
            UUID universityId,
            UserType userType,
            BigDecimal hourlyRate,
            BigDecimal dailyCap,
            BigDecimal flexCashbackRate) {
        setUniversityId(universityId);
        this.userType = userType;
        this.hourlyRate = hourlyRate;
        this.dailyCap = dailyCap;
        this.flexCashbackRate = flexCashbackRate;
        this.active = true;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(BigDecimal hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public BigDecimal getDailyCap() {
        return dailyCap;
    }

    public void setDailyCap(BigDecimal dailyCap) {
        this.dailyCap = dailyCap;
    }

    public BigDecimal getFlexCashbackRate() {
        return flexCashbackRate;
    }

    public void setFlexCashbackRate(BigDecimal flexCashbackRate) {
        this.flexCashbackRate = flexCashbackRate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
