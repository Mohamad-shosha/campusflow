package sa.edu.fbsu.campus.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI fbsuCampusOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("منظومة الحرم الجامعي والمواقف الذكية | جامعة فهد بن سلطان (FBSU)")
                        .description("API Documentation for FBSU Smart Campus, ALPR Parking, Peer Tutoring & Academic Hub.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("FBSU Technical Architecture Team")
                                .email("contact@fbsu.edu.sa"))
                        .license(new License().name("Proprietary").url("https://fbsu.edu.sa")));
    }
}

