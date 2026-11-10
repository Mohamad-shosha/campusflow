package sa.edu.fbsu.campus.rooms.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "study_room")
public class StudyRoom extends BaseTenantEntity {

    @Column(name = "room_code", nullable = false, unique = true, length = 30)
    private String roomCode;

    @Column(name = "name_ar", nullable = false, length = 200)
    private String nameAr;

    @Column(name = "name_en", nullable = false, length = 200)
    private String nameEn;

    @Column(name = "building_ar", nullable = false, length = 180)
    private String buildingAr;

    @Column(name = "building_en", nullable = false, length = 180)
    private String buildingEn;

    @Column(name = "capacity_ar", nullable = false, length = 120)
    private String capacityAr;

    @Column(name = "capacity_en", nullable = false, length = 120)
    private String capacityEn;

    @Column(name = "type_badge_ar", nullable = false, length = 80)
    private String typeBadgeAr;

    @Column(name = "type_badge_en", nullable = false, length = 80)
    private String typeBadgeEn;

    @Column(name = "specs_ar", nullable = false, length = 1200)
    private String specsAr;

    @Column(name = "specs_en", nullable = false, length = 1200)
    private String specsEn;

    @Column(name = "available_from_ar", nullable = false, length = 140)
    private String availableFromAr;

    @Column(name = "available_from_en", nullable = false, length = 140)
    private String availableFromEn;

    @Column(name = "requirement_note_ar", length = 400)
    private String requirementNoteAr;

    @Column(name = "requirement_note_en", length = 400)
    private String requirementNoteEn;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RoomStatus status = RoomStatus.AVAILABLE;

    @Column(name = "display_order", nullable = false)
    private int displayOrder = 1;

    protected StudyRoom() {
    }

    public StudyRoom(
            UUID universityId,
            String roomCode,
            String nameAr,
            String nameEn,
            String buildingAr,
            String buildingEn,
            String capacityAr,
            String capacityEn,
            String typeBadgeAr,
            String typeBadgeEn,
            List<String> specsAr,
            List<String> specsEn,
            String availableFromAr,
            String availableFromEn,
            RoomStatus status,
            int displayOrder
    ) {
        setUniversityId(universityId);
        this.roomCode = roomCode;
        this.nameAr = nameAr;
        this.nameEn = nameEn;
        this.buildingAr = buildingAr;
        this.buildingEn = buildingEn;
        this.capacityAr = capacityAr;
        this.capacityEn = capacityEn;
        this.typeBadgeAr = typeBadgeAr;
        this.typeBadgeEn = typeBadgeEn;
        this.specsAr = String.join("|", specsAr);
        this.specsEn = String.join("|", specsEn);
        this.availableFromAr = availableFromAr;
        this.availableFromEn = availableFromEn;
        this.status = status;
        this.displayOrder = displayOrder;
    }

    public String getRoomCode() {
        return roomCode;
    }

    public String getNameAr() {
        return nameAr;
    }

    public String getNameEn() {
        return nameEn;
    }

    public String getBuildingAr() {
        return buildingAr;
    }

    public String getBuildingEn() {
        return buildingEn;
    }

    public String getCapacityAr() {
        return capacityAr;
    }

    public String getCapacityEn() {
        return capacityEn;
    }

    public String getTypeBadgeAr() {
        return typeBadgeAr;
    }

    public String getTypeBadgeEn() {
        return typeBadgeEn;
    }

    public List<String> getSpecsArList() {
        return splitPipe(specsAr);
    }

    public List<String> getSpecsEnList() {
        return splitPipe(specsEn);
    }

    public void setNameAr(String nameAr) {
        this.nameAr = nameAr;
    }

    public void setNameEn(String nameEn) {
        this.nameEn = nameEn;
    }

    public void setBuildingAr(String buildingAr) {
        this.buildingAr = buildingAr;
    }

    public void setBuildingEn(String buildingEn) {
        this.buildingEn = buildingEn;
    }

    public void setCapacityAr(String capacityAr) {
        this.capacityAr = capacityAr;
    }

    public void setCapacityEn(String capacityEn) {
        this.capacityEn = capacityEn;
    }

    public void setTypeBadgeAr(String typeBadgeAr) {
        this.typeBadgeAr = typeBadgeAr;
    }

    public void setTypeBadgeEn(String typeBadgeEn) {
        this.typeBadgeEn = typeBadgeEn;
    }

    public void setSpecsArList(List<String> specs) {
        this.specsAr = specs != null ? String.join("|", specs) : "";
    }

    public void setSpecsEnList(List<String> specs) {
        this.specsEn = specs != null ? String.join("|", specs) : "";
    }

    public void setDisplayOrder(int displayOrder) {
        this.displayOrder = displayOrder;
    }

    public String getAvailableFromAr() {
        return availableFromAr;
    }

    public void setAvailableFromAr(String availableFromAr) {
        this.availableFromAr = availableFromAr;
    }

    public String getAvailableFromEn() {
        return availableFromEn;
    }

    public void setAvailableFromEn(String availableFromEn) {
        this.availableFromEn = availableFromEn;
    }

    public String getRequirementNoteAr() {
        return requirementNoteAr;
    }

    public void setRequirementNoteAr(String requirementNoteAr) {
        this.requirementNoteAr = requirementNoteAr;
    }

    public String getRequirementNoteEn() {
        return requirementNoteEn;
    }

    public void setRequirementNoteEn(String requirementNoteEn) {
        this.requirementNoteEn = requirementNoteEn;
    }

    public RoomStatus getStatus() {
        return status;
    }

    public void setStatus(RoomStatus status) {
        this.status = status;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    private static List<String> splitPipe(String raw) {
        if (raw == null || raw.isBlank()) {
            return List.of();
        }
        return Arrays.stream(raw.split("\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}

