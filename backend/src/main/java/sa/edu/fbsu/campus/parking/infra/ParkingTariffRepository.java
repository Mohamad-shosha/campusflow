package sa.edu.fbsu.campus.parking.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.parking.domain.ParkingTariff;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParkingTariffRepository extends JpaRepository<ParkingTariff, UUID> {

    Optional<ParkingTariff> findByUniversityIdAndUserType(UUID universityId, UserType userType);

    List<ParkingTariff> findAllByUniversityId(UUID universityId);

    boolean existsByUniversityIdAndUserType(UUID universityId, UserType userType);
}

