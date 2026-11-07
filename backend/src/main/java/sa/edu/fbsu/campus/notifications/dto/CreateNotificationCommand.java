package sa.edu.fbsu.campus.notifications.dto;

import sa.edu.fbsu.campus.notifications.domain.NotificationType;

import java.util.UUID;

public record CreateNotificationCommand(
        UUID recipientUserId,
        UUID universityId,
        String senderNameAr,
        String senderNameEn,
        String titleAr,
        String titleEn,
        String messageAr,
        String messageEn,
        NotificationType type,
        String badgeAr,
        String badgeEn,
        String targetRoute
) {
}
