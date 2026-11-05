-- ============================================================================
-- V4__wallet.sql: Digital Wallet & Immutable Append-Only Ledger Schema
-- Enforces negative balance prevention, idempotency, and audit immutability
-- ============================================================================

-- 1. Digital Wallet Table
CREATE TABLE IF NOT EXISTS wallet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'SAR',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_wallet_user_currency UNIQUE (user_id, currency),
    CONSTRAINT chk_wallet_balance CHECK (balance >= 0.00),
    CONSTRAINT chk_wallet_status CHECK (status IN ('ACTIVE', 'FROZEN', 'CLOSED'))
);

CREATE INDEX IF NOT EXISTS idx_wallet_user_id ON wallet(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_university_id ON wallet(university_id);

-- 2. Append-Only Financial Ledger Table
CREATE TABLE IF NOT EXISTS ledger_entry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES wallet(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    balance_after NUMERIC(14, 2) NOT NULL,
    idempotency_key VARCHAR(100) NOT NULL,
    reference_id VARCHAR(100),
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_ledger_idempotency_key UNIQUE (idempotency_key),
    CONSTRAINT chk_ledger_direction CHECK (direction IN ('CREDIT', 'DEBIT')),
    CONSTRAINT chk_ledger_amount CHECK (amount > 0.00),
    CONSTRAINT chk_ledger_balance_after CHECK (balance_after >= 0.00),
    CONSTRAINT chk_ledger_type CHECK (transaction_type IN ('TOP_UP', 'TUITION_PAYMENT', 'PEER_TRANSFER', 'PARKING_FEE', 'REFUND', 'CAMPUS_PURCHASE'))
);

CREATE INDEX IF NOT EXISTS idx_ledger_wallet_created ON ledger_entry(wallet_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ledger_idempotency_key ON ledger_entry(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_ledger_reference_id ON ledger_entry(reference_id);

-- 3. Strict Ledger Immutability Rule (Prevents UPDATE and DELETE operations)
CREATE OR REPLACE FUNCTION fn_prevent_ledger_entry_mutation()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Ledger entries are strictly immutable and append-only. Modification and deletion are prohibited by institutional financial policy.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ledger_entry_no_update_or_delete ON ledger_entry;

CREATE TRIGGER trg_ledger_entry_no_update_or_delete
BEFORE UPDATE OR DELETE ON ledger_entry
FOR EACH ROW
EXECUTE FUNCTION fn_prevent_ledger_entry_mutation();
