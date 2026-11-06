package sa.edu.fbsu.campus.parking.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.parking.domain.FlexOffer;
import sa.edu.fbsu.campus.parking.domain.FlexOfferStatus;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FlexOfferRepository extends JpaRepository<FlexOffer, UUID> {

    @Query("""
            SELECT o FROM FlexOffer o
            JOIN FETCH o.spot s
            JOIN FETCH s.zone z
            JOIN FETCH o.offerer u
            WHERE o.universityId = :universityId
            AND o.status = :status
            ORDER BY o.startTime ASC
            """)
    List<FlexOffer> findByUniversityIdAndStatus(
            @Param("universityId") UUID universityId,
            @Param("status") FlexOfferStatus status
    );

    @Query("""
            SELECT o FROM FlexOffer o
            JOIN FETCH o.spot s
            JOIN FETCH s.zone z
            WHERE o.offerer.id = :offererId
            ORDER BY o.createdAt DESC
            """)
    List<FlexOffer> findByOffererId(@Param("offererId") UUID offererId);

    @Query("""
            SELECT o FROM FlexOffer o
            JOIN FETCH o.spot s
            JOIN FETCH s.zone z
            WHERE o.claimer.id = :claimerId
            ORDER BY o.createdAt DESC
            """)
    List<FlexOffer> findByClaimerId(@Param("claimerId") UUID claimerId);

    @Query("""
            SELECT COUNT(o) > 0 FROM FlexOffer o
            WHERE o.spot.id = :spotId
            AND o.status IN :statuses
            """)
    boolean existsBySpotIdAndStatusIn(
            @Param("spotId") UUID spotId,
            @Param("statuses") Collection<FlexOfferStatus> statuses
    );

    @Query("""
            SELECT o FROM FlexOffer o
            JOIN FETCH o.spot s
            JOIN FETCH s.zone z
            JOIN FETCH o.offerer u
            LEFT JOIN FETCH o.claimer c
            WHERE o.id = :offerId
            """)
    Optional<FlexOffer> findDetailedById(@Param("offerId") UUID offerId);
}

