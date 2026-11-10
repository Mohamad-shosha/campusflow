package sa.edu.fbsu.campus.rooms.infra;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.rooms.domain.RoomBooking;
import sa.edu.fbsu.campus.rooms.domain.RoomBookingStatus;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoomBookingRepository extends JpaRepository<RoomBooking, UUID> {

    @Query("SELECT b FROM RoomBooking b JOIN FETCH b.room JOIN FETCH b.leader WHERE b.room.id IN :roomIds AND b.status IN (sa.edu.fbsu.campus.rooms.domain.RoomBookingStatus.ACTIVE, sa.edu.fbsu.campus.rooms.domain.RoomBookingStatus.RESERVED) ORDER BY b.startTime ASC")
    List<RoomBooking> findActiveOrReservedByRoomIds(@Param("roomIds") List<UUID> roomIds);

    @Query("SELECT b FROM RoomBooking b JOIN FETCH b.room JOIN FETCH b.leader WHERE b.room.id = :roomId AND b.status IN (sa.edu.fbsu.campus.rooms.domain.RoomBookingStatus.ACTIVE, sa.edu.fbsu.campus.rooms.domain.RoomBookingStatus.RESERVED) ORDER BY b.startTime ASC")
    List<RoomBooking> findActiveOrReservedByRoomId(@Param("roomId") UUID roomId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM RoomBooking b JOIN FETCH b.room JOIN FETCH b.leader WHERE b.id = :id")
    Optional<RoomBooking> findDetailedByIdForUpdate(@Param("id") UUID id);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM RoomBooking b WHERE b.room.id = :roomId AND b.status IN (sa.edu.fbsu.campus.rooms.domain.RoomBookingStatus.ACTIVE, sa.edu.fbsu.campus.rooms.domain.RoomBookingStatus.RESERVED) AND b.startTime < :endTime AND b.endTime > :startTime AND (:excludeId IS NULL OR b.id <> :excludeId)")
    boolean existsOverlappingBooking(
            @Param("roomId") UUID roomId,
            @Param("startTime") Instant startTime,
            @Param("endTime") Instant endTime,
            @Param("excludeId") UUID excludeId
    );

    long countByUniversityIdAndStatusIn(UUID universityId, List<RoomBookingStatus> statuses);
}

