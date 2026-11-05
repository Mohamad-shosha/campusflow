package sa.edu.fbsu.campus.identity.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.identity.domain.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUniversityIdAndUniversityNumber(UUID universityId, String universityNumber);

    Optional<User> findByEmail(String email);

    boolean existsByUniversityIdAndUniversityNumber(UUID universityId, String universityNumber);

    boolean existsByEmail(String email);

    List<User> findByUniversityId(UUID universityId);
}
