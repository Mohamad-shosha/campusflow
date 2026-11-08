package sa.edu.fbsu.campus.officehours.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.officehours.domain.AppointmentStatus;
import sa.edu.fbsu.campus.officehours.domain.FacultyOfficeProfile;
import sa.edu.fbsu.campus.officehours.domain.OfficeHourAppointment;
import sa.edu.fbsu.campus.officehours.domain.OfficeHourSlot;
import sa.edu.fbsu.campus.officehours.dto.*;
import sa.edu.fbsu.campus.officehours.infra.FacultyOfficeProfileRepository;
import sa.edu.fbsu.campus.officehours.infra.OfficeHourAppointmentRepository;
import sa.edu.fbsu.campus.officehours.infra.OfficeHourSlotRepository;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OfficeHoursService {

    private static final Logger log = LoggerFactory.getLogger(OfficeHoursService.class);

    private final FacultyOfficeProfileRepository profileRepository;
    private final OfficeHourSlotRepository slotRepository;
    private final OfficeHourAppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;

    public OfficeHoursService(
            FacultyOfficeProfileRepository profileRepository,
            OfficeHourSlotRepository slotRepository,
            OfficeHourAppointmentRepository appointmentRepository,
            UserRepository userRepository,
            UniversityRepository universityRepository
    ) {
        this.profileRepository = profileRepository;
        this.slotRepository = slotRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.universityRepository = universityRepository;
    }

    @Transactional(readOnly = true)
    public List<FacultyOfficeResponse> listFacultyWithSlots() {
        UUID uniId = resolveDefaultUniversityId();
        List<FacultyOfficeProfile> profiles = profileRepository.findAllByUniversityIdWithFaculty(uniId);
        if (profiles.isEmpty()) {
            return List.of();
        }
        List<UUID> ids = profiles.stream().map(FacultyOfficeProfile::getId).toList();
        Map<UUID, List<OfficeHourSlot>> slotsByProfile = slotRepository.findByProfileIdsOrderByStartTimeAsc(ids)
                .stream()
                .collect(Collectors.groupingBy(s -> s.getProfile().getId()));

        return profiles.stream()
                .map(p -> FacultyOfficeResponse.fromEntity(p, slotsByProfile.getOrDefault(p.getId(), List.of())))
                .toList();
    }

    @Transactional
    public OfficeHourSlotDto createSlot(UUID actorUserId, CreateOfficeHourSlotRequest request) {
        Objects.requireNonNull(actorUserId, "Authenticated user ID is required");
        User actor = userRepository.findById(actorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + actorUserId));

        boolean isAdmin = actor.hasRole(Role.CAMPUS_ADMIN);
        if (!isAdmin && actor.getUserType() != UserType.FACULTY) {
            throw new AccessDeniedException("Only faculty members or campus administrators may manage office-hour windows.");
        }

        FacultyOfficeProfile profile;
        if (request.profileIdOrCode() != null && !request.profileIdOrCode().isBlank()) {
            profile = findProfileByIdOrCode(request.profileIdOrCode());
        } else {
            profile = profileRepository.findByFacultyUserId(actorUserId)
                    .orElseGet(() -> createDefaultFacultyProfile(actor));
        }

        // Strict ownership enforcement: a faculty member may ONLY manage their own windows
        if (!isAdmin && !profile.getFaculty().getId().equals(actorUserId)) {
            throw new AccessDeniedException("Faculty members may only manage their own office-hour windows.");
        }

        Instant endTime = request.startTime().plus(Duration.ofMinutes(request.durationMinutes()));
        String labelEn = (request.timeLabelEn() != null && !request.timeLabelEn().isBlank())
                ? request.timeLabelEn().trim()
                : request.timeLabelAr().trim();

        OfficeHourSlot slot = slotRepository.saveAndFlush(new OfficeHourSlot(
                actor.getUniversityId(),
                profile,
                request.startTime(),
                endTime,
                request.timeLabelAr().trim(),
                labelEn,
                request.durationMinutes(),
                true,
                null
        ));

        log.info("Created office-hour window {} ({} mins) for faculty {}",
                slot.getTimeLabelEn(), slot.getDurationMinutes(), profile.getFaculty().getUniversityNumber());

        return OfficeHourSlotDto.fromEntity(slot);
    }

    @Transactional
    public void deleteSlot(UUID actorUserId, UUID slotId) {
        User actor = userRepository.findById(actorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + actorUserId));

        OfficeHourSlot slot = slotRepository.findByIdForUpdate(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Office-hour slot not found: " + slotId));

        boolean isAdmin = actor.hasRole(Role.CAMPUS_ADMIN);
        if (!isAdmin && !slot.getProfile().getFaculty().getId().equals(actorUserId)) {
            throw new AccessDeniedException("Faculty members may only delete their own office-hour windows.");
        }

        if (!slot.isAvailable()) {
            throw new IllegalStateException("Cannot delete an office-hour window that currently has an active appointment.");
        }

        slotRepository.delete(slot);
    }

    @Transactional
    public OfficeHourAppointmentResponse bookAppointment(UUID studentUserId, BookOfficeHourRequest request) {
        Objects.requireNonNull(studentUserId, "Authenticated user ID is required");
        User student = userRepository.findById(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + studentUserId));

        OfficeHourSlot slot = slotRepository.findByIdForUpdate(request.slotId())
                .orElseThrow(() -> new ResourceNotFoundException("Office-hour slot not found: " + request.slotId()));

        if (slot.getProfile().getFaculty().getId().equals(studentUserId)) {
            throw new IllegalArgumentException("Faculty members cannot book their own office-hour slots.");
        }

        if (!slot.isAvailable()) {
            throw new IllegalStateException("Selected office-hour slot is already booked.");
        }

        OfficeHourAppointment saved = appointmentRepository.saveAndFlush(new OfficeHourAppointment(
                student.getUniversityId(),
                slot.getProfile(),
                slot,
                student,
                slot.getStartTime(),
                slot.getEndTime(),
                request.topic().trim()
        ));

        slot.setAvailable(false);
        slot.setBookedNote("محجوز - " + student.getFullNameAr());
        slotRepository.saveAndFlush(slot);

        List<OfficeHourSlot> updatedSlots = slotRepository.findByProfileIdOrderByStartTimeAsc(slot.getProfile().getId());
        FacultyOfficeResponse updatedFaculty = FacultyOfficeResponse.fromEntity(slot.getProfile(), updatedSlots);

        log.info("Booked office-hour appointment {} for student {} with faculty {}",
                saved.getId(), student.getUniversityNumber(), slot.getProfile().getFaculty().getUniversityNumber());

        return OfficeHourAppointmentResponse.fromEntity(saved, updatedFaculty);
    }

    @Transactional(readOnly = true)
    public List<OfficeHourAppointmentResponse> getMyAppointments(UUID userId) {
        return appointmentRepository.findAllForUser(userId).stream()
                .map(a -> {
                    List<OfficeHourSlot> slots = slotRepository.findByProfileIdOrderByStartTimeAsc(a.getProfile().getId());
                    return OfficeHourAppointmentResponse.fromEntity(a, FacultyOfficeResponse.fromEntity(a.getProfile(), slots));
                })
                .toList();
    }

    @Transactional
    public OfficeHourAppointmentResponse cancelAppointment(UUID actorUserId, UUID appointmentId) {
        User actor = userRepository.findById(actorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + actorUserId));

        OfficeHourAppointment appt = appointmentRepository.findDetailedByIdForUpdate(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + appointmentId));

        boolean allowed = actor.hasRole(Role.CAMPUS_ADMIN)
                || appt.getStudent().getId().equals(actorUserId)
                || appt.getProfile().getFaculty().getId().equals(actorUserId);

        if (!allowed) {
            throw new AccessDeniedException("You are not authorized to cancel this office-hour appointment.");
        }

        if (appt.getStatus() == AppointmentStatus.CANCELLED) {
            throw new IllegalStateException("Office-hour appointment is already cancelled.");
        }

        appt.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.saveAndFlush(appt);

        OfficeHourSlot slot = appt.getSlot();
        slot.setAvailable(true);
        slot.setBookedNote(null);
        slotRepository.saveAndFlush(slot);

        List<OfficeHourSlot> updatedSlots = slotRepository.findByProfileIdOrderByStartTimeAsc(appt.getProfile().getId());
        return OfficeHourAppointmentResponse.fromEntity(appt, FacultyOfficeResponse.fromEntity(appt.getProfile(), updatedSlots));
    }

    private FacultyOfficeProfile createDefaultFacultyProfile(User faculty) {
        String code = "fac-" + faculty.getUniversityNumber().toLowerCase();
        return profileRepository.save(new FacultyOfficeProfile(
                faculty.getUniversityId(),
                code,
                faculty,
                "عضو هيئة تدريس",
                "Faculty Member",
                "كلية الحاسب والهندسة",
                "College of Computing & Engineering",
                "مبنى الكلية - مكتب أكاديمي",
                "عضو هيئة تدريس",
                "Faculty",
                "#116E63",
                "الأحد والثلاثاء (10:00 ص - 12:00 م)",
                "Sun & Tue (10:00 AM - 12:00 PM)",
                "متاح هذا الأسبوع",
                "Available this week",
                List.of("الإرشاد الأكاديمي", "مناقشة المقررات"),
                99
        ));
    }

    private FacultyOfficeProfile findProfileByIdOrCode(String idOrCode) {
        try {
            UUID id = UUID.fromString(idOrCode.trim());
            return profileRepository.findDetailedById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Faculty office profile not found: " + idOrCode));
        } catch (IllegalArgumentException ignored) {
            return profileRepository.findDetailedByProfileCode(idOrCode.trim())
                    .orElseThrow(() -> new ResourceNotFoundException("Faculty office profile not found: " + idOrCode));
        }
    }

    private UUID resolveDefaultUniversityId() {
        return universityRepository.findByCode("FBSU")
                .map(University::getId)
                .orElseGet(() -> universityRepository.findAll().stream()
                        .findFirst()
                        .map(University::getId)
                        .orElseThrow(() -> new ResourceNotFoundException("Default FBSU university tenant not initialized")));
    }
}
