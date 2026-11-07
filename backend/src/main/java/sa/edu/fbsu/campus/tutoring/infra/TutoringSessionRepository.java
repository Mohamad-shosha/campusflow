package sa.edu.fbsu.campus.tutoring.infra;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.tutoring.domain.TutoringSession;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TutoringSessionRepository extends JpaRepository<TutoringSession, UUID> {

    @Query("SELECT s FROM TutoringSession s JOIN FETCH s.tutor WHERE s.universityId = :universityId ORDER BY s.createdAt DESC")
    List<TutoringSession> findAllByUniversityIdWithTutor(@Param("universityId") UUID universityId);

    @Query("SELECT s FROM TutoringSession s JOIN FETCH s.tutor WHERE s.universityId = :universityId AND LOWER(s.category) = LOWER(:category) ORDER BY s.createdAt DESC")
    List<TutoringSession> findAllByUniversityIdAndCategoryWithTutor(
            @Param("universityId") UUID universityId,
            @Param("category") String category
    );

    @Query("SELECT s FROM TutoringSession s JOIN FETCH s.tutor WHERE s.id = :id")
    Optional<TutoringSession> findDetailedById(@Param("id") UUID id);

    @Query("SELECT s FROM TutoringSession s JOIN FETCH s.tutor WHERE s.sessionCode = :sessionCode")
    Optional<TutoringSession> findDetailedBySessionCode(@Param("sessionCode") String sessionCode);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM TutoringSession s JOIN FETCH s.tutor WHERE s.id = :id")
    Optional<TutoringSession> findByIdForUpdate(@Param("id") UUID id);

    boolean existsBySessionCode(String sessionCode);
}

