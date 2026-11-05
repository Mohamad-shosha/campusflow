-- ============================================================================
-- V5__tuition.sql: Tuition Accounts, Invoices, Payments & Receipts Schema
-- Enforces paid <= total amount, unique receipt numbers, and QR verification
-- ============================================================================

-- 1. Tuition Invoices Table
CREATE TABLE IF NOT EXISTS tuition_invoice (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE RESTRICT,
    student_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    term_id UUID NOT NULL REFERENCES academic_term(id) ON DELETE RESTRICT,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    total_amount NUMERIC(12, 2) NOT NULL,
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'UNPAID',
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT chk_invoice_total CHECK (total_amount > 0.00),
    CONSTRAINT chk_invoice_paid CHECK (paid_amount >= 0.00),
    CONSTRAINT chk_invoice_paid_lte_total CHECK (paid_amount <= total_amount),
    CONSTRAINT chk_invoice_status CHECK (status IN ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'CANCELLED'))
);

CREATE INDEX IF NOT EXISTS idx_tuition_invoice_student ON tuition_invoice(student_id);
CREATE INDEX IF NOT EXISTS idx_tuition_invoice_term ON tuition_invoice(term_id);
CREATE INDEX IF NOT EXISTS idx_tuition_invoice_status ON tuition_invoice(status);

-- 2. Tuition Payment Receipts Table
CREATE TABLE IF NOT EXISTS tuition_receipt (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES tuition_invoice(id) ON DELETE CASCADE,
    receipt_number VARCHAR(50) NOT NULL UNIQUE,
    amount_paid NUMERIC(12, 2) NOT NULL,
    ledger_entry_id UUID NOT NULL REFERENCES ledger_entry(id) ON DELETE RESTRICT,
    payer_user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE RESTRICT,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'DIGITAL_WALLET',
    verification_code VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_receipt_amount CHECK (amount_paid > 0.00)
);

CREATE INDEX IF NOT EXISTS idx_tuition_receipt_invoice ON tuition_receipt(invoice_id);
CREATE INDEX IF NOT EXISTS idx_tuition_receipt_payer ON tuition_receipt(payer_user_id);
CREATE INDEX IF NOT EXISTS idx_tuition_receipt_code ON tuition_receipt(verification_code);

