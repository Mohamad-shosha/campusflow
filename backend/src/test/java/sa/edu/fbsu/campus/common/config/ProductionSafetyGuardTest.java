package sa.edu.fbsu.campus.common.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.mock.env.MockEnvironment;
import sa.edu.fbsu.campus.common.seed.DevSeeder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ProductionSafetyGuardTest {

    private static final String STRONG_SECRET = "c2VjdXJlLXByb2R1Y3Rpb24tc2VjcmV0LWtleS0yMDI2LXgxMjM0NTY3ODkw";

    private MockEnvironment prodEnv() {
        MockEnvironment env = new MockEnvironment();
        env.setActiveProfiles("prod");
        env.setProperty("app.security.jwt.secret", STRONG_SECRET);
        env.setProperty("spring.datasource.password", "a-real-production-password");
        env.setProperty("fbsu.seed.demo-data", "false");
        return env;
    }

    @Test
    @DisplayName("A correctly configured production environment passes")
    void passesWithSafeConfiguration() {
        assertThat(ProductionSafetyGuard.findViolations(prodEnv())).isEmpty();
        new ProductionSafetyGuard(prodEnv()); // does not throw
    }

    @Test
    @DisplayName("Refuses to start when dev profile or demo seeding is enabled")
    void rejectsDemoDataInProduction() {
        MockEnvironment env = prodEnv();
        env.setActiveProfiles("prod", "dev");
        env.setProperty("fbsu.seed.demo-data", "true");

        assertThat(ProductionSafetyGuard.findViolations(env))
                .anyMatch(v -> v.contains("'dev' profile"))
                .anyMatch(v -> v.contains("demo-data"));
        assertThatThrownBy(() -> new ProductionSafetyGuard(env)).isInstanceOf(IllegalStateException.class);
    }

    @Test
    @DisplayName("Refuses development JWT secret and database password")
    void rejectsDevelopmentCredentials() {
        MockEnvironment env = prodEnv();
        env.setProperty("app.security.jwt.secret", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        env.setProperty("spring.datasource.password", "fbsu_secret_2026");

        assertThat(ProductionSafetyGuard.findViolations(env))
                .anyMatch(v -> v.contains("JWT_SECRET is the development default"))
                .anyMatch(v -> v.contains("SPRING_DATASOURCE_PASSWORD"));
    }

    @Test
    @DisplayName("Refuses a missing or short JWT secret")
    void rejectsMissingSecret() {
        MockEnvironment env = prodEnv();
        env.setProperty("app.security.jwt.secret", "short");
        assertThat(ProductionSafetyGuard.findViolations(env)).anyMatch(v -> v.contains("at least"));
    }

    @Test
    @DisplayName("Demo seeders are not registered unless dev profile AND fbsu.seed.demo-data=true")
    void seedersRequireBothProfileAndFlag() {
        ApplicationContextRunner runner = new ApplicationContextRunner().withUserConfiguration(DevSeeder.class);

        // dev profile alone (flag absent) -> no seeder
        runner.withPropertyValues("spring.profiles.active=dev")
                .run(ctx -> assertThat(ctx).doesNotHaveBean(DevSeeder.class));
        // flag alone (no dev profile) -> no seeder
        runner.withPropertyValues("fbsu.seed.demo-data=true")
                .run(ctx -> assertThat(ctx).doesNotHaveBean(DevSeeder.class));
    }
}
