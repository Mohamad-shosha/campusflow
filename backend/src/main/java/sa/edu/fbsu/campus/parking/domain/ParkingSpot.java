package sa.edu.fbsu.campus.parking.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "parking_spot")
public class ParkingSpot extends BaseTenantEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id", nullable = false)
    private ParkingZone zone;

    @Column(name = "bay_number", nullable = false)
    private int bayNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "spot_type", nullable = false, length = 30)
    private SpotType spotType = SpotType.STANDARD;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private SpotStatus status = SpotStatus.AVAILABLE;

    @Column(name = "distance_meters", nullable = false)
    private int distanceMeters = 30;

    @Column(name = "is_flex_eligible", nullable = false)
    private boolean flexEligible = false;

    @Column(name = "current_occupant_id")
    private UUID currentOccupantId;

    @Column(name = "occupant_name_ar")
    private String occupantNameAr;

    @Column(name = "occupant_name_en")
    private String occupantNameEn;

    @Column(name = "vehicle_model", length = 100)
    private String vehicleModel;

    @Column(name = "plate_letters_ar", length = 10)
    private String plateLettersAr;

    @Column(name = "plate_digits", length = 10)
    private String plateDigits;

    @Column(name = "time_left_text", length = 100)
    private String timeLeftText;

    @Column(name = "session_ends_at")
    private Instant sessionEndsAt;

    protected ParkingSpot() {
    }

    public ParkingSpot(
            UUID universityId,
            ParkingZone zone,
            int bayNumber,
            SpotType spotType,
            SpotStatus status,
            int distanceMeters,
            boolean flexEligible) {
        setUniversityId(universityId);
        this.zone = zone;
        this.bayNumber = bayNumber;
        this.spotType = spotType;
        this.status = status;
        this.distanceMeters = distanceMeters;
        this.flexEligible = flexEligible;
    }

    public ParkingZone getZone() {
        return zone;
    }

    public void setZone(ParkingZone zone) {
        this.zone = zone;
    }

    public int getBayNumber() {
        return bayNumber;
    }

    public void setBayNumber(int bayNumber) {
        this.bayNumber = bayNumber;
    }

    public SpotType getSpotType() {
        return spotType;
    }

    public void setSpotType(SpotType spotType) {
        this.spotType = spotType;
    }

    public SpotStatus getStatus() {
        return status;
    }

    public void setStatus(SpotStatus status) {
        this.status = status;
    }

    public int getDistanceMeters() {
        return distanceMeters;
    }

    public void setDistanceMeters(int distanceMeters) {
        this.distanceMeters = distanceMeters;
    }

    public boolean isFlexEligible() {
        return flexEligible;
    }

    public void setFlexEligible(boolean flexEligible) {
        this.flexEligible = flexEligible;
    }

    public UUID getCurrentOccupantId() {
        return currentOccupantId;
    }

    public void setCurrentOccupantId(UUID currentOccupantId) {
        this.currentOccupantId = currentOccupantId;
    }

    public String getOccupantNameAr() {
        return occupantNameAr;
    }

    public void setOccupantNameAr(String occupantNameAr) {
        this.occupantNameAr = occupantNameAr;
    }

    public String getOccupantNameEn() {
        return occupantNameEn;
    }

    public void setOccupantNameEn(String occupantNameEn) {
        this.occupantNameEn = occupantNameEn;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public String getPlateLettersAr() {
        return plateLettersAr;
    }

    public void setPlateLettersAr(String plateLettersAr) {
        this.plateLettersAr = plateLettersAr;
    }

    public String getPlateDigits() {
        return plateDigits;
    }

    public void setPlateDigits(String plateDigits) {
        this.plateDigits = plateDigits;
    }

    public String getTimeLeftText() {
        return timeLeftText;
    }

    public void setTimeLeftText(String timeLeftText) {
        this.timeLeftText = timeLeftText;
    }

    public Instant getSessionEndsAt() {
        return sessionEndsAt;
    }

    public void setSessionEndsAt(Instant sessionEndsAt) {
        this.sessionEndsAt = sessionEndsAt;
    }
}

