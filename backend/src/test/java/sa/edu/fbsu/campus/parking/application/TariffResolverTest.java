package sa.edu.fbsu.campus.parking.application;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import sa.edu.fbsu.campus.common.error.TariffNotConfiguredException;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.parking.domain.ParkingTariff;
import sa.edu.fbsu.campus.parking.infra.ParkingTariffRepository;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TariffResolverTest {

    private static final UUID UNI = UUID.randomUUID();

    @Mock
    private ParkingTariffRepository tariffRepository;

    @InjectMocks
    private TariffResolver resolver;

    @Test
    @DisplayName("Returns the configured active tariff, including zero (free) rates")
    void returnsActiveTariff() {
        ParkingTariff free = new ParkingTariff(UNI, UserType.FACULTY, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        when(tariffRepository.findByUniversityIdAndUserType(UNI, UserType.FACULTY)).thenReturn(Optional.of(free));

        assertThat(resolver.requireActiveTariff(UNI, UserType.FACULTY).getHourlyRate()).isEqualByComparingTo("0");
    }

    @Test
    @DisplayName("Fails clearly when no tariff exists (no 5.75 SAR fallback)")
    void failsWhenMissing() {
        when(tariffRepository.findByUniversityIdAndUserType(UNI, UserType.STUDENT)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> resolver.requireActiveTariff(UNI, UserType.STUDENT))
                .isInstanceOf(TariffNotConfiguredException.class)
                .hasMessageContaining("STUDENT");
    }

    @Test
    @DisplayName("Treats an inactive tariff as not configured")
    void failsWhenInactive() {
        ParkingTariff inactive = new ParkingTariff(UNI, UserType.STAFF, BigDecimal.TEN, BigDecimal.TEN, BigDecimal.ONE);
        inactive.setActive(false);
        when(tariffRepository.findByUniversityIdAndUserType(UNI, UserType.STAFF)).thenReturn(Optional.of(inactive));

        assertThatThrownBy(() -> resolver.requireActiveTariff(UNI, UserType.STAFF))
                .isInstanceOf(TariffNotConfiguredException.class);
    }
}
