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
    @DisplayName("GET /api/v1/analytics/summary returns 200 OK with aggregated campus efficiency metrics")
    void testGetSummary() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.netCapacityGainPercent", is(42.0)))
                .andExpect(jsonPath("$.timeSavedMinutes", is(14.2)))
                .andExpect(jsonPath("$.satisfactionRatePercent", is(98.8)))
                .andExpect(jsonPath("$.totalSpots", greaterThanOrEqualTo(0)))
                .andExpect(jsonPath("$.hourlyLoad", hasSize(9)))
                .andExpect(jsonPath("$.zoneStats", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/v1/analytics/hourly-load returns 200 OK with 9 campus schedule points")
    void testGetHourlyLoad() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/hourly-load")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(9)))
                .andExpect(jsonPath("$[0].time", is("08:00")))
                .andExpect(jsonPath("$[0].load", is(85)));
    }

    @Test
    @DisplayName("GET /api/v1/analytics/zones returns 200 OK with zone occupancy breakdown")
    void testGetZoneStats() throws Exception {
        mockMvc.perform(get("/api/v1/analytics/zones")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", notNullValue()));
    }
}

