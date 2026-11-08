package sa.edu.fbsu.campus.common.audit.infra;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.common.audit.domain.AdminAuditLog;

import java.util.List;
import java.util.UUID;

@Repository
public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, UUID> {

    List<AdminAuditLog> findAllByUniversityIdOrderByCreatedAtDesc(UUID universityId, Pageable pageable);

    List<AdminAuditLog> findAllByUniversityIdAndEntityTypeOrderByCreatedAtDesc(
            UUID universityId, String entityType, Pageable pageable);

    List<AdminAuditLog> findAllByUniversityIdAndActionOrderByCreatedAtDesc(
            UUID universityId, String action, Pageable pageable);

    List<AdminAuditLog> findAllByUniversityIdOrderByCreatedAtDesc(UUID universityId);
}

