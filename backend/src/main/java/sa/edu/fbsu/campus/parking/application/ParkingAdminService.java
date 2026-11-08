package sa.edu.fbsu.campus.parking.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.audit.application.AdminAuditService;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.parking.domain.ParkingSpot;
import sa.edu.fbsu.campus.parking.domain.ParkingTariff;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.domain.SpotType;
import sa.edu.fbsu.campus.parking.dto.ParkingSpotResponse;
import sa.edu.fbsu.campus.parking.dto.ParkingTariffResponse;
import sa.edu.fbsu.campus.parking.dto.UpdateTariffRequest;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingTariffRepository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ParkingAdminService {

    private final ParkingSpotRepository spotRepository;
    private final ParkingTariffRepository tariffRepository;
    private final AdminAuditService auditService;

    public ParkingAdminService(
            ParkingSpotRepository spotRepository,
            ParkingTariffRepository tariffRepository,
            AdminAuditService auditService
    ) {
        this.spotRepository = spotRepository;
        this.tariffRepository = tariffRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public List<ParkingSpotResponse> listAllSpots(UUID universityId) {
        return spotRepository.findAllWithZoneByUniversityId(universityId).stream()
                .map(this::toSpotResponse)
                .toList();
    }

    @Transactional
    public ParkingSpotResponse updateSpotStatus(
            UUID universityId,
            UUID spotId,
            SpotStatus newStatus,
            String reason,
            UserPrincipal actor
    ) {
        ParkingSpot spot = spotRepository.findByIdForUpdate(spotId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking spot not found with id: " + spotId));

        SpotStatus oldStatus = spot.getStatus();
        spot.setStatus(newStatus);

        if (newStatus == SpotStatus.AVAILABLE || newStatus == SpotStatus.MAINTENANCE) {
            spot.setCurrentOccupantId(null);
            spot.setOccupantNameAr(null);
            spot.setOccupantNameEn(null);
            spot.setVehicleModel(null);
            spot.setPlateLettersAr(null);
            spot.setPlateDigits(null);
            spot.setTimeLeftText(null);
            spot.setSessionEndsAt(null);
        }

        ParkingSpot saved = spotRepository.save(spot);

        auditService.record(
                universityId,
                actor,
                "UPDATE_SPOT_STATUS",
                "PARKING_SPOT",
                spotId.toString(),
                "تحديث حالة الموقف رقم " + spot.getBayNumber() + " من " + oldStatus + " إلى " + newStatus,
                "Updated spot #" + spot.getBayNumber() + " status from " + oldStatus + " to " + newStatus,
                Map.of("oldStatus", oldStatus, "newStatus", newStatus, "reason", reason != null ? reason : "")
        );

        return toSpotResponse(saved);
    }

    @Transactional
    public ParkingSpotResponse updateSpotType(
            UUID universityId,
            UUID spotId,
            SpotType newType,
            Boolean flexEligible,
            UserPrincipal actor
    ) {
        ParkingSpot spot = spotRepository.findByIdForUpdate(spotId)
                .orElseThrow(() -> new ResourceNotFoundException("Parking spot not found with id: " + spotId));

        SpotType oldType = spot.getSpotType();
        spot.setSpotType(newType);
        if (flexEligible != null) {
            spot.setFlexEligible(flexEligible);
        }

        ParkingSpot saved = spotRepository.save(spot);

        auditService.record(
                universityId,
                actor,
                "UPDATE_SPOT_TYPE",
                "PARKING_SPOT",
                spotId.toString(),
                "تحديث تصنيف الموقف رقم " + spot.getBayNumber() + " من " + oldType + " إلى " + newType,
                "Updated spot #" + spot.getBayNumber() + " type from " + oldType + " to " + newType,
                Map.of("oldType", oldType, "newType", newType, "flexEligible", spot.isFlexEligible())
        );

        return toSpotResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ParkingTariffResponse> listTariffs(UUID universityId) {
        return tariffRepository.findAllByUniversityId(universityId).stream()
                .map(t -> new ParkingTariffResponse(
                        t.getId(),
                        t.getUserType(),
                        t.getHourlyRate(),
                        t.getDailyCap(),
                        t.getFlexCashbackRate()
                )).toList();
    }

    @Transactional
    public ParkingTariffResponse updateTariff(
            UUID universityId,
            UserType userType,
            UpdateTariffRequest request,
            UserPrincipal actor
    ) {
        ParkingTariff tariff = tariffRepository.findByUniversityIdAndUserType(universityId, userType)
                .orElseGet(() -> {
                    ParkingTariff newTariff = new ParkingTariff(
                            universityId,
                            userType,
                            request.hourlyRate(),
                            request.dailyCap(),
                            request.flexCashbackRate()
                    );
                    return newTariff;
                });

        tariff.setHourlyRate(request.hourlyRate());
        tariff.setDailyCap(request.dailyCap());
        tariff.setFlexCashbackRate(request.flexCashbackRate());
        ParkingTariff saved = tariffRepository.save(tariff);

        auditService.record(
                universityId,
                actor,
                "UPDATE_TARIFF",
                "PARKING_TARIFF",
                userType.name(),
                "تحديث تعرفة مواقف فئة " + userType + " إلى: ساعة " + request.hourlyRate() + " ر.س",
                "Updated parking tariff for " + userType + " to: hourly " + request.hourlyRate() + " SAR",
                request
        );

        return new ParkingTariffResponse(
                saved.getId(),
                saved.getUserType(),
                saved.getHourlyRate(),
                saved.getDailyCap(),
                saved.getFlexCashbackRate()
        );
    }

    private ParkingSpotResponse toSpotResponse(ParkingSpot s) {
        return new ParkingSpotResponse(
                s.getId(),
                s.getBayNumber(),
                s.getZone().getCode(),
                s.getZone().getNameAr(),
                s.getZone().getNameEn(),
                s.getSpotType(),
                s.getStatus(),
                s.getDistanceMeters(),
                s.isFlexEligible(),
                s.getCurrentOccupantId(),
                s.getOccupantNameAr(),
                s.getOccupantNameEn(),
                s.getVehicleModel(),
                s.getPlateLettersAr(),
                s.getPlateDigits(),
                s.getTimeLeftText(),
                s.getSessionEndsAt()
        );
    }
}

