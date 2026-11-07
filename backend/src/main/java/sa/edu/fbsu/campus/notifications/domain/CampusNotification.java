package sa.edu.fbsu.campus.notifications.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;
import sa.edu.fbsu.campus.identity.domain.User;

import java.time.Instant;

@Entity
@Table(name = "campus_notification")
public class CampusNotification extends BaseTenantEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id", nullable = false)
    private User recipient;

    @Column(name = "sender_name_ar", length = 140)
    private String senderNameAr;

    @Column(name = "sender_name_en", length = 140)
    private String senderNameEn;

    @Column(name = "title_ar", nullable = false, length = 200)
    private String titleAr;

    @Column(name = "title_en", nullable = false, length = 200)
    private String titleEn;

    @Column(name = "message_ar", nullable = false, length = 1000)
    private String messageAr;

    @Column(name = "message_en", nullable = false, length = 1000)
    private String messageEn;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 40)
    private NotificationType type = NotificationType.SYSTEM;

    @Column(name = "badge_ar", length = 60)
    private String badgeAr;

    @Column(name = "badge_en", length = 60)
    private String badgeEn;

    @Column(name = "target_route", length = 200)
    private String targetRoute;

    @Column(name = "read", nullable = false)
    private boolean read = false;

    @Column(name = "read_at")
    private Instant readAt;

    public CampusNotification() {
    }

    public CampusNotification(User recipient,
                              String senderNameAr,
                              String senderNameEn,
                              String titleAr,
                              String titleEn,
                              String messageAr,
                              String messageEn,
                              NotificationType type,
                              String badgeAr,
                              String badgeEn,
                              String targetRoute) {
        this.recipient = recipient;
        this.senderNameAr = senderNameAr;
        this.senderNameEn = senderNameEn;
        this.titleAr = titleAr;
        this.titleEn = titleEn;
        this.messageAr = messageAr;
        this.messageEn = messageEn;
        this.type = type != null ? type : NotificationType.SYSTEM;
        this.badgeAr = badgeAr;
        this.badgeEn = badgeEn;
        this.targetRoute = targetRoute;
        this.read = false;
        this.readAt = null;
    }

    public void markAsRead() {
        this.read = true;
        this.readAt = Instant.now();
    }

    public User getRecipient() {
        return recipient;
    }

    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }

    public String getSenderNameAr() {
        return senderNameAr;
    }

    public void setSenderNameAr(String senderNameAr) {
        this.senderNameAr = senderNameAr;
    }

    public String getSenderNameEn() {
        return senderNameEn;
    }

    public void setSenderNameEn(String senderNameEn) {
        this.senderNameEn = senderNameEn;
    }

    public String getTitleAr() {
        return titleAr;
    }

    public void setTitleAr(String titleAr) {
        this.titleAr = titleAr;
    }

    public String getTitleEn() {
        return titleEn;
    }

    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }

    public String getMessageAr() {
        return messageAr;
    }

    public void setMessageAr(String messageAr) {
        this.messageAr = messageAr;
    }

    public String getMessageEn() {
        return messageEn;
    }

    public void setMessageEn(String messageEn) {
        this.messageEn = messageEn;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getBadgeAr() {
        return badgeAr;
    }

    public void setBadgeAr(String badgeAr) {
        this.badgeAr = badgeAr;
    }

    public String getBadgeEn() {
        return badgeEn;
    }

    public void setBadgeEn(String badgeEn) {
        this.badgeEn = badgeEn;
    }

    public String getTargetRoute() {
        return targetRoute;
    }

    public void setTargetRoute(String targetRoute) {
        this.targetRoute = targetRoute;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public Instant getReadAt() {
        return readAt;
    }

    public void setReadAt(Instant readAt) {
        this.readAt = readAt;
    }
}
