package sa.edu.fbsu.campus.parking.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.parking.domain.ParkingZone;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParkingZoneRepository extends JpaRepository<ParkingZone, UUID> {

    Optional<ParkingZone> findByUniversityIdAndCode(UUID universityId, String code);

    List<ParkingZone> findAllByUniversityIdOrderByCodeAsc(UUID universityId);

    boolean existsByUniversityIdAndCode(UUID universityId, String code);
}
