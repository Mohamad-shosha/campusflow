# 02 — UI Inventory

Source of truth: `src/js/main.js` (line refs), `src/css/style.css`, `app.html`.

## 1. Pages / entry points

| Page | Purpose | Migration target |
|---|---|---|
| `app.html` (SPA) | Live app | → React app (`frontend/`) |
| `index.html` | Design-system showcase (generated) | → `legacy/showcase/` (kept as design reference) |
| `presentation.html` | Pitch deck | → `legacy/presentation/` |

## 2. App shell (`renderApp` L884, `renderHeroSection` L1103, `renderFooter` L2399)

Header (logo, nav with 2 dropdown groups: *Parking* = map/booking/simulator/gate/share, *Campus* = tutoring/office-hours/rooms; analytics tab), live clock, language toggle (AR/EN), theme toggle (dark/light), sound toggle, wallet button (balance), notifications button (badge), auth button/user chip; Hero with stats + quick-action buttons; category sub-nav chips (L816); footer.

## 3. Tabs (views)

| Tab id | Renderer | Content | Interactions |
|---|---|---|---|
| `map` | `renderParkingMapTab` L1248, `renderSpotCard` L1326 | 30 spots, 4 zones (A Computing & Eng. 1–10, B Business & Medicine 11–18, C Faculty 19–24, D EV/Accessible 25–30), zone filter, status colors (available / occupied / flex-share / faculty-spot) | Filter by zone; click spot → spot modal |
| `simulator` | L1394 | 5-stage story (Eyad parks → leaves → AI matches Rakan → ALPR gate → Eyad returns, +17.25 SAR) | Prev/next/step, autoplay (4.5 s) |
| `gate` | L1554 | ALPR gate scanner with Saudi plate rendering, barrier animation | Pick plate, trigger scan (1.2 s) → granted, arm open 4 s |
| `booking` | L1684 | Parking pass booking: schedule pattern, college, tariff (hourly/daily/monthly), hours, smart-share opt-in, ticket summary | Tariff picker updates total; confirm → digital pass modal (QR) |
| `share` | L1843 | Flex-Share: break duration 1–4 h, estimated earnings (5.75 × h) | Activate → spot 1 becomes flex-share, wallet +17.25 |
| `tutoring` | L1935 | Peer-tutoring marketplace; filter (all/math/programming/hardware); session cards (tutor, course, lectures, rate 70 SAR/h, rating, enrolled) | Book session, post session |
| `office-hours` | L2093 | 3 faculty cards with rank, office, email, courses, time-slots (available/booked) | Book slot modal |
| `rooms` | L2187 | 4 rooms/labs with specs, status (in-use / available / reserved), countdown | Book room, extend +10 min, release lab |
| `analytics` | L2323 | 3 KPI chips + hourly load chart (08:00–04:00) | Read-only |

## 4. Modals (all via `#modal-container`)

| Modal | Function | Form fields / validation today |
|---|---|---|
| Auth (login / register) | `openAuthModal` L2473 | Login: id, password, remember, forgot (dead link), 6 quick-login personas. Register: full name, role (student/faculty/staff), university ID, college (5), plate letters, plate digits, car model/colour, phone, password. **No validation; defaults silently fill empty fields.** |
| Digital parking pass | L2747 | QR (static SVG), plate, duration |
| Spot details | L2831 | status, occupant, distance |
| Wallet | L2945 | balance, tuition progress bar, history (3 hard-coded rows), pay-tuition, top-up (+50) |
| Tuition payment + receipt | L3079 | presets 70/140/350/full, amount input; official receipt with random txn id |
| Notifications drawer | L3242 | List, read state |
| Book tutoring | L3314 | Confirm + pay hourlyRate from wallet; insufficient-balance alert |
| Create tutoring session | L3423 | course, lectures, topics, rate (70), location select |
| Book office hours | L3537 | topic select, duration select, slot select, free-text; dispatches notification |
| Book room | L3659 | purpose select, team-member checkboxes, start/end time (free text) |
| Toast | `showToast` L2916 | transient feedback |

## 5. Design system (reuse)

- CSS variables: brand `--fbsu-primary` (#116E63 teal), `--fbsu-gold` (#d7a237); status colours; radii; glass panels; `theme-dark` / `theme-light` body classes.
- Fonts: **Tajawal**, **Alexandria**, **Plus Jakarta Sans** (Google Fonts).
- Components (CSS classes): `btn-primary`, `btn-gold`, `btn-outline`, `badge*`, `glass-panel`, `stat-chip`, `parking-spot-card`, `pattern-option`, `zone-btn`, `modal-overlay/modal-content-box`, `form-control/form-group/form-label`, `timer-progress-track`, `saudi-license-plate`, `tuition-receipt-card`, etc.
- Direction: RTL by default, LTR when EN; responsive breakpoints in `style.css`.
- Audio feedback (`AudioSynthesizer`: success/scan/gate/click) + `canvas-confetti`.

## 6. React component map (proposed)

`AppShell`, `Header`, `NavDropdown`, `Hero`, `SubNav`, `Footer`, `ThemeToggle`, `LangToggle`, `Modal`, `Toast`, `Badge`, `Button`, `FormField`, `SaudiPlate`, `QrPass`, `Car icon`; feature views: `ParkingMap`, `SpotCard`, `ParkingBooking`, `FlexShare`, `Simulator`, `GateScanner`, `TutoringHub`, `OfficeHours`, `Rooms`, `Analytics`, `WalletModal`, `TuitionModal`, `NotificationsDrawer`, `AuthModal`.
