package sa.edu.fbsu.campus.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.domain.AcademicTerm;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AcademicTermRepository extends JpaRepository<AcademicTerm, UUID> {

    List<AcademicTerm> findByUniversityId(UUID universityId);

    Optional<AcademicTerm> findByUniversityIdAndCode(UUID universityId, String code);

    Optional<AcademicTerm> findByUniversityIdAndCurrentTrue(UUID universityId);

    boolean existsByUniversityIdAndCode(UUID universityId, String code);
}

