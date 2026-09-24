# Dynamic features — plan (sorra.jp home, bounded-single)

## Phase A — static first (replica Phase 3)
- Deliverable: the home page renders complete with slide 1 shown, all nav links, 3 journal cards, contact band and footer — no JavaScript required for content.
- Authoring contract: verbatim captured strings; hrefs localized to root-relative at deploy.
- Verification: source-fidelity gate (pixel ≤ 10 %, content-diff 0 structural 🔴) at 1440 and 360.

## Phase B — chrome + hero interactions (replica Phase 3 § Interaction parity, rows 1–3)
- Deliverable: `blocks/header` JS for drawer toggle (aria-hidden / aria-expanded, line morph, WORKS accordion) and desktop WORKS hover submenu; `blocks/hero` (or the carousel block) JS for fade autoplay, dot pagination, circular progress, per-slide title/link swap, 9 s zoom-out on the active slide.
- Authoring contract: only behaviours that fire in `motion-observe.mjs` are implemented; dead classes recorded.
- Verification: `motion-compare.mjs` live vs build, then pixel-compare returns to the gated value.
- Effort: self, ~1 iteration.

## Phase C — tags (rows 5–7, 10) — owner decision
- Deliverable: GTM snippet in `scripts/delayed.js` behind the owner's confirmation. Until confirmed: no tags (documented degradation, no visual effect).
- Verification: `dynamics-check.mjs --origin <preview>` sees the container request when enabled.

## Decided-out (rows 8, 9, 11)
- Recorded in the register; nothing to build.

## Unfreeze conditions
- Row 4 (JOURNAL snapshot) → index-backed when `/journal/*` pages migrate.
