-- P8-01: Flex-Share claims used to store a raw ISO instant in the bay status text
-- ("تبادل مرن ينتهي 2026-11-16T07:19:21.029446Z"). New claims store "تبادل مرن حتى HH:mm".
-- Rewrite existing rows to the same readable form (Asia/Riyadh time).
UPDATE parking_spot
SET time_left_text = 'تبادل مرن حتى ' || to_char(
        (substring(time_left_text FROM 'ينتهي (.*)$')::timestamptz) AT TIME ZONE 'Asia/Riyadh', 'HH24:MI')
WHERE time_left_text ~ '^تبادل مرن ينتهي [0-9]{4}-[0-9]{2}-[0-9]{2}T';
