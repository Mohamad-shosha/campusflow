# ADR-0004: Handling demo transit data inserted by V15 migration

- **Status:** Proposed. Needs approval before any migration is written.
- **Date:** 2026-11-09
- **Context owner:** Backend / Data

## Context

`V15__transit_system.sql` creates the transit schema **and** inserts demo content into the
`FBSU` university (which `V2__campus.sql` creates in every environment):

| Table | Rows | Identifiable by |
|---|---|---|
| `transit_route` | 3 | `route_code` in (`ROUTE-EXPRESS`, `ROUTE-GOLDEN`, `ROUTE-DORMS`) |
| `transit_stop` | 8 | `route_id` of the routes above |
| `shuttle_bus` | 3 | `bus_number` in (`FBSU-BUS-01`, `FBSU-BUS-02`, `FBSU-BUS-03`); includes driver names, battery %, occupancy |

Unlike the Java seeders (now `@Profile("dev")` **and** `fbsu.seed.demo-data=true`), this data
is written by Flyway, so it reaches **every** database, production included.

Constraints:

1. V15 may already be applied anywhere. Editing it changes its checksum and breaks
   `validate-on-migrate: true` startup. **V15 must not be modified.**
2. `transit_pass.route_id`, `pickup_stop_id`, `dropoff_stop_id` are `ON DELETE CASCADE`.
   Deleting demo routes/stops would **silently delete students' boarding passes**.
   `transit_pass.shuttle_id` is `ON DELETE SET NULL`.
3. No destructive migration without explicit approval.

## Options considered

| Option | Effect | Risk |
|---|---|---|
| A. Edit V15 to remove the inserts | Fresh DBs clean | Checksum mismatch on every existing DB: **rejected** |
| B. New migration that `DELETE`s demo rows | Clean data | Cascades delete real passes: **rejected** |
| C. New migration that **retires** demo rows (status → inactive / out of service), no deletes | Demo routes/shuttles disappear from public lists; passes and history kept | Low; reversible with an UPDATE |
| D. Leave as is, document | No change | Production keeps showing fictional routes and shuttles |

## Proposed decision: Option C, gated per environment

1. **V16 (schema, non-destructive):** add nullable provenance columns
   `transit_route.source`, `shuttle_bus.source` (`VARCHAR(20)`, default `'MANUAL'`), and
   back-fill `'DEMO_V15'` for the exact rows listed above (matched by `route_code` / `bus_number`
   **and** `university_id` of `FBSU`). No deletes.
2. **Retirement (data, environment-gated):** a Flyway *Java* migration or an admin-run SQL
   script, executed **only in production**, that sets `transit_route.status = 'INACTIVE'` and
   `shuttle_bus.status = 'OUT_OF_SERVICE'` for `source = 'DEMO_V15'` rows. **Note:** the current
   transit repository queries do **not** filter by status, so retired rows would still be listed.
   A code change is needed first so `GET /transit/routes` and `GET /transit/shuttles` exclude
   inactive / retired rows (or filter `source <> 'DEMO_V15'`).
3. **Dev/test:** keep the rows; the transit UI and integration tests rely on them.
4. **Follow-up:** move demo transit content into a `@Profile("dev")` seeder so new
   environments created after V16 can opt out cleanly.

## Required approvals

- Schema change (new `source` columns) → DB owner.
- Production data update (retire demo rows) → product owner + DB owner, with a pre-run
  backup and a count check (`SELECT COUNT(*) FROM transit_pass WHERE route_id IN (...)`).
- Confirm that real routes/shuttles will be entered via an admin tool (none exists yet for
  transit), otherwise production will show an empty transit page after retirement.
