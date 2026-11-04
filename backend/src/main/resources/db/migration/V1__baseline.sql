-- ============================================================================
-- V1__baseline.sql: FBSU Smart Campus PostgreSQL Extensions Baseline
-- Sets up core cryptographic and spatial/temporal exclusion index capabilities
-- ============================================================================

-- Enables UUID generation functions like gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enables btree_gist extension for PostgreSQL exclusion constraints (tstzrange overlap prevention)
-- Critical for preventing double-booking of parking spots and study rooms
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Baseline schema confirmation check
CREATE TABLE IF NOT EXISTS schema_baseline_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_name VARCHAR(120) NOT NULL,
    version VARCHAR(30) NOT NULL,
    initialized_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_baseline_info (platform_name, version)
VALUES ('FBSU Smart Campus & Parking Platform', '1.0.0-BASELINE')
ON CONFLICT DO NOTHING;

