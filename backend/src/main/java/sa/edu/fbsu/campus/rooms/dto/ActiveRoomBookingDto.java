package sa.edu.fbsu.campus.rooms.dto;

import sa.edu.fbsu.campus.rooms.domain.RoomBooking;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ActiveRoomBookingDto(
        UUID bookingId,
        UUID leaderUserId,
        String leaderUniversityNumber,
        String teamLead,
        String teamLeadEn,
        List<String> teamMembers,
        String purpose,
        Instant startTime,
        Instant endTime,
        String startLabel,
        String endLabel,
        int totalMinutes,
        int remainingMinutes,
        int extendedCount,
        String status
) {
    public static ActiveRoomBookingDto fromEntity(RoomBooking b) {
        long total = Math.max(1L, Duration.between(b.getStartTime(), b.getEndTime()).toMinutes());
        long remainingRaw = Duration.between(Instant.now(), b.getEndTime()).toMinutes();
        int remaining = (int) Math.max(1L, Math.min(total, remainingRaw));

        return new ActiveRoomBookingDto(
                b.getId(),
                b.getLeader().getId(),
                b.getLeader().getUniversityNumber(),
                b.getLeader().getFullNameAr(),
                b.getLeader().getFullNameEn(),
                b.getTeamMembersList(),
                b.getPurpose(),
                b.getStartTime(),
                b.getEndTime(),
                b.getStartLabel(),
                b.getEndLabel(),
                (int) total,
                remaining,
                b.getExtendedCount(),
                b.getStatus().name()
        );
    }

    /** Rooms are listed publicly: hide who booked from anyone but the leader and staff. */
    public ActiveRoomBookingDto visibleTo(UUID viewerUserId, boolean staff) {
        if (staff || (viewerUserId != null && viewerUserId.equals(leaderUserId))) {
            return this;
        }
        return new ActiveRoomBookingDto(bookingId, leaderUserId, null, null, null, List.of(), purpose,
                startTime, endTime, startLabel, endLabel, totalMinutes, remainingMinutes, extendedCount, status);
    }
}
