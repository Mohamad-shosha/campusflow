package sa.edu.fbsu.campus.identity.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.identity.domain.SaudiPlate;
import sa.edu.fbsu.campus.identity.domain.Vehicle;
import sa.edu.fbsu.campus.identity.dto.CreateVehicleRequest;
import sa.edu.fbsu.campus.identity.dto.UpdateVehicleRequest;
import sa.edu.fbsu.campus.identity.dto.VehicleDto;
import sa.edu.fbsu.campus.identity.infra.VehicleRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    private VehicleService vehicleService;

    private final UUID userId = UUID.randomUUID();
    private final UUID otherUserId = UUID.randomUUID();
    private final UUID universityId = UUID.randomUUID();
    private final UUID vehicleId = UUID.randomUUID();
    private Vehicle testVehicle;

    @BeforeEach
    void setUp() {
        vehicleService = new VehicleService(vehicleRepository);

        SaudiPlate plate = SaudiPlate.of("ط ر ق", "4040");
        testVehicle = new Vehicle(universityId, userId, plate, "Camry", "White");
        testVehicle.setId(vehicleId);
    }

    @Test
    @DisplayName("Should add new vehicle and set as primary when user has no prior vehicles")
    void shouldAddFirstVehicleAsPrimary() {
        when(vehicleRepository.existsByUniversityIdAndPlateLettersArAndPlateDigits(
                eq(universityId), anyString(), anyString())).thenReturn(false);
        when(vehicleRepository.findByUserIdAndActiveTrue(userId)).thenReturn(new ArrayList<>());
        when(vehicleRepository.save(any(Vehicle.class))).thenAnswer(inv -> inv.getArgument(0));

        CreateVehicleRequest req = new CreateVehicleRequest("ط ر ق", "4040", "Camry", "White", false);
        VehicleDto result = vehicleService.addVehicle(userId, universityId, req);

        assertThat(result).isNotNull();
        assertThat(result.primary()).isTrue();
        assertThat(result.formattedPlateAr()).isEqualTo("ط ر ق 4040");
        assertThat(result.formattedPlateEn()).isEqualTo("T R G 4040");
        verify(vehicleRepository).save(any(Vehicle.class));
    }

    @Test
    @DisplayName("Should reject adding duplicate license plate in same university")
    void shouldRejectDuplicatePlate() {
        when(vehicleRepository.existsByUniversityIdAndPlateLettersArAndPlateDigits(
                eq(universityId), eq("ط ر ق"), eq("4040"))).thenReturn(true);

        CreateVehicleRequest req = new CreateVehicleRequest("ط ر ق", "4040", "Camry", "White", false);

        assertThatThrownBy(() -> vehicleService.addVehicle(userId, universityId, req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("مسجلة مسبقاً");

        verify(vehicleRepository, never()).save(any());
    }

    @Test
    @DisplayName("IDOR Protection: should throw AccessDeniedException when getting another user's vehicle")
    void shouldBlockAccessToOtherUserVehicleOnGet() {
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(testVehicle));

        assertThatThrownBy(() -> vehicleService.getVehicleById(otherUserId, vehicleId))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("IDOR Protection");
    }

    @Test
    @DisplayName("IDOR Protection: should throw AccessDeniedException when updating another user's vehicle")
    void shouldBlockUpdateOnOtherUserVehicle() {
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(testVehicle));

        UpdateVehicleRequest updateReq = new UpdateVehicleRequest("Lexus", "Black", false);

        assertThatThrownBy(() -> vehicleService.updateVehicle(otherUserId, vehicleId, updateReq))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("IDOR Protection");

        verify(vehicleRepository, never()).save(any());
    }

    @Test
    @DisplayName("IDOR Protection: should throw AccessDeniedException when deleting another user's vehicle")
    void shouldBlockDeleteOnOtherUserVehicle() {
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(testVehicle));

        assertThatThrownBy(() -> vehicleService.deleteVehicle(otherUserId, vehicleId))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("IDOR Protection");

        verify(vehicleRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should successfully switch primary vehicle")
    void shouldSwitchPrimaryVehicle() {
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.of(testVehicle));
        when(vehicleRepository.findByUserIdAndActiveTrue(userId)).thenReturn(List.of(testVehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenAnswer(inv -> inv.getArgument(0));

        VehicleDto result = vehicleService.setPrimaryVehicle(userId, vehicleId);

        assertThat(result.primary()).isTrue();
        verify(vehicleRepository).saveAll(any());
        verify(vehicleRepository).save(testVehicle);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when vehicle does not exist")
    void shouldThrowWhenVehicleNotFound() {
        when(vehicleRepository.findById(vehicleId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> vehicleService.getVehicleById(userId, vehicleId))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}

