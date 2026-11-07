package sa.edu.fbsu.campus.rooms.infra;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.rooms.domain.StudyRoom;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudyRoomRepository extends JpaRepository<StudyRoom, UUID> {

    List<StudyRoom> findAllByUniversityIdOrderByDisplayOrderAsc(UUID universityId);

    boolean existsByRoomCode(String roomCode);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM StudyRoom r WHERE r.id = :id")
    Optional<StudyRoom> findByIdForUpdate(@Param("id") UUID id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM StudyRoom r WHERE r.roomCode = :roomCode")
    Optional<StudyRoom> findByRoomCodeForUpdate(@Param("roomCode") String roomCode);
}

