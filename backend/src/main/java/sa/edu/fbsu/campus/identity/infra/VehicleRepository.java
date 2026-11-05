package sa.edu.fbsu.campus.identity.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.identity.domain.Vehicle;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {

    List<Vehicle> findByUserId(UUID userId);

    List<Vehicle> findByUserIdAndActiveTrue(UUID userId);

    Optional<Vehicle> findByIdAndUserId(UUID id, UUID userId);

    List<Vehicle> findByUniversityId(UUID universityId);

    Optional<Vehicle> findByUniversityIdAndPlateLettersArAndPlateDigits(
            UUID universityId, String plateLettersAr, String plateDigits);

    boolean existsByUniversityIdAndPlateLettersArAndPlateDigits(
            UUID universityId, String plateLettersAr, String plateDigits);
}


