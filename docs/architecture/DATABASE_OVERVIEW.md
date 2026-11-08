# الدليل المرجعي لقاعدة البيانات (Database Overview) — CampusFlow
**التوثيق الشامل لجميع الجداول الـ 21 وهجرات Flyway الـ 14 في PostgreSQL 15**

---

## 1. ملخص هجرات Flyway (Migrations Inventory)

| رقم الهجرة | اسم الملف | الجداول المنشأة | الهدف الوظيفي |
|---|---|---|---|
| `V1` | `V1__baseline.sql` | `schema_baseline_info` | توثيق الخط الأساسي ودعم إضافة الـ UUID Extension. |
| `V2` | `V2__campus.sql` | `university`, `college`, `building`, `academic_term` | الهيكل المؤسسي والجامعي والتقويم الأكاديمي. |
| `V3` | `V3__identity.sql` | `app_user`, `user_role`, `vehicle`, `refresh_token` | المستخدمين، الصلاحيات، سجل المركبات وتوكنات التجديد. |
| `V4` | `V4__wallet.sql` | `wallet`, `ledger_entry` | المحفظة المالية ودفتر الأستاذ المحاسبي مزدوج القيد. |
| `V5` | `V5__tuition.sql` | `tuition_invoice`, `tuition_receipt` | فواتير الرسوم الدراسية وإيصالات السداد الرسمية المشفرة. |
| `V6` | `V6__parking.sql` | `parking_zone`, `parking_spot`, `parking_tariff`, `spot_assignment` | قطاعات المواقف، الـ 30 موقفاً، التسعيرات، والمواقف المخصصة. |
| `V7` | `V7__booking.sql` | `parking_booking` | حجوزات المواقف والتصاريح وأكواد QR. |
| `V8` | `V8__flex_share.sql` | `flex_offer` | عروض ومطالبات تبادل المواقف الذكي (AI Flex-Share). |
| `V9` | `V9__gate_logs.sql` | `gate_event_log` | سجلات بوابات الدخول وقراءة لوحات السيارات (ALPR). |
| `V10` | `V10__tutoring.sql` | `tutoring_session`, `tutoring_enrollment` | جلسات التقوية الأكاديمية وحجوزات المقاعد. |
| `V11` | `V11__office_hours.sql` | `faculty_office_profile`, `office_hour_slot`, `office_hour_appointment` | مكاتب الدكاترة وفترات الساعات المكتبية والمواعيد. |
| `V12` | `V12__rooms.sql` | `study_room`, `room_booking` | غرف الدراسة التفاعلية وحجوزات الغرف والعداد التنازلي. |
| `V13` | `V13__notifications.sql` | `campus_notification` | سجل التنبيهات الموحدة متعددة القنوات وحالة القراءة. |
| `V14` | `V14__admin_audit_log.sql` | `admin_audit_log` | سجل التدقيق الإداري الصارم مع تحديث قيد حالات المواقف. |

---

## 2. قاموس البيانات ومحددات القيود (Data Dictionary & Constraints)

### أ. موديول الهوية والمركبات (Identity & Vehicles)
- **`app_user`:**
  - المفتاح الأساسي: `id UUID DEFAULT gen_random_uuid()`.
  - الأعمدة: `university_code`, `email UNIQUE`, `national_id UNIQUE`, `full_name_ar`, `full_name_en`, `phone`, `password_hash`, `status (ACTIVE, SUSPENDED)`.
- **`user_role`:**
  - المفتاح الأساسي: `(user_id, role)`.
  - القيد: `role IN ('STUDENT', 'FACULTY', 'STAFF', 'CAMPUS_ADMIN')`.
- **`vehicle`:**
  - الأعمدة: `user_id`, `plate_letters_ar`, `plate_letters_en`, `plate_numbers`, `model`, `color`, `is_primary`.
  - القيد: اللوحة السعودية تخضع للتحقق من تطابق الأحرف العربية مع اللاتينية.

### ب. موديول المالية والمحفظة (Wallet & Ledger)
- **`wallet`:**
  - الأعمدة: `user_id UNIQUE`, `balance NUMERIC(12,2) CHECK (balance >= 0)`.
  - الحماية: يمنع منعاً باتاً نزول الرصيد تحت الصفر عبر قيد قاعدة البيانات الصلب.
- **`ledger_entry`:**
  - دفتر محاسبي غير قابل للتعديل (Append-Only).
  - الأعمدة: `wallet_id`, `amount NUMERIC(12,2)`, `direction (CREDIT, DEBIT)`, `operation_type`, `reference_id`, `balance_after`, `created_at`.

### ج. موديول المواقف والبوابات (Parking & Gate)
- **`parking_spot`:**
  - الأعمدة: `id UUID`, `bay_number INT UNIQUE (1..30)`, `zone_id`, `spot_type (STANDARD, ACCESSIBLE, EV, FACULTY)`, `status (AVAILABLE, OCCUPIED, RESERVED, MAINTENANCE)`.
- **`parking_booking`:**
  - الأعمدة: `spot_id`, `user_id`, `vehicle_id`, `start_time`, `end_time`, `fee_amount`, `status (ACTIVE, COMPLETED, CANCELLED)`, `qr_pass_code`.
  - القيد: منع تداخل أوقات الحجز لنفس الموقف عبر فهارس متخصصة وفحص التضارب.
- **`gate_event_log`:**
  - رصد البوابات: `plate_scanned`, `gate_id`, `decision (OPEN, DENIED)`, `reason`, `created_at`.

### د. موديول الحوكمة والتدقيق (Admin Audit)
- **`admin_audit_log`:**
  - سجل غير قابل للحذف (Immutable Log).
  - الأعمدة: `id UUID`, `actor_id`, `actor_email`, `action_type`, `entity_type`, `entity_id`, `old_value JSONB`, `new_value JSONB`, `ip_address`, `created_at`.
  - الفهارس: `idx_admin_audit_log_actor`, `idx_admin_audit_log_entity`, `idx_admin_audit_log_created_at`.
