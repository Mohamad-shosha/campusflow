package sa.edu.fbsu.campus.rooms.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.common.events.StudyRoomBookingEvent;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.infra.UniversityRepository;
import sa.edu.fbsu.campus.rooms.domain.RoomBooking;
import sa.edu.fbsu.campus.rooms.domain.RoomBookingStatus;
import sa.edu.fbsu.campus.rooms.domain.RoomStatus;
import sa.edu.fbsu.campus.rooms.domain.StudyRoom;
import sa.edu.fbsu.campus.rooms.dto.BookRoomRequest;
import sa.edu.fbsu.campus.rooms.dto.StudyRoomResponse;
import sa.edu.fbsu.campus.rooms.infra.RoomBookingRepository;
import sa.edu.fbsu.campus.rooms.infra.StudyRoomRepository;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoomsService {

    private static final Logger log = LoggerFactory.getLogger(RoomsService.class);
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm").withZone(ZoneOffset.ofHours(3));

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

        return rooms.stream()
                .map(r -> StudyRoomResponse.fromEntity(r, activeBookings.get(r.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public StudyRoomResponse getRoom(String idOrCode) {
        StudyRoom room = findRoomByIdOrCode(idOrCode);
        RoomBooking activeBooking = bookingRepository.findActiveOrReservedByRoomId(room.getId())
                .stream()
                .findFirst()
                .orElse(null);
        return StudyRoomResponse.fromEntity(room, activeBooking);
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

        return StudyRoomResponse.fromEntity(room, booking);
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

        return StudyRoomResponse.fromEntity(room, booking);
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

        return StudyRoomResponse.fromEntity(room, null);
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
                .map(University::getId)
                .orElseGet(() -> universityRepository.findAll().stream()
                        .findFirst()
                        .map(University::getId)
                        .orElseThrow(() -> new ResourceNotFoundException("Default FBSU university tenant not initialized")));
    }
}
