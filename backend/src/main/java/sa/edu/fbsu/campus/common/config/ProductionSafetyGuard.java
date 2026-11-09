package sa.edu.fbsu.campus.common.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

/**
 * Fails application startup under the {@code prod} profile when the configuration could
 * create demo data or rely on development credentials. Defense in depth on top of the
 * seeders' {@code @Profile("dev")} + {@code fbsu.seed.demo-data} conditions.
 */
@Component
@Profile("prod")
public class ProductionSafetyGuard {

    private static final Logger log = LoggerFactory.getLogger(ProductionSafetyGuard.class);

    /** Development-only values that must never be used in production. */
    static final Set<String> KNOWN_DEV_JWT_SECRETS = Set.of(
            "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
    static final Set<String> KNOWN_DEV_DB_PASSWORDS = Set.of("fbsu_secret_2026", "test_secret");
    static final int MIN_JWT_SECRET_LENGTH = 32;

    public ProductionSafetyGuard(Environment environment) {
        List<String> violations = findViolations(environment);
        if (!violations.isEmpty()) {
            throw new IllegalStateException(
                    "Refusing to start with the 'prod' profile: " + String.join("; ", violations));
        }
        log.info("Production safety checks passed (no demo seeding, no development credentials).");
    }

    static List<String> findViolations(Environment env) {
        List<String> violations = new ArrayList<>();

        if (Arrays.asList(env.getActiveProfiles()).contains("dev")) {
            violations.add("the 'dev' profile is active alongside 'prod'");
        }
        if (env.getProperty("fbsu.seed.demo-data", Boolean.class, false)) {
            violations.add("fbsu.seed.demo-data must be false");
        }

        String jwtSecret = env.getProperty("app.security.jwt.secret", "");
        if (jwtSecret.isBlank() || jwtSecret.length() < MIN_JWT_SECRET_LENGTH) {
            violations.add("JWT_SECRET must be set to at least " + MIN_JWT_SECRET_LENGTH + " characters");
        } else if (KNOWN_DEV_JWT_SECRETS.contains(jwtSecret)) {
            violations.add("JWT_SECRET is the development default");
        }

        String dbPassword = env.getProperty("spring.datasource.password", "");
        if (KNOWN_DEV_DB_PASSWORDS.contains(dbPassword)) {
            violations.add("SPRING_DATASOURCE_PASSWORD is a development default");
        }
        return violations;
    }
}
