package sa.edu.fbsu.campus.analytics.dto;

import java.math.BigDecimal;
import java.util.List;

public record AnalyticsSummaryResponse(
        double netCapacityGainPercent,
        double timeSavedMinutes,
        double satisfactionRatePercent,
        int totalSpots,
        int availableSpots,
        int occupiedSpots,
        int flexSharesActive,
        int totalGatePassages,
        BigDecimal totalLedgerRevenue,
        List<HourlyLoadPoint> hourlyLoad,
        List<ZoneOccupancyStat> zoneStats
) {}
