# ADR-0002 — Preserve the existing UI: React + TypeScript with plain CSS

- Status: Proposed (needs approval D-2) · Date: 2026-11-04
- Context: Owner is satisfied with current design. `style.css` (59 KB) defines the tokens/themes/RTL.
- Decision: Port `style.css` as global CSS first (visual parity), then progressively scope styles per component (CSS Modules) without changing the look. No Tailwind/UI-kit adoption. Vite is kept (already in use).
- Consequences: Lowest design-regression risk; styling is not utility-based; visual regression checked with Playwright screenshots.

