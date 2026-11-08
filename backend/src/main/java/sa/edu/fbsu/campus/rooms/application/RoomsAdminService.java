package sa.edu.fbsu.campus.rooms.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.audit.application.AdminAuditService;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.rooms.domain.RoomBooking;
import sa.edu.fbsu.campus.rooms.domain.RoomStatus;
import sa.edu.fbsu.campus.rooms.domain.StudyRoom;
import sa.edu.fbsu.campus.rooms.dto.CreateRoomRequest;
import sa.edu.fbsu.campus.rooms.dto.StudyRoomResponse;
import sa.edu.fbsu.campus.rooms.dto.UpdateRoomRequest;
import sa.edu.fbsu.campus.rooms.infra.RoomBookingRepository;
import sa.edu.fbsu.campus.rooms.infra.StudyRoomRepository;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoomsAdminService {

    private final StudyRoomRepository roomRepository;
    private final RoomBookingRepository bookingRepository;
    private final AdminAuditService auditService;

    public RoomsAdminService(
            StudyRoomRepository roomRepository,
            RoomBookingRepository bookingRepository,
            AdminAuditService auditService
    ) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public List<StudyRoomResponse> listAllRooms(UUID universityId) {
        List<StudyRoom> rooms = roomRepository.findAllByUniversityIdOrderByDisplayOrderAsc(universityId);
        if (rooms.isEmpty()) {
            return List.of();
        }

        List<UUID> roomIds = rooms.stream().map(StudyRoom::getId).toList();
        Map<UUID, RoomBooking> activeBookings = bookingRepository.findActiveOrReservedByRoomIds(roomIds)
                .stream()
                .collect(Collectors.toMap(
                        b -> b.getRoom().getId(),
                        b -> b,
                        (existing, replacement) -> existing
                ));

        return rooms.stream()
                .map(r -> StudyRoomResponse.fromEntity(r, activeBookings.get(r.getId())))
                .toList();
    }

    @Transactional
    public StudyRoomResponse createRoom(UUID universityId, CreateRoomRequest request, UserPrincipal actor) {
        if (roomRepository.existsByRoomCode(request.roomCode())) {
            throw new IllegalArgumentException("Study room code '" + request.roomCode() + "' is already in use");
        }

        StudyRoom room = new StudyRoom(
                universityId,
                request.roomCode().trim().toUpperCase(),
                request.nameAr().trim(),
                request.nameEn().trim(),
                request.buildingAr().trim(),
                request.buildingEn().trim(),
                request.capacityAr().trim(),
                request.capacityEn().trim(),
                request.typeBadgeAr().trim(),
                request.typeBadgeEn().trim(),
                request.specsAr() != null ? request.specsAr() : List.of(),
                request.specsEn() != null ? request.specsEn() : List.of(),
                request.availableFromAr().trim(),
                request.availableFromEn().trim(),
                request.status(),
                request.displayOrder()
        );

        StudyRoom saved = roomRepository.save(room);

        auditService.record(
                universityId,
                actor,
                "CREATE_ROOM",
                "STUDY_ROOM",
                saved.getId().toString(),
                "إضافة قاعة دراسية جديدة برمز " + saved.getRoomCode() + " باسم " + saved.getNameAr(),
                "Created study room #" + saved.getRoomCode() + " (" + saved.getNameEn() + ")",
                Map.of("roomCode", saved.getRoomCode(), "status", saved.getStatus())
        );

        return StudyRoomResponse.fromEntity(saved, null);
    }

    @Transactional
    public StudyRoomResponse updateRoom(UUID universityId, UUID roomId, UpdateRoomRequest request, UserPrincipal actor) {
        StudyRoom room = roomRepository.findByIdForUpdate(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Study room not found with id: " + roomId));

        if (request.nameAr() != null && !request.nameAr().isBlank()) room.setNameAr(request.nameAr().trim());
        if (request.nameEn() != null && !request.nameEn().isBlank()) room.setNameEn(request.nameEn().trim());
        if (request.buildingAr() != null && !request.buildingAr().isBlank()) room.setBuildingAr(request.buildingAr().trim());
        if (request.buildingEn() != null && !request.buildingEn().isBlank()) room.setBuildingEn(request.buildingEn().trim());
        if (request.capacityAr() != null && !request.capacityAr().isBlank()) room.setCapacityAr(request.capacityAr().trim());
        if (request.capacityEn() != null && !request.capacityEn().isBlank()) room.setCapacityEn(request.capacityEn().trim());
        if (request.typeBadgeAr() != null && !request.typeBadgeAr().isBlank()) room.setTypeBadgeAr(request.typeBadgeAr().trim());
        if (request.typeBadgeEn() != null && !request.typeBadgeEn().isBlank()) room.setTypeBadgeEn(request.typeBadgeEn().trim());
        if (request.specsAr() != null) room.setSpecsArList(request.specsAr());
        if (request.specsEn() != null) room.setSpecsEnList(request.specsEn());
        if (request.availableFromAr() != null && !request.availableFromAr().isBlank()) room.setAvailableFromAr(request.availableFromAr().trim());
        if (request.availableFromEn() != null && !request.availableFromEn().isBlank()) room.setAvailableFromEn(request.availableFromEn().trim());
        if (request.status() != null) room.setStatus(request.status());
        if (request.displayOrder() != null) room.setDisplayOrder(request.displayOrder());

        StudyRoom saved = roomRepository.save(room);

        auditService.record(
                universityId,
                actor,
                "UPDATE_ROOM",
                "STUDY_ROOM",
                saved.getId().toString(),
                "تحديث بيانات القاعة " + saved.getRoomCode(),
                "Updated study room #" + saved.getRoomCode(),
                request
        );

        return StudyRoomResponse.fromEntity(saved, null);
    }

    @Transactional
    public StudyRoomResponse updateRoomStatus(
            UUID universityId,
            UUID roomId,
            RoomStatus newStatus,
            String reason,
            UserPrincipal actor
    ) {
        StudyRoom room = roomRepository.findByIdForUpdate(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Study room not found with id: " + roomId));

        RoomStatus oldStatus = room.getStatus();
        room.setStatus(newStatus);
        StudyRoom saved = roomRepository.save(room);

        auditService.record(
                universityId,
                actor,
                "UPDATE_ROOM_STATUS",
                "STUDY_ROOM",
                saved.getId().toString(),
                "تعديل حالة القاعة " + saved.getRoomCode() + " من " + oldStatus + " إلى " + newStatus,
                "Updated room #" + saved.getRoomCode() + " status from " + oldStatus + " to " + newStatus,
                Map.of("oldStatus", oldStatus, "newStatus", newStatus, "reason", reason != null ? reason : "")
        );

        return StudyRoomResponse.fromEntity(saved, null);
    }
}

