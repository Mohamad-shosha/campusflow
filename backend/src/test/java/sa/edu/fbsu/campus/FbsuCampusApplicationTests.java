package sa.edu.fbsu.campus;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class FbsuCampusApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring ApplicationContext boots up cleanly using test profile
    }
}
