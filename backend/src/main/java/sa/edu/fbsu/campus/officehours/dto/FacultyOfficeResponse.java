package sa.edu.fbsu.campus.officehours.dto;

import sa.edu.fbsu.campus.officehours.domain.FacultyOfficeProfile;
import sa.edu.fbsu.campus.officehours.domain.OfficeHourSlot;

import java.util.List;
import java.util.UUID;

public record FacultyOfficeResponse(
        UUID id,
        String profileCode,
        UUID facultyUserId,
        String universityNumber,
        String nameAr,
        String nameEn,
        String email,
        String rankAr,
        String rankEn,
        String collegeAr,
        String collegeEn,
        String officeLocation,
        String badgeAr,
        String badgeEn,
        String avatarColor,
        String daysTextAr,
        String daysTextEn,
        String nextAvailableAr,
        String nextAvailableEn,
        List<String> coursesSupervised,
        List<OfficeHourSlotDto> timeSlots
) {
    public static FacultyOfficeResponse fromEntity(FacultyOfficeProfile p, List<OfficeHourSlot> slots) {
        return new FacultyOfficeResponse(
                p.getId(),
                p.getProfileCode(),
                p.getFaculty().getId(),
                p.getFaculty().getUniversityNumber(),
                p.getFaculty().getFullNameAr(),
                p.getFaculty().getFullNameEn(),
                p.getFaculty().getEmail(),
                p.getRankAr(),
                p.getRankEn(),
                p.getCollegeAr(),
                p.getCollegeEn(),
                p.getOfficeLocation(),
                p.getBadgeAr(),
                p.getBadgeEn(),
                p.getAvatarColor(),
                p.getDaysTextAr(),
                p.getDaysTextEn(),
                nextAvailable(slots, true),
                nextAvailable(slots, false),
                p.getCoursesList(),
                slots.stream().map(OfficeHourSlotDto::fromEntity).toList()
        );
    }

    /**
     * The stored "next available" text was static seed copy ("Today: 01:30 PM") that went stale.
     * Derive it from the earliest upcoming free slot instead.
     */
    static String nextAvailable(List<OfficeHourSlot> slots, boolean arabic) {
        java.time.Instant now = java.time.Instant.now();
        return slots.stream()
                .filter(s -> s.isAvailable() && s.getStartTime() != null && s.getStartTime().isAfter(now))
                .min(java.util.Comparator.comparing(OfficeHourSlot::getStartTime))
                .map(s -> {
                    java.time.format.DateTimeFormatter day = java.time.format.DateTimeFormatter
                            .ofPattern(arabic ? "EEEE d MMMM" : "EEE d MMM",
                                    arabic ? java.util.Locale.forLanguageTag("ar") : java.util.Locale.ENGLISH)
                            .withZone(java.time.ZoneId.of("Asia/Riyadh"));
                    String time = arabic ? s.getTimeLabelAr() : s.getTimeLabelEn();
                    return day.format(s.getStartTime()) + " - " + time;
                })
                .orElse(arabic ? "لا توجد مواعيد قادمة متاحة" : "No upcoming slots");
    }
}
