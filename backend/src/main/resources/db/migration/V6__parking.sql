-- ============================================================================
-- V6__parking.sql: Smart Parking Zones, Spots, Tariffs & Assignments Schema
-- Supports 30 smart bays, 4 campus zones, tariffs, assignments, and flex status
-- ============================================================================

-- 1. Parking Zones Table
CREATE TABLE IF NOT EXISTS parking_zone (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE RESTRICT,
    code VARCHAR(20) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    college_id UUID REFERENCES college(id) ON DELETE SET NULL,
    total_spots INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_parking_zone_tenant_code UNIQUE (university_id, code)
);

CREATE INDEX IF NOT EXISTS idx_parking_zone_university_id ON parking_zone(university_id);
CREATE INDEX IF NOT EXISTS idx_parking_zone_code ON parking_zone(code);

-- 2. Parking Spots Table (30 bays with live state, vehicle info, and distance)
CREATE TABLE IF NOT EXISTS parking_spot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE RESTRICT,
    zone_id UUID NOT NULL REFERENCES parking_zone(id) ON DELETE CASCADE,
    bay_number INT NOT NULL,
    spot_type VARCHAR(30) NOT NULL DEFAULT 'STANDARD',
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    distance_meters INT NOT NULL DEFAULT 30,
    is_flex_eligible BOOLEAN NOT NULL DEFAULT false,
    current_occupant_id UUID REFERENCES app_user(id) ON DELETE SET NULL,
    occupant_name_ar VARCHAR(255),
    occupant_name_en VARCHAR(255),
    vehicle_model VARCHAR(100),
    plate_letters_ar VARCHAR(10),
    plate_digits VARCHAR(10),
    time_left_text VARCHAR(100),
    session_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_parking_spot_bay_number UNIQUE (university_id, bay_number),
    CONSTRAINT chk_parking_spot_bay_range CHECK (bay_number BETWEEN 1 AND 100),
    CONSTRAINT chk_parking_spot_type CHECK (spot_type IN ('STANDARD', 'FACULTY', 'EV_CHARGING', 'ACCESSIBLE')),
    CONSTRAINT chk_parking_spot_status CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'FLEX_SHARE', 'FACULTY_ASSIGNED'))
);

CREATE INDEX IF NOT EXISTS idx_parking_spot_university_id ON parking_spot(university_id);
CREATE INDEX IF NOT EXISTS idx_parking_spot_zone_id ON parking_spot(zone_id);
CREATE INDEX IF NOT EXISTS idx_parking_spot_bay_number ON parking_spot(bay_number);
CREATE INDEX IF NOT EXISTS idx_parking_spot_status ON parking_spot(status);

-- 3. Parking Tariffs Table (Per-user-type tariff with flex cashback rates)
CREATE TABLE IF NOT EXISTS parking_tariff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE RESTRICT,
    user_type VARCHAR(30) NOT NULL,
    hourly_rate NUMERIC(10, 2) NOT NULL DEFAULT 5.75,
    daily_cap NUMERIC(10, 2) NOT NULL DEFAULT 25.00,
    flex_cashback_rate NUMERIC(10, 2) NOT NULL DEFAULT 5.75,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_parking_tariff_user_type UNIQUE (university_id, user_type),
    CONSTRAINT chk_parking_tariff_user_type CHECK (user_type IN ('STUDENT', 'FACULTY', 'STAFF', 'GUEST'))
);

CREATE INDEX IF NOT EXISTS idx_parking_tariff_university_id ON parking_tariff(university_id);

-- 4. Dedicated Spot Assignments Table
CREATE TABLE IF NOT EXISTS spot_assignment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE RESTRICT,
    spot_id UUID NOT NULL REFERENCES parking_spot(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    assignment_type VARCHAR(30) NOT NULL DEFAULT 'FACULTY_DEDICATED',
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_spot_assignment_active UNIQUE (spot_id, is_active)
);

CREATE INDEX IF NOT EXISTS idx_spot_assignment_spot_id ON spot_assignment(spot_id);
CREATE INDEX IF NOT EXISTS idx_spot_assignment_user_id ON spot_assignment(user_id);
