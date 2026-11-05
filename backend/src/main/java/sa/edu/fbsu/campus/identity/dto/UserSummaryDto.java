package sa.edu.fbsu.campus.identity.dto;

import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.UserType;

import java.util.Set;
import java.util.UUID;

public record UserSummaryDto(
        UUID id,
        UUID universityId,
        String universityNumber,
        String email,
        String phone,
        String fullNameAr,
        String fullNameEn,
        UserType userType,
        Set<Role> roles,
        String primaryVehiclePlate
) {
}
