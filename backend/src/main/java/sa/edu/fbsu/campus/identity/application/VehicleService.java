package sa.edu.fbsu.campus.identity.application;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.identity.domain.SaudiPlate;
import sa.edu.fbsu.campus.identity.domain.Vehicle;
import sa.edu.fbsu.campus.identity.dto.CreateVehicleRequest;
import sa.edu.fbsu.campus.identity.dto.UpdateVehicleRequest;
import sa.edu.fbsu.campus.identity.dto.VehicleDto;
import sa.edu.fbsu.campus.identity.infra.VehicleRepository;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional(readOnly = true)
    public List<VehicleDto> getUserVehicles(UUID userId) {
        return vehicleRepository.findByUserIdAndActiveTrue(userId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public VehicleDto getVehicleById(UUID userId, UUID vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("المركبة غير موجودة"));

        if (!vehicle.getUserId().equals(userId)) {
            throw new AccessDeniedException("غير مصرح لك بالوصول لبيانات هذه المركبة (IDOR Protection)");
        }

        return toDto(vehicle);
    }

    public VehicleDto addVehicle(UUID userId, UUID universityId, CreateVehicleRequest request) {
        SaudiPlate plate = SaudiPlate.of(request.plateLettersAr(), request.plateDigits());

        if (vehicleRepository.existsByUniversityIdAndPlateLettersArAndPlateDigits(
                universityId, plate.getLettersAr(), plate.getDigits())) {
            throw new IllegalArgumentException("لوحة السيارة (" + plate.formattedAr() + ") مسجلة مسبقاً في الجامعة");
        }

        List<Vehicle> userVehicles = vehicleRepository.findByUserIdAndActiveTrue(userId);
        boolean shouldBePrimary = Boolean.TRUE.equals(request.setPrimary()) || userVehicles.isEmpty();

        if (shouldBePrimary && !userVehicles.isEmpty()) {
            for (Vehicle v : userVehicles) {
                v.setPrimary(false);
            }
            vehicleRepository.saveAll(userVehicles);
        }

        Vehicle newVehicle = new Vehicle(universityId, userId, plate, request.makeModel(), request.color());
        newVehicle.setPrimary(shouldBePrimary);
        newVehicle.setActive(true);

        Vehicle saved = vehicleRepository.save(newVehicle);
        return toDto(saved);
    }

    public VehicleDto updateVehicle(UUID userId, UUID vehicleId, UpdateVehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("المركبة غير موجودة"));

        if (!vehicle.getUserId().equals(userId)) {
            throw new AccessDeniedException("غير مصرح لك بتعديل بيانات هذه المركبة (IDOR Protection)");
        }

        if (request.makeModel() != null && !request.makeModel().isBlank()) {
            vehicle.setMakeModel(request.makeModel());
        }

        if (request.color() != null && !request.color().isBlank()) {
            vehicle.setColor(request.color());
        }

        if (Boolean.TRUE.equals(request.setPrimary()) && !vehicle.isPrimary()) {
            List<Vehicle> userVehicles = vehicleRepository.findByUserIdAndActiveTrue(userId);
            for (Vehicle v : userVehicles) {
                v.setPrimary(false);
            }
            vehicleRepository.saveAll(userVehicles);
            vehicle.setPrimary(true);
        }

        Vehicle updated = vehicleRepository.save(vehicle);
        return toDto(updated);
    }

    public VehicleDto setPrimaryVehicle(UUID userId, UUID vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("المركبة غير موجودة"));

        if (!vehicle.getUserId().equals(userId)) {
            throw new AccessDeniedException("غير مصرح لك بتعديل هذه المركبة (IDOR Protection)");
        }

        List<Vehicle> userVehicles = vehicleRepository.findByUserIdAndActiveTrue(userId);
        for (Vehicle v : userVehicles) {
            v.setPrimary(false);
        }
        vehicleRepository.saveAll(userVehicles);

        vehicle.setPrimary(true);
        Vehicle saved = vehicleRepository.save(vehicle);
        return toDto(saved);
    }

    public void deleteVehicle(UUID userId, UUID vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResourceNotFoundException("المركبة غير موجودة"));

        if (!vehicle.getUserId().equals(userId)) {
            throw new AccessDeniedException("غير مصرح لك بحذف هذه المركبة (IDOR Protection)");
        }

        vehicle.setActive(false);
        vehicle.setPrimary(false);
        vehicleRepository.save(vehicle);

        // If user has other active vehicles, ensure at least one is primary
        List<Vehicle> remaining = vehicleRepository.findByUserIdAndActiveTrue(userId);
        if (!remaining.isEmpty() && remaining.stream().noneMatch(Vehicle::isPrimary)) {
            remaining.get(0).setPrimary(true);
            vehicleRepository.save(remaining.get(0));
        }
    }

    public VehicleDto toDto(Vehicle vehicle) {
        return new VehicleDto(
                vehicle.getId(),
                vehicle.getPlate().getLettersAr(),
                vehicle.getPlate().getLettersEn(),
                vehicle.getPlate().getDigits(),
                vehicle.getPlate().formattedAr(),
                vehicle.getPlate().formattedEn(),
                vehicle.getMakeModel(),
                vehicle.getColor(),
                vehicle.isPrimary(),
                vehicle.isActive(),
                vehicle.getCreatedAt()
        );
    }
}

