# 05 — MVP Scope

Principle: the MVP replaces every **[E]** (exists-in-UI) feature with a real, persisted, secure implementation — nothing new — except the minimum admin capability needed to operate it. Final MVP boundary is subject to owner approval of Open Questions.

## In MVP
| Area | Included |
|---|---|
| Foundation | Monorepo, Docker Compose, CI, Flyway, OpenAPI, global error handling, logging |
| Identity | Register, login, refresh, logout, RBAC (Student, Faculty, Staff, Admin), profile, vehicles |
| Frontend | React+TS port of the existing UI (shell, theme, AR/EN RTL, modals, toasts) |
| Wallet | Server-side ledger, balance, history, tuition payment + receipt (internal accounting only) |
| Parking | Zones/spots, spot status, booking (hourly/daily/monthly per approved tariff), digital pass |
| Flex-Share | Offer → claim → return → reward (rules per approved decision) |
| Gate | ALPR **simulated** endpoint (plate → decision) + UI scanner |
| Tutoring | Post/list/filter/book with wallet transfer |
| Office hours | Faculty slots + booking + notification |
| Rooms | Catalog + booking with overlap prevention + extend/release |
| Notifications | In-app only |
| Admin (minimal) | Manage spots, rooms, tariffs, faculty slots; view users |
| Quality | Unit + integration (Testcontainers) + API/security tests; Vitest; Playwright smoke E2E |

## Out of MVP (Future)
Real payment gateway (Mada/Apple Pay/STC Pay) · registrar/SIS integration · University SSO (SAML/OIDC) · real ALPR/IoT hardware integration · email/SMS/push · multi-university tenancy UI (schema is tenant-ready) · real analytics warehouse · mobile apps/PWA · tutor payouts/commission engine · ratings moderation · AI matching beyond rule-based · simulator as production feature (kept as demo page).

## Simulator & presentation
Kept as a demo route / legacy assets; not part of production correctness.

