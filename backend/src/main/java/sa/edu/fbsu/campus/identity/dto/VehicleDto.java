package sa.edu.fbsu.campus.identity.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.UUID;

@Schema(description = "Vehicle Information DTO")
public record VehicleDto(
        @Schema(description = "Vehicle ID", example = "b0000000-0000-0000-0000-000000000001")
        UUID id,

        @Schema(description = "Arabic Plate Letters", example = "ط ر ق")
        String plateLettersAr,

        @Schema(description = "English Plate Letters", example = "T R G")
        String plateLettersEn,

        @Schema(description = "Plate Digits", example = "4040")
        String plateDigits,

        @Schema(description = "Formatted Saudi Plate (Arabic)", example = "ط ر ق 4040")
        String formattedPlateAr,

        @Schema(description = "Formatted Saudi Plate (English)", example = "T R G 4040")
        String formattedPlateEn,

        @Schema(description = "Make and model", example = "Toyota Camry")
        String makeModel,

        @Schema(description = "Color", example = "White")
        String color,

        @Schema(description = "Whether this is the primary vehicle", example = "true")
        boolean primary,

        @Schema(description = "Whether vehicle is active", example = "true")
        boolean active,

        @Schema(description = "Creation timestamp")
        Instant createdAt
) {
}

