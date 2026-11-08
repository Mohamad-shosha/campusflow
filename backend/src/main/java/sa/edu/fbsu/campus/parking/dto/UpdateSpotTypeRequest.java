package sa.edu.fbsu.campus.parking.dto;

import jakarta.validation.constraints.NotNull;
import sa.edu.fbsu.campus.parking.domain.SpotType;

public record UpdateSpotTypeRequest(
        @NotNull(message = "Spot type is required")
        SpotType spotType,
        Boolean flexEligible
) {}

