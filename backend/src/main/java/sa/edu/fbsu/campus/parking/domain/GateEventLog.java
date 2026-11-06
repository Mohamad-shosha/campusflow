package sa.edu.fbsu.campus.parking.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.domain.Vehicle;

import java.util.UUID;

@Entity
@Table(name = "gate_event_log")
public class GateEventLog extends BaseTenantEntity {

    @Column(name = "gate_id", nullable = false, length = 50)
    private String gateId = "MAIN_GATE_IN";

    @Column(name = "plate_letters_ar", nullable = false, length = 10)
    private String plateLettersAr;

    @Column(name = "plate_digits", nullable = false, length = 10)
    private String plateDigits;

    @Column(name = "decision", nullable = false, length = 20)
    private String decision;

    @Column(name = "reason", nullable = false, length = 100)
    private String reason;

    @Column(name = "bay_number")
    private Integer bayNumber;

    @Column(name = "bay_code", length = 20)
    private String bayCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    protected GateEventLog() {
    }

    public GateEventLog(
            UUID universityId,
            String gateId,
            String plateLettersAr,
            String plateDigits,
            String decision,
            String reason,
            Integer bayNumber,
            String bayCode,
            User user,
            Vehicle vehicle
    ) {
        setUniversityId(universityId);
        this.gateId = gateId != null ? gateId : "MAIN_GATE_IN";
        this.plateLettersAr = plateLettersAr;
        this.plateDigits = plateDigits;
        this.decision = decision;
        this.reason = reason;
        this.bayNumber = bayNumber;
        this.bayCode = bayCode;
        this.user = user;
        this.vehicle = vehicle;
    }

    public String getGateId() {
        return gateId;
    }

    public String getPlateLettersAr() {
        return plateLettersAr;
    }

    public String getPlateDigits() {
        return plateDigits;
    }

    public String getDecision() {
        return decision;
    }

    public String getReason() {
        return reason;
    }

    public Integer getBayNumber() {
        return bayNumber;
    }

    public String getBayCode() {
        return bayCode;
    }

    public User getUser() {
        return user;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }
}

