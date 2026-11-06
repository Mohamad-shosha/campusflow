package sa.edu.fbsu.campus.parking.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import sa.edu.fbsu.campus.common.AbstractPostgresIntegrationTest;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.parking.dto.GateScanRequest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class GateControllerIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UniversityRepository universityRepository;

    private void ensureUniversity() {
        if (!universityRepository.existsByCode("FBSU")) {
            universityRepository.save(new University("FBSU", "جامعة فهد بن سلطان", "Fahad Bin Sultan University"));
        }
    }

    @Test
    @DisplayName("ALPR Scan: Faculty Vehicle with Assigned Bay -> Access Granted & Barrier Opens")
    void shouldGrantAccessForFacultyAssignedVehicle() throws Exception {
        ensureUniversity();

        // Seeded Dr. Mohammad Mezher has plate: س ع د 7700
        GateScanRequest request = new GateScanRequest("س ع د", "7700", "MAIN_GATE_IN");

        mockMvc.perform(post("/api/v1/parking/gate/scan")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.decision").value("GRANTED"))
                .andExpect(jsonPath("$.gateAction").value("OPEN_BARRIER"))
                .andExpect(jsonPath("$.reasonCode").value("FACULTY_PERMIT"))
                .andExpect(jsonPath("$.bayNumber").isNotEmpty())
                .andExpect(jsonPath("$.bayCode").isNotEmpty());
    }

    @Test
    @DisplayName("ALPR Scan: Unregistered License Plate -> Access Denied & Barrier Stays Closed")
    void shouldDenyAccessForUnregisteredPlate() throws Exception {
        ensureUniversity();

        GateScanRequest request = new GateScanRequest("ق و ل", "9999", "MAIN_GATE_IN");

        mockMvc.perform(post("/api/v1/parking/gate/scan")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.decision").value("DENIED"))
                .andExpect(jsonPath("$.gateAction").value("KEEP_CLOSED"))
                .andExpect(jsonPath("$.reasonCode").value("UNREGISTERED_VEHICLE"));
    }

    @Test
    @DisplayName("ALPR Scan: Student Vehicle with No Active Booking -> Access Denied with Advisory Message")
    void shouldDenyAccessForRegisteredStudentWithoutBooking() throws Exception {
        ensureUniversity();

        // Seeded student Eyad Al-Harbi has plate: ب ط ك 5021 (no advance booking created)
        GateScanRequest request = new GateScanRequest("ب ط ك", "5021", "MAIN_GATE_IN");

        mockMvc.perform(post("/api/v1/parking/gate/scan")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.decision").value("DENIED"))
                .andExpect(jsonPath("$.gateAction").value("KEEP_CLOSED"))
                .andExpect(jsonPath("$.reasonCode").value("NO_ACTIVE_BOOKING"))
                .andExpect(jsonPath("$.displayMessageAr").isNotEmpty());
    }
}

