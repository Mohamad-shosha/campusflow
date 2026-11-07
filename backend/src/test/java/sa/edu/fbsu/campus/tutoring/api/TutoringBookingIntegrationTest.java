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
import sa.edu.fbsu.campus.wallet.dto.TopUpRequest;

import java.math.BigDecimal;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles("dev")
class TutoringBookingIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UniversityRepository universityRepository;

    private String registerStudentAndGetToken() throws Exception {
        if (!universityRepository.existsByCode("FBSU")) {
            universityRepository.save(new University("FBSU", "جامعة فهد بن سلطان", "Fahad Bin Sultan University"));
        }
        String suffix = UUID.randomUUID().toString().replaceAll("[^0-9]", "");
        if (suffix.length() < 6) {
            suffix = suffix + "654321";
        }
        suffix = suffix.substring(0, 6);

        RegisterRequest regReq = new RegisterRequest(
                "FBSU",
                "TBK-" + suffix,
                "tbk-" + suffix + "@fbsu.edu.sa",
                "StrongP@ssw0rd!2026",
                "طالب حاجز",
                "Enrolling Student",
                UserType.STUDENT,
                "0533" + suffix,
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

        return objectMapper.readTree(res.getResponse().getContentAsString()).get("accessToken").asText();
    }

    private void topUpWallet(String token, BigDecimal amount) throws Exception {
        TopUpRequest req = new TopUpRequest(amount, "topup-" + UUID.randomUUID(), "MADA", "Tutoring test top-up");
        mockMvc.perform(post("/api/v1/wallet/top-up")
                        .header("Authorization", "Bearer " + token)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(req))))
                .andExpect(status().isOk());
    }

    private BigDecimal fetchBalance(String token) throws Exception {
        MvcResult res = mockMvc.perform(get("/api/v1/wallet")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn();
        return new BigDecimal(objectMapper.readTree(res.getResponse().getContentAsString()).get("balance").asText());
    }

    @Test
    @DisplayName("Booking lifecycle: rejects insufficient funds, prevents self-booking, transfers fee atomically, and blocks duplicate enrollment")
    void shouldExecuteAtomicTutoringBookingAndWalletTransfer() throws Exception {
        String tutorToken = registerStudentAndGetToken();
        String learnerToken = registerStudentAndGetToken();

        CreateTutoringSessionRequest createReq = new CreateTutoringSessionRequest(
                "CS 215",
                "تراكيب البيانات المتقدمة",
                "Advanced Data Structures",
                "Lectures 1-5",
                "Graphs, heaps, and balanced trees.",
                "programming",
                new BigDecimal("1.50"),
                "الاثنين - 03:00 م",
                "معمل 102",
                5
        );

        MvcResult createdRes = mockMvc.perform(post("/api/v1/tutoring/sessions")
                        .header("Authorization", "Bearer " + tutorToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(createReq))))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode sessionNode = objectMapper.readTree(createdRes.getResponse().getContentAsString());
        String sessionCode = sessionNode.get("sessionCode").asText();

        // 1. Self-booking must be rejected (400)
        topUpWallet(tutorToken, new BigDecimal("200.00"));
        mockMvc.perform(post("/api/v1/tutoring/sessions/" + sessionCode + "/book")
                        .header("Authorization", "Bearer " + tutorToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content("{}"))
                .andExpect(status().isBadRequest());

        // 2. Learner with 0.00 SAR balance must be rejected (400)
        mockMvc.perform(post("/api/v1/tutoring/sessions/" + sessionCode + "/book")
                        .header("Authorization", "Bearer " + learnerToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content("{}"))
                .andExpect(status().isBadRequest());

        // 3. Fund learner with 150.00 SAR and book 105.00 SAR session
        topUpWallet(learnerToken, new BigDecimal("150.00"));
        BigDecimal tutorBefore = fetchBalance(tutorToken);

        BookTutoringRequest bookReq = new BookTutoringRequest("idem-" + UUID.randomUUID());
        mockMvc.perform(post("/api/v1/tutoring/sessions/" + sessionCode + "/book")
                        .header("Authorization", "Bearer " + learnerToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(bookReq))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.amountPaid").value(105.00))
                .andExpect(jsonPath("$.studentWalletBalance").value(45.00))
                .andExpect(jsonPath("$.session.enrolledCount").value(1));

        assertThat(fetchBalance(learnerToken)).isEqualByComparingTo("45.00");
        assertThat(fetchBalance(tutorToken)).isEqualByComparingTo(tutorBefore.add(new BigDecimal("105.00")));

        // 4. Duplicate booking with a new request must be rejected (400)
        mockMvc.perform(post("/api/v1/tutoring/sessions/" + sessionCode + "/book")
                        .header("Authorization", "Bearer " + learnerToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(new BookTutoringRequest("idem-new-" + UUID.randomUUID())))))
                .andExpect(status().isBadRequest());

        // 5. My enrollments endpoint returns the confirmed booking
        mockMvc.perform(get("/api/v1/tutoring/enrollments/my")
                        .header("Authorization", "Bearer " + learnerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].sessionCode").value(sessionCode));
    }

    @Test
    @DisplayName("Concurrency: two students racing for a 1-seat tutoring session results in exactly one winner and one single transfer")
    void shouldPreventOverbookingUnderConcurrentRequests() throws Exception {
        String tutorToken = registerStudentAndGetToken();
        String studentAToken = registerStudentAndGetToken();
        String studentBToken = registerStudentAndGetToken();

        topUpWallet(studentAToken, new BigDecimal("100.00"));
        topUpWallet(studentBToken, new BigDecimal("100.00"));

        CreateTutoringSessionRequest oneSeatSession = new CreateTutoringSessionRequest(
                "CEN 310",
                "معمارية الحاسب",
                "Computer Architecture",
                "Pipeline & Cache",
                "1-on-1 intensive review.",
                "hardware",
                BigDecimal.ONE,
                "الأربعاء - 01:00 م",
                "قاعة A-04",
                1
        );

        MvcResult createdRes = mockMvc.perform(post("/api/v1/tutoring/sessions")
                        .header("Authorization", "Bearer " + tutorToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(oneSeatSession))))
                .andExpect(status().isCreated())
                .andReturn();

        String sessionCode = objectMapper.readTree(createdRes.getResponse().getContentAsString()).get("sessionCode").asText();
        BigDecimal tutorInitial = fetchBalance(tutorToken);

        var executor = Executors.newFixedThreadPool(2);
        CountDownLatch ready = new CountDownLatch(2);
        CountDownLatch start = new CountDownLatch(1);

        Callable<Integer> taskA = () -> {
            ready.countDown();
            start.await(5, TimeUnit.SECONDS);
            return mockMvc.perform(post("/api/v1/tutoring/sessions/" + sessionCode + "/book")
                            .header("Authorization", "Bearer " + studentAToken)
                            .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                            .content("{}"))
                    .andReturn().getResponse().getStatus();
        };

        Callable<Integer> taskB = () -> {
            ready.countDown();
            start.await(5, TimeUnit.SECONDS);
            return mockMvc.perform(post("/api/v1/tutoring/sessions/" + sessionCode + "/book")
                            .header("Authorization", "Bearer " + studentBToken)
                            .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                            .content("{}"))
                    .andReturn().getResponse().getStatus();
        };

        Future<Integer> futureA = executor.submit(taskA);
        Future<Integer> futureB = executor.submit(taskB);

        assertThat(ready.await(5, TimeUnit.SECONDS)).isTrue();
        start.countDown();

        int statusA = futureA.get(15, TimeUnit.SECONDS);
        int statusB = futureB.get(15, TimeUnit.SECONDS);
        executor.shutdownNow();

        assertThat(java.util.List.of(statusA, statusB)).containsExactlyInAnyOrder(201, 400);
        assertThat(fetchBalance(tutorToken)).isEqualByComparingTo(tutorInitial.add(new BigDecimal("70.00")));
    }
}

