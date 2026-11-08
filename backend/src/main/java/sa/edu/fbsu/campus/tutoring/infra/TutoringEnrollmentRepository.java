package sa.edu.fbsu.campus.tutoring.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.tutoring.domain.TutoringEnrollment;
import sa.edu.fbsu.campus.tutoring.domain.TutoringEnrollmentStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TutoringEnrollmentRepository extends JpaRepository<TutoringEnrollment, UUID> {

    @Query("SELECT e FROM TutoringEnrollment e JOIN FETCH e.student WHERE e.session.id = :sessionId AND e.status = :status ORDER BY e.createdAt ASC")
    List<TutoringEnrollment> findBySessionIdAndStatusWithStudent(
            @Param("sessionId") UUID sessionId,
            @Param("status") TutoringEnrollmentStatus status
    );

    @Query("SELECT e FROM TutoringEnrollment e JOIN FETCH e.student JOIN FETCH e.session WHERE e.session.id IN :sessionIds AND e.status = :status ORDER BY e.createdAt ASC")
    List<TutoringEnrollment> findBySessionIdsAndStatusWithStudent(
            @Param("sessionIds") List<UUID> sessionIds,
            @Param("status") TutoringEnrollmentStatus status
    );

    @Query("SELECT e FROM TutoringEnrollment e JOIN FETCH e.session s JOIN FETCH s.tutor WHERE e.student.id = :studentId ORDER BY e.createdAt DESC")
    List<TutoringEnrollment> findByStudentIdWithSession(@Param("studentId") UUID studentId);

    boolean existsBySessionIdAndStudentIdAndStatus(UUID sessionId, UUID studentId, TutoringEnrollmentStatus status);

    long countBySessionIdAndStatus(UUID sessionId, TutoringEnrollmentStatus status);

    Optional<TutoringEnrollment> findByIdempotencyKey(String idempotencyKey);
}

