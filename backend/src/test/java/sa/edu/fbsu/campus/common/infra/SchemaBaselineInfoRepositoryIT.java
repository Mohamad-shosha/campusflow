package sa.edu.fbsu.campus.common.infra;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import sa.edu.fbsu.campus.common.AbstractPostgresIntegrationTest;
import sa.edu.fbsu.campus.common.domain.SchemaBaselineInfo;

import static org.assertj.core.api.Assertions.assertThat;

class SchemaBaselineInfoRepositoryIT extends AbstractPostgresIntegrationTest {

    @Autowired
    private SchemaBaselineInfoRepository repository;

    @Test
    void shouldSaveAndRetrieveBaselineEntity() {
        SchemaBaselineInfo info = new SchemaBaselineInfo("FBSU Test Module", "1.0.0-TEST");
        SchemaBaselineInfo saved = repository.save(info);

        assertThat(saved.getId()).isNotNull();
        assertThat(repository.findByPlatformName("FBSU Test Module")).isPresent();
    }
}

