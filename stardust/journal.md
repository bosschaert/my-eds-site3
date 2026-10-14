# Stardust journal — skerriesmills.ie replica

## Extract — bounded single-page capture of the home page (2026-10-14)

- `crawl.mjs --url https://www.skerriesmills.ie/ --max 1 --dynamics`: 1/1 captured, headless, HTTP 200,
  33 headings, 72 body paragraphs, 66 CTAs; dynamic reach: 3 same-site data endpoints, hydrated, FareHarbor
  booking lightframe, Complianz consent.
- Vision check: **recaptured**. The theme hides `.js-show-on-scroll` / `.js-show-on-scroll-img` (opacity-0)
  until an IntersectionObserver adds `animate-fadeIn` / `animate-fadeInY` (removed again on exit). Frozen
  captures (crawler full-page, stitch-shot's paused animations) show the whole band between hero and footer
  blank. Ground truth recaptured with the reveal forced visible: `current/assets/screenshots/index-reveal-1440.png`
  via `stardust/replica/tools/reveal-shot.mjs` (supplementary instrument, same command both sides).
- Fonts: Libre Baskerville (Google Fonts, OFL — self-hostable) + proxima-nova (Adobe Fonts kit pbd5qiw, licensed —
  referenced, never rehosted).
- Style census at 1440 + 360 → `current/_computed-styles.json`. Live CSS saved under `current/css/`.
- Bounded run: no PRODUCT/DESIGN synthesis (Phase 2 takes the bounded-single branch).

## Preserve-direction — bounded-single spec, empty register, dynamics triaged (2026-10-14)

- Bounded branch: PRODUCT.md / DESIGN.md / DESIGN.json synthesized at the root from `current/pages/index.json`
  + `replica/lifted-tokens.json` (palette #fff8eb / #415b6a / #397a5c / #6f3739 / #762728; Libre Baskerville +
  proxima-nova; content cap 1536px via cap-probe; buttons from main.css `.btn*`). DESIGN.json added to .hlxignore.
- `stardust/direction.md` records preserve mode, provenance bounded-single.
- Inconsistency register: empty — pure replica.
- Dynamics: detect (22 findings) → plan → curated `stardust/dynamic-features.md` + `-plan.md`. Self: carousels,
  reveal motion, document-first listings, FareHarbor hrefs. Owner batch D-1 (booking overlay script), D-2
  (events/news feeds), D-3 (tags + consent) — interim tiers shipped, none decided-out.

## Source-fidelity-gate — home page archetype passes at 1440 and 360 (2026-10-14)

- Prototype `stardust/prototypes/index-proposed.html` (+ `css/canon.css`, `css/index.css`, `js/motion.js`), built by
  `stardust/replica/tools/build-proto.mjs` from the settled capture (strings/hrefs/alts verbatim, markup re-authored).
- Rounds: iter1 (--full) 4.19% / 3.19% → fixes off anchor/measure (flex section stack, card heading margins, Café
  hours structure, footer credit margin, img dimensions, no lazy loading in the harness, dropdown padding quirk,
  role/aria parity) → confirm (--full): **1440 3.52%**, **360 3.24%**, content-diff 0 🔴, clip 0, overflow ok,
  header crop 99.92% / 98.77%, cap-probe PASS @2560, prototype table PASS at both widths.
- Height delta 200 px @1440 / 28 px @360 is the testimonials autoplay+autoHeight carousel state at capture time
  (live captured on a later slide) — RES-1, evidence: settled-sections equal at the same timeline (9074 = 9074).
- Motion: reveal IO, header scroll morph, both carousels (5500 ms, Swiper loop geometry, state class names),
  dropdowns, hovers, mobile menu — motion-compare 13 parity.
- Approved hands-off.

## Render — home page archetype placed in the migrated tree (2026-10-14)

- `migrate.mjs render index --canon-css stardust/prototypes/css/canon.css` → `stardust/migrated/index.html` (branch A, 63 assets, 4 sections).
- modules[]: hero, split, attractions, reviews, tickets, callout, posts; content-fidelity declared (archetype = gated prototype).
- 70 internal links point at pages outside the one-page scope — repointed to the source site in E2 (scope extension).
- State: index approved → migrated. No siblings (bounded single-page run).

## A-inventory — one page, one template (2026-10-14)

- `inventory.mjs`: 1 page (`/` ← index), template index/landing, 7 blocks listed; rollout.json site = aemcoder/1370701b@main, live host main--1370701b--aemcoder.aem.live.

## B-block — 7 distinct blocks, all converted on the home page (2026-10-14)

- `blocks.mjs` + `plan.mjs`: hero, split, attractions, reviews, tickets, callout, posts (+ header/footer chrome); index is the representative and only page.

## B2-dynamic — dynamic surface re-verified, 22 = 22 findings (2026-10-14)

- Fresh `dynamics-detect.mjs` on / (→ stardust/.work/dynamics): 10 third-party hosts, 2 first-party APIs, 0 forms, 1 media, 12 client-rendered → 22 findings, same set as the curated `stardust/dynamic-features.md`. Dispositions unchanged; D-1..D-3 ship interim tiers (hands-off).

## C-deliver units foundation + landing-archetype — chrome and home page live (2026-10-14)

- foundation (subagent): canon styles, self-hosted Libre Baskerville + Typekit proxima-nova, reveal layer, template-slotted header/footer, /nav + /footer published; header contract 0 errors after aria parity on the unnamed menu toggles + a run-local chrome-compare pairing fix (eds-conversion-log); frozen 17 files.
- landing-archetype (subagent): 7 blocks, /index published (root / → 200 on .page and .live); published-origin gate 1440 1.79% Δh 26, 360 2.18% Δh 19, clip 0, missing 0 (presence scoped to live `main > div.flex-1` — live wraps chrome in main); crops header ≤ 1.55%, footer 1.50% / 2.18% @360 = consent tab RES-3.
- cluster landing: no siblings (bounded scope) — recorded done empty.

## C-deliver — home page delivered and gated on the published origin (2026-10-14)

- gate-all roster (`--skip-existing`, state copy carrying the deployed row since state.mjs has no deployed status): 1440 1.79% Δh 26 PASS, 360 2.18% Δh 19 PASS; coverage gate rows written.
- final: foundation unchanged (17 files), no queued foundation requests.

## D-site — sitemap served 1 = assembled 1, root 200 (2026-10-14)

- Source root answers 200 itself → delivered as the root `index` document; no `/` row, no redirects sheet needed (no redirects.tsv: single-page scope, no legacy paths moved).
- /nav and /footer carry `Robots | noindex` (served `<meta name="robots" content="noindex">`); `assemble.mjs --verify-origin` exit 0: served 1 = assembled 1, extra 0, missing 0.

## D2-dynamic — parity 5/5 PASS on the live host (2026-10-14)

- FareHarbor lightframe (D-1 interim) added to `loadDelayed` (scripts.js, pushed 810184f) — Book Now links verbatim, overlay as on the source.
- `stardust/dynamics/parity.json`: booking links 8, carousel controls/slides, martech gate (no GTM/GA, D-3 awaiting owner), no page errors → `dynamics-check.mjs --origin …aem.live` 5/5 PASS. No query index needed (listings are document rows).

## E-full-site — 1/1 verified on the live origin (2026-10-14)

- `verify.mjs --base …aem.live --all`: 1 checked, 1 verified, 0 failed. Gate table re-applied (1440 + 360 PASS).
- Render check (restoreAtDelivery): both carousels advance unpoked on .aem.live (attractions −341 px, reviews −440 px after 7 s), 0 page errors.

## E2-link-audit — 33 out-of-scope targets repointed to the source, no 404 (2026-10-14)

- Every href GET: 33 source pages 200 (kept absolute — scope extension, decision in direction.md), `/` 200 on live, 11 of 13 externals 200, 2 bot-walled 403 (affiliate + weareopen.ie, verbatim from source). No captured page repointed (only `/` captured; delivered).

## F-optimize — health 90, 0 open P1 (2026-10-14)

- `optimize.mjs --base …aem.live --all`: P1 0, P2 1 (ai-search/jsonld on index — no JSON-LD), P3 0; gate passes.

## G-aem — 0 auto-fixable, 1 manual P2 left open (2026-10-14)

- `autofix-aem.mjs --dry-run`: 1 candidate, manual — JSON-LD on index. The source carries one `application/ld+json` block (WordPress SEO plugin); porting it needs a metadata → head pipeline decision. P2, stays open, listed in the report.

## H-report — report and learnings written (2026-10-14)

- `stardust/rollout/report.md` (pages 1/1 live + verified, 7 blocks, health 90, P1 0) and `stardust/learnings.md` (5 entries).

## I-dashboard — rollout dashboard written (2026-10-14)

- `dashboard.mjs` → stardust/rollout/dashboard/index.html + data.json.

## Handoff — home page delivered, published and gated; run complete (2026-10-14)

- migrate render → rollout A…I: / live on main--1370701b--aemcoder.aem.live (root 200), published-origin gate 1440 1.79% / 360 2.18% PASS, verified, header parity 0 errors on the live host, dynamics parity 5/5, optimize P1 0.
- Runner done-check: complete, no gaps. Owner decisions outstanding (interim tiers shipped): D-1 booking overlay, D-2 feeds, D-3 tags + consent; JSON-LD port (P2).
