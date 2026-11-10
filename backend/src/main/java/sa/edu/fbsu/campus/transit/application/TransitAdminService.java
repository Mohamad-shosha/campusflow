package sa.edu.fbsu.campus.transit.application;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.audit.application.AdminAuditService;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.transit.domain.ShuttleBus;
import sa.edu.fbsu.campus.transit.domain.ShuttleStatus;
import sa.edu.fbsu.campus.transit.domain.TransitRoute;
import sa.edu.fbsu.campus.transit.domain.TransitRouteStatus;
import sa.edu.fbsu.campus.transit.domain.TransitStop;
import sa.edu.fbsu.campus.transit.dto.CreateShuttleBusRequest;
import sa.edu.fbsu.campus.transit.dto.CreateTransitRouteRequest;
import sa.edu.fbsu.campus.transit.dto.ShuttleBusResponse;
import sa.edu.fbsu.campus.transit.dto.TransitRouteResponse;
import sa.edu.fbsu.campus.transit.dto.UpdateShuttleBusRequest;
import sa.edu.fbsu.campus.transit.dto.UpdateTransitRouteStatusRequest;
import sa.edu.fbsu.campus.transit.infra.ShuttleBusRepository;
import sa.edu.fbsu.campus.transit.infra.TransitRouteRepository;
import sa.edu.fbsu.campus.transit.infra.TransitStopRepository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class TransitAdminService {

    private final TransitRouteRepository routeRepository;
    private final TransitStopRepository stopRepository;
    private final ShuttleBusRepository shuttleRepository;
    private final AdminAuditService auditService;

    public TransitAdminService(
            TransitRouteRepository routeRepository,
            TransitStopRepository stopRepository,
            ShuttleBusRepository shuttleRepository,
            AdminAuditService auditService
    ) {
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
        this.shuttleRepository = shuttleRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public List<TransitRouteResponse> listAllRoutes(UUID universityId) {
        return routeRepository.findAllWithStopsByUniversityId(universityId)
                .stream()
                .map(TransitRouteResponse::fromEntity)
                .toList();
    }

    @Transactional
    public TransitRouteResponse createRoute(
            UUID universityId,
            CreateTransitRouteRequest request,
            UserPrincipal actor
    ) {
        String normalizedCode = request.routeCode().trim().toUpperCase();
        if (routeRepository.existsByRouteCode(normalizedCode)) {
            throw new IllegalArgumentException("Transit route code '" + normalizedCode + "' is already in use");
        }

        TransitRoute route = new TransitRoute(
                universityId,
                normalizedCode,
                request.nameAr().trim(),
                request.nameEn().trim(),
                request.colorHex() != null && !request.colorHex().isBlank() ? request.colorHex().trim() : "#10b981",
                request.operatingHoursAr() != null && !request.operatingHoursAr().isBlank() ? request.operatingHoursAr().trim() : "07:30 ص - 05:30 م",
                request.operatingHoursEn() != null && !request.operatingHoursEn().isBlank() ? request.operatingHoursEn().trim() : "07:30 AM - 05:30 PM",
                request.frequencyMinutes() != null ? request.frequencyMinutes() : 10,
                request.status() != null ? request.status() : TransitRouteStatus.ACTIVE,
                request.displayOrder() != null ? request.displayOrder() : 10
        );
        route.setSource("MANUAL");

        if (request.stops() != null) {
            int order = 1;
            for (CreateTransitRouteRequest.CreateStopRequest stopReq : request.stops()) {
                TransitStop stop = new TransitStop(
                        universityId,
                        route,
                        stopReq.stopCode().trim().toUpperCase(),
                        stopReq.nameAr().trim(),
                        stopReq.nameEn().trim(),
                        stopReq.locationDescAr() != null && !stopReq.locationDescAr().isBlank()
                                ? stopReq.locationDescAr().trim()
                                : stopReq.nameAr().trim(),
                        stopReq.locationDescEn() != null && !stopReq.locationDescEn().isBlank()
                                ? stopReq.locationDescEn().trim()
                                : stopReq.nameEn().trim(),
                        stopReq.stopOrder() != null ? stopReq.stopOrder() : order,
                        stopReq.etaMinutesFromStart() != null ? stopReq.etaMinutesFromStart() : (order - 1) * 4,
                        stopReq.hasShelter() == null || stopReq.hasShelter(),
                        stopReq.hasAc() == null || stopReq.hasAc()
                );
                route.getStops().add(stop);
                order++;
            }
        }

        TransitRoute saved = routeRepository.save(route);

        auditService.record(
                universityId,
                actor,
                "CREATE_TRANSIT_ROUTE",
                "TRANSIT_ROUTE",
                saved.getId().toString(),
                "إضافة مسار نقل ترددي جديد برمز " + saved.getRouteCode(),
                "Created transit route #" + saved.getRouteCode() + " (" + saved.getNameEn() + ")",
                Map.of("routeCode", saved.getRouteCode(), "status", saved.getStatus().name(), "source", saved.getSource())
        );

        return TransitRouteResponse.fromEntity(saved);
    }

    @Transactional
    public TransitRouteResponse updateRouteStatus(
            UUID universityId,
            UUID routeId,
            UpdateTransitRouteStatusRequest request,
            UserPrincipal actor
    ) {
        TransitRoute route = routeRepository.findById(routeId)
                .filter(r -> universityId.equals(r.getUniversityId()))
                .orElseThrow(() -> new ResourceNotFoundException("Transit route not found with id: " + routeId));

        TransitRouteStatus oldStatus = route.getStatus();
        route.setStatus(request.status());
        TransitRoute saved = routeRepository.save(route);

        auditService.record(
                universityId,
                actor,
                "UPDATE_TRANSIT_ROUTE_STATUS",
                "TRANSIT_ROUTE",
                saved.getId().toString(),
                "تعديل حالة مسار النقل " + saved.getRouteCode() + " من " + oldStatus + " إلى " + saved.getStatus(),
                "Updated transit route #" + saved.getRouteCode() + " status from " + oldStatus + " to " + saved.getStatus(),
                Map.of(
                        "oldStatus", oldStatus.name(),
                        "newStatus", saved.getStatus().name(),
                        "reason", request.reason() != null ? request.reason() : ""
                )
        );

        return TransitRouteResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ShuttleBusResponse> listAllShuttles(UUID universityId) {
        return shuttleRepository.findAllDetailedByUniversityId(universityId)
                .stream()
                .map(ShuttleBusResponse::fromEntity)
                .toList();
    }

    @Transactional
    public ShuttleBusResponse createShuttle(
            UUID universityId,
            CreateShuttleBusRequest request,
            UserPrincipal actor
    ) {
        String normalizedBusNumber = request.busNumber().trim().toUpperCase();
        if (shuttleRepository.existsByBusNumber(normalizedBusNumber)) {
            throw new IllegalArgumentException("Shuttle bus number '" + normalizedBusNumber + "' is already in use");
        }

        TransitRoute route = null;
        TransitStop firstStop = null;
        TransitStop nextStop = null;
        if (request.routeId() != null) {
            route = routeRepository.findById(request.routeId())
                    .filter(r -> universityId.equals(r.getUniversityId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Transit route not found with id: " + request.routeId()));
            List<TransitStop> stops = stopRepository.findByRouteIdOrderByStopOrderAsc(route.getId());
            if (!stops.isEmpty()) {
                firstStop = stops.get(0);
                nextStop = stops.size() > 1 ? stops.get(1) : stops.get(0);
            }
        }

        int totalCapacity = request.totalCapacity() != null ? request.totalCapacity() : 28;
        int occupiedSeats = Math.min(totalCapacity, request.occupiedSeats() != null ? request.occupiedSeats() : 0);

        ShuttleBus shuttle = new ShuttleBus(
                universityId,
                route,
                normalizedBusNumber,
                request.plateLettersAr().trim(),
                request.plateDigits().trim(),
                request.modelName().trim(),
                totalCapacity,
                occupiedSeats,
                request.isElectric() == null || request.isElectric(),
                request.driverNameAr().trim(),
                request.driverNameEn().trim(),
                request.status() != null ? request.status() : ShuttleStatus.IN_TRANSIT,
                firstStop,
                nextStop,
                request.nextStopEtaMins() != null ? request.nextStopEtaMins() : 3,
                request.batteryPercentage() != null ? request.batteryPercentage() : 90
        );
        shuttle.setSource("MANUAL");

        ShuttleBus saved = shuttleRepository.saveAndFlush(shuttle);

        auditService.record(
                universityId,
                actor,
                "CREATE_SHUTTLE_BUS",
                "SHUTTLE_BUS",
                saved.getId().toString(),
                "إضافة حافلة نقل ذكية برقم " + saved.getBusNumber(),
                "Created shuttle bus #" + saved.getBusNumber() + " (" + saved.getModelName() + ")",
                Map.of("busNumber", saved.getBusNumber(), "status", saved.getStatus().name(), "source", saved.getSource())
        );

        return ShuttleBusResponse.fromEntity(saved);
    }

    @Transactional
    public ShuttleBusResponse updateShuttle(
            UUID universityId,
            UUID shuttleId,
            UpdateShuttleBusRequest request,
            UserPrincipal actor
    ) {
        ShuttleBus shuttle = shuttleRepository.findById(shuttleId)
                .filter(b -> universityId.equals(b.getUniversityId()))
                .orElseThrow(() -> new ResourceNotFoundException("Shuttle bus not found with id: " + shuttleId));

        ShuttleStatus oldStatus = shuttle.getStatus();

        if (request.status() != null) {
            shuttle.setStatus(request.status());
        }
        if (request.routeId() != null) {
            TransitRoute route = routeRepository.findById(request.routeId())
                    .filter(r -> universityId.equals(r.getUniversityId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Transit route not found with id: " + request.routeId()));
            shuttle.setCurrentRoute(route);
        }
        if (request.currentStopId() != null) {
            TransitStop stop = stopRepository.findById(request.currentStopId())
                    .filter(s -> universityId.equals(s.getUniversityId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Transit stop not found with id: " + request.currentStopId()));
            shuttle.setCurrentStop(stop);
        }
        if (request.nextStopId() != null) {
            TransitStop stop = stopRepository.findById(request.nextStopId())
                    .filter(s -> universityId.equals(s.getUniversityId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Transit stop not found with id: " + request.nextStopId()));
            shuttle.setNextStop(stop);
        }
        if (request.occupiedSeats() != null) {
            int clamped = Math.max(0, Math.min(shuttle.getTotalCapacity(), request.occupiedSeats()));
            shuttle.setOccupiedSeats(clamped);
        }
        if (request.batteryPercentage() != null) {
            int clamped = Math.max(0, Math.min(100, request.batteryPercentage()));
            shuttle.setBatteryPercentage(clamped);
        }
        if (request.nextStopEtaMins() != null) {
            shuttle.setNextStopEtaMins(Math.max(0, request.nextStopEtaMins()));
        }
        if (request.driverNameAr() != null && !request.driverNameAr().isBlank()) {
            shuttle.setDriverNameAr(request.driverNameAr().trim());
        }
        if (request.driverNameEn() != null && !request.driverNameEn().isBlank()) {
            shuttle.setDriverNameEn(request.driverNameEn().trim());
        }

        ShuttleBus saved = shuttleRepository.saveAndFlush(shuttle);

        auditService.record(
                universityId,
                actor,
                "UPDATE_SHUTTLE_BUS",
                "SHUTTLE_BUS",
                saved.getId().toString(),
                "تحديث حالة وبيانات الحافلة " + saved.getBusNumber(),
                "Updated shuttle bus #" + saved.getBusNumber() + " (status: " + saved.getStatus() + ")",
                Map.of(
                        "oldStatus", oldStatus.name(),
                        "newStatus", saved.getStatus().name(),
                        "occupiedSeats", saved.getOccupiedSeats(),
                        "batteryPercentage", saved.getBatteryPercentage(),
                        "reason", request.reason() != null ? request.reason() : ""
                )
        );

        return ShuttleBusResponse.fromEntity(saved);
    }
}
