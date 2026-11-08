-- ============================================================================
-- Migration V14: Admin Operations & Immutable Audit Log Schema
-- Phase P7-04: Admin API (spots, rooms, tariffs, users)
-- ============================================================================

-- 1. Extend parking spot status check constraint to include MAINTENANCE
ALTER TABLE parking_spot DROP CONSTRAINT IF EXISTS chk_parking_spot_status;
ALTER TABLE parking_spot ADD CONSTRAINT chk_parking_spot_status 
    CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'FLEX_SHARE', 'FACULTY_ASSIGNED', 'MAINTENANCE'));

-- 2. Create Admin Audit Log Table
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    actor_email VARCHAR(255) NOT NULL,
    actor_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    description_ar VARCHAR(500) NOT NULL,
    description_en VARCHAR(500) NOT NULL,
    details_json TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_actor ON admin_audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_entity ON admin_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);
