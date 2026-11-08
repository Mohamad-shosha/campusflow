-- ============================================================================
-- Migration V11: Faculty Office Hours Windows & Conflict-Free Appointments
-- Phase P6-04: Office-hours schema + API (windows, appointments)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE faculty_office_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    profile_code VARCHAR(40) NOT NULL UNIQUE,
    faculty_user_id UUID NOT NULL UNIQUE REFERENCES app_user(id) ON DELETE CASCADE,
    rank_ar VARCHAR(180) NOT NULL,
    rank_en VARCHAR(180) NOT NULL,
    college_ar VARCHAR(150) NOT NULL,
    college_en VARCHAR(150) NOT NULL,
    office_location VARCHAR(200) NOT NULL,
    badge_ar VARCHAR(80) NOT NULL,
    badge_en VARCHAR(80) NOT NULL,
    avatar_color VARCHAR(20) NOT NULL DEFAULT '#116E63',
    days_text_ar VARCHAR(160) NOT NULL,
    days_text_en VARCHAR(160) NOT NULL,
    next_available_ar VARCHAR(120) NOT NULL,
    next_available_en VARCHAR(120) NOT NULL,
    supervised_courses VARCHAR(1000) NOT NULL,
    display_order INT NOT NULL DEFAULT 1,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_faculty_office_profile_uni ON faculty_office_profile(university_id, display_order);

CREATE TABLE office_hour_slot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES faculty_office_profile(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    time_label_ar VARCHAR(40) NOT NULL,
    time_label_en VARCHAR(40) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 15,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    booked_note VARCHAR(255),
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_office_slot_time CHECK (end_time > start_time),
    CONSTRAINT chk_office_slot_duration CHECK (duration_minutes >= 5 AND duration_minutes <= 120),
    CONSTRAINT no_overlapping_faculty_slots EXCLUDE USING gist (
        profile_id WITH =,
        tstzrange(start_time, end_time, '[)') WITH &&
    )
);

CREATE INDEX idx_office_hour_slot_profile ON office_hour_slot(profile_id, start_time);

CREATE TABLE office_hour_appointment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES faculty_office_profile(id) ON DELETE CASCADE,
    slot_id UUID NOT NULL REFERENCES office_hour_slot(id) ON DELETE CASCADE,
    student_user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    topic VARCHAR(500) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_office_appt_time CHECK (end_time > start_time),
    CONSTRAINT chk_office_appt_status CHECK (status IN ('CONFIRMED', 'CANCELLED')),
    CONSTRAINT no_overlapping_faculty_appointments EXCLUDE USING gist (
        profile_id WITH =,
        tstzrange(start_time, end_time, '[)') WITH &&
    ) WHERE (status = 'CONFIRMED')
);

CREATE INDEX idx_office_appt_student ON office_hour_appointment(student_user_id, status);
CREATE INDEX idx_office_appt_profile ON office_hour_appointment(profile_id, status);
