package sa.edu.fbsu.campus.common.error;

import java.util.UUID;

/**
 * Thrown when a pricing-dependent parking operation is requested but no active tariff exists
 * for the university and user type. Pricing must never fall back to a hardcoded amount.
 */
public class TariffNotConfiguredException extends RuntimeException {

    private final String userType;

    public TariffNotConfiguredException(UUID universityId, String userType) {
        super("No active parking tariff is configured for user type " + userType
                + " at this university. Ask a campus administrator to configure it.");
        this.userType = userType;
    }

    public String getUserType() {
        return userType;
    }
}
