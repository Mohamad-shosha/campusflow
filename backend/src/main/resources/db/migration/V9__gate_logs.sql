-- ============================================================================
-- Migration V9: Gate Access Event Logs & ALPR Decisions
-- Phase P5-05: Gate/ALPR decision API
-- ============================================================================

CREATE TABLE gate_event_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    gate_id VARCHAR(50) NOT NULL DEFAULT 'MAIN_GATE_IN',
    plate_letters_ar VARCHAR(10) NOT NULL,
    plate_digits VARCHAR(10) NOT NULL,
    decision VARCHAR(20) NOT NULL,
    reason VARCHAR(100) NOT NULL,
    bay_number INT,
    bay_code VARCHAR(20),
    user_id UUID REFERENCES app_user(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES vehicle(id) ON DELETE SET NULL,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gate_event_log_created ON gate_event_log(created_at DESC);
CREATE INDEX idx_gate_event_log_plate ON gate_event_log(plate_letters_ar, plate_digits);

