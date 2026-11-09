package sa.edu.fbsu.campus.transit.dto;

import sa.edu.fbsu.campus.transit.domain.TransitPass;
import sa.edu.fbsu.campus.transit.domain.TransitPassStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TransitPassResponse(
        UUID id,
        String passCode,
        String qrToken,
        String userName,
        String userUniversityNumber,
        UUID routeId,
        String routeCode,
        String routeNameAr,
        String routeNameEn,
        String routeColor,
        UUID shuttleId,
        String busNumber,
        UUID pickupStopId,
        String pickupStopNameAr,
        String pickupStopNameEn,
        UUID dropoffStopId,
        String dropoffStopNameAr,
        String dropoffStopNameEn,
        String boardingWindow,
        BigDecimal fareAmount,
        TransitPassStatus status,
        Instant createdAt
) {
    public static TransitPassResponse fromEntity(TransitPass pass) {
        if (pass == null) return null;
        return new TransitPassResponse(
                pass.getId(),
                pass.getPassCode(),
                pass.getQrToken(),
                pass.getUser().getFullNameAr(),
                pass.getUser().getUniversityNumber(),
                pass.getRoute().getId(),
                pass.getRoute().getRouteCode(),
                pass.getRoute().getNameAr(),
                pass.getRoute().getNameEn(),
                pass.getRoute().getColorHex(),
                pass.getShuttle() != null ? pass.getShuttle().getId() : null,
                pass.getShuttle() != null ? pass.getShuttle().getBusNumber() : null,
                pass.getPickupStop().getId(),
                pass.getPickupStop().getNameAr(),
                pass.getPickupStop().getNameEn(),
                pass.getDropoffStop().getId(),
                pass.getDropoffStop().getNameAr(),
                pass.getDropoffStop().getNameEn(),
                pass.getBoardingWindow(),
                pass.getFareAmount(),
                pass.getStatus(),
                pass.getCreatedAt()
        );
    }
}
