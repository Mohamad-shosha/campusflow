package sa.edu.fbsu.campus.parking.dto;

import jakarta.validation.constraints.NotNull;
import sa.edu.fbsu.campus.parking.domain.SpotStatus;

public record UpdateSpotStatusRequest(
        @NotNull(message = "Spot status is required")
        SpotStatus status,
        String reason
) {}

