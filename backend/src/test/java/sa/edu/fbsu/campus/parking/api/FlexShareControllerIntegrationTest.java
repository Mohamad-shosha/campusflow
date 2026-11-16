package sa.edu.fbsu.campus.parking.api;

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
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.dto.LoginRequest;
import sa.edu.fbsu.campus.identity.dto.RegisterRequest;
import sa.edu.fbsu.campus.parking.application.ParkingLifecycleService;
import sa.edu.fbsu.campus.parking.domain.ParkingSpot;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.dto.CreateFlexOfferRequest;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Flex-Share lifecycle and the ownership rule (P8-01 M7): only the holder of a live booking on a
 * bay, or the faculty member it is assigned to, may share it.
 */
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class FlexShareControllerIntegrationTest extends AbstractPostgresIntegrationTest {

    private static final BigDecimal CASHBACK = new BigDecimal("5.75");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ParkingSpotRepository spotRepository;

    @Autowired
    private ParkingLifecycleService lifecycleService;

    private String newStudent() throws Exception {
        String s = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        RegisterRequest req = new RegisterRequest(
                "FBSU", "FX-" + s, "flex-" + s + "@fbsu.edu.sa", "StrongP@ssw0rd!2026",
                "طالب فليكس", "Flex Student", UserType.STUDENT, "0522" + s.substring(0, 6),
                "د ر ع", String.valueOf(1000 + Math.abs(s.hashCode() % 8999)), "هيونداي النترا", "فضي");
        MvcResult res = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(res.getResponse().getContentAsString()).get("accessToken").asText();
    }

    private String login(String email) throws Exception {
        String json = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("FBSU", email, "FbsuDev2026!"))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json).get("accessToken").asText();
    }

    private void topUp(String token, int amount) throws Exception {
        mockMvc.perform(post("/api/v1/wallet/top-up").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "amount", amount, "idempotencyKey", "FX-TOP-" + UUID.randomUUID(), "paymentMethod", "MADA"))))
                .andExpect(status().isOk());
    }

    private BigDecimal balance(String token) throws Exception {
        String json = mockMvc.perform(get("/api/v1/wallet").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return new BigDecimal(objectMapper.readTree(json).get("balance").asText());
    }

    private ParkingSpot availableStandardSpot() {
        return spotRepository.findAll().stream()
                .filter(s -> s.getStatus() == SpotStatus.AVAILABLE && s.getSpotType().name().equals("STANDARD"))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No available standard bay"));
    }

    private JsonNode book(String token, ParkingSpot spot, double hours) throws Exception {
        String json = mockMvc.perform(post("/api/v1/parking/bookings").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "spotId", spot.getId().toString(), "durationHours", hours,
                                "idempotencyKey", "FX-BOOK-" + UUID.randomUUID()))))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(json);
    }

    private MvcResult offer(String token, UUID spotId, int minutes, int expectedStatus) throws Exception {
        return mockMvc.perform(post("/api/v1/parking/flex/offers").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CreateFlexOfferRequest(spotId, minutes, Instant.now()))))
                .andExpect(status().is(expectedStatus))
                .andReturn();
    }

    @Test
    @DisplayName("Booking holder shares their bay: peer claims, owner gets cashback, bay returns to owner")
    void bookingHolderSharesBayAndGetsCashback() throws Exception {
        String owner = newStudent();
        String peer = newStudent();
        topUp(owner, 100);

        ParkingSpot spot = availableStandardSpot();
        JsonNode booking = book(owner, spot, 2);
        BigDecimal fee = new BigDecimal(booking.get("totalAmount").asText());

        // The bay is listed as shareable for the owner, capped at the booking's end
        mockMvc.perform(get("/api/v1/parking/flex/shareable-spots").header("Authorization", "Bearer " + owner))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].spotId").value(spot.getId().toString()))
                .andExpect(jsonPath("$[0].source").value("BOOKING"))
                .andExpect(jsonPath("$[0].availableUntil").isNotEmpty());

        // An offer longer than the booking is rejected
        offer(owner, spot.getId(), 180, 400);

        // A 60-minute offer inside the booking is accepted
        String offerId = objectMapper.readTree(offer(owner, spot.getId(), 60, 201).getResponse().getContentAsString())
                .get("id").asText();
        assertThat(spotRepository.findById(spot.getId()).orElseThrow().getStatus()).isEqualTo(SpotStatus.FLEX_SHARE);

        // Nobody can book the shared bay directly (it must be claimed so the owner is paid)
        topUp(peer, 50);
        mockMvc.perform(post("/api/v1/parking/bookings").header("Authorization", "Bearer " + peer)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "spotId", spot.getId().toString(), "durationHours", 1,
                                "idempotencyKey", "FX-BYPASS-" + UUID.randomUUID()))))
                .andExpect(status().isBadRequest());

        // Owner cannot claim their own offer
        mockMvc.perform(post("/api/v1/parking/flex/offers/" + offerId + "/claim").header("Authorization", "Bearer " + owner))
                .andExpect(status().isBadRequest());

        // Peer claims; owner is paid exactly once
        mockMvc.perform(post("/api/v1/parking/flex/offers/" + offerId + "/claim").header("Authorization", "Bearer " + peer))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CLAIMED"))
                .andExpect(jsonPath("$.rewardPaid").value(true));
        mockMvc.perform(post("/api/v1/parking/flex/offers/" + offerId + "/claim").header("Authorization", "Bearer " + peer))
                .andExpect(status().isBadRequest());
        assertThat(balance(owner)).isEqualByComparingTo(new BigDecimal("100").subtract(fee).add(CASHBACK));

        // When the flex window ends, the bay goes back to the owner (booking still has an hour left)
        lifecycleService.expireEnded(Instant.now().plus(61, ChronoUnit.MINUTES));
        ParkingSpot after = spotRepository.findById(spot.getId()).orElseThrow();
        assertThat(after.getStatus()).isEqualTo(SpotStatus.RESERVED);
        assertThat(after.getOccupantNameEn()).isEqualTo("Flex Student");
        assertThat(after.getCurrentOccupantId()).isNotNull();

        // And when the booking itself ends, the bay is free
        lifecycleService.expireEnded(Instant.now().plus(121, ChronoUnit.MINUTES));
        assertThat(spotRepository.findById(spot.getId()).orElseThrow().getStatus()).isEqualTo(SpotStatus.AVAILABLE);
    }

    @Test
    @DisplayName("A user without a booking or assignment cannot share someone else's bay")
    void strangerCannotShareABay() throws Exception {
        String stranger = newStudent();
        ParkingSpot spot = availableStandardSpot();

        offer(stranger, spot.getId(), 60, 403);

        mockMvc.perform(get("/api/v1/parking/flex/shareable-spots").header("Authorization", "Bearer " + stranger))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
        assertThat(spotRepository.findById(spot.getId()).orElseThrow().getStatus()).isEqualTo(SpotStatus.AVAILABLE);
    }

    @Test
    @DisplayName("Assigned faculty shares their bay; cancelling gives it back as faculty-assigned; others are refused")
    void assignedFacultySharesTheirBay() throws Exception {
        String ghamdi = login("a.ghamdi@fbsu.edu.sa");   // assigned bay 19 by the dev seeder
        String mezher = login("m.mezher@fbsu.edu.sa");   // assigned bay 20

        String json = mockMvc.perform(get("/api/v1/parking/flex/shareable-spots").header("Authorization", "Bearer " + ghamdi))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].bayNumber").value(19))
                .andExpect(jsonPath("$[0].source").value("ASSIGNMENT"))
                .andReturn().getResponse().getContentAsString();
        UUID bay19 = UUID.fromString(objectMapper.readTree(json).get(0).get("spotId").asText());

        // Another faculty member can neither share nor book Dr. Ghamdi's bay
        offer(mezher, bay19, 60, 403);
        mockMvc.perform(post("/api/v1/parking/bookings").header("Authorization", "Bearer " + mezher)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "spotId", bay19.toString(), "durationHours", 1,
                                "idempotencyKey", "FX-FAC-" + UUID.randomUUID()))))
                .andExpect(status().isBadRequest());

        String offerId = objectMapper.readTree(offer(ghamdi, bay19, 120, 201).getResponse().getContentAsString())
                .get("id").asText();
        assertThat(spotRepository.findById(bay19).orElseThrow().getStatus()).isEqualTo(SpotStatus.FLEX_SHARE);

        mockMvc.perform(post("/api/v1/parking/flex/offers/" + offerId + "/cancel").header("Authorization", "Bearer " + ghamdi))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
        ParkingSpot restored = spotRepository.findById(bay19).orElseThrow();
        assertThat(restored.getStatus()).isEqualTo(SpotStatus.FACULTY_ASSIGNED);
        assertThat(restored.getOccupantNameEn()).isEqualTo("Dr. Abdullah Al-Ghamdi");
    }
}
