package sa.edu.fbsu.campus.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.domain.Building;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BuildingRepository extends JpaRepository<Building, UUID> {

    List<Building> findByUniversityId(UUID universityId);

    Optional<Building> findByUniversityIdAndCode(UUID universityId, String code);

    boolean existsByUniversityIdAndCode(UUID universityId, String code);
}

