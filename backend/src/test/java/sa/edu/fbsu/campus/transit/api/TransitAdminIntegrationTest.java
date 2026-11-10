package sa.edu.fbsu.campus.transit.api;

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
import sa.edu.fbsu.campus.transit.domain.ShuttleBus;
import sa.edu.fbsu.campus.transit.domain.ShuttleStatus;
import sa.edu.fbsu.campus.transit.domain.TransitRoute;
import sa.edu.fbsu.campus.transit.domain.TransitRouteStatus;
import sa.edu.fbsu.campus.transit.dto.CreateShuttleBusRequest;
import sa.edu.fbsu.campus.transit.dto.CreateTransitRouteRequest;
import sa.edu.fbsu.campus.transit.dto.UpdateShuttleBusRequest;
import sa.edu.fbsu.campus.transit.dto.UpdateTransitRouteStatusRequest;
import sa.edu.fbsu.campus.transit.infra.ShuttleBusRepository;
import sa.edu.fbsu.campus.transit.infra.TransitDemoRetirementRunner;
import sa.edu.fbsu.campus.transit.infra.TransitRouteRepository;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@AutoConfigureMockMvc
@ActiveProfiles("dev")
class TransitAdminIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TransitRouteRepository routeRepository;

    @Autowired
    private ShuttleBusRepository shuttleRepository;

    private String login(String email, String password) throws Exception {
        LoginRequest req = new LoginRequest("FBSU", email, password);
        MvcResult res = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode root = objectMapper.readTree(res.getResponse().getContentAsString());
        return root.path("accessToken").asText();
    }

    private String registerStudentToken() throws Exception {
        String suffix = String.valueOf(System.nanoTime() % 1_000_000L);
        RegisterRequest regReq = new RegisterRequest(
                "FBSU",
                "TRSTU-" + suffix,
                "transit-student-" + suffix + "@fbsu.edu.sa",
                "StudentP@ss2026!",
                "طالب نقل تجريبي",
                "Transit Student Test",
                UserType.STUDENT,
                "0511" + String.format("%06d", Math.abs(suffix.hashCode() % 1_000_000)),
                null,
                null,
                null,
                null
        );
        MvcResult res = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readTree(res.getResponse().getContentAsString()).path("accessToken").asText();
    }

    @Test
    @DisplayName("Non-admin user receives 403 Forbidden on /api/v1/admin/transit/**")
    void studentForbiddenOnTransitAdminEndpoints() throws Exception {
        String studentToken = registerStudentToken();

        mockMvc.perform(get("/api/v1/admin/transit/routes")
                        .header("Authorization", "Bearer " + studentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("V16 backfilled DEMO_V15 provenance and admin can create manual route/shuttle and retire via INACTIVE status")
    void adminCrudAndPublicFilteringLifecycle() throws Exception {
        String adminToken = login("admin@fbsu.edu.sa", "FbsuDev2026!");

        // 1. Verify V16 provenance backfill on seeded V15 routes & shuttles
        mockMvc.perform(get("/api/v1/admin/transit/routes")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.routeCode=='ROUTE-EXPRESS')].source", hasItem("DEMO_V15")));

        mockMvc.perform(get("/api/v1/admin/transit/shuttles")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.busNumber=='FBSU-BUS-01')].source", hasItem("DEMO_V15")));

        // 2. Create MANUAL route with initial stop
        String suffix = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        String manualCode = "ROUTE-MAN-" + suffix;
        CreateTransitRouteRequest createRouteReq = new CreateTransitRouteRequest(
                manualCode,
                "مسار المختبرات الجديدة " + suffix,
                "New Labs Shuttle Line " + suffix,
                "#0ea5e9",
                "08:00 ص - 04:00 م",
                "08:00 AM - 04:00 PM",
                12,
                TransitRouteStatus.ACTIVE,
                20,
                List.of(new CreateTransitRouteRequest.CreateStopRequest(
                        "STOP-M-" + suffix,
                        "محطة الابتكار",
                        "Innovation Hub Stop",
                        "أمام مبنى الأبحاث",
                        "Research Annex Entrance",
                        1,
                        0,
                        true,
                        true
                ))
        );

        MvcResult routeRes = mockMvc.perform(post("/api/v1/admin/transit/routes")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRouteReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.routeCode", is(manualCode)))
                .andExpect(jsonPath("$.source", is("MANUAL")))
                .andExpect(jsonPath("$.stops", hasSize(1)))
                .andReturn();

        UUID createdRouteId = UUID.fromString(
                objectMapper.readTree(routeRes.getResponse().getContentAsString()).path("id").asText()
        );

        // 3. Create MANUAL shuttle assigned to the new route
        String busCode = "BUS-M-" + suffix;
        CreateShuttleBusRequest createBusReq = new CreateShuttleBusRequest(
                createdRouteId,
                busCode,
                "ن م ط",
                "7744",
                "BYD K7 Electric",
                24,
                4,
                true,
                "خالد الحربي",
                "Khalid Al-Harbi",
                ShuttleStatus.BOARDING,
                2,
                95
        );

        MvcResult busRes = mockMvc.perform(post("/api/v1/admin/transit/shuttles")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createBusReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.busNumber", is(busCode)))
                .andExpect(jsonPath("$.source", is("MANUAL")))
                .andReturn();

        UUID createdBusId = UUID.fromString(
                objectMapper.readTree(busRes.getResponse().getContentAsString()).path("id").asText()
        );

        // 4. Update shuttle occupancy & ETA, verify public endpoint sees it
        UpdateShuttleBusRequest updateBusReq = new UpdateShuttleBusRequest(
                ShuttleStatus.ARRIVING, null, null, null, 14, 88, 1, null, null, "Arriving at station"
        );
        mockMvc.perform(patch("/api/v1/admin/transit/shuttles/" + createdBusId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateBusReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("ARRIVING")))
                .andExpect(jsonPath("$.occupiedSeats", is(14)))
                .andExpect(jsonPath("$.batteryPercentage", is(88)));

        mockMvc.perform(get("/api/v1/transit/routes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].routeCode", hasItem(manualCode)));

        mockMvc.perform(get("/api/v1/transit/shuttles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].busNumber", hasItem(busCode)));

        // 5. Retire route to INACTIVE -> hidden from public routes AND shuts down bus visibility on public shuttles, but still listed in admin
        UpdateTransitRouteStatusRequest retireReq = new UpdateTransitRouteStatusRequest(
                TransitRouteStatus.INACTIVE,
                "Seasonal retirement"
        );
        mockMvc.perform(patch("/api/v1/admin/transit/routes/" + createdRouteId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(retireReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("INACTIVE")));

        mockMvc.perform(get("/api/v1/transit/routes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].routeCode", not(hasItem(manualCode))));

        mockMvc.perform(get("/api/v1/transit/shuttles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].busNumber", not(hasItem(busCode))));

        mockMvc.perform(get("/api/v1/admin/transit/routes")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[*].routeCode", hasItem(manualCode)));
    }

    @Test
    @DisplayName("ADR-0004 TransitDemoRetirementRunner retires DEMO_V15 rows without deleting passes or touching MANUAL routes")
    void demoRetirementRunnerRetiresDemoWithoutDeletingOrTouchingManual() {
        TransitDemoRetirementRunner runner = new TransitDemoRetirementRunner(routeRepository, shuttleRepository);

        List<TransitRoute> demoRoutesBefore = routeRepository.findBySource(TransitDemoRetirementRunner.DEMO_V15_SOURCE);
        List<ShuttleBus> demoShuttlesBefore = shuttleRepository.findBySource(TransitDemoRetirementRunner.DEMO_V15_SOURCE);
        assertThat(demoRoutesBefore).isNotEmpty();
        assertThat(demoShuttlesBefore).isNotEmpty();

        try {
            runner.retireDemoData();

            List<TransitRoute> retiredRoutes = routeRepository.findBySource(TransitDemoRetirementRunner.DEMO_V15_SOURCE);
            List<ShuttleBus> retiredShuttles = shuttleRepository.findBySource(TransitDemoRetirementRunner.DEMO_V15_SOURCE);

            assertThat(retiredRoutes).allMatch(r -> r.getStatus() == TransitRouteStatus.INACTIVE);
            assertThat(retiredShuttles).allMatch(s -> s.getStatus() == ShuttleStatus.OUT_OF_SERVICE);
        } finally {
            // Re-fetch latest versioned rows before restoring dev/test demo state
            List<TransitRoute> latestRoutes = routeRepository.findBySource(TransitDemoRetirementRunner.DEMO_V15_SOURCE);
            latestRoutes.forEach(r -> r.setStatus(TransitRouteStatus.ACTIVE));
            routeRepository.saveAll(latestRoutes);

            List<ShuttleBus> latestShuttles = shuttleRepository.findBySource(TransitDemoRetirementRunner.DEMO_V15_SOURCE);
            for (ShuttleBus s : latestShuttles) {
                s.setStatus("FBSU-BUS-02".equals(s.getBusNumber()) ? ShuttleStatus.BOARDING : ShuttleStatus.IN_TRANSIT);
            }
            shuttleRepository.saveAll(latestShuttles);
        }
    }
}
