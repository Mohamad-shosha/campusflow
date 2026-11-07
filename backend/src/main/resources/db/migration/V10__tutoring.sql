-- ============================================================================
-- Migration V10: Peer Tutoring Sessions & Enrollments
-- Phase P6-01 & P6-02: Tutoring schema, session marketplace, and enrollments
-- ============================================================================

CREATE TABLE tutoring_session (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    session_code VARCHAR(30) NOT NULL UNIQUE,
    tutor_user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    tutor_role_ar VARCHAR(150) NOT NULL,
    tutor_role_en VARCHAR(150) NOT NULL,
    tutor_avatar_color VARCHAR(20) NOT NULL DEFAULT '#116E63',
    course_code VARCHAR(60) NOT NULL,
    course_name_ar VARCHAR(220) NOT NULL,
    course_name_en VARCHAR(220) NOT NULL,
    covered_lectures VARCHAR(255) NOT NULL,
    covered_scope VARCHAR(1000) NOT NULL,
    category VARCHAR(40) NOT NULL,
    hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 70.00,
    duration_hours NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
    total_price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'SAR',
    schedule_text VARCHAR(160) NOT NULL,
    location VARCHAR(220) NOT NULL,
    max_capacity INT NOT NULL DEFAULT 10,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    reviews_count INT NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_tutoring_category CHECK (category IN ('math', 'programming', 'hardware', 'science', 'general')),
    CONSTRAINT chk_tutoring_rate_positive CHECK (hourly_rate > 0.00 AND duration_hours > 0.00 AND total_price > 0.00),
    CONSTRAINT chk_tutoring_capacity CHECK (max_capacity >= 1),
    CONSTRAINT chk_tutoring_status CHECK (status IN ('OPEN', 'BOOKED', 'COMPLETED', 'CANCELLED'))
);

CREATE INDEX idx_tutoring_session_uni_cat ON tutoring_session(university_id, category, status);
CREATE INDEX idx_tutoring_session_tutor ON tutoring_session(tutor_user_id);

CREATE TABLE tutoring_enrollment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES tutoring_session(id) ON DELETE CASCADE,
    student_user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    amount_paid NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'SAR',
    idempotency_key VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_tutoring_session_student UNIQUE (session_id, student_user_id),
    CONSTRAINT chk_tutoring_enrollment_amount CHECK (amount_paid >= 0.00),
    CONSTRAINT chk_tutoring_enrollment_status CHECK (status IN ('CONFIRMED', 'CANCELLED'))
);

CREATE INDEX idx_tutoring_enrollment_session ON tutoring_enrollment(session_id, status);
CREATE INDEX idx_tutoring_enrollment_student ON tutoring_enrollment(student_user_id, status);

