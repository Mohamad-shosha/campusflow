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

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles("dev")
class GateHistoryIntegrationTest extends AbstractPostgresIntegrationTest {

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

    private String adminToken() throws Exception {
        return token("/api/v1/auth/login", new LoginRequest("FBSU", "admin@fbsu.edu.sa", "FbsuDev2026!"));
    }

    private String studentToken() throws Exception {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        return token("/api/v1/auth/register", new RegisterRequest(
                "FBSU", "GH-" + suffix, "gate-hist-" + suffix + "@fbsu.edu.sa", "StudentP@ss2026!",
                "طالب", "Student", UserType.STUDENT, "0513" + suffix.substring(0, 6),
                null, null, null, null));
    }

    @Test
    @DisplayName("Gate history requires authentication")
    void anonymousIsRejected() throws Exception {
        mockMvc.perform(get("/api/v1/parking/gate/events"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Students cannot read gate history (contains license plates)")
    void studentIsForbidden() throws Exception {
        ensureUniversity();
        mockMvc.perform(get("/api/v1/parking/gate/events")
                        .header("Authorization", "Bearer " + studentToken()))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Admins see recorded scans newest first, filterable by decision")
    void adminSeesRecordedScans() throws Exception {
        ensureUniversity();
        String digits = String.valueOf(1000 + (int) (Math.random() * 8999));
        mockMvc.perform(post("/api/v1/parking/gate/scan")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new GateScanRequest("ق و ل", digits, "MAIN_GATE_IN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.decision").value("DENIED"));

        String admin = adminToken();
        mockMvc.perform(get("/api/v1/parking/gate/events")
                        .param("decision", "denied")
                        .param("size", "5")
                        .header("Authorization", "Bearer " + admin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size").value(5))
                .andExpect(jsonPath("$.totalElements", greaterThanOrEqualTo(1)))
                .andExpect(jsonPath("$.content[*].decision", everyItem(is("DENIED"))))
                .andExpect(jsonPath("$.content[0].plateDigits").value(digits))
                .andExpect(jsonPath("$.content[0].occurredAt", notNullValue()));

        mockMvc.perform(get("/api/v1/parking/gate/events")
                        .param("size", "500")
                        .header("Authorization", "Bearer " + admin))
                .andExpect(status().isBadRequest());
    }
}
