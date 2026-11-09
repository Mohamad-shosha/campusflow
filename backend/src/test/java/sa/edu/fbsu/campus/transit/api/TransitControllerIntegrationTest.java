package sa.edu.fbsu.campus.transit.api;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import sa.edu.fbsu.campus.common.AbstractPostgresIntegrationTest;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.infra.UniversityRepository;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
@ActiveProfiles("dev")
class TransitControllerIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UniversityRepository universityRepository;

    private void ensureUniversity() {
        if (!universityRepository.existsByCode("FBSU")) {
            universityRepository.save(new University("FBSU", "جامعة فهد بن سلطان", "Fahad Bin Sultan University"));
        }
    }

    @Test
    @DisplayName("GET /api/v1/transit/routes returns all seeded campus transit lines with stops")
    void shouldReturnAllTransitRoutes() throws Exception {
        ensureUniversity();

        mockMvc.perform(get("/api/v1/transit/routes")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(3))))
                .andExpect(jsonPath("$[*].routeCode", hasItems("ROUTE-EXPRESS", "ROUTE-GOLDEN", "ROUTE-DORMS")))
                .andExpect(jsonPath("$[0].stops", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @DisplayName("GET /api/v1/transit/shuttles/live returns active electric eco-shuttle fleet")
    void shouldReturnLiveShuttles() throws Exception {
        ensureUniversity();

        mockMvc.perform(get("/api/v1/transit/shuttles/live")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(3))))
                .andExpect(jsonPath("$[*].busNumber", hasItems("FBSU-BUS-01", "FBSU-BUS-02", "FBSU-BUS-03")))
                .andExpect(jsonPath("$[0].totalCapacity", is(28)))
                .andExpect(jsonPath("$[0].isElectric", is(true)));
    }

    @Test
    @DisplayName("GET /api/v1/transit/shuttles labels status as stored data, not live telemetry")
    void shuttlesDeclareStoredDataSource() throws Exception {
        ensureUniversity();

        mockMvc.perform(get("/api/v1/transit/shuttles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[*].dataSource", everyItem(is("STORED_STATUS"))))
                .andExpect(jsonPath("$[*].lastUpdatedAt", everyItem(notNullValue())));
    }

    @Test
    @DisplayName("Deprecated /shuttles/live alias still works and advertises its successor")
    void liveAliasIsDeprecated() throws Exception {
        ensureUniversity();

        mockMvc.perform(get("/api/v1/transit/shuttles/live"))
                .andExpect(status().isOk())
                .andExpect(header().string("Deprecation", "true"))
                .andExpect(header().string("Link", containsString("/api/v1/transit/shuttles")))
                .andExpect(jsonPath("$[*].dataSource", everyItem(is("STORED_STATUS"))));
    }
}
