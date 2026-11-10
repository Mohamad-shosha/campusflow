package sa.edu.fbsu.campus.analytics.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import sa.edu.fbsu.campus.analytics.dto.AnalyticsSummaryResponse;
import sa.edu.fbsu.campus.analytics.dto.HourlyLoadPoint;
import sa.edu.fbsu.campus.analytics.dto.RevenueBreakdownStat;
import sa.edu.fbsu.campus.analytics.dto.RoomsUtilizationStat;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.parking.domain.*;
import sa.edu.fbsu.campus.parking.infra.FlexOfferRepository;
import sa.edu.fbsu.campus.parking.infra.GateEventLogRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;
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
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AnalyticsServiceTest {

    private static final UUID UNI = UUID.randomUUID();
    private static final Instant NOW = Instant.parse("2026-11-09T12:00:00Z");

    @Mock private ParkingSpotRepository spotRepository;
    @Mock private FlexOfferRepository flexOfferRepository;
    @Mock private GateEventLogRepository gateEventLogRepository;
    @Mock private LedgerEntryRepository ledgerEntryRepository;
    @Mock private StudyRoomRepository studyRoomRepository;
    @Mock private RoomBookingRepository roomBookingRepository;
    @Mock private TutoringEnrollmentRepository tutoringEnrollmentRepository;
    @Mock private UniversityRepository universityRepository;

    private AnalyticsService service;

    @BeforeEach
    void setUp() {
        service = new AnalyticsService(
                spotRepository,
                flexOfferRepository,
                gateEventLogRepository,
                ledgerEntryRepository,
                studyRoomRepository,
                roomBookingRepository,
                tutoringEnrollmentRepository,
                universityRepository,
                Optional.of(Clock.fixed(NOW, ZoneOffset.UTC)));
        University uni = new University("FBSU", "جامعة", "University");
        uni.setTimezone("Asia/Riyadh"); // UTC+3
        when(universityRepository.findById(UNI)).thenReturn(Optional.of(uni));
        when(ledgerEntryRepository.sumAmount(any(), any(), any(), anyString())).thenReturn(BigDecimal.ZERO);
        when(gateEventLogRepository.findEventTimesSince(any(), anyString(), any())).thenReturn(List.of());
        when(studyRoomRepository.findAllByUniversityIdOrderByDisplayOrderAsc(any())).thenReturn(List.of());
        when(roomBookingRepository.countByUniversityIdAndStatusIn(any(), any())).thenReturn(0L);
        when(tutoringEnrollmentRepository.sumAmountPaidByUniversityIdAndStatus(any(), any())).thenReturn(BigDecimal.ZERO);
    }

    @Test
    @DisplayName("Unmeasured KPIs are null instead of hardcoded figures")
    void unmeasuredMetricsAreNull() {
        when(spotRepository.findAllWithZoneByUniversityId(UNI)).thenReturn(List.of());

        AnalyticsSummaryResponse summary = service.getSummary(UNI);

        assertThat(summary.netCapacityGainPercent()).isNull();
        assertThat(summary.timeSavedMinutes()).isNull();
        assertThat(summary.satisfactionRatePercent()).isNull();
        assertThat(summary.hourlyLoad()).isEmpty();
        assertThat(summary.totalLedgerRevenue()).isEqualByComparingTo("0");
    }

    @Test
    @DisplayName("Counts, occupancy and zone names come from stored records")
    void countsComeFromRepositories() {
        ParkingZone zoneA = new ParkingZone(UNI, "A", "منطقة أ", "Zone A", null, 3);
        when(spotRepository.findAllWithZoneByUniversityId(UNI)).thenReturn(List.of(
                new ParkingSpot(UNI, zoneA, 1, SpotType.STANDARD, SpotStatus.AVAILABLE, 10, true),
                new ParkingSpot(UNI, zoneA, 2, SpotType.STANDARD, SpotStatus.OCCUPIED, 10, true),
                new ParkingSpot(UNI, zoneA, 3, SpotType.STANDARD, SpotStatus.RESERVED, 10, true)));
        when(flexOfferRepository.countByUniversityIdAndStatus(UNI, FlexOfferStatus.AVAILABLE)).thenReturn(2L);
        when(gateEventLogRepository.countByUniversityIdAndDecision(UNI, "GRANTED")).thenReturn(7L);

        AnalyticsSummaryResponse summary = service.getSummary(UNI);

        assertThat(summary.totalSpots()).isEqualTo(3);
        assertThat(summary.availableSpots()).isEqualTo(1);
        assertThat(summary.occupiedSpots()).isEqualTo(2);
        assertThat(summary.flexSharesActive()).isEqualTo(2);
        assertThat(summary.totalGatePassages()).isEqualTo(7);
        assertThat(summary.zoneStats()).singleElement().satisfies(z -> {
            assertThat(z.zoneNameEn()).isEqualTo("Zone A");
            assertThat(z.occupancyRate()).isEqualTo(66.7);
        });
    }

    @Test
    @DisplayName("Revenue is parking fees minus parking booking refunds")
    void revenueIsNetParkingFees() {
        when(spotRepository.findAllWithZoneByUniversityId(UNI)).thenReturn(List.of());
        when(ledgerEntryRepository.sumAmount(UNI, TransactionType.PARKING_FEE, TransactionDirection.DEBIT, ""))
                .thenReturn(new BigDecimal("40.25"));
        when(ledgerEntryRepository.sumAmount(UNI, TransactionType.REFUND, TransactionDirection.CREDIT, "REFUND-"))
                .thenReturn(new BigDecimal("11.50"));

        assertThat(service.getSummary(UNI).totalLedgerRevenue()).isEqualByComparingTo("28.75");
    }

    @Test
    @DisplayName("Hourly load buckets admitted entries by local hour, relative to the busiest hour")
    void hourlyLoadIsBucketedInUniversityTimezone() {
        // 05:10Z and 05:40Z -> 08:00 Riyadh; 06:15Z -> 09:00 Riyadh
        when(gateEventLogRepository.findEventTimesSince(eq(UNI), eq("GRANTED"), eq(NOW.minus(AnalyticsService.HOURLY_LOAD_WINDOW))))
                .thenReturn(List.of(
                        Instant.parse("2026-11-08T05:10:00Z"),
                        Instant.parse("2026-11-08T05:40:00Z"),
                        Instant.parse("2026-11-08T06:15:00Z")));

        List<HourlyLoadPoint> points = service.getHourlyLoad(UNI);

        assertThat(points).extracting(HourlyLoadPoint::time).containsExactly("08:00", "09:00");
        assertThat(points).extracting(HourlyLoadPoint::load).containsExactly(100, 50);
        assertThat(points.get(0).labelEn()).isEqualTo("2 entries");
    }

    @Test
    @DisplayName("Rooms utilization excludes maintenance rooms from bookable denominator")
    void roomsUtilizationComputesActiveRatio() {
        StudyRoom r1 = new StudyRoom(UNI, "RM-1", "معمل 1", "Lab 1", "B1", "B1", "20", "20", "AI", "AI", List.of(), List.of(), "الآن", "Now", RoomStatus.IN_USE, 1);
        StudyRoom r2 = new StudyRoom(UNI, "RM-2", "معمل 2", "Lab 2", "B1", "B1", "10", "10", "Lab", "Lab", List.of(), List.of(), "الآن", "Now", RoomStatus.AVAILABLE, 2);
        StudyRoom r3 = new StudyRoom(UNI, "RM-3", "معمل 3", "Lab 3", "B1", "B1", "10", "10", "Lab", "Lab", List.of(), List.of(), "الآن", "Now", RoomStatus.MAINTENANCE, 3);
        when(studyRoomRepository.findAllByUniversityIdOrderByDisplayOrderAsc(UNI)).thenReturn(List.of(r1, r2, r3));
        when(roomBookingRepository.countByUniversityIdAndStatusIn(eq(UNI), any())).thenReturn(1L);

        RoomsUtilizationStat stats = service.getRoomsUtilization(UNI);

        assertThat(stats.totalRooms()).isEqualTo(3);
        assertThat(stats.inUseRooms()).isEqualTo(1);
        assertThat(stats.availableRooms()).isEqualTo(1);
        assertThat(stats.maintenanceRooms()).isEqualTo(1);
        assertThat(stats.activeUtilizationPercent()).isEqualTo(50.0);
        assertThat(stats.activeBookingsCount()).isEqualTo(1);
    }

    @Test
    @DisplayName("Financial revenue breakdown sums net parking fees, tuition payments and tutoring volume")
    void financialBreakdownComputesAllStreams() {
        when(ledgerEntryRepository.sumAmount(UNI, TransactionType.PARKING_FEE, TransactionDirection.DEBIT, ""))
                .thenReturn(new BigDecimal("100.00"));
        when(ledgerEntryRepository.sumAmount(UNI, TransactionType.REFUND, TransactionDirection.CREDIT, "REFUND-"))
                .thenReturn(new BigDecimal("20.00"));
        when(ledgerEntryRepository.sumAmount(UNI, TransactionType.TUITION_PAYMENT, TransactionDirection.DEBIT, ""))
                .thenReturn(new BigDecimal("4500.00"));
        when(tutoringEnrollmentRepository.sumAmountPaidByUniversityIdAndStatus(UNI, TutoringEnrollmentStatus.CONFIRMED))
                .thenReturn(new BigDecimal("280.00"));

        RevenueBreakdownStat breakdown = service.getRevenueBreakdown(UNI);

        assertThat(breakdown.netParkingRevenue()).isEqualByComparingTo("80.00");
        assertThat(breakdown.tuitionRevenue()).isEqualByComparingTo("4500.00");
        assertThat(breakdown.tutoringVolume()).isEqualByComparingTo("280.00");
        assertThat(breakdown.totalCampusVolume()).isEqualByComparingTo("4860.00");
    }
}
