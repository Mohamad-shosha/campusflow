-- P8-01: the bay status line ("محجوز (2 س)", "تبادل مرن حتى 10:30") existed only in Arabic, so the
-- English UI showed Arabic. Store an English line next to it and backfill the system-generated forms.
-- Demo lines seeded by DevSeeder are rewritten in both languages on the next dev start.
ALTER TABLE parking_spot ADD COLUMN time_left_text_en VARCHAR(100);

UPDATE parking_spot SET time_left_text_en = 'Reserved' WHERE time_left_text = 'محجوز';

UPDATE parking_spot
SET time_left_text_en = 'Reserved (' || substring(time_left_text FROM '^محجوز \(([0-9.]+) س\)$') || 'h)'
WHERE time_left_text ~ '^محجوز \([0-9.]+ س\)$';

UPDATE parking_spot
SET time_left_text_en = 'Flex share until ' || substring(time_left_text FROM '([0-9]{2}:[0-9]{2})$')
WHERE time_left_text ~ '^تبادل مرن حتى [0-9]{2}:[0-9]{2}$';
