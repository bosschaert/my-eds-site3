# Journal — Doosan Bobcat replica (2 pages)

## Extract — 2 pages live-captured, fullpage.js home detected (2026-11-02)
- `crawl.mjs --pages /en,/en/management/esg_result --dynamics`: 2/2 captured headless, no bot protection.
- Home is a jquery.fullpage.js scroller (100vh panels, body overflow hidden) — full-page screenshot shows only the hero; the stitched gate will likely hit the scroll-stall guard at widths where fullpage is active.
- Style census (1440+360), cap-probe (content cap 1500px, shell fluid), source CSS + fonts (Pretendard/Noto Sans KR, OFL) + logos saved under `stardust/current/assets/`.
- Capture gap: 43 of 44 first-level /en targets uncaptured — out of scope by plan (scope fixed), recorded as scope debt.
- Types: en = landing, en-management-esg-result = static.

## Preserve-direction — verbatim promotion, empty register, dynamics triaged (2026-11-02)
- current/PRODUCT.md, DESIGN.md, DESIGN.json promoted verbatim to the project root; `stardust/direction.md` records preserve mode (hands-off, publish decision).
- Inconsistency register empty — pure replica. No target breakpoints.
- Dynamics: 8 detected + 5 curated rows (hero video carousel, fullpage scroller, product swiper, mega menu, ESG tabs) → `stardust/dynamic-features.md`; owner batch (search backend, locale scope, tags) shipped on interim tiers.

### Recreate — archetype static (en-management-esg-result) passed (2026-11-02)
- 1440: 0.00–0.01% pixel, Δh 0, 0 structural / 0 nothing-lost, clipped 0, chrome quiet. 360: 0.46%, Δh 0, all probes clean. 3 iterations each. cap-probe PASS. Motion 13/13 matched.
- Canon chrome (canon.css/canon.js: header, footer, fonts, root-scale model) authored here for reuse by the home archetype.
- Instrument adaptations: `stardust/replica/instrument-adaptations.md` (serial --full probes; fullpage.js live capture for home).

## Recreate — both archetypes gated at 1440 and 360 (2026-11-02)
- static (en-management-esg-result): 1440 0.01% Δh 0 · 360 0.46% Δh 0 · all probes clean · cap-probe PASS.
- landing (en): native-scroll recreation of the fullpage.js scroller (100vh sections, home.js section stepping, fp-nav, type_white, reveals). Live reference via fp-stitch adaptation; its t=0 ordering defect fixed and references retaken. confirm: 1440 0.09% Δh 0 · 360 0.11% Δh 0 · 0 structural / 0 nothing-lost / clipped 0 / chrome quiet · cap-probe PASS. visual-diff advisory flags justified (live fullPage shot of a scroll-jacked page).
- Prototype rows (gate-all --stage prototype): both pages PASS at both widths.
- captureState restoreAtDelivery (home): hero video autoplay muted + advance per slide, carousel index, section entrance reveals, decorative loops, footer year.

## Source-fidelity-gate — prototype rows 4/4 PASS (2026-11-02)
- gate-all --stage prototype: en 0.08%/0.11%, en-management-esg-result 0%/0.46% at 1440/360.

## A-inventory — 2 archetype pages inventoried, DA coordinates filled (2026-11-02)

- No `stardust/migrated/` existed, so the two gated archetypes were placed with `migrate.mjs render en en-management-esg-result --state stardust/.work/rollout/state-copy.json` (a scratch copy, so `stardust/state.json` stays untouched); modules recorded: en = home-visual, home-company, home-products, home-esg, home-news; esg = sub-top, esg-result.
- `inventory.mjs --site-url https://www.doosanbobcat.com/en --state stardust/state.json` → 2 pages, 2 templates, 0 content-pending.
- `rollout.json` site: DA org `aemcoder`, site `f1157cd0`, ref `main`, liveHost `main--f1157cd0--aemcoder.aem.live` (from `git remote -v` → github.com/aemcoder/f1157cd0).

## B-block — 7 distinct module blocks, plan representative-first (2026-11-02)

- `blocks.mjs` → 7 distinct blocks (en: home-visual, home-company, home-products, home-esg, home-news; esg: sub-top, esg-result), 0 chrome rows (header/footer are C0 foundation, authored as `/nav` + `/footer`).
- `plan.mjs` → both pages are their template's representative; each block converts exactly once.

## B2-dynamic — dynamic-features.md verified, no new rows (2026-11-02)

- `dynamics-plan.mjs --target-origin https://main--f1157cd0--aemcoder.aem.page --migrated stardust/migrated` → 8 draft rows, host-bound 0/0, 2 delivered-by-capture (locale links). Every draft row maps to a curated row (1 dataLayer, 2 header search interim, 3 locale links interim, 4 tags). Curated rows 5–9 (hero video carousel, fullpage scroller, product swiper, mega menu, ESG tabs) stay from the archetype DOM review. No new evidence → no new rows; owner decision batch unchanged (search backend, locale scope, tags).

## C-deliver — C0 foundation authored and deployed; unit left running for the coordinator's gate (2026-11-02)

- Foundation: `styles/styles.css` (canon tokens, reset, 62.5/58/55/53 % root model, overlay chrome `--nav-height: 0px`), `styles/fonts.css` (Pretendard + Noto Sans KR, OFL, self-hosted under `fonts/`), favicon from the capture, `blocks/header` + `blocks/footer` (template-slotted from `/nav`, `/footer`; `/footer-home` carries the home page's footer variance), `stardust/runtime-contract.json`.
- Lint clean (`npm run lint`, incl. `lint:breakpoints` — no target set, skipped). Code pushed (59593ba, 0d77c69); `/nav`, `/footer`, `/footer-home` PUT → preview → live via `deploy-batch.mjs` (3/3 live, Robots noindex); `.plain.html` 200 on page + live, 0 about:error, 0 h1.
- Smoke render of `/nav` on the preview (1440 drawer mode, 1920 hover mega menu with body.index): header + footer decorated, 0 page errors, Pretendard loaded. No pixel gate run here — the coordinator gates the foundation.

## C-deliver unit foundation — foundation authored, deployed, frozen (2026-11-02)
- 46 files (styles, fonts, header/footer blocks, /nav, /footer, /footer-home live, noindex), lint ok, pushed c2a8cb0. Frozen with foundation-freeze. Shell gate folded into the archetype units (no shell page in a 2-page roster).

## C-deliver — archetypes live, foundation requests applied, roster gate 2/2 PASS (2026-11-02)
- archetype-landing: /en live (5 blocks + home-scroller widget, hero videos/slides/entrances restored), gate 1440 0.53% / 360 1.76%, Δh 0.
- archetype-static: /en/management/esg-result live (sub-top, esg-result), gate 1440 2.1% Δh -4 / 360 5.88% Δh -23.
- cluster units: no siblings in the 2-page plan. C-final: 3 of 5 queued foundation requests applied once (footer strong-link paint, script-written year, logo href), 2 kept as documented; /footer, /footer-home republished; refrozen.
- gate-all on aem.live: 2/2 PASS at both widths (en 0.51%/1.72%, esg 2.09%/5.87%), clipped 0, missing 0; coverage updated.

## D-site — redirects sheet live, sitemap served 2 = assembled 2 (2026-11-02)
- `/redirects.json` published: `/`, `/index.html`, `/en/` → `/en`; `/en/management/esg_result` → `/en/management/esg-result`. `/` resolves 200 on aem.page and aem.live. Coverage ESG row path set to the delivered path.

## D2-dynamic — parity replay 8/8 PASS on aem.live (2026-11-02)
- `stardust/dynamics/parity.json`: hero video playing (Δt 0.81 s), hero pagination, fullpage scroller nav, product carousel, header mega menu, ESG tab bar, header search form (interim), no page errors on 2 pages. Rows 1, 3, 4 no checks (static snapshot / owner decisions: locale scope, tags). No query index needed (no listings in scope).

## E-full-site — 2/2 pages verified on aem.live (2026-11-02)
- verify.mjs: esg-result verified; /en verified (only flag was the served home-scroller widget reference). Render check: hero video playing, slides/progress advancing unpoked (D2 parity + archetype unit), gate rows PASS both widths.

## E2-link-audit — every internal href 200 on aem.live (2026-11-02)
- Internal hrefs across /en, /en/management/esg-result, /nav, /footer, /footer-home: 6 distinct, all 200. Out-of-scope targets repointed to the source origin (scope extension, recorded in direction.md).

## F-optimize — health 100, 0 open P1/P2/P3 (2026-11-02)
- optimize.mjs over aem.live: 2 pages, open 0; 2 source-parity P2 (no JSON-LD on source either), informational. Scorecard written.

## G-aem — no autofix candidates (2026-11-02)
- autofix-aem dry-run: 0 candidates (0 open findings); nothing to re-deploy.

## H-report — summary written, 5 learnings (2026-11-02)
- `stardust/rollout/report.md`: 2/2 pages verified live, 7 blocks, gate PASS both widths, parity 8/8, health 100; 3 owner decisions outstanding on interim rows. `stardust/learnings.md`: 5 entries.

## I-dashboard — rollout dashboard written (2026-11-02)
- `stardust/rollout/dashboard/index.html` + `data.json`: 2 pages identified, prototyped, deployed.

## Handoff — 2/2 pages delivered live, run complete (2026-11-02)
- migrate → deploy → rollout A–I done. /en and /en/management/esg-result live on aem.live, published-origin gate PASS at 1440 and 360, parity 8/8, health 100, redirects live, done-check complete.
