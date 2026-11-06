-- ============================================================================
-- Migration V8: Flex-Share Offers, Claims, and Rewards
-- Phase P5-04: Flex-Share offers/claims/rewards
-- ============================================================================

CREATE TABLE flex_offer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    spot_id UUID NOT NULL REFERENCES parking_spot(id) ON DELETE CASCADE,
    offerer_user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    claimer_user_id UUID REFERENCES app_user(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    reward_amount NUMERIC(10, 2) NOT NULL DEFAULT 5.75,
    currency VARCHAR(3) NOT NULL DEFAULT 'SAR',
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    reward_paid BOOLEAN NOT NULL DEFAULT FALSE,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_flex_offer_time CHECK (end_time > start_time),
    CONSTRAINT chk_flex_reward_non_negative CHECK (reward_amount >= 0.00),
    CONSTRAINT chk_flex_offer_status CHECK (status IN ('AVAILABLE', 'CLAIMED', 'COMPLETED', 'CANCELLED'))
);

CREATE INDEX idx_flex_offer_spot ON flex_offer(spot_id, status);
CREATE INDEX idx_flex_offer_offerer ON flex_offer(offerer_user_id, status);
CREATE INDEX idx_flex_offer_claimer ON flex_offer(claimer_user_id, status);

