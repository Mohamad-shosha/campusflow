package sa.edu.fbsu.campus.common.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HealthCheckController.class)
class HealthCheckControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void healthCheckShouldReturnUpStatus() throws Exception {
        mockMvc.perform(get("/api/v1/health-check"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("FBSU Smart Campus Modular Monolith Backend"));
    }
}

