package sa.edu.fbsu.campus.transit.dto;

import sa.edu.fbsu.campus.transit.domain.TransitStop;

import java.util.UUID;

public record TransitStopResponse(
        UUID id,
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
    public static TransitStopResponse fromEntity(TransitStop stop) {
        if (stop == null) return null;
        return new TransitStopResponse(
                stop.getId(),
                stop.getStopCode(),
                stop.getNameAr(),
                stop.getNameEn(),
                stop.getLocationDescAr(),
                stop.getLocationDescEn(),
                stop.getStopOrder(),
                stop.getEtaMinutesFromStart(),
                stop.isHasShelter(),
                stop.isHasAc()
        );
    }
}
