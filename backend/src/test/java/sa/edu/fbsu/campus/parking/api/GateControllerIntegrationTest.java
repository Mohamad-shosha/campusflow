package sa.edu.fbsu.campus.parking.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import sa.edu.fbsu.campus.common.AbstractPostgresIntegrationTest;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.dto.LoginRequest;
import sa.edu.fbsu.campus.identity.dto.RegisterRequest;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.parking.dto.GateScanRequest;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles("dev")
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

    private String token(String path, Object body) throws Exception {
        String json = mockMvc.perform(post(path)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).path("accessToken").asText();
    }

    /** Gate scans are restricted to gate staff; the seeded campus admin is allowed. */
    private String officerToken() throws Exception {
        return token("/api/v1/auth/login", new LoginRequest("FBSU", "admin@fbsu.edu.sa", "FbsuDev2026!"));
    }

    @Test
    @DisplayName("ALPR Scan: anonymous callers are rejected (scan reveals driver identity)")
    void anonymousScanIsRejected() throws Exception {
        ensureUniversity();
        mockMvc.perform(post("/api/v1/parking/gate/scan")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GateScanRequest("س ع د", "7700", "MAIN_GATE_IN"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("ALPR Scan: students are forbidden")
    void studentScanIsForbidden() throws Exception {
        ensureUniversity();
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        String student = token("/api/v1/auth/register", new RegisterRequest(
                "FBSU", "GS-" + suffix, "gate-scan-" + suffix + "@fbsu.edu.sa", "StudentP@ss2026!",
                "طالب", "Student", UserType.STUDENT, "0514" + suffix.substring(0, 6),
                null, null, null, null));
        mockMvc.perform(post("/api/v1/parking/gate/scan")
                        .header("Authorization", "Bearer " + student)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GateScanRequest("س ع د", "7700", "MAIN_GATE_IN"))))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("ALPR Scan: Faculty Vehicle with Assigned Bay -> Access Granted & Barrier Opens")
    void shouldGrantAccessForFacultyAssignedVehicle() throws Exception {
        ensureUniversity();

        // Seeded Dr. Mohammad Mezher has plate: س ع د 7700
        GateScanRequest request = new GateScanRequest("س ع د", "7700", "MAIN_GATE_IN");

        mockMvc.perform(post("/api/v1/parking/gate/scan")
                        .header("Authorization", "Bearer " + officerToken())
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
                        .header("Authorization", "Bearer " + officerToken())
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
                        .header("Authorization", "Bearer " + officerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.decision").value("DENIED"))
                .andExpect(jsonPath("$.gateAction").value("KEEP_CLOSED"))
                .andExpect(jsonPath("$.reasonCode").value("NO_ACTIVE_BOOKING"))
                .andExpect(jsonPath("$.displayMessageAr").isNotEmpty());
    }
}

