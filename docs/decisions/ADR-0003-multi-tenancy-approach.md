# ADR-0003 — Tenant-ready single-tenant start (pending D-1)

- Status: **Proposed — awaiting owner decision** · Date: 2026-11-04
- Options: (A) single-tenant, no tenant column; (B) shared schema + `university_id` column; (C) schema-per-tenant; (D) DB-per-tenant.
- Recommendation: **B**, deployed with exactly one tenant (FBSU). Cheap now, avoids a painful retrofit; C/D deferred until a real second customer exists.
- Consequences: every tenant-owned table has `university_id`; unique constraints are per-tenant; later a Hibernate `@Filter` + request-scoped tenant resolver (from JWT claim) enforces isolation, with tests proving no cross-tenant reads.

