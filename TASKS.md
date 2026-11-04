# TASKS.md

Status values: `Backlog` · `Ready` (deps done) · `In Progress` · `In Review` · `Blocked` · `Done`.
Complexity: S (≤½ day) · M (1 day) · L (2–3 days) · XL (split).
Branch/PR fields are filled when the task starts. Phases P1–P3 are fully specified below; P4–P9 are specified at table level and **must be expanded to the full template at kickoff** (rules still depend on owner answers Q3–Q10).

## Dashboard
| Phase | Tasks | Done | In Review | Blocked/Waiting |
|---|---|---|---|---|
| P0 Discovery | 1 | 0 | 1 | 0 |
| P1 Foundation | 6 | 0 | 0 | 6 (awaiting plan approval) |
| P2 Identity | 5 | 0 | 0 | 5 |
| P3 Frontend Foundation | 5 | 0 | 0 | 5 |
| P4–P9 | see tables | 0 | 0 | — |

---
# Phase 0 — Discovery

### P0-01 — Project discovery & planning
- **Description:** Audit repo, inventory UI, PRD, flows, architecture, ERD, MVP, roadmap, tasks, risks.
- **Priority:** P0 · **Dependencies:** none · **Complexity:** L
- **Acceptance:** all docs in `docs/discovery`, `docs/architecture`, `plan.md`, `TASKS.md` exist and are consistent; report delivered.
- **Implementation steps:** done (see `docs/session-log.md`).
- **Testing:** `npm run build` baseline executed ✅.
- **Status:** In Review · **Branch:** `docs/P0-01-project-discovery` · **PR:** not opened (awaiting owner permission)

---
# Phase 1 — Foundation & DevOps

### P1-01 — Repository restructure (monorepo) & legacy preservation
- **Description:** Create `frontend/`, `backend/`, `legacy/`; move showcase, presentation, `UI-UX/`, `scripts/` to `legacy/`; dedupe assets; update README; keep GitHub Pages deploy for legacy until replaced.
- **Priority:** High · **Dependencies:** P0-01 approved, Q12, Q14 · **Complexity:** M
- **Acceptance:** no file lost (git history keeps renames); `legacy` pages still build/open; root has only governance files + folders; asset duplicates removed; README updated.
- **Steps:** 1) `git mv` into new folders. 2) Fix relative paths/vite config. 3) Remove dead `configureServer` or move into plugin. 4) Update `.gitignore`, README. 5) Verify legacy build.
- **Testing:** legacy `npm run build` succeeds; link check of showcase assets; `git status` clean of unrelated files.
- **Status:** Backlog · **Branch:** `chore/P1-01-repo-restructure` · **PR:** —

### P1-02 — Frontend scaffold (Vite + React + TS strict)
- **Description:** New `frontend/` app with React 18, TS strict, ESLint, Prettier, Vitest + Testing Library, path aliases, env typing. No features.
- **Priority:** High · **Dependencies:** P1-01, D-2 · **Complexity:** M
- **Acceptance:** `npm run dev/build/lint/test` pass; sample component test passes; strict TS with zero errors.
- **Steps:** scaffold; configure lint/format; Vitest setup; folder structure per architecture §7; CI-friendly scripts.
- **Testing:** execute lint, typecheck, unit test, build.
- **Status:** Backlog · **Branch:** `feature/P1-02-frontend-scaffold` · **PR:** —

### P1-03 — Backend skeleton (Spring Boot 3, Java 21)
- **Description:** Maven project, base package, Actuator health, springdoc, `GlobalExceptionHandler` (ProblemDetail), logging config (JSON-ready, no PII), profiles (`dev`,`test`,`prod`), ArchUnit module-boundary test, Spotless.
- **Priority:** High · **Dependencies:** P1-01, Q11, D-3 · **Complexity:** M
- **Acceptance:** app boots; `/actuator/health` UP; `/swagger-ui` loads; unknown route → RFC7807 JSON; validation error → 400 ProblemDetail; ArchUnit test passes.
- **Steps:** init project; common package; exception handler + tests; OpenAPI config; profiles; ArchUnit rules.
- **Testing:** unit tests for handler, `@WebMvcTest`, context-load test; run `mvn verify`.
- **Status:** Backlog · **Branch:** `feature/P1-03-backend-skeleton` · **PR:** —

### P1-04 — PostgreSQL, Flyway baseline & Testcontainers base
- **Description:** JPA + Postgres driver + Flyway; `V1__baseline.sql` (extensions `pgcrypto`, `btree_gist`); `ddl-auto=validate`; Testcontainers abstract IT base class; HikariCP config.
- **Priority:** High · **Dependencies:** P1-03 · **Complexity:** M
- **Acceptance:** app migrates an empty DB on startup; IT starts a real Postgres container; migration re-run is a no-op; failing migration fails startup.
- **Steps:** deps; config via env vars; baseline migration; `AbstractIntegrationTest`; sample repository test.
- **Testing:** integration test with Testcontainers (requires Docker running) — executed and observed.
- **Status:** Backlog · **Branch:** `feature/P1-04-database-flyway` · **PR:** —

### P1-05 — Dockerfiles, Compose, health checks, env config
- **Description:** Multi-stage backend Dockerfile (non-root), frontend Dockerfile (build → Nginx, `/api` proxy), `docker-compose.yml` (db with volume + healthcheck, backend, frontend, network), `.env.example`, `.dockerignore`, runbook `local-development.md`.
- **Priority:** High · **Dependencies:** P1-02, P1-03, P1-04 · **Complexity:** M
- **Acceptance:** `cp .env.example .env && docker compose up --build` → all 3 services healthy; frontend reachable; `/api/actuator/health` UP through Nginx; DB data persists across restart; no secrets in Git.
- **Steps:** write files; healthchecks; depends_on conditions; named volume; docs.
- **Testing:** docker build ×2; compose up smoke; DB connection check; health check; restart persistence.
- **Status:** Backlog · **Branch:** `feature/P1-05-docker-compose` · **PR:** —

### P1-06 — CI pipeline (GitHub Actions)
- **Description:** Workflows: frontend (install, lint, typecheck, test, build), backend (`mvn verify` with Testcontainers), docker build, compose smoke; PR template; Dependabot; secret scanning; branch-protection notes. Existing Pages deploy limited to legacy.
- **Priority:** High · **Dependencies:** P1-05 · **Complexity:** M
- **Acceptance:** all jobs green on a PR; required checks documented; failing test fails the pipeline (demonstrated).
- **Steps:** workflows; caching; matrix; PR template; docs update.
- **Testing:** validated with `act`/real run on pushed branch **(push requires owner permission)**.
- **Status:** Backlog · **Branch:** `ci/P1-06-github-actions` · **PR:** —

---
# Phase 2 — Identity & Campus Core

### P2-01 — Campus schema (university, college, building, term)
- **Description:** Flyway V2 + entities/repositories for tenant root and campus reference data; `university_id` convention (ADR-0003).
- **Priority:** High · **Dependencies:** P1-04, D-1 · **Complexity:** M
- **Acceptance:** tables + constraints exist; repository tests pass on Postgres; unique per-tenant codes enforced.
- **Steps:** migration; entities; repositories; base tenant entity; tests.
- **Testing:** repository tests (Testcontainers); migration test.
- **Status:** Backlog · **Branch:** `feature/P2-01-campus-schema` · **PR:** —

### P2-02 — Users, roles, vehicles schema & domain
- **Description:** `app_user`, `user_role`, `vehicle`, `refresh_token`; password hashing service; Saudi plate validation (3 Arabic letters + 1–4 digits — confirm).
- **Priority:** High · **Dependencies:** P2-01 · **Complexity:** M
- **Acceptance:** unique university number per tenant; unique plate per tenant; BCrypt strength 12; domain validation tests.
- **Steps:** migration; entities; plate value object; password encoder; tests.
- **Testing:** unit (plate, password), repository tests.
- **Status:** Backlog · **Branch:** `feature/P2-02-users-schema` · **PR:** —

### P2-03 — Authentication API (register, login, refresh, logout) + RBAC
- **Description:** Spring Security stateless; JWT access (15 min) + rotating refresh; `/api/v1/auth/*`; `@PreAuthorize`; rate limit; error codes; OpenAPI docs.
- **Priority:** Critical · **Dependencies:** P2-02, Q3 · **Complexity:** L
- **Acceptance:** register creates user+vehicle (+wallet hook later); wrong password → 401 without user enumeration; expired/tampered token → 401; role-protected endpoint → 403; refresh rotation invalidates old token; passwords never logged.
- **Steps:** security config; JWT service; auth service; controller/DTOs; rate limiter; tests.
- **Testing:** unit, service, API (MockMvc), security matrix tests, token tamper/expiry tests.
- **Status:** Backlog · **Branch:** `feature/P2-03-authentication` · **PR:** —

### P2-04 — Profile & vehicle API
- **Description:** `GET/PATCH /api/v1/me`, vehicle CRUD (own only), locale/theme preferences.
- **Priority:** Medium · **Dependencies:** P2-03 · **Complexity:** M
- **Acceptance:** users can only access their own data (IDOR tests); validation errors are ProblemDetail.
- **Steps:** services; controllers; DTOs; tests.
- **Testing:** service + API + security (IDOR).
- **Status:** Backlog · **Branch:** `feature/P2-04-profile-vehicles-api` · **PR:** —

### P2-05 — Dev/demo seed data
- **Description:** `dev` profile only seeder derived from current UI (anonymised per Q17): users per role, colleges, buildings.
- **Priority:** Low · **Dependencies:** P2-03, Q17 · **Complexity:** S
- **Acceptance:** seed runs only in `dev`; idempotent; absent in `prod` (test).
- **Steps:** seeder; profile guard; test.
- **Testing:** integration test per profile.
- **Status:** Backlog · **Branch:** `feature/P2-05-dev-seed` · **PR:** —

---
# Phase 3 — Frontend Foundation

### P3-01 — Design tokens, global styles & app shell
- **Description:** Port `style.css` and fonts; implement `AppShell`, `Header`, nav dropdowns, `Footer`, `Hero` placeholder; router skeleton.
- **Priority:** High · **Dependencies:** P1-02 · **Complexity:** L
- **Acceptance:** shell visually matches legacy (screenshot comparison dark+light, AR/RTL, 3 viewports).
- **Steps:** copy CSS; build layout components; routes; Playwright screenshot baseline.
- **Testing:** component tests; Playwright responsive screenshots.
- **Status:** Backlog · **Branch:** `feature/P3-01-app-shell` · **PR:** —

### P3-02 — i18n (AR/EN) & RTL/LTR switching, theme toggle
- **Description:** `react-i18next` catalogs extracted from legacy strings; dir/lang switching; persisted theme/locale.
- **Priority:** High · **Dependencies:** P3-01 · **Complexity:** M
- **Acceptance:** no hard-coded UI strings in shell; toggles persist; `dir` and `lang` update.
- **Steps:** catalogs; provider; toggles; tests.
- **Testing:** component tests; Playwright AR↔EN.
- **Status:** Backlog · **Branch:** `feature/P3-02-i18n-theme` · **PR:** —

### P3-03 — API client, auth context & route guards
- **Description:** Typed HTTP client (from OpenAPI), TanStack Query setup, auth provider, refresh handling, protected routes, global error/toast mapping.
- **Priority:** High · **Dependencies:** P3-01, P2-03 (OpenAPI contract) · **Complexity:** M
- **Acceptance:** 401 triggers refresh once, then logout; guarded routes redirect; errors show localized toast.
- **Steps:** client; interceptors; provider; guards; MSW tests.
- **Testing:** unit + integration with MSW.
- **Status:** Backlog · **Branch:** `feature/P3-03-api-client-auth-context` · **PR:** —

### P3-04 — Login & Register UI wired to API
- **Description:** Port auth modal; Zod validation (name, ID, plate, phone, password strength); real error states; remove demo quick-login from production build.
- **Priority:** High · **Dependencies:** P3-03, P2-03 · **Complexity:** M
- **Acceptance:** form validation per field; successful register/login stores session; no silent defaults.
- **Steps:** forms; validation; API calls; a11y; tests.
- **Testing:** form validation tests, API integration, Playwright register→login E2E.
- **Status:** Backlog · **Branch:** `feature/P3-04-auth-ui` · **PR:** —

### P3-05 — Shared UI kit (Modal, Toast, Badge, Button, FormField, icons, SaudiPlate, QR)
- **Description:** Reusable components with legacy look; focus-trap modal; accessible toasts (replace `alert()`).
- **Priority:** Medium · **Dependencies:** P3-01 · **Complexity:** M
- **Acceptance:** keyboard-accessible, axe-clean; used by P3-04.
- **Steps:** components; stories/tests; docs.
- **Testing:** component + axe tests.
- **Status:** Backlog · **Branch:** `feature/P3-05-ui-kit` · **PR:** —

---
# Phase 4 — Wallet & Tuition *(gated by Q4)*
| ID | Title | Deps | Priority | Cx | Acceptance (summary) | Branch |
|---|---|---|---|---|---|---|
| P4-01 | Ledger + wallet schema | P2-03 | High | M | append-only ledger, `balance>=0` CHECK, idempotency key unique | `feature/P4-01-ledger-schema` |
| P4-02 | Wallet service & API | P4-01 | Critical | L | atomic transfers; concurrent debit test; idempotent retries | `feature/P4-02-wallet-api` |
| P4-03 | Tuition accounts & payment + receipt | P4-02, Q4 | High | L | pay ≤ balance & ≤ remaining; receipt no unique | `feature/P4-03-tuition` |
| P4-04 | Wallet UI (balance, history, top-up per Q4) | P3-04, P4-02 | Medium | M | parity with legacy modal | `feature/P4-04-wallet-ui` |
| P4-05 | Tuition UI + receipt | P4-03, P4-04 | Medium | M | receipt view/print | `feature/P4-05-tuition-ui` |

# Phase 5 — Parking *(gated by Q6–Q8)*
| ID | Title | Deps | Pri | Cx | Acceptance (summary) | Branch |
|---|---|---|---|---|---|---|
| P5-01 | Parking schema (zones, spots, assignments, tariffs) | P2-01 | High | M | exclusion-ready schema | `feature/P5-01-parking-schema` |
| P5-02 | Spots & zones API | P5-01 | High | M | filter by zone/status | `feature/P5-02-spots-api` |
| P5-03 | Booking + pricing + digital pass | P5-02, P4-02, Q7 | Critical | L | overlap impossible; price server-side | `feature/P5-03-parking-booking` |
| P5-04 | Flex-Share offers/claims/rewards | P5-03, Q6 | High | L | idempotent reward; abuse tests | `feature/P5-04-flex-share` |
| P5-05 | Gate/ALPR decision API (simulated adapter) | P5-03, Q8 | Medium | M | allow/deny with reason; adapter port | `feature/P5-05-gate-api` |
| P5-06 | Parking map UI | P3-05, P5-02 | High | M | parity incl. zone filter | `feature/P5-06-map-ui` |
| P5-07 | Booking UI + pass/QR | P5-03, P5-06 | High | M | parity | `feature/P5-07-booking-ui` |
| P5-08 | Flex-Share UI | P5-04, P5-06 | Medium | M | parity | `feature/P5-08-flex-ui` |
| P5-09 | Gate scanner + simulator UI (demo) | P5-05 | Low | M | parity | `feature/P5-09-gate-sim-ui` |

# Phase 6 — Campus Services *(gated by Q5, Q9, Q10)*
| ID | Title | Deps | Pri | Cx | Branch |
|---|---|---|---|---|---|
| P6-01 | Tutoring schema + API (post/list/filter) | P2-03 | High | L | `feature/P6-01-tutoring-api` |
| P6-02 | Tutoring booking + wallet transfer | P6-01, P4-02, Q5 | Critical | L | `feature/P6-02-tutoring-booking` |
| P6-03 | Tutoring UI | P6-02, P3-05 | High | M | `feature/P6-03-tutoring-ui` |
| P6-04 | Office-hours schema + API (windows, appointments) | P2-03, Q9 | High | L | `feature/P6-04-office-hours-api` |
| P6-05 | Office-hours UI | P6-04, P3-05 | Medium | M | `feature/P6-05-office-hours-ui` |
| P6-06 | Rooms schema + booking API (extend/release) | P2-03, Q10 | High | L | `feature/P6-06-rooms-api` |
| P6-07 | Rooms UI + countdown | P6-06, P3-05 | Medium | M | `feature/P6-07-rooms-ui` |

# Phase 7 — Notifications, Admin, Analytics
| ID | Title | Deps | Pri | Cx | Branch |
|---|---|---|---|---|---|
| P7-01 | Notification module + API | P2-03 | High | M | `feature/P7-01-notifications-api` |
| P7-02 | Wire events (bookings, payments) → notifications | P7-01, P4-02, P5-03, P6-02, P6-04 | High | M | `feature/P7-02-notification-events` |
| P7-03 | Notifications UI (bell/drawer) | P7-01 | Medium | S | `feature/P7-03-notifications-ui` |
| P7-04 | Admin API (spots, rooms, tariffs, users) | P5-01, P6-06, Q13 | Medium | L | `feature/P7-04-admin-api` |
| P7-05 | Admin UI | P7-04 | Medium | L | `feature/P7-05-admin-ui` |
| P7-06 | Analytics endpoints + UI | P5-03 | Low | M | `feature/P7-06-analytics` |

# Phase 8 — Hardening & QA
| ID | Title | Deps | Branch |
|---|---|---|---|
| P8-01 | Security review (OWASP ASVS pass, dependency scan, headers) | P7 | `test/P8-01-security-review` |
| P8-02 | Full E2E suite (Playwright) AR/EN, dark/light | P7 | `test/P8-02-e2e-suite` |
| P8-03 | Responsive + accessibility audit & fixes | P7 | `fix/P8-03-responsive-a11y` |
| P8-04 | Performance & load test (booking/wallet concurrency) | P7 | `test/P8-04-performance` |
| P8-05 | Privacy/PDPL checklist, audit-log review | P7, Q17 | `chore/P8-05-privacy` |

# Phase 9 — Release & Operations
| ID | Title | Deps | Branch |
|---|---|---|---|
| P9-01 | Production compose/config, secrets handling | P8, Q16 | `chore/P9-01-prod-config` |
| P9-02 | CD pipeline + staging deploy | P9-01 | `ci/P9-02-cd` |
| P9-03 | Backups/restore + monitoring/alerts | P9-01 | `chore/P9-03-backup-monitoring` |
| P9-04 | Runbooks complete + release v1.0 | P9-02, P9-03 | `chore/P9-04-release-1.0` |
