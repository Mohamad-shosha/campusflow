package sa.edu.fbsu.campus.rooms.dto;

import sa.edu.fbsu.campus.rooms.domain.RoomStatus;

import java.util.List;

public record UpdateRoomRequest(
        String nameAr,
        String nameEn,
        String buildingAr,
        String buildingEn,
        String capacityAr,
        String capacityEn,
        String typeBadgeAr,
        String typeBadgeEn,
        List<String> specsAr,
        List<String> specsEn,
        String availableFromAr,
        String availableFromEn,
        RoomStatus status,
        Integer displayOrder
) {}

