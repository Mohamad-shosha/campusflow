package sa.edu.fbsu.campus.parking.api;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import sa.edu.fbsu.campus.common.AbstractPostgresIntegrationTest;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.infra.UniversityRepository;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
class ParkingControllerIntegrationTest extends AbstractPostgresIntegrationTest {

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
    @DisplayName("GET /api/v1/parking/zones returns all 4 campus zones")
    void shouldReturnAllParkingZones() throws Exception {
        ensureUniversity();

        mockMvc.perform(get("/api/v1/parking/zones")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)))
                .andExpect(jsonPath("$[*].code", hasItems("A", "B", "C", "D")));
    }

    @Test
    @DisplayName("GET /api/v1/parking/spots returns all 30 bays and supports zone filter")
    void shouldReturnSpotsAndFilterByZone() throws Exception {
        ensureUniversity();

        // All spots
        mockMvc.perform(get("/api/v1/parking/spots")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(30)));

        // Filter by zone A
        mockMvc.perform(get("/api/v1/parking/spots")
                        .param("zone", "A")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(8)))
                .andExpect(jsonPath("$[0].zoneCode", equalTo("A")));
    }

    @Test
    @DisplayName("GET /api/v1/parking/spots/{bayNumber} returns single bay details")
    void shouldReturnSpecificBay() throws Exception {
        ensureUniversity();

        mockMvc.perform(get("/api/v1/parking/spots/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bayNumber", equalTo(1)))
                .andExpect(jsonPath("$.zoneCode", equalTo("A")))
                .andExpect(jsonPath("$.bayCode", equalTo("A-01")));
    }

    @Test
    @DisplayName("GET /api/v1/parking/summary returns campus occupancy metrics")
    void shouldReturnSummary() throws Exception {
        ensureUniversity();

        mockMvc.perform(get("/api/v1/parking/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSpots", equalTo(30)))
                .andExpect(jsonPath("$.availableSpots", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.occupancyRate", notNullValue()));
    }

    @Test
    @DisplayName("GET /api/v1/parking/tariffs returns active tariffs")
    void shouldReturnTariffs() throws Exception {
        ensureUniversity();

        mockMvc.perform(get("/api/v1/parking/tariffs")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[*].tariffCode", hasItems("STANDARD", "EV_CHARGING")));
    }
}

