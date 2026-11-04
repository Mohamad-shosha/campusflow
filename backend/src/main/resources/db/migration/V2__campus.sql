-- ============================================================================
-- V2__campus.sql: FBSU Smart Campus Hierarchy & Multi-Tenancy Core Schema
-- Tables: university, college, building, academic_term
-- ============================================================================

-- 1. University (Multi-Tenant Root)
CREATE TABLE IF NOT EXISTS university (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Riyadh',
    domain VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_university_code UNIQUE (code)
);

-- 2. College
CREATE TABLE IF NOT EXISTS college (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE RESTRICT,
    code VARCHAR(50) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_college_tenant_code UNIQUE (university_id, code)
);

CREATE INDEX IF NOT EXISTS idx_college_university_id ON college(university_id);

-- 3. Building
CREATE TABLE IF NOT EXISTS building (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE RESTRICT,
    code VARCHAR(50) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    floors INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_building_tenant_code UNIQUE (university_id, code)
);

CREATE INDEX IF NOT EXISTS idx_building_university_id ON building(university_id);

-- 4. Academic Term
CREATE TABLE IF NOT EXISTS academic_term (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE RESTRICT,
    code VARCHAR(50) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    starts_at DATE NOT NULL,
    ends_at DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT uq_academic_term_tenant_code UNIQUE (university_id, code),
    CONSTRAINT chk_term_dates CHECK (ends_at >= starts_at)
);

CREATE INDEX IF NOT EXISTS idx_academic_term_university_id ON academic_term(university_id);

-- 5. Seed Primary Tenant Baseline (Fahad Bin Sultan University)
INSERT INTO university (id, code, name_ar, name_en, timezone, domain, is_active)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'FBSU',
    'جامعة فهد بن سلطان',
    'Fahad Bin Sultan University',
    'Asia/Riyadh',
    'fbsu.edu.sa',
    true
) ON CONFLICT (code) DO NOTHING;

INSERT INTO college (id, university_id, code, name_ar, name_en, is_active)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'CCIS',
    'كلية الحاسب ونظم المعلومات',
    'College of Computing & Information Systems',
    true
) ON CONFLICT (university_id, code) DO NOTHING;

INSERT INTO building (id, university_id, code, name_ar, name_en, floors, is_active)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'CCIS-01',
    'مبنى كلية الحاسب الرئيسي',
    'CCIS Main Academic Complex',
    3,
    true
) ON CONFLICT (university_id, code) DO NOTHING;

INSERT INTO academic_term (id, university_id, code, name_ar, name_en, starts_at, ends_at, is_current)
VALUES (
    'd0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    '2026-FALL',
    'الفصل الدراسي الأول 2026/2027',
    'Fall Semester 2026/2027',
    '2026-09-01',
    '2027-01-15',
    true
) ON CONFLICT (university_id, code) DO NOTHING;

