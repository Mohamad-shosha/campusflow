# 03 — Product Requirements (derived from the existing UI only)

Legend: **[E]** = exists in current UI (evidence-based) · **[?]** = ambiguous, needs owner decision (see Open Questions) · Nothing here is invented; anything not in the UI is listed under Open Questions, not as a requirement.

## 1. Product summary

A university-campus platform for FBSU that combines: smart parking (with ALPR gate and "Flex-Share" slot reuse), a peer-tutoring marketplace paid with a closed-loop university wallet, faculty office-hour booking, and study-room / lab booking, plus notifications, wallet/tuition settlement and basic analytics.

## 2. Roles (from `USERS`, register form, UI badges)

| Role | Evidence | Capabilities seen in UI |
|---|---|---|
| **Student** | Eyad, Rakan, Abdulaziz; register role "طالب" | Park/book/share spot, tutor-or-learn, book office hours, book rooms, wallet, pay tuition |
| **Student-Tutor** (student + tutoring listings) | Eyad/Rakan "peer tutor"; "Create session" modal | Post tutoring sessions at hourly rate; receive wallet credit |
| **Faculty** (Dean, Dept chair, Associate Prof.) | `isFaculty`, Zone C spots, faculty cards | Receive office-hour bookings + notifications; faculty-only parking zone [?] manage own slots |
| **Staff** | register option "موظف إداري" | Only appears in register form; no distinct behaviour in UI [?] |
| **Admin / Parking operator / Finance** | **Not present in UI** | — [?] Required for a real system (manage spots, tariffs, rooms, users). Needs owner approval |

Permissions matrix (proposed minimum, to be confirmed): see `docs/architecture/01-system-architecture.md §6`.

## 3. Functional requirements by module

### 3.1 Identity & Profile
- FR-ID-1 [E] Login with university/employee ID + password. Remember-me checkbox, forgot-password link (dead).
- FR-ID-2 [E] Register: name, role, university ID, college (5 options), plate letters + digits, car model/colour, phone, password. Account gets welcome wallet balance **100 SAR** [E] / [?] keep?
- FR-ID-3 [E] Vehicle (plate in Saudi format: 3 Arabic letters + digits) belongs to user; used by ALPR.
- FR-ID-4 [E] AR/EN language, dark/light theme preference.
- FR-ID-5 [?] SSO with university IdP vs local accounts (UI says "FBSU SSO").

### 3.2 Parking
- FR-PK-1 [E] 30 spots in 4 zones; per-spot status: available / occupied / flex-share / faculty-spot; attributes: distance, EV, accessible, faculty, flex-eligible.
- FR-PK-2 [E] Primary (assigned) spot per user (`primarySpot`).
- FR-PK-3 [E] Booking with tariffs: hourly **5.75 SAR/h**, daily **15 SAR**, monthly **450 SAR (225 with smart-share)**; target college selects nearest zone; schedule pattern Sun/Tue etc. [?] full pricing rules.
- FR-PK-4 [E] Digital pass with QR code, plate, validity.
- FR-PK-5 [E] **Flex-Share**: owner declares a break (1–4 h) → spot becomes shareable → another user (matched by schedule/college) uses it → owner is credited **5.75 SAR × hours** to wallet; owner's return is guaranteed. [?] exact matching, pricing to borrower, penalties, guarantee mechanics.
- FR-PK-6 [E] **ALPR gate**: plate read → validates booking/flex pass → opens barrier; result shown. (Currently simulated.) [?] real hardware.
- FR-PK-7 [E] Simulator story (demo/training feature, not production logic).

### 3.3 Wallet & Tuition
- FR-WL-1 [E] One wallet per user (SAR); balance; transaction history (credits: tutoring, flex reward; debits: tuition).
- FR-WL-2 [E] Closed-loop: earnings usable for tuition and campus services, **no cash withdrawal** (README) — [?] confirm legal stance.
- FR-WL-3 [E] Top-up (+50 mock) [?] real payment gateway or removed.
- FR-WL-4 [E] Pay tuition from wallet: amount ≤ balance; updates paid/remaining; official receipt with transaction number. [?] integration with university registrar/finance.
- FR-WL-5 [E] Tuition progress: total / paid / remaining per user (e.g. 12,000 / 4,500).

### 3.4 Peer Tutoring
- FR-TU-1 [E] Tutor posts session: course code+name, covered lectures, topics, **hourly rate (default 70 SAR)**, duration, date/time, location (lab/room/online), category (math/programming/hardware).
- FR-TU-2 [E] Student books session; wallet debit, tutor credit, enrolled list updates, notification to tutor. Insufficient balance → blocked.
- FR-TU-3 [E] Rating and review count shown. [?] how ratings are collected.
- FR-TU-4 [?] Capacity per session, cancellation/refund, commission, price = rate or rate × duration (bug F4).

### 3.5 Faculty Office Hours
- FR-OH-1 [E] Faculty listing: rank, college, office, email, supervised topics, weekly days text, next availability.
- FR-OH-2 [E] Time slots (15/30 min) available/booked; booking with topic, duration, slot; **instant notification** to faculty.
- FR-OH-3 [?] Faculty-managed availability, approval/cancel, student limits.

### 3.6 Study Rooms & Labs
- FR-RM-1 [E] Rooms/labs catalog: name, building, capacity, type, specs, status (available / in-use / reserved).
- FR-RM-2 [E] Booking with purpose, team members, start time, strict end time; countdown timer; **extend +10 min**; release early.
- FR-RM-3 [?] Max duration, overlap rules, eligibility, no-show policy.

### 3.7 Notifications
- FR-NT-1 [E] In-app notifications with target user, sender, title, message, icon, badge, read flag; created on bookings/payments.
- FR-NT-2 [?] Channels (email/SMS/push) beyond in-app.

### 3.8 Analytics
- FR-AN-1 [E] KPIs + hourly parking load (static today). [?] real metrics & who can view.

## 4. Non-functional requirements (from CTO mandate)

Arabic-first RTL + English; responsive; accessibility baseline (WCAG AA target); secure auth (JWT, BCrypt, RBAC); server-side money integrity (ledger, idempotency, optimistic locking); audit log for financial/booking actions; time in `Asia/Riyadh`; observability (structured logs, health, metrics); 12-factor config; no secrets in Git; PDPL-aware personal-data handling.

## 5. Open Questions (blocking)

See `docs/discovery/07-open-questions.md`.
