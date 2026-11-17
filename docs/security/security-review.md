# Security Review — P8-01

**Date:** 2026-11-16 · **Branch:** `test/P8-01-security-review` · **Scope:** backend API (Spring Boot), nginx frontend proxy, dependencies.
**Method:** manual code review against OWASP ASVS 4.0 (V2 auth, V3 session, V4 access control, V8 data protection, V11 business logic, V14 config) and OWASP API Top 10; dependency scan with `npm audit` and a version check against Maven Central.

## Summary

| Severity | Found | Fixed in this branch | Open |
|---|---|---|---|
| Critical | 4 | 4 | 0 |
| High | 9 | 7 | 2 (accepted / follow-up, see below) |
| Medium | 8 | 8 | 0 |
| Low | 3 | 1 | 2 |

The worst issues were **business-logic flaws in the wallet** that let any logged-in user pay tuition, enrol in tutoring, or book parking without being charged, and mint wallet balance from nothing.

## Findings and fixes

### Critical

| ID | Finding | Fix |
|---|---|---|
| C1 | **Idempotency-key replay = free payments.** `WalletService.debit/transfer` returned silently when a caller-supplied key already existed; callers (`TuitionService.payTuition`, `TutoringBookingService`) then marked the invoice paid / saved the enrollment anyway. Reusing a 1 SAR top-up key paid a full invoice. | Money-moving operations (`debit`, `refund`, `transfer`) now throw `DuplicateTransactionException` → **409** on a used key. `topUp` only treats a key as a harmless retry when it belongs to the same user. |
| C2 | **Free parking + money creation.** `CreateBookingRequest.autoDebitWallet=false` skipped the charge, but cancelling refunded the full tariff. | Server always charges; the flag is ignored (kept in the DTO for compatibility). |
| C3 | **Anonymous gate scan** (`POST /parking/gate/scan` was `permitAll`): plate → driver name, user type, assigned bay; activated other users' bookings (blocking their refund); wrote fake audit rows; returned `OPEN_BARRIER`. | Restricted to `SECURITY_OFFICER` / `CAMPUS_ADMIN` (URL rule + `@PreAuthorize`). UI disables the scan button for other roles. |
| C4 | Same root cause as C1 for tutoring enrollment. | Covered by C1. |

### High

| ID | Finding | Fix |
|---|---|---|
| H1 | IDOR: `GET /tuition/invoices/{id}` returned any student's invoice. | Scoped to owner; others get 404. |
| H2 | IDOR: `GET /tuition/receipts/{id}` returned any receipt incl. payer name, university number and verification code. | Scoped to payer; others get 404. |
| H3 | Public `GET /parking/spots` exposed occupant id, name, car model and full plate. | Occupant fields only for the occupant and gate staff. |
| H4 | Cross-tenant admin: `PATCH /admin/users/{id}/status|roles` could suspend users or grant `CAMPUS_ADMIN` in another university. | Lookup filtered by the admin's `universityId`. |
| H5 | No brute-force protection on `/auth/login` (P2-03 claimed it, none existed). | `AuthRateLimiter`: 5 failures/account and 20 failures/IP per 15 min, 10 registrations/IP per hour → **429** + `Retry-After`. Only failures are counted. |
| H6 | Refresh tokens stored in plaintext (in a column named `token_hash`); rotation pointer also stored the raw new token. | Tokens are 256-bit random, stored as SHA-256. Reusing a rotated token revokes the whole session family. Suspended users can no longer refresh. |
| H7 | `/actuator/**` public (metrics), health details `always` in base config; Swagger/API docs published in prod. | Only `health`/`info` public; other actuator endpoints admin-only and not proxied by nginx; health details `when-authorized`; springdoc disabled in `prod`. |
| **H8 (open, accepted)** | `POST /wallet/top-up` credits any amount with no payment gateway. | **Product decision:** the wallet is a simulation until a payment gateway is integrated (see `docs/planning/BLOCKED_WORK.md`). Must be closed before real money is involved. |
| **H9 (open, follow-up)** | Spring Boot 3.3.4 was out of support. Upgraded to **3.5.16** (latest 3.5 patch, June 2026), but the 3.5 line itself is now out of OSS support; the supported line is 4.1.x. | Upgraded to 3.5.16 + springdoc 2.8.17. **Follow-up task:** migrate to Spring Boot 4.x. |

### Medium

| ID | Finding | Status |
|---|---|---|
| M1 | Admin spot/room mutations not tenant-scoped. | Fixed. |
| M2 | Booking a spot from another university. | Fixed. |
| M3 | Public tutoring sessions listed enrolled students' names and student numbers. | Fixed: only the tutor and staff see the roster; others see only their own entry. UI counts use `enrolledCount`. |
| M4 | Public office-hour slots showed which student booked (`bookedNote`). | Fixed: shows "محجوز" only (also for old rows). |
| M5 | Public rooms list showed booking leader and team members. | Fixed: only the leader and staff. |
| M6 | Public revenue figures in `/analytics/summary` and `/analytics/financial/**`. | Fixed: financial endpoint admin-only; summary strips revenue for non-admins. |
| M7 | Flex-Share: a user could offer a spot they do not hold and farm cashback with an accomplice. | Fixed (rule approved by the product owner): only the holder of a live booking on the bay, for a window inside that booking, or the faculty member the bay is currently assigned to (`spot_assignment`) may share it; others get 403. A shared bay cannot be booked directly (must be claimed, so the owner is paid). Another faculty member's assigned bay cannot be booked. When an offer ends or is cancelled the bay goes back to its owner (booking holder or assigned faculty) instead of becoming free. New `GET /parking/flex/shareable-spots`; the Share screen lists only those bays and only break lengths that end before the booking does. |
| M8 | Admin overrides in rooms/office-hours (`hasRole(CAMPUS_ADMIN)`) were not tenant-scoped. | Fixed: `TenantGuard.requireSameTenant` on room booking/extend/release, office-hour slot create/delete/book, appointment cancel, tutoring booking and review. A record from another university returns 404, for admins too. |

### Low

| ID | Finding | Status |
|---|---|---|
| L1 | Wallet transfer recipient lookup across tenants (name disclosure). | Fixed (scoped to sender's university). |
| L2 | Login timing revealed whether an account exists. | Fixed (dummy BCrypt compare). |
| L3 | Transit pass booking did not verify stops belong to the route/tenant (pickup == dropoff accepted). | Fixed: stops and shuttle must belong to the route, dropoff after pickup, route in caller's tenant. |

## Found during the live end-to-end run (Docker stack)

| ID | Finding | Fix |
|---|---|---|
| E1 (High) | `backend/Dockerfile` copied a pre-built `target/*.jar` instead of building from source, so `docker compose up --build` silently shipped an **old jar** (the running stack had none of the security fixes until rebuilt). It also ran as **root**. | Multi-stage build from source; runtime as unprivileged `app` user; `target/` in `.dockerignore`. Verified: image runs as `app`, anonymous scan → 401. |
| E2 (Medium) | Past office-hour slots were listed as available and **could be booked**; seeded demo slots go stale after a few days. Faculty could create slots in the past. | Booking/creating past slots rejected; past slots never shown as available; dev seeder adds upcoming demo slots when none exist. |
| E3 (Medium) | Office-hours booking dialog selected slots by time label, so with two "11:00 AM" slots on different days it **booked the wrong (past) slot**. | Selection by slot id; past slots hidden; each slot shows its date. |
| E4 (Low) | Parking and room bookings accepted a start time in the past. | Rejected (15-minute tolerance for "now"). |
| E5 (Low) | Malformed JSON / wrong types / unsupported method or media type returned **500**. | Mapped to 400 / 405 / 415 ProblemDetails. |
| E7 (High, logic) | **No booking/flex expiry existed.** Ended bookings stayed CONFIRMED/ACTIVE forever and their bays stayed RESERVED/OCCUPIED, so the lot filled with ghost reservations (live DB: only 7 of 40 bays bookable). Old Flex rows also stored a raw ISO timestamp. | `ParkingLifecycleService` runs every minute: completes ended bookings/claims, lapses unclaimed offers, frees bays (never faculty/maintenance); also frees bays orphaned before the fix. Migration `V18` rewrites old Flex status text. Live DB after deploy: 21 bays available, 0 ghost reservations. |
| E8 (Low) | Confetti spawned a blob: Web Worker, blocked by the CSP (console error on every booking/claim). | Main-thread confetti instance (`useWorker: false`). |
| E9 (Low) | Flex-Share cashback was recorded as `REFUND`, so wallets showed rewards as refunds. | New ledger type `PARKING_REWARD` (migration `V19`); refunds keep `REFUND`. |
| E6 (UX) | Header showed raw role enums (`CAMPUS_ADMIN`) and overflowed at 1280px for admin/security; car-model labels invisible in light theme; refunds labelled "Parking Reward"; "Dr. Dr." gate greeting; raw ISO timestamp in Flex bay status; stale hard-coded "next available" text; low light-theme contrast for status green/gold text. | All fixed. |

| E10 (UX) | The archived `legacy/` pages overflowed horizontally: header at 1280px (`index`/`app`), section nav and token grid at 360px (`showcase`), deck controls at 360px (`presentation`, whose slide counter also rendered reversed in RTL). | Fixed; no horizontal overflow at 360/414/768/1024/1100/1280/1366/1440/1920. |

| E11 (UX) | System data showed in Arabic in English mode: bay status line, office location and supervised courses, booked-slot tooltip, transit pass holder name, room booking times, bay distance unit; English occupant names/room specs/capacity were ignored by the UI. | Bilingual columns `parking_spot.time_left_text_en` (`V20`, backfilled) and `faculty_office_profile.office_location_en` / `supervised_courses_en` (`V21`); all writers set both languages; UI picks by language with Arabic fallback. English-mode sweep: Arabic strings on the parking map 37 → 3, office hours 18 → 4. |
| E12 (Logic) | `DevSeeder` re-applied demo occupants and status lines to existing bays on every restart, overwriting live bookings, claims and freed bays. | Demo bay data is applied only when a bay is created; existing bays only receive the missing English status line. |
| E13 (High, logic) | Found by the P8-02 end-to-end suite: after a peer claimed a shared bay, the owner could still **cancel the booking for a full refund** while keeping the cashback (cashback farming with an accomplice, M7 by another route). A non-owner offering a bay that already had an offer got 400 instead of 403. | A booking whose bay is claimed through Flex-Share cannot be cancelled or refunded until the offer ends; cancelling a booking withdraws its unclaimed offer; the bay is handed back through the lifecycle rules. The ownership check runs before any other offer check. Covered by `FlexShareControllerIntegrationTest` and `frontend/e2e/parking.spec.ts`. |

**By design, left in the author's language:** text users type themselves (tutoring descriptions and locations, room booking purpose and team members, vehicle models) and Saudi plate letters.

## Configuration & headers

- nginx (`frontend/security-headers.conf`, included in every location): CSP (`script-src 'self'`, `frame-ancestors 'none'`, fonts from Google Fonts only), `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, HSTS (effective once TLS lands in P9-01), `server_tokens off`, `client_max_body_size 1m`.
- `/swagger-ui` and `/v3/api-docs` are no longer proxied by nginx (still on `:8080` for local dev; disabled in `prod`).
- `server.forward-headers-strategy: native` so per-IP limits see the real client IP behind nginx (only private-range proxies are trusted).
- `server.error.include-stacktrace/message: never`.
- CORS: no cross-origin config; the SPA is served same-origin through nginx, so browsers deny cross-origin API calls by default. Keep it that way.

## Dependency scan

- **Frontend runtime deps:** `npm audit --omit=dev` → 0 vulnerabilities.
- **Frontend dev deps:** 10 (2 critical in `vitest`/`tinypool`, 8 moderate in `typescript-eslint`/`minimatch`). Build/test tooling only, never shipped. Fixing needs vitest 5, which requires a Vite major upgrade; tried and reverted (all suites failed). **Follow-up:** toolchain upgrade (Vite + Vitest).
- **Backend:** Spring Boot 3.3.4 → 3.5.16 (see H9). No OWASP Dependency-Check run (needs an NVD API key); recommended in CI.

## Known limitations

- `AuthRateLimiter` is in-memory per instance. A multi-instance deployment needs a shared store (Redis/Bucket4j).
- Existing refresh tokens become invalid after deploy (they were stored raw); users sign in again once.

## Verification

All results below are against **real PostgreSQL** (Testcontainers) and the **running Docker stack** (`docker compose up --build`).

- Backend `mvn test`: **177/177** pass.
- Frontend: `vitest` **136/136**, `eslint` clean, `tsc` clean, `vite build` OK.
- Live API end-to-end script (through nginx, 113 checks): auth lockout/refresh reuse, wallet idempotency, tuition replay + IDOR, exact charge/refund for parking, gate 401/403, flex ownership rule (stranger 403, offer longer than the booking 400, shared bay not bookable, assigned faculty bay shareable by its owner only and restored on cancel), flex reward once, room/tutoring/office-hours/transit rules, notifications, vehicles, admin suspension + audit, analytics redaction, malformed input → **121/121 pass**.
- Browser QA (Chrome, 248 page views in the first pass plus 3 re-verification rounds: anonymous/student/faculty/security/admin × AR/EN × light/dark × 1280/360): 0 console errors, 0 CSP violations, 0 unexpected API errors, 0 broken images; interactive flows (top-up, book/cancel with exact refund, tuition, room, tutoring, office hours, transit pass, notifications, vehicles, ALPR gate, admin tabs) all work. Share screen after M7 (20 checks: no-booking student, student with a 2.5 h booking in AR/light/1280 and EN/dark/360, assigned faculty): only owned bays listed, 3 h/4 h breaks disabled past the booking end, offer is exactly 120 min, cancel returns the bay to RESERVED.
- New tests: `AuthRateLimiterTest`, `WalletServiceTest`, `TuitionServiceTest`, `AuthControllerIntegrationTest`, `GateControllerIntegrationTest`, `AnalyticsControllerIntegrationTest`, `BusinessRulesIntegrationTest` (past bookings, transit itinerary, malformed requests, booking expiry, orphaned bays, cross-tenant admin), `FlexShareControllerIntegrationTest` (booking holder, stranger, assigned faculty), `FacultyOfficeResponseTest`, `GateDecisionTitleTest`, `AlprGateView.test.tsx`, `BookOfficeHoursModal.test.tsx`.
