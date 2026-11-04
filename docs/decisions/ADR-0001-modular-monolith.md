# ADR-0001 — Modular Monolith over Microservices

- Status: Proposed · Date: 2026-11-04
- Context: One team, one product, strong transactional coupling (wallet ↔ tutoring ↔ parking), unknown scale. Microservices would add distributed-transaction and ops cost without benefit.
- Decision: Single Spring Boot application with module boundaries enforced by package layout + ArchUnit; one PostgreSQL database; module-owned tables.
- Consequences: Simple deployment, ACID for money flows; later extraction possible along module lines if a real scaling need appears.

