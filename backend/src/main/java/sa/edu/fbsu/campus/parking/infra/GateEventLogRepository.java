package sa.edu.fbsu.campus.parking.infra;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.parking.domain.GateEventLog;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface GateEventLogRepository extends JpaRepository<GateEventLog, UUID> {

    Page<GateEventLog> findByUniversityIdOrderByCreatedAtDesc(UUID universityId, Pageable pageable);

    Page<GateEventLog> findByUniversityIdAndDecisionOrderByCreatedAtDesc(
            UUID universityId, String decision, Pageable pageable);

    long countByUniversityIdAndDecision(UUID universityId, String decision);

    /** Timestamps of gate events with the given decision since {@code since}, for hourly aggregation. */
    @Query("""
            SELECT g.createdAt FROM GateEventLog g
            WHERE g.universityId = :universityId
              AND g.decision = :decision
              AND g.createdAt >= :since
            """)
    List<Instant> findEventTimesSince(
            @Param("universityId") UUID universityId,
            @Param("decision") String decision,
            @Param("since") Instant since);
}
