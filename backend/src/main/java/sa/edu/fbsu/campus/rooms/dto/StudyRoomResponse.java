package sa.edu.fbsu.campus.rooms.dto;

import sa.edu.fbsu.campus.rooms.domain.RoomBooking;
import sa.edu.fbsu.campus.rooms.domain.StudyRoom;

import java.util.List;
import java.util.UUID;

public record StudyRoomResponse(
        UUID id,
        String roomCode,
        String nameAr,
        String nameEn,
        String buildingAr,
        String buildingEn,
        String capacityAr,
        String capacityEn,
        String typeBadgeAr,
        String typeBadgeEn,
        String status,
        List<String> specsAr,
        List<String> specsEn,
        String availableFromAr,
        String availableFromEn,
        ActiveRoomBookingDto activeBooking,
        Integer utilizationPercent,
        List<RoomScheduleSlotDto> scheduleSlots,
        String requirementNoteAr,
        String requirementNoteEn
) {
    public static StudyRoomResponse fromEntity(StudyRoom room, RoomBooking currentBooking) {
        return fromEntity(room, currentBooking, null, List.of());
    }

    public static StudyRoomResponse fromEntity(
            StudyRoom room,
            RoomBooking currentBooking,
            Integer utilizationPercent,
            List<RoomScheduleSlotDto> scheduleSlots
    ) {
        return new StudyRoomResponse(
                room.getId(),
                room.getRoomCode(),
                room.getNameAr(),
                room.getNameEn(),
                room.getBuildingAr(),
                room.getBuildingEn(),
                room.getCapacityAr(),
                room.getCapacityEn(),
                room.getTypeBadgeAr(),
                room.getTypeBadgeEn(),
                room.getStatus().name(),
                room.getSpecsArList(),
                room.getSpecsEnList(),
                room.getAvailableFromAr(),
                room.getAvailableFromEn(),
                currentBooking != null ? ActiveRoomBookingDto.fromEntity(currentBooking) : null,
                utilizationPercent,
                scheduleSlots != null ? scheduleSlots : List.of(),
                room.getRequirementNoteAr(),
                room.getRequirementNoteEn()
        );
    }
}

