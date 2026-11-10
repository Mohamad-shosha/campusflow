-- ============================================================================
-- Migration V16: Transit Demo Data Provenance & Route INACTIVE Lifecycle
-- Implements ADR-0004 (Option C, non-destructive provenance & retirement support)
-- ============================================================================

-- 1. Add provenance column 'source' to transit_route and shuttle_bus
ALTER TABLE transit_route
    ADD COLUMN IF NOT EXISTS source VARCHAR(20) NOT NULL DEFAULT 'MANUAL';

ALTER TABLE shuttle_bus
    ADD COLUMN IF NOT EXISTS source VARCHAR(20) NOT NULL DEFAULT 'MANUAL';

-- 2. Widen chk_transit_route_status constraint to permit 'INACTIVE' for non-destructive retirement
ALTER TABLE transit_route
    DROP CONSTRAINT IF EXISTS chk_transit_route_status;

ALTER TABLE transit_route
    ADD CONSTRAINT chk_transit_route_status
        CHECK (status IN ('ACTIVE', 'MAINTENANCE', 'OFF_PEAK', 'INACTIVE'));

-- 3. Backfill provenance = 'DEMO_V15' on rows inserted by V15 for FBSU university (no deletes)
DO $$
DECLARE
    fbsu_id UUID;
BEGIN
    SELECT id INTO fbsu_id FROM university WHERE code = 'FBSU' LIMIT 1;
    IF fbsu_id IS NULL THEN
        RETURN;
    END IF;

    UPDATE transit_route
    SET source = 'DEMO_V15'
    WHERE university_id = fbsu_id
      AND route_code IN ('ROUTE-EXPRESS', 'ROUTE-GOLDEN', 'ROUTE-DORMS')
      AND source = 'MANUAL';

    UPDATE shuttle_bus
    SET source = 'DEMO_V15'
    WHERE university_id = fbsu_id
      AND bus_number IN ('FBSU-BUS-01', 'FBSU-BUS-02', 'FBSU-BUS-03')
      AND source = 'MANUAL';
END $$;

CREATE INDEX IF NOT EXISTS idx_transit_route_source ON transit_route(source);
CREATE INDEX IF NOT EXISTS idx_shuttle_bus_source ON shuttle_bus(source);

