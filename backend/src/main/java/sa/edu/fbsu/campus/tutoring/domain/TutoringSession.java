package sa.edu.fbsu.campus.tutoring.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;
import sa.edu.fbsu.campus.identity.domain.User;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Entity
@Table(name = "tutoring_session")
public class TutoringSession extends BaseTenantEntity {

    @Column(name = "session_code", nullable = false, unique = true, length = 30)
    private String sessionCode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tutor_user_id", nullable = false)
    private User tutor;

    @Column(name = "tutor_role_ar", nullable = false, length = 150)
    private String tutorRoleAr;

    @Column(name = "tutor_role_en", nullable = false, length = 150)
    private String tutorRoleEn;

    @Column(name = "tutor_avatar_color", nullable = false, length = 20)
    private String tutorAvatarColor = "#116E63";

    @Column(name = "course_code", nullable = false, length = 60)
    private String courseCode;

    @Column(name = "course_name_ar", nullable = false, length = 220)
    private String courseNameAr;

    @Column(name = "course_name_en", nullable = false, length = 220)
    private String courseNameEn;

    @Column(name = "covered_lectures", nullable = false, length = 255)
    private String coveredLectures;

    @Column(name = "covered_scope", nullable = false, length = 1000)
    private String coveredScope;

    @Column(name = "category", nullable = false, length = 40)
    private String category;

    @Column(name = "hourly_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(name = "duration_hours", nullable = false, precision = 4, scale = 2)
    private BigDecimal durationHours;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency = "SAR";

    @Column(name = "schedule_text", nullable = false, length = 160)
    private String scheduleText;

    @Column(name = "location", nullable = false, length = 220)
    private String location;

    @Column(name = "max_capacity", nullable = false)
    private int maxCapacity = 10;

    @Column(name = "rating", nullable = false, precision = 3, scale = 2)
    private BigDecimal rating = new BigDecimal("5.00");

    @Column(name = "reviews_count", nullable = false)
    private int reviewsCount = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TutoringSessionStatus status = TutoringSessionStatus.OPEN;

    protected TutoringSession() {
    }

    public TutoringSession(
            UUID universityId,
            String sessionCode,
            User tutor,
            String tutorRoleAr,
            String tutorRoleEn,
            String tutorAvatarColor,
            String courseCode,
            String courseNameAr,
            String courseNameEn,
            String coveredLectures,
            String coveredScope,
            String category,
            BigDecimal hourlyRate,
            BigDecimal durationHours,
            String scheduleText,
            String location,
            int maxCapacity
    ) {
        setUniversityId(universityId);
        this.sessionCode = sessionCode;
        this.tutor = tutor;
        this.tutorRoleAr = tutorRoleAr;
        this.tutorRoleEn = tutorRoleEn;
        this.tutorAvatarColor = tutorAvatarColor != null ? tutorAvatarColor : "#116E63";
        this.courseCode = courseCode;
        this.courseNameAr = courseNameAr;
        this.courseNameEn = courseNameEn;
        this.coveredLectures = coveredLectures;
        this.coveredScope = coveredScope;
        this.category = category.toLowerCase();
        this.hourlyRate = hourlyRate.setScale(2, RoundingMode.HALF_UP);
        this.durationHours = durationHours.setScale(2, RoundingMode.HALF_UP);
        this.totalPrice = this.hourlyRate.multiply(this.durationHours).setScale(2, RoundingMode.HALF_UP);
        this.scheduleText = scheduleText;
        this.location = location;
        this.maxCapacity = maxCapacity;
        this.status = TutoringSessionStatus.OPEN;
    }

    public String getSessionCode() {
        return sessionCode;
    }

    public User getTutor() {
        return tutor;
    }

    public String getTutorRoleAr() {
        return tutorRoleAr;
    }

    public String getTutorRoleEn() {
        return tutorRoleEn;
    }

    public String getTutorAvatarColor() {
        return tutorAvatarColor;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public String getCourseNameAr() {
        return courseNameAr;
    }

    public String getCourseNameEn() {
        return courseNameEn;
    }

    public String getCoveredLectures() {
        return coveredLectures;
    }

    public String getCoveredScope() {
        return coveredScope;
    }

    public String getCategory() {
        return category;
    }

    public BigDecimal getHourlyRate() {
        return hourlyRate;
    }

    public BigDecimal getDurationHours() {
        return durationHours;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public String getCurrency() {
        return currency;
    }

    public String getScheduleText() {
        return scheduleText;
    }

    public String getLocation() {
        return location;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }

    public BigDecimal getRating() {
        return rating;
    }

    public void setRating(BigDecimal rating) {
        this.rating = rating;
    }

    public int getReviewsCount() {
        return reviewsCount;
    }

    public void setReviewsCount(int reviewsCount) {
        this.reviewsCount = reviewsCount;
    }

    public TutoringSessionStatus getStatus() {
        return status;
    }

    public void setStatus(TutoringSessionStatus status) {
        this.status = status;
    }
}

