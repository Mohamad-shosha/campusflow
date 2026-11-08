package sa.edu.fbsu.campus.officehours.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;
import sa.edu.fbsu.campus.identity.domain.User;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "office_hour_appointment")
public class OfficeHourAppointment extends BaseTenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    private FacultyOfficeProfile profile;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "slot_id", nullable = false)
    private OfficeHourSlot slot;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_user_id", nullable = false)
    private User student;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Column(name = "topic", nullable = false, length = 500)
    private String topic;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AppointmentStatus status = AppointmentStatus.CONFIRMED;

    protected OfficeHourAppointment() {
    }

    public OfficeHourAppointment(
            UUID universityId,
            FacultyOfficeProfile profile,
            OfficeHourSlot slot,
            User student,
            Instant startTime,
            Instant endTime,
            String topic
    ) {
        setUniversityId(universityId);
        this.profile = profile;
        this.slot = slot;
        this.student = student;
        this.startTime = startTime;
        this.endTime = endTime;
        this.topic = topic;
        this.status = AppointmentStatus.CONFIRMED;
    }

    public FacultyOfficeProfile getProfile() {
        return profile;
    }

    public OfficeHourSlot getSlot() {
        return slot;
    }

    public User getStudent() {
        return student;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public String getTopic() {
        return topic;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }
}
