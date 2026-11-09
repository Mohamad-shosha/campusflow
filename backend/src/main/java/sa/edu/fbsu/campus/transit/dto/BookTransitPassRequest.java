package sa.edu.fbsu.campus.transit.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record BookTransitPassRequest(
        @NotNull(message = "Route ID is required")
        UUID routeId,

        UUID shuttleId,

        @NotNull(message = "Pickup stop ID is required")
        UUID pickupStopId,

        @NotNull(message = "Dropoff stop ID is required")
        UUID dropoffStopId
) {
}

