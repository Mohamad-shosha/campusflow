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
                p.getNextAvailableAr(),
                p.getNextAvailableEn(),
                p.getCoursesList(),
                slots.stream().map(OfficeHourSlotDto::fromEntity).toList()
        );
    }
}
