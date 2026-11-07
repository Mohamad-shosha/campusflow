package sa.edu.fbsu.campus.officehours.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;
import sa.edu.fbsu.campus.identity.domain.User;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "faculty_office_profile")
public class FacultyOfficeProfile extends BaseTenantEntity {

    @Column(name = "profile_code", nullable = false, unique = true, length = 40)
    private String profileCode;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "faculty_user_id", nullable = false, unique = true)
    private User faculty;

    @Column(name = "rank_ar", nullable = false, length = 180)
    private String rankAr;

    @Column(name = "rank_en", nullable = false, length = 180)
    private String rankEn;

    @Column(name = "college_ar", nullable = false, length = 150)
    private String collegeAr;

    @Column(name = "college_en", nullable = false, length = 150)
    private String collegeEn;

    @Column(name = "office_location", nullable = false, length = 200)
    private String officeLocation;

    @Column(name = "badge_ar", nullable = false, length = 80)
    private String badgeAr;

    @Column(name = "badge_en", nullable = false, length = 80)
    private String badgeEn;

    @Column(name = "avatar_color", nullable = false, length = 20)
    private String avatarColor = "#116E63";

    @Column(name = "days_text_ar", nullable = false, length = 160)
    private String daysTextAr;

    @Column(name = "days_text_en", nullable = false, length = 160)
    private String daysTextEn;

    @Column(name = "next_available_ar", nullable = false, length = 120)
    private String nextAvailableAr;

    @Column(name = "next_available_en", nullable = false, length = 120)
    private String nextAvailableEn;

    @Column(name = "supervised_courses", nullable = false, length = 1000)
    private String supervisedCourses;

    @Column(name = "display_order", nullable = false)
    private int displayOrder = 1;

    protected FacultyOfficeProfile() {
    }

    public FacultyOfficeProfile(
            UUID universityId,
            String profileCode,
            User faculty,
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
            List<String> courses,
            int displayOrder
    ) {
        setUniversityId(universityId);
        this.profileCode = profileCode;
        this.faculty = faculty;
        this.rankAr = rankAr;
        this.rankEn = rankEn;
        this.collegeAr = collegeAr;
        this.collegeEn = collegeEn;
        this.officeLocation = officeLocation;
        this.badgeAr = badgeAr;
        this.badgeEn = badgeEn;
        this.avatarColor = avatarColor;
        this.daysTextAr = daysTextAr;
        this.daysTextEn = daysTextEn;
        this.nextAvailableAr = nextAvailableAr;
        this.nextAvailableEn = nextAvailableEn;
        this.supervisedCourses = String.join("|", courses);
        this.displayOrder = displayOrder;
    }

    public String getProfileCode() {
        return profileCode;
    }

    public User getFaculty() {
        return faculty;
    }

    public String getRankAr() {
        return rankAr;
    }

    public String getRankEn() {
        return rankEn;
    }

    public String getCollegeAr() {
        return collegeAr;
    }

    public String getCollegeEn() {
        return collegeEn;
    }

    public String getOfficeLocation() {
        return officeLocation;
    }

    public String getBadgeAr() {
        return badgeAr;
    }

    public String getBadgeEn() {
        return badgeEn;
    }

    public String getAvatarColor() {
        return avatarColor;
    }

    public String getDaysTextAr() {
        return daysTextAr;
    }

    public String getDaysTextEn() {
        return daysTextEn;
    }

    public String getNextAvailableAr() {
        return nextAvailableAr;
    }

    public String getNextAvailableEn() {
        return nextAvailableEn;
    }

    public List<String> getCoursesList() {
        if (supervisedCourses == null || supervisedCourses.isBlank()) {
            return List.of();
        }
        return Arrays.stream(supervisedCourses.split("\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    public int getDisplayOrder() {
        return displayOrder;
    }
}
