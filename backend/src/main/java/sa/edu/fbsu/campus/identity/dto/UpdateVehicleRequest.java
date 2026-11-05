package sa.edu.fbsu.campus.identity.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Update Vehicle Request")
public record UpdateVehicleRequest(
        @Schema(description = "Vehicle Make and Model", example = "Toyota Camry 2025")
        String makeModel,

        @Schema(description = "Vehicle Color", example = "Silver")
        String color,

        @Schema(description = "Set as primary vehicle", example = "true")
        Boolean setPrimary
) {
}

