# Contributing

## Workflow (mandatory)
1. Pick a task from [TASKS.md](TASKS.md); verify its dependencies are `Done`.
2. Branch from latest `main`: `feature/P1-01-short-name`, `fix/…`, `test/…`, `docs/…`, `chore/…`. **Never commit to `main`.**
3. Implement only the task's scope. Write tests. Run them and record real results.
4. Self-review the diff (`git diff main…`); no unrelated files; no secrets.
5. Open a PR with: task ID, summary, test evidence, screenshots (UI), risks. 
6. Merge only when CI is green **and** the owner approves. **No push/merge without explicit permission.**

## Commits
Conventional Commits: `feat(wallet): …`, `fix(auth): …`, `test:`, `docs:`, `chore:`, `ci:`. Reference the task ID in the body.

## Code standards
- Java: Google-style formatting (Spotless), SOLID, constructor injection, DTO records, no entities in API, Bean Validation, `ProblemDetail` errors, SLF4J logging (no PII/secrets in logs).
- TypeScript: `strict`, ESLint + Prettier, no `any`, components small and tested, all UI text via i18n keys.
- SQL: Flyway migrations only, never edit an applied migration, naming `V<n>__description.sql`.
- Money: `BigDecimal`/`numeric(12,2)`; never floating point.
- Secrets: only in `.env`/CI secrets; commit `.env.example` only.

## Definition of Done
See `plan.md §7`.
