package sa.edu.fbsu.campus.admin.api;

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
import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.UserStatus;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.dto.LoginRequest;
import sa.edu.fbsu.campus.identity.dto.RegisterRequest;
import sa.edu.fbsu.campus.identity.dto.UpdateUserRolesRequest;
import sa.edu.fbsu.campus.identity.dto.UpdateUserStatusRequest;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;
import sa.edu.fbsu.campus.parking.domain.SpotType;
import sa.edu.fbsu.campus.parking.dto.UpdateSpotStatusRequest;
import sa.edu.fbsu.campus.parking.dto.UpdateSpotTypeRequest;
import sa.edu.fbsu.campus.parking.dto.UpdateTariffRequest;
import sa.edu.fbsu.campus.rooms.domain.RoomStatus;
import sa.edu.fbsu.campus.rooms.dto.CreateRoomRequest;
import sa.edu.fbsu.campus.rooms.dto.UpdateRoomRequest;
import sa.edu.fbsu.campus.rooms.dto.UpdateRoomStatusRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles("dev")
class AdminApiIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UniversityRepository universityRepository;

    private String getAdminToken() throws Exception {
        LoginRequest req = new LoginRequest("FBSU", "admin@fbsu.edu.sa", "FbsuDev2026!");
        MvcResult res = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode root = objectMapper.readTree(res.getResponse().getContentAsString());
        return root.path("accessToken").asText();
    }

    private String getStudentToken(String suffix) throws Exception {
        if (!universityRepository.existsByCode("FBSU")) {
            universityRepository.save(new University("FBSU", "جامعة فهد بن سلطان", "Fahad Bin Sultan University"));
        }

        RegisterRequest regReq = new RegisterRequest(
                "FBSU",
                "STU-" + suffix,
                "student-" + suffix + "@fbsu.edu.sa",
                "StudentP@ss2026!",
                "طالب جامعي تجريبي",
                "Demo University Student",
                UserType.STUDENT,
                "0512" + suffix.substring(Math.max(0, suffix.length() - 6)),
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

        JsonNode root = objectMapper.readTree(res.getResponse().getContentAsString());
        return root.path("accessToken").asText();
    }

    // =========================================================================
    // 1. Security Matrix: Non-Admin users strictly receive 403 Forbidden
    // =========================================================================

    @Test
    @DisplayName("Security Matrix: Non-admin student is forbidden (403) from accessing admin endpoints")
    void testSecurityMatrix_StudentForbiddenFromAllAdminEndpoints() throws Exception {
        String studentToken = getStudentToken(UUID.randomUUID().toString().substring(0, 8));

        // Parking spots
        mockMvc.perform(get("/api/v1/admin/parking/spots")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());

        // Tariffs
        mockMvc.perform(get("/api/v1/admin/parking/tariffs")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());

        // Rooms
        mockMvc.perform(get("/api/v1/admin/rooms")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());

        // Users
        mockMvc.perform(get("/api/v1/admin/users")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());

        // Audit logs
        mockMvc.perform(get("/api/v1/admin/audit-logs")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Security Matrix: Unauthenticated requests are rejected (401 or 403)")
    void testSecurityMatrix_UnauthenticatedRejected() throws Exception {
        mockMvc.perform(get("/api/v1/admin/parking/spots"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/admin/rooms"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/admin/users"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/admin/audit-logs"))
                .andExpect(status().isUnauthorized());
    }

    // =========================================================================
    // 2. Parking Spots & Tariffs Admin API (P7-04)
    // =========================================================================

    @Test
    @DisplayName("Admin: Lists all spots, modifies spot status to MAINTENANCE, and updates tariff")
    void testParkingAdmin_SpotsAndTariffsOperations() throws Exception {
        String adminToken = getAdminToken();

        // 1. List spots
        MvcResult spotsRes = mockMvc.perform(get("/api/v1/admin/parking/spots")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andReturn();

        JsonNode spotsArr = objectMapper.readTree(spotsRes.getResponse().getContentAsString());
        String spotId = spotsArr.get(0).get("id").asText();

        // 2. Update spot status to MAINTENANCE
        UpdateSpotStatusRequest statusReq = new UpdateSpotStatusRequest(
                SpotStatus.MAINTENANCE,
                "صيانة الدوائر الذكية وأجهزة الاستشعار"
        );

        mockMvc.perform(patch("/api/v1/admin/parking/spots/" + spotId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(spotId))
                .andExpect(jsonPath("$.status").value("MAINTENANCE"));

        // 3. Update spot type
        UpdateSpotTypeRequest typeReq = new UpdateSpotTypeRequest(SpotType.EV_CHARGING, true);
        mockMvc.perform(patch("/api/v1/admin/parking/spots/" + spotId + "/type")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(typeReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.spotType").value("EV_CHARGING"))
                .andExpect(jsonPath("$.flexEligible").value(true));

        // 4. List tariffs
        mockMvc.perform(get("/api/v1/admin/parking/tariffs")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));

        // 5. Update tariff for STUDENT
        UpdateTariffRequest tariffReq = new UpdateTariffRequest(
                new BigDecimal("6.50"),
                new BigDecimal("30.00"),
                new BigDecimal("6.50")
        );

        mockMvc.perform(put("/api/v1/admin/parking/tariffs/STUDENT")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tariffReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userType").value("STUDENT"))
                .andExpect(jsonPath("$.hourlyRate").value(6.50));
    }

    // =========================================================================
    // 3. Rooms Admin API (P7-04)
    // =========================================================================

    @Test
    @DisplayName("Admin: Lists rooms, creates a new study room, and updates its status")
    void testRoomsAdmin_CreateAndManageStudyRoom() throws Exception {
        String adminToken = getAdminToken();

        // 1. List rooms
        mockMvc.perform(get("/api/v1/admin/rooms")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))));

        // 2. Create room
        String uniqueCode = "ADM-RM-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        CreateRoomRequest createReq = new CreateRoomRequest(
                uniqueCode,
                "مختبر الابتكار والذكاء الاصطناعي",
                "Innovation & AI Research Lab",
                "مبنى كلية الهندسة والحاسب",
                "College of Computing & Engineering",
                "10 مقاعد بحثية",
                "10 Research Workstations",
                "مختبر متقدم",
                "Advanced Lab",
                List.of("شاشات 4K", "محطات عمل GPU"),
                List.of("4K Displays", "GPU Workstations"),
                "08:00 صباحاً",
                "08:00 AM",
                RoomStatus.AVAILABLE,
                99
        );

        MvcResult createRes = mockMvc.perform(post("/api/v1/admin/rooms")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.roomCode").value(uniqueCode))
                .andExpect(jsonPath("$.status").value("AVAILABLE"))
                .andReturn();

        JsonNode createdNode = objectMapper.readTree(createRes.getResponse().getContentAsString());
        String createdRoomId = createdNode.get("id").asText();

        // 3. Update room status to MAINTENANCE
        UpdateRoomStatusRequest statusReq = new UpdateRoomStatusRequest(
                RoomStatus.MAINTENANCE,
                "تحديث عتاد السيرفرات والأجهزة"
        );

        mockMvc.perform(patch("/api/v1/admin/rooms/" + createdRoomId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(createdRoomId))
                .andExpect(jsonPath("$.status").value("MAINTENANCE"));

        // 4. Update room details
        UpdateRoomRequest updateReq = new UpdateRoomRequest(
                "مختبر الابتكار المطور",
                "Enhanced Innovation Lab",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                RoomStatus.AVAILABLE,
                100
        );

        mockMvc.perform(patch("/api/v1/admin/rooms/" + createdRoomId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nameAr").value("مختبر الابتكار المطور"))
                .andExpect(jsonPath("$.status").value("AVAILABLE"));
    }

    // =========================================================================
    // 4. Users Admin API (P7-04)
    // =========================================================================

    @Test
    @DisplayName("Admin: Searches users, updates status to SUSPENDED, and updates roles")
    void testUserAdmin_ManageUsersAndRoles() throws Exception {
        String adminToken = getAdminToken();

        // 1. Register a student to manipulate
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        getStudentToken(suffix);

        // 2. Search users
        MvcResult usersRes = mockMvc.perform(get("/api/v1/admin/users")
                        .param("search", "student-" + suffix)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andReturn();

        JsonNode userNode = objectMapper.readTree(usersRes.getResponse().getContentAsString()).get(0);
        String targetUserId = userNode.get("id").asText();

        // 3. Update status to SUSPENDED
        UpdateUserStatusRequest statusReq = new UpdateUserStatusRequest(
                UserStatus.SUSPENDED,
                "إيقاف مؤقت لأغراض التدقيق التجريبي"
        );

        mockMvc.perform(patch("/api/v1/admin/users/" + targetUserId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(targetUserId))
                .andExpect(jsonPath("$.status").value("SUSPENDED"));

        // 4. Update roles (grant FACULTY role in addition to STUDENT)
        UpdateUserRolesRequest rolesReq = new UpdateUserRolesRequest(Set.of(Role.STUDENT, Role.FACULTY));

        mockMvc.perform(patch("/api/v1/admin/users/" + targetUserId + "/roles")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rolesReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(targetUserId))
                .andExpect(jsonPath("$.roles", hasItems("STUDENT", "FACULTY")));

        // 5. Admin cannot suspend self
        LoginRequest req = new LoginRequest("FBSU", "admin@fbsu.edu.sa", "FbsuDev2026!");
        MvcResult loginRes = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();
        String adminUserId = objectMapper.readTree(loginRes.getResponse().getContentAsString()).get("userId").asText();

        mockMvc.perform(patch("/api/v1/admin/users/" + adminUserId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusReq)))
                .andExpect(status().isBadRequest());
    }

    // =========================================================================
    // 5. Audit Logging Verification (P7-04)
    // =========================================================================

    @Test
    @DisplayName("Admin: Verifies audit logs record all admin operations")
    void testAdminAuditLogs_RecordsOperations() throws Exception {
        String adminToken = getAdminToken();

        MvcResult auditRes = mockMvc.perform(get("/api/v1/admin/audit-logs")
                        .param("limit", "50")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andReturn();

        JsonNode logsArr = objectMapper.readTree(auditRes.getResponse().getContentAsString());
        assertThat(logsArr.size()).isGreaterThanOrEqualTo(1);

        JsonNode firstLog = logsArr.get(0);
        assertThat(firstLog.has("actorEmail")).isTrue();
        assertThat(firstLog.has("action")).isTrue();
        assertThat(firstLog.has("entityType")).isTrue();
        assertThat(firstLog.has("descriptionAr")).isTrue();
        assertThat(firstLog.has("descriptionEn")).isTrue();
    }
}
