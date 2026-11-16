package sa.edu.fbsu.campus.common;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.dto.LoginRequest;
import sa.edu.fbsu.campus.identity.dto.RegisterRequest;
import sa.edu.fbsu.campus.officehours.domain.FacultyOfficeProfile;
import sa.edu.fbsu.campus.officehours.domain.OfficeHourSlot;
import sa.edu.fbsu.campus.officehours.infra.FacultyOfficeProfileRepository;
import sa.edu.fbsu.campus.officehours.infra.OfficeHourSlotRepository;
import sa.edu.fbsu.campus.parking.application.ParkingLifecycleService;
import sa.edu.fbsu.campus.parking.infra.ParkingBookingRepository;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Logical business rules found missing during the P8-01 end-to-end run against the live stack:
 * bookings in the past, and transit passes with impossible itineraries.
 */
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class BusinessRulesIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private FacultyOfficeProfileRepository profileRepository;

    @Autowired
    private OfficeHourSlotRepository slotRepository;

    @Autowired
    private ParkingLifecycleService lifecycleService;

    @Autowired
    private ParkingBookingRepository bookingRepository;

    @Autowired
    private ParkingSpotRepository spotRepository;

    private String token(String path, Object body) throws Exception {
        String json = mockMvc.perform(post(path)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).path("accessToken").asText();
    }

    private String login(String email) throws Exception {
        return token("/api/v1/auth/login", new LoginRequest("FBSU", email, "FbsuDev2026!"));
    }

    private String newStudent() throws Exception {
        String s = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        return token("/api/v1/auth/register", new RegisterRequest(
                "FBSU", "BR-" + s, "br-" + s + "@fbsu.edu.sa", "StudentP@ss2026!",
                "طالب", "Student", UserType.STUDENT, "0515" + s.substring(0, 6),
                "ط ي ك", String.valueOf(1000 + Math.abs(s.hashCode() % 8999)), "Car", "Blue"));
    }

    private JsonNode getJson(String path) throws Exception {
        return objectMapper.readTree(mockMvc.perform(get(path)).andReturn().getResponse().getContentAsString());
    }

    @Test
    @DisplayName("Transit: dropoff must come after pickup on the same route; shuttle must run on the route")
    void transitItineraryMustBeValid() throws Exception {
        String student = newStudent();
        JsonNode routes = getJson("/api/v1/transit/routes");
        JsonNode route = null;
        JsonNode otherRoute = null;
        for (JsonNode r : routes) {
            if (r.path("stops").size() >= 2 && route == null) route = r;
            else if (r.path("stops").size() >= 1 && otherRoute == null) otherRoute = r;
        }
        assertThat(route).as("seeded route with 2+ stops").isNotNull();
        JsonNode stops = route.path("stops");
        String first = stops.get(0).path("id").asText();
        String last = stops.get(stops.size() - 1).path("id").asText();

        // valid itinerary is accepted
        mockMvc.perform(post("/api/v1/transit/passes/book").header("Authorization", "Bearer " + student)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "routeId", route.path("id").asText(), "pickupStopId", first, "dropoffStopId", last))))
                .andExpect(status().isCreated());

        // same stop
        mockMvc.perform(post("/api/v1/transit/passes/book").header("Authorization", "Bearer " + student)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "routeId", route.path("id").asText(), "pickupStopId", first, "dropoffStopId", first))))
                .andExpect(status().isBadRequest());

        // reversed direction
        mockMvc.perform(post("/api/v1/transit/passes/book").header("Authorization", "Bearer " + student)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "routeId", route.path("id").asText(), "pickupStopId", last, "dropoffStopId", first))))
                .andExpect(status().isBadRequest());

        if (otherRoute != null) {
            // stop from a different route
            mockMvc.perform(post("/api/v1/transit/passes/book").header("Authorization", "Bearer " + student)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(Map.of(
                                    "routeId", route.path("id").asText(), "pickupStopId", first,
                                    "dropoffStopId", otherRoute.path("stops").get(0).path("id").asText()))))
                    .andExpect(status().isBadRequest());

            // shuttle from a different route
            for (JsonNode sh : getJson("/api/v1/transit/shuttles")) {
                if (!route.path("routeCode").asText().equals(sh.path("routeCode").asText())) {
                    Map<String, String> body = new HashMap<>(Map.of(
                            "routeId", route.path("id").asText(), "pickupStopId", first, "dropoffStopId", last,
                            "shuttleId", sh.path("id").asText()));
                    mockMvc.perform(post("/api/v1/transit/passes/book").header("Authorization", "Bearer " + student)
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content(objectMapper.writeValueAsString(body)))
                            .andExpect(status().isBadRequest());
                    break;
                }
            }
        }
    }

    @Test
    @DisplayName("Office hours: past slots are not listed as available and cannot be booked or created")
    void officeHoursRejectPastSlots() throws Exception {
        String student = newStudent();
        FacultyOfficeProfile profile = profileRepository.findDetailedByProfileCode("doctor").orElseThrow();
        Instant past = Instant.now().minus(2, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MINUTES);
        OfficeHourSlot stale = slotRepository.save(new OfficeHourSlot(profile.getUniversityId(), profile, past,
                past.plus(15, ChronoUnit.MINUTES), "قديم", "Old", 15, true, null));

        boolean listedAvailable = false;
        for (JsonNode f : getJson("/api/v1/office-hours/faculty")) {
            for (JsonNode sl : f.path("timeSlots")) {
                if (sl.path("id").asText().equals(stale.getId().toString())) {
                    listedAvailable = sl.path("available").asBoolean();
                }
            }
        }
        assertThat(listedAvailable).as("past slot must not be shown as available").isFalse();

        mockMvc.perform(post("/api/v1/office-hours/appointments").header("Authorization", "Bearer " + student)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("slotId", stale.getId(), "topic", "late"))))
                .andExpect(status().isBadRequest());

        String faculty = login("a.ghamdi@fbsu.edu.sa");
        mockMvc.perform(post("/api/v1/office-hours/slots").header("Authorization", "Bearer " + faculty)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "startTime", past.toString(), "durationMinutes", 15,
                                "timeLabelAr", "x", "timeLabelEn", "x"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Parking and rooms: bookings cannot start in the past")
    void bookingsCannotStartInThePast() throws Exception {
        String student = newStudent();
        String yesterday = Instant.now().minus(1, ChronoUnit.DAYS).toString();

        JsonNode spot = null;
        for (JsonNode s : getJson("/api/v1/parking/spots")) {
            if ("AVAILABLE".equals(s.path("status").asText())) { spot = s; break; }
        }
        assertThat(spot).isNotNull();
        mockMvc.perform(post("/api/v1/parking/bookings").header("Authorization", "Bearer " + student)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "spotId", spot.path("id").asText(), "durationHours", 1,
                                "startTime", yesterday, "idempotencyKey", "BR-PAST-" + UUID.randomUUID()))))
                .andExpect(status().isBadRequest());

        JsonNode room = null;
        for (JsonNode r : getJson("/api/v1/rooms")) {
            if ("AVAILABLE".equals(r.path("status").asText())) { room = r; break; }
        }
        assertThat(room).isNotNull();
        Instant start = Instant.now().minus(1, ChronoUnit.DAYS);
        mockMvc.perform(post("/api/v1/rooms/" + room.path("roomCode").asText() + "/book")
                        .header("Authorization", "Bearer " + student)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "startTime", start.toString(), "endTime", start.plus(1, ChronoUnit.HOURS).toString(),
                                "purpose", "past"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Malformed requests return 4xx ProblemDetails, never 500")
    void malformedRequestsAreClientErrors() throws Exception {
        String student = newStudent();
        // wrong value type in JSON
        mockMvc.perform(post("/api/v1/wallet/top-up").header("Authorization", "Bearer " + student)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"amount\":\"abc\"}"))
                .andExpect(status().isBadRequest());
        // broken JSON
        mockMvc.perform(post("/api/v1/wallet/top-up").header("Authorization", "Bearer " + student)
                        .contentType(MediaType.APPLICATION_JSON).content("{not json"))
                .andExpect(status().isBadRequest());
        // mistyped path variable
        mockMvc.perform(get("/api/v1/tuition/invoices/not-a-uuid").header("Authorization", "Bearer " + student))
                .andExpect(status().isBadRequest());
        // unsupported method
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .delete("/api/v1/wallet").header("Authorization", "Bearer " + student))
                .andExpect(status().isMethodNotAllowed());
        // unsupported media type
        mockMvc.perform(post("/api/v1/wallet/top-up").header("Authorization", "Bearer " + student)
                        .contentType(MediaType.TEXT_PLAIN).content("amount=5"))
                .andExpect(status().isUnsupportedMediaType());
    }

    @Test
    @DisplayName("Ended bookings are completed and their bay is freed (no ghost reservations)")
    void endedBookingsReleaseTheirBay() throws Exception {
        String student = newStudent();
        mockMvc.perform(post("/api/v1/wallet/top-up").header("Authorization", "Bearer " + student)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "amount", 100, "idempotencyKey", "BR-TOP-" + UUID.randomUUID(), "paymentMethod", "MADA"))))
                .andExpect(status().isOk());

        JsonNode spot = null;
        for (JsonNode s : getJson("/api/v1/parking/spots")) {
            if ("AVAILABLE".equals(s.path("status").asText())) { spot = s; break; }
        }
        assertThat(spot).isNotNull();
        String json = mockMvc.perform(post("/api/v1/parking/bookings").header("Authorization", "Bearer " + student)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "spotId", spot.path("id").asText(), "durationHours", 0.5,
                                "idempotencyKey", "BR-LIFE-" + UUID.randomUUID()))))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        UUID bookingId = UUID.fromString(objectMapper.readTree(json).path("id").asText());
        UUID spotId = UUID.fromString(spot.path("id").asText());
        assertThat(spotRepository.findById(spotId).orElseThrow().getStatus().name()).isNotEqualTo("AVAILABLE");

        // Nothing has ended yet: the booking stays live
        lifecycleService.expireEnded(Instant.now());
        assertThat(bookingRepository.findById(bookingId).orElseThrow().getStatus().name()).isEqualTo("CONFIRMED");

        // After the window ends, the booking completes and the bay is free again
        lifecycleService.expireEnded(Instant.now().plus(31, ChronoUnit.MINUTES));
        assertThat(bookingRepository.findById(bookingId).orElseThrow().getStatus().name()).isEqualTo("COMPLETED");
        var freed = spotRepository.findById(spotId).orElseThrow();
        assertThat(freed.getStatus().name()).isEqualTo("AVAILABLE");
        assertThat(freed.getCurrentOccupantId()).isNull();
        assertThat(freed.getPlateDigits()).isNull();
    }

    @Test
    @DisplayName("Scheduled run frees bays orphaned by bookings that already ended")
    void scheduledRunFreesOrphanedBays() throws Exception {
        String student = newStudent();
        mockMvc.perform(post("/api/v1/wallet/top-up").header("Authorization", "Bearer " + student)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "amount", 100, "idempotencyKey", "BR-TOP-" + UUID.randomUUID(), "paymentMethod", "MADA"))))
                .andExpect(status().isOk());
        JsonNode spot = null;
        for (JsonNode s : getJson("/api/v1/parking/spots")) {
            if ("AVAILABLE".equals(s.path("status").asText())) { spot = s; break; }
        }
        assertThat(spot).isNotNull();
        String json = mockMvc.perform(post("/api/v1/parking/bookings").header("Authorization", "Bearer " + student)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "spotId", spot.path("id").asText(), "durationHours", 1,
                                "idempotencyKey", "BR-ORPH-" + UUID.randomUUID()))))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        UUID bookingId = UUID.fromString(objectMapper.readTree(json).path("id").asText());
        UUID spotId = UUID.fromString(spot.path("id").asText());

        // Simulate the pre-fix state: booking closed, bay left RESERVED
        var booking = bookingRepository.findById(bookingId).orElseThrow();
        booking.complete();
        bookingRepository.save(booking);
        assertThat(spotRepository.findById(spotId).orElseThrow().getStatus().name()).isEqualTo("RESERVED");

        // The scheduled entry point must work on its own (it once failed outside a transaction)
        lifecycleService.scheduledExpiry();
        assertThat(spotRepository.findById(spotId).orElseThrow().getStatus().name()).isEqualTo("AVAILABLE");
    }
}
