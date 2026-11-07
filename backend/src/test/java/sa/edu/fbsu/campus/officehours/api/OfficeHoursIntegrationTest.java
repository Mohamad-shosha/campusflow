package sa.edu.fbsu.campus.officehours.api;

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
import sa.edu.fbsu.campus.officehours.dto.BookOfficeHourRequest;
import sa.edu.fbsu.campus.officehours.dto.CreateOfficeHourSlotRequest;

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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles("dev")
class OfficeHoursIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UniversityRepository universityRepository;

    private record RegisteredAccount(String token, String universityNumber) {
    }

    private RegisteredAccount registerAccount(UserType userType, String prefix) throws Exception {
        if (!universityRepository.existsByCode("FBSU")) {
            universityRepository.save(new University("FBSU", "جامعة فهد بن سلطان", "Fahad Bin Sultan University"));
        }
        String suffix = UUID.randomUUID().toString().replaceAll("[^0-9]", "");
        if (suffix.length() < 6) {
            suffix = suffix + "987654";
        }
        suffix = suffix.substring(0, 6);
        String uniNumber = prefix + "-" + suffix;

        RegisterRequest req = new RegisterRequest(
                "FBSU",
                uniNumber,
                uniNumber.toLowerCase() + "@fbsu.edu.sa",
                "StrongP@ssw0rd!2026",
                userType == UserType.FACULTY ? "د. باحث أكاديمي" : "طالب مراجع",
                userType == UserType.FACULTY ? "Dr. Academic Faculty" : "Advising Student",
                userType,
                "0544" + suffix,
                null,
                null,
                null,
                null
        );

        MvcResult res = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(req))))
                .andExpect(status().isCreated())
                .andReturn();

        String token = objectMapper.readTree(res.getResponse().getContentAsString()).get("accessToken").asText();
        return new RegisteredAccount(token, uniNumber);
    }

    @Test
    @DisplayName("GET /api/v1/office-hours/faculty publicly returns seeded faculty profiles and slots")
    void shouldReturnSeededFacultyProfilesAndSlots() throws Exception {
        mockMvc.perform(get("/api/v1/office-hours/faculty"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", greaterThanOrEqualTo(3)))
                .andExpect(jsonPath("$[*].profileCode", hasItem("drRaghad")))
                .andExpect(jsonPath("$[*].profileCode", hasItem("drMezher")))
                .andExpect(jsonPath("$[*].profileCode", hasItem("doctor")));
    }

    @Test
    @DisplayName("Security & exclusion constraints: faculty manages own windows only, blocks overlaps (409), and denies cross-faculty/student mutations (403)")
    void shouldEnforceFacultyOwnershipAndSlotOverlapExclusion() throws Exception {
        RegisteredAccount facultyA = registerAccount(UserType.FACULTY, "FACA");
        RegisteredAccount facultyB = registerAccount(UserType.FACULTY, "FACB");
        RegisteredAccount student = registerAccount(UserType.STUDENT, "STUO");

        Instant baseStart = Instant.now().plus(5, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MINUTES);

        // 1. Student cannot create an office-hour window -> 403 Forbidden
        CreateOfficeHourSlotRequest studentSlotReq = new CreateOfficeHourSlotRequest(
                null, baseStart, 15, "10:00 ص", "10:00 AM"
        );
        mockMvc.perform(post("/api/v1/office-hours/slots")
                        .header("Authorization", "Bearer " + student.token())
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(studentSlotReq))))
                .andExpect(status().isForbidden());

        // 2. Faculty A creates own office-hour window -> 201 Created (auto-provisions profile fac-<uniNumber>)
        MvcResult createRes = mockMvc.perform(post("/api/v1/office-hours/slots")
                        .header("Authorization", "Bearer " + facultyA.token())
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(studentSlotReq))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.available").value(true))
                .andExpect(jsonPath("$.durationMinutes").value(15))
                .andReturn();

        UUID slotAId = UUID.fromString(objectMapper.readTree(createRes.getResponse().getContentAsString()).get("id").asText());
        String profileACode = "fac-" + facultyA.universityNumber().toLowerCase();

        // 3. Overlapping window for Faculty A (starts 5 minutes into the 15-minute window) -> 409 Conflict
        CreateOfficeHourSlotRequest overlapReq = new CreateOfficeHourSlotRequest(
                null, baseStart.plus(5, ChronoUnit.MINUTES), 15, "10:05 ص", "10:05 AM"
        );
        mockMvc.perform(post("/api/v1/office-hours/slots")
                        .header("Authorization", "Bearer " + facultyA.token())
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(overlapReq))))
                .andExpect(status().isConflict());

        // 4. Faculty B attempting to create a window on Faculty A's profile -> 403 Forbidden
        CreateOfficeHourSlotRequest crossCreateReq = new CreateOfficeHourSlotRequest(
                profileACode, baseStart.plus(60, ChronoUnit.MINUTES), 15, "11:00 ص", "11:00 AM"
        );
        mockMvc.perform(post("/api/v1/office-hours/slots")
                        .header("Authorization", "Bearer " + facultyB.token())
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(crossCreateReq))))
                .andExpect(status().isForbidden());

        // 5. Faculty B attempting to delete Faculty A's window -> 403 Forbidden
        mockMvc.perform(delete("/api/v1/office-hours/slots/" + slotAId)
                        .header("Authorization", "Bearer " + facultyB.token()))
                .andExpect(status().isForbidden());

        // 6. Faculty A deletes own unbooked window -> 204 No Content
        mockMvc.perform(delete("/api/v1/office-hours/slots/" + slotAId)
                        .header("Authorization", "Bearer " + facultyA.token()))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Appointment booking, 2-thread concurrency race, my-appointments listing, and cancellation reopening slot")
    void shouldBookWithoutConflictAndReopenSlotOnCancel() throws Exception {
        RegisteredAccount faculty = registerAccount(UserType.FACULTY, "FACC");
        RegisteredAccount studentA = registerAccount(UserType.STUDENT, "STUA");
        RegisteredAccount studentB = registerAccount(UserType.STUDENT, "STUB");

        Instant start = Instant.now().plus(7, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MINUTES);
        CreateOfficeHourSlotRequest slotReq = new CreateOfficeHourSlotRequest(
                null, start, 20, "01:30 م", "01:30 PM"
        );

        MvcResult slotRes = mockMvc.perform(post("/api/v1/office-hours/slots")
                        .header("Authorization", "Bearer " + faculty.token())
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(slotReq))))
                .andExpect(status().isCreated())
                .andReturn();

        UUID slotId = UUID.fromString(objectMapper.readTree(slotRes.getResponse().getContentAsString()).get("id").asText());

        // 1. Faculty cannot book their own office-hour slot -> 400 Bad Request
        BookOfficeHourRequest selfBook = new BookOfficeHourRequest(slotId, "Self test");
        mockMvc.perform(post("/api/v1/office-hours/appointments")
                        .header("Authorization", "Bearer " + faculty.token())
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(selfBook))))
                .andExpect(status().isBadRequest());

        // 2. Concurrent race between Student A and Student B on the same slotId
        var executor = Executors.newFixedThreadPool(2);
        CountDownLatch ready = new CountDownLatch(2);
        CountDownLatch go = new CountDownLatch(1);

        BookOfficeHourRequest reqA = new BookOfficeHourRequest(slotId, "مناقشة مشروع التخرج - Architecture");
        BookOfficeHourRequest reqB = new BookOfficeHourRequest(slotId, "استفسار عن معادلة مقررات");

        Callable<MvcResult> callA = () -> {
            ready.countDown();
            go.await(5, TimeUnit.SECONDS);
            return mockMvc.perform(post("/api/v1/office-hours/appointments")
                            .header("Authorization", "Bearer " + studentA.token())
                            .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                            .content(Objects.requireNonNull(objectMapper.writeValueAsString(reqA))))
                    .andReturn();
        };

        Callable<MvcResult> callB = () -> {
            ready.countDown();
            go.await(5, TimeUnit.SECONDS);
            return mockMvc.perform(post("/api/v1/office-hours/appointments")
                            .header("Authorization", "Bearer " + studentB.token())
                            .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                            .content(Objects.requireNonNull(objectMapper.writeValueAsString(reqB))))
                    .andReturn();
        };

        Future<MvcResult> futA = executor.submit(callA);
        Future<MvcResult> futB = executor.submit(callB);

        assertThat(ready.await(5, TimeUnit.SECONDS)).isTrue();
        go.countDown();

        MvcResult resA = futA.get(15, TimeUnit.SECONDS);
        MvcResult resB = futB.get(15, TimeUnit.SECONDS);
        executor.shutdownNow();

        int codeA = resA.getResponse().getStatus();
        int codeB = resB.getResponse().getStatus();

        // Exactly one winner (201) and one loser (400 or 409)
        assertThat(List.of(codeA, codeB)).contains(201);
        int loserCode = (codeA == 201) ? codeB : codeA;
        assertThat(loserCode).isIn(400, 409);

        MvcResult winnerRes = (codeA == 201) ? resA : resB;
        RegisteredAccount winner = (codeA == 201) ? studentA : studentB;
        RegisteredAccount loser = (codeA == 201) ? studentB : studentA;

        JsonNode apptNode = objectMapper.readTree(winnerRes.getResponse().getContentAsString());
        UUID appointmentId = UUID.fromString(apptNode.get("id").asText());
        assertThat(apptNode.get("status").asText()).isEqualTo("CONFIRMED");

        // 3. Winner sees appointment in /appointments/my
        mockMvc.perform(get("/api/v1/office-hours/appointments/my")
                        .header("Authorization", "Bearer " + winner.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(appointmentId.toString()));

        // 4. Loser (non-owner) cannot cancel winner's appointment -> 403 Forbidden
        mockMvc.perform(post("/api/v1/office-hours/appointments/" + appointmentId + "/cancel")
                        .header("Authorization", "Bearer " + loser.token()))
                .andExpect(status().isForbidden());

        // 5. Winner cancels appointment -> 200 OK, status CANCELLED, slot reopens so loser can now book!
        mockMvc.perform(post("/api/v1/office-hours/appointments/" + appointmentId + "/cancel")
                        .header("Authorization", "Bearer " + winner.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));

        mockMvc.perform(post("/api/v1/office-hours/appointments")
                        .header("Authorization", "Bearer " + loser.token())
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(reqB))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }
}
