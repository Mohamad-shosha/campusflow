package sa.edu.fbsu.campus.analytics.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sa.edu.fbsu.campus.analytics.application.AnalyticsService;
import sa.edu.fbsu.campus.analytics.dto.AnalyticsSummaryResponse;
import sa.edu.fbsu.campus.analytics.dto.HourlyLoadPoint;
import sa.edu.fbsu.campus.analytics.dto.RevenueBreakdownStat;
import sa.edu.fbsu.campus.analytics.dto.RoomsUtilizationStat;
import sa.edu.fbsu.campus.analytics.dto.ZoneOccupancyStat;
import sa.edu.fbsu.campus.common.security.UserPrincipal;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics")
@Tag(name = "Campus Analytics", description = "Operational intelligence, AI parking telemetry & capacity metrics")
public class AnalyticsController {

    private static final UUID DEFAULT_UNIVERSITY_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get Analytics Summary", description = "Spot, zone, flex-offer, gate-passage, rooms utilization and financial breakdown computed from database records. Unmeasured metrics are null.")
    public ResponseEntity<AnalyticsSummaryResponse> getSummary(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(analyticsService.getSummary(resolveUniId(principal)));
    }

    @GetMapping("/hourly-load")
    @Operation(summary = "Get Hourly Load Points", description = "Admitted vehicles per hour of day over the last 7 days (relative load, busiest hour = 100). Empty when no gate entries exist.")
    public ResponseEntity<List<HourlyLoadPoint>> getHourlyLoad(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(analyticsService.getHourlyLoad(resolveUniId(principal)));
    }

    @GetMapping("/zones")
    @Operation(summary = "Get Zone Occupancy Rates", description = "Returns real-time occupancy rates per university zone")
    public ResponseEntity<List<ZoneOccupancyStat>> getZoneStats(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(analyticsService.getZoneStats(resolveUniId(principal)));
    }

    @GetMapping("/rooms/utilization")
    @Operation(summary = "Get Rooms & Smart Labs Utilization", description = "Returns real-time room inventory breakdown and active utilization rate")
    public ResponseEntity<RoomsUtilizationStat> getRoomsUtilization(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(analyticsService.getRoomsUtilization(resolveUniId(principal)));
    }

    @GetMapping("/financial/revenue-breakdown")
    @Operation(summary = "Get Financial Revenue Breakdown", description = "Returns campus financial volume across parking fees, tuition payments, and peer tutoring enrollments")
    public ResponseEntity<RevenueBreakdownStat> getRevenueBreakdown(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(analyticsService.getRevenueBreakdown(resolveUniId(principal)));
    }

    private static UUID resolveUniId(UserPrincipal principal) {
        return principal != null && principal.getUniversityId() != null
                ? principal.getUniversityId()
                : DEFAULT_UNIVERSITY_ID;
    }
}

