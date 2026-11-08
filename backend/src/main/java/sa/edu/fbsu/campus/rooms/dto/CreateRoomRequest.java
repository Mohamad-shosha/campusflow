package sa.edu.fbsu.campus.rooms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import sa.edu.fbsu.campus.rooms.domain.RoomStatus;

import java.util.List;

public record CreateRoomRequest(
        @NotBlank(message = "Room code is required")
        String roomCode,

        @NotBlank(message = "Arabic name is required")
        String nameAr,

        @NotBlank(message = "English name is required")
        String nameEn,

        @NotBlank(message = "Arabic building is required")
        String buildingAr,

        @NotBlank(message = "English building is required")
        String buildingEn,

        @NotBlank(message = "Arabic capacity is required")
        String capacityAr,

        @NotBlank(message = "English capacity is required")
        String capacityEn,

        @NotBlank(message = "Arabic type badge is required")
        String typeBadgeAr,

        @NotBlank(message = "English type badge is required")
        String typeBadgeEn,

        List<String> specsAr,
        List<String> specsEn,

        @NotBlank(message = "Arabic available from is required")
        String availableFromAr,

        @NotBlank(message = "English available from is required")
        String availableFromEn,

        @NotNull(message = "Status is required")
        RoomStatus status,

        int displayOrder
) {}

