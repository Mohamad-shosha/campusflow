package sa.edu.fbsu.campus.parking.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.parking.domain.BookingStatus;
import sa.edu.fbsu.campus.parking.domain.ParkingBooking;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParkingBookingRepository extends JpaRepository<ParkingBooking, UUID> {

    List<ParkingBooking> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<ParkingBooking> findByUserIdAndStatusInOrderByStartTimeDesc(UUID userId, Collection<BookingStatus> statuses);

    Optional<ParkingBooking> findByDigitalPassCode(String digitalPassCode);

    Optional<ParkingBooking> findByQrToken(String qrToken);

    @Query("""
            SELECT COUNT(b) > 0 FROM ParkingBooking b
            WHERE b.spot.id = :spotId
            AND b.status IN ('CONFIRMED', 'ACTIVE')
            AND (
                (b.startTime < :endTime AND b.endTime > :startTime)
            )
            """)
    boolean existsOverlappingActiveBooking(
            @Param("spotId") UUID spotId,
            @Param("startTime") Instant startTime,
            @Param("endTime") Instant endTime
    );

    @Query("""
            SELECT b FROM ParkingBooking b
            JOIN FETCH b.spot s
            JOIN FETCH s.zone z
            LEFT JOIN FETCH b.vehicle v
            WHERE b.id = :bookingId
            """)
    Optional<ParkingBooking> findDetailedById(@Param("bookingId") UUID bookingId);
}

