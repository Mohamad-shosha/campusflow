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
import sa.edu.fbsu.campus.analytics.dto.ZoneOccupancyStat;
import sa.edu.fbsu.campus.common.security.UserPrincipal;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics")
@Tag(name = "Campus Analytics", description = "Operational intelligence, AI parking telemetry & capacity metrics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    @Operation(summary = "Get Analytics Summary", description = "Aggregates overall campus efficiency, time saved, satisfaction, and zone loads")
    public ResponseEntity<AnalyticsSummaryResponse> getSummary(@AuthenticationPrincipal UserPrincipal principal) {
        UUID uniId = principal != null && principal.getUniversityId() != null
                ? principal.getUniversityId()
                : UUID.fromString("00000000-0000-0000-0000-000000000001");
        return ResponseEntity.ok(analyticsService.getSummary(uniId));
    }

    @GetMapping("/hourly-load")
    @Operation(summary = "Get Hourly Load Points", description = "Returns campus peak hours and load telemetry")
    public ResponseEntity<List<HourlyLoadPoint>> getHourlyLoad(@AuthenticationPrincipal UserPrincipal principal) {
        UUID uniId = principal != null && principal.getUniversityId() != null
                ? principal.getUniversityId()
                : UUID.fromString("00000000-0000-0000-0000-000000000001");
        return ResponseEntity.ok(analyticsService.getSummary(uniId).hourlyLoad());
    }

    @GetMapping("/zones")
    @Operation(summary = "Get Zone Occupancy Rates", description = "Returns real-time occupancy rates per university zone")
    public ResponseEntity<List<ZoneOccupancyStat>> getZoneStats(@AuthenticationPrincipal UserPrincipal principal) {
        UUID uniId = principal != null && principal.getUniversityId() != null
                ? principal.getUniversityId()
                : UUID.fromString("00000000-0000-0000-0000-000000000001");
        return ResponseEntity.ok(analyticsService.getSummary(uniId).zoneStats());
    }
}

