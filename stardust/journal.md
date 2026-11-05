# Stardust journal — replica of static-website.david-bosschaert.workers.dev/page1

## Extract — single page captured live (2026-11-05)
- `crawl.mjs --pages /page1 --dynamics`: 1/1 captured, real Chrome headless, HTTP 200, no bot wall, no consent banner.
- Dynamic surface (reach): no endpoints, no forms, no third-party scripts; one inline `onclick` tab switcher (`script.js`).
- Source CSS (`styles.css`, 4.6 KB) and `script.js` saved under `stardust/current/assets/css/`. Fonts are named (Poppins, Playfair Display) but never loaded — page renders on fallbacks; recreation keeps the identical stacks.
- Media downloaded to `stardust/current/assets/media/` (2 fields photos 4000×2250, 2 tiny mp4s, 6 randomuser.me portraits).
- Style census at 1440 + 360; cap-probe: content max 1200px, shell fluid.
- Vision check: ok. Favicon: none on source.

## Preserve direction — bounded-single spec synthesized, empty register, dynamics triaged (2026-11-05)
- Bounded branch (§ 1a): PRODUCT.md / DESIGN.md / DESIGN.json at root synthesized from `current/pages/page1.json` + `stardust/replica/lifted-tokens.md` (verbatim source CSS values); DESIGN.json carries cap-probe `extensions.breakpoints` + source breakpoints 768/900. DESIGN.json added to `.hlxignore`.
- `stardust/direction.md` records preserve mode, provenance bounded-single. Register empty — pure replica.
- Dynamics: detect found 1 third-party host (randomuser.me — portrait images, rehost as content). Curated 4 rows, all with dispositions: tabs (rebuild-native block), native video (rebuild-native block), portraits (static-snapshot content), martech (scaffold disabled).
- Martech: spec-martech on `/` and `/page1` — no CMP, no tag manager, no data layer. Contract + handoff written empty/disabled.

## Recreate + source-fidelity gate — page1 archetype passes at 1440 and 360 (2026-11-05)
- Prototype `stardust/prototypes/page1-proposed.html` + `page1.css`: semantic header/main/footer, every value lifted from source `styles.css`, identical font stacks (Poppins/Playfair never load on the source either), tab switcher re-authored with event listeners + ARIA.
- iter1 `--full`: 0.00% / 0.00% pixel, Δh 0; 360 failed the overflow assert (+41px) — the LIVE page overflows identically (tab bar 401px). Logged as register R-01 (contain overflow in `.tab-buttons`), applied.
- iter2 `--full`: 1440 0.00%, 360 0.03%, Δh 0, overflow ok, clip 0, content-diff 0🔴/0🟡. chrome-parity quiet with `--region header=.site-header|.site-header` (source has no `<header>`); visual-diff BLANK RENDER is a multi-root `--main` artefact (first root = h1), justified. cap-probe PASS at 2560.
- Motion parity: tabs, fade, hover, transitions match; team-card hover dead on live.
- Prototype table (gate-all --stage prototype): 1 PASS at 1440 and 360. Approved hands-off.

## Migrate plan / render / state-and-report — page1 rendered to the migrated tree (2026-11-05)
- `migrate.mjs render page1 --canon-css stardust/prototypes/page1.css` (bounded run has no canon dir; the archetype CSS is the canon): page1 → `stardust/migrated/page1/index.html`, 11 assets, 5 sections. No siblings. State → migrated.

## A-inventory — one page, one template (2026-11-05)
- `inventory.mjs`: 1 page in scope (page1, template landing). rollout.json site.da = aemcoder/1588603b@main, liveHost main--1588603b--aemcoder.aem.live.

## B-block — three blocks planned (2026-11-05)
- Modules gallery, video-gallery, tabs; `blocks.mjs` 3 distinct blocks, `plan.mjs`: page1 representative, converts all three. Chrome: header + footer blocks rewritten in C0.

## B2-dynamic — inventory re-verified (2026-11-05)
- Detector re-run on page1 against the target host: same single third-party host (portrait images); 4 curated rows unchanged, all disposed.

## C-deliver unit foundation — foundation built, deployed and gated on the preview origin (2026-11-05)
- One subagent authored styles/, blocks/header, blocks/footer, blocks gallery/video-gallery/tabs, scripts/martech.js (scaffolded, all disabled), vids/*.mp4 on the code origin; DA media uploaded; page1, nav, footer live; redirects.json `/` → `/page1` live (root 301 → 200). Lint 0.
- pub1 content-diff reds were scope artefacts (root pairs by selector string; source `.tabs-section` vs EDS `.tabs`) → blocks now also carry the source root classes (`fields-gallery`, `tabs-section`). pub2: 1440 0.02%, 360 0.19%, Δh 0, content-diff 0🔴/0🟡, clip 0, overflow ok. Roots that are the element itself (`h1`, `h1 + p`) inventory nothing on either side — h1/lede are covered by pixel + gate-all content-presence.
- crop-compare header/footer 100% at both widths; chrome-compare exit 0 (no header controls on the source). Foundation frozen.

## C-deliver units archetype-landing + cluster-landing — page1 passes its published gate row (2026-11-05)
- gate-all `--only page1 --eds-host https://main--1588603b--aemcoder.aem.page`: first runs selected nothing (state rows need status `deployed` + liveUrl → set; `--eds-host` needs the scheme). Then content-presence MISSING 2 = the nav links: source has no `<main>` (scanned whole body) vs EDS `main` → `presence.json` `main: body=body` (symmetric whole-body scope, reason recorded).
- Result: 1440 0.02% Δh0, 360 0.19% Δh0, clip 0, presence 0 missing → PASS 4/4 at both widths. No siblings: cluster unit is empty.

## C-deliver unit gate-all — roster published-origin gate on aem.live (2026-11-05)
- `gate-all.mjs` over the roster (page1) against main--1588603b--aemcoder.aem.live: 1440 0.02% / 360 0.19%, Δh 0, PASS 4/4 at both widths; coverage updated from both summaries.

## C-deliver — one page delivered live and gated (2026-11-05)
- Units foundation, archetype-landing, cluster-landing, gate-all, final all done. Foundation unchanged since freeze; no foundation requests queued.

## D-site — sitemap, redirects and root verified (2026-11-05)
- Served sitemap on aem.live = assembled (1 url); redirects.json `/` → `/page1` live; `/` → 301 → `/page1` 200 on .aem.page and .aem.live; nav/footer carry noindex. Publish decision logged in eds-conversion-log.md.

## D2-dynamic — parity replayed on aem.live (2026-11-05)
- parity.json: tabs (3 tabs, 6 cards), native video (2 mp4 sources), portraits (6 imgs, no page errors) + auto martech row: 6/6 PASS, no tag host requested.

## E-full-site — page verified on aem.live (2026-11-05)
- verify.mjs first read 404 on `/page1/` (migrate's page1/index.html → trailing-slash public URL); the delivered path is `/page1` like the source. Added redirects row `/page1/` → `/page1` (published); verify: 1/1 verified.

## E2-link-audit — every href resolves on the live tree (2026-11-05)
- localize-links --check PASS (0 absolute source links). `/`, `/page1`, `/vids/rec_1.mp4`, `/vids/rec-2.mp4`, `/nav`, `/footer` all 200 on aem.live. No capture gaps, no repoints.

## F-optimize — health 100, no open findings (2026-11-05)
- optimize.mjs on aem.live: 0 P1/P2/P3 open; one informational source-parity P2 (no JSON-LD on the source either).

## G-aem — nothing to autofix (2026-11-05)
- autofix-aem dry run over 0 open fixable findings; no project edits.

## H-report — summary (2026-11-05)
- Pages 1/1 live + verified (/page1; `/` and `/page1/` redirect to it). Templates 1 (landing). Blocks 3 (gallery, video-gallery, tabs) + header/footer. Quality: published gate 1440 0.02% / 360 0.19%, Δh 0, clip 0, presence 0; dynamics parity 6/6; health 100. To deliver: none. Register: R-01 (tab bar overflow contained). Martech: scaffolded, all parts off (source has no tags/consent).

## I-dashboard — dashboard written (2026-11-05)
- stardust/rollout/dashboard/index.html + data.json.

## Handoff close-out — completion gaps closed (2026-11-05)
- done-check gaps: `pages_not_live /page1/` (migrate's directory-style `page1/index.html` made the toolchain expect a trailing-slash URL; the source URL and delivered page are `/page1`) → migrated file flattened to `stardust/migrated/page1.html` (bytes unchanged), inventory re-run: path `/page1`, status verified. `header_parity` → header contract recorded from the source home, build explored on aem.live, chrome-compare 0 errors. done-check: complete.

## Handoff — page1 delivered, published and gated; run complete (2026-11-05)
- migrate → rollout A–I done for the single page. Live: https://main--1588603b--aemcoder.aem.live/page1 (site root redirects to it). Published gate 1440 0.02% / 360 0.19%, Δh 0, clip 0, presence 0; dynamics parity 6/6; optimize health 100; runner done-check complete.
