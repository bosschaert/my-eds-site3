# Journal — balbriggan.ie replica (hands-off)

## Extract — bounded single-page capture of the home page (2026-10-13)

- Flow: replica (keep design), stamped in `state.json` (`flowSource: user-phrase`, hands-off).
- `crawl.mjs --url https://balbriggan.ie/ --max 1 --dynamics`: 1/1 captured (HYDRATED), screenshot 1440×4719.
- **Instrument fix:** the site declares a global `function scrollTo(target)` (jQuery animate) that shadows
  `window.scrollTo`; every instrument's numeric `window.scrollTo(0,y)` threw inside the page. Added a
  commented init-script shim (`NATIVE_SCROLL_SHIM`) to the project copies of `diff/live-session.mjs` and
  `extract/crawl.mjs` — numeric calls go native, anything else to the site's function. Invalidates no
  earlier runs (first capture failed outright). Flag for upstreaming.
- Bounded asset capture (`stardust/scripts/replica-local-capture-assets.mjs`): 24 stylesheets + inline
  styles under `current/assets/css/`, 5 fonts under `current/assets/fonts/`.
- Fonts: the theme self-hosts **Gotham** (Book/Medium/Bold/Light) — a licensed commercial face → never
  rehosted; a metric-matched open substitute is chosen in Recreate. Google Fonts: Open Sans, Libre Baskerville, Inter.
- Dynamic reach: 1 form (newsletter, Gravity Forms), 4 triggers, slick sliders (hero autoplay, news, gallery).
- Page type: `landing` (one archetype, slug `index`).
- Licensed Gotham binaries removed from the capture after commit (not redistributed); asset-log.json keeps their URLs.

## Preserve direction — bounded-single spec, one-entry register, dynamics triaged (2026-10-13)

- CSS lift first (Phase-3 lift feeds the bounded spec): `stardust/scripts/replica-local-lift.mjs` captured
  computed styles + rects of ~110 selectors at 1440 and 360 → `stardust/replica/lift/computed*-{1440,360}.json`;
  distilled into `stardust/replica/lift/tokens.json`. `cap-probe --write-design`: fluid content, Bootstrap 1140 container.
- Synthesized PRODUCT.md / DESIGN.md / DESIGN.json at the root, provenance `bounded-single`; `DESIGN.json` added to `.hlxignore`.
- `stardust/direction.md` written (preserve mode, bounded-single).
- Register: one applied entry, R-01 (Gotham licensed → Montserrat 300/500/700 substitute with size-adjust, brand names first in stacks).
- Dynamics: detector 7 findings (+4 curated: hero video, news carousel, map pins, sticky header) → `stardust/dynamic-features.md`
  + `-plan.md`; every row has a disposition. Owner batch: newsletter endpoint (interim: POST to source handler), tags (none interim).
- Instrument fixes this phase: `stitch-shot.mjs` clamp when body.scrollHeight exceeds the window's real scroll range
  (360 live: 5410 reported vs 5397 scrollable); `dynamics-detect.mjs` gets the scrollTo shim. Live baseline
  live-vs-live: 0.03% @1440, 0.00% @360. Live itself overflows +10px at 360 (slick arrow) — the build must not.

## Recreate + source-fidelity-gate — home page archetype rebuilt and gated at 1440 and 360 (2026-10-13)

- Prototype `stardust/prototypes/index-proposed.html` (+ `canon.css` shared chrome/tokens, `index.css` page sections,
  `proto.js` behaviours) re-authored from the captured content and the lifted values; map artwork rehosted as
  `assets/map.svg` (pins local, 404 decoration PNGs dropped as captured, `onclick` dropped — links kept).
- Gate rounds: iter1 21.76% / 27.60% (Δh −148 / −51: footer logo lazy-SVG ratio, newsletter widths, flex-item margin
  containment) → iter2 1.61% / 2.97% Δh 0 → iter3 (--full) 1.56% / 2.77%, 0 structural red → metric round (Gotham
  ascent/descent/line-gap overrides on the substitute, R-01) **1.43% / 2.35%**, Δh 0, units 12/12 within 4px.
- Chrome: header crop 2.28% @1440 (residual — substitute glyph widths; letter-spacing and Montserrat 600 trials made it
  worse and were reverted), footer 0.43%; 360 header 0.00%. Clip @360: 2 = source parity (clip-allow.json).
- cap-probe PASS; prototype tables PASS at both widths. Motion: observed vs build compared; class-name mappings
  (scrolled→is-scrolled, show→is-open, slick-active→is-active) confirmed; hover border #545b62 and a:hover #2600e6 added.
- Approved hands-off (`state.mjs advance --to approved --by hands-off`).

## Migrate render — home page archetype placed in the migrated tree (2026-10-13)

- Handoff (Phase 5) opened. `migrate.mjs render index` (approved-page branch): `index.html`, 36 assets, 7 sections;
  the 52 "broken" internal links are pages outside this one-page scope (left pointing at the live site for E2).
- `modules[]` declared: hero, intro, news, explore, map, docs, newsletter; content-fidelity declared from the gate.
- No siblings: the single render unit `index` recorded done in `stardust/migrate/progress.json`.

## A-inventory — one page, one template in the delivery ledger (2026-10-13)

- `inventory.mjs`: 1 page (`/` ← index, template index/landing, 7 blocks), pending. `rollout.json` site filled:
  DA aemcoder/e8103195 ref main, live host main--e8103195--aemcoder.aem.live.

## B-block — seven distinct blocks, one conversion each (2026-10-13)

- `blocks.mjs` + `plan.mjs`: hero, intro, news, explore, map, docs, newsletter — all convert on `index` (the
  representative and only page); header/footer are foundation chrome (C0).

## B2-dynamic — triage re-verified against a fresh detect (2026-10-13)

- Project copy of `dynamics-detect.mjs` needed the scrollTo shim again (import from `diff/live-session.mjs`).
  Fresh detect: 7 findings, 7/7 ids in `stardust/dynamic-features.md`; 0 host-bound APIs. No change to dispositions.

## C-deliver — foundation, home page archetype and published-origin gate (2026-10-13)

- Header contract recorded from the source (`chrome-explore --root "#wrapper-navbar"`: 4 hover menus @1440, drawer
  with 4 drill states @390).
- **foundation** (subagent): styles/fonts (Montserrat substitute, R-01), header/footer blocks, `/nav` + `/footer`
  (noindex) published, shell draft for the chrome gate (unpublished at C-final). Bands: header 2.29% @1440 (R-01
  residual, same as the prototype's 2.28%), footer 1.20%; 360 0.01% / 1.48%. Frozen (21 files). `.eslintignore`
  gains `stardust/`, `.hlxignore` gains `content/`; stray root `crop-diff.png` removed.
- **archetype-index** (subagent): 7 blocks (hero, intro, news, explore, map, docs, newsletter), `/index` published,
  25 editorial images in DA media. 3 fix rounds (box sizes of card title / pictures, explore unit class). A fresh
  live capture at 1440 came back with unloaded images (+122px) — the archetype's cached live captures were used.
  The source has no `<h1>`: the hero headline is authored as the page's single h1, styled as the source h2.
- **Instrument fix:** `diff/unit-geometry.mjs` cached the origin unit inventory per slug, not per width (360 reused
  the 1440 numbers); the key now carries the width. Flag for upstreaming.
- **gate-all** on main--e8103195--aemcoder.aem.live: 1440 1.43% Δh 0 PASS, 360 2.40% Δh 0 PASS (clip 2 = source
  parity allowance); coverage updated from both summaries.
- **final:** freeze check clean, no foundation requests. Header parity on the live host: 0 behaviour findings;
  9 open-state crop errors (4.6–7.3%) all from the Gotham → Montserrat substitution (R-01) — only the site owner can
  accept them (`stardust/chrome/header-decisions.json`).

## D-site — sitemap served 1 = assembled 1, root answers 200 (2026-10-13)

- `assemble.mjs`: sitemap 1 url, robots.txt; `--verify-origin` on aem.live exit 0 (0 extra, 0 missing).
- Root: source `/` serves the page (200) → delivered as the root `index` document; `/` → 200 on aem.page and aem.live.
- Redirects: none needed (the one page keeps its path) — `stardust/redirects.tsv` records that; no sheet published.
- `/nav`, `/footer` live with `robots: noindex`.

## D2-dynamic — parity replayed on the live origin, 5/6 pass, video an environment limit (2026-10-13)

- `stardust/dynamics/parity.json`: carousel 4 slides, map 12 pins, newsletter form rendered, no tag host requested,
  no page errors — PASS on main--e8103195--aemcoder.aem.live.
- Hero video `video-plays` fails on BOTH the build and the source here (Vimeo 403 to the test network, no H.264 in
  bundled Chromium) → recorded as `environmentLimit`, not a defect. Newsletter submission is not replayed (it would
  sign up a real address on the production list); endpoint stays an owner decision (interim POST to the source).
- No listings: `/query-index.json` not needed for this one-page scope.

## E-full-site — 1/1 verified on the live origin (2026-10-13)

- `verify.mjs --base https://main--e8103195--aemcoder.aem.live --all`: 1 checked, 1 verified, 0 failed; gate tables
  (all-1440 / all-360, both PASS) folded into coverage. Render check of `restoreAtDelivery` (hero video): attributes
  and play() present; playback itself is an environment limit here (D2).

## E2-link-audit — 36 hrefs, no 404, uncaptured pages stay on the source (2026-10-13)

- `localize-links --check` PASS. 36 distinct hrefs on /, /nav, /footer: 34 × 200, Vimeo mp4 403 and Facebook 400 are
  third-party bot walls (external, kept). 28 balbriggan.ie targets = scope extension → kept on the source
  (decision in `stardust/direction.md`); `/` resolves to the delivered page.

## F-optimize — gate clean, one P2 (2026-10-13)

- `optimize.mjs --base <aem.live> --all`: health 90/100, P1 0, P2 1 (no JSON-LD on `/`), P3 0. Gate: no open P1.

## G-aem — no automatic fix applicable (2026-10-13)

- `autofix-aem --dry-run`: 1 candidate, manual — JSON-LD (the source carries a Yoast graph) needs a head/metadata
  pipeline payload; left as the open P2 for a later pass, nothing re-deployed.

## H-report — 1 page, 1 template, 7 blocks delivered (2026-10-13)

- Pages 1/1 verified (/), templates 1 (Home page), blocks 7/7 verified; quality: gate 1.43% @1440 / 2.40% @360,
  optimize health 90, P1 0, P2 1 (JSON-LD). To deliver: nothing. Owner decisions open: header font-crop sign-off
  (R-01), newsletter endpoint, analytics tags. Learnings in `stardust/learnings.md`.

## I-dashboard — rollout dashboard written (2026-10-13)

- `dashboard.mjs` → `stardust/rollout/dashboard/index.html` + `data.json`.

## Handoff — home page delivered and live, rollout complete (2026-10-13)

- migrate render → rollout A…I all ended; `/` live on main--e8103195--aemcoder.aem.live, published-origin gate
  1.43% @1440 / 2.40% @360 (Δh 0), 1/1 verified, 0 P1. Runner done-check: complete, no gaps.
- Open for the site owner (not blocking delivery): accept the R-01 font substitution on the header's open-menu crops
  (9 chrome-compare findings, `stardust/chrome/header-decisions.json`), newsletter production endpoint, analytics tags,
  JSON-LD (P2).
