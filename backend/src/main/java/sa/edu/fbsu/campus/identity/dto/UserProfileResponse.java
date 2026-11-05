package sa.edu.fbsu.campus.identity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.UserStatus;
import sa.edu.fbsu.campus.identity.domain.UserType;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Schema(description = "User Complete Profile Information")
public record UserProfileResponse(
        @Schema(description = "User ID", example = "a0000000-0000-0000-0000-000000000001")
        UUID id,

        @Schema(description = "University ID", example = "a0000000-0000-0000-0000-000000000001")
        UUID universityId,

        @Schema(description = "University ID Number", example = "202410123")
        String universityNumber,

        @Schema(description = "Email", example = "student@fbsu.edu.sa")
        String email,

        @Schema(description = "Phone number", example = "+966501234567")
        String phone,

        @Schema(description = "Full Name Arabic", example = "أحمد محمد العطوي")
        String fullNameAr,

        @Schema(description = "Full Name English", example = "Ahmed Mohammed Al-Atwi")
        String fullNameEn,

        @Schema(description = "User Type", example = "STUDENT")
        UserType userType,

        @Schema(description = "User Status", example = "ACTIVE")
        UserStatus status,

        @Schema(description = "College ID")
        UUID collegeId,

        @Schema(description = "Specialty / Major", example = "Software Engineering")
        String specialty,

        @Schema(description = "Preferred language locale", example = "ar")
        String locale,

        @Schema(description = "Preferred theme", example = "dark")
        String theme,

        @Schema(description = "Assigned security roles")
        Set<Role> roles,

        @Schema(description = "User registered vehicles")
        List<VehicleDto> vehicles
) {
}

