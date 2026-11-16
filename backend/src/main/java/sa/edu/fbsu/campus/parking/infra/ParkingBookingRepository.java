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

    @Query("""
            SELECT b FROM ParkingBooking b
            JOIN FETCH b.spot s
            JOIN FETCH s.zone z
            LEFT JOIN FETCH b.vehicle v
            WHERE b.user.id = :userId
            ORDER BY b.createdAt DESC
            """)
    List<ParkingBooking> findByUserIdOrderByCreatedAtDesc(@Param("userId") UUID userId);

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
            JOIN FETCH b.user u
            JOIN FETCH b.spot s
            JOIN FETCH s.zone z
            LEFT JOIN FETCH b.vehicle v
            WHERE b.id = :bookingId
            """)
    Optional<ParkingBooking> findDetailedById(@Param("bookingId") UUID bookingId);

    /** Bookings whose window has ended but are still CONFIRMED/ACTIVE (lifecycle expiry). */
    List<ParkingBooking> findByStatusInAndEndTimeBefore(Collection<BookingStatus> statuses, Instant cutoff);

    boolean existsBySpotIdAndStatusInAndEndTimeAfter(UUID spotId, Collection<BookingStatus> statuses, Instant cutoff);

    boolean existsBySpotId(UUID spotId);

    /** The user's bookings that are still live (not ended), with spot and zone loaded. */
    @Query("""
            SELECT b FROM ParkingBooking b
            JOIN FETCH b.spot s
            JOIN FETCH s.zone z
            WHERE b.user.id = :userId
            AND b.status IN :statuses
            AND b.endTime > :now
            ORDER BY b.startTime ASC
            """)
    List<ParkingBooking> findLiveByUserId(
            @Param("userId") UUID userId,
            @Param("statuses") Collection<BookingStatus> statuses,
            @Param("now") Instant now
    );

    /** The earliest live booking on a bay (the one that currently owns it). */
    Optional<ParkingBooking> findFirstBySpotIdAndStatusInAndEndTimeAfterOrderByStartTimeAsc(
            UUID spotId, Collection<BookingStatus> statuses, Instant cutoff);
}
