package sa.edu.fbsu.campus.analytics.api;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import sa.edu.fbsu.campus.common.AbstractPostgresIntegrationTest;
import sa.edu.fbsu.campus.common.security.JwtService;
import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.UserType;

import java.util.Set;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@AutoConfigureMockMvc
public class AnalyticsControllerIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    private String bearer(Role role) {
        return "Bearer " + jwtService.generateAccessToken(UUID.randomUUID(),
                UUID.fromString("00000000-0000-0000-0000-000000000001"), "T-" + role, Set.of(role),
                UserType.STAFF, "ar");
    }

    @Test
    @DisplayName("Summary exposes only measured metrics; unmeasured KPIs are null, not hardcoded")
    void testGetSummary() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/summary")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.netCapacityGainPercent").value(nullValue()))
                .andExpect(jsonPath("$.timeSavedMinutes").value(nullValue()))
                .andExpect(jsonPath("$.satisfactionRatePercent").value(nullValue()))
                .andExpect(jsonPath("$.totalSpots", greaterThanOrEqualTo(0)))
                .andExpect(jsonPath("$.flexSharesActive", greaterThanOrEqualTo(0)))
                .andExpect(jsonPath("$.totalGatePassages", greaterThanOrEqualTo(0)))
                // Revenue figures are admin-only and stripped for anonymous callers
                .andExpect(jsonPath("$.totalLedgerRevenue").value(nullValue()))
                .andExpect(jsonPath("$.hourlyLoad", notNullValue()))
                .andExpect(jsonPath("$.zoneStats", notNullValue()))
                .andExpect(jsonPath("$.roomsUtilization.totalRooms", greaterThanOrEqualTo(0)))
                .andExpect(jsonPath("$.revenueBreakdown").value(nullValue()));
    }

    @Test
    @DisplayName("Campus admins get the summary including revenue figures")
    void testGetSummaryAsAdminIncludesRevenue() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/summary")
                        .header("Authorization", bearer(Role.CAMPUS_ADMIN))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalLedgerRevenue", notNullValue()))
                .andExpect(jsonPath("$.revenueBreakdown.totalCampusVolume", notNullValue()));
    }

    @Test
    @DisplayName("Revenue breakdown is rejected for anonymous callers and students")
    void testRevenueBreakdownRequiresAdmin() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/financial/revenue-breakdown"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/v1/analytics/financial/revenue-breakdown")
                        .header("Authorization", bearer(Role.STUDENT)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Get study rooms and labs utilization breakdown")
    void testGetRoomsUtilization() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/rooms/utilization")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalRooms", greaterThanOrEqualTo(0)))
                .andExpect(jsonPath("$.activeUtilizationPercent", greaterThanOrEqualTo(0.0)));
    }

    @Test
    @DisplayName("Get financial revenue breakdown across parking, tuition, and tutoring")
    void testGetRevenueBreakdown() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/financial/revenue-breakdown")
                        .header("Authorization", bearer(Role.CAMPUS_ADMIN))
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.netParkingRevenue", notNullValue()))
                .andExpect(jsonPath("$.tuitionRevenue", notNullValue()))
                .andExpect(jsonPath("$.tutoringVolume", notNullValue()))
                .andExpect(jsonPath("$.totalCampusVolume", notNullValue()));
    }

    @Test
    @DisplayName("Hourly load is derived from gate logs: no fixed 9-slot fabricated chart")
    void testGetHourlyLoad() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/hourly-load")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)))
                .andExpect(jsonPath("$[*].load", everyItem(allOf(greaterThan(0), lessThanOrEqualTo(100)))));
    }

    @Test
    @DisplayName("Get zone occupancy rates")
    void testGetZoneStats() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/zones")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", notNullValue()));
    }
}
