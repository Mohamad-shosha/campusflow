package sa.edu.fbsu.campus.analytics.api;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import sa.edu.fbsu.campus.common.AbstractPostgresIntegrationTest;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@AutoConfigureMockMvc
public class AnalyticsControllerIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

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
                .andExpect(jsonPath("$.totalLedgerRevenue", notNullValue()))
                .andExpect(jsonPath("$.hourlyLoad", notNullValue()))
                .andExpect(jsonPath("$.zoneStats", notNullValue()));
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
