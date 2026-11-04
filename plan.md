# plan.md — Master Plan: FBSU University SaaS Platform

> Draft created in P0-01 because the referenced `plan.md` was not found (Q1). Reconcile with the owner's version when provided.
> Status of the plan: **awaiting owner approval**. Live task state is in [TASKS.md](TASKS.md).

## 1. Vision
Turn the existing FBSU Smart Campus & Parking front-end prototype (vanilla JS, mock data) into a secure, tested, deployable product: React + TypeScript SPA, Java Spring Boot modular-monolith API, PostgreSQL, Docker, CI/CD — **preserving the current UI/UX**.

## 2. Guiding rules
1. Discovery before code; no invented business rules (open questions in `docs/discovery/07-open-questions.md`).
2. One task = one branch = one PR; never work on `main`; no push/merge without explicit owner approval.
3. Tests executed and observed before claiming success.
4. Task-by-task sessions; state lives in `TASKS.md` and `docs/session-log.md`.

## 3. Target stack
Frontend: React 18 + TS (strict) + Vite, React Router, TanStack Query, react-hook-form + Zod, react-i18next, plain CSS (ported), Vitest + Testing Library + Playwright.
Backend: Java 21, Spring Boot 3.x, Spring Web/Validation/Security (JWT), Spring Data JPA/Hibernate, Flyway, springdoc-openapi, JUnit 5, Mockito, Testcontainers, ArchUnit.
Data: PostgreSQL 16. Ops: Docker, Docker Compose, GitHub Actions.

## 4. Phases

| Phase | Name | Outcome | Exit criteria |
|---|---|---|---|
| **P0** | Discovery & Planning | Audit, UI inventory, PRD, flows, architecture, ERD, MVP, roadmap, tasks, risks | Owner approves plan + decisions |
| **P1** | Foundation & DevOps | Monorepo, React/TS scaffold, Spring Boot skeleton, Postgres+Flyway, Docker Compose, CI | `docker compose up` gives healthy db/backend/frontend; CI green |
| **P2** | Identity & Campus Core | Campus/user/role/vehicle schema, JWT auth, RBAC, profile API, dev seed | Register/login/refresh work; security tests green |
| **P3** | Frontend Foundation | Design tokens + shell, i18n/RTL, theme, API client, auth UI, shared UI kit | Visual parity of shell/auth; component + e2e tests |
| **P4** | Wallet & Tuition | Ledger, wallet API, tuition payment + receipt, UI | No double-spend under concurrency tests |
| **P5** | Parking | Spots/zones, tariffs, bookings, digital pass, Flex-Share, simulated gate, UI | Overlap impossible at DB level; flows e2e |
| **P6** | Campus Services | Tutoring, office hours, rooms (API + UI) | Flows e2e; wallet transfers atomic |
| **P7** | Notifications, Admin, Analytics | In-app notifications, minimal admin console, analytics endpoints | Role-restricted admin; notifications on all events |
| **P8** | Hardening & QA | Security review, performance, a11y, responsive, full e2e, data privacy | All quality gates met |
| **P9** | Release & Operations | Prod compose/deploy, backups, monitoring, runbooks, release v1.0 | Staging deploy verified; runbooks tested |

## 5. Dependencies between phases
P1 → P2 → (P3 ∥ P4) → P5 → P6 → P7 → P8 → P9. P3 can start after P1-02 and P2-03 contract (OpenAPI) exist. Business-rule phases (P4–P6) are gated by owner answers Q4–Q10.

## 6. Milestones
| Milestone | After | Deliverable |
|---|---|---|
| M0 | P0 | Approved plan |
| M1 | P1 | Runnable skeleton in Docker |
| M2 | P3 | Login works end-to-end in new UI |
| M3 | P6 | All existing features live on real backend (MVP functional) |
| M4 | P8 | Release candidate |
| M5 | P9 | v1.0 deployed |

(No calendar dates are promised until velocity is measured after P1.)

## 7. Definition of Done (per task)
Acceptance criteria met · tests written + executed · CI green · docs/CHANGELOG updated · self-review + clean diff · PR prepared · owner approval.

## 8. Documents
Discovery: `docs/discovery/01…07` · Architecture: `docs/architecture/` · Testing: `docs/testing/testing-strategy.md` · ADRs: `docs/decisions/` · Runbooks: `docs/runbooks/` · Session notes: `docs/session-log.md`.
