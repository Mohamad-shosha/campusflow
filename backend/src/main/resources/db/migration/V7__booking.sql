-- ============================================================================
-- Migration V7: Parking Bookings & Concurrency Control
-- Phase P5-03: Booking + pricing + digital pass
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE parking_booking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    spot_id UUID NOT NULL REFERENCES parking_spot(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicle(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_hours NUMERIC(4, 1) NOT NULL,
    rate_per_hour NUMERIC(10, 2) NOT NULL DEFAULT 5.75,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'SAR',
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
    digital_pass_code VARCHAR(50) NOT NULL UNIQUE,
    qr_token VARCHAR(255) NOT NULL UNIQUE,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_booking_time_valid CHECK (end_time > start_time),
    CONSTRAINT chk_booking_amount_non_negative CHECK (total_amount >= 0.00),
    CONSTRAINT chk_booking_status_valid CHECK (status IN ('CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),

    -- Exclusion constraint preventing overlapping active bookings on the same parking bay
    CONSTRAINT no_overlapping_active_bookings EXCLUDE USING gist (
        spot_id WITH =,
        tstzrange(start_time, end_time, '[)') WITH &&
    ) WHERE (status IN ('CONFIRMED', 'ACTIVE'))
);

CREATE INDEX idx_parking_booking_user ON parking_booking(user_id, status);
CREATE INDEX idx_parking_booking_spot ON parking_booking(spot_id, start_time, end_time);
CREATE INDEX idx_parking_booking_pass_code ON parking_booking(digital_pass_code);
