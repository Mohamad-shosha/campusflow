package sa.edu.fbsu.campus.notifications.api;

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
import sa.edu.fbsu.campus.identity.dto.LoginRequest;

import java.util.Objects;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@ActiveProfiles("dev")
class NotificationControllerIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest req = new LoginRequest("FBSU", email, password);
        MvcResult res = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                        .content(Objects.requireNonNull(objectMapper.writeValueAsString(req))))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(res.getResponse().getContentAsString()).get("accessToken").asText();
    }

    @Test
    @DisplayName("Unauthenticated requests to notifications endpoints must return 401 Unauthorized")
    void shouldRejectUnauthenticatedAccess() throws Exception {
        mockMvc.perform(get("/api/v1/notifications/my"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/v1/notifications/unread-count"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(patch("/api/v1/notifications/" + UUID.randomUUID() + "/read"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/v1/notifications/mark-all-read"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Authenticated user can view their seeded notifications and unread count")
    void shouldRetrieveSeededNotificationsAndUnreadCount() throws Exception {
        String eyadToken = loginAndGetToken("eyad.harbi@fbsu.edu.sa", "FbsuDev2026!");

        MvcResult listRes = mockMvc.perform(get("/api/v1/notifications/my")
                        .header("Authorization", "Bearer " + eyadToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()", greaterThanOrEqualTo(1)))
                .andReturn();

        JsonNode notifications = objectMapper.readTree(listRes.getResponse().getContentAsString());
        assertThat(notifications.isArray()).isTrue();
        assertThat(notifications.size()).isGreaterThanOrEqualTo(1);

        mockMvc.perform(get("/api/v1/notifications/unread-count")
                        .header("Authorization", "Bearer " + eyadToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unreadCount", greaterThanOrEqualTo(1)));
    }

    @Test
    @DisplayName("Marking a single notification as read marks it read and decrements unread count")
    void shouldMarkNotificationAsRead() throws Exception {
        String eyadToken = loginAndGetToken("eyad.harbi@fbsu.edu.sa", "FbsuDev2026!");

        MvcResult listRes = mockMvc.perform(get("/api/v1/notifications/my")
                        .header("Authorization", "Bearer " + eyadToken))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode notifications = objectMapper.readTree(listRes.getResponse().getContentAsString());
        String notificationId = notifications.get(0).get("id").asText();

        MvcResult patchRes = mockMvc.perform(patch("/api/v1/notifications/" + notificationId + "/read")
                        .header("Authorization", "Bearer " + eyadToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.read").value(true))
                .andExpect(jsonPath("$.readAt").isNotEmpty())
                .andReturn();

        JsonNode updated = objectMapper.readTree(patchRes.getResponse().getContentAsString());
        assertThat(updated.get("read").asBoolean()).isTrue();
    }

    @Test
    @DisplayName("Marking all notifications as read resets unread count to zero")
    void shouldMarkAllNotificationsAsRead() throws Exception {
        String rakanToken = loginAndGetToken("rakan.mutairi@fbsu.edu.sa", "FbsuDev2026!");

        mockMvc.perform(post("/api/v1/notifications/mark-all-read")
                        .header("Authorization", "Bearer " + rakanToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        mockMvc.perform(get("/api/v1/notifications/unread-count")
                        .header("Authorization", "Bearer " + rakanToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unreadCount").value(0));
    }

    @Test
    @DisplayName("A user cannot mark another user's notification as read (returns 404)")
    void shouldPreventCrossUserAccess() throws Exception {
        String eyadToken = loginAndGetToken("eyad.harbi@fbsu.edu.sa", "FbsuDev2026!");
        String rakanToken = loginAndGetToken("rakan.mutairi@fbsu.edu.sa", "FbsuDev2026!");

        MvcResult listRes = mockMvc.perform(get("/api/v1/notifications/my")
                        .header("Authorization", "Bearer " + eyadToken))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode eyadNotifications = objectMapper.readTree(listRes.getResponse().getContentAsString());
        String eyadNotificationId = eyadNotifications.get(0).get("id").asText();

        // Rakan attempts to mark Eyad's notification as read
        mockMvc.perform(patch("/api/v1/notifications/" + eyadNotificationId + "/read")
                        .header("Authorization", "Bearer " + rakanToken))
                .andExpect(status().isNotFound());
    }
}
