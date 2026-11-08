package sa.edu.fbsu.campus.rooms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;

public record BookRoomRequest(
        @NotNull(message = "Start time is required")
        Instant startTime,

        @NotNull(message = "End time is required")
        Instant endTime,

        @Size(max = 40)
        String startLabel,

        @Size(max = 40)
        String endLabel,

        @NotBlank(message = "Booking purpose is required")
        @Size(max = 500, message = "Purpose must not exceed 500 characters")
        String purpose,

        List<@Size(max = 120) String> teamMembers
) {
}

