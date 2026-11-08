package sa.edu.fbsu.campus.notifications.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.notifications.domain.CampusNotification;
import sa.edu.fbsu.campus.notifications.dto.CreateNotificationCommand;
import sa.edu.fbsu.campus.notifications.dto.NotificationResponse;
import sa.edu.fbsu.campus.notifications.dto.UnreadCountResponse;
import sa.edu.fbsu.campus.notifications.infra.NotificationRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public List<NotificationResponse> getMyNotifications(UUID recipientId) {
        return notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(recipientId)
                .stream()
                .map(NotificationResponse::from)
                .toList();
    }

    public UnreadCountResponse getUnreadCount(UUID recipientId) {
        long count = notificationRepository.countUnreadByRecipientId(recipientId);
        return new UnreadCountResponse(count);
    }

    @Transactional
    public NotificationResponse markAsRead(UUID recipientId, UUID notificationId) {
        CampusNotification notification = notificationRepository.findByIdAndRecipientId(notificationId, recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found or access denied: " + notificationId));

        if (!notification.isRead()) {
            notification.markAsRead();
            notification = notificationRepository.save(notification);
            log.debug("Marked notification {} as read for user {}", notificationId, recipientId);
        }

        return NotificationResponse.from(notification);
    }

    @Transactional
    public int markAllAsRead(UUID recipientId) {
        int count = notificationRepository.markAllAsReadForRecipient(recipientId, Instant.now());
        log.debug("Marked {} notifications as read for user {}", count, recipientId);
        return count;
    }

    @Transactional
    public NotificationResponse createNotification(CreateNotificationCommand cmd) {
        User recipient = userRepository.findById(cmd.recipientUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient user not found: " + cmd.recipientUserId()));

        UUID universityId = cmd.universityId() != null ? cmd.universityId() : recipient.getUniversityId();

        CampusNotification notification = new CampusNotification(
                recipient,
                cmd.senderNameAr(),
                cmd.senderNameEn(),
                cmd.titleAr(),
                cmd.titleEn(),
                cmd.messageAr(),
                cmd.messageEn(),
                cmd.type(),
                cmd.badgeAr(),
                cmd.badgeEn(),
                cmd.targetRoute()
        );
        notification.setUniversityId(universityId);

        CampusNotification saved = notificationRepository.save(notification);
        log.info("Created notification {} of type {} for user {}", saved.getId(), saved.getType(), recipient.getId());
        return NotificationResponse.from(saved);
    }
}

