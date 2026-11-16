package sa.edu.fbsu.campus.common.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/** Enables background jobs such as parking booking / Flex-Share expiry. */
@Configuration
@EnableScheduling
@ConditionalOnProperty(name = "fbsu.scheduling.enabled", havingValue = "true", matchIfMissing = true)
public class SchedulingConfig {
}
