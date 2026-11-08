-- ============================================================================
-- Migration V12: Collaborative Study Rooms, Labs & Conflict-Free Team Bookings
-- Phase P6-06: Rooms schema + booking API (extend/release)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE study_room (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    room_code VARCHAR(30) NOT NULL UNIQUE,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    building_ar VARCHAR(180) NOT NULL,
    building_en VARCHAR(180) NOT NULL,
    capacity_ar VARCHAR(120) NOT NULL,
    capacity_en VARCHAR(120) NOT NULL,
    type_badge_ar VARCHAR(80) NOT NULL,
    type_badge_en VARCHAR(80) NOT NULL,
    specs_ar VARCHAR(1200) NOT NULL,
    specs_en VARCHAR(1200) NOT NULL,
    available_from_ar VARCHAR(140) NOT NULL,
    available_from_en VARCHAR(140) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    display_order INT NOT NULL DEFAULT 1,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_study_room_status CHECK (status IN ('AVAILABLE', 'IN_USE', 'RESERVED', 'MAINTENANCE'))
);

CREATE INDEX idx_study_room_uni_order ON study_room(university_id, display_order);

CREATE TABLE room_booking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES study_room(id) ON DELETE CASCADE,
    leader_user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    team_members VARCHAR(500) NOT NULL,
    purpose VARCHAR(500) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    start_label VARCHAR(40) NOT NULL,
    end_label VARCHAR(40) NOT NULL,
    extended_count INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_room_booking_time CHECK (end_time > start_time),
    CONSTRAINT chk_room_booking_extensions CHECK (extended_count >= 0 AND extended_count <= 3),
    CONSTRAINT chk_room_booking_status CHECK (status IN ('ACTIVE', 'RESERVED', 'RELEASED', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT no_overlapping_room_bookings EXCLUDE USING gist (
        room_id WITH =,
        tstzrange(start_time, end_time, '[)') WITH &&
    ) WHERE (status IN ('ACTIVE', 'RESERVED'))
);

CREATE INDEX idx_room_booking_room_status ON room_booking(room_id, status, start_time);
CREATE INDEX idx_room_booking_leader ON room_booking(leader_user_id, status);

