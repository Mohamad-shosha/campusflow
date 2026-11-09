package sa.edu.fbsu.campus.transit.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;

import java.util.UUID;

@Entity
@Table(name = "transit_stop", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"route_id", "stop_code"})
})
public class TransitStop extends BaseTenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "route_id", nullable = false)
    private TransitRoute route;

    @Column(name = "stop_code", nullable = false, length = 30)
    private String stopCode;

    @Column(name = "name_ar", nullable = false, length = 200)
    private String nameAr;

    @Column(name = "name_en", nullable = false, length = 200)
    private String nameEn;

    @Column(name = "location_desc_ar", nullable = false, length = 300)
    private String locationDescAr;

    @Column(name = "location_desc_en", nullable = false, length = 300)
    private String locationDescEn;

    @Column(name = "stop_order", nullable = false)
    private int stopOrder = 1;

    @Column(name = "eta_minutes_from_start", nullable = false)
    private int etaMinutesFromStart = 0;

    @Column(name = "has_shelter", nullable = false)
    private boolean hasShelter = true;

    @Column(name = "has_ac", nullable = false)
    private boolean hasAc = true;

    protected TransitStop() {
    }

    public TransitStop(
            UUID universityId,
            TransitRoute route,
            String stopCode,
            String nameAr,
            String nameEn,
            String locationDescAr,
            String locationDescEn,
            int stopOrder,
            int etaMinutesFromStart,
            boolean hasShelter,
            boolean hasAc
    ) {
        setUniversityId(universityId);
        this.route = route;
        this.stopCode = stopCode;
        this.nameAr = nameAr;
        this.nameEn = nameEn;
        this.locationDescAr = locationDescAr;
        this.locationDescEn = locationDescEn;
        this.stopOrder = stopOrder;
        this.etaMinutesFromStart = etaMinutesFromStart;
        this.hasShelter = hasShelter;
        this.hasAc = hasAc;
    }

    public TransitRoute getRoute() {
        return route;
    }

    public void setRoute(TransitRoute route) {
        this.route = route;
    }

    public String getStopCode() {
        return stopCode;
    }

    public void setStopCode(String stopCode) {
        this.stopCode = stopCode;
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

    public String getLocationDescAr() {
        return locationDescAr;
    }

    public void setLocationDescAr(String locationDescAr) {
        this.locationDescAr = locationDescAr;
    }

    public String getLocationDescEn() {
        return locationDescEn;
    }

    public void setLocationDescEn(String locationDescEn) {
        this.locationDescEn = locationDescEn;
    }

    public int getStopOrder() {
        return stopOrder;
    }

    public void setStopOrder(int stopOrder) {
        this.stopOrder = stopOrder;
    }

    public int getEtaMinutesFromStart() {
        return etaMinutesFromStart;
    }

    public void setEtaMinutesFromStart(int etaMinutesFromStart) {
        this.etaMinutesFromStart = etaMinutesFromStart;
    }

    public boolean isHasShelter() {
        return hasShelter;
    }

    public void setHasShelter(boolean hasShelter) {
        this.hasShelter = hasShelter;
    }

    public boolean isHasAc() {
        return hasAc;
    }

    public void setHasAc(boolean hasAc) {
        this.hasAc = hasAc;
    }
}
