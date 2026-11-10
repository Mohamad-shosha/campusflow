package sa.edu.fbsu.campus.tutoring.domain;

import jakarta.persistence.*;
import sa.edu.fbsu.campus.common.domain.BaseTenantEntity;
import sa.edu.fbsu.campus.identity.domain.User;

import java.util.UUID;

@Entity
@Table(name = "tutoring_review", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"session_id", "student_user_id"})
})
public class TutoringReview extends BaseTenantEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private TutoringSession session;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_user_id", nullable = false)
    private User student;

    @Column(name = "rating", nullable = false)
    private int rating;

    @Column(name = "comment", length = 500)
    private String comment;

    protected TutoringReview() {
    }

    public TutoringReview(UUID universityId, TutoringSession session, User student, int rating, String comment) {
        setUniversityId(universityId);
        this.session = session;
        this.student = student;
        this.rating = rating;
        this.comment = comment != null && !comment.isBlank() ? comment.trim() : null;
    }

    public TutoringSession getSession() {
        return session;
    }

    public User getStudent() {
        return student;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }
}

