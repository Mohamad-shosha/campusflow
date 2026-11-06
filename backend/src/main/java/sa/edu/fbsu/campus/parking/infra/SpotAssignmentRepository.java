package sa.edu.fbsu.campus.parking.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.parking.domain.SpotAssignment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpotAssignmentRepository extends JpaRepository<SpotAssignment, UUID> {

    List<SpotAssignment> findAllByUniversityIdAndActiveTrue(UUID universityId);

    Optional<SpotAssignment> findBySpotIdAndActiveTrue(UUID spotId);

    Optional<SpotAssignment> findByUserIdAndActiveTrue(UUID userId);
}
