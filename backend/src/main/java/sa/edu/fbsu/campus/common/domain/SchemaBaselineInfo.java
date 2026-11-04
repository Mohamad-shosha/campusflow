package sa.edu.fbsu.campus.common.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "schema_baseline_info")
public class SchemaBaselineInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "platform_name", nullable = false, length = 120)
    private String platformName;

    @Column(name = "version", nullable = false, length = 30)
    private String version;

    @Column(name = "initialized_at", nullable = false, updatable = false)
    private Instant initializedAt = Instant.now();

    public SchemaBaselineInfo() {
    }

    public SchemaBaselineInfo(String platformName, String version) {
        this.platformName = platformName;
        this.version = version;
        this.initializedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public String getPlatformName() {
        return platformName;
    }

    public String getVersion() {
        return version;
    }

    public Instant getInitializedAt() {
        return initializedAt;
    }
}

