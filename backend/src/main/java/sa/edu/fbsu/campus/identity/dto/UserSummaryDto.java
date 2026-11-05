package sa.edu.fbsu.campus.identity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.UserType;

import java.util.Set;
import java.util.UUID;

@Schema(description = "Summary Profile of University Member")
public record UserSummaryDto(
        @Schema(description = "Unique user identifier (UUID)", example = "3fa85f64-5717-4562-b3fc-2c963f66afa6")
        UUID id,

        @Schema(description = "Associated university tenant identifier (UUID)", example = "7ca85f64-5717-4562-b3fc-2c963f66afa7")
        UUID universityId,

        @Schema(description = "Official university identification number", example = "202410123")
        String universityNumber,

        @Schema(description = "Official institutional email", example = "student@fbsu.edu.sa")
        String email,

        @Schema(description = "Contact phone number", example = "+966501234567")
        String phone,

        @Schema(description = "Full legal name in Arabic", example = "أحمد محمد العطوي")
        String fullNameAr,

        @Schema(description = "Full legal name in English", example = "Ahmed Mohammed Al-Atwi")
        String fullNameEn,

        @Schema(description = "Affiliation category", example = "STUDENT")
        UserType userType,

        @Schema(description = "Assigned security roles in the platform")
        Set<Role> roles,

        @Schema(description = "Primary registered vehicle plate summary", example = "أ ب ح 1234")
        String primaryVehiclePlate
) {
}
