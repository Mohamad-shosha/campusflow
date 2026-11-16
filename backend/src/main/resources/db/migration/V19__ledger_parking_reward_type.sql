-- P8-01: Flex-Share cashback was recorded as REFUND, so wallets labelled rewards as refunds.
-- Allow a dedicated PARKING_REWARD ledger type (existing rows are left unchanged).
ALTER TABLE ledger_entry DROP CONSTRAINT IF EXISTS chk_ledger_type;
ALTER TABLE ledger_entry ADD CONSTRAINT chk_ledger_type CHECK (transaction_type IN
    ('TOP_UP', 'TUITION_PAYMENT', 'PEER_TRANSFER', 'PARKING_FEE', 'REFUND', 'PARKING_REWARD', 'CAMPUS_PURCHASE'));
