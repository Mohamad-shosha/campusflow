# TASKS.md — سجل متابعة تنفيذ المشروع

> هذا الملف **مولَّد آلياً** من `docs/tasks/tasks-data.mjs` بالأمر `node docs/tasks/build.mjs`.
> ملف الـ PDF المجمع الرئيسي: [`docs/tasks/pdf/ALL-TASKS.pdf`](file:///d:/Rakan/docs/tasks/pdf/ALL-TASKS.pdf)
> ملفات PDF المستقلة لكل تاسك: `docs/tasks/pdf/`

---

## 📊 لوحة المتابعة المباشرة (Live Project Dashboard)

- **إجمالي المهام المخططة:** 53 تاسك
- **المنجز بالكامل (Done):** 13 تاسك ✅
- **قيد العمل حالياً (In Progress):** 0 تاسك ⏳
- **المتبقي للبدء (Backlog):** 40 تاسك 📋
- **نسبة الإنجاز الإجمالية للمشروع:** **25%**



| Phase | الاسم | إجمالي | منجز (Done) ✅ | قيد التنفيذ ⏳ | متبقي 📋 |
|---|---|---|---|---|---|
| P0 | Discovery & Planning | 1 | 1 | 0 | 0 |
| P1 | Foundation & DevOps | 6 | 6 | 0 | 0 |
| P2 | Identity & Campus Core | 5 | 5 | 0 | 0 |
| P3 | Frontend Foundation (React) | 5 | 1 | 0 | 4 |
| P4 | Wallet & Tuition | 5 | 0 | 0 | 5 |
| P5 | Parking | 9 | 0 | 0 | 9 |
| P6 | Campus Services | 7 | 0 | 0 | 7 |
| P7 | Notifications, Admin, Analytics | 6 | 0 | 0 | 6 |
| P8 | Hardening & QA | 5 | 0 | 0 | 5 |
| P9 | Release & Operations | 4 | 0 | 0 | 4 |
| **الإجمالي** | | **53** | **13** | **0** | **40** |

---

---
# Phase P0 — Discovery & Planning

### P0-01 — Project discovery & planning
- **ماذا سيعمل:** فحص المشروع الحالي وتوثيقه: Audit، UI Inventory، PRD، User Flows، Architecture، ERD، MVP، Roadmap، Tasks، Risks.
- **Priority:** P0 · **Complexity:** L · **Status:** ✅ Done
- **Dependencies:** لا يوجد
- **Git Branch:** `docs/P0-01-project-discovery` · **Pull Request:** Merged into main (3df8350)
- **الملفات المتوقعة:** `plan.md`، `TASKS.md`، `docs/discovery/*`، `docs/architecture/*`، `docs/decisions/*`
- **Implementation Steps:** 1) قراءة الكود والـ Git state 2) تشغيل npm run build كخط أساس 3) كتابة مستندات الـ Discovery والـ Architecture 4) كتابة plan.md وTASKS.md
- **Acceptance Criteria:** كل المستندات موجودة ومتسقة · التقرير اتعرض على المالك
- **Testing Requirements:** npm run build (تم تنفيذه ونجح)
- **ينتظر قرارات:** لا يوجد

---
# Phase P1 — Foundation & DevOps

### P1-01 — Repository restructure (monorepo) & legacy preservation
- **ماذا سيعمل:** ترتيب الـ repo: إنشاء frontend/ وbackend/ وlegacy/، ونقل الـ showcase والـ presentation وUI-UX وscripts إلى legacy/، وإزالة تكرار الـ assets (متخزنة 3 مرات).
- **Priority:** High · **Complexity:** M · **Status:** ✅ Done
- **Dependencies:** P0-01 معتمد، Q12، Q14
- **Git Branch:** `chore/P1-01-repo-restructure` · **Pull Request:** PR (chore/P1-01-repo-restructure)
- **الملفات المتوقعة:** `legacy/**`، `frontend/ (فارغ)`، `backend/ (فارغ)`، `.gitignore`، `README.md`، `vite.config.js`
- **Implementation Steps:** 1) git mv للملفات (للحفاظ على التاريخ) 2) إصلاح المسارات النسبية 3) إصلاح/حذف configureServer الميت في vite.config.js 4) تحديث .gitignore وREADME 5) التأكد إن legacy بيبني
- **Acceptance Criteria:** مفيش ملف ضاع · صفحات legacy بتفتح وتبني · الجذر فيه ملفات الإدارة والمجلدات فقط · تكرار الـ assets اتشال
- **Testing Requirements:** npm run build داخل legacy · فحص روابط الـ assets · git status نظيف من ملفات غير مرتبطة
- **ينتظر قرارات:** Q12، Q14

### P1-02 — Frontend scaffold (Vite + React + TypeScript strict)
- **ماذا سيعمل:** إنشاء تطبيق React 18 + TS strict جديد في frontend/ مع ESLint وPrettier وVitest، بدون أي Feature.
- **Priority:** High · **Complexity:** M · **Status:** ✅ Done
- **Dependencies:** P1-01، D-2
- **Git Branch:** `feature/P1-02-frontend-scaffold` · **Pull Request:** PR (feature/P1-02-frontend-scaffold)
- **الملفات المتوقعة:** `frontend/package.json`، `frontend/tsconfig.json`، `frontend/vite.config.ts`، `frontend/eslint.config.js`، `frontend/src/**`
- **Implementation Steps:** 1) Scaffold بـ Vite 2) ضبط ESLint/Prettier/Typecheck 3) إعداد Vitest + Testing Library 4) هيكل المجلدات (app/features/shared) 5) scripts: dev/build/lint/test
- **Acceptance Criteria:** npm run dev/build/lint/test تنجح · اختبار مكوّن تجريبي ينجح · TypeScript بدون أخطاء
- **Testing Requirements:** lint · typecheck · unit test · build
- **ينتظر قرارات:** D-2

### P1-03 — Backend skeleton (Spring Boot 3, Java 21)
- **ماذا سيعمل:** مشروع Maven لـ Spring Boot فيه Actuator وSwagger وGlobal Exception Handler (ProblemDetail) وLogging وProfiles وقواعد ArchUnit.
- **Priority:** High · **Complexity:** M · **Status:** ✅ Done
- **Dependencies:** P1-01، Q11، D-3
- **Git Branch:** `feature/P1-03-backend-skeleton` · **Pull Request:** PR (feature/P1-03-backend-skeleton)
- **الملفات المتوقعة:** `backend/pom.xml`، `backend/src/main/java/.../common/**`، `backend/src/main/resources/application*.yml`، `backend/src/test/**`
- **Implementation Steps:** 1) إنشاء المشروع والـ base package 2) GlobalExceptionHandler + اختباراته 3) إعداد springdoc-openapi 4) Profiles: dev/test/prod 5) ArchUnit لحدود الـ modules 6) Spotless
- **Acceptance Criteria:** التطبيق يقوم · /actuator/health = UP · /swagger-ui يفتح · مسار غير موجود يرجع RFC7807 · خطأ validation يرجع 400 ProblemDetail
- **Testing Requirements:** Unit للـ handler · @WebMvcTest · Context-load test · mvn verify
- **ينتظر قرارات:** Q11، D-3

### P1-04 — PostgreSQL, Flyway baseline & Testcontainers base
- **ماذا سيعمل:** ربط الـ Backend بـ PostgreSQL مع Flyway وملف V1 baseline وكلاس أساسي لاختبارات Testcontainers.
- **Priority:** High · **Complexity:** M · **Status:** ✅ Done
- **Dependencies:** P1-03
- **Git Branch:** `feature/P1-04-database-flyway` · **Pull Request:** PR (feature/P1-04-database-flyway)
- **الملفات المتوقعة:** `backend/pom.xml`، `backend/src/main/resources/db/migration/V1__baseline.sql`، `application.yml`، `AbstractIntegrationTest.java`
- **Implementation Steps:** 1) إضافة JPA + Postgres + Flyway 2) ضبط الاتصال عبر env vars 3) V1 (pgcrypto, btree_gist) 4) ddl-auto=validate 5) AbstractIntegrationTest + repository test تجريبي
- **Acceptance Criteria:** Migration على DB فاضية تنجح · إعادة التشغيل لا تغيّر شيء · migration فاشلة توقف التشغيل · IT يشغّل Postgres حقيقي
- **Testing Requirements:** Integration مع Testcontainers (Docker لازم يكون شغال)
- **ينتظر قرارات:** لا يوجد

### P1-05 — Dockerfiles, Compose, health checks, env config
- **ماذا سيعمل:** تشغيل النظام كله بأمر واحد: Dockerfile للـ Backend والـ Frontend (Nginx) وPostgres مع volume وhealthchecks وملف .env.example.
- **Priority:** High · **Complexity:** M · **Status:** ✅ Done
- **Dependencies:** P1-02، P1-03، P1-04
- **Git Branch:** `feature/P1-05-docker-compose` · **Pull Request:** PR (feature/P1-05-docker-compose)
- **الملفات المتوقعة:** `backend/Dockerfile`، `frontend/Dockerfile`، `frontend/nginx.conf`، `docker-compose.yml`، `.env.example`، `.dockerignore`، `docs/runbooks/local-development.md`
- **Implementation Steps:** 1) Backend multi-stage non-root 2) Frontend build -> Nginx مع proxy لـ /api 3) Compose: db/backend/frontend/network/volume 4) Healthchecks + depends_on 5) توثيق التشغيل المحلي
- **Acceptance Criteria:** docker compose up --build يخلّي الثلاث خدمات healthy · الواجهة تفتح · /api/actuator/health = UP · البيانات تفضل بعد restart · لا Secrets في Git
- **Testing Requirements:** docker build x2 · compose startup · DB connection · health check · restart persistence
- **ينتظر قرارات:** لا يوجد

### P1-06 — CI pipeline (GitHub Actions)
- **ماذا سيعمل:** Pipeline يشغّل lint/test/build للـ Frontend وmvn verify للـ Backend وdocker build وcompose smoke، مع PR template وDependabot.
- **Priority:** High · **Complexity:** M · **Status:** ✅ Done
- **Dependencies:** P1-05
- **Git Branch:** `ci/P1-06-github-actions` · **Pull Request:** PR (ci/P1-06-github-actions)
- **الملفات المتوقعة:** `.github/workflows/*.yml`، `.github/pull_request_template.md`، `.github/dependabot.yml`
- **Implementation Steps:** 1) Workflow للـ Frontend 2) Workflow للـ Backend 3) Docker build + compose smoke 4) PR template + Dependabot 5) حصر الـ Pages deploy على legacy
- **Acceptance Criteria:** كل الـ jobs خضراء · فشل اختبار يفشّل الـ pipeline (يتم إثباته) · الـ required checks موثقة
- **Testing Requirements:** تشغيل فعلي على branch (يحتاج push بإذنك)
- **ينتظر قرارات:** إذن push

---
# Phase P2 — Identity & Campus Core

### P2-01 — Campus schema (university, college, building, term)
- **ماذا سيعمل:** جداول الجامعة (الـ tenant) والكليات والمباني والفصول الدراسية مع قاعدة university_id.
- **Priority:** High · **Complexity:** M · **Status:** ✅ Done
- **Dependencies:** P1-04، D-1
- **Git Branch:** `feature/P2-01-campus-schema` · **Pull Request:** PR (feature/P2-01-campus-schema)
- **الملفات المتوقعة:** `db/migration/V2__campus.sql`، `campus/domain/*`، `campus/infra/*Repository.java`
- **Implementation Steps:** 1) Migration 2) Entities + Repositories 3) Base tenant entity 4) اختبارات
- **Acceptance Criteria:** الجداول والقيود موجودة · unique codes لكل tenant · Repository tests تنجح
- **Testing Requirements:** Repository tests (Testcontainers) · Migration test
- **ينتظر قرارات:** D-1

### P2-02 — Users, roles, vehicles schema & domain
- **ماذا سيعمل:** جداول المستخدمين والأدوار والسيارات وتوكنات refresh، مع تجزئة كلمات المرور والتحقق من لوحة السيارة السعودية.
- **Priority:** High · **Complexity:** M · **Status:** ✅ Done
- **Dependencies:** P2-01
- **Git Branch:** `feature/P2-02-users-schema` · **Pull Request:** PR (feature/P2-02-users-schema)
- **الملفات المتوقعة:** `db/migration/V3__identity.sql`، `identity/domain/*`، `identity/infra/*`
- **Implementation Steps:** 1) Migration 2) Entities 3) Value object للوحة (3 حروف عربية + أرقام) 4) BCrypt strength 12 5) اختبارات
- **Acceptance Criteria:** الرقم الجامعي unique لكل tenant · اللوحة unique لكل tenant · كلمات المرور BCrypt
- **Testing Requirements:** Unit (plate, password) · Repository tests
- **ينتظر قرارات:** لا يوجد

### P2-03 — Authentication API (register, login, refresh, logout) + RBAC
- **ماذا سيعمل:** تسجيل ودخول وتجديد وخروج بـ JWT، مع صلاحيات الأدوار وrate limiting.
- **Priority:** Critical · **Complexity:** L · **Status:** ✅ Done
- **Dependencies:** P2-02، Q3
- **Git Branch:** `feature/P2-03-authentication` · **Pull Request:** PR (feature/P2-03-authentication)
- **الملفات المتوقعة:** `common/security/*`، `identity/api/AuthController.java`، `identity/application/AuthService.java`، `DTOs`، `tests`
- **Implementation Steps:** 1) Security config stateless 2) JWT service (access 15د + refresh rotation) 3) AuthService 4) Controller + DTOs + OpenAPI 5) Rate limiter 6) اختبارات الأمان
- **Acceptance Criteria:** register ينشئ user+vehicle · كلمة مرور خاطئة = 401 بدون كشف وجود المستخدم · توكن منتهي/متلاعب به = 401 · endpoint محمي بدور = 403 · refresh القديم يبطل بعد التدوير · كلمات المرور لا تظهر في اللوج
- **Testing Requirements:** Unit · Service · API (MockMvc) · Security matrix · Token tamper/expiry
- **ينتظر قرارات:** Q3

### P2-04 — Profile & vehicle API
- **ماذا سيعمل:** عرض وتعديل الملف الشخصي وإدارة السيارات (بياناتك أنت فقط).
- **Priority:** Medium · **Complexity:** M · **Status:** ✅ Done
- **Dependencies:** P2-03
- **Git Branch:** `feature/P2-04-profile-vehicles-api` · **Pull Request:** PR (feature/P2-04-profile-vehicles-api)
- **الملفات المتوقعة:** `identity/api/MeController.java`، `identity/application/*`، `DTOs`، `tests`
- **Implementation Steps:** 1) Services 2) Controllers + DTOs 3) اختبارات IDOR
- **Acceptance Criteria:** المستخدم لا يصل إلا لبياناته · أخطاء validation بصيغة ProblemDetail
- **Testing Requirements:** Service · API · Security (IDOR)
- **ينتظر قرارات:** لا يوجد

### P2-05 — Dev/demo seed data
- **ماذا سيعمل:** بيانات تجريبية للتطوير فقط (مستخدمون/كليات/مبانٍ) مشتقة من الواجهة الحالية وبعد إخفاء الهوية.
- **Priority:** Low · **Complexity:** S · **Status:** ✅ Done
- **Dependencies:** P2-03، Q17
- **Git Branch:** `feature/P2-05-dev-seed` · **Pull Request:** PR (feature/P2-04-profile-vehicles-api)
- **الملفات المتوقعة:** `backend/.../DevSeeder.java`، `seed resources`
- **Implementation Steps:** 1) Seeder محصور على profile=dev 2) Idempotent 3) اختبار
- **Acceptance Criteria:** يعمل في dev فقط · تكراره لا يضاعف البيانات · غائب في prod
- **Testing Requirements:** Integration لكل profile
- **ينتظر قرارات:** Q17

---
# Phase P3 — Frontend Foundation (React)

### P3-01 — Design tokens, global styles & app shell
- **ماذا سيعمل:** نقل style.css والخطوط وبناء الـ Header والـ Navigation والـ Footer والـ Router بحيث يطابق التصميم الحالي.
- **Priority:** High · **Complexity:** L · **Status:** ✅ Done
- **Dependencies:** P1-02
- **Git Branch:** `feature/P3-01-app-shell` · **Pull Request:** PR (feature/P3-01-app-shell)
- **الملفات المتوقعة:** `frontend/src/styles/*`، `frontend/src/app/*`، `frontend/src/shared/layout/*`
- **Implementation Steps:** 1) نسخ CSS والخطوط 2) AppShell/Header/NavDropdown/Footer 3) Router skeleton 4) Screenshot baseline
- **Acceptance Criteria:** مطابقة بصرية (dark+light, RTL, 3 مقاسات)
- **Testing Requirements:** Component tests · Playwright responsive screenshots
- **ينتظر قرارات:** لا يوجد

### P3-02 — i18n (AR/EN), RTL/LTR switching, theme toggle
- **ماذا سيعمل:** ترجمة عربي/إنجليزي بـ react-i18next مع تبديل الاتجاه والثيم وحفظ التفضيل.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P3-01
- **Git Branch:** `feature/P3-02-i18n-theme` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/shared/i18n/*`، `locales/ar.json`، `locales/en.json`، `ThemeToggle/LangToggle`
- **Implementation Steps:** 1) استخراج النصوص من legacy 2) Provider 3) Toggles + persistence 4) اختبارات
- **Acceptance Criteria:** لا نصوص ثابتة في الـ shell · dir وlang يتحدثان · التفضيل يُحفظ
- **Testing Requirements:** Component · Playwright AR↔EN
- **ينتظر قرارات:** لا يوجد

### P3-03 — API client, auth context & route guards
- **ماذا سيعمل:** عميل HTTP typed وTanStack Query وAuth Provider وتجديد التوكن وحماية المسارات.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P3-01، P2-03
- **Git Branch:** `feature/P3-03-api-client-auth-context` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/shared/http/*`، `frontend/src/features/auth/*`
- **Implementation Steps:** 1) Client + interceptors 2) Auth provider 3) Route guards 4) Toast للأخطاء 5) اختبارات MSW
- **Acceptance Criteria:** 401 يجدد مرة ثم يخرج · المسار المحمي يعيد التوجيه · الأخطاء بتظهر مترجمة
- **Testing Requirements:** Unit · Integration (MSW)
- **ينتظر قرارات:** لا يوجد

### P3-04 — Login & Register UI wired to API
- **ماذا سيعمل:** شاشة الدخول والتسجيل مع Validation (Zod) وربط حقيقي بالـ API وحذف الدخول السريع من الإنتاج.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P3-03، P2-03
- **Git Branch:** `feature/P3-04-auth-ui` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/features/auth/*`
- **Implementation Steps:** 1) الفورم والـ validation 2) استدعاء الـ API 3) حالات الخطأ 4) Accessibility 5) اختبارات
- **Acceptance Criteria:** Validation لكل حقل · نجاح التسجيل/الدخول يحفظ الجلسة · لا قيم افتراضية صامتة
- **Testing Requirements:** Form validation · API integration · Playwright register→login
- **ينتظر قرارات:** لا يوجد

### P3-05 — Shared UI kit (Modal, Toast, Badge, Button, FormField, icons, SaudiPlate, QR)
- **ماذا سيعمل:** مكونات مشتركة بنفس شكل التصميم الحالي، مع Modal بـ focus-trap وToast بدل alert().
- **Priority:** Medium · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P3-01
- **Git Branch:** `feature/P3-05-ui-kit` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/shared/ui/*`
- **Implementation Steps:** 1) بناء المكونات 2) اختبارات 3) توثيق الاستخدام
- **Acceptance Criteria:** تعمل بالكيبورد · axe بدون مخالفات
- **Testing Requirements:** Component · axe a11y
- **ينتظر قرارات:** لا يوجد

---
# Phase P4 — Wallet & Tuition

### P4-01 — Ledger + wallet schema
- **ماذا سيعمل:** جداول المحفظة ودفتر الحركات (ledger) غير القابل للتعديل مع قيود تمنع الرصيد السالب.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P2-03
- **Git Branch:** `feature/P4-01-ledger-schema` · **Pull Request:** —
- **الملفات المتوقعة:** `db/migration/V4__wallet.sql`، `wallet/domain/*`، `wallet/infra/*`
- **Implementation Steps:** 1) Migration 2) Entities (@Version) 3) Repositories 4) اختبارات القيود
- **Acceptance Criteria:** CHECK balance >= 0 · idempotency_key unique · ledger append-only
- **Testing Requirements:** Repository tests · Constraint tests
- **ينتظر قرارات:** Q4

### P4-02 — Wallet service & API
- **ماذا سيعمل:** خدمة المحفظة: رصيد، سجل، تحويلات ذرية بين المستخدمين، وإعادة المحاولة الآمنة (Idempotency).
- **Priority:** Critical · **Complexity:** L · **Status:** Backlog
- **Dependencies:** P4-01
- **Git Branch:** `feature/P4-02-wallet-api` · **Pull Request:** —
- **الملفات المتوقعة:** `wallet/application/*`، `wallet/api/*`، `tests`
- **Implementation Steps:** 1) WalletService (debit/credit/transfer) 2) Controller + DTOs 3) Idempotency-Key 4) اختبار التزامن
- **Acceptance Criteria:** التحويل ذري · لا double-spend تحت التوازي · تكرار نفس الـ key لا يكرر العملية
- **Testing Requirements:** Unit · Service · Concurrency · API · Security
- **ينتظر قرارات:** لا يوجد

### P4-03 — Tuition accounts & payment + receipt
- **ماذا سيعمل:** حسابات الرسوم الدراسية لكل فصل وسدادها من الرصيد وإصدار رقم إيصال فريد.
- **Priority:** High · **Complexity:** L · **Status:** Backlog
- **Dependencies:** P4-02، Q4
- **Git Branch:** `feature/P4-03-tuition` · **Pull Request:** —
- **الملفات المتوقعة:** `db/migration/V5__tuition.sql`، `wallet/application/Tuition*`، `wallet/api/*`
- **Implementation Steps:** 1) Migration 2) Service 3) Receipt numbering 4) API 5) اختبارات
- **Acceptance Criteria:** المبلغ ≤ الرصيد و≤ المتبقي · رقم الإيصال فريد
- **Testing Requirements:** Unit · Service · API · Concurrency
- **ينتظر قرارات:** Q4

### P4-04 — Wallet UI (balance, history, top-up per Q4)
- **ماذا سيعمل:** شاشة المحفظة: الرصيد والسجل والشحن (حسب قرار Q4) بنفس شكل التصميم.
- **Priority:** Medium · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P3-04، P4-02
- **Git Branch:** `feature/P4-04-wallet-ui` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/features/wallet/*`
- **Implementation Steps:** 1) المكونات 2) ربط الـ API 3) حالات التحميل/الخطأ 4) اختبارات
- **Acceptance Criteria:** تطابق مع النسخة القديمة · بيانات حقيقية من السيرفر
- **Testing Requirements:** Component · API integration · E2E
- **ينتظر قرارات:** Q4

### P4-05 — Tuition UI + receipt
- **ماذا سيعمل:** شاشة سداد الرسوم وعرض/طباعة الإيصال.
- **Priority:** Medium · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P4-03، P4-04
- **Git Branch:** `feature/P4-05-tuition-ui` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/features/tuition/*`
- **Implementation Steps:** 1) فورم السداد 2) عرض الإيصال 3) طباعة 4) اختبارات
- **Acceptance Criteria:** تحقق من المبلغ · الإيصال يطابق بيانات السيرفر
- **Testing Requirements:** Form validation · API integration · E2E
- **ينتظر قرارات:** لا يوجد

---
# Phase P5 — Parking

### P5-01 — Parking schema (zones, spots, assignments, tariffs)
- **ماذا سيعمل:** جداول المناطق والمواقف والتعيينات والتعرفات.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P2-01
- **Git Branch:** `feature/P5-01-parking-schema` · **Pull Request:** —
- **الملفات المتوقعة:** `db/migration/V6__parking.sql`، `parking/domain/*`
- **Implementation Steps:** 1) Migration 2) Entities 3) Seed للمواقف (dev) 4) اختبارات
- **Acceptance Criteria:** القيود صحيحة · جاهز للـ exclusion constraints
- **Testing Requirements:** Repository tests · Migration test
- **ينتظر قرارات:** Q7

### P5-02 — Spots & zones API
- **ماذا سيعمل:** API لعرض المواقف مع فلترة بالمنطقة والحالة.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P5-01
- **Git Branch:** `feature/P5-02-spots-api` · **Pull Request:** —
- **الملفات المتوقعة:** `parking/api/*`، `parking/application/*`
- **Implementation Steps:** 1) Service 2) Controller + DTOs 3) Filtering/pagination
- **Acceptance Criteria:** الفلترة صحيحة · DTOs فقط
- **Testing Requirements:** Service · API
- **ينتظر قرارات:** لا يوجد

### P5-03 — Booking + pricing + digital pass
- **ماذا سيعمل:** حجز موقف بالسعر المحسوب على السيرفر وإصدار تصريح رقمي (QR)، مع منع تعارض الحجوزات في الـ DB.
- **Priority:** Critical · **Complexity:** L · **Status:** Backlog
- **Dependencies:** P5-02، P4-02، Q7
- **Git Branch:** `feature/P5-03-parking-booking` · **Pull Request:** —
- **الملفات المتوقعة:** `db/migration/V7__booking.sql`، `parking/application/Booking*`، `parking/api/*`
- **Implementation Steps:** 1) Exclusion constraint على الفترة 2) Pricing service 3) خصم من المحفظة ذريًا 4) Pass + QR payload 5) اختبارات
- **Acceptance Criteria:** التعارض مستحيل (اختبار توازي) · السعر من السيرفر فقط · فشل الدفع يلغي الحجز
- **Testing Requirements:** Unit pricing · Service · Concurrency · API · Security
- **ينتظر قرارات:** Q7

### P5-04 — Flex-Share offers/claims/rewards
- **ماذا سيعمل:** عرض الموقف للتبادل أثناء البريك وحجزه من زميل ومكافأة المالك حسب القواعد المعتمدة.
- **Priority:** High · **Complexity:** L · **Status:** Backlog
- **Dependencies:** P5-03، Q6
- **Git Branch:** `feature/P5-04-flex-share` · **Pull Request:** —
- **الملفات المتوقعة:** `parking/domain/Flex*`، `parking/application/Flex*`، `parking/api/*`
- **Implementation Steps:** 1) Offer/Claim model 2) Matching rules 3) Reward idempotent 4) API 5) اختبارات إساءة الاستخدام
- **Acceptance Criteria:** المكافأة مرة واحدة لكل عرض · عودة المالك مضمونة حسب القاعدة المعتمدة
- **Testing Requirements:** Unit · Service · Concurrency · API
- **ينتظر قرارات:** Q6

### P5-05 — Gate/ALPR decision API (simulated adapter)
- **ماذا سيعمل:** API يستقبل لوحة السيارة ويقرر السماح/المنع مع السبب، عبر adapter يمكن استبداله بكاميرا حقيقية لاحقًا.
- **Priority:** Medium · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P5-03، Q8
- **Git Branch:** `feature/P5-05-gate-api` · **Pull Request:** —
- **الملفات المتوقعة:** `parking/application/Gate*`، `parking/infra/SimulatedAlprAdapter.java`، `parking/api/*`
- **Implementation Steps:** 1) Port + adapter 2) Decision service 3) gate_event logging 4) API
- **Acceptance Criteria:** قرار + سبب لكل لوحة · كل محاولة تُسجّل
- **Testing Requirements:** Unit · API · Security
- **ينتظر قرارات:** Q8

### P5-06 — Parking map UI
- **ماذا سيعمل:** خريطة المواقف (30 موقف) مع فلتر المناطق وبطاقة الموقف.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P3-05، P5-02
- **Git Branch:** `feature/P5-06-map-ui` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/features/parking/map/*`
- **Implementation Steps:** 1) SpotCard وGrid 2) Zone filter 3) Spot modal 4) اختبارات
- **Acceptance Criteria:** تطابق مع legacy
- **Testing Requirements:** Component · E2E · Responsive
- **ينتظر قرارات:** لا يوجد

### P5-07 — Booking UI + pass/QR
- **ماذا سيعمل:** شاشة حجز الموقف واختيار التعرفة وعرض التصريح الرقمي.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P5-03، P5-06
- **Git Branch:** `feature/P5-07-booking-ui` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/features/parking/booking/*`
- **Implementation Steps:** 1) الفورم 2) السعر من الـ API 3) Pass modal + QR حقيقي 4) اختبارات
- **Acceptance Criteria:** السعر المعروض = سعر السيرفر
- **Testing Requirements:** Form validation · API integration · E2E
- **ينتظر قرارات:** لا يوجد

### P5-08 — Flex-Share UI
- **ماذا سيعمل:** شاشة تفعيل التبادل وحساب الأرباح المتوقعة.
- **Priority:** Medium · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P5-04، P5-06
- **Git Branch:** `feature/P5-08-flex-ui` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/features/parking/flex/*`
- **Implementation Steps:** 1) المكونات 2) ربط الـ API 3) اختبارات
- **Acceptance Criteria:** تطابق مع legacy · منع التفعيل المتكرر
- **Testing Requirements:** Component · E2E
- **ينتظر قرارات:** لا يوجد

### P5-09 — Gate scanner + simulator UI (demo)
- **ماذا سيعمل:** ماسح البوابة والمحاكي التوضيحي (للعرض فقط).
- **Priority:** Low · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P5-05
- **Git Branch:** `feature/P5-09-gate-sim-ui` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/features/parking/gate/*`، `simulator/*`
- **Implementation Steps:** 1) Gate scanner 2) Simulator stages 3) اختبارات
- **Acceptance Criteria:** تطابق مع legacy
- **Testing Requirements:** Component · E2E
- **ينتظر قرارات:** لا يوجد

---
# Phase P6 — Campus Services

### P6-01 — Tutoring schema + API (post/list/filter)
- **ماذا سيعمل:** إنشاء وعرض وفلترة جلسات الشرح بين الطلاب.
- **Priority:** High · **Complexity:** L · **Status:** Backlog
- **Dependencies:** P2-03
- **Git Branch:** `feature/P6-01-tutoring-api` · **Pull Request:** —
- **الملفات المتوقعة:** `db/migration/V8__tutoring.sql`، `tutoring/**`
- **Implementation Steps:** 1) Migration 2) Domain 3) API 4) اختبارات
- **Acceptance Criteria:** الطالب المؤهل فقط ينشر · الفلترة بالتصنيف
- **Testing Requirements:** Unit · Repository · API · Security
- **ينتظر قرارات:** Q5

### P6-02 — Tutoring booking + wallet transfer
- **ماذا سيعمل:** حجز جلسة شرح مع تحويل ذري من الطالب للمعلم حسب قواعد التسعير المعتمدة.
- **Priority:** Critical · **Complexity:** L · **Status:** Backlog
- **Dependencies:** P6-01، P4-02، Q5
- **Git Branch:** `feature/P6-02-tutoring-booking` · **Pull Request:** —
- **الملفات المتوقعة:** `tutoring/application/*`، `tutoring/api/*`
- **Implementation Steps:** 1) Enrollment 2) Transfer ذري 3) منع الحجز المكرر 4) API 5) اختبارات
- **Acceptance Criteria:** الرصيد غير الكافي يرفض · لا حجز مكرر · التسعير حسب Q5
- **Testing Requirements:** Service · Concurrency · API
- **ينتظر قرارات:** Q5

### P6-03 — Tutoring UI
- **ماذا سيعمل:** سوق الشروحات: فلترة وحجز ونشر جلسة.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P6-02، P3-05
- **Git Branch:** `feature/P6-03-tutoring-ui` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/features/tutoring/*`
- **Implementation Steps:** 1) Hub + Filters 2) Booking modal 3) Create modal 4) اختبارات
- **Acceptance Criteria:** تطابق مع legacy
- **Testing Requirements:** Component · Form validation · E2E
- **ينتظر قرارات:** لا يوجد

### P6-04 — Office-hours schema + API (windows, appointments)
- **ماذا سيعمل:** إدارة أوقات الساعات المكتبية للدكاترة وحجز المواعيد بدون تعارض.
- **Priority:** High · **Complexity:** L · **Status:** Backlog
- **Dependencies:** P2-03، Q9
- **Git Branch:** `feature/P6-04-office-hours-api` · **Pull Request:** —
- **الملفات المتوقعة:** `db/migration/V9__office_hours.sql`، `officehours/**`
- **Implementation Steps:** 1) Migration + exclusion 2) Domain 3) API 4) اختبارات
- **Acceptance Criteria:** لا تعارض في الموعد · الدكتور يدير مواعيده فقط
- **Testing Requirements:** Service · Concurrency · API · Security
- **ينتظر قرارات:** Q9

### P6-05 — Office-hours UI
- **ماذا سيعمل:** عرض الدكاترة والمواعيد المتاحة وحجز موعد.
- **Priority:** Medium · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P6-04، P3-05
- **Git Branch:** `feature/P6-05-office-hours-ui` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/features/office-hours/*`
- **Implementation Steps:** 1) Cards + slots 2) Booking modal 3) اختبارات
- **Acceptance Criteria:** تطابق مع legacy
- **Testing Requirements:** Component · E2E
- **ينتظر قرارات:** لا يوجد

### P6-06 — Rooms schema + booking API (extend/release)
- **ماذا سيعمل:** قاعات ومعامل وحجزها مع التمديد والإخلاء ومنع التعارض.
- **Priority:** High · **Complexity:** L · **Status:** Backlog
- **Dependencies:** P2-03، Q10
- **Git Branch:** `feature/P6-06-rooms-api` · **Pull Request:** —
- **الملفات المتوقعة:** `db/migration/V10__rooms.sql`، `rooms/**`
- **Implementation Steps:** 1) Migration + exclusion 2) Domain 3) Extend/Release 4) API 5) اختبارات
- **Acceptance Criteria:** لا تعارض · التمديد/الإخلاء حسب قواعد Q10
- **Testing Requirements:** Service · Concurrency · API · Security
- **ينتظر قرارات:** Q10

### P6-07 — Rooms UI + countdown
- **ماذا سيعمل:** عرض القاعات والحجز والعد التنازلي والتمديد.
- **Priority:** Medium · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P6-06، P3-05
- **Git Branch:** `feature/P6-07-rooms-ui` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/features/rooms/*`
- **Implementation Steps:** 1) Cards 2) Booking modal 3) Countdown 4) اختبارات
- **Acceptance Criteria:** تطابق مع legacy
- **Testing Requirements:** Component · E2E
- **ينتظر قرارات:** لا يوجد

---
# Phase P7 — Notifications, Admin, Analytics

### P7-01 — Notification module + API
- **ماذا سيعمل:** خدمة الإشعارات داخل التطبيق: إنشاء وقراءة وتعليم كمقروء.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P2-03
- **Git Branch:** `feature/P7-01-notifications-api` · **Pull Request:** —
- **الملفات المتوقعة:** `db/migration/V11__notifications.sql`، `notification/**`
- **Implementation Steps:** 1) Migration 2) Service 3) API 4) اختبارات
- **Acceptance Criteria:** المستخدم يرى إشعاراته فقط
- **Testing Requirements:** Service · API · Security
- **ينتظر قرارات:** لا يوجد

### P7-02 — Wire events (bookings, payments) → notifications
- **ماذا سيعمل:** ربط أحداث الحجز والدفع بإنشاء إشعارات تلقائيًا.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P7-01، P4-02، P5-03، P6-02، P6-04
- **Git Branch:** `feature/P7-02-notification-events` · **Pull Request:** —
- **الملفات المتوقعة:** `كل module: event publishers`، `notification/application/listeners`
- **Implementation Steps:** 1) Application events 2) Listeners 3) اختبارات
- **Acceptance Criteria:** كل حدث رئيسي ينتج إشعارًا
- **Testing Requirements:** Integration
- **ينتظر قرارات:** لا يوجد

### P7-03 — Notifications UI (bell/drawer)
- **ماذا سيعمل:** الجرس ودرج الإشعارات مع عدّاد غير المقروء.
- **Priority:** Medium · **Complexity:** S · **Status:** Backlog
- **Dependencies:** P7-01
- **Git Branch:** `feature/P7-03-notifications-ui` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/features/notifications/*`
- **Implementation Steps:** 1) Bell + drawer 2) Polling 3) اختبارات
- **Acceptance Criteria:** العدّاد صحيح
- **Testing Requirements:** Component · E2E
- **ينتظر قرارات:** لا يوجد

### P7-04 — Admin API (spots, rooms, tariffs, users)
- **ماذا سيعمل:** إدارة المواقف والقاعات والتعرفات والمستخدمين لدور Admin.
- **Priority:** Medium · **Complexity:** L · **Status:** Backlog
- **Dependencies:** P5-01، P6-06، Q13
- **Git Branch:** `feature/P7-04-admin-api` · **Pull Request:** —
- **الملفات المتوقعة:** `admin endpoints داخل كل module`
- **Implementation Steps:** 1) Endpoints 2) Authorization 3) Audit log 4) اختبارات
- **Acceptance Criteria:** غير الـ Admin = 403 · كل تعديل يُسجل
- **Testing Requirements:** API · Security matrix
- **ينتظر قرارات:** Q13

### P7-05 — Admin UI
- **ماذا سيعمل:** لوحة إدارة بسيطة للـ Admin.
- **Priority:** Medium · **Complexity:** L · **Status:** Backlog
- **Dependencies:** P7-04
- **Git Branch:** `feature/P7-05-admin-ui` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/src/features/admin/*`
- **Implementation Steps:** 1) الجداول والفورمات 2) Guards 3) اختبارات
- **Acceptance Criteria:** متاحة للـ Admin فقط
- **Testing Requirements:** Component · E2E
- **ينتظر قرارات:** لا يوجد

### P7-06 — Analytics endpoints + UI
- **ماذا سيعمل:** مؤشرات حقيقية بدل الأرقام الثابتة (حمل المواقف بالساعة، إلخ).
- **Priority:** Low · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P5-03
- **Git Branch:** `feature/P7-06-analytics` · **Pull Request:** —
- **الملفات المتوقعة:** `analytics/**`، `frontend/src/features/analytics/*`
- **Implementation Steps:** 1) Queries 2) API 3) UI 4) اختبارات
- **Acceptance Criteria:** الأرقام من بيانات فعلية
- **Testing Requirements:** Repository · API · Component
- **ينتظر قرارات:** لا يوجد

---
# Phase P8 — Hardening & QA

### P8-01 — Security review (OWASP ASVS, dependency scan, headers)
- **ماذا سيعمل:** مراجعة أمنية شاملة وإصلاح الثغرات.
- **Priority:** High · **Complexity:** L · **Status:** Backlog
- **Dependencies:** P7-06
- **Git Branch:** `test/P8-01-security-review` · **Pull Request:** —
- **الملفات المتوقعة:** `security config`، `docs/security-review.md`
- **Implementation Steps:** 1) ASVS checklist 2) Dependency scan 3) Headers/CORS 4) اختبارات اختراق أساسية
- **Acceptance Criteria:** لا ثغرات High/Critical مفتوحة
- **Testing Requirements:** Security tests · Dependency scan
- **ينتظر قرارات:** لا يوجد

### P8-02 — Full E2E suite (Playwright) AR/EN, dark/light
- **ماذا سيعمل:** اختبارات End-to-End لكل الرحلات الأساسية بالعربي والإنجليزي والثيمين.
- **Priority:** High · **Complexity:** L · **Status:** Backlog
- **Dependencies:** P7-06
- **Git Branch:** `test/P8-02-e2e-suite` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/e2e/**`
- **Implementation Steps:** 1) Fixtures 2) Flows 3) CI integration
- **Acceptance Criteria:** كل الرحلات الأساسية خضراء
- **Testing Requirements:** Playwright
- **ينتظر قرارات:** لا يوجد

### P8-03 — Responsive + accessibility audit & fixes
- **ماذا سيعمل:** مراجعة التجاوب وإمكانية الوصول وإصلاحها.
- **Priority:** Medium · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P7-06
- **Git Branch:** `fix/P8-03-responsive-a11y` · **Pull Request:** —
- **الملفات المتوقعة:** `frontend/**`
- **Implementation Steps:** 1) axe audit 2) اختبار 360/768/1280 3) إصلاحات
- **Acceptance Criteria:** لا مخالفات حرجة
- **Testing Requirements:** axe · Playwright viewports
- **ينتظر قرارات:** لا يوجد

### P8-04 — Performance & load test (booking/wallet concurrency)
- **ماذا سيعمل:** اختبار حمل وتزامن للحجز والمحفظة وضبط الأداء.
- **Priority:** Medium · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P7-06
- **Git Branch:** `test/P8-04-performance` · **Pull Request:** —
- **الملفات المتوقعة:** `backend/src/test/**`، `load scripts`
- **Implementation Steps:** 1) سيناريوهات 2) تشغيل 3) تحسين
- **Acceptance Criteria:** لا فقد/تكرار للأموال تحت الحمل
- **Testing Requirements:** Load test · Concurrency
- **ينتظر قرارات:** لا يوجد

### P8-05 — Privacy/PDPL checklist, audit-log review
- **ماذا سيعمل:** مراجعة الخصوصية وتقليل البيانات وسجل التدقيق.
- **Priority:** Medium · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P7-06، Q17
- **Git Branch:** `chore/P8-05-privacy` · **Pull Request:** —
- **الملفات المتوقعة:** `docs/privacy.md`، `config`
- **Implementation Steps:** 1) جرد البيانات الشخصية 2) سياسة الاحتفاظ 3) مراجعة الـ audit log
- **Acceptance Criteria:** قائمة PDPL مكتملة
- **Testing Requirements:** مراجعة + اختبارات اللوج بدون PII
- **ينتظر قرارات:** Q17

---
# Phase P9 — Release & Operations

### P9-01 — Production compose/config, secrets handling
- **ماذا سيعمل:** إعداد بيئة الإنتاج وإدارة الأسرار.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P8-05، Q16
- **Git Branch:** `chore/P9-01-prod-config` · **Pull Request:** —
- **الملفات المتوقعة:** `docker-compose.prod.yml`، `docs/runbooks/deployment.md`
- **Implementation Steps:** 1) Prod compose 2) Secrets 3) TLS/Reverse proxy
- **Acceptance Criteria:** لا أسرار في Git · يقوم بـ docker compose prod
- **Testing Requirements:** Compose startup · Health checks
- **ينتظر قرارات:** Q16

### P9-02 — CD pipeline + staging deploy
- **ماذا سيعمل:** نشر تلقائي على staging.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P9-01
- **Git Branch:** `ci/P9-02-cd` · **Pull Request:** —
- **الملفات المتوقعة:** `.github/workflows/cd.yml`
- **Implementation Steps:** 1) Workflow 2) Environment secrets 3) Smoke test بعد النشر
- **Acceptance Criteria:** نشر staging ناجح
- **Testing Requirements:** Deploy فعلي + smoke
- **ينتظر قرارات:** Q16

### P9-03 — Backups/restore + monitoring/alerts
- **ماذا سيعمل:** نسخ احتياطي واستعادة ومراقبة وتنبيهات.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P9-01
- **Git Branch:** `chore/P9-03-backup-monitoring` · **Pull Request:** —
- **الملفات المتوقعة:** `scripts/backup*`، `docs/runbooks/backup-restore.md`
- **Implementation Steps:** 1) Backup job 2) Restore test 3) Metrics + alerts
- **Acceptance Criteria:** الاستعادة مجرّبة فعليًا
- **Testing Requirements:** Restore drill
- **ينتظر قرارات:** لا يوجد

### P9-04 — Runbooks complete + release v1.0
- **ماذا سيعمل:** إكمال الـ Runbooks وإصدار v1.0.
- **Priority:** High · **Complexity:** M · **Status:** Backlog
- **Dependencies:** P9-02، P9-03
- **Git Branch:** `chore/P9-04-release-1.0` · **Pull Request:** —
- **الملفات المتوقعة:** `docs/runbooks/*`، `CHANGELOG.md`
- **Implementation Steps:** 1) Runbooks 2) Release notes 3) Tag v1.0
- **Acceptance Criteria:** كل الـ Runbooks مجرّبة · v1.0 منشور
- **Testing Requirements:** Full regression · Smoke على production
- **ينتظر قرارات:** لا يوجد
