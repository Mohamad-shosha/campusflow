package sa.edu.fbsu.campus.rooms.api;

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
import sa.edu.fbsu.campus.rooms.dto.BookRoomRequest;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles("dev")
class RoomsControllerIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UniversityRepository universityRepository;

    private String registerStudentAndGetToken(String suffix) throws Exception {
        if (!universityRepository.existsByCode("FBSU")) {
            universityRepository.save(new University("FBSU", "جامعة فهد بن سلطان", "Fahad Bin Sultan University"));
        }

        RegisterRequest regReq = new RegisterRequest(
                "FBSU",
                "SR-" + suffix,
                "sr-" + suffix + "@fbsu.edu.sa",
                "StrongP@ssw0rd!2026",
                "طالب دراسي",
                "Studying Student",
                UserType.STUDENT,
                "0555" + suffix.substring(Math.max(0, suffix.length() - 6)),
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

    @Test
    @DisplayName("GET /api/v1/rooms publicly returns seeded study pods and specialized labs")
    void shouldReturnSeededStudyRooms() throws Exception {
        mockMvc.perform(get("/api/v1/rooms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", greaterThanOrEqualTo(4)))
                .andExpect(jsonPath("$[*].roomCode", hasItem("LAB-102")))
                .andExpect(jsonPath("$[*].roomCode", hasItem("ROOM-A04")))
                .andExpect(jsonPath("$[*].roomCode", hasItem("LAB-205")))
                .andExpect(jsonPath("$[*].roomCode", hasItem("ROOM-C12")));
    }

    @Test
    @DisplayName("Study room lifecycle: booking, overlap exclusion, +10m extension (max 3), non-leader 403, and early release")
    void shouldManageRoomBookingLifecycleWithExtensionsAndRelease() throws Exception {
        String studentAToken = registerStudentAndGetToken("100111");
        String studentBToken = registerStudentAndGetToken("100222");

        Instant start = Instant.now().minus(5, ChronoUnit.MINUTES).truncatedTo(ChronoUnit.MINUTES);
        Instant end = start.plus(30, ChronoUnit.MINUTES);

        BookRoomRequest bookReq = new BookRoomRequest(
                start,
                end,
                "10:00 ص",
                "10:30 ص",
                "جلسة عمل ومذاكرة جماعية لمقرر هندسة البرمجيات",
                List.of("طالب دراسي أ", "طالب دراسي ب")
        );

        // 1. Unauthenticated request rejected -> 401 Unauthorized
        mockMvc.perform(post("/api/v1/rooms/ROOM-A04/book")
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(bookReq))))
                .andExpect(status().isUnauthorized());

        // 2. Student A books ROOM-A04 -> 201 Created
        MvcResult bookRes = mockMvc.perform(post("/api/v1/rooms/ROOM-A04/book")
                        .header("Authorization", "Bearer " + studentAToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(bookReq))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.roomCode").value("ROOM-A04"))
                .andExpect(jsonPath("$.activeBooking.purpose").value(bookReq.purpose()))
                .andReturn();

        JsonNode responseNode = objectMapper.readTree(bookRes.getResponse().getContentAsString());
        UUID bookingId = UUID.fromString(responseNode.get("activeBooking").get("bookingId").asText());

        // 3. Overlapping booking attempt on the same room -> 400 Bad Request / 409 Conflict
        BookRoomRequest overlapReq = new BookRoomRequest(
                start.plus(10, ChronoUnit.MINUTES),
                end.plus(10, ChronoUnit.MINUTES),
                "10:10 ص",
                "10:40 ص",
                "محاولة حجز متعارضة",
                List.of("طالب آخر")
        );
        mockMvc.perform(post("/api/v1/rooms/ROOM-A04/book")
                        .header("Authorization", "Bearer " + studentBToken)
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(overlapReq))))
                .andExpect(status().isBadRequest());

        // 4. Non-leader (Student B) attempting to extend booking -> 403 Forbidden
        mockMvc.perform(post("/api/v1/rooms/bookings/" + bookingId + "/extend")
                        .header("Authorization", "Bearer " + studentBToken))
                .andExpect(status().isForbidden());

        // 5. Leader (Student A) extends booking: 1st extension (+10m) -> 200 OK
        mockMvc.perform(post("/api/v1/rooms/bookings/" + bookingId + "/extend")
                        .header("Authorization", "Bearer " + studentAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activeBooking.extendedCount").value(1));

        // 2nd and 3rd extensions -> 200 OK
        mockMvc.perform(post("/api/v1/rooms/bookings/" + bookingId + "/extend")
                        .header("Authorization", "Bearer " + studentAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activeBooking.extendedCount").value(2));

        mockMvc.perform(post("/api/v1/rooms/bookings/" + bookingId + "/extend")
                        .header("Authorization", "Bearer " + studentAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activeBooking.extendedCount").value(3));

        // 4th extension attempt (exceeds max 3 per Q10) -> 400 Bad Request
        mockMvc.perform(post("/api/v1/rooms/bookings/" + bookingId + "/extend")
                        .header("Authorization", "Bearer " + studentAToken))
                .andExpect(status().isBadRequest());

        // 6. Non-leader attempting to release -> 403 Forbidden
        mockMvc.perform(post("/api/v1/rooms/bookings/" + bookingId + "/release")
                        .header("Authorization", "Bearer " + studentBToken))
                .andExpect(status().isForbidden());

        // 7. Leader releases booking early -> 200 OK, room returns to AVAILABLE
        mockMvc.perform(post("/api/v1/rooms/bookings/" + bookingId + "/release")
                        .header("Authorization", "Bearer " + studentAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("AVAILABLE"))
                .andExpect(jsonPath("$.activeBooking").doesNotExist());
    }

    @Test
    @DisplayName("Concurrency: two students racing for the same study room simultaneously results in exactly 1 winner and 1 rejected")
    void shouldPreventConcurrentOverbookingOfSameRoom() throws Exception {
        String token1 = registerStudentAndGetToken("200333");
        String token2 = registerStudentAndGetToken("200444");

        Instant start = Instant.now().plus(4, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MINUTES);
        Instant end = start.plus(45, ChronoUnit.MINUTES);

        BookRoomRequest req1 = new BookRoomRequest(start, end, "02:00 م", "02:45 م", "فريق أ", List.of("طالب أ"));
        BookRoomRequest req2 = new BookRoomRequest(start, end, "02:00 م", "02:45 م", "فريق ب", List.of("طالب ب"));

        var executor = Executors.newFixedThreadPool(2);
        CountDownLatch ready = new CountDownLatch(2);
        CountDownLatch startSignal = new CountDownLatch(1);

        Callable<Integer> task1 = () -> {
            ready.countDown();
            startSignal.await(5, TimeUnit.SECONDS);
            return mockMvc.perform(post("/api/v1/rooms/LAB-205/book")
                            .header("Authorization", "Bearer " + token1)
                            .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                            .content(Objects.requireNonNull(objectMapper.writeValueAsString(req1))))
                    .andReturn().getResponse().getStatus();
        };

        Callable<Integer> task2 = () -> {
            ready.countDown();
            startSignal.await(5, TimeUnit.SECONDS);
            return mockMvc.perform(post("/api/v1/rooms/LAB-205/book")
                            .header("Authorization", "Bearer " + token2)
                            .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                            .content(Objects.requireNonNull(objectMapper.writeValueAsString(req2))))
                    .andReturn().getResponse().getStatus();
        };

        Future<Integer> fut1 = executor.submit(task1);
        Future<Integer> fut2 = executor.submit(task2);

        assertThat(ready.await(5, TimeUnit.SECONDS)).isTrue();
        startSignal.countDown();

        int status1 = fut1.get(15, TimeUnit.SECONDS);
        int status2 = fut2.get(15, TimeUnit.SECONDS);
        executor.shutdownNow();

        // One winner (201) and one loser (400 or 409)
        assertThat(List.of(status1, status2)).contains(201);
        int loserStatus = (status1 == 201) ? status2 : status1;
        assertThat(loserStatus).isIn(400, 409);
    }
}
