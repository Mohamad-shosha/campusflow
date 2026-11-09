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
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.parking.domain.*;
import sa.edu.fbsu.campus.parking.infra.FlexOfferRepository;
import sa.edu.fbsu.campus.parking.infra.GateEventLogRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;
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
    @Mock private UniversityRepository universityRepository;

    private AnalyticsService service;

    @BeforeEach
    void setUp() {
        service = new AnalyticsService(spotRepository, flexOfferRepository, gateEventLogRepository,
                ledgerEntryRepository, universityRepository, Optional.of(Clock.fixed(NOW, ZoneOffset.UTC)));
        University uni = new University("FBSU", "جامعة", "University");
        uni.setTimezone("Asia/Riyadh"); // UTC+3
        when(universityRepository.findById(UNI)).thenReturn(Optional.of(uni));
        when(ledgerEntryRepository.sumAmount(any(), any(), any(), anyString())).thenReturn(BigDecimal.ZERO);
        when(gateEventLogRepository.findEventTimesSince(any(), anyString(), any())).thenReturn(List.of());
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
}
