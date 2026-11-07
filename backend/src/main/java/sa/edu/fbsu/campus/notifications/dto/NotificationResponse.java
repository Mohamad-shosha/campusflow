package sa.edu.fbsu.campus.notifications.dto;

import sa.edu.fbsu.campus.notifications.domain.CampusNotification;
import sa.edu.fbsu.campus.notifications.domain.NotificationType;

import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        String senderNameAr,
        String senderNameEn,
        String titleAr,
        String titleEn,
        String messageAr,
        String messageEn,
        NotificationType type,
        String badgeAr,
        String badgeEn,
        String targetRoute,
        boolean read,
        Instant readAt,
        Instant createdAt
) {
    public static NotificationResponse from(CampusNotification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getSenderNameAr(),
                notification.getSenderNameEn(),
                notification.getTitleAr(),
                notification.getTitleEn(),
                notification.getMessageAr(),
                notification.getMessageEn(),
                notification.getType(),
                notification.getBadgeAr(),
                notification.getBadgeEn(),
                notification.getTargetRoute(),
                notification.isRead(),
                notification.getReadAt(),
                notification.getCreatedAt()
        );
    }
}
