package sa.edu.fbsu.campus.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.domain.College;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CollegeRepository extends JpaRepository<College, UUID> {

    List<College> findByUniversityId(UUID universityId);

    Optional<College> findByUniversityIdAndCode(UUID universityId, String code);

    boolean existsByUniversityIdAndCode(UUID universityId, String code);
}

