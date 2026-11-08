package sa.edu.fbsu.campus.officehours.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "office_hour_slot")
public class OfficeHourSlot extends BaseTenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "profile_id", nullable = false)
    private FacultyOfficeProfile profile;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Column(name = "time_label_ar", nullable = false, length = 40)
    private String timeLabelAr;

    @Column(name = "time_label_en", nullable = false, length = 40)
    private String timeLabelEn;

    @Column(name = "duration_minutes", nullable = false)
    private int durationMinutes;

    @Column(name = "available", nullable = false)
    private boolean available = true;

    @Column(name = "booked_note", length = 255)
    private String bookedNote;

    protected OfficeHourSlot() {
    }

    public OfficeHourSlot(
            UUID universityId,
            FacultyOfficeProfile profile,
            Instant startTime,
            Instant endTime,
            String timeLabelAr,
            String timeLabelEn,
            int durationMinutes,
            boolean available,
            String bookedNote
    ) {
        setUniversityId(universityId);
        this.profile = profile;
        this.startTime = startTime;
        this.endTime = endTime;
        this.timeLabelAr = timeLabelAr;
        this.timeLabelEn = timeLabelEn;
        this.durationMinutes = durationMinutes;
        this.available = available;
        this.bookedNote = bookedNote;
    }

    public FacultyOfficeProfile getProfile() {
        return profile;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public String getTimeLabelAr() {
        return timeLabelAr;
    }

    public String getTimeLabelEn() {
        return timeLabelEn;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getBookedNote() {
        return bookedNote;
    }

    public void setBookedNote(String bookedNote) {
        this.bookedNote = bookedNote;
    }
}
