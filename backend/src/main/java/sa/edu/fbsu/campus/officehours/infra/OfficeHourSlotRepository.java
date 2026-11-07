package sa.edu.fbsu.campus.officehours.infra;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.officehours.domain.OfficeHourSlot;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OfficeHourSlotRepository extends JpaRepository<OfficeHourSlot, UUID> {

    @Query("SELECT s FROM OfficeHourSlot s JOIN FETCH s.profile WHERE s.profile.id IN :profileIds ORDER BY s.startTime ASC")
    List<OfficeHourSlot> findByProfileIdsOrderByStartTimeAsc(@Param("profileIds") List<UUID> profileIds);

    @Query("SELECT s FROM OfficeHourSlot s JOIN FETCH s.profile p JOIN FETCH p.faculty WHERE s.profile.id = :profileId ORDER BY s.startTime ASC")
    List<OfficeHourSlot> findByProfileIdOrderByStartTimeAsc(@Param("profileId") UUID profileId);

    @Query("SELECT s FROM OfficeHourSlot s JOIN FETCH s.profile p JOIN FETCH p.faculty WHERE s.id = :id")
    Optional<OfficeHourSlot> findDetailedById(@Param("id") UUID id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM OfficeHourSlot s JOIN FETCH s.profile p JOIN FETCH p.faculty WHERE s.id = :id")
    Optional<OfficeHourSlot> findByIdForUpdate(@Param("id") UUID id);
}
