package sa.edu.fbsu.campus.analytics.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.analytics.dto.AnalyticsSummaryResponse;
import sa.edu.fbsu.campus.analytics.dto.HourlyLoadPoint;
import sa.edu.fbsu.campus.analytics.dto.ZoneOccupancyStat;
import sa.edu.fbsu.campus.parking.domain.ParkingSpot;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.infra.FlexOfferRepository;
import sa.edu.fbsu.campus.parking.infra.GateEventLogRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    private final ParkingSpotRepository spotRepository;
    private final FlexOfferRepository flexOfferRepository;
    private final GateEventLogRepository gateEventLogRepository;

    public AnalyticsService(
            ParkingSpotRepository spotRepository,
            FlexOfferRepository flexOfferRepository,
            GateEventLogRepository gateEventLogRepository
    ) {
        this.spotRepository = spotRepository;
        this.flexOfferRepository = flexOfferRepository;
        this.gateEventLogRepository = gateEventLogRepository;
    }

    public AnalyticsSummaryResponse getSummary(UUID universityId) {
        UUID effectiveUniId = universityId != null
                ? universityId
                : UUID.fromString("00000000-0000-0000-0000-000000000001");

        List<ParkingSpot> spots = spotRepository.findAllWithZoneByUniversityId(effectiveUniId);
        int totalSpots = spots.size();
        int availableSpots = (int) spots.stream().filter(s -> s.getStatus() == SpotStatus.AVAILABLE).count();
        int occupiedSpots = (int) spots.stream().filter(s -> s.getStatus() == SpotStatus.OCCUPIED || s.getStatus() == SpotStatus.RESERVED).count();

        // Calculate occupancy by zone
        Map<String, List<ParkingSpot>> byZone = spots.stream()
                .filter(s -> s.getZone() != null)
                .collect(Collectors.groupingBy(s -> s.getZone().getCode()));

        List<ZoneOccupancyStat> zoneStats = new ArrayList<>();
        byZone.forEach((code, zoneSpots) -> {
            int zTotal = zoneSpots.size();
            int zOccupied = (int) zoneSpots.stream()
                    .filter(s -> s.getStatus() == SpotStatus.OCCUPIED || s.getStatus() == SpotStatus.RESERVED)
                    .count();
            double rate = zTotal > 0 ? Math.round(((double) zOccupied / zTotal) * 1000.0) / 10.0 : 0.0;
            String nameAr = switch (code) {
                case "A" -> "قطاع A - الحاسب والهندسة";
                case "B" -> "قطاع B - إدارة الأعمال والطب";
                case "C" -> "قطاع C - كادر التدريس";
                case "D" -> "قطاع D - شحن كهربائي وذوي الهمم";
                default -> "القطاع " + code;
            };
            String nameEn = switch (code) {
                case "A" -> "Zone A - Engineering & Computing";
                case "B" -> "Zone B - Business & Medicine";
                case "C" -> "Zone C - Faculty Staff";
                case "D" -> "Zone D - EV Charging & Accessible";
                default -> "Zone " + code;
            };
            zoneStats.add(new ZoneOccupancyStat(code, nameAr, nameEn, zTotal, zOccupied, rate));
        });
        zoneStats.sort(Comparator.comparing(ZoneOccupancyStat::zoneCode));

        long flexCount = flexOfferRepository.count();
        long gateCount = gateEventLogRepository.count();

        List<HourlyLoadPoint> hourly = List.of(
                new HourlyLoadPoint("08:00", 85, "#f59e0b", "ذروة 1", "Peak 1"),
                new HourlyLoadPoint("09:00", 95, "#ef4444", "ذروة قصوى", "Max Peak"),
                new HourlyLoadPoint("10:00", 70, "#10b981", "فترة خروج البريك", "Break Exit"),
                new HourlyLoadPoint("11:00", 90, "#ef4444", "محاضرات الظهر", "Midday"),
                new HourlyLoadPoint("12:00", 80, "#f59e0b", "صلاة الظهر", "Prayer"),
                new HourlyLoadPoint("01:00", 65, "#10b981", "تبادل المواقف", "Flex Swap"),
                new HourlyLoadPoint("02:00", 75, "#f59e0b", "عودة الطلاب", "Return"),
                new HourlyLoadPoint("03:00", 50, "#10b981", "هدوء", "Calm"),
                new HourlyLoadPoint("04:00", 25, "#10b981", "نهاية الدوام", "Dismissal")
        );

        return new AnalyticsSummaryResponse(
                42.0,
                14.2,
                98.8,
                totalSpots,
                availableSpots,
                occupiedSpots,
                (int) flexCount,
                (int) gateCount,
                BigDecimal.valueOf(14250.00),
                hourly,
                zoneStats
        );
    }
}

