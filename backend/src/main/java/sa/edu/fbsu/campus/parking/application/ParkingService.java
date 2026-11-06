package sa.edu.fbsu.campus.parking.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.parking.domain.ParkingSpot;
import sa.edu.fbsu.campus.parking.domain.ParkingZone;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.dto.ParkingSpotResponse;
import sa.edu.fbsu.campus.parking.dto.ParkingSummaryResponse;
import sa.edu.fbsu.campus.parking.dto.ParkingTariffResponse;
import sa.edu.fbsu.campus.parking.dto.ParkingZoneResponse;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingTariffRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingZoneRepository;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class ParkingService {

    private final ParkingZoneRepository zoneRepository;
    private final ParkingSpotRepository spotRepository;
    private final ParkingTariffRepository tariffRepository;

    public ParkingService(
            ParkingZoneRepository zoneRepository,
            ParkingSpotRepository spotRepository,
            ParkingTariffRepository tariffRepository) {
        this.zoneRepository = zoneRepository;
        this.spotRepository = spotRepository;
        this.tariffRepository = tariffRepository;
    }

    public List<ParkingZoneResponse> getZones(UUID universityId) {
        List<ParkingZone> zones = zoneRepository.findAllByUniversityIdOrderByCodeAsc(universityId);
        List<ParkingSpot> allSpots = spotRepository.findAllWithZoneByUniversityId(universityId);

        return zones.stream().map(zone -> {
            long avail = allSpots.stream()
                    .filter(s -> s.getZone().getId().equals(zone.getId()) && s.getStatus() == SpotStatus.AVAILABLE)
                    .count();
            long occ = allSpots.stream()
                    .filter(s -> s.getZone().getId().equals(zone.getId()) &&
                            (s.getStatus() == SpotStatus.OCCUPIED || s.getStatus() == SpotStatus.FACULTY_ASSIGNED))
                    .count();
            long flex = allSpots.stream()
                    .filter(s -> s.getZone().getId().equals(zone.getId()) && s.getStatus() == SpotStatus.FLEX_SHARE)
                    .count();

            return new ParkingZoneResponse(
                    zone.getId(),
                    zone.getCode(),
                    zone.getNameAr(),
                    zone.getNameEn(),
                    zone.getTotalSpots(),
                    avail,
                    occ,
                    flex
            );
        }).toList();
    }

    public List<ParkingSpotResponse> getSpots(UUID universityId, String zoneCode, SpotStatus status) {
        List<ParkingSpot> spots;
        if (zoneCode != null && !zoneCode.isBlank()) {
            spots = spotRepository.findAllWithZoneByUniversityIdAndZoneCode(universityId, zoneCode.toUpperCase());
        } else {
            spots = spotRepository.findAllWithZoneByUniversityId(universityId);
        }

        if (status != null) {
            spots = spots.stream().filter(s -> s.getStatus() == status).toList();
        }

        return spots.stream().map(this::toSpotResponse).toList();
    }

    public ParkingSpotResponse getSpotByBay(UUID universityId, int bayNumber) {
        ParkingSpot spot = spotRepository.findByUniversityIdAndBayNumber(universityId, bayNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Parking spot bay #" + bayNumber + " not found"));
        return toSpotResponse(spot);
    }

    public ParkingSummaryResponse getSummary(UUID universityId) {
        List<ParkingSpot> allSpots = spotRepository.findAllByUniversityIdOrderByBayNumberAsc(universityId);
        int total = allSpots.size();

        long available = allSpots.stream().filter(s -> s.getStatus() == SpotStatus.AVAILABLE).count();
        long occupied = allSpots.stream().filter(s -> s.getStatus() == SpotStatus.OCCUPIED).count();
        long flex = allSpots.stream().filter(s -> s.getStatus() == SpotStatus.FLEX_SHARE).count();
        long reserved = allSpots.stream().filter(s -> s.getStatus() == SpotStatus.RESERVED).count();
        long faculty = allSpots.stream().filter(s -> s.getStatus() == SpotStatus.FACULTY_ASSIGNED).count();

        double occupancyRate = total > 0 ? ((double) (total - available) / total) * 100.0 : 0.0;

        return new ParkingSummaryResponse(
                total,
                available,
                occupied,
                flex,
                reserved,
                faculty,
                Math.round(occupancyRate * 10.0) / 10.0
        );
    }

    public List<ParkingTariffResponse> getTariffs(UUID universityId) {
        return tariffRepository.findAllByUniversityId(universityId).stream()
                .map(t -> new ParkingTariffResponse(
                        t.getId(),
                        t.getUserType(),
                        t.getHourlyRate(),
                        t.getDailyCap(),
                        t.getFlexCashbackRate()
                )).toList();
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

