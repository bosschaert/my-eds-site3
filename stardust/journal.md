# Journal — Super Page replica migration

## Extract — 2 pages captured live, brand surface and container model recorded (2026-11-05)
- Scope fixed by the site plan: `/` (index, type landing) and `/page1` (page1, type static). Provenance 2/2 live (Playwright, chrome technique, medium wait, HTTP 200).
- Source is a hand-written static site: one `styles.css`, one `script.js` (tab switcher). No web fonts are loaded (Poppins / Playfair Display are named only — system fallbacks render), no favicon, no logo, no third-party tags.
- Style census at 1440 + 360 → `_computed-styles.json`; cap-probe → contentMaxWidth 1200px, shell fluid. The 285px "cap" on the home h2 is its `display:inline-block` content width, not a cap — replicated as captured, not registered.
- Header contract: the nav has no interactive controls (0 controls, 0 states).
- Vision check: both pages ok.

## Preserve direction — current spec promoted verbatim, empty register, dynamic surface triaged (2026-11-05)
- PRODUCT.md / DESIGN.md / DESIGN.json promoted verbatim from `stardust/current/`; `stardust/direction.md` records preserve mode.
- Inconsistency register empty — pure replica. No target breakpoints (source's 768 / 900 kept).
- Dynamics: 9 detector findings curated into 4 rows (tabs → block, YouTube → embed, native videos → block, remote images → DA media). All `self`; no owner batch.
- Martech: spec-martech found no tag manager, no CMP; contract + handoff written with every part disabled (the ad pixel is YouTube's own, inside its iframe).

## Recreate — both archetypes recreated and gated at 1440 and 360 (2026-11-05)
- Prototypes: `stardust/prototypes/index-proposed.html` (landing) and `page1-proposed.html` (static), shared `canon.css` + `tabs.js`, per-archetype `index.css` / `page1.css`. Values lifted from the source `styles.css`; the media tables are recreated as `display: table` divs so the auto table layout (324 / 804 px cells) matches.
- Iter 1: index 3.71 % (iframe 3 px wider — source `frameborder="0"` → `border: 0`), both 360 rounds failed the overflow assert: the SOURCE itself overflows by 41 px (tab row). Register R-01 (tab row scrolls inside itself) applied.
- Iter 2–4: index 0.00 % / 0.02 %, page1 0.00 % / 0.03 %, Δh 0 everywhere; content-diff 0 🔴 0 🟡; clip 0; cap-probe PASS; overflow ok.
- gate.sh `--full` exits 2 on chrome-parity only because the live page has no `<header>` element (REGION unmatched); chrome-parity with `--region header=nav.site-header|nav.site-header` is quiet at both widths on both pages (`gates/<slug>-<w>/chrome-parity-region.txt`).
- Motion: hover (nav, media cells) and tab click → fadeIn parity; keyframe renamed `fadeIn` to match. Header scroll-morph dead on live.
- Prototype gate-all: 2 PASS / 0 FAIL at 1440 and 360. Both approved (hands-off).

## Source-fidelity gate — both archetypes pass at 1440 and 360 (2026-11-05)
- Final numbers (iter4 confirmation, `--full`): index 0.00 % / 0.02 %, page1 0.00 % / 0.03 %, height Δ 0 on all four; content-diff 0 🔴 / 0 🟡; clip-probe 0; overflow ok; cap-probe PASS at 2560; no residuals.

## Plan (migrate) — two archetypes, no siblings (2026-11-05)
- The fixed scope is two pages, each the archetype of its own template (landing: index, static: page1). No sibling render clusters exist; `migrate.mjs render index page1` rendered both from the approved prototypes (branch A). Modules recorded per page.
- page1's two "broken" links are the mp4 download fallbacks inside `<video>`; the videos are served root-relative from the code origin (`/vids/`), per the deploy media rule.

## Assets (migrate) — 11 images in DA media, 2 videos on the code origin (2026-11-05)
- Images (fields ×2 from the source, picsum ×3, randomuser portraits ×6) captured to `stardust/current/assets/media/` and uploaded with `da-media-upload.mjs` to `media/site/` — ledger `stardust/deploy/media-ledger.json`. The two source field images are byte-identical on the source (kept as two files, as authored).
- Videos `rec_1.mp4`, `rec-2.mp4` (7.6 KB each) committed under `/vids/` so the code origin serves them root-relative (DA media never serves video to anonymous visitors).

## State and report (migrate) — 2/2 pages migrated at archetype tier (2026-11-05)
- `state.mjs advance index page1 --to migrated`; migrate summary: 2 archetype-tier pages, 0 deviations, 0 refused.

## A-inventory (rollout) — 2 pages, 2 templates in scope (2026-11-05)
- inventory.mjs: 2 pages, templates index:1, page1:1; site.da = aemcoder/52c25a12@main, liveHost main--52c25a12--aemcoder.aem.live.

## B-block (rollout) — 6 distinct blocks, representative-first plan (2026-11-05)
- blocks.mjs: site-header, site-footer, team-tabs (×2 each), media-table, callout, gallery. plan.mjs: index converts 5, page1 converts gallery and reuses the rest.

## B2-dynamic (rollout) — inventory holds against the migrated tree (2026-11-05)
- dynamics-plan re-run with --migrated: 9 detector rows, 3 already delivered by capture (YouTube embed + image hosts present in migrated HTML), 0 host-bound. The 6 draft "owner batch" rows are the YouTube player subresources and image hosts merged in stardust/dynamic-features.md; all 4 curated rows carry a disposition.

## C-deliver foundation unit (rollout) — styles, header, footer, nav/footer docs live (2026-11-05)
- Foundation subagent: styles.css rewritten to the source canon, header/footer blocks (template-slotted), /nav + /footer published with Robots noindex, scripts/martech.js scaffolded (all parts off), lint clean, pushed b0085b5.
- Main-agent shell gate on the live origin: chrome-parity header ✓ at 1440 and 360 (footer offset is content height, expected on the empty shell); header contract chrome-compare 0 errors. Foundation frozen.

## C-deliver archetype units (rollout) — index and page1 live, published-origin gate PASS (2026-11-05)
- Blocks media-table, callout, gallery, tabs; content/index.html (root) and content/page1.html deployed + published.
- Preview gate: index 1440 0.00% / 360 0.09%, page1 1440 0.00% / 360 0.12%, Δh 0, content 0🔴 0🟡, clip 0; gate-all 2 PASS at both widths. Round 1 was a stale CDN 404 on tabs.css, cleared by a forced code sync.
- Open: davids-model-lint D1 on the YouTube link (fix lives in frozen scripts.js) → queued in foundation-requests.md for C-final. content-presence nav sidecar (source nav is not inside a <header>).

## C-deliver — C-final applied the YouTube D1 request; 2/2 pages live and gated (2026-11-05)
- foundation-requests.md: 1 request applied once (6a35e87) — `buildEmbedAutoBlocks()` in scripts.js buildAutoBlocks turns a lone YouTube link paragraph into the leading cell of the following media-table (or a one-cell media-table); index now authors the embed as a default-content link. davids-model-lint index: 0 🔴 (was 1), 2 🟡 advisory.
- Live CDN served a stale Origin-keyed variant of scripts.js for ~85 min after the push (admin code/cache purges did not clear it); the old in-cell content was re-published meanwhile so the live embed never broke, and the new content was published once the variant expired (preview gate on .aem.page beforehand: 0.00 % / 0.09 %, Δh 0).
- Published gate index (pub3): 1440 0.00 % Δh 0, 360 0.09 % Δh 0; chrome-parity REGION header / footer EXTRA are the known no-<header>/<footer> instrument limit; 1440 unit-geometry FAIL is the shared origin-units cache holding the 360 px capture (served boxes identical to the pub2 PASS).
- foundation-freeze check ok before; re-frozen after the scripts.js change (17 files). progress.json unit final → done.

## D-site — sitemap served 2 = assembled 2, redirects sheet live, / 200 (2026-11-05)
- assemble.mjs: sitemap.xml 2 urls (expected set), robots.txt, 0 fragments; --verify-origin on aem.live: served 2, extra 0, missing 0 → exit 0.
- Source root answers 200 (served by the `index` document, no `/` row); source /index.html answers 307 → `/`, so stardust/redirects.tsv carries one row `/index.html → /`.
- /redirects.json PUT to DA as a sheet (201), previewed + published (200); aem.live/index.html → 301 Location `/`.
- /nav and /footer: 200 with `<meta name="robots" content="noindex">`; `curl -sIL` on / and /page1 ends 200 on .aem.page and .aem.live.

## D2-dynamic — parity.json 4 features + martech, dynamics-check 10/10 PASS (2026-11-05)
- stardust/dynamics/parity.json: x-team-tabs, v-video-youtube, v-native-video, m-remote-images, all `done`; martech row appended from martech-contract.json.
- dynamics-check on aem.live: 10 checks over 5 features, 10 pass, 0 fail; martech gate: `/` requests no tag/CMP host (1 cross-site host blocked); no page errors on / and /page1.
- Tabs click flow probed directly: Team Beta → panel 2 visible with 2 cards (Brian Kim, Sophia Patel), other panels 0 visible cards (the closed check set has no click-and-assert type). YouTube iframe 1 in .media-table; /page1 2 videos, both mp4 206.
- stardust/dynamic-features.md Status → done on rows 1–4.

## E-full-site — 2/2 verified on aem.live after carrying the source /page1/ redirect (2026-11-05)
- update-coverage --gate (all-1440, all-360): 2/2 rows matched, gate pass on both.
- verify.mjs first run: page1 failed HTTP 404 — verify fetches `/page1/` (migrated tree shape page1/index.html), which the source answers 307 → /page1 and EDS 404'd. Added the source redirect `/page1/ → /page1` to stardust/redirects.tsv and the /redirects.json sheet (PUT 200, preview 200, live 200); aem.live/page1/ → 301 /page1.
- verify.mjs re-run: 2 checked, 2 verified, 0 failed. Headless render check (/, /page1): 0 broken images, 0 page errors, all blocks loaded, /page1 2 videos readyState 4 (no autoplay on source; no restoreAtDelivery entries recorded).

## E2-link-audit — every href resolves on aem.live, nothing to repoint (2026-11-05)
- localize-links --check over content/ (4 docs: index, page1, nav, footer): CHECK PASS, 0 source-host links left, 0 internal hrefs to normalize.
- GET on every href of /, /page1, /nav, /footer on aem.live: 9 distinct targets, 9 × 200 (/, /page1, /vids/rec-2.mp4, /vids/rec_1.mp4, self-origin canonical/nav/footer URLs, the YouTube embed).
- No internal target missing from the capture: no capture gap, no scope extension, no repoint decision needed.

## F-optimize — health 98/100, 0 open P1, gate passes (2026-11-05)
- optimize.mjs --all on aem.live (run-1): P1 0 · P2 0 · P3 1; source parity 3 informational (no JSON-LD on either page, shared <title> "Good Morning!" — both mirror the source).
- P3 cross-page/duplicate-description: the source pages carry no meta description; EDS derives one from the first paragraph, which both pages share. Left as is — authoring a description would be new content not in the capture (replica: no content invention); noted for the owner.

## G-aem — nothing to autofix (2026-11-05)
- autofix-aem --dry-run: 0 candidates (the one open P3 is design-pass/upstream, the 3 parity findings are out-of-scope). No EDS edit, no re-deploy; verify + optimize results from E/F stand.

## H-report — 2/2 pages, 6/6 blocks verified; report written (2026-11-05)
- Block coverage rows recorded (update-coverage --block … verified, EDS names header/footer/tabs/media-table/callout/gallery); verify re-run keeps 2/2; lastRun blocks 6 total, 6 converted, 0 pending.
- stardust/rollout/report.md: the summary block (pages, templates, blocks, quality, to-deliver). Two learnings appended to stardust/learnings.md.

## I-dashboard — dashboard written; rollout closed (2026-11-05)
- dashboard.mjs → stardust/rollout/dashboard/{index.html,data.json}: 2 identified · 2 prototyped · 2 deployed · 0 "optimised" (the stage needs zero open findings; both pages carry the one accepted P3 shared auto-derived description, which mirrors a source without descriptions).

## Handoff (replica) — migrate → deploy → rollout complete, done-check clean (2026-11-05)
- Rollout A → I all ended; 2/2 pages verified live on main--52c25a12--aemcoder.aem.live, gate-all PASS at 1440 + 360, 6/6 blocks verified, health 98, 0 open P1.
- Runner done-check: complete true, 0 gaps. state.json: 2 migrated (index, page1).
- Owner follow-ups: martech contract parts stay disabled until the owner enables them (stardust/martech-handoff.md); meta descriptions optional (source has none).
