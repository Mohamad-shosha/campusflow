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
import sa.edu.fbsu.campus.tutoring.dto.BookTutoringRequest;
import sa.edu.fbsu.campus.tutoring.dto.CreateTutoringSessionRequest;
import sa.edu.fbsu.campus.tutoring.dto.SubmitTutoringReviewRequest;
import sa.edu.fbsu.campus.wallet.dto.TopUpRequest;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles("dev")
class TutoringReviewIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UniversityRepository universityRepository;

    private String registerStudentAndTopUp(BigDecimal topUpAmount) throws Exception {
        if (!universityRepository.existsByCode("FBSU")) {
            universityRepository.save(new University("FBSU", "جامعة فهد بن سلطان", "Fahad Bin Sultan University"));
        }
        String suffix = UUID.randomUUID().toString().replaceAll("[^0-9]", "");
        if (suffix.length() < 6) {
            suffix = suffix + "987654";
        }
        suffix = suffix.substring(0, 6);

        RegisterRequest regReq = new RegisterRequest(
                "FBSU",
                "TRV-" + suffix,
                "trv-" + suffix + "@fbsu.edu.sa",
                "StrongP@ssw0rd!2026",
                "طالب مراجعات",
                "Review Student",
                UserType.STUDENT,
                "0566" + suffix,
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

        String token = objectMapper.readTree(res.getResponse().getContentAsString()).get("accessToken").asText();

        if (topUpAmount != null && topUpAmount.compareTo(BigDecimal.ZERO) > 0) {
            TopUpRequest topUp = new TopUpRequest(topUpAmount, "topup-" + UUID.randomUUID(), "MADA", "Review test wallet");
            mockMvc.perform(post("/api/v1/wallet/top-up")
                            .header("Authorization", "Bearer " + token)
                            .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                            .content(Objects.requireNonNull(objectMapper.writeValueAsString(topUp))))
                    .andExpect(status().isOk());
        }
        return token;
    }

    @Test
    @DisplayName("P6-08: Only confirmed enrolled students can submit 1-5 reviews and computed averages aggregate accurately")
    void enrolledStudentsSubmitRealRatingsAndAggregateUpdates() throws Exception {
        String tutorToken = registerStudentAndTopUp(BigDecimal.ZERO);
        String studentAToken = registerStudentAndTopUp(new BigDecimal("200.00"));
        String studentBToken = registerStudentAndTopUp(new BigDecimal("200.00"));
        String outsiderToken = registerStudentAndTopUp(BigDecimal.ZERO);

        CreateTutoringSessionRequest createReq = new CreateTutoringSessionRequest(
                "CS 301",
                "هندسة البرمجيات",
                "Software Engineering",
                "UML & Clean Architecture",
                "Review workflow verification session.",
                "programming",
                BigDecimal.ONE,
                "السبت - 05:00 م",
                "معمل 102",
                5
        );

        MvcResult createRes = mockMvc.perform(post("/api/v1/tutoring/sessions")
                        .header("Authorization", "Bearer " + tutorToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(createReq))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating").value(nullValue()))
                .andExpect(jsonPath("$.reviewsCount").value(is(0)))
                .andReturn();

        String sessionCode = objectMapper.readTree(createRes.getResponse().getContentAsString())
                .path("sessionCode").asText();

        // Enroll Student A & Student B
        BookTutoringRequest bookA = new BookTutoringRequest("book-a-" + UUID.randomUUID());
        mockMvc.perform(post("/api/v1/tutoring/sessions/" + sessionCode + "/book")
                        .header("Authorization", "Bearer " + studentAToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(bookA))))
                .andExpect(status().isCreated());

        BookTutoringRequest bookB = new BookTutoringRequest("book-b-" + UUID.randomUUID());
        mockMvc.perform(post("/api/v1/tutoring/sessions/" + sessionCode + "/book")
                        .header("Authorization", "Bearer " + studentBToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(bookB))))
                .andExpect(status().isCreated());

        // Guards: outsider 403, tutor self-review 400, invalid rating 400
        mockMvc.perform(post("/api/v1/tutoring/sessions/" + sessionCode + "/reviews")
                        .header("Authorization", "Bearer " + outsiderToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(objectMapper.writeValueAsString(new SubmitTutoringReviewRequest(5, "Great!"))))
                .andExpect(status().isForbidden());

        mockMvc.perform(post("/api/v1/tutoring/sessions/" + sessionCode + "/reviews")
                        .header("Authorization", "Bearer " + tutorToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(objectMapper.writeValueAsString(new SubmitTutoringReviewRequest(5, "Self rate"))))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/v1/tutoring/sessions/" + sessionCode + "/reviews")
                        .header("Authorization", "Bearer " + studentAToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(objectMapper.writeValueAsString(new SubmitTutoringReviewRequest(6, "Too high"))))
                .andExpect(status().isBadRequest());

        // Student A submits 5 stars -> rating = 5.00, reviewsCount = 1
        mockMvc.perform(post("/api/v1/tutoring/sessions/" + sessionCode + "/reviews")
                        .header("Authorization", "Bearer " + studentAToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(objectMapper.writeValueAsString(new SubmitTutoringReviewRequest(5, "شرح ممتاز ومنظم"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating").value(5.0))
                .andExpect(jsonPath("$.reviewsCount").value(1));

        // Duplicate review by Student A -> 400 Bad Request (GlobalExceptionHandler IllegalStateException mapping)
        mockMvc.perform(post("/api/v1/tutoring/sessions/" + sessionCode + "/reviews")
                        .header("Authorization", "Bearer " + studentAToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(objectMapper.writeValueAsString(new SubmitTutoringReviewRequest(4, "Duplicate"))))
                .andExpect(status().isBadRequest());

        // Student B submits 4 stars -> rating = 4.50, reviewsCount = 2
        mockMvc.perform(post("/api/v1/tutoring/sessions/" + sessionCode + "/reviews")
                        .header("Authorization", "Bearer " + studentBToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(objectMapper.writeValueAsString(new SubmitTutoringReviewRequest(4, "Helpful walkthrough"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating").value(4.5))
                .andExpect(jsonPath("$.reviewsCount").value(2));

        // Verify GET session reads aggregated real rating & count
        mockMvc.perform(get("/api/v1/tutoring/sessions/" + sessionCode))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rating").value(4.5))
                .andExpect(jsonPath("$.reviewsCount").value(2));
    }
}

