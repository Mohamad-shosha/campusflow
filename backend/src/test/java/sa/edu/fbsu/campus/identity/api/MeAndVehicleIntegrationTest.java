package sa.edu.fbsu.campus.identity.api;

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
import sa.edu.fbsu.campus.identity.dto.*;
import sa.edu.fbsu.campus.infra.UniversityRepository;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class MeAndVehicleIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UniversityRepository universityRepository;

    @Test
    @DisplayName("Complete Profile & Vehicles Lifecycle with IDOR Protection")
    void shouldExecuteProfileAndVehiclesLifecycleWithIdorProtection() throws Exception {
        if (!universityRepository.existsByCode("FBSU")) {
            universityRepository.save(new University("FBSU", "جامعة فهد بن سلطان", "Fahad Bin Sultan University"));
        }

        String suffixA = UUID.randomUUID().toString().substring(0, 6);
        String suffixB = UUID.randomUUID().toString().substring(0, 6);

        // 1. Register User A
        RegisterRequest regUserA = new RegisterRequest(
                "FBSU",
                "STD-A-" + suffixA,
                "user-a-" + suffixA + "@fbsu.edu.sa",
                "InitialPass2026!",
                "مستخدم أول",
                "First User",
                UserType.STUDENT,
                "0500000001",
                "أ ب ح",
                "1111",
                "Camry",
                "White"
        );
        MvcResult regResultA = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regUserA)))
                .andExpect(status().isCreated())
                .andReturn();
        String tokenA = objectMapper.readTree(regResultA.getResponse().getContentAsString()).get("accessToken").asText();

        // 2. Register User B
        RegisterRequest regUserB = new RegisterRequest(
                "FBSU",
                "STD-B-" + suffixB,
                "user-b-" + suffixB + "@fbsu.edu.sa",
                "PassB2026!Sec",
                "مستخدم ثان",
                "Second User",
                UserType.STUDENT,
                "0500000002",
                "س ع د",
                "2222",
                "Accord",
                "Black"
        );
        MvcResult regResultB = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regUserB)))
                .andExpect(status().isCreated())
                .andReturn();
        String tokenB = objectMapper.readTree(regResultB.getResponse().getContentAsString()).get("accessToken").asText();

        // 3. User A accesses /api/v1/me
        MvcResult profileResultA = mockMvc.perform(get("/api/v1/me")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user-a-" + suffixA + "@fbsu.edu.sa"))
                .andExpect(jsonPath("$.vehicles").isArray())
                .andExpect(jsonPath("$.vehicles[0].formattedPlateEn").value("A B J 1111"))
                .andExpect(jsonPath("$.vehicles[0].plateDigits").value("1111"))
                .andReturn();

        JsonNode profileAJson = objectMapper.readTree(profileResultA.getResponse().getContentAsString());
        String vehicleA1Id = profileAJson.get("vehicles").get(0).get("id").asText();

        // 4. Anonymous access to /api/v1/me should be 401 Unauthorized
        mockMvc.perform(get("/api/v1/me"))
                .andExpect(status().isUnauthorized());

        // 5. User A updates profile
        UpdateProfileRequest updateReq = new UpdateProfileRequest(
                "مستخدم أول معدل",
                "First User Updated",
                "0599999999",
                "هندسة برمجيات",
                "en",
                "light"
        );
        mockMvc.perform(patch("/api/v1/me")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullNameEn").value("First User Updated"))
                .andExpect(jsonPath("$.phone").value("0599999999"))
                .andExpect(jsonPath("$.theme").value("light"));

        // 6. User A registers second vehicle
        CreateVehicleRequest newVehReq = new CreateVehicleRequest(
                "ط ر ق",
                "3333",
                "Yukon",
                "Silver",
                false
        );
        MvcResult addVehResult = mockMvc.perform(post("/api/v1/vehicles")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newVehReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.formattedPlateEn").value("T R G 3333"))
                .andExpect(jsonPath("$.plateDigits").value("3333"))
                .andReturn();

        String vehicleA2Id = objectMapper.readTree(addVehResult.getResponse().getContentAsString()).get("id").asText();

        // 7. User A lists vehicles (should have 2)
        mockMvc.perform(get("/api/v1/vehicles")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));

        // 8. User A sets vehicle 2 as primary
        mockMvc.perform(patch("/api/v1/vehicles/" + vehicleA2Id + "/primary")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.primary").value(true));

        // 9. IDOR Verification: User B attempts to access User A's vehicle -> 403 Forbidden
        mockMvc.perform(get("/api/v1/vehicles/" + vehicleA1Id)
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden());

        // 10. IDOR Verification: User B attempts to update User A's vehicle -> 403 Forbidden
        UpdateVehicleRequest maliciousUpdate = new UpdateVehicleRequest("Hacked Model", "Red", false);
        mockMvc.perform(put("/api/v1/vehicles/" + vehicleA1Id)
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(maliciousUpdate)))
                .andExpect(status().isForbidden());

        // 11. IDOR Verification: User B attempts to delete User A's vehicle -> 403 Forbidden
        mockMvc.perform(delete("/api/v1/vehicles/" + vehicleA1Id)
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden());

        // 12. User A changes password
        ChangePasswordRequest changePassReq = new ChangePasswordRequest("InitialPass2026!", "BrandNewSecurePass2026!");
        mockMvc.perform(post("/api/v1/me/change-password")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(changePassReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").isNotEmpty());

        // 13. User A logs in with new password
        LoginRequest newLoginReq = new LoginRequest("FBSU", "user-a-" + suffixA + "@fbsu.edu.sa", "BrandNewSecurePass2026!");
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newLoginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty());
    }
}

