package sa.edu.fbsu.campus.rooms.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.common.events.StudyRoomBookingEvent;
import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.rooms.domain.RoomBooking;
import sa.edu.fbsu.campus.rooms.domain.RoomBookingStatus;
import sa.edu.fbsu.campus.rooms.domain.RoomStatus;
import sa.edu.fbsu.campus.rooms.domain.StudyRoom;
import sa.edu.fbsu.campus.rooms.dto.BookRoomRequest;
import sa.edu.fbsu.campus.rooms.dto.RoomScheduleSlotDto;
import sa.edu.fbsu.campus.rooms.dto.StudyRoomResponse;
import sa.edu.fbsu.campus.rooms.infra.RoomBookingRepository;
import sa.edu.fbsu.campus.rooms.infra.StudyRoomRepository;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoomsService {

    private static final Logger log = LoggerFactory.getLogger(RoomsService.class);
    private static final ZoneOffset RIYADH_OFFSET = ZoneOffset.ofHours(3);
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm").withZone(RIYADH_OFFSET);
    private static final double CAMPUS_DAILY_OPERATING_MINUTES = 840.0; // 08:00 - 22:00 KSA (14h)
    private static final int[] SCHEDULE_BLOCK_START_HOURS = {8, 10, 12, 14, 16, 18};

    private final StudyRoomRepository roomRepository;
    private final RoomBookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;
    private final ApplicationEventPublisher eventPublisher;

    public RoomsService(
            StudyRoomRepository roomRepository,
            RoomBookingRepository bookingRepository,
            UserRepository userRepository,
            UniversityRepository universityRepository,
            ApplicationEventPublisher eventPublisher
    ) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.universityRepository = universityRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public List<StudyRoomResponse> listRooms() {
        UUID uniId = resolveDefaultUniversityId();
        List<StudyRoom> rooms = roomRepository.findAllByUniversityIdOrderByDisplayOrderAsc(uniId);
        if (rooms.isEmpty()) {
            return List.of();
        }

        List<UUID> roomIds = rooms.stream().map(StudyRoom::getId).toList();
        Map<UUID, RoomBooking> activeBookings = bookingRepository.findActiveOrReservedByRoomIds(roomIds)
                .stream()
                .collect(Collectors.toMap(
                        b -> b.getRoom().getId(),
                        b -> b,
                        (existing, replacement) -> existing
                ));

        return buildRoomResponses(rooms, activeBookings);
    }

    @Transactional(readOnly = true)
    public StudyRoomResponse getRoom(String idOrCode) {
        StudyRoom room = findRoomByIdOrCode(idOrCode);
        RoomBooking activeBooking = bookingRepository.findActiveOrReservedByRoomId(room.getId())
                .stream()
                .findFirst()
                .orElse(null);
        return buildSingleRoomResponse(room, activeBooking);
    }

    @Transactional
    public StudyRoomResponse bookRoom(UUID actorUserId, String idOrCode, BookRoomRequest request) {
        Objects.requireNonNull(actorUserId, "Authenticated user ID is required");
        User actor = userRepository.findById(actorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + actorUserId));

        StudyRoom room = findRoomByIdOrCodeForUpdate(idOrCode);

        if (room.getStatus() == RoomStatus.MAINTENANCE) {
            throw new IllegalStateException("Study room is currently under maintenance and cannot be booked.");
        }

        if (request.startTime() == null || request.endTime() == null) {
            throw new IllegalArgumentException("Start time and end time are required.");
        }

        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException("End time must be strictly after start time.");
        }

        long durationMins = Duration.between(request.startTime(), request.endTime()).toMinutes();
        if (durationMins < 5 || durationMins > 180) {
            throw new IllegalArgumentException("Booking duration must be between 5 minutes and 3 hours (180 minutes).");
        }

        boolean overlaps = bookingRepository.existsOverlappingBooking(
                room.getId(),
                request.startTime(),
                request.endTime(),
                null
        );
        if (overlaps) {
            throw new IllegalStateException("The requested study room has an overlapping reservation during this time window.");
        }

        String startLabel = (request.startLabel() != null && !request.startLabel().isBlank())
                ? request.startLabel().trim()
                : TIME_FMT.format(request.startTime());

        String endLabel = (request.endLabel() != null && !request.endLabel().isBlank())
                ? request.endLabel().trim()
                : TIME_FMT.format(request.endTime());

        List<String> team = (request.teamMembers() != null && !request.teamMembers().isEmpty())
                ? request.teamMembers()
                : List.of(actor.getFullNameAr() + " (" + actor.getUniversityNumber() + ")");

        RoomBookingStatus initialStatus = request.startTime().isAfter(Instant.now().plus(Duration.ofMinutes(15)))
                ? RoomBookingStatus.RESERVED
                : RoomBookingStatus.ACTIVE;

        RoomBooking booking = bookingRepository.saveAndFlush(new RoomBooking(
                actor.getUniversityId(),
                room,
                actor,
                team,
                request.purpose().trim(),
                request.startTime(),
                request.endTime(),
                startLabel,
                endLabel,
                initialStatus
        ));

        if (initialStatus == RoomBookingStatus.ACTIVE) {
            room.setStatus(RoomStatus.IN_USE);
            room.setAvailableFromAr(endLabel + " (بعد انتهاء الجلسة المحددة)");
            room.setAvailableFromEn(endLabel + " (after scheduled session)");
        } else {
            room.setStatus(RoomStatus.RESERVED);
        }
        roomRepository.saveAndFlush(room);

        log.info("Booked room {} ({}) for user {} from {} to {}",
                room.getRoomCode(), room.getNameEn(), actor.getUniversityNumber(), startLabel, endLabel);

        eventPublisher.publishEvent(new StudyRoomBookingEvent(
                actor.getId(),
                actor.getUniversityId(),
                room.getRoomCode(),
                room.getNameAr(),
                room.getNameEn(),
                "BOOKED",
                startLabel + " - " + endLabel
        ));

        return buildSingleRoomResponse(room, booking);
    }

    @Transactional
    public StudyRoomResponse extendBooking(UUID actorUserId, UUID bookingId) {
        User actor = userRepository.findById(actorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + actorUserId));

        RoomBooking booking = bookingRepository.findDetailedByIdForUpdate(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Room booking not found: " + bookingId));

        boolean isAllowed = actor.hasRole(Role.CAMPUS_ADMIN)
                || booking.getLeader().getId().equals(actorUserId);
        if (!isAllowed) {
            throw new AccessDeniedException("Only the booking leader or campus administrator may extend this session.");
        }

        if (booking.getStatus() != RoomBookingStatus.ACTIVE && booking.getStatus() != RoomBookingStatus.RESERVED) {
            throw new IllegalStateException("Only active or reserved study room sessions can be extended.");
        }

        if (booking.getExtendedCount() >= 3) {
            throw new IllegalStateException("Maximum limit of 3 extensions (30 minutes total) reached for this session.");
        }

        Instant newEndTime = booking.getEndTime().plus(Duration.ofMinutes(10));
        boolean overlaps = bookingRepository.existsOverlappingBooking(
                booking.getRoom().getId(),
                booking.getEndTime(),
                newEndTime,
                booking.getId()
        );
        if (overlaps) {
            throw new IllegalStateException("Cannot extend booking: a conflicting reservation starts within the requested 10-minute window.");
        }

        String newEndLabel = TIME_FMT.format(newEndTime);
        booking.setEndTime(newEndTime);
        booking.setEndLabel(newEndLabel);
        booking.incrementExtendedCount();
        bookingRepository.saveAndFlush(booking);

        StudyRoom room = roomRepository.findByIdForUpdate(booking.getRoom().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Study room not found"));
        room.setAvailableFromAr(newEndLabel + " (بعد انتهاء الجلسة الممددة)");
        room.setAvailableFromEn(newEndLabel + " (after extended session)");
        roomRepository.saveAndFlush(room);

        log.info("Extended room {} booking {} (+10 mins) new end {}",
                room.getRoomCode(), booking.getId(), newEndLabel);

        eventPublisher.publishEvent(new StudyRoomBookingEvent(
                actor.getId(),
                booking.getUniversityId(),
                room.getRoomCode(),
                room.getNameAr(),
                room.getNameEn(),
                "EXTENDED",
                booking.getStartLabel() + " - " + newEndLabel
        ));

        return buildSingleRoomResponse(room, booking);
    }

    @Transactional
    public StudyRoomResponse releaseBooking(UUID actorUserId, UUID bookingId) {
        User actor = userRepository.findById(actorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + actorUserId));

        RoomBooking booking = bookingRepository.findDetailedByIdForUpdate(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Room booking not found: " + bookingId));

        boolean isAllowed = actor.hasRole(Role.CAMPUS_ADMIN)
                || booking.getLeader().getId().equals(actorUserId);
        if (!isAllowed) {
            throw new AccessDeniedException("Only the booking leader or campus administrator may release this study room.");
        }

        if (booking.getStatus() == RoomBookingStatus.RELEASED || booking.getStatus() == RoomBookingStatus.CANCELLED) {
            throw new IllegalStateException("Room booking is already released or cancelled.");
        }

        booking.setStatus(RoomBookingStatus.RELEASED);
        bookingRepository.saveAndFlush(booking);

        StudyRoom room = roomRepository.findByIdForUpdate(booking.getRoom().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Study room not found"));
        room.setStatus(RoomStatus.AVAILABLE);
        room.setAvailableFromAr("متاحة للحجز الفوري الآن");
        room.setAvailableFromEn("Available for immediate reservation");
        roomRepository.saveAndFlush(room);

        log.info("Released room {} booking {} by user {}",
                room.getRoomCode(), booking.getId(), actor.getUniversityNumber());

        eventPublisher.publishEvent(new StudyRoomBookingEvent(
                actor.getId(),
                booking.getUniversityId(),
                room.getRoomCode(),
                room.getNameAr(),
                room.getNameEn(),
                "RELEASED",
                booking.getStartLabel() + " - " + booking.getEndLabel()
        ));

        return buildSingleRoomResponse(room, null);
    }

    private List<StudyRoomResponse> buildRoomResponses(
            List<StudyRoom> rooms,
            Map<UUID, RoomBooking> activeBookings
    ) {
        if (rooms.isEmpty()) {
            return List.of();
        }
        LocalDate todayKsa = LocalDate.now(RIYADH_OFFSET);
        Instant dayStart = todayKsa.atStartOfDay().toInstant(RIYADH_OFFSET);
        Instant dayEnd = dayStart.plus(Duration.ofDays(1));

        List<UUID> roomIds = rooms.stream().map(StudyRoom::getId).toList();
        Map<UUID, List<RoomBooking>> dailyBookingsByRoom = bookingRepository
                .findDailyOccupiedByRoomIds(roomIds, dayStart, dayEnd)
                .stream()
                .collect(Collectors.groupingBy(b -> b.getRoom().getId()));

        return rooms.stream()
                .map(room -> toComputedResponse(
                        room,
                        activeBookings.get(room.getId()),
                        dailyBookingsByRoom.getOrDefault(room.getId(), List.of()),
                        todayKsa,
                        dayStart,
                        dayEnd
                ))
                .toList();
    }

    private StudyRoomResponse buildSingleRoomResponse(StudyRoom room, RoomBooking activeBooking) {
        return buildRoomResponses(
                List.of(room),
                activeBooking != null ? Map.of(room.getId(), activeBooking) : Map.of()
        ).getFirst();
    }

    private StudyRoomResponse toComputedResponse(
            StudyRoom room,
            RoomBooking activeBooking,
            List<RoomBooking> dailyBookings,
            LocalDate todayKsa,
            Instant dayStart,
            Instant dayEnd
    ) {
        long totalBookedMinutes = 0L;
        for (RoomBooking booking : dailyBookings) {
            Instant clippedStart = booking.getStartTime().isBefore(dayStart) ? dayStart : booking.getStartTime();
            Instant clippedEnd = booking.getEndTime().isAfter(dayEnd) ? dayEnd : booking.getEndTime();
            if (clippedEnd.isAfter(clippedStart)) {
                totalBookedMinutes += Duration.between(clippedStart, clippedEnd).toMinutes();
            }
        }
        int utilizationPercent = (int) Math.min(100L, Math.round((totalBookedMinutes * 100.0) / CAMPUS_DAILY_OPERATING_MINUTES));

        List<RoomScheduleSlotDto> slots = new ArrayList<>();
        Set<UUID> matchedInStandardGrid = new HashSet<>();
        for (int hour : SCHEDULE_BLOCK_START_HOURS) {
            Instant slotStart = todayKsa.atTime(hour, 0).toInstant(RIYADH_OFFSET);
            Instant slotEnd = slotStart.plus(Duration.ofHours(2));
            String rangeLabel = String.format("%02d:00 - %02d:00", hour, hour + 2);

            RoomBooking overlapping = dailyBookings.stream()
                    .filter(b -> b.getStartTime().isBefore(slotEnd) && b.getEndTime().isAfter(slotStart))
                    .findFirst()
                    .orElse(null);

            if (overlapping != null) {
                matchedInStandardGrid.add(overlapping.getId());
                slots.add(new RoomScheduleSlotDto(rangeLabel, rangeLabel, "booked", overlapping.getPurpose()));
            } else {
                slots.add(new RoomScheduleSlotDto(rangeLabel, rangeLabel, "available", null));
            }
        }

        // Preserve visibility when an occupied session occurs outside 08:00-20:00 (e.g. evening/night tests)
        for (RoomBooking booking : dailyBookings) {
            if (!matchedInStandardGrid.contains(booking.getId())) {
                String label = TIME_FMT.format(booking.getStartTime()) + " - " + TIME_FMT.format(booking.getEndTime());
                slots.add(new RoomScheduleSlotDto(label, label, "booked", booking.getPurpose()));
            }
        }

        return StudyRoomResponse.fromEntity(room, activeBooking, utilizationPercent, slots);
    }

    private StudyRoom findRoomByIdOrCode(String idOrCode) {
        try {
            UUID id = UUID.fromString(idOrCode.trim());
            return roomRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Study room not found: " + idOrCode));
        } catch (IllegalArgumentException ignored) {
            return roomRepository.findAll().stream()
                    .filter(r -> r.getRoomCode().equalsIgnoreCase(idOrCode.trim()))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Study room not found: " + idOrCode));
        }
    }

    private StudyRoom findRoomByIdOrCodeForUpdate(String idOrCode) {
        try {
            UUID id = UUID.fromString(idOrCode.trim());
            return roomRepository.findByIdForUpdate(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Study room not found: " + idOrCode));
        } catch (IllegalArgumentException ignored) {
            return roomRepository.findByRoomCodeForUpdate(idOrCode.trim())
                    .orElseThrow(() -> new ResourceNotFoundException("Study room not found: " + idOrCode));
        }
    }

    private UUID resolveDefaultUniversityId() {
        return universityRepository.findByCode("FBSU")
                .map(u -> u.getId())
                .orElseGet(() -> universityRepository.findAll().stream()
                        .findFirst()
                        .map(u -> u.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Default FBSU university tenant not initialized")));
    }
}
