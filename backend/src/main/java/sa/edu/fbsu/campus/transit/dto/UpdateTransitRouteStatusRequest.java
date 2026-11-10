package sa.edu.fbsu.campus.transit.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import sa.edu.fbsu.campus.transit.domain.TransitRouteStatus;

public record UpdateTransitRouteStatusRequest(
        @NotNull(message = "Status is required")
        TransitRouteStatus status,

        @Size(max = 300)
        String reason
) {}

