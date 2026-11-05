package sa.edu.fbsu.campus.common.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health-check")
@Tag(name = "Health Check", description = "Service Health Status & Telemetry API")
public class HealthCheckController {

    @GetMapping
    @Operation(summary = "Check Server Readiness", description = "Returns operational health status, version, and server timestamp")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "FBSU Smart Campus Modular Monolith Backend",
                "version", "1.0.0",
                "timestamp", Instant.now()
        ));
    }
}
