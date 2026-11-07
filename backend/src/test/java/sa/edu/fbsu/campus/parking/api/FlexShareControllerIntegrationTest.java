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
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.dto.RegisterRequest;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.parking.domain.ParkingSpot;
import sa.edu.fbsu.campus.parking.dto.CreateFlexOfferRequest;
import sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository;

import java.time.Instant;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles("dev")
class FlexShareControllerIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private ParkingSpotRepository spotRepository;

    private void ensureUniversity() {
        if (!universityRepository.existsByCode("FBSU")) {
            universityRepository.save(new University("FBSU", "جامعة فهد بن سلطان", "Fahad Bin Sultan University"));
        }
    }

    private String obtainAuthToken(String suffix) throws Exception {
        ensureUniversity();
        String uniNumber = "FX-" + suffix;
        String email = "flex-" + suffix + "@fbsu.edu.sa";

        RegisterRequest regReq = new RegisterRequest(
                "FBSU",
                uniNumber,
                email,
                "StrongP@ssw0rd!2026",
                "طالب فليكس",
                "Flex Student",
                UserType.STUDENT,
                "052234" + suffix.substring(0, 4),
                "د ر ع",
                String.valueOf(1000 + Math.abs(suffix.hashCode() % 8999)),
                "هيونداي النترا",
                "فضي"
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
    @DisplayName("Flex-Share End-to-End: Offer Spot -> Prevent Self Claim -> Peer Claims -> Offerer Receives Reward")
    void shouldExecuteFlexShareOfferClaimAndRewardLifecycle() throws Exception {
        ensureUniversity();

        String offererSuffix = UUID.randomUUID().toString().substring(0, 6);
        String offererToken = obtainAuthToken(offererSuffix);

        String peerSuffix = UUID.randomUUID().toString().substring(0, 6);
        String peerToken = obtainAuthToken(peerSuffix);

        // 1. Pick an occupied standard spot (Bay 4) so Bay 1 seed data remains intact
        ParkingSpot spot = spotRepository.findAll().stream()
                .filter(s -> s.getBayNumber() == 4)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No spot available"));

        // 2. Offerer posts a Flex-Share offer (60 mins)
        CreateFlexOfferRequest offerReq = new CreateFlexOfferRequest(
                spot.getId(),
                60,
                Instant.now()
        );

        MvcResult offerRes = mockMvc.perform(post("/api/v1/parking/flex/offers")
                        .header("Authorization", "Bearer " + offererToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(offerReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("AVAILABLE"))
                .andExpect(jsonPath("$.rewardAmount").value(5.75))
                .andReturn();

        JsonNode offerJson = objectMapper.readTree(offerRes.getResponse().getContentAsString());
        String offerId = offerJson.get("id").asText();

        // 3. Offerer attempts to claim their own offer -> must fail
        mockMvc.perform(post("/api/v1/parking/flex/offers/" + offerId + "/claim")
                        .header("Authorization", "Bearer " + offererToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

        // 4. Peer claims the offer
        mockMvc.perform(post("/api/v1/parking/flex/offers/" + offerId + "/claim")
                        .header("Authorization", "Bearer " + peerToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CLAIMED"))
                .andExpect(jsonPath("$.rewardPaid").value(true));

        // 5. Verify offerer received reward in wallet (+5.75 SAR)
        mockMvc.perform(get("/api/v1/wallet")
                        .header("Authorization", "Bearer " + offererToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.balance").value(5.75));

        // 6. Attempting to claim again must fail
        mockMvc.perform(post("/api/v1/parking/flex/offers/" + offerId + "/claim")
                        .header("Authorization", "Bearer " + peerToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}

