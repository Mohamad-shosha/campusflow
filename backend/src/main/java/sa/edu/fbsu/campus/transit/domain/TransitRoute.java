package sa.edu.fbsu.campus.transit.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "transit_route")
public class TransitRoute extends BaseTenantEntity {

    @Column(name = "route_code", nullable = false, unique = true, length = 30)
    private String routeCode;

    @Column(name = "name_ar", nullable = false, length = 200)
    private String nameAr;

    @Column(name = "name_en", nullable = false, length = 200)
    private String nameEn;

    @Column(name = "color_hex", nullable = false, length = 20)
    private String colorHex = "#10b981";

    @Column(name = "operating_hours_ar", nullable = false, length = 100)
    private String operatingHoursAr = "07:30 ص - 05:30 م";

    @Column(name = "operating_hours_en", nullable = false, length = 100)
    private String operatingHoursEn = "07:30 AM - 05:30 PM";

    @Column(name = "frequency_minutes", nullable = false)
    private int frequencyMinutes = 10;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TransitRouteStatus status = TransitRouteStatus.ACTIVE;

    @Column(name = "display_order", nullable = false)
    private int displayOrder = 1;

    @Column(name = "source", nullable = false, length = 20)
    private String source = "MANUAL";

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("stopOrder ASC")
    private List<TransitStop> stops = new ArrayList<>();

    protected TransitRoute() {
    }

    public TransitRoute(
            UUID universityId,
            String routeCode,
            String nameAr,
            String nameEn,
            String colorHex,
            String operatingHoursAr,
            String operatingHoursEn,
            int frequencyMinutes,
            TransitRouteStatus status,
            int displayOrder
    ) {
        setUniversityId(universityId);
        this.routeCode = routeCode;
        this.nameAr = nameAr;
        this.nameEn = nameEn;
        this.colorHex = colorHex != null ? colorHex : "#10b981";
        this.operatingHoursAr = operatingHoursAr;
        this.operatingHoursEn = operatingHoursEn;
        this.frequencyMinutes = frequencyMinutes;
        this.status = status != null ? status : TransitRouteStatus.ACTIVE;
        this.displayOrder = displayOrder;
    }

    public String getRouteCode() {
        return routeCode;
    }

    public void setRouteCode(String routeCode) {
        this.routeCode = routeCode;
    }

    public String getNameAr() {
        return nameAr;
    }

    public void setNameAr(String nameAr) {
        this.nameAr = nameAr;
    }

    public String getNameEn() {
        return nameEn;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public String getColorHex() {
        return colorHex;
    }

    public void setColorHex(String colorHex) {
        this.colorHex = colorHex;
    }

    public String getOperatingHoursAr() {
        return operatingHoursAr;
    }

    public void setOperatingHoursAr(String operatingHoursAr) {
        this.operatingHoursAr = operatingHoursAr;
    }

    public String getOperatingHoursEn() {
        return operatingHoursEn;
    }

    public void setOperatingHoursEn(String operatingHoursEn) {
        this.operatingHoursEn = operatingHoursEn;
    }

    public int getFrequencyMinutes() {
        return frequencyMinutes;
    }

    public void setFrequencyMinutes(int frequencyMinutes) {
        this.frequencyMinutes = frequencyMinutes;
    }

    public TransitRouteStatus getStatus() {
        return status;
    }

    public void setStatus(TransitRouteStatus status) {
        this.status = status;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source != null && !source.isBlank() ? source.trim() : "MANUAL";
    }

    public List<TransitStop> getStops() {
        return stops;
    }

    public void setStops(List<TransitStop> stops) {
        this.stops = stops;
    }
}

