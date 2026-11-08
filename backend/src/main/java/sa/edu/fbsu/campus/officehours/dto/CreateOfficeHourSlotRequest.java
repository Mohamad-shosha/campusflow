package sa.edu.fbsu.campus.officehours.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record CreateOfficeHourSlotRequest(
        String profileIdOrCode,

        @NotNull(message = "Start time is required")
        Instant startTime,

        @Min(value = 5, message = "Duration must be at least 5 minutes")
        @Max(value = 120, message = "Duration must not exceed 120 minutes")
        int durationMinutes,

        @NotBlank(message = "Arabic time label is required")
        @Size(max = 40)
        String timeLabelAr,

        @Size(max = 40)
        String timeLabelEn
) {
}
