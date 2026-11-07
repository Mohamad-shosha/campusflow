package sa.edu.fbsu.campus.officehours.infra;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.officehours.domain.OfficeHourAppointment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OfficeHourAppointmentRepository extends JpaRepository<OfficeHourAppointment, UUID> {

    @Query("SELECT a FROM OfficeHourAppointment a JOIN FETCH a.profile p JOIN FETCH p.faculty JOIN FETCH a.slot JOIN FETCH a.student WHERE a.student.id = :userId OR p.faculty.id = :userId ORDER BY a.createdAt DESC")
    List<OfficeHourAppointment> findAllForUser(@Param("userId") UUID userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM OfficeHourAppointment a JOIN FETCH a.profile p JOIN FETCH p.faculty JOIN FETCH a.slot JOIN FETCH a.student WHERE a.id = :id")
    Optional<OfficeHourAppointment> findDetailedByIdForUpdate(@Param("id") UUID id);
}
