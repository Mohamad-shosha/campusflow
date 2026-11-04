# Testing Strategy

Principle: **a test is "passing" only if it was executed and its output observed.** Results are recorded in PR descriptions and `docs/session-log.md`.

## Pyramid & tooling
| Layer | Backend (JUnit 5, Mockito, Testcontainers) | Frontend (Vitest, Testing Library, Playwright) |
|---|---|---|
| Unit | domain rules, pricing, ledger math | utils, hooks, reducers |
| Service | application services with mocked ports | — |
| Repository | `@DataJpaTest` against **real PostgreSQL** (Testcontainers) incl. exclusion constraints | — |
| Integration / API | `@SpringBootTest` + MockMvc/RestAssured, ProblemDetail contracts | API client against MSW mocks |
| Security | 401/403 per endpoint, role matrix, ownership (IDOR), JWT expiry/tamper | route guards |
| Component / Forms | — | components, form validation (Zod), a11y (axe) |
| E2E | — | Playwright: register→login→book flows, AR/RTL + EN/LTR, dark/light |
| Responsive | — | Playwright viewports 360/768/1280 |
| Concurrency | parallel booking / double-spend tests | — |
| Infra | `docker build` both images; `docker compose up` smoke; DB connection; `/actuator/health`; CI job | |

## Quality gates (required for merge)
CI green (build, tests, lint, format) · coverage thresholds (target: backend ≥ 80 % lines on domain/application, frontend ≥ 70 %) · ArchUnit rules · no new high/critical dependency vulnerabilities · self code-review + clean `git diff` · owner approval.

## Per-feature rule
Every task in `TASKS.md` lists its Testing Requirements; the PR cannot be opened without executing them.

