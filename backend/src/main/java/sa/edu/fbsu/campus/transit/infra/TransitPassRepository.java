package sa.edu.fbsu.campus.transit.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.transit.domain.TransitPass;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransitPassRepository extends JpaRepository<TransitPass, UUID> {

    @Query("SELECT p FROM TransitPass p " +
           "JOIN FETCH p.route r " +
           "LEFT JOIN FETCH p.shuttle s " +
           "JOIN FETCH p.pickupStop ps " +
           "JOIN FETCH p.dropoffStop ds " +
           "WHERE p.user.id = :userId " +
           "ORDER BY p.createdAt DESC")
    List<TransitPass> findByUserIdDetailed(@Param("userId") UUID userId);

    Optional<TransitPass> findByPassCode(String passCode);
}
