# سجل مهام المنظومة الموجه بالميزات (Feature-Driven Task Registry) — CampusFlow
**سجل المهام الشامل الموحد — كل مهمة مربوطة بميزة واضحة (Feature ID) وقيمة ملموسة للمستخدم**

---

## 📊 لوحة المتابعة الإجمالية (Feature & Task Progress Dashboard)

- **إجمالي المهام المخططة:** 53 مهمة.
- **المنجز بالكامل ومفحوص (DONE):** 42 مهمة (79.2%).
- **المهمة النشطة التالية الجاهزة للبدء (READY):** مهمة واحدة (`P7-05: Admin UI`).
- **المتبقي في قائمة الانتظار (BACKLOG):** 10 مهام (`P7-06` حتى `P9-04`).
- **تحديثات إضافية منجزة:** `PR #41` (تحسين المظهر البصري لسيارات ومواقف الحرم الجامعي).

| Feature ID | اسم الميزة (Feature Name) | إجمالي المهام | منجز (DONE) | جاهز للبدء (READY) | في الانتظار (BACKLOG) | حالة الميزة |
|---|---|---|---|---|---|---|
| `F-01` | Multi-Tenant Campus Core | 12 | 12 | 0 | 0 | `100% VERIFIED` |
| `F-02` | Identity, Auth & RBAC | 4 | 4 | 0 | 0 | `100% VERIFIED` |
| `F-03` | Vehicle Registry & Saudi Plates | 1 | 1 | 0 | 0 | `100% VERIFIED` |
| `F-04` | Digital Wallet & Ledger | 3 | 3 | 0 | 0 | `100% VERIFIED` |
| `F-05` | Tuition & Tax Receipts | 2 | 2 | 0 | 0 | `100% VERIFIED` |
| `F-06` | Smart Parking & IoT Map | 3 + PR41 | 3 + PR41 | 0 | 0 | `100% VERIFIED` |
| `F-07` | Parking Reservation & Pass | 2 | 2 | 0 | 0 | `100% VERIFIED` |
| `F-08` | AI Flex-Share P2P Exchange | 2 | 2 | 0 | 0 | `100% VERIFIED` |
| `F-09` | ALPR Gate Barrier System | 2 | 2 | 0 | 0 | `100% VERIFIED` |
| `F-10` | Peer Tutoring Network | 3 | 3 | 0 | 0 | `100% VERIFIED` |
| `F-11` | Faculty Office Hours | 2 | 2 | 0 | 0 | `100% VERIFIED` |
| `F-12` | Smart Study Rooms & Pods | 2 | 2 | 0 | 0 | `100% VERIFIED` |
| `F-13` | Campus Notifications | 3 | 3 | 0 | 0 | `100% VERIFIED` |
| `F-14` | Admin Operations & Governance | 2 | 1 | 1 (`P7-05`) | 0 | `70% BACKEND_ONLY` |
| `F-15` | Campus Analytics | 1 | 0 | 0 | 1 (`P7-06`) | `35% UI_ONLY` |
| `F-16` | Enterprise Hardening & Ops | 9 | 0 | 0 | 9 (`P8-01` to `P9-04`) | `25% PLANNED` |
| **الإجمالي** | | **53** | **42** | **1** | **10** | **جاهزية المنتج: 83.1%** |

---

# Feature F-14: لوحة تحكم الإدارة والحوكمة المركزية (Campus Admin Operations)
*الميزة الحالية النشطة — الأولوية القصوى للتنفيذ*

### P7-04 — Admin API + Immutable Audit Log
- **Task ID:** `P7-04` · **Feature ID:** `F-14`
- **Task Title:** Admin API (spots, rooms, tariffs, users) with Double RBAC & Immutable Audit Log
- **Description:** بناء مسارات التحكم الإداري الشاملة لضبط حالات المواقف، والتسعيرات، وحالات الغرف، وتجميد وتفعيل المستخدمين، وتدوين كل حركة في سجل تدقيق لا يمكن التلاعب به.
- **User Benefit:** حماية بيانات الجامعة والتأكد من أن كل قرار إداري مسجل وله مرجعية موثقة.
- **Business Value:** السيطرة المركزية الكاملة للإدارة على كافة مرافق الحرم الجامعي.
- **Dependencies:** `P5-01`, `P6-06`, `P2-03`
- **Current Status:** `DONE` (VERIFIED) · **Priority:** `Critical` · **Complexity:** M
- **Branch:** `feature/P7-04-admin-api` · **PR Reference:** Merged into main via PR #40 (`6ccf524`)
- **Acceptance Criteria:** حماية جميع المسارات برتبة `CAMPUS_ADMIN` حصراً، وتوليد سجل تدقيق لكل إجراء إداري، وتوسيع حالات المواقف لدعم `MAINTENANCE`.
- **Testing Requirements:** 6 اختبارات تكاملية شاملة في `AdminApiIntegrationTest.java` نجحت بنسبة 100%.

### P7-05 — Admin UI Dashboard
- **Task ID:** `P7-05` · **Feature ID:** `F-14`
- **Task Title:** Admin UI (Dashboard with Spots, Rooms, Tariffs, Users, and Audit Log Views)
- **Description:** بناء واجهة تحكم إدارية تفاعلية حديثة ومتجاوبة في الفرونت إند تمكن مسؤول الحرم من إدارة المواقف والغرف والتسعيرات والمستخدمين واستعراض سجل التدقيق بالربط مع مسارات `P7-04`.
- **User Benefit:** مسؤول الحرم يقدر يعدل الأسعار ويقفل المواقف ويتحكم في الحسابات في ثوانٍ من شاشة سهلة بدون الحاجة لكتابة كود أو تعديل يدوي في الداتابيز.
- **Business Value:** تحويل النظام إلى منتج تشغيلي حقيقي بيد إدارة الجامعة.
- **Dependencies:** `P7-04` (مكتمل ومدمج)
- **Current Status:** `READY FOR IMPLEMENTATION` (الخطوة التنفيذية المباشرة التالية) · **Priority:** `Critical` · **Complexity:** M
- **Branch:** `feature/P7-05-admin-ui` · **PR Reference:** —
- **Implementation Steps:**
  1. إنشاء `frontend/src/features/admin/api/adminApi.ts` لربط كافة مسارات الإدارة.
  2. إنشاء مكونات لوحة التحكم: `SpotsAdminTable`, `TariffsAdminCard`, `RoomsAdminTable`, `UsersAdminTable`, `AuditLogTable`.
  3. ربط التبويب بالكامل في `App.tsx` داخل شاشة `admin-panel` وتحديث التوجيه.
  4. كتابة اختبارات المكونات وحماية الصلاحيات في `AdminDashboard.test.tsx`.
- **Acceptance Criteria:**
  - عرض لوحة الإدارة فقط لمن يحمل دور `CAMPUS_ADMIN`.
  - تحديث أي حالة ينعكس فورياً في الواجهة للطلاب بدون إعادة تحميل الصفحة.
  - ظهور الحركات الإدارية فورياً في جدول سجل التدقيق.
  - نجاح 100% لاختبارات Vitest و TypeScript Strict.
- **Testing Requirements:** `npm test -- AdminDashboard.test.tsx`

---

# Feature F-15: التحليلات والذكاء التشغيلي (Campus Analytics)

### P7-06 — Analytics Endpoints & UI Wiring
- **Task ID:** `P7-06` · **Feature ID:** `F-15`
- **Task Title:** Campus Analytics Backend Endpoints + UI Live Wiring
- **Description:** إنشاء مسارات الباك إند لإحصائيات الحرم الجامعي (نسب إشغال المواقف، توزيع الإيرادات، واستخدام الغرف) وربطها مع شاشة `AnalyticsView.tsx` الموجودة مسبقاً.
- **User Benefit:** رؤساء الأقسام والعمداء يشوفوا أرقام وإحصائيات دقيقة لاتخاذ قرارات التوسعة والتسعير.
- **Business Value:** تمكين القيادات الجامعية من التخطيط الاستراتيجي المبني على بيانات حقيقية.
- **Dependencies:** `P7-05`, `P5-03`, `P4-02`
- **Current Status:** `BACKLOG` · **Priority:** `Medium` · **Complexity:** M
- **Branch:** `feature/P7-06-analytics-engine` · **PR Reference:** —
- **Acceptance Criteria:** مسارات `/api/v1/analytics/*` ترجع بيانات مجمعة حقيقية، وشاشة `AnalyticsView` تعرض البيانات بدون أرقام وهمية.
- **Testing Requirements:** `AnalyticsIntegrationTest.java` و `AnalyticsView.test.tsx`.

---

# Feature F-16: أمان المؤسسات، الجودة، وجاهزية الإنتاج (Hardening & Ops)

### P8-01 — Security Review (OWASP ASVS & Vulnerability Scan)
- **Task ID:** `P8-01` · **Feature ID:** `F-16`
- **Status:** `BACKLOG` · **Priority:** `High` · **Complexity:** M
- **Description:** فحص أمني شامل ضد معايير OWASP ASVS، تدقيق حزم الـ NPM والـ Maven (Dependency-Check)، وتفعيل ترويسات الأمان الأمنية (HSTS, CSP, X-Frame).

### P8-02 — Full E2E Test Suite (Playwright)
- **Task ID:** `P8-02` · **Feature ID:** `F-16`
- **Status:** `BACKLOG` · **Priority:** `High` · **Complexity:** L
- **Description:** سويت اختبارات متصفح كاملة (End-to-End) تغطي سيناريوهات حجز الموقف، الدفع من المحفظة، تبادل الفلكس، وحجز الغرف باللغتين العربية والإنجليزية.

### P8-03 — Responsive & Accessibility Audit (WCAG 2.1 AA)
- **Task ID:** `P8-03` · **Feature ID:** `F-16`
- **Status:** `BACKLOG` · **Priority:** `Medium` · **Complexity:** S
- **Description:** فحص التوافقية مع الموبايل والشاشات الصغيرة وتطبيق معايير إمكانية الوصول لذوي الاحتياجات الخاصة.

### P8-04 — Performance & Concurrency Load Test
- **Task ID:** `P8-04` · **Feature ID:** `F-16`
- **Status:** `BACKLOG` · **Priority:** `Medium` · **Complexity:** M
- **Description:** اختبار تحمل الضغط والتزامن العالي (500 مستخدم متزامن) على المحفظة وحجز المواقف بأداة k6 للتأكد من انعدام مشاكل الـ Race Conditions.

### P8-05 — Saudi PDPL Privacy & Audit Review
- **Task ID:** `P8-05` · **Feature ID:** `F-16`
- **Status:** `BACKLOG` · **Priority:** `Medium` · **Complexity:** S
- **Description:** مراجعة الامتثال لنظام حماية البيانات الشخصية السعودي (PDPL) وتأكيد تشفير الهويات الوطنية.

### P9-01 — Production Compose & Secrets Handling
- **Task ID:** `P9-01` · **Feature ID:** `F-16`
- **Status:** `BACKLOG` · **Priority:** `High` · **Complexity:** M
- **Description:** تكوين بيئة الإنتاج الآمنة مع شهادات SSL وتأمين الـ Secrets وعزل قواعد البيانات.

### P9-02 — CD Pipeline & Automated Staging Deploy
- **Task ID:** `P9-02` · **Feature ID:** `F-16`
- **Status:** `BACKLOG` · **Priority:** `High` · **Complexity:** M
- **Description:** أتمتة خط النشر المستمر لنشر أي كود مدمج في `main` إلى خادم Staging تلقائياً.

### P9-03 — Automated Backups & Monitoring Alerts
- **Task ID:** `P9-03` · **Feature ID:** `F-16`
- **Status:** `BACKLOG` · **Priority:** `High` · **Complexity:** M
- **Description:** جدولة النسخ الاحتياطي التلقائي للداتابيز وتفعيل مراقبة الصحة والتنبيهات.

### P9-04 — Runbooks Complete & Official v1.0 Release
- **Task ID:** `P9-04` · **Feature ID:** `F-16`
- **Status:** `BACKLOG` · **Priority:** `High` · **Complexity:** S
- **Description:** إكمال أدلة التشغيل واستعادة الكوارث وتدشين الإصدار الرسمي الأول v1.0 للمنظومة.

---

# Features F-01 to F-13: الميزات المكتملة والمفحوصة (Historical Tasks Registry)
*(تم الحفاظ على توثيق كافة المهام الـ 41 السابقة بكامل تفاصيلها)*

### مجموعة F-01: أساس الحرم والمونوريبو والواجهات
- `P0-01`: Project discovery & planning (DONE - Merged 3df8350).
- `P1-01`: Repo restructure & legacy preservation (DONE - PR #1).
- `P1-02`: Frontend scaffold (Vite + React + TS Strict) (DONE - PR #2).
- `P1-03`: Backend skeleton (Spring Boot 3 + Java 21) (DONE - PR #3).
- `P1-04`: PostgreSQL, Flyway baseline & Testcontainers (DONE - PR #4).
- `P1-05`: Dockerfiles, Compose & health checks (DONE - PR #5).
- `P1-06`: CI pipeline on GitHub Actions (DONE - PR #6).
- `P2-01`: Campus schema (university, college, building) (DONE - PR #7).
- `P2-05`: Dev/demo seed data (DONE - PR #19).
- `P3-01`: Design tokens, styles & App shell (DONE - PR #28).
- `P3-02`: i18n (AR/EN), RTL/LTR & Theme (DONE - PR #29).
- `P3-05`: Shared UI kit (Modals, Badges, Plates, QR) (DONE - PR #32).

### مجموعة F-02: الهوية والمصادقة والصلاحيات
- `P2-02`: Users, roles schema (DONE - PR #12).
- `P2-03`: Authentication API & RBAC (DONE - PR #13).
- `P3-03`: API client, auth context & route guards (DONE - PR #30).
- `P3-04`: Login & Register UI wired to API (DONE - PR #31).

### مجموعة F-03: المركبات واللوحة السعودية
- `P2-04`: Profile & Vehicle API with Saudi plate parsing (DONE - PR #19).

### مجموعة F-04: المحفظة والدفتر المالي
- `P4-01`: Ledger + wallet schema (DONE - PR #33).
- `P4-02`: Wallet service & API with pessimistic locking (DONE - PR #34).
- `P4-04`: Wallet UI (balance, history, top-up, transfer) (DONE - PR #36).

### مجموعة F-05: الرسوم الدراسية والفواتير الضريبية
- `P4-03`: Tuition accounts & payment + tax receipt API (DONE - PR #35).
- `P4-05`: Tuition UI + receipt verification modal (DONE - PR #36).

### مجموعة F-06 & F-07: المواقف الذكية والتصاريح
- `P5-01`: Parking schema (zones, spots, tariffs) (DONE - PR #36).
- `P5-02`: Spots & zones API (DONE - PR #36).
- `P5-03`: Booking + pricing + digital pass API (DONE - PR #36).
- `P5-06`: Parking map UI with ultrasonic ceiling sensors (DONE - PR #36).
- `P5-07`: Booking wizard UI + digital QR pass (DONE - PR #36).
- `PR #41`: Realistic Parked Cars & Bays Visual Design (DONE - PR #41).

### مجموعة F-08 & F-09: تبادل المواقف وبوابات الدخول
- `P5-04`: Flex-Share offers/claims/rewards API (DONE - PR #36).
- `P5-08`: Flex-Share UI with reward calculator (DONE - PR #36).
- `P5-05`: Gate/ALPR decision API (DONE - PR #36).
- `P5-09`: Gate scanner + sensor simulator UI (DONE - PR #36).

### مجموعة F-10 إلى F-12: الخدمات الأكاديمية التشاركية
- `P6-01`: Tutoring schema + API (DONE - PR #36).
- `P6-02`: Tutoring booking + wallet transfer (DONE - PR #36).
- `P6-03`: Tutoring UI with seat decrement (DONE - PR #36).
- `P6-04`: Office-hours schema + API (DONE - PR #36).
- `P6-05`: Office-hours UI with appointment picker (DONE - PR #36).
- `P6-06`: Rooms schema + booking API with extend/release (DONE - PR #36).
- `P6-07`: Rooms UI with live countdown badge (DONE - PR #36).

### مجموعة F-13: التنبيهات الجامعية الموحدة
- `P7-01`: Notification module + API (DONE - PR #37).
- `P7-02`: Wire domain events to notifications (DONE - PR #38).
- `P7-03`: Notifications UI (bell icon & slide drawer) (DONE - PR #39).
