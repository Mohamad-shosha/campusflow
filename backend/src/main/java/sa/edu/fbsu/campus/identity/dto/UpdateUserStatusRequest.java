package sa.edu.fbsu.campus.identity.dto;

import jakarta.validation.constraints.NotNull;
import sa.edu.fbsu.campus.identity.domain.UserStatus;

public record UpdateUserStatusRequest(
        @NotNull(message = "User status is required")
        UserStatus status,
        String reason
) {}

