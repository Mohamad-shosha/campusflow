package sa.edu.fbsu.campus.parking.infra;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.parking.domain.ParkingSpot;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ParkingSpot s JOIN FETCH s.zone z WHERE s.id = :spotId")
    Optional<ParkingSpot> findByIdForUpdate(@Param("spotId") UUID spotId);

    Optional<ParkingSpot> findByUniversityIdAndBayNumber(UUID universityId, int bayNumber);

    List<ParkingSpot> findAllByUniversityIdOrderByBayNumberAsc(UUID universityId);

    @Query("SELECT s FROM ParkingSpot s JOIN FETCH s.zone z WHERE s.universityId = :universityId ORDER BY s.bayNumber ASC")
    List<ParkingSpot> findAllWithZoneByUniversityId(@Param("universityId") UUID universityId);

    @Query("SELECT s FROM ParkingSpot s JOIN FETCH s.zone z WHERE s.universityId = :universityId AND z.code = :zoneCode ORDER BY s.bayNumber ASC")
    List<ParkingSpot> findAllWithZoneByUniversityIdAndZoneCode(
            @Param("universityId") UUID universityId,
            @Param("zoneCode") String zoneCode);

    List<ParkingSpot> findAllByUniversityIdAndStatusOrderByBayNumberAsc(UUID universityId, SpotStatus status);

    boolean existsByUniversityIdAndBayNumber(UUID universityId, int bayNumber);

    long countByUniversityIdAndStatus(UUID universityId, SpotStatus status);
}
