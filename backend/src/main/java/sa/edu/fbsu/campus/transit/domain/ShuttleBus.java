package sa.edu.fbsu.campus.transit.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;

import java.util.UUID;

@Entity
@Table(name = "shuttle_bus")
public class ShuttleBus extends BaseTenantEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_route_id")
    private TransitRoute currentRoute;

    @Column(name = "bus_number", nullable = false, unique = true, length = 30)
    private String busNumber;

    @Column(name = "plate_letters_ar", nullable = false, length = 20)
    private String plateLettersAr;

    @Column(name = "plate_digits", nullable = false, length = 10)
    private String plateDigits;

    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;

    @Column(name = "total_capacity", nullable = false)
    private int totalCapacity = 28;

    @Column(name = "occupied_seats", nullable = false)
    private int occupiedSeats = 0;

    @Column(name = "is_electric", nullable = false)
    private boolean isElectric = true;

    @Column(name = "driver_name_ar", nullable = false, length = 150)
    private String driverNameAr;

    @Column(name = "driver_name_en", nullable = false, length = 150)
    private String driverNameEn;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private ShuttleStatus status = ShuttleStatus.IN_TRANSIT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_stop_id")
    private TransitStop currentStop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "next_stop_id")
    private TransitStop nextStop;

    @Column(name = "next_stop_eta_mins", nullable = false)
    private int nextStopEtaMins = 3;

    @Column(name = "battery_percentage", nullable = false)
    private int batteryPercentage = 90;

    protected ShuttleBus() {
    }

    public ShuttleBus(
            UUID universityId,
            TransitRoute currentRoute,
            String busNumber,
            String plateLettersAr,
            String plateDigits,
            String modelName,
            int totalCapacity,
            int occupiedSeats,
            boolean isElectric,
            String driverNameAr,
            String driverNameEn,
            ShuttleStatus status,
            TransitStop currentStop,
            TransitStop nextStop,
            int nextStopEtaMins,
            int batteryPercentage
    ) {
        setUniversityId(universityId);
        this.currentRoute = currentRoute;
        this.busNumber = busNumber;
        this.plateLettersAr = plateLettersAr;
        this.plateDigits = plateDigits;
        this.modelName = modelName;
        this.totalCapacity = totalCapacity;
        this.occupiedSeats = occupiedSeats;
        this.isElectric = isElectric;
        this.driverNameAr = driverNameAr;
        this.driverNameEn = driverNameEn;
        this.status = status != null ? status : ShuttleStatus.IN_TRANSIT;
        this.currentStop = currentStop;
        this.nextStop = nextStop;
        this.nextStopEtaMins = nextStopEtaMins;
        this.batteryPercentage = batteryPercentage;
    }

    public int getAvailableSeats() {
        return Math.max(0, totalCapacity - occupiedSeats);
    }

    public TransitRoute getCurrentRoute() {
        return currentRoute;
    }

    public void setCurrentRoute(TransitRoute currentRoute) {
        this.currentRoute = currentRoute;
    }

    public String getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(String busNumber) {
        this.busNumber = busNumber;
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

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public int getTotalCapacity() {
        return totalCapacity;
    }

    public void setTotalCapacity(int totalCapacity) {
        this.totalCapacity = totalCapacity;
    }

    public int getOccupiedSeats() {
        return occupiedSeats;
    }

    public void setOccupiedSeats(int occupiedSeats) {
        this.occupiedSeats = occupiedSeats;
    }

    public boolean isElectric() {
        return isElectric;
    }

    public void setElectric(boolean electric) {
        isElectric = electric;
    }

    public String getDriverNameAr() {
        return driverNameAr;
    }

    public void setDriverNameAr(String driverNameAr) {
        this.driverNameAr = driverNameAr;
    }

    public String getDriverNameEn() {
        return driverNameEn;
    }

    public void setDriverNameEn(String driverNameEn) {
        this.driverNameEn = driverNameEn;
    }

    public ShuttleStatus getStatus() {
        return status;
    }

    public void setStatus(ShuttleStatus status) {
        this.status = status;
    }

    public TransitStop getCurrentStop() {
        return currentStop;
    }

    public void setCurrentStop(TransitStop currentStop) {
        this.currentStop = currentStop;
    }

    public TransitStop getNextStop() {
        return nextStop;
    }

    public void setNextStop(TransitStop nextStop) {
        this.nextStop = nextStop;
    }

    public int getNextStopEtaMins() {
        return nextStopEtaMins;
    }

    public void setNextStopEtaMins(int nextStopEtaMins) {
        this.nextStopEtaMins = nextStopEtaMins;
    }

    public int getBatteryPercentage() {
        return batteryPercentage;
    }

    public void setBatteryPercentage(int batteryPercentage) {
        this.batteryPercentage = batteryPercentage;
    }
}
