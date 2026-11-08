package sa.edu.fbsu.campus.rooms.dto;

import jakarta.validation.constraints.NotNull;
import sa.edu.fbsu.campus.rooms.domain.RoomStatus;

public record UpdateRoomStatusRequest(
        @NotNull(message = "Status is required")
        RoomStatus status,
        String reason
) {}

