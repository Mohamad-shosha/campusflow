package sa.edu.fbsu.campus.parking.infra;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.parking.domain.GateEventLog;

import java.util.UUID;

@Repository
public interface GateEventLogRepository extends JpaRepository<GateEventLog, UUID> {

    Page<GateEventLog> findByUniversityIdOrderByCreatedAtDesc(UUID universityId, Pageable pageable);
}

