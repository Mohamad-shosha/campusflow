package sa.edu.fbsu.campus.identity.dto;

import jakarta.validation.constraints.NotEmpty;
import sa.edu.fbsu.campus.identity.domain.Role;

import java.util.Set;

public record UpdateUserRolesRequest(
        @NotEmpty(message = "At least one role must be assigned")
        Set<Role> roles
) {}

