# خارطة طريق السبرنتات (Sprint Roadmap) — CampusFlow
**توزيع العمل بنمط Agile Sprints مبني على الميزات والقيمة المباشرة للمستخدم**

---

## سجل السبرنتات التاريخية والمنجزة (Sprints 01 to 07 — DONE)

| Sprint # | Sprint Name / Goal | الميزات المشمولة | المهام المنجزة | الحالة |
|---|---|---|---|---|
| **Sprint 01** | **Monorepo & CI Foundation** (تأسيس المشروع والدوكر) | `F-01` | `P0-01`, `P1-01`, `P1-02`, `P1-03`, `P1-04`, `P1-05`, `P1-06` | `100% DONE` |
| **Sprint 02** | **Identity & Campus Core** (الهوية والمصادقة والسيارات) | `F-01`, `F-02`, `F-03` | `P2-01`, `P2-02`, `P2-03`, `P2-04`, `P2-05` | `100% DONE` |
| **Sprint 03** | **App Shell & Design System** (الواجهة والمكونات واللغات) | `F-02`, `F-03` | `P3-01`, `P3-02`, `P3-03`, `P3-04`, `P3-05` | `100% DONE` |
| **Sprint 04** | **Campus Fintech & Tuition** (المحفظة والرسوم الدراسية) | `F-04`, `F-05` | `P4-01`, `P4-02`, `P4-03`, `P4-04`, `P4-05` | `100% DONE` |
| **Sprint 05** | **Smart Mobility & Gate IoT** (المواقف، الحجز، Flex، البوابة) | `F-06`, `F-07`, `F-08`, `F-09` | `P5-01` to `P5-09` + `PR #41` (Realistic Cars) | `100% DONE` |
| **Sprint 06** | **Collaborative Campus Services** (التقوية، المواعيد، الغرف) | `F-10`, `F-11`, `F-12` | `P6-01`, `P6-02`, `P6-03`, `P6-04`, `P6-05`, `P6-06`, `P6-07` | `100% DONE` |
| **Sprint 07** | **Events, Notifications & Admin API** (التنبيهات وAPI الإدارة) | `F-13`, `F-14 (API)` | `P7-01`, `P7-02`, `P7-03`, `P7-04` | `100% DONE` |

---

## السبرنتات النشطة والمستقبلية (Active & Upcoming Sprints)

### Sprint 08 (السبرنت الحالي): Governance & Campus Intelligence
- **Sprint Goal:** تمكين إدارة الحرم الجامعي من السيطرة التشغيلية الكاملة عبر واجهة الإدارة وربط التحليلات بالبيانات الحية.
- **Features Included:**
  - `F-14`: Campus Admin Operations & Governance (إكمال واجهة المستخدم P7-05).
  - `F-15`: Campus Analytics & Predictive Intelligence (بناء API والربط P7-06).
- **Tasks Included:**
  - `P7-05`: Admin UI (لوحة تحكم الإدارة: تبويبات المواقف، الغرف، التسعيرات، المستخدمين، وسجل التدقيق الأمني).
  - `P7-06`: Analytics Backend & UI wiring (مسارات الإحصائيات وربط الرسوم البيانية).
- **Dependencies:** `P7-04` (Admin API مكتمل بنجاح ومدمج في `main`).
- **Expected Deliverables:**
  - واجهة تحكم إدارية كاملة محمية برتبة `CAMPUS_ADMIN`.
  - قدرة الإداري على تعديل تسعيرات المواقف وحالات الغرف وتجميد المستخدمين من الشاشة.
  - جدول تفاعلي لعرض سجل التدقيق الأمني (Audit Log).
  - شاشة تحليلات حية تعكس بيانات قاعدة البيانات الفعلية.
- **User Benefits:**
  - مسؤول الجامعة يقدر يدير الحرم في ثوانٍ من المتصفح بدون تدخل تقني.
  - الشفافية والمساءلة الكاملة لكل قرار إداري.
- **Testing Plan:**
  - اختبارات مكونات React لجميع شاشات لوحة الإدارة (`AdminPanel.test.tsx`).
  - اختبارات حماية المسارات وصلاحيات `CAMPUS_ADMIN`.
  - اختبارات استجابة الـ Analytics API والـ MockMvc.
- **Acceptance Criteria:**
  - لا يمكن لغير `CAMPUS_ADMIN` فتح الشاشة أو استدعاء الـ APIs.
  - أي تعديل لحالة موقف أو غرفة ينعكس فورياً في واجهة الطلاب.
  - كل تعديل يظهر كسطر جديد في جدول الـ Audit Log مع اسم المستخدم والوقت.
- **Risks:** تعقيد واجهات الجداول على الموبايل؛ يتم التعامل معه بتصميم Responsive جداول قابلة للتمرير والطي.
- **Definition of Done:**
  - الكود مكتوب وفق TypeScript Strict بدون أي `any`.
  - كل اختبارات Vitest والـ Backend تنجح 100%.
  - مراجعة الكود، نجاح CI Pipeline، وعمل Docker Compose بدون أخطاء.

---

### Sprint 09: Enterprise Hardening & Quality Assurance
- **Sprint Goal:** رفع المعايير الأمنية، إجراء اختبارات E2E شاملة، والامتثال للأنظمة السعودية.
- **Features Included:** `F-16` (Enterprise Hardening & Ops).
- **Tasks Included:**
  - `P8-01`: Security review (OWASP ASVS Level 2, dependency vulnerability scanning, security response headers).
  - `P8-02`: Full E2E suite (Playwright) تغطي سيناريوهات الحجز والسداد باللغتين AR/EN والوضعين Dark/Light.
  - `P8-03`: Responsive + Accessibility audit & fixes (توافقية كاملة مع الشاشات ومعايير WCAG 2.1 AA لذوي الهمم).
  - `P8-04`: Performance & Concurrency Load Test (فحص تحمل التزامن العالي في سداد الرسوم وحجز المواقف بأدوات k6 / JMeter).
  - `P8-05`: Saudi PDPL Privacy checklist & Audit-log review (الامتثال لنظام حماية البيانات الشخصية وسياسة الخصوصية).
- **Dependencies:** اكتمال Sprint 08.
- **Expected Deliverables:**
  - تقرير أمني رسمي خالٍ من الثغرات العالية أو المتوسطة.
  - سويت اختبارات E2E يعمل تلقائياً في GitHub Actions.
  - تقرير اختبارات أداء يثبت قدرة النظام على خدمة 500 مستخدم متزامن بدون أخطاء.
- **Definition of Done:** نجاح 100% لجميع اختبارات الأمان والـ E2E والـ Load Testing.

---

### Sprint 10: Production Operations & Official v1.0 Launch
- **Sprint Goal:** تشغيل بيئة الإنتاج الحقيقية، تأمين السيرفرات، وأتمتة النشر والنسخ الاحتياطي وإصدار v1.0.
- **Features Included:** `F-16` (Production Launch).
- **Tasks Included:**
  - `P9-01`: Production Compose/Config, SSL/TLS reverse proxy, secrets handling.
  - `P9-02`: Continuous Deployment (CD) pipeline to Staging/Production.
  - `P9-03`: Automated DB backups (pg_dump cron to S3/Cloud) + Prometheus/Grafana monitoring.
  - `P9-04`: Comprehensive Operations Runbooks + Official v1.0 Release.
- **Dependencies:** اكتمال Sprint 09.
- **Expected Deliverables:**
  - بيئة إنتاج تعمل بشهادات SSL معتمدة.
  - خطة طوارئ واستعادة بيانات مجربة (Disaster Recovery Plan).
  - إطلاق الإصدار الإنتاجي الأول v1.0 مع وثائق تشغيلية متكاملة.
- **Definition of Done:** تشغيل الموقع حياً بنجاح، وتفعيل النسخ الاحتياطي التلقائي ومراقبة الأداء.
