package sa.edu.fbsu.campus.analytics.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.analytics.dto.AnalyticsSummaryResponse;
import sa.edu.fbsu.campus.analytics.dto.HourlyLoadPoint;
import sa.edu.fbsu.campus.analytics.dto.RevenueBreakdownStat;
import sa.edu.fbsu.campus.analytics.dto.RoomsUtilizationStat;
import sa.edu.fbsu.campus.analytics.dto.ZoneOccupancyStat;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.parking.domain.FlexOfferStatus;
import sa.edu.fbsu.campus.parking.domain.ParkingSpot;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.infra.FlexOfferRepository;
import sa.edu.fbsu.campus.parking.infra.GateEventLogRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;
import sa.edu.fbsu.campus.rooms.domain.RoomBookingStatus;
import sa.edu.fbsu.campus.rooms.domain.RoomStatus;
import sa.edu.fbsu.campus.rooms.domain.StudyRoom;
import sa.edu.fbsu.campus.rooms.infra.RoomBookingRepository;
import sa.edu.fbsu.campus.rooms.infra.StudyRoomRepository;
import sa.edu.fbsu.campus.tutoring.domain.TutoringEnrollmentStatus;
import sa.edu.fbsu.campus.tutoring.infra.TutoringEnrollmentRepository;
import sa.edu.fbsu.campus.wallet.domain.TransactionDirection;
import sa.edu.fbsu.campus.wallet.domain.TransactionType;
import sa.edu.fbsu.campus.wallet.infra.LedgerEntryRepository;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.DateTimeException;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Campus analytics computed exclusively from persisted records.
 *
 * <ul>
 *   <li>Spot / zone occupancy: {@code parking_spot}</li>
 *   <li>Active flex offers: {@code flex_offer} with status AVAILABLE</li>
 *   <li>Gate passages and hourly load: GRANTED rows of {@code gate_event_log}</li>
 *   <li>Parking revenue: PARKING_FEE debits minus parking booking refunds in {@code ledger_entry}</li>
 * </ul>
 *
 * Metrics with no backing data source (net capacity gain, time saved, satisfaction rate)
 * are returned as {@code null} rather than estimated.
 */
@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    /** Gate decision value written by GateDecisionService for an admitted vehicle. */
    static final String GATE_GRANTED = "GRANTED";
    /** Idempotency-key prefix used by BookingService for parking booking refunds. */
    static final String PARKING_REFUND_KEY_PREFIX = "REFUND-";
    /** Look-back window for the hourly gate load distribution. */
    static final Duration HOURLY_LOAD_WINDOW = Duration.ofDays(7);

    private static final UUID DEFAULT_UNIVERSITY_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final ZoneId FALLBACK_ZONE = ZoneId.of("Asia/Riyadh");

    private final ParkingSpotRepository spotRepository;
    private final FlexOfferRepository flexOfferRepository;
    private final GateEventLogRepository gateEventLogRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final StudyRoomRepository studyRoomRepository;
    private final RoomBookingRepository roomBookingRepository;
    private final TutoringEnrollmentRepository tutoringEnrollmentRepository;
    private final UniversityRepository universityRepository;
    private final Clock clock;

    public AnalyticsService(
            ParkingSpotRepository spotRepository,
            FlexOfferRepository flexOfferRepository,
            GateEventLogRepository gateEventLogRepository,
            LedgerEntryRepository ledgerEntryRepository,
            StudyRoomRepository studyRoomRepository,
            RoomBookingRepository roomBookingRepository,
            TutoringEnrollmentRepository tutoringEnrollmentRepository,
            UniversityRepository universityRepository,
            Optional<Clock> clock
    ) {
        this.spotRepository = spotRepository;
        this.flexOfferRepository = flexOfferRepository;
        this.gateEventLogRepository = gateEventLogRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.studyRoomRepository = studyRoomRepository;
        this.roomBookingRepository = roomBookingRepository;
        this.tutoringEnrollmentRepository = tutoringEnrollmentRepository;
        this.universityRepository = universityRepository;
        this.clock = clock.orElse(Clock.systemUTC());
    }

    public AnalyticsSummaryResponse getSummary(UUID universityId) {
        UUID effectiveUniId = universityId != null ? universityId : DEFAULT_UNIVERSITY_ID;

        List<ParkingSpot> spots = spotRepository.findAllWithZoneByUniversityId(effectiveUniId);
        int totalSpots = spots.size();
        int availableSpots = (int) spots.stream().filter(s -> s.getStatus() == SpotStatus.AVAILABLE).count();
        int occupiedSpots = (int) spots.stream()
                .filter(s -> s.getStatus() == SpotStatus.OCCUPIED || s.getStatus() == SpotStatus.RESERVED)
                .count();

        int activeFlexOffers = (int) flexOfferRepository.countByUniversityIdAndStatus(effectiveUniId, FlexOfferStatus.AVAILABLE);
        int grantedPassages = (int) gateEventLogRepository.countByUniversityIdAndDecision(effectiveUniId, GATE_GRANTED);

        RevenueBreakdownStat revenueBreakdown = getRevenueBreakdown(effectiveUniId);

        return new AnalyticsSummaryResponse(
                null, // netCapacityGainPercent: no baseline capacity data recorded
                null, // timeSavedMinutes: no search-time measurements recorded
                null, // satisfactionRatePercent: no survey data recorded
                totalSpots,
                availableSpots,
                occupiedSpots,
                activeFlexOffers,
                grantedPassages,
                revenueBreakdown.netParkingRevenue(),
                getHourlyLoad(effectiveUniId),
                buildZoneStats(spots),
                getRoomsUtilization(effectiveUniId),
                revenueBreakdown
        );
    }

    /**
     * Distribution of admitted vehicles by hour of day (university local time) over the last
     * {@link #HOURLY_LOAD_WINDOW}. {@code load} is relative to the busiest hour (busiest = 100).
     * Returns an empty list when no gate entries were recorded in the window.
     */
    public List<HourlyLoadPoint> getHourlyLoad(UUID universityId) {
        UUID effectiveUniId = universityId != null ? universityId : DEFAULT_UNIVERSITY_ID;
        Instant since = Instant.now(clock).minus(HOURLY_LOAD_WINDOW);
        List<Instant> entries = gateEventLogRepository.findEventTimesSince(effectiveUniId, GATE_GRANTED, since);
        if (entries.isEmpty()) {
            return List.of();
        }

        ZoneId zone = resolveZone(effectiveUniId);
        int[] perHour = new int[24];
        for (Instant at : entries) {
            perHour[at.atZone(zone).getHour()]++;
        }
        int max = Arrays.stream(perHour).max().orElse(0);

        List<HourlyLoadPoint> points = new ArrayList<>();
        for (int hour = 0; hour < 24; hour++) {
            int count = perHour[hour];
            if (count == 0) {
                continue;
            }
            int load = (int) Math.round(count * 100.0 / max);
            points.add(new HourlyLoadPoint(
                    String.format("%02d:00", hour),
                    load,
                    loadColor(load),
                    count + " دخول",
                    count + (count == 1 ? " entry" : " entries")
            ));
        }
        return points;
    }

    public List<ZoneOccupancyStat> getZoneStats(UUID universityId) {
        UUID effectiveUniId = universityId != null ? universityId : DEFAULT_UNIVERSITY_ID;
        return buildZoneStats(spotRepository.findAllWithZoneByUniversityId(effectiveUniId));
    }

    public RoomsUtilizationStat getRoomsUtilization(UUID universityId) {
        UUID effectiveUniId = universityId != null ? universityId : DEFAULT_UNIVERSITY_ID;
        List<StudyRoom> rooms = studyRoomRepository.findAllByUniversityIdOrderByDisplayOrderAsc(effectiveUniId);
        int totalRooms = rooms.size();
        int available = (int) rooms.stream().filter(r -> r.getStatus() == RoomStatus.AVAILABLE).count();
        int inUse = (int) rooms.stream().filter(r -> r.getStatus() == RoomStatus.IN_USE).count();
        int reserved = (int) rooms.stream().filter(r -> r.getStatus() == RoomStatus.RESERVED).count();
        int maintenance = (int) rooms.stream().filter(r -> r.getStatus() == RoomStatus.MAINTENANCE).count();

        int bookable = totalRooms - maintenance;
        double activePercent = bookable > 0
                ? Math.round(((double) (inUse + reserved) / bookable) * 1000.0) / 10.0
                : 0.0;
        int activeBookings = (int) roomBookingRepository.countByUniversityIdAndStatusIn(
                effectiveUniId, List.of(RoomBookingStatus.ACTIVE, RoomBookingStatus.RESERVED));

        return new RoomsUtilizationStat(
                totalRooms,
                available,
                inUse,
                reserved,
                maintenance,
                activePercent,
                activeBookings
        );
    }

    public RevenueBreakdownStat getRevenueBreakdown(UUID universityId) {
        UUID effectiveUniId = universityId != null ? universityId : DEFAULT_UNIVERSITY_ID;
        BigDecimal parkingNet = netParkingRevenue(effectiveUniId);
        BigDecimal tuition = nz(ledgerEntryRepository.sumAmount(
                effectiveUniId, TransactionType.TUITION_PAYMENT, TransactionDirection.DEBIT, ""));
        BigDecimal tutoring = nz(tutoringEnrollmentRepository.sumAmountPaidByUniversityIdAndStatus(
                effectiveUniId, TutoringEnrollmentStatus.CONFIRMED));
        BigDecimal totalVolume = parkingNet.add(tuition).add(tutoring);
        return new RevenueBreakdownStat(parkingNet, tuition, tutoring, totalVolume);
    }

    private BigDecimal netParkingRevenue(UUID universityId) {
        BigDecimal fees = ledgerEntryRepository.sumAmount(
                universityId, TransactionType.PARKING_FEE, TransactionDirection.DEBIT, "");
        BigDecimal refunds = ledgerEntryRepository.sumAmount(
                universityId, TransactionType.REFUND, TransactionDirection.CREDIT, PARKING_REFUND_KEY_PREFIX);
        return nz(fees).subtract(nz(refunds));
    }

    private List<ZoneOccupancyStat> buildZoneStats(List<ParkingSpot> spots) {
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
            var zoneEntity = zoneSpots.get(0).getZone();
            zoneStats.add(new ZoneOccupancyStat(code, zoneEntity.getNameAr(), zoneEntity.getNameEn(), zTotal, zOccupied, rate));
        });
        zoneStats.sort(Comparator.comparing(ZoneOccupancyStat::zoneCode));
        return zoneStats;
    }

    private ZoneId resolveZone(UUID universityId) {
        return universityRepository.findById(universityId)
                .map(University::getTimezone)
                .map(tz -> {
                    try {
                        return ZoneId.of(tz);
                    } catch (DateTimeException ex) {
                        return FALLBACK_ZONE;
                    }
                })
                .orElse(FALLBACK_ZONE);
    }

    private static String loadColor(int load) {
        if (load >= 85) return "#ef4444";
        if (load >= 60) return "#f59e0b";
        return "#10b981";
    }

    private static BigDecimal nz(BigDecimal v) {
        return v != null ? v : BigDecimal.ZERO;
    }
}
