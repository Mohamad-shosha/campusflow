package sa.edu.fbsu.campus.tutoring.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.tutoring.domain.TutoringReview;

import java.util.List;
import java.util.UUID;

@Repository
public interface TutoringReviewRepository extends JpaRepository<TutoringReview, UUID> {

    boolean existsBySessionIdAndStudentId(UUID sessionId, UUID studentId);

    @Query("SELECT r.session.id, AVG(r.rating), COUNT(r) FROM TutoringReview r WHERE r.session.id IN :sessionIds GROUP BY r.session.id")
    List<Object[]> findRatingStatsBySessionIds(@Param("sessionIds") List<UUID> sessionIds);
}

