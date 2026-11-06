package sa.edu.fbsu.campus.parking.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "spot_assignment")
public class SpotAssignment extends BaseTenantEntity {

    @Column(name = "spot_id", nullable = false)
    private UUID spotId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "assignment_type", nullable = false, length = 30)
    private String assignmentType = "FACULTY_DEDICATED";

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    protected SpotAssignment() {
    }

    public SpotAssignment(
            UUID universityId,
            UUID spotId,
            UUID userId,
            String assignmentType,
            LocalDate startDate,
            LocalDate endDate) {
        setUniversityId(universityId);
        this.spotId = spotId;
        this.userId = userId;
        this.assignmentType = assignmentType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = true;
    }

    public UUID getSpotId() {
        return spotId;
    }

    public void setSpotId(UUID spotId) {
        this.spotId = spotId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getAssignmentType() {
        return assignmentType;
    }

    public void setAssignmentType(String assignmentType) {
        this.assignmentType = assignmentType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
