# 06 — Risk Register

Likelihood (L) / Impact (I): 1 low – 5 high. Score = L×I.

| ID | Risk | L | I | Score | Mitigation | Owner |
|---|---|---|---|---|---|---|
| R-01 | Business rules are undefined/contradictory (pricing, flex-share, tutoring price) → rework | 5 | 4 | 20 | Resolve Q5–Q10 **before** each feature phase; ADR per rule | Owner + CTO |
| R-02 | Financial integrity: wallet double-spend, negative balances, replayed requests | 3 | 5 | 15 | Immutable ledger, DB constraints (`balance >= 0`), optimistic locking, idempotency keys, concurrency tests | Backend |
| R-03 | Scope creep from a "SaaS" label (multi-tenancy, payments, SSO, IoT) | 4 | 4 | 16 | Strict MVP (doc 05), tenant-ready schema only, Future list | CTO |
| R-04 | Design regression during React port (RTL, themes, glass effects) | 3 | 4 | 12 | Port `style.css` as-is first; visual comparison + Playwright screenshots; responsive tests | Frontend |
| R-05 | No Java/Maven locally → blocked backend work | 4 | 3 | 12 | Decide Q11 early; Docker-based build as fallback | DevOps |
| R-06 | Monolithic `main.js` rewrite is large; hidden behaviours missed | 3 | 3 | 9 | UI inventory (doc 02), feature checklist per task, e2e parity tests | Frontend |
| R-07 | Auth/security flaws (JWT misuse, weak password policy, IDOR on bookings) | 3 | 5 | 15 | BCrypt, short-lived access + refresh rotation, method security, security tests per endpoint, OWASP checklist | Backend |
| R-08 | Booking concurrency (two users, same spot/room/slot) | 4 | 4 | 16 | Exclusion constraints (`tstzrange` + `btree_gist`) in PostgreSQL, tests with parallel requests | Backend |
| R-09 | Privacy/legal: personal data (IDs, plates, phones) under Saudi PDPL; tuition/payment regulation | 3 | 5 | 15 | Data-minimisation, consent, audit log, no real data in seeds (Q17), legal review before launch (Q4) | Owner |
| R-10 | Real-time needs (gate, spot status) not covered by polling | 2 | 3 | 6 | MVP polling/SSE; WebSocket later if needed | Architect |
| R-11 | Repo bloat: 3× duplicated ~9 MB assets, generated 485 KB HTML | 4 | 2 | 8 | Dedupe in P1-01, Git LFS only if needed | DevOps |
| R-12 | AI quota/context exhaustion across long project | 4 | 3 | 12 | Task-by-task, `TASKS.md` + `docs/session-log.md` handoffs, no repeated repo scans | PM |
| R-13 | Time zone/date bugs (free-form strings today) | 3 | 3 | 9 | `timestamptz` + `Asia/Riyadh` display, tests with fixed clock | Full-stack |
| R-14 | CI/CD secrets leakage | 2 | 5 | 10 | `.env.example` only, GitHub Secrets, secret scanning, `.gitignore` | DevOps |
| R-15 | Hardware (ALPR) integration unknown | 3 | 3 | 9 | Port/adapter interface; simulated adapter in MVP | Architect |
