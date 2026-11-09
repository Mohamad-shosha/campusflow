package sa.edu.fbsu.campus.transit.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.transit.domain.TransitStop;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransitStopRepository extends JpaRepository<TransitStop, UUID> {

    List<TransitStop> findByRouteIdOrderByStopOrderAsc(UUID routeId);
}
