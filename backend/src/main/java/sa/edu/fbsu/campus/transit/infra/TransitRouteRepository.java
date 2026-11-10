package sa.edu.fbsu.campus.transit.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.transit.domain.TransitRoute;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransitRouteRepository extends JpaRepository<TransitRoute, UUID> {

    @Query("SELECT DISTINCT r FROM TransitRoute r LEFT JOIN FETCH r.stops s WHERE r.universityId = :universityId AND r.status <> sa.edu.fbsu.campus.transit.domain.TransitRouteStatus.INACTIVE ORDER BY r.displayOrder ASC, s.stopOrder ASC")
    List<TransitRoute> findPublicWithStopsByUniversityId(@Param("universityId") UUID universityId);

    @Query("SELECT DISTINCT r FROM TransitRoute r LEFT JOIN FETCH r.stops s WHERE r.universityId = :universityId ORDER BY r.displayOrder ASC, s.stopOrder ASC")
    List<TransitRoute> findAllWithStopsByUniversityId(@Param("universityId") UUID universityId);

    Optional<TransitRoute> findByRouteCode(String routeCode);

    boolean existsByRouteCode(String routeCode);

    List<TransitRoute> findBySource(String source);
}

