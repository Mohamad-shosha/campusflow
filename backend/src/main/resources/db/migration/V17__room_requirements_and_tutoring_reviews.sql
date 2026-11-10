-- ============================================================================
-- Migration V17: Study Room Requirement Notes & Real Tutoring Reviews Table
-- Phase P6-08: Replace placeholder room metrics & hardcoded zero tutoring ratings
-- ============================================================================

-- 1. Bilingual special requirement / policy notes for specialized labs & pods
ALTER TABLE study_room
    ADD COLUMN IF NOT EXISTS requirement_note_ar VARCHAR(400),
    ADD COLUMN IF NOT EXISTS requirement_note_en VARCHAR(400);

UPDATE study_room
SET requirement_note_ar = 'يتطلب بطاقة المعمل الهندسي والالتزام بإجراءات السلامة الكهربائية',
    requirement_note_en = 'Requires Engineering Lab ID badge and ESD safety compliance'
WHERE room_code = 'LAB-205'
  AND requirement_note_ar IS NULL;

UPDATE study_room
SET requirement_note_ar = 'شبكة معزولة: يُمنع توصيل الأجهزة الشخصية بدون تصريح قسم الشبكات',
    requirement_note_en = 'Isolated network: personal devices require IT NOC clearance'
WHERE room_code = 'LAB-103'
  AND requirement_note_ar IS NULL;

UPDATE study_room
SET requirement_note_ar = 'يتطلب إشرافاً فنياً عند تشغيل محطات اللحام والطابعات ثلاثية الأبعاد',
    requirement_note_en = 'Technician supervision required for soldering stations and 3D printers'
WHERE room_code = 'LAB-104'
  AND requirement_note_ar IS NULL;

-- 2. Verified student peer-tutoring reviews & 1..5 ratings
CREATE TABLE IF NOT EXISTS tutoring_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES tutoring_session(id) ON DELETE CASCADE,
    student_user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    rating INT NOT NULL,
    comment VARCHAR(500),
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_tutoring_review_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT uq_tutoring_review_session_student UNIQUE (session_id, student_user_id)
);

CREATE INDEX IF NOT EXISTS idx_tutoring_review_session ON tutoring_review(session_id);

