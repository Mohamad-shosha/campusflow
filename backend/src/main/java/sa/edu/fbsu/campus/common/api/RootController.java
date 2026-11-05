package sa.edu.fbsu.campus.common.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@Tag(name = "Root Index", description = "System Entry Point & Service Discovery")
public class RootController {

    @GetMapping("/")
    @Operation(summary = "Root Service Overview", description = "Returns platform metadata, Swagger UI reference, and core service links")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
                "service", "FBSU Smart Campus & Parking Platform Backend",
                "status", "UP",
                "version", "1.0.0",
                "swaggerUI", "/swagger-ui/index.html",
                "healthCheck", "/api/v1/health-check",
                "frontendUrl", "http://localhost:80",
                "timestamp", Instant.now()
        ));
    }
}
