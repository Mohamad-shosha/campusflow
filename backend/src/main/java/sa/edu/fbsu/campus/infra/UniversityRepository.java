package sa.edu.fbsu.campus.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.domain.University;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UniversityRepository extends JpaRepository<University, UUID> {

    Optional<University> findByCode(String code);

    boolean existsByCode(String code);
}
