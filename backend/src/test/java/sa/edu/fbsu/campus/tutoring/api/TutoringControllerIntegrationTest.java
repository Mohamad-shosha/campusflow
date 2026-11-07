package sa.edu.fbsu.campus.tutoring.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import sa.edu.fbsu.campus.common.AbstractPostgresIntegrationTest;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.dto.RegisterRequest;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.tutoring.dto.CreateTutoringSessionRequest;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles("dev")
class TutoringControllerIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UniversityRepository universityRepository;

    private String registerAndGetToken(UserType userType) throws Exception {
        if (!universityRepository.existsByCode("FBSU")) {
            universityRepository.save(new University("FBSU", "جامعة فهد بن سلطان", "Fahad Bin Sultan University"));
        }
        String suffix = UUID.randomUUID().toString().replaceAll("[^0-9]", "");
        if (suffix.length() < 6) {
            suffix = suffix + "123456";
        }
        suffix = suffix.substring(0, 6);

        RegisterRequest regReq = new RegisterRequest(
                "FBSU",
                "TUT-" + suffix,
                "tut-" + suffix + "@fbsu.edu.sa",
                "StrongP@ssw0rd!2026",
                "طالب شرح",
                "Tutor Student",
                userType,
                "0544" + suffix,
                null,
                null,
                null,
                null
        );

        MvcResult res = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(regReq))))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode body = objectMapper.readTree(res.getResponse().getContentAsString());
        return body.get("accessToken").asText();
    }

    @Test
    @DisplayName("GET /api/v1/tutoring/sessions lists seeded sessions and filters by category")
    void shouldListAndFilterTutoringSessions() throws Exception {
        mockMvc.perform(get("/api/v1/tutoring/sessions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(4))));

        mockMvc.perform(get("/api/v1/tutoring/sessions").param("category", "hardware"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("hardware"))
                .andExpect(jsonPath("$[0].courseCode").value("CEN 220"));

        mockMvc.perform(get("/api/v1/tutoring/sessions/TUT-104"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.sessionCode").value("TUT-104"))
                .andExpect(jsonPath("$.totalPrice").value(105.00));
    }

    @Test
    @DisplayName("POST /api/v1/tutoring/sessions allows eligible STUDENT and computes official total price")
    void shouldAllowEligibleStudentToPublishSession() throws Exception {
        String studentToken = registerAndGetToken(UserType.STUDENT);

        CreateTutoringSessionRequest request = new CreateTutoringSessionRequest(
                "CS 340",
                "نظم التشغيل المتقدمة",
                "Advanced Operating Systems",
                "Chapters 1-3 (Processes & Threads)",
                "Hands-on scheduling algorithms and synchronization labs.",
                "programming",
                new BigDecimal("1.50"),
                "الخميس - 04:00 م",
                "معمل الحاسب 102",
                8
        );

        mockMvc.perform(post("/api/v1/tutoring/sessions")
                        .header("Authorization", "Bearer " + studentToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(request))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.courseCode").value("CS 340"))
                .andExpect(jsonPath("$.category").value("programming"))
                .andExpect(jsonPath("$.hourlyRate").value(70.00))
                .andExpect(jsonPath("$.durationHours").value(1.50))
                .andExpect(jsonPath("$.totalPrice").value(105.00))
                .andExpect(jsonPath("$.status").value("OPEN"));
    }

    @Test
    @DisplayName("POST /api/v1/tutoring/sessions rejects unauthenticated (401) and non-student FACULTY (403)")
    void shouldEnforceStudentEligibilityOnPublish() throws Exception {
        CreateTutoringSessionRequest request = new CreateTutoringSessionRequest(
                "MATH 202",
                "معادلات تفاضلية",
                "Differential Equations",
                "Lectures 1-3",
                "First and second order ODE review.",
                "math",
                BigDecimal.ONE,
                "الأحد - 02:00 م",
                "قاعة A-04",
                10
        );

        mockMvc.perform(post("/api/v1/tutoring/sessions")
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(request))))
                .andExpect(status().isUnauthorized());

        String facultyToken = registerAndGetToken(UserType.FACULTY);
        mockMvc.perform(post("/api/v1/tutoring/sessions")
                        .header("Authorization", "Bearer " + facultyToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(request))))
                .andExpect(status().isForbidden());
    }
}
