package sa.edu.fbsu.campus.identity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Schema(description = "Register Vehicle Request")
public record CreateVehicleRequest(
        @NotBlank(message = "حروف اللوحة العربية مطلوبة (مثال: ط ر ق)")
        @Schema(description = "Arabic Plate Letters", example = "ط ر ق")
        String plateLettersAr,

        @NotBlank(message = "أرقام اللوحة مطلوبة (مثال: 4040)")
        @Pattern(regexp = "^\\d{1,4}$", message = "أرقام اللوحة يجب أن تكون من 1 إلى 4 أرقام")
        @Schema(description = "Plate Digits (1 to 4 digits)", example = "4040")
        String plateDigits,

        @Schema(description = "Vehicle Make and Model", example = "Toyota Camry 2024")
        String makeModel,

        @Schema(description = "Vehicle Color", example = "White")
        String color,

        @Schema(description = "Set as primary vehicle", example = "true")
        Boolean setPrimary
) {
}

