package sa.edu.fbsu.campus.parking.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import sa.edu.fbsu.campus.common.AbstractPostgresIntegrationTest;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.dto.RegisterRequest;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.parking.domain.ParkingSpot;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.dto.CreateBookingRequest;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;
import sa.edu.fbsu.campus.wallet.dto.TopUpRequest;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class BookingControllerIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private ParkingSpotRepository spotRepository;

    private String obtainAuthToken(String suffix) throws Exception {
        if (!universityRepository.existsByCode("FBSU")) {
            universityRepository.save(new University("FBSU", "جامعة فهد بن سلطان", "Fahad Bin Sultan University"));
        }

        String uniNumber = "BK-" + suffix;
        String email = "booker-" + suffix + "@fbsu.edu.sa";

        RegisterRequest regReq = new RegisterRequest(
                "FBSU",
                uniNumber,
                email,
                "StrongP@ssw0rd!2026",
                "طالب تجريبي",
                "Test Student",
                UserType.STUDENT,
                "051234" + suffix.substring(0, 4),
                "أ ب ج",
                "1234",
                "تويوتا كامري",
                "أبيض"
        );

        MvcResult regRes = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode json = objectMapper.readTree(regRes.getResponse().getContentAsString());
        return json.get("accessToken").asText();
    }

    @Test
    @DisplayName("End-to-end Booking: Reserve Bay -> Debit Wallet -> Pass Issuance -> Anti-Double-Booking -> Cancel & Refund")
    void shouldExecuteCompleteBookingLifecycleWithConcurrencyProtection() throws Exception {
        ensureUniversity();
        String suffix = UUID.randomUUID().toString().substring(0, 6);
        String token = obtainAuthToken(suffix);

        // 1. Top up wallet with 100 SAR
        TopUpRequest topUp = new TopUpRequest(
                new BigDecimal("100.00"),
                "MADA",
                "TOPUP-" + suffix,
                "Test Top-up"
        );

        mockMvc.perform(post("/api/v1/wallet/top-up")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(topUp)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").value(100.00));

        // 2. Find an available spot
        ParkingSpot spot = spotRepository.findAll().stream()
                .filter(s -> s.getStatus() == SpotStatus.AVAILABLE)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No available spot for test"));

        // 3. Create 2-hour booking
        CreateBookingRequest bookingRequest = new CreateBookingRequest(
                spot.getId(),
                null,
                new BigDecimal("2.0"),
                Instant.now(),
                true,
                "BOOK-" + suffix
        );

        MvcResult bookRes = mockMvc.perform(post("/api/v1/parking/bookings")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bookingRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("CONFIRMED"))
                .andExpect(jsonPath("$.totalAmount").value(11.50)) // 5.75 * 2
                .andExpect(jsonPath("$.digitalPassCode").isNotEmpty())
                .andExpect(jsonPath("$.qrToken").isNotEmpty())
                .andReturn();

        JsonNode bookingJson = objectMapper.readTree(bookRes.getResponse().getContentAsString());
        String bookingId = bookingJson.get("id").asText();

        // 4. Verify wallet was debited: 100.00 - 11.50 = 88.50 SAR
        mockMvc.perform(get("/api/v1/wallet")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").value(88.50));

        // 5. Anti-Double Booking: Concurrent/overlapping booking on the same bay must be rejected
        CreateBookingRequest duplicateRequest = new CreateBookingRequest(
                spot.getId(),
                null,
                new BigDecimal("1.0"),
                Instant.now().plusSeconds(600), // overlapping time
                true,
                "BOOK-DUP-" + suffix
        );

        mockMvc.perform(post("/api/v1/parking/bookings")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andExpect(status().is4xxClientError());

        // 6. Inspect digital pass
        mockMvc.perform(get("/api/v1/parking/bookings/" + bookingId + "/pass")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookingId").value(bookingId))
                .andExpect(jsonPath("$.bayNumber").value(spot.getBayNumber()))
                .andExpect(jsonPath("$.passCode").isNotEmpty())
                .andExpect(jsonPath("$.qrPayload").isNotEmpty());

        // 7. Cancel booking and verify automatic wallet refund
        mockMvc.perform(post("/api/v1/parking/bookings/" + bookingId + "/cancel")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));

        // Verify balance refunded back to 100.00 SAR
        mockMvc.perform(get("/api/v1/wallet")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").value(100.00));
    }

    private void ensureUniversity() {
        if (!universityRepository.existsByCode("FBSU")) {
            universityRepository.save(new University("FBSU", "جامعة فهد بن سلطان", "Fahad Bin Sultan University"));
        }
    }
}
