# 07 — Open Questions & Decisions Required

Answers are needed before the dependent task starts. "Recommended" = my engineering suggestion, **not** a decision.

## Blocking for Phase 1
| ID | Question | Recommended | Blocks |
|---|---|---|---|
| Q1 | `plan.md` was referenced as attached but is **not in the repo**. Please attach it; I created a draft `plan.md` that must be reconciled with yours. | Attach | all |
| Q2 | Is the real product **FBSU Smart Campus (parking + tutoring + office hours + rooms + wallet)**, or must it also include classic university-site content (news, admissions, programs)? | Smart Campus only | scope |
| Q11 | Java toolchain: JDK 21 + Maven are **not installed**. Install locally, or build/test backend **only in Docker**? Maven or Gradle? | Install JDK 21 + Maven (Maven Wrapper); Docker for CI/prod | P1-03 |
| Q12 | Legacy assets (`index.html` showcase, `presentation.html`, `UI-UX/`, `scripts/`): keep under `legacy/`, or remove? Also assets are stored 3× (public / UI-UX / dist). | Move to `legacy/`, dedupe assets | P1-01 |
| Q14 | Uncommitted formatting change in `UI-UX/index.html`: keep or discard? (I did not touch/commit it.) | Discard if it was only auto-format | P1-01 |
| D-1 | **Multi-tenancy**: "SaaS" suggests many universities. Single tenant (FBSU) now, or multi from day one? | Single deployment now, **`university_id` on tenant-owned tables from day one** (shared DB/schema), enforced via Hibernate filter later | P2-01 |
| D-2 | Frontend stack additions: React 18+, Vite, React Router, TanStack Query, react-hook-form + Zod, react-i18next, **plain CSS (reuse `style.css`, no Tailwind)** to preserve the design. OK? | Yes | P1-02 |
| D-3 | Backend: Java 21 LTS, Spring Boot 3.x, Spring Modulith **not** used; modules enforced by package convention + ArchUnit. OK? | Yes | P1-03 |

## Business rules (block their feature phase)
| ID | Question | Blocks |
|---|---|---|
| Q3 | **Authentication**: local accounts, or integrate FBSU university SSO (OIDC/SAML)? Who verifies a student/faculty identity at registration? Welcome credit of 100 SAR — keep? | P2-03 |
| Q4 | **Money**: is wallet funded only by earnings (closed-loop) or also by real top-up (which gateway)? Is tuition payment real (registrar integration) or an internal record for now? Any legal/financial approval needed? | P4 |
| Q5 | **Tutoring**: price = hourly rate × duration (TUT-104 is 1.5 h)? Platform commission? Cancellation/refund? Session capacity? How are ratings collected? | P6 |
| Q6 | **Flex-Share**: what does the borrower pay? Owner reward = 5.75×hours — fixed or % of borrower fee? Matching rules? Penalty if owner returns early / borrower overstays? What does "100 % guaranteed return" mean operationally? | P5 |
| Q7 | **Parking tariffs**: hourly 5.75, daily 15, monthly 450 (225 with share) — authoritative? Who edits them? Do faculty/EV/accessible zones have different rules/eligibility? | P5 |
| Q8 | **ALPR**: simulated only for MVP, or real camera integration (vendor/API)? | P5 |
| Q9 | **Office hours**: faculty set their own windows? Need approval/cancel? Max bookings per student? | P6 |
| Q10 | **Rooms/labs**: max duration, overlap policy, eligibility, no-show penalty, who approves? | P6 |
| Q13 | **Admin roles** missing in UI: who manages spots/rooms/tariffs/users (Admin, Parking Operator, Finance)? | P2/P7 |
| Q15 | Notifications channels beyond in-app (email/SMS)? | P7 |
| Q16 | Deployment target for real use (VPS, cloud, university data-centre)? Keep GitHub Pages for legacy showcase? Data residency (KSA) requirements? | P9 |
| Q17 | Real-looking personal data in source (names, IDs, plates): may it ship as demo seed, or must it be anonymised? | P2-05 |
