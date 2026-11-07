package sa.edu.fbsu.campus.notifications.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.notifications.application.NotificationService;
import sa.edu.fbsu.campus.notifications.dto.NotificationResponse;
import sa.edu.fbsu.campus.notifications.dto.UnreadCountResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@Tag(name = "Campus Notifications", description = "Endpoints for in-app student and staff notifications, unread counters, and status updates")
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/my")
    @Operation(summary = "Retrieve all notifications for the authenticated user ordered by time")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(notificationService.getMyNotifications(principal.getUserId()));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get count of unread notifications for the authenticated user")
    public ResponseEntity<UnreadCountResponse> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(notificationService.getUnreadCount(principal.getUserId()));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a specific notification as read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(notificationService.markAsRead(principal.getUserId(), id));
    }

    @PostMapping("/mark-all-read")
    @Operation(summary = "Mark all unread notifications for the authenticated user as read")
    public ResponseEntity<Map<String, Object>> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        int count = notificationService.markAllAsRead(principal.getUserId());
        return ResponseEntity.ok(Map.of(
                "success", true,
                "markedCount", count,
                "message", "All notifications marked as read"
        ));
    }
}
