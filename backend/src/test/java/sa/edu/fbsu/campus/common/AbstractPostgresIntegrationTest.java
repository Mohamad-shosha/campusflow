package sa.edu.fbsu.campus.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * Base class for Integration Tests.
 * When Docker is available, provisions a real PostgreSQL 16 container via Testcontainers with Flyway migrations.
 * When Docker is offline locally, falls back gracefully to embedded PostgreSQL-compatible H2 database.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public abstract class AbstractPostgresIntegrationTest {

    private static final Logger log = LoggerFactory.getLogger(AbstractPostgresIntegrationTest.class);
    protected static final PostgreSQLContainer<?> postgres = initPostgresContainer();

    @SuppressWarnings("resource")
    private static PostgreSQLContainer<?> initPostgresContainer() {
        try {
            if (DockerClientFactory.instance().isDockerAvailable()) {
                PostgreSQLContainer<?> container = new PostgreSQLContainer<>("postgres:16-alpine")
                        .withDatabaseName("fbsu_campus_test")
                        .withUsername("fbsu_test")
                        .withPassword("test_secret");
                container.start();
                log.info("Testcontainers PostgreSQL started on {}", container.getJdbcUrl());
                return container;
            }
            log.info("Docker daemon not reachable locally; falling back to PostgreSQL-compatible H2 mode");
        } catch (Throwable ex) {
            log.warn("Docker environment check failed ({}); using embedded H2 fallback", ex.getMessage());
        }
        return null;
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        if (postgres != null && postgres.isRunning()) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl);
            registry.add("spring.datasource.username", postgres::getUsername);
            registry.add("spring.datasource.password", postgres::getPassword);
            registry.add("spring.flyway.enabled", () -> "true");
            registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        }
    }
}
