# 01 — Repository Audit

> Task: P0-01 · Date: 2026-11-04 · Branch: `docs/P0-01-project-discovery`
> Method: static read of source + `npm run build` executed (passed). **No browser run was performed** (no browser tool in this session) — runtime/visual verification is listed as an open item.

## 1. What the repository actually is

| Fact | Evidence |
|---|---|
| The product is **"FBSU Smart Campus & Parking"** (Fahad Bin Sultan University, Tabuk, KSA) — *not* a generic university marketing site. | `README.md`, `src/js/main.js` |
| It is a **front-end-only prototype**: no backend, no persistence, no real auth. All data lives in JS constants and an in-memory `appState`. | `main.js` L133–631 |
| Stack today: Vite 8 (multi-page), vanilla JS (ES modules), one CSS file, `lucide`, `canvas-confetti`. No TypeScript, no tests, no linter. | `package.json`, `vite.config.js` |
| Git: 6 commits on `main`, remote `origin/main`, only workflow is GitHub Pages deploy. | `git log`, `.github/workflows/deploy.yml` |
| `plan.md` mentioned as "attached" **does not exist** in the repo or workspace. | filesystem search |

## 2. File inventory

| Path | Size | Role |
|---|---|---|
| `app.html` | 1.5 KB | Entry of the live app; mounts `#app`, loads `/src/js/main.js`. `<body class="theme-dark">`, `lang=ar dir=rtl`. |
| `src/js/main.js` | 227 KB / 4,139 lines | **Entire app**: data, state, 11 tab renderers, 11 modals, event wiring, audio synth, simulator. |
| `src/js/icons.js` | 16 KB | SVG icon map + `createIcon()`. |
| `src/css/style.css` | 59 KB | Design tokens (CSS variables), dark/light themes, glassmorphism, responsive rules. **This is the asset to preserve.** |
| `index.html` | 485 KB | Generated "Figma-style" design-system showcase (15 sections / 30 frames). Built by `scripts/build/*.py`. |
| `presentation.html` | 74 KB | 16:9 pitch deck page. |
| `UI-UX/` | — | Duplicate copy of showcase/presentation/assets/README (its `index.html` is 527 KB and **differs from root**; working-tree edit is formatting only, 4,844+/2,980−). |
| `public/assets/**`, `dist/`, `UI-UX/assets/**` | ~9 MB ×3 | Same images + PPTX stored **3 times** (`dist/` is git-ignored). |
| `scripts/build/*.py` | ~330 KB | Python generators for `index.html` (incl. `parts_16_to_18.py`, `specs_data.py`, **not listed in README**). |
| `scripts/legacy/*.py` | ~175 KB | Archived experiments. |
| `vite.config.js` | — | Multi-page inputs + dev-only rewrite middleware. Note: `configureServer` is placed under `server:` — it is not a valid Vite `server` option, so the rewrites are likely **dead code**. |

## 3. Build / run status

- `npm run build` → ✅ success (11 modules, 2.5 s). Outputs: `app.html`, `index.html`, `presentation.html`, one JS (217 KB) and one CSS (42 KB) bundle.
- `npm run dev` / visual check → ⏳ not executed this session.
- Local toolchain: Node 24.14, npm 11.9, **Docker 29.2 present**, **Java / Maven NOT installed** (backend must be built via Docker or a JDK must be installed — decision D-11).

## 4. Code-quality findings in `main.js` (migration-relevant)

| # | Finding | Impact |
|---|---|---|
| F1 | Single 4k-line file; UI = template strings + `innerHTML`; `renderApp()` re-renders everything on every click. | Must be decomposed into React components. |
| F2 | **Auth is fake**: login ignores the password; user chosen by `id.includes('88'/'FAC')`; quick-login buttons switch persona. | Real auth required. |
| F3 | **Money is client-side**: `user.walletBalance += …`, tuition and tutoring transfers mutate JS objects. | Must move to server-side ledger; never trust client. |
| F4 | Tutoring booking charges/credits `session.hourlyRate`, but sessions have `totalPrice` (e.g. TUT-104: 1.5 h → 105 SAR, charged 70). | Business-rule ambiguity/bug → Q5. |
| F5 | Booking page price is hard-coded: default window 09:00–12:00 (3 h × 5.75 = 17.25) but UI shows **11.50**; "daily" 15, monthly "225*". | Pricing rules undefined → Q7. |
| F6 | Flex-share "Activate" credits a fixed **+17.25 SAR on every click**, no guard against repeat. | Abuse vector; needs server-side idempotent rule → Q6. |
| F7 | Parking booking confirm hard-codes `spotId: 2`, schedule text constant. | Booking not really implemented. |
| F8 | Dates/times are free-form Arabic strings (`'اليوم الأحد - 04:30 م'`). | Need real timestamps + timezone (Asia/Riyadh). |
| F9 | i18n via inline `isAr ? … : …` ternaries; many Arabic-only strings (auth modal, alerts). Some EN strings missing. | Need `react-i18next` catalogs. |
| F10 | `alert()` used for confirmations; `Math.random()` for receipt numbers; "Top up +50" is free. | Replace with proper UX + payment flow → Q4. |
| F11 | Analytics numbers (+42 %, 14.2 min, 98.8 % satisfaction, hourly load) are **static marketing figures**. | Real analytics need event data; keep as demo until then. |
| F12 | Tab 'office-hours' booking, rooms, tutoring only push to in-memory arrays/notifications. | No conflict detection / overlap checks exist. |
| F13 | Real personal-looking data in source (names, student IDs, plates, emails `@fbsu.edu.sa`). | Treat as demo seed; PDPL concerns → R-09. |

## 5. Conclusions

1. The **UI/design (CSS tokens, layout, copy, assets) is the valuable part** and is reusable almost verbatim.
2. **All business logic must be (re)designed**, because current logic is demo-grade and in places self-contradictory.
3. Showcase/presentation pages are documentation artefacts; they should be kept but moved out of the product path (decision D-12).

