# قائمة مهام السبرنت الحالي والمستقبلي (Sprint Backlog) — CampusFlow
**تفصيل المهام التنفيذية، المتطلبات البرمجية، ومعايير القبول لكل مهمة متبقية**

---

## 1. قائمة مهام السبرنت النشط (Sprint 08: Governance & Analytics Backlog)

### المهمة 1: P7-05 — بناء لوحة تحكم الإدارة (Admin UI Dashboard)
- **Task ID:** `P7-05`
- **Feature ID:** `F-14` (Campus Admin Operations & Governance)
- **الأولوية:** `Critical / P1`
- **الحالة الحالية:** `READY FOR IMPLEMENTATION`
- **الفرع المخصص:** `feature/P7-05-admin-ui`
- **الوصف والهدف:** بناء لوحة إدارة متكاملة وسلسة داخل الواجهة الأمامية تتيح للمسؤولين المصرح لهم برتبة `CAMPUS_ADMIN` التحكم الكامل في موارد الحرم الجامعي وربطها بالـ APIs التي تم بناؤها واختبارها في `P7-04`.
- **المكونات المطلوب إنشاؤها في Frontend (`frontend/src/features/admin/`):**
  1. `features/admin/api/adminApi.ts`: دوال استدعاء مسارات الإدارة:
     - `getAdminSpots()` و `updateSpotStatus()` و `updateSpotType()`.
     - `getAdminTariffs()` و `updateTariff()`.
     - `getAdminRooms()` و `createRoom()` و `updateRoom()` و `updateRoomStatus()`.
     - `getAdminUsers()` و `updateUserStatus()` و `updateUserRoles()`.
     - `getAdminAuditLogs(page, size)`.
  2. `features/admin/components/AdminDashboard.tsx`: الحاوية الرئيسية بتبويبات فرعية:
     - **تبويب المواقف (Spots Tab):** جدول عرض الـ 30 موقفاً، تعديل نوع الموقف (عادي، ذوي همم، EV، دكاترة)، زر تحويل الموقف إلى صيانة (`MAINTENANCE`) أو متاح.
     - **تبويب التسعيرات (Tariffs Tab):** بطاقات تعديل تسعيرة كل فئة (طالب، دكتور، موظف، زائر) بالساعة واليوم والترم.
     - **تبويب الغرف (Rooms Tab):** إضافة غرفة جديدة، تعديل بيانات الغرف، وتغيير حالتها إلى صيانة أو نشطة.
     - **تبويب المستخدمين (Users Tab):** تصفح مستخدمي النظام، زر تجميد الحساب (`SUSPENDED`) أو تفعيله (`ACTIVE`)، وتعديل الأدوار.
     - **تبويب سجل التدقيق (Audit Log Tab):** جدول كشف الحركات الإدارية يوضح من قام بالإجراء، ونوعه، والوقت، والبيانات القديمة والجديدة.
  3. ربط التبويب بالكامل في `App.tsx` داخل تبويب `admin-panel` المحمي بـ `ProtectedRoute`.
- **معايير القبول (Acceptance Criteria):**
  - لا يمكن الوصول للوحة إلا بعد تسجيل الدخول بحساب يحمل دور `CAMPUS_ADMIN`.
  - أي تعديل لحالة موقف أو غرفة ينعكس فورياً في الواجهة للطلاب بدون إعادة تحميل الصفحة بالكامل.
  - أي تعديل إداري يسجل سطراً جديداً في سجل الـ Audit Log في قاعدة البيانات.
  - كتابة اختبارات مكونات شاملة `AdminDashboard.test.tsx` بنسبة نجاح 100%.

---

### المهمة 2: P7-06 — مسارات التحليلات والربط مع الواجهة (Analytics Backend & UI Wiring)
- **Task ID:** `P7-06`
- **Feature ID:** `F-15` (Campus Analytics & Predictive Intelligence)
- **الأولوية:** `Medium / P2`
- **الحالة الحالية:** `BACKLOG` (تعتمد على P7-05)
- **الفرع المخصص:** `feature/P7-06-analytics-engine`
- **الوصف والهدف:** تحويل شاشة `AnalyticsView.tsx` من واجهة بيانات ثابتة (Mock Data) إلى شاشة تحليلات حية متصلة بالخلفية البرمجية.
- **الأعمال المطلوبة في Backend:**
  - إنشاء `AnalyticsController.java` تحت مسار `/api/v1/analytics`:
    - مسار `/parking/occupancy-rates`: إرجاع نسب إشغال القطاعات A, B, C, D.
    - مسار `/financial/revenue-breakdown`: توزيع الإيرادات بين الرسوم الدراسية والمواقف ورسوم التقوية.
    - مسار `/rooms/utilization`: معدل استخدام غرف الدراسة وساعات الذروة.
  - كتابة كويريز إحصائية في مستودعات البيانات الحالية.
  - كتابة اختبار تكامل `AnalyticsIntegrationTest.java`.
- **الأعمال المطلوبة في Frontend:**
  - إنشاء `features/analytics/api/analyticsApi.ts`.
  - تحديث `AnalyticsView.tsx` لسحب البيانات اللحظية مع إبقاء رسوم Chart التفاعلية.
  - كتابة اختبار وحدة `AnalyticsView.test.tsx`.

---

## 2. قائمة مهام سبرنت الجودة والأمان (Sprint 09 Backlog)

| Task ID | اسم المهمة | المخرجات المتوقعة | المعايير |
|---|---|---|---|
| `P8-01` | **Security Review & OWASP ASVS** | فحص التبعيات (Dependency-Check)، تفعيل ترويسات الأمان (CSP, HSTS, X-Frame)، ومراجعة حماية الـ Endpoints. | 0 ثغرات حرجة أو عالية. |
| `P8-02` | **Full Playwright E2E Suite** | اختبارات مسارات المستخدم الكاملة (حجز موقف، سداد رسوم، تبادل فلكس، حجز غرفة) باللغتين العربية والإنجليزية. | نجاح 100% في الـ Headless CI. |
| `P8-03` | **Accessibility & Responsive Audit** | ضبط تباين الألوان، قراءة الشاشة (Screen Readers)، ودعم الشاشات الصغيرة جداً وفق WCAG 2.1 AA. | توافقية تامة بدون تشوه. |
| `P8-04` | **Performance & Concurrency Load Test** | سكريبتات فحص التزامن العالي بأداة k6 لمحاكاة 500 عملية حجز وسداد متزامنة على المحفظة. | منع أي خصم مزدوج أو Race Condition. |
| `P8-05` | **Saudi PDPL Privacy Review** | سياسة خصوصية واضحة، تشفير الهويات، ومراجعة سجلات التدقيق لحماية البيانات الشخصية. | امتثال رسمي لضوابط الهيئة. |

---

## 3. قائمة مهام سبرنت تشغيل الإنتاج والإطلاق (Sprint 10 Backlog)

| Task ID | اسم المهمة | المخرجات المتوقعة | المعايير |
|---|---|---|---|
| `P9-01` | **Production Compose & Secrets** | ملف `docker-compose.prod.yml` مع Nginx SSL مشفر، وشهادات Let's Encrypt، وإدارة سرية للـ Passwords. | لا تظهر أي كلمة مرور في الكود. |
| `P9-02` | **CD Pipeline to Staging** | أتمتة النشر عبر GitHub Actions إلى بيئة Staging عند الدمج في `main`. | نشر تلقائي بدون تدخل يدوي. |
| `P9-03` | **Backup/Restore & Monitoring** | مهمة مجدولة يومية لنسخ الداتابيز احتياطياً (pg_dump) ولوحة مراقبة للأداء والتنبيهات. | اختبار استرجاع نسخة احتياطية بنجاح. |
| `P9-04` | **Runbooks & v1.0 Release** | أدلة تشغيل وصيانة كاملة (Disaster Recovery, Scaling) وإعلان إطلاق الإصدار الأول الرسمي. | نظام جاهز ومستقر 100%. |
