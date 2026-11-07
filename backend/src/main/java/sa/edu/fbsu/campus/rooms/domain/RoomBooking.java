package sa.edu.fbsu.campus.rooms.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;
import sa.edu.fbsu.campus.identity.domain.User;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "room_booking")
public class RoomBooking extends BaseTenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private StudyRoom room;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "leader_user_id", nullable = false)
    private User leader;

    @Column(name = "team_members", nullable = false, length = 500)
    private String teamMembers;

    @Column(name = "purpose", nullable = false, length = 500)
    private String purpose;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Column(name = "start_label", nullable = false, length = 40)
    private String startLabel;

    @Column(name = "end_label", nullable = false, length = 40)
    private String endLabel;

    @Column(name = "extended_count", nullable = false)
    private int extendedCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RoomBookingStatus status = RoomBookingStatus.ACTIVE;

    protected RoomBooking() {
    }

    public RoomBooking(
            UUID universityId,
            StudyRoom room,
            User leader,
            List<String> teamMembers,
            String purpose,
            Instant startTime,
            Instant endTime,
            String startLabel,
            String endLabel,
            RoomBookingStatus status
    ) {
        setUniversityId(universityId);
        this.room = room;
        this.leader = leader;
        this.teamMembers = String.join("|", teamMembers);
        this.purpose = purpose;
        this.startTime = startTime;
        this.endTime = endTime;
        this.startLabel = startLabel;
        this.endLabel = endLabel;
        this.status = status;
    }

    public StudyRoom getRoom() {
        return room;
    }

    public User getLeader() {
        return leader;
    }

    public List<String> getTeamMembersList() {
        if (teamMembers == null || teamMembers.isBlank()) {
            return List.of();
        }
        return Arrays.stream(teamMembers.split("\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    public String getPurpose() {
        return purpose;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public String getStartLabel() {
        return startLabel;
    }

    public String getEndLabel() {
        return endLabel;
    }

    public void setEndLabel(String endLabel) {
        this.endLabel = endLabel;
    }

    public int getExtendedCount() {
        return extendedCount;
    }

    public void incrementExtendedCount() {
        this.extendedCount = this.extendedCount + 1;
    }

    public RoomBookingStatus getStatus() {
        return status;
    }

    public void setStatus(RoomBookingStatus status) {
        this.status = status;
    }
}

