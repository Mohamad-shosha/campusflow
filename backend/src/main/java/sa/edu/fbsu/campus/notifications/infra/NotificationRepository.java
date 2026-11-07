package sa.edu.fbsu.campus.notifications.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.notifications.domain.CampusNotification;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<CampusNotification, UUID> {

    @Query("SELECT n FROM CampusNotification n WHERE n.recipient.id = :recipientId ORDER BY n.createdAt DESC")
    List<CampusNotification> findAllByRecipientIdOrderByCreatedAtDesc(@Param("recipientId") UUID recipientId);

    @Query("SELECT COUNT(n) FROM CampusNotification n WHERE n.recipient.id = :recipientId AND n.read = false")
    long countUnreadByRecipientId(@Param("recipientId") UUID recipientId);

    @Query("SELECT n FROM CampusNotification n WHERE n.id = :id AND n.recipient.id = :recipientId")
    Optional<CampusNotification> findByIdAndRecipientId(@Param("id") UUID id, @Param("recipientId") UUID recipientId);

    @Modifying
    @Transactional
    @Query("UPDATE CampusNotification n SET n.read = true, n.readAt = :now, n.updatedAt = :now WHERE n.recipient.id = :recipientId AND n.read = false")
    int markAllAsReadForRecipient(@Param("recipientId") UUID recipientId, @Param("now") Instant now);
}
