package sa.edu.fbsu.campus.parking.application;

import org.springframework.stereotype.Component;
import sa.edu.fbsu.campus.common.error.TariffNotConfiguredException;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.parking.domain.ParkingTariff;
import sa.edu.fbsu.campus.parking.infra.ParkingTariffRepository;

import java.util.UUID;

/**
 * Single source of parking pricing. Resolves the active tariff for a university and user type,
 * and fails with {@link TariffNotConfiguredException} when none exists, so no service ever
 * charges or rewards a hardcoded amount.
 */
@Component
public class TariffResolver {

    private final ParkingTariffRepository tariffRepository;

    public TariffResolver(ParkingTariffRepository tariffRepository) {
        this.tariffRepository = tariffRepository;
    }

    public ParkingTariff requireActiveTariff(UUID universityId, UserType userType) {
        return tariffRepository.findByUniversityIdAndUserType(universityId, userType)
                .filter(ParkingTariff::isActive)
                .orElseThrow(() -> new TariffNotConfiguredException(
                        universityId, userType != null ? userType.name() : "UNKNOWN"));
    }
}
