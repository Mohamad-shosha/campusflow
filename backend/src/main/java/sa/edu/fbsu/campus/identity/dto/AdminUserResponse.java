package sa.edu.fbsu.campus.identity.dto;

import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.domain.UserStatus;
import sa.edu.fbsu.campus.identity.domain.UserType;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

public record AdminUserResponse(
        UUID id,
        UUID universityId,
        String universityNumber,
        String email,
        String phone,
        String fullNameAr,
        String fullNameEn,
        UserType userType,
        UserStatus status,
        String specialty,
        Set<Role> roles,
        UUID collegeId,
        Instant createdAt
) {
    public static AdminUserResponse fromEntity(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getUniversityId(),
                user.getUniversityNumber(),
                user.getEmail(),
                user.getPhone(),
                user.getFullNameAr(),
                user.getFullNameEn(),
                user.getUserType(),
                user.getStatus(),
                user.getSpecialty(),
                user.getRoles(),
                user.getCollegeId(),
                user.getCreatedAt()
        );
    }
}

