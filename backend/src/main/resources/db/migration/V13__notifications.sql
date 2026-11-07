-- ============================================================================
-- Migration V13: Campus In-App Notifications Schema
-- Phase P7-01: Notification module + API
-- ============================================================================

CREATE TABLE campus_notification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    recipient_user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    sender_name_ar VARCHAR(140),
    sender_name_en VARCHAR(140),
    title_ar VARCHAR(200) NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    message_ar VARCHAR(1000) NOT NULL,
    message_en VARCHAR(1000) NOT NULL,
    type VARCHAR(40) NOT NULL DEFAULT 'SYSTEM',
    badge_ar VARCHAR(60),
    badge_en VARCHAR(60),
    target_route VARCHAR(200),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_notif_type CHECK (type IN ('GATE', 'WALLET', 'TUTORING', 'PARKING', 'OFFICE_HOURS', 'ROOM', 'SYSTEM'))
);

CREATE INDEX idx_notif_recipient ON campus_notification(recipient_user_id, read, created_at DESC);
CREATE INDEX idx_notif_uni_created ON campus_notification(university_id, created_at DESC);
