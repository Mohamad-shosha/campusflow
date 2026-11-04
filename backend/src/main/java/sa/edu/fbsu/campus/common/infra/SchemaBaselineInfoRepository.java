package sa.edu.fbsu.campus.common.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.common.domain.SchemaBaselineInfo;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchemaBaselineInfoRepository extends JpaRepository<SchemaBaselineInfo, UUID> {
    Optional<SchemaBaselineInfo> findByPlatformName(String platformName);
}

