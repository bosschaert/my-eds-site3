# Journal — balbriggan.ie replica

## Extract — single-page capture of the home page (2026-10-28)

- Bounded entry: `crawl.mjs --url https://balbriggan.ie/ --max 1 --dynamics` (equivalent of `extract --single --dynamics`).
- First run failed: the site's theme `scripts.js` declares a global `function scrollTo(target)` (jQuery animate) that
  shadows `window.scrollTo`, so every instrument's `window.scrollTo(0, y)` threw. Project script copies were changed
  `window.scrollTo(` → `window.scroll(` (identical native semantics, not shadowed). Required for every live-side instrument.
- Second run: 1/1 captured, HYDRATED, headless, 10 headings, 22 images, 1 form (newsletter), 2 endpoints.
- Vision read of the thumbnail: blue header + nav, hero slider with centred title card, intro, "What's New" carousel,
  "Explore What We Do" tile grid, interactive map, Documents for Download, Newsletter form, dark footer.
- No font files were intercepted; fonts are resolved in the CSS lift (Phase 3).
- state.json created: flow replica, handsOff, one page `index` type `home`.

## Preserve direction — bounded-single spec, empty register, dynamics triaged (2026-10-28)

- Bounded promotion branch (§ 1a): PRODUCT.md / DESIGN.md / DESIGN.json synthesized from the page JSON and the CSS lift
  (`stardust/replica/lift/tokens.json`, measure-live*.txt at 1440/360). Root spec files added to `.hlxignore`.
- Fonts: Gotham is a commercial Hoefler kit self-hosted by the source → not rehosted. Sora chosen by measured canvas
  advance widths (ratio 1.002/1.003/0.998/1.002 at 300/400/500/700; Montserrat 0.99–1.02). Stacks keep Gotham names first.
- Register: empty (pure replica).
- Dynamics: detect + plan ran (9 findings); curated `stardust/dynamic-features.md` + `-plan.md`: newsletter form
  (interim: posts to the existing endpoint, decision D1), tags off on the new host (D2), header dropdowns, carousel,
  map hover and hero video rebuilt natively.
- `dynamics/lib.mjs` copy also needed `window.scrollTo` → `window.scroll` (site shadows scrollTo).
- The CSS lift needed for the spec also produced the first prototype draft (authored at the end of this phase;
  gated in Recreate).

## Recreate — home archetype gated at 1440 and 360 in 3 rounds (2026-10-28)

- Gate (live https://balbriggan.ie/ vs served prototype, `--main "#homepage-wrapper"`): 1440 10.38% Δh 37 → 6.10% → **2.43% Δh 1**;
  360 16.62% Δh 11 → 13.22% → **6.72% Δh 1**. content-diff 0 🔴 / 0 nothing-lost 🟡 at both; cap-probe PASS at 2560;
  prototype table PASS at both widths. Motion observed/compared; hover colour on explore tiles added.
- Fixes off the instruments: slick clone slides (3 before / 4 after, aria-hidden) + verbatim dot labels "N of 2";
  Irish doc title kept NFD as the source serves it; hidden form labels/asterisks/honeypot/ajax iframe as captured;
  invented aria-labels removed; news card inline-block (+8px line gap); docs intro flow-root (+16px);
  consent row spacing; CTA weight 400; scroll-state header morph unscoped (every width, 90→77 @360).
- Register R1 (forced by the overflow assert): `.whats-new { overflow-x: clip }` — slick-next sits 10px past 360.
- Instrument fix: stitch-shot's scroll-stall guard misread the shrinking sticky header as scroll-jacking; the project
  copy now re-clamps when the re-read document height shows the window already at the new bottom (commented in place).
- Residuals: Gotham→Sora wrap/width deltas (nav ±2–6px; two 360 paragraphs ±1 line, net 0); explore labels clipped
  at 360 exactly as on the source (clip-allow.json, 2). `stardust/replica/accepted.json`: live `<footer>` is an empty
  colophon — footer chrome is compared on #wrapper-footer-full.

## A-inventory — one page, one template (2026-10-28)

- `migrate.mjs render index` (canon css from the prototype) → `stardust/migrated/index.html`; state → migrated.
- Modules: hero, news-carousel, explore-grid, town-map, documents, newsletter (intro = default content).
- rollout.json: DA aemcoder/755b9b33 ref main, liveHost main--755b9b33--aemcoder.aem.live. Publish decision recorded
  in `stardust/eds-conversion-log.md`. DA/admin auth: job IMS token file via `--token-file` (list 200, status 200).

## B-block — 6 distinct blocks, plan written (2026-10-28)

- blocks.mjs: hero, news-carousel, explore-grid, town-map, documents, newsletter (1 instance each); header/footer are
  foundation. plan.mjs: index is the representative, converts all six.

## B2-dynamic — curated surface confirmed against fresh evidence (2026-10-28)

- dynamics-detect (fresh, --reach): 9 findings — 6 third-party hosts, 1 form, 4 triggers, 1 media, 0 first-party API,
  0 client-rendered: same set as the curated `stardust/dynamic-features.md` (9 rows). Plan re-run with
  `--target-origin https://main--755b9b33--aemcoder.aem.live`: 0 host-bound. Dispositions unchanged (D1 newsletter
  posts to the existing endpoint, D2 tags off, header dropdowns / carousel / map hover / hero video native).

## C-deliver — foundation, home archetype and roster gate delivered (2026-10-28)

- foundation (subagent): styles/fonts/header/footer + /nav, /footer (noindex) live; header/footer Δ0 vs prototype; frozen 16 files.
- archetype-home (subagent): 6 blocks (hero, explore-grid, town-map, newsletter template-slotted; news-carousel,
  documents reconstructive); /index live = site root. Published gate 1440 2.48% Δh1 / 360 6.74% Δh1, content-diff 0/0,
  rows PASS (360 with the source-identical clip allowance 2). Gate root `:not(:not(#homepage-wrapper):not(main))`.
- Residuals: header crop 2.68% @1440 (Gotham→Sora glyphs); hero mp4 403 on source and build alike; no h1 (as source);
  ai-readability code 92% with allowlist. cluster-home: no siblings. gate-all: 1/1 PASS both widths.
- final: one foundation request resolved as block-scoped (no frozen edit).

## D-site — sitemap verified on the live origin, root resolves (2026-10-28)

- assemble.mjs: 1 url expected; `--verify-origin https://main--755b9b33--aemcoder.aem.live` served 1 = assembled 1, extra 0, missing 0.
- Source root `https://balbriggan.ie/` answers 200 with the page itself → delivered as the `index` document; `/` 200 on
  aem.page and aem.live. No URL changes, no spec knowledge → no redirects rows; no sheet published (none needed, no `/` row).
- /nav and /footer published with `robots: noindex`.

## D2-dynamic — parity replay 5/5 PASS on the live origin (2026-10-28)

- stardust/dynamics/parity.json: 8 rows; replay `dynamics-check.mjs --origin …aem.live` 5/5 checks PASS (header popups 4,
  carousel 11 slide nodes, map 24 pins, newsletter form present, 0 page errors). Report: stardust/qa/dynamics-report.md.
- Newsletter submission not replayed (would subscribe on the production list) — interim, owner names the target.
- Hero MP4: Vimeo external URL 403s on source and build alike → skipped-source-broken, environmentLimit recorded.
- Tags scaffolded-awaiting-owner. No search, no query-index needed (single page, no listing).

## E-full-site — 1/1 verified after a page-title h1 (register R2) (2026-10-28)

- verify.mjs failed index on "exactly one <h1>, found 0" — the source has none. Register R2: `<h1>Our Balbriggan</h1>`
  (captured title, verbatim) first in the hero card, visually hidden by `.hero-page-title` in the hero block; code
  f0146e4 pushed, /index re-PUT → preview → live (deploy-batch --force, 1 ok).
- Published gate re-run (gate-all, eds re-shot): 1440 2.48% Δh1, 360 6.74% Δh1 — identical to C-deliver, 1 PASS each.
- verify.mjs: 1 verified, 0 failed. Render check: hero video element autoplay/muted/loop, not paused; the Vimeo MP4 itself
  403s on source and build alike (D2 environmentLimit).

## E2-link-audit — 34 hrefs checked, out-of-scope targets stay on the source site (2026-10-28)

- localize-links --check PASS; 26 source paths kept absolute (scope extension, single-page run) — decision in direction.md.
- Live GET: 32/34 200; Vimeo MP4 + LinkedIn 403 (vendor, same on source). Root `/` is the only internal page; no 404s.

## F-optimize — gate clean, health 90 (2026-10-28)

- optimize.mjs --all on aem.live: P1 0 · P2 1 · P3 0; GATE pass. Open P2: ai-search/jsonld (source carries JSON-LD,
  delivered page none) — platform-migration fix, routed to G-aem.

## G-aem — JSON-LD restored, health 100 (2026-10-28)

- autofix-aem dry run: 1 candidate, manual (eds-jsonld). Applied by hand: head.html carries the source's site-wide
  Yoast graph nodes (WebSite + Organization, verbatim values; the WebPage node and the WP `?s=` SearchAction omitted —
  page-specific / no search on the new host). Pushed, live in ~15 s.
- Re-run: optimize health 100, P1 0 · P2 0 · P3 0 (jsonld fixed); verify 1/1 verified.

## H-report — 1/1 page, 6 blocks verified, report written (2026-10-28)

- Block coverage rows flipped to verified (6). Summary block: stardust/rollout/report.md; 4 learnings in stardust/learnings.md.

## I-dashboard — dashboard written, rollout closed (2026-10-28)

- dashboard.mjs → stardust/rollout/dashboard/index.html: 1 page identified · prototyped · deployed · optimised.

## Handoff — one page delivered and live, run complete (2026-10-28)

- https://balbriggan.ie/ → `/` on main--755b9b33--aemcoder.aem.live, published; rollout A–I ended (D3 skipped: one locale).
- Published-origin gate 1440 2.48% / 360 6.74% PASS; verify 1/1; optimize 100; parity 5/5; done-check complete, 0 gaps.
- Owner decisions open (not blocking delivery): newsletter submission target; tag stack (GTM/GA/Meta).
