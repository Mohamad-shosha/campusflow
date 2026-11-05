package sa.edu.fbsu.campus.identity.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.identity.application.VehicleService;
import sa.edu.fbsu.campus.identity.dto.CreateVehicleRequest;
import sa.edu.fbsu.campus.identity.dto.UpdateVehicleRequest;
import sa.edu.fbsu.campus.identity.dto.VehicleDto;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vehicles")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Vehicles Management", description = "إدارة سيارات منسوبي الجامعة ولوحات المركبات السعودية مع حماية IDOR")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @GetMapping
    @Operation(summary = "قائمة سيارات المستخدم", description = "عرض كافة المركبات النشطة المسجلة لحساب المستخدم الحالي")
    public ResponseEntity<List<VehicleDto>> getMyVehicles(@AuthenticationPrincipal UserPrincipal principal) {
        List<VehicleDto> vehicles = vehicleService.getUserVehicles(principal.getUserId());
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}")
    @Operation(summary = "تفاصيل مركبة محددة", description = "جلب بيانات مركبة مع التحقق الصارم من ملكية المستخدم لها")
    public ResponseEntity<VehicleDto> getVehicle(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        VehicleDto vehicle = vehicleService.getVehicleById(principal.getUserId(), id);
        return ResponseEntity.ok(vehicle);
    }

    @PostMapping
    @Operation(summary = "تسجيل مركبة جديدة", description = "تسجيل سيارة مع التحقق من صحة لوحة المرور السعودية وعدم تكرارها")
    public ResponseEntity<VehicleDto> addVehicle(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateVehicleRequest request) {
        VehicleDto created = vehicleService.addVehicle(principal.getUserId(), principal.getUniversityId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "تعديل بيانات مركبة", description = "تعديل الموديل أو اللون أو تعيينها كسيارة أساسية")
    public ResponseEntity<VehicleDto> updateVehicle(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateVehicleRequest request) {
        VehicleDto updated = vehicleService.updateVehicle(principal.getUserId(), id, request);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/primary")
    @Operation(summary = "تعيين المركبة كسيارة أساسية", description = "جعل هذه المركبة هي الأساسية لدخول بوابات الجامعة الذكية")
    public ResponseEntity<VehicleDto> setPrimary(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        VehicleDto updated = vehicleService.setPrimaryVehicle(principal.getUserId(), id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "حذف مركبة", description = "إلغاء تفعيل المركبة من سجلات المستخدم")
    public ResponseEntity<Map<String, String>> deleteVehicle(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {
        vehicleService.deleteVehicle(principal.getUserId(), id);
        return ResponseEntity.ok(Map.of("message", "تم حذف المركبة وإلغاء تفعيلها بنجاح."));
    }
}

