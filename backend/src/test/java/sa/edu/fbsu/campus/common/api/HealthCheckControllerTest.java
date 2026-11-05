package sa.edu.fbsu.campus.common.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import sa.edu.fbsu.campus.common.security.JwtAuthenticationFilter;
import sa.edu.fbsu.campus.common.security.JwtService;
import sa.edu.fbsu.campus.common.security.SecurityConfig;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HealthCheckController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class HealthCheckControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtService jwtService;

    @Test
    void healthCheckShouldReturnUpStatus() throws Exception {
        mockMvc.perform(get("/api/v1/health-check"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("FBSU Smart Campus Modular Monolith Backend"));
    }
}
