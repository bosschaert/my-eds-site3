# Journal — Jamaica Travel Guide (Adobe Express webpage) replica migration

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## Extract — single page captured via the page's static mode (2026-10-06)

**Prompt:** Hands-off replica migration of exactly one page, https://new.express.adobe.com/webpage/DYft29Wzo0QLK, to Edge Delivery; Phase 1 = `extract --single --dynamics`.

**Decisions:**
- The default (medium, 2.5 s) wait captured the Express loading splash (blurred hero + progress bar); the slow wait (5 s) captured the hero. Vision check verdict: recaptured.
- The app-mode page is a virtual-scroll renderer: every `.section` is `position:absolute`, translated by JS, `hidden` when off-screen; `document.scrollHeight` = 900 and `window.scrollTo` is a no-op. Stitched capture cannot measure this page class (gate doc § Hardening rule 13).
- The page's own `?page-mode=static` ("View Screen Reader-Friendly Version") renders the same publication with the same theme CSS and Typekit fonts as a normal 9327 px scrolling document (10 headings, 5 `<img>`, 13 CSS backgrounds). It is the capture source and the live side of every gate. Recorded in the canonical page record (`_provenance.captureMode`, `finalUrl`) and `_crawl-log.json#visionCheck`. The app-mode capture is kept as `pages/<slug>-app.{json,html}` and `screenshots/<slug>-app.png`.
- Bounded entry: no PRODUCT.md/DESIGN.md synthesis in `current/`; cap-probe wrote `current/DESIGN.json#extensions.breakpoints` (shell fluid, probe 2560, module cap 395 px — to be re-read against measured boxes in Phase 3).
- Fonts are Typekit (`lid8wnz`): `poplar-std` 400 (headings, commercial) and `pt-sans` 400/700 + italics (body, OFL). Policy: never rehost the kit on the new domain; PT Sans self-hosted from its open source, Poplar substituted metric-matched with the brand family name first in the stack (Phase 3 Fonts policy).

**Artifacts touched:**
- stardust/current/pages/webpage-dyft29wzo0qlk.{json,html} — created (static-mode capture; url = source URL)
- stardust/current/pages/webpage-dyft29wzo0qlk-app.{json,html} — created (app-mode capture, reference)
- stardust/current/assets/screenshots/ — created (static full page + app viewport)
- stardust/current/assets/media/ — created (13 renditions, basename = asset id + size)
- stardust/current/assets/css/{runtime.css,typekit-lid8wnz.css} — created (source stylesheets for the Phase 3 lift)
- stardust/current/_computed-styles.json — created (census at 1440 + 360)
- stardust/current/DESIGN.json — created (cap-probe breakpoints only)
- stardust/current/_crawl-log.json — created/updated (visionCheck, dynamicSurface, captureMode)
- stardust/state.json — created (flow replica, handsOff, 1 page extracted)

**Findings worth flagging:**
- Dynamic surface (reach): 14–16 same-site data endpoints (publication JSON + resources), 0 forms on the page body (the Report Abuse form lives in a modal), 1 aria-live region. Triage in Phase 2.
- `pages[].type` set to `landing` (single archetype).

**Open questions:** none

**Next:** Phase 2 — preserve direction, bounded promotion branch (provenance bounded-single).

---

## Preserve-direction — bounded promotion, register with 3 entries, dynamics triaged (2026-10-06)

**Prompt:** Phase 2 of the hands-off replica run; bounded promotion branch (provenance bounded-single).

**Decisions:**
- Synthesized PRODUCT.md / DESIGN.md / DESIGN.json at the project root from the captured page JSON, the theme CSS lift (inline style block, `.custom-…-theme` rules) and the measured box model of the static page mode at 1440 and 360; every value cites its source line or measurement.
- Register: R-01 Report Abuse footer control omitted (applied), R-02 Poplar Std → Anton substitute with poplar-std first in the stack (applied; heading bands are a justified flag zone), R-03 fixed "Made in Adobe Express" badge replicated as captured (deferred).
- Dynamics: 29 findings → 10 curated rows; everything but the heading "Copy link" anchors (rebuild-native, observed in Phase 3) and footer links (passthrough) is decided-out / static-snapshot. All 11 first-party API paths are host-bound on the EDS host.

**Artifacts touched:**
- PRODUCT.md, DESIGN.md, DESIGN.json — created (bounded-single)
- stardust/direction.md — created
- stardust/replica/inconsistency-register.md — created (3 entries)
- stardust/dynamic-features.md, stardust/dynamic-features-plan.md — created; stardust/dynamics/ — generated plan
- stardust/current/_dynamics.json, dynamic-features.generated.md — created by dynamics-detect
- stardust/replica/lift/measure-static.json — created (measure.mjs, 23 selectors × 2 widths)
- stardust/current/assets/css/{inline-theme,noscript}.css — created

**Findings worth flagging:**
- Static mode layout: title 720 tall (80 vh) at both widths; text column 720 wide at 20 % gutters; image+text sections stack the photo (1440 × 450) above or below the text; card gallery = 32px band, lead image 1024 × 542, three 950-tall cards with 1024 × 682 images.
- Static-mode layout rules are not in runtime.css/noscript.css by class name; geometry is taken from measurement (measure-static.json), type/colour from the theme block.

**Open questions:** none

**Next:** Phase 3 — recreate the single archetype as stardust/prototypes/webpage-dyft29wzo0qlk-proposed.html + CSS; fonts (PT Sans, Anton) self-hosted.

---
## Recreate — single landing archetype authored from the lift and gated at 1440 and 360 (2026-10-06)

**Prompt:** Phase 3 (+ the Phase 4 gate loop it ends in) of the hands-off replica run; one archetype, `landing`, page webpage-dyft29wzo0qlk.

**Decisions:**
- Authored `stardust/prototypes/webpage-dyft29wzo0qlk-proposed.html` + `css/replica-canon.css` (fonts, tokens, column model, type ramp, block rhythm, heading anchors) + `css/landing.css` (title, photo bands, cards, photo grid, footer, badge) as clean semantic HTML; every value cites the theme line, runtime rule or measurement. Content root `.article` on both sides.
- Container model lifted, not resolved: the article is the viewport (title 80%, photo bands 50vh), the column gutter is the theme's media ladder (20% / 25% ≥1300 / 30% ≥1800 / 33% ≥2300 / 12.5% ≤768 / 7% ≤480), photo-grid tiles are the percentage layouts, cards keep their measured 32/56/32 → 18/14/31/13 box at ≤767.
- Fonts: PT Sans self-hosted from Google Fonts (OFL); Poplar Std not rehosted — Anton after `poplar-std` in the stack (R-02).
- Footer trimmed per R-01 (Report Abuse + the empty cookie-preferences anchor omitted; the compensation padding tried first was dropped because it only matched one width).
- Interaction parity observed, not inferred: copy-link anchors fire clipboard + the "Link copied to clipboard." toast on live → implemented with a minimal inline script and the lifted toast CSS; photo-link colour transitions implemented; heading/badge hovers dead on live → not implemented.
- The prototype server is `node stardust/replica/serve.mjs stardust/prototypes 8791` (python's http.server dies on this host's hostname lookup); PID in stardust/.work/replica/proto-server.pid.

**Artifacts touched:**
- stardust/prototypes/{webpage-dyft29wzo0qlk-proposed.html, css/replica-canon.css, css/landing.css, fonts/*.woff2, media/*} — created
- stardust/replica/progress.json — created (iterations, per-breakpoint gates, residuals, motion inventory)
- stardust/replica/gates/webpage-dyft29wzo0qlk-{1440,360}/ (iter1–3, --full on 1 and 3), gates/webpage-dyft29wzo0qlk-2560/cap-iter.json, gates/prototypes-{1440,360}/summary.md — created
- stardust/replica/motion/webpage-dyft29wzo0qlk{,-build}.json, -compare.txt — created
- stardust/replica/lift/{measure-static-2.json, measure-360-against.json, flatten-measure.mjs, *.tsv} — created
- stardust/replica/inconsistency-register.md — R-01 gate note added
- stardust/replica/{serve.mjs, status-page.mjs, status-page.json} — created (prototype server; status-page renderer)
- stardust/state.json — webpage-dyft29wzo0qlk extracted → prototyped → approved (hands-off)

**Findings worth flagging:**
- 1440: iter1 8.66% → iter2/3 0.53%, Δh 0, clip 0, overflow ok; prototype table 0.49%. Fixes came off the instruments: the title view had no height (clip-probe named it), the food band carried an authored focal point (inline background-position), nothing else.
- 360: iter1 16.11% → 5.00% → 2.31%, Δh +16 (R-01: the live footer wraps to two lines), clip 0, overflow ok; prototype table 2.29%. The text-band noise was `text-size-adjust: 100%` + `white-space: pre-wrap`, both computed on live and absent on the build.
- Residuals, all register-justified: FONT FORK 🟠 on the 7 poplar-std lines and the cap-probe span Δ22px at 2560 (R-02); MISSING CTA 🔴 + footer Δx/Δh (R-01). chrome-parity has no header/footer on either side; the footer region was probed directly with `--region footer=nav.footer`.
- motion-compare's one "MISSING opacity transition" is a sampler miss: measure.mjs reads identical transition values on the anchor and tooltip both sides.

**Open questions:** none

**Next:** Phase 5 handoff — contract card first (reference/handoff-contract.md); deploy the archetype as EDS blocks, publish (decision: publish), gate on the published origin, rollout for this one page, redirects/site root → this page.

---

## Migrate plan — archetype rendered into the migrated tree, no siblings (2026-10-06)

**Prompt:** Phase 5 handoff, migrate Phase 1 for a one-page run: place the gated landing archetype so rollout's inventory can read it.

**Decisions:**
- `migrate.mjs render webpage-dyft29wzo0qlk --canon-css stardust/prototypes/css/replica-canon.css` → Path A (fidelityTier archetype), `stardust/migrated/webpage/DYft29Wzo0QLK/index.html`, 22 assets bundled, 11 sections. The driver's "6 broken internal links" are the relative `media/…` hrefs of the large-preview image links (assets, not pages); the EDS blocks build those links from the delivered images.
- Modules declared: hero, photo-band, cards, figure, photo-grid (title, text, blockquote and the legal links are default content).
- Deviations recorded on the sidecar: R-01 (Report Abuse dropped), R-02 (Poplar Std → Anton), dynamic-dependency (copy-link anchors rebuilt native, image viewer → direct image link, badge replicated).
- `content-fidelity` declared; `gate-evidence.mjs` filled the measured gates (1440 0.49 % Δ0, 360 2.29 % Δ16).
- No siblings: the migrate `render` cluster does not exist for this run; the `report` unit follows as its own phase.

**Artifacts touched:** stardust/migrated/** — created; stardust/migrate/progress.json — created (unit `plan` done); stardust/scripts/{deploy,rollout}/ — copied from the plugin.

**Findings worth flagging:** none.

**Next:** migrate state-and-report (advance the page to `migrated`), then rollout A-inventory.

---

## Migrate state-and-report — the one page advanced to migrated (2026-10-06)

**Prompt:** migrate Phase 4 for the one-page run.

**Decisions:** `state.mjs advance webpage-dyft29wzo0qlk --to migrated` (migratedPath = stardust/migrated/webpage/DYft29Wzo0QLK/index.html). Summary: 1/1 pages, branch A, tier archetype, 3 gates recorded, 3 deviations, 0 variants. No assets unit: media is rehosted at delivery (DA media upload), not here.

**Artifacts touched:** stardust/state.json — page migrated; stardust/migrate/progress.json — unit `report` done.

**Findings worth flagging:** none.

**Next:** rollout A-inventory → B-block → B2-dynamic → C-deliver (foundation, archetype, gate-all, final) → D-site … I-dashboard.

---

## Rollout A-inventory — one-page roster, one template (2026-10-06)

**Prompt:** rollout Phase A for the one-page replica run.

**Decisions:** `inventory.mjs --site-url … --state stardust/state.json` → 1 page (`/webpage/DYft29Wzo0QLK`, template webpage-dyft29wzo0qlk, blocks hero photo-band cards figure photo-grid), status pending. Site config: DA org aemcoder, site b7aaf274, ref main; liveHost main--b7aaf274--aemcoder.aem.live. The delivered DA path is the folded form `/webpage/dyft29wzo0qlk`; the site root resolves to it through the redirects sheet (D-site).

**Artifacts touched:** stardust/rollout/{rollout.json, coverage/pages.json, coverage/templates.json} — created.

**Findings worth flagging:** none.

**Next:** B-block (blocks.json + plan.json), B2-dynamic, C-deliver.

---
## Rollout B-block — five distinct blocks, one convert step (2026-10-06)

**Prompt:** rollout Phase B for the one-page replica run.

**Decisions:** `blocks.mjs` → 5 distinct module blocks (hero, photo-band, cards, figure, photo-grid), 0 chrome/fragment blocks, 5 instances → 5 conversions, no reuse leverage (single page). `plan.mjs` → one representative page `webpage-dyft29wzo0qlk`, step `convert` for all five blocks; no reuse steps, no siblings. Header and footer are foundation (C0), not plan rows.

**Artifacts touched:** stardust/rollout/coverage/blocks.json, stardust/rollout/plan.json — created.

**Findings worth flagging:** none.

**Next:** B2-dynamic (verify stardust/dynamic-features.md against fresh evidence with the EDS target origin), then C-deliver.

---

## Rollout B2-dynamic — dynamic surface re-verified, every row decided (2026-10-06)

**Prompt:** rollout Phase B2, the pre-import dynamic-surface gate.

**Decisions:** dynamics-detect re-run on the live page (settle 8 s, reach from extract) → 28 findings (29 at triage: the two footer `/go/` locale-variant rows merged into one); dynamics-plan with `--target-origin https://main--b7aaf274--aemcoder.aem.live --migrated stardust/migrated` → 11/11 first-party API paths host-bound, footer `/go/` links `alreadyDelivered` in the migrated HTML. Every fresh finding maps onto one of the 10 curated rows; no new row. Row 9 (heading "Copy link") moved from `pending Phase 3 interaction parity` to `decided`: observed and implemented in Recreate, parity confirmed by motion-compare, 3 dead classes left unimplemented. Nothing blocks C-deliver; owner items (analytics tags, badge) stay non-blocking.

**Artifacts touched:** stardust/current/_dynamics.json, dynamic-features.generated.md — refreshed; stardust/dynamics/dynamic-features.generated-plan.{json,md} — refreshed; stardust/dynamic-features.md, stardust/dynamic-features-plan.md — verification note, row 9 decided.

**Findings worth flagging:** none.

**Next:** C-deliver — unit `foundation` (C0), then the `archetype` unit for webpage-dyft29wzo0qlk, `gate-all`, `final`.

---


## Rollout C-deliver — one page delivered and published, foundation queue applied, roster gate passed (2026-10-06)

Units in `stardust/rollout/progress.json`: `foundation` (nav + footer live, rebranded styles, PT Sans / Anton fonts, zero-height header, fixed badge footer), `archetype:webpage-dyft29wzo0qlk` (page PUT → preview → live with 13 rehosted images; 5 blocks hero / photo-band / cards / figure / photo-grid + bumper; preview gate 1440 2.34 % Δh 0, 360 5.21 % Δh +8; ai-readability 100), `gate-all`, `final`.

- C-final applied the two queued foundation requests once: `blockquote p` inherits the quote ramp (the pipeline wraps the quote in `<p>`; measure.mjs now reads live h 81 = preview h 81, computed type equal), and `decorateHeadingAnchors` in scripts.js adds the source's hover-revealed "Copy link" button beside every h2/h3 with the "Link copied to clipboard." toast (observed firing on the served page: `stardust/replica/motion/webpage-dyft29wzo0qlk-eds.json`). Foundation re-frozen; lint clean; code reached the origin on push (served gzip — probe with `curl --compressed`).
- Published gate after the fixes (preview host, origin captures reused): 1440 PASS 2.39 % Δh −8 clip 0 content 0; 360 PASS 5.23 % Δh +7 clip 0 content 0. Roster `gate-all` wrote `stardust/replica/gates/all-{1440,360}/summary.json`; `update-coverage.mjs --gate` recorded both rows (status stays `deployed`, gate pass).
- Residuals: +8 px total height at 1440 (accumulates above the quote), −7 px at 360; both inside the bar. Decision recorded earlier: publish — the page and `/nav`, `/footer` are live on aem.live.
- Next: D-site (site root `/` → the page, redirects sheet, sitemap/robots, `assemble.mjs --verify-origin`), D2-dynamic, E-full-site, E2-link-audit, F-optimize, G-aem, H-report, I-dashboard, then the replica handoff end after `/done-check`.

## Rollout D-site — root redirect wired, served sitemap matches the one-page set (2026-10-06)

- Redirects sheet published with 3 rows (`/`, `/index.html`, `/webpage/DYft29Wzo0QLK` → `/webpage/dyft29wzo0qlk`); `/` ends in 200 on aem.page and aem.live. `/nav` and `/footer` live with `noindex`.
- `assemble.mjs --verify-origin` exit 0 (served 1 = assembled 1) after correcting the coverage row's path to the delivered lowercase DA path.
- Helper `stardust/.work/rollout/probes/put-sheet.mjs` (TSV → DA sheet → preview → publish; token from the file the environment names, never printed).

## Rollout D2-dynamic — parity rows written and replayed against the live origin, 9/9 checks pass (2026-10-06)

- No listings, search or forms on the one-page roster, so nothing from the pattern catalogue was built here; the self rows (static content, heading "Copy link" anchors, footer badge, adobe.com/go links) were already implemented in recreate and C-deliver.
- `stardust/dynamics/parity.json`: 5 features with replayable checks (dom-count + no-page-errors) and 6 decided-out rows carrying their production statements; owner decisions (analytics tags, badge) listed by name, non-blocking.
- `dynamics-check.mjs --origin https://main--b7aaf274--aemcoder.aem.live` → 9/9 PASS (10 headings, 13 images, 9 anchor buttons + tooltips, 1 badge + link, 1 go link, / renders the h1, 0 page errors); report at `stardust/qa/dynamics-report.md`.
- No page was built in this phase, so coverage is unchanged (1 row).

## Rollout E-full-site — the one page verified on the live origin, decoration confirmed headless (2026-10-06)

- `verify.mjs --base https://main--b7aaf274--aemcoder.aem.live --all`: checked 1, verified 1, failed 0; `delivery.gate.pass` true (roster gate from C-final), so the row reads `verified`.
- Headless render check (`stardust/.work/rollout/probes/render-check.mjs`) on the delivered page and on `/`: `body.appear` set, 14 sections, 7 blocks loaded, header + footer decorated, 0 broken images, 0 page errors on both.

## Rollout E2-link-audit — every link resolved on the live tree, external targets verbatim (2026-10-06)

- `localize-links.mjs --check` over `content/` (3 documents, 5 map entries incl. 2 redirects): CHECK PASS, 0 localizable, 0 to normalize; one source-host link kept absolute by design — the footer badge's Express template-picker (an app surface, scope extension, 200 on the source host).
- Live GETs: `/`, `/index.html` and the mixed-case source path all land on `/webpage/dyft29wzo0qlk` (200); `/nav` and `/footer` 200 and published; all 13 media srcs 200 on aem.live. No internal href carries `.html` or a trailing slash (the page has no internal links besides the root redirects).
- External targets `adobe.com/go/privacy` and `adobe.com/legal/terms.html` (the source page's verbatim footer links) answer 403 "Access Denied" from this environment's egress address in curl and in the installed Chromium alike — an environment limit on adobe.com's side (parity-report rule 4), not a link defect; no workaround attempted. Owner may verify from a regular network.
- No capture gaps, no scope extension beyond the template-picker link; nothing to add to direction.md.

## Rollout F-optimize — baseline audit clean, gate passes with no open finding (2026-10-06)

- `optimize.mjs --base https://main--b7aaf274--aemcoder.aem.live --all --current stardust/current`: 1 page + site checks, health 100/100, open P1 0 · P2 0 · P3 0; GATE pass.
- Two source-parity rows (informational, not scored): no JSON-LD on either side; `<title>` "test-page" (9 chars) is the source's own title. Both are what the source ships, so they stay as captured (replica: no invented improvements).
- Accessibility detectors (main landmark, img alt) raised nothing; the judgment layers (brand tensions, design/UX, content) are not assessed by design in a same-design replica — the source-fidelity gate stands in for them.

## Rollout G-aem — autofix engine found nothing to apply (2026-10-06)

- `autofix-aem.mjs --project . --dry-run`: candidates 0 · applied 0 · manual 0 · skipped 0 · failed 0 — the ledger holds no open finding (the two source-parity rows are informational and never auto-fixed). No project file edited, no re-deploy, verify and optimize results stand.

## Rollout H-report — summary block, parity table and learnings written (2026-10-06)

- `stardust/rollout/report.md`: 1/1 verified, 1 template, 5/5 blocks, health 100/100 with 0 open findings, pixel tables prototypes 1/1 and deployed 1/1 PASS (1440 2.39 % / 360 5.23 % on the published origin), nothing to deliver; dynamics parity table 9/9 PASS beside the delivery ledger; owner items (analytics, badge, Report Abuse, Poplar Std licence) listed as non-blocking.
- `stardust/learnings.md`: 5 pending entries — virtual-scroll capture via the page's static mode, loading-splash wait escalation, mixed-case source paths (redirect row + lowercase coverage path), `blockquote p` wrapper in the quote ramp, bot-protected external targets as environment limits.

## Rollout I-dashboard — dashboard rendered for the one-page site (2026-10-06)

- `dashboard.mjs` → `stardust/rollout/dashboard/{index.html,data.json}`: 1 page, identified 1 · prototyped 1 · deployed 1; template archetype badged; quality 100/100.
- The page reads `deployed` rather than `optimised` only because the dashboard counts the two informational source-parity rows (no JSON-LD, source title) as open findings — optimize excludes them from the open counts; recorded in `stardust/learnings.md`, the shipped script left unedited.

## Handoff — the one page delivered, published and verified; run complete (2026-10-06)

- Phase 5 closed: migrate (plan, state-and-report), rollout A-inventory → I-dashboard all ended; the runner's `/done-check` answers `complete: true` with no gaps.
- Delivered: `/webpage/dyft29wzo0qlk` live on https://main--b7aaf274--aemcoder.aem.live (also `/`, `/index.html` and the source's mixed-case path via the redirects sheet), `/nav` + `/footer` published with `noindex`; publish decision recorded in `stardust/eds-conversion-log.md`.
- Evidence: published-origin gate 1440 2.39 % Δh −8 / 360 5.23 % Δh +7, clip 0, content 0; dynamics parity 9/9; verify 1/1; links and media all resolve; optimize health 100/100, 0 open findings; report at `stardust/rollout/report.md`, learnings (6 pending) at `stardust/learnings.md`.
- Owner items, non-blocking: analytics tags, the "Made in Adobe Express" badge (R-03), Report Abuse not offered (R-01), Poplar Std licence for headings (R-02), adobe.com footer links to be spot-checked from a regular network.
