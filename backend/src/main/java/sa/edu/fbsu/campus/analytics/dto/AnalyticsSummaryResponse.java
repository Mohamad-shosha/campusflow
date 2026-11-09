package sa.edu.fbsu.campus.analytics.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Campus parking analytics. Fields with no backing data source are {@code null}:
 * netCapacityGainPercent, timeSavedMinutes and satisfactionRatePercent are not measured.
 * totalGatePassages counts GRANTED gate events; flexSharesActive counts AVAILABLE offers;
 * totalLedgerRevenue is net parking fees (PARKING_FEE debits minus parking refunds).
 */
public record AnalyticsSummaryResponse(
        Double netCapacityGainPercent,
        Double timeSavedMinutes,
        Double satisfactionRatePercent,
        int totalSpots,
        int availableSpots,
        int occupiedSpots,
        int flexSharesActive,
        int totalGatePassages,
        BigDecimal totalLedgerRevenue,
        List<HourlyLoadPoint> hourlyLoad,
        List<ZoneOccupancyStat> zoneStats
) {}

