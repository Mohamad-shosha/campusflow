-- ============================================================================
-- Migration V15: Smart Campus Transit & Eco Shuttle Fleet Management
-- Phase P7-01: Routes, Stoppages, Electric Shuttles & Boarding Passes
-- ============================================================================

-- 1. Transit Routes Table
CREATE TABLE IF NOT EXISTS transit_route (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    route_code VARCHAR(30) NOT NULL UNIQUE,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    color_hex VARCHAR(20) NOT NULL DEFAULT '#10b981',
    operating_hours_ar VARCHAR(100) NOT NULL DEFAULT '07:30 ص - 05:30 م',
    operating_hours_en VARCHAR(100) NOT NULL DEFAULT '07:30 AM - 05:30 PM',
    frequency_minutes INT NOT NULL DEFAULT 10,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    display_order INT NOT NULL DEFAULT 1,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_transit_route_status CHECK (status IN ('ACTIVE', 'MAINTENANCE', 'OFF_PEAK'))
);

CREATE INDEX IF NOT EXISTS idx_transit_route_uni_order ON transit_route(university_id, display_order);

-- 2. Transit Stops Table
CREATE TABLE IF NOT EXISTS transit_stop (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES transit_route(id) ON DELETE CASCADE,
    stop_code VARCHAR(30) NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    location_desc_ar VARCHAR(300) NOT NULL,
    location_desc_en VARCHAR(300) NOT NULL,
    stop_order INT NOT NULL DEFAULT 1,
    eta_minutes_from_start INT NOT NULL DEFAULT 0,
    has_shelter BOOLEAN NOT NULL DEFAULT TRUE,
    has_ac BOOLEAN NOT NULL DEFAULT TRUE,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_route_stop_code UNIQUE (route_id, stop_code)
);

CREATE INDEX IF NOT EXISTS idx_transit_stop_route_order ON transit_stop(route_id, stop_order);

-- 3. Shuttle Bus Fleet Table
CREATE TABLE IF NOT EXISTS shuttle_bus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    current_route_id UUID REFERENCES transit_route(id) ON DELETE SET NULL,
    bus_number VARCHAR(30) NOT NULL UNIQUE,
    plate_letters_ar VARCHAR(20) NOT NULL,
    plate_digits VARCHAR(10) NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    total_capacity INT NOT NULL DEFAULT 28,
    occupied_seats INT NOT NULL DEFAULT 0,
    is_electric BOOLEAN NOT NULL DEFAULT TRUE,
    driver_name_ar VARCHAR(150) NOT NULL,
    driver_name_en VARCHAR(150) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'IN_TRANSIT',
    current_stop_id UUID REFERENCES transit_stop(id) ON DELETE SET NULL,
    next_stop_id UUID REFERENCES transit_stop(id) ON DELETE SET NULL,
    next_stop_eta_mins INT NOT NULL DEFAULT 3,
    battery_percentage INT NOT NULL DEFAULT 90,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_shuttle_bus_status CHECK (status IN ('IN_TRANSIT', 'BOARDING', 'ARRIVING', 'OUT_OF_SERVICE')),
    CONSTRAINT chk_shuttle_bus_capacity CHECK (occupied_seats >= 0 AND occupied_seats <= total_capacity)
);

CREATE INDEX IF NOT EXISTS idx_shuttle_bus_route ON shuttle_bus(current_route_id, status);

-- 4. Transit Boarding Pass Table
CREATE TABLE IF NOT EXISTS transit_pass (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES university(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES transit_route(id) ON DELETE CASCADE,
    shuttle_id UUID REFERENCES shuttle_bus(id) ON DELETE SET NULL,
    pickup_stop_id UUID NOT NULL REFERENCES transit_stop(id) ON DELETE CASCADE,
    dropoff_stop_id UUID NOT NULL REFERENCES transit_stop(id) ON DELETE CASCADE,
    pass_code VARCHAR(60) NOT NULL UNIQUE,
    qr_token VARCHAR(255) NOT NULL,
    boarding_window VARCHAR(100) NOT NULL,
    fare_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_transit_pass_status CHECK (status IN ('ACTIVE', 'BOARDED', 'EXPIRED', 'CANCELLED'))
);

CREATE INDEX IF NOT EXISTS idx_transit_pass_user ON transit_pass(user_id, status);
CREATE INDEX IF NOT EXISTS idx_transit_pass_route ON transit_pass(route_id, created_at DESC);

-- 5. Seed FBSU Campus Transit Routes, Stoppages & Eco Shuttle Fleet
DO $$
DECLARE
    fbsu_id UUID;
    route_express_id UUID;
    route_central_id UUID;
    route_dorms_id UUID;
    stop_gate_id UUID;
    stop_eng_id UUID;
    stop_business_id UUID;
    stop_admin_id UUID;
    stop_library_id UUID;
    stop_dorms_id UUID;
BEGIN
    SELECT id INTO fbsu_id FROM university WHERE code = 'FBSU' LIMIT 1;
    IF fbsu_id IS NULL THEN
        RETURN;
    END IF;

    -- Route 1: الخط السريع الأخضر (Express Green Line)
    INSERT INTO transit_route (
        id, university_id, route_code, name_ar, name_en, color_hex,
        operating_hours_ar, operating_hours_en, frequency_minutes, status, display_order
    ) VALUES (
        gen_random_uuid(), fbsu_id, 'ROUTE-EXPRESS',
        'المسار السريع الأخضر (البوابة الرئيسية ↔ كليات الهندسة والحاسب)',
        'Express Green Line (Main Gate ↔ Engineering & Computing)',
        '#10b981', '07:30 ص - 05:30 م', '07:30 AM - 05:30 PM', 8, 'ACTIVE', 1
    ) RETURNING id INTO route_express_id;

    -- Route 2: مسار الحرم الذهبي الدائري (Golden Campus Loop)
    INSERT INTO transit_route (
        id, university_id, route_code, name_ar, name_en, color_hex,
        operating_hours_ar, operating_hours_en, frequency_minutes, status, display_order
    ) VALUES (
        gen_random_uuid(), fbsu_id, 'ROUTE-GOLDEN',
        'المسار الذهبي الدائري (كافة الكليات والمكتبة المركزية وصالة القبول)',
        'Golden Campus Loop (All Colleges, Library & Admissions)',
        '#d7a237', '07:30 ص - 06:00 م', '07:30 AM - 06:00 PM', 10, 'ACTIVE', 2
    ) RETURNING id INTO route_central_id;

    -- Route 3: مسار سكن الطلاب والأنشطة الرياضية (Dorms & Sports Arena)
    INSERT INTO transit_route (
        id, university_id, route_code, name_ar, name_en, color_hex,
        operating_hours_ar, operating_hours_en, frequency_minutes, status, display_order
    ) VALUES (
        gen_random_uuid(), fbsu_id, 'ROUTE-DORMS',
        'مسار السكن الجامعي والصالة الرياضية (السكن ↔ الكليات)',
        'Residential Dorms & Sports Arena Line (Dorms ↔ Colleges)',
        '#06b6d4', '07:00 ص - 09:30 م', '07:00 AM - 09:30 PM', 15, 'ACTIVE', 3
    ) RETURNING id INTO route_dorms_id;

    -- Stops for Route 1 (Express Green Line)
    INSERT INTO transit_stop (
        id, university_id, route_id, stop_code, name_ar, name_en,
        location_desc_ar, location_desc_en, stop_order, eta_minutes_from_start, has_shelter, has_ac
    ) VALUES (
        gen_random_uuid(), fbsu_id, route_express_id, 'STOP-EX-01',
        'محطة البوابة الشمالية الرئيسية (North Gate)',
        'Main North Gate Station',
        'أمام البوابة الرئيسية وبجوار مواقف الزوار قطاع E',
        'In front of Main Gate next to Zone E parking',
        1, 0, TRUE, TRUE
    ) RETURNING id INTO stop_gate_id;

    INSERT INTO transit_stop (
        id, university_id, route_id, stop_code, name_ar, name_en,
        location_desc_ar, location_desc_en, stop_order, eta_minutes_from_start, has_shelter, has_ac
    ) VALUES (
        gen_random_uuid(), fbsu_id, route_express_id, 'STOP-EX-02',
        'محطة كلية الحاسب وتقنية المعلومات (IT Stop)',
        'College of Computing & IT Station',
        'المدخل الشرقي لمبنى كلية الحاسب الدور الأرضي',
        'East entrance of Computing College, Ground Floor',
        2, 4, TRUE, TRUE
    );

    INSERT INTO transit_stop (
        id, university_id, route_id, stop_code, name_ar, name_en,
        location_desc_ar, location_desc_en, stop_order, eta_minutes_from_start, has_shelter, has_ac
    ) VALUES (
        gen_random_uuid(), fbsu_id, route_express_id, 'STOP-EX-03',
        'محطة مجمع المعامل والهندسة ومواقف قطاع A',
        'Engineering Complex & Zone A Labs',
        'أمام مبنى الورش الهندسية ومعامل الذكاء الاصطناعي',
        'Facing Engineering Labs & AI Research Center',
        3, 8, TRUE, TRUE
    ) RETURNING id INTO stop_eng_id;

    -- Stops for Route 2 (Golden Campus Loop)
    INSERT INTO transit_stop (
        id, university_id, route_id, stop_code, name_ar, name_en,
        location_desc_ar, location_desc_en, stop_order, eta_minutes_from_start, has_shelter, has_ac
    ) VALUES (
        gen_random_uuid(), fbsu_id, route_central_id, 'STOP-GL-01',
        'محطة كلية إدارة الأعمال ومواقف قطاع B',
        'College of Business & Zone B Hub',
        'الساحة الخارجية لكلية إدارة الأعمال ومطعم ستاربكس',
        'Business College courtyard next to Starbucks',
        1, 0, TRUE, TRUE
    ) RETURNING id INTO stop_business_id;

    INSERT INTO transit_stop (
        id, university_id, route_id, stop_code, name_ar, name_en,
        location_desc_ar, location_desc_en, stop_order, eta_minutes_from_start, has_shelter, has_ac
    ) VALUES (
        gen_random_uuid(), fbsu_id, route_central_id, 'STOP-GL-02',
        'محطة المكتبة المركزية وصالة القبول والتسجيل',
        'Central Library & Admissions Hall',
        'المدخل الرئيسي للمكتبة المركزية وصالة الخدمات الطلابية',
        'Main entrance of Central Library & Student Services',
        2, 5, TRUE, TRUE
    ) RETURNING id INTO stop_library_id;

    INSERT INTO transit_stop (
        id, university_id, route_id, stop_code, name_ar, name_en,
        location_desc_ar, location_desc_en, stop_order, eta_minutes_from_start, has_shelter, has_ac
    ) VALUES (
        gen_random_uuid(), fbsu_id, route_central_id, 'STOP-GL-03',
        'محطة مبنى الإدارة العامة وعمادة شؤون الطلاب',
        'University Administration & Deanship',
        'بجوار مبنى إدارة الجامعة والمواقف الشرفية قطاع C',
        'Next to Admin Building & Zone C Faculty Parking',
        3, 10, TRUE, TRUE
    ) RETURNING id INTO stop_admin_id;

    -- Stops for Route 3 (Dorms Line)
    INSERT INTO transit_stop (
        id, university_id, route_id, stop_code, name_ar, name_en,
        location_desc_ar, location_desc_en, stop_order, eta_minutes_from_start, has_shelter, has_ac
    ) VALUES (
        gen_random_uuid(), fbsu_id, route_dorms_id, 'STOP-DR-01',
        'محطة مجمع السكن الطلابي والأنشطة',
        'Student Housing Complex & Club',
        'أمام مبنى سكن الطلاب رقم 3 وصالة اللياقة البدنية',
        'In front of Dorm Building 3 & Fitness Arena',
        1, 0, TRUE, TRUE
    ) RETURNING id INTO stop_dorms_id;

    INSERT INTO transit_stop (
        id, university_id, route_id, stop_code, name_ar, name_en,
        location_desc_ar, location_desc_en, stop_order, eta_minutes_from_start, has_shelter, has_ac
    ) VALUES (
        gen_random_uuid(), fbsu_id, route_dorms_id, 'STOP-DR-02',
        'محطة الصالة الرياضية المغلقة والملاعب',
        'Sports Arena & Campus Stadium',
        'بوابة الصالة الرياضية متعددة الأغراض',
        'Main Gate of Multi-purpose Sports Arena',
        2, 7, TRUE, TRUE
    );

    -- Seed 3 Electric Shuttle Buses
    INSERT INTO shuttle_bus (
        id, university_id, current_route_id, bus_number, plate_letters_ar, plate_digits,
        model_name, total_capacity, occupied_seats, is_electric, driver_name_ar, driver_name_en,
        status, current_stop_id, next_stop_id, next_stop_eta_mins, battery_percentage
    ) VALUES (
        gen_random_uuid(), fbsu_id, route_express_id, 'FBSU-BUS-01', 'أ ح د', '4582',
        'BYD K8 Pure Electric Eco-Shuttle', 28, 12, TRUE, 'عبدالله السعدي', 'Abdullah Al-Saadi',
        'IN_TRANSIT', stop_gate_id, stop_eng_id, 3, 92
    );

    INSERT INTO shuttle_bus (
        id, university_id, current_route_id, bus_number, plate_letters_ar, plate_digits,
        model_name, total_capacity, occupied_seats, is_electric, driver_name_ar, driver_name_en,
        status, current_stop_id, next_stop_id, next_stop_eta_mins, battery_percentage
    ) VALUES (
        gen_random_uuid(), fbsu_id, route_central_id, 'FBSU-BUS-02', 'ر ق م', '8812',
        'Yutong E10 Smart Autonomous-Ready Bus', 32, 19, TRUE, 'سالم البلوي', 'Salem Al-Balawi',
        'BOARDING', stop_business_id, stop_library_id, 1, 86
    );

    INSERT INTO shuttle_bus (
        id, university_id, current_route_id, bus_number, plate_letters_ar, plate_digits,
        model_name, total_capacity, occupied_seats, is_electric, driver_name_ar, driver_name_en,
        status, current_stop_id, next_stop_id, next_stop_eta_mins, battery_percentage
    ) VALUES (
        gen_random_uuid(), fbsu_id, route_dorms_id, 'FBSU-BUS-03', 'ط ب ق', '3190',
        'BYD K8 Pure Electric Eco-Shuttle', 28, 6, TRUE, 'منصور العنزي', 'Mansour Al-Anazi',
        'IN_TRANSIT', stop_dorms_id, stop_admin_id, 5, 78
    );

END $$;

