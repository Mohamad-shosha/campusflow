package sa.edu.fbsu.campus.identity.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.audit.application.AdminAuditService;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.domain.UserStatus;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.dto.AdminUserResponse;
import sa.edu.fbsu.campus.identity.infra.UserRepository;

import java.util.*;

@Service
public class UserAdminService {

    private final UserRepository userRepository;
    private final AdminAuditService auditService;

    public UserAdminService(UserRepository userRepository, AdminAuditService auditService) {
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> listUsers(
            UUID universityId,
            String search,
            Role role,
            UserType userType,
            UserStatus status
    ) {
        List<User> users = userRepository.findByUniversityId(universityId);

        String normalizedSearch = search != null ? search.trim().toLowerCase() : null;

        return users.stream()
                .filter(u -> {
                    if (role != null && !u.hasRole(role)) return false;
                    if (userType != null && u.getUserType() != userType) return false;
                    if (status != null && u.getStatus() != status) return false;
                    if (normalizedSearch != null && !normalizedSearch.isEmpty()) {
                        boolean matchNameAr = u.getFullNameAr() != null && u.getFullNameAr().toLowerCase().contains(normalizedSearch);
                        boolean matchNameEn = u.getFullNameEn() != null && u.getFullNameEn().toLowerCase().contains(normalizedSearch);
                        boolean matchEmail = u.getEmail() != null && u.getEmail().toLowerCase().contains(normalizedSearch);
                        boolean matchUniNum = u.getUniversityNumber() != null && u.getUniversityNumber().toLowerCase().contains(normalizedSearch);
                        return matchNameAr || matchNameEn || matchEmail || matchUniNum;
                    }
                    return true;
                })
                .sorted(Comparator.comparing(User::getCreatedAt).reversed())
                .map(AdminUserResponse::fromEntity)
                .toList();
    }

    @Transactional
    public AdminUserResponse updateUserStatus(
            UUID universityId,
            UUID targetUserId,
            UserStatus newStatus,
            String reason,
            UserPrincipal actor
    ) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + targetUserId));

        if (actor != null && actor.getUserId().equals(targetUserId) && newStatus != UserStatus.ACTIVE) {
            throw new IllegalArgumentException("Administrators cannot suspend or deactivate their own active account");
        }

        UserStatus oldStatus = user.getStatus();
        user.setStatus(newStatus);
        User saved = userRepository.save(user);

        auditService.record(
                universityId,
                actor,
                "UPDATE_USER_STATUS",
                "APP_USER",
                targetUserId.toString(),
                "تعديل حالة المستخدم " + user.getEmail() + " من " + oldStatus + " إلى " + newStatus,
                "Updated user " + user.getEmail() + " status from " + oldStatus + " to " + newStatus,
                Map.of("oldStatus", oldStatus, "newStatus", newStatus, "reason", reason != null ? reason : "")
        );

        return AdminUserResponse.fromEntity(saved);
    }

    @Transactional
    public AdminUserResponse updateUserRoles(
            UUID universityId,
            UUID targetUserId,
            Set<Role> newRoles,
            UserPrincipal actor
    ) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + targetUserId));

        if (actor != null && actor.getUserId().equals(targetUserId) && !newRoles.contains(Role.CAMPUS_ADMIN)) {
            throw new IllegalArgumentException("Administrators cannot revoke their own CAMPUS_ADMIN authority");
        }

        Set<Role> oldRoles = new HashSet<>(user.getRoles());
        user.setRoles(new HashSet<>(newRoles));
        User saved = userRepository.save(user);

        auditService.record(
                universityId,
                actor,
                "UPDATE_USER_ROLES",
                "APP_USER",
                targetUserId.toString(),
                "تعديل صلاحيات وأدوار المستخدم " + user.getEmail(),
                "Updated security roles for user " + user.getEmail(),
                Map.of("oldRoles", oldRoles, "newRoles", newRoles)
        );

        return AdminUserResponse.fromEntity(saved);
    }
}

