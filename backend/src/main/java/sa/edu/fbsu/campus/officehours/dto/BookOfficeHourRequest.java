package sa.edu.fbsu.campus.officehours.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record BookOfficeHourRequest(
        @NotNull(message = "Slot ID is required")
        UUID slotId,

        @NotBlank(message = "Discussion topic is required")
        @Size(max = 500, message = "Topic must not exceed 500 characters")
        String topic
) {
}
