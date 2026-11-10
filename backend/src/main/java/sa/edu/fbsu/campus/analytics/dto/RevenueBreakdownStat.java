package sa.edu.fbsu.campus.analytics.dto;

import java.math.BigDecimal;

/**
 * Institutional financial volume breakdown derived strictly from persisted
 * {@code ledger_entry} and {@code tutoring_enrollment} records.
 */
public record RevenueBreakdownStat(
        BigDecimal netParkingRevenue,
        BigDecimal tuitionRevenue,
        BigDecimal tutoringVolume,
        BigDecimal totalCampusVolume
) {}
