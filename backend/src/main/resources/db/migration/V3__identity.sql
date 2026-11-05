-- ============================================================================
-- V3__identity.sql: Users, Roles, Saudi Vehicles & Refresh Tokens Schema
-- Multi-tenant identity schema with Saudi license plate normalization
-- ============================================================================

-- 1. App User Table
CREATE TABLE IF NOT EXISTS app_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE RESTRICT,
    university_number VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    full_name_ar VARCHAR(255) NOT NULL,
    full_name_en VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    user_type VARCHAR(30) NOT NULL DEFAULT 'STUDENT',
    college_id UUID REFERENCES college(id) ON DELETE SET NULL,
    locale VARCHAR(10) NOT NULL DEFAULT 'ar',
    theme VARCHAR(10) NOT NULL DEFAULT 'dark',
    specialty VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_user_tenant_uni_number UNIQUE (university_id, university_number),
    CONSTRAINT uq_user_email UNIQUE (email),
    CONSTRAINT chk_user_status CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'GRADUATED')),
    CONSTRAINT chk_user_type CHECK (user_type IN ('STUDENT', 'FACULTY', 'STAFF'))
);

CREATE INDEX IF NOT EXISTS idx_user_university_id ON app_user(university_id);
CREATE INDEX IF NOT EXISTS idx_user_college_id ON app_user(college_id);
CREATE INDEX IF NOT EXISTS idx_user_email ON app_user(email);

-- 2. User Roles Join Table
CREATE TABLE IF NOT EXISTS user_role (
    user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role),
    CONSTRAINT chk_role_name CHECK (role IN ('STUDENT', 'FACULTY', 'DEPARTMENT_CHAIR', 'CAMPUS_ADMIN', 'SECURITY_OFFICER', 'STAFF'))
);

CREATE INDEX IF NOT EXISTS idx_user_role_role ON user_role(role);

-- 3. Vehicle Table (Saudi License Plate standard: 3 letters + 1-4 digits)
CREATE TABLE IF NOT EXISTS vehicle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    plate_letters_ar VARCHAR(10) NOT NULL,
    plate_letters_en VARCHAR(10) NOT NULL,
    plate_digits VARCHAR(10) NOT NULL,
    make_model VARCHAR(100),
    color VARCHAR(50),
    is_primary BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_vehicle_tenant_plate UNIQUE (university_id, plate_letters_ar, plate_digits)
);

CREATE INDEX IF NOT EXISTS idx_vehicle_user_id ON vehicle(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_tenant_plate ON vehicle(university_id, plate_letters_ar, plate_digits);
CREATE INDEX IF NOT EXISTS idx_vehicle_plate_digits ON vehicle(plate_digits);

-- 4. Refresh Token Table (with rotation and revocation tracking)
CREATE TABLE IF NOT EXISTS refresh_token (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    replaced_by_token_hash VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_refresh_token_hash UNIQUE (token_hash)
);

CREATE INDEX IF NOT EXISTS idx_refresh_token_user_id ON refresh_token(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_token_hash ON refresh_token(token_hash);

