package sa.edu.fbsu.campus.transit.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.transit.domain.ShuttleBus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShuttleBusRepository extends JpaRepository<ShuttleBus, UUID> {

    @Query("SELECT b FROM ShuttleBus b " +
           "LEFT JOIN FETCH b.currentRoute r " +
           "LEFT JOIN FETCH b.currentStop cs " +
           "LEFT JOIN FETCH b.nextStop ns " +
           "WHERE b.universityId = :universityId " +
           "ORDER BY b.busNumber ASC")
    List<ShuttleBus> findAllDetailedByUniversityId(@Param("universityId") UUID universityId);

    Optional<ShuttleBus> findByBusNumber(String busNumber);

    List<ShuttleBus> findByCurrentRouteId(UUID routeId);
}

