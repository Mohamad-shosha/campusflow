package sa.edu.fbsu.campus.common.domain;

import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.identity.domain.User;

import java.util.Objects;

/**
 * Tenant isolation check for records looked up by id or code (P8-01 M8). A record from another
 * university is reported as not found, so its existence is not disclosed, and this applies to
 * campus admins as well: an admin's override powers stop at their own university.
 */
public final class TenantGuard {

    private TenantGuard() {
    }

    public static <T extends BaseTenantEntity> T requireSameTenant(T entity, User actor, String notFoundMessage) {
        if (entity == null || actor == null
                || !Objects.equals(entity.getUniversityId(), actor.getUniversityId())) {
            throw new ResourceNotFoundException(notFoundMessage);
        }
        return entity;
    }
}
