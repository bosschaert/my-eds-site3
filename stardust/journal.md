# Journal — replica migration of https://balbriggan.ie/

## Extract — single-page capture of the home page (2026-09-28)

- Scope: exactly one page, `https://balbriggan.ie/` (slug `index`), fixed by `stardust/.labs/site-plan.json`. Bounded entry (`--single --dynamics`), so no PRODUCT.md/DESIGN.md synthesis; Phase 2 takes the bounded promotion branch.
- Capture: Playwright headless, HTTP 200, waitMode medium (2500 ms), full-page screenshot 1440×4719, rendered DOM saved. 10 headings, 22 real images, 1 Vimeo background video (autoplay/loop/muted), 1 POST form (newsletter, 5 fields), 4 `aria-haspopup` nav triggers, WordPress. No same-site data endpoints; only a Google Analytics collect call.
- Site quirk: the theme's `scripts.js` declares a global `function scrollTo(target)` (jQuery animate to a selector) that shadows `window.scrollTo`, so the crawler's first pass failed with `Cannot read properties of undefined (reading 'top')`. Fixed without editing any shipped script: `stardust/scripts/replica/site-quirks-preload.mjs`, loaded through `NODE_OPTIONS=--import`, adds an init script to every Playwright context that keeps the native `scrollTo` for numeric calls and forwards selector calls to the theme's helper. Every instrument that scrolls the live page (crawl, stitch-shot, anchor, measure, chrome-parity, motion-observe, content/visual-diff) must run with that env (`source stardust/scripts/replica/site-quirks.env`).
- State: `stardust/state.json` created with `flow: replica`, `flowSource: user-phrase`, `handsOff: true`; page `index` → `extracted`, type `home`.
- Breakpoints for the gate: run.json says `desktop,mobile` → 1440 and 360.

## Preserve direction — bounded-single synthesis, empty register, dynamics triaged (2026-09-28)

- Branch: bounded promotion (`preserve-direction.md` § 1a). PRODUCT.md, DESIGN.md, DESIGN.json written at the project root from the captured page JSON + the CSS lift (`stardust/replica/tokens.json`), provenance `bounded-single`. `stardust/direction.md` records preserve mode and the hands-off activation.
- CSS lift sources: theme `style.css` (custom rules, verbatim), `theme.min.css` (Bootstrap 4 base), `style-census` at 1440 and 360. Palette blue #2494d2 / yellow #f5ee2f, body #3c3c3b, bands #f0f0f0, footer #444; Bootstrap 1140px container; pill buttons.
- Fonts finding: the census computes Gotham-Light / GothamMedium / GothamBold, but no stylesheet on the site declares any Gotham `@font-face` (only FontAwesome; Google Fonts Open Sans / Libre Baskerville are linked but unused by measured elements). The live page therefore renders fallback fonts. Decision: keep identical font stacks in the recreation — the same machine renders the same fallbacks; no substitute, nothing rehosted. Downloaded latin woff2 for the linked Google faces to `stardust/current/assets/fonts/` in case a form element uses them.
- Inconsistency register: empty (pure replica).
- Dynamics: detector found 7 rows (settings objects ×2, newsletter form, nav dropdowns, GTM, GA, FB pixel); curated into `stardust/dynamic-features.md` with a disposition on every row plus the hero Vimeo video as embed-passthrough; `wp` object decided-out. Plan in `stardust/dynamic-features-plan.md`. Owner batch: newsletter endpoint, tag ids.
- Page `index` → `directed`.

## Recreate — home archetype authored from the CSS lift, static gates green at 1440 and 360 (2026-09-28)

- Prototype: `stardust/prototypes/index-proposed.html`, built by `build-index.mjs` from `index-proposed.template.html` (the captured map SVG is inlined so the theme's label CSS applies, its 12 pin photos harvested). Layers: `canon.css` (Bootstrap 4 subset + navbar/footer/buttons lifted from `style.css`, `theme.min.css`, `learning-style.css`), `index-proposed.css` (hero, WP columns 20/60/20 with 2em gap and 1.75em bottom margin, slick carousel initial state, explore grid, map, downloads, Gravity Forms thirds layout), `fonts.css`. Content verbatim from the captured HTML, including decomposed accents ("Céard…" is NFD on the source) and the slick dot aria-labels ("1 of 2"…"4 of 2").
- Correction to the preserve-direction finding: Gotham IS declared — `style.css` imports `../fonts/font.css`, which declares GothamBold / GothamBook / GothamMedium / Gotham-Light as self-hosted webfonts. It is a licensed commercial kit, so per the fonts policy nothing is rehosted: each stack keeps the Gotham name first and falls to a self-hosted Montserrat face (OFL) picked by measured glyph widths against the source files (Light→400 ratio 0.99, Medium→500 0.98, Bold→700 1.01). Owner action: supplying the licensed kit for the new host removes the residual with no code change. `direction.md` and `tokens.json` amended.
- Method: 92 live boxes measured at 1440 and 360 (`measure-live.txt`, `measure-live-2.txt`), then `measure.mjs --against` — every box within ±3px after two fixes (form fields wrapped on inter-`li` whitespace the source lacks + the missing 8px `ginput_container` margin; the 360 logo shrink rule lives in `learning-style.css`).
- Gates (`gate.sh --full`, live cached): 1440 → 2.29% pixels, height Δ 2px, no hot band (max 5.3%), 0 structural content findings, overflow ok. 360 → 3.80%, Δ 2px, no hot band (max 9.6%), 0 structural, overflow ok (the source's own +10px overflow is clipped in the build). Chrome parity: only text-metric deltas from the substituted face (nav ±2–8px, footer "Privacy" inline height 15→19). Visual-diff: 9 STRETCHED IMAGE advisories = `object-fit: cover`, as on the source.
- Instrument fixes in the project copies, commented and flagged for upstreaming: `stitch-shot.mjs` stall guard no longer fires at the document end when the page shrinks during scroll (sticky-nav morph, −13px at 360 → both live captures had exited 1); `gate.sh` gained `GATE_CHROME_ARGS` so `--full` can probe `#wrapper-navbar` / `#wrapper-footer-full` on a site without `<header>`/`<footer>`.
- Next: source-fidelity-gate phase — interaction parity (motion-observe live → implement fired behaviours → compare), confirmation round, approval (hands-off), state → approved.

## Source-fidelity gate — interaction parity from observation, confirmation rounds green, approved hands-off (2026-09-28)

- Motion observed on the live page (`motion-observe.mjs`, three runs: 1440 with arrows/dots/hover families, 1440 supplementary with the dropdown click and corrected selectors, 360 with the toggler): sticky-nav `.scrolled` past 100px (logo 0.3s), slick `.news-cards` (track transform 500ms ease, slick-current/active rotation over 11 slides incl. clones, dot state), Bootstrap collapse (`.collapsing` → `.collapse.show`, height .35s) and dropdown (`li.show` + `.dropdown-menu.show`, toggle focused), hovers on `.btn-secondary`, `.news-card`, `.grid-item-content`, downloads titles, the Get Involved pill and footer links. No scroll-entrance animation fired. Dead and therefore not implemented: the main-menu link hover in `style.css` L112 (its selector never matches).
- Implemented as one motion layer, `stardust/prototypes/motion.js` (replaces the inline sticky-nav script), mirroring the live mechanisms: slick's buildOut (3 prepended + 4 appended clones, inline slide width `ceil(list/3)`, translate3d start at −3 slides, 500ms ease, wrap after the animation), Bootstrap 4 collapse and dropdown state machines with the source's `data-toggle`/`aria-*` hooks restored on the template. `canon.css` gained the open-state rules lifted verbatim from `theme.min.css` (`.collapsing`, `.dropdown-menu`, `.dropdown-item`, `.show`, navbar placement), the `a:hover` colour `#2600e6` and the Bootstrap `.btn-secondary:hover` border colour the site never overrides. `motion-compare.mjs`: 16/18/13 parity, 0 missing, 0 extra; two advisories where the live frame sampler could not see the slick track (dot clicks) — confirmed on the class lines.
- Confirmation (`gate.sh --full`, live cached): conf1 exposed a regression from the clones — the stylesheet's 33.3333% flex-basis re-based on the 11-slide track (1440 4.30% with a hot band on the carousel, 360 29.75%); pinning the slide's flex basis inline fixed it. conf2/conf3: 1440 → 2.32% (gated 2.29%), Δh 2px, 0 structural (11 🟡, down from 24 after aligning three dropdown-toggle `title` attributes with the source), overflow +1px ok; 360 → 3.79% (gated 3.80%), Δh 2px, 0 structural, overflow ok. chrome-parity: the identical text-metric delta set as iter3 (Montserrat substitute) — recorded residual. visual-diff: 16 STRETCHED IMAGE advisories = `object-fit: cover` on the 9 originals + 7 clones.
- Approval: hands-off → `state.json` index `approved` (approvedBy hands-off), `progress.json` home `approved` with the motion inventory and confirmation numbers. Residuals added: chrome text metrics (fonts, owner action), `.map-pin` hover unresolved by instrument (same result both sides).
- Next: Phase 5 handoff — read `reference/handoff-contract.md`, then migrate → deploy → rollout for the single page; the site root must resolve to it; the final gate runs on the published origin.

## Migrate plan — one page, Path A from the approved prototype (2026-09-28)

- Scope: `index` (home), status `approved`, Path A (archetype tier) from `stardust/prototypes/index-proposed.html` with the single `canon.css` under the prototypes dir; no siblings, no thin pages, register empty. Preconditions held: `stardust/dynamic-features.md` present (7 rows dispositioned), `stardust/replica/progress.json` home gates pass at 1440 and 360 with every residual carrying a cause.
- Page map: one entry, `index → /` (root). Unit ledger `stardust/migrate/progress.json`: `plan` done.
- Next: `render` unit `home` (`migrate.mjs render index`), sidecar judgments, gate-evidence.

## Migrate render — home unit: index placed at the root with its sidecar (2026-09-28)

- `migrate.mjs render index`: Path A, `index → /` (`stardust/migrated/index.html` + `_meta.json`), 60 assets bundled (canon.css, fonts.css, index-proposed.css, motion.js, fonts, media, favicon), 0 missing, 0 refusals. 52 of 53 internal links point at source pages outside this run's one-page scope: recorded as a `internal-links` decision (scope extension → repoint to the source site, per the handoff card's E2 rule), never left as 404s.
- Sidecar: `modules[]` = hero, news-carousel, explore-grid, map, downloads, newsletter (composite sections; header/footer are chrome). `content-fidelity` declared (verbatim from the capture; conf3 content-diff 0 structural on `#page`, header, footer). Two `dynamic-dependency` deviations: the Gravity Forms newsletter form (interim posts to the source handler) and the tag stack (not loaded on the preview host). `gate-evidence.mjs` derived `pixel-gate-1440` 2.32 %/Δ2, `pixel-gate-360` 3.79 %/Δ2 and `content-count` (11 findings, 0 🔴) from the conf3 jobs; `media-reconcile` n/a until the delivered file exists; `delivery-lint` on the standalone prototype reads FAIL (no `<header>` wrapper, no `<h1>`, no metadata block) — those are properties of the delivered DA document, checked in C-deliver.
- Unit `home` done in `stardust/migrate/progress.json`. Next: `state-and-report` (advance `index` to migrated).

## Migrate state-and-report — index migrated, bundle self-contained (2026-09-28)

- `state.mjs advance index --to migrated` (migratedPath `stardust/migrated/index.html`); `state.json.migrate` written by the driver (selfContained, 60 bundled assets, 0 missing). Summary: 1 migrated, 0 unchanged, 0 failed, 0 stale; Path A 1 / A′ 0 / B 0. Unit `report` done.
- Next: rollout A-inventory → B-block → B2-dynamic → C-deliver (foundation + home cluster + final, published-origin gate) → D-site (root resolves to the page) → D2 → E → E2 → F → G → H → I.

## Rollout A-inventory — coverage of one page, DA coordinates filled (2026-09-28)

- `inventory.mjs --site-url https://balbriggan.ie/ --state stardust/state.json`: 1 page (`index`, path `/`, template `index`, pending), 1 template. `rollout.json` site: DA org `aemcoder`, site `22880d22`, ref `main`, live host `main--22880d22--aemcoder.aem.live`, preview host `main--22880d22--aemcoder.aem.page`.
- Next: B-block (blocks.mjs + plan.mjs), B2-dynamic, then C-deliver.

## Rollout B-block — six module blocks, one conversion point each (2026-09-28)

- `blocks.mjs`: 6 distinct module blocks (hero, news-carousel, explore-grid, map, downloads, newsletter), 6 instances → 6 conversions; header and footer are chrome and ride the foundation unit (authored `/nav` + `/footer` documents, template-slotted header/footer blocks). `plan.mjs`: one page, representative `index`, `convert:` all six, `reuse:` none.
- Next: B2-dynamic (re-verify `stardust/dynamic-features.md` against fresh evidence), then C-deliver.

## Rollout B2-dynamic — inventory re-verified against fresh evidence, no new rows (2026-09-28)

- First detector run failed on the theme's `scrollTo` shadowing (the known site quirk); re-run under `site-quirks.env`: 7 findings, all mapped to curated rows; `dynamics-plan.mjs --target-origin … --migrated`: self 2, owner batch 4, delivered 1, host-bound 0. Verification note appended to `stardust/dynamic-features.md`; evidence under `stardust/dynamics/verify/`.
- Next: C-deliver — C0 foundation subagent (styles, fonts, header/footer blocks, `/nav` + `/footer`), gate on the published origin, freeze; C1 home cluster (six blocks + the root document); C-final.

## Rollout C-deliver — unit foundation (C0): chrome live, gated on the published origin, frozen (2026-09-28)

- Foundation subagent: canon `styles/` (root vars, type, buttons, section classes `fluid`/`band`/`bg-lightgray`/`section-intro`), self-hosted Montserrat substitutes + FontAwesome + slick under `fonts/`, template-slotted header (four dropdowns, mobile collapse, sticky `.scrolled` morph) and footer blocks, `/nav`, `/footer` and a provisional metadata-only `/index` shell delivered PUT → preview → live (publish decision: preview AND live, recorded in `stardust/eds-conversion-log.md`).
- Main-agent gate (chrome-parity with the gated regions `#wrapper-navbar|header`, `#wrapper-footer-full|footer`): first round found the "Get Involved" pill styled as the 16 px bold generic button (every nav item 31–34 px left), region-root backgrounds one level deep, the footer legal line 4 px tall, and added sr-only social names. Fixed by the subagent (pill 12/18/400, backgrounds on the root elements, ascent/descent overrides on the substitute faces, `aria-label` instead of text — register entry #1, the only permitted delta). Remaining chrome lines: Montserrat Δw ≤ 4 px and its right-aligned Δx accumulation; the footer Δy is the empty shell.
- crop-compare bands (live capture vs served shell): header 1440 2.61 % (glyph-only — font residual, recorded), header 360 1.08 %, footer 1440 0.23 %, footer 360 0.60 % (my first footer round used a stale `--y`; the capture's footer sits at 4565/5196).
- `foundation-freeze.mjs freeze` over styles, fonts, header/footer blocks, head.html, scripts, `/nav` + `/footer` docs. Unit `foundation` done. Next: unit `home` (six blocks + the root document, published-origin gate).

## Rollout C-deliver — unit home (C1): six body blocks, root document live, published-origin gate green (2026-09-28)

- One cluster subagent ran the whole chain: `blocks/{hero,news-carousel,explore-grid,map,downloads,newsletter}` (template-slotted hero/map/newsletter, reconstructive carousel/grid/downloads; node-slotting, EW gate 25/27 editable, 0 dead, 2 declared exempt = the form's field names + submit label), 13 editorial images on `content.da.live/aemcoder/22880d22/media/home/` (media ledger), `content/index.html` replacing the provisional shell (one `<h1>` = the hero title, recorded as a heading-level deviation h2→h1), delivery-lint 0/0/0, media-reconcile exit 0, davids-model-lint 2 🟡 D1 (bespoke hero/map compositions, justified in the conversion log), `deploy-batch` PUT → preview → live (`/index`), `/` 200 on both origins, ai-readability 100 % after the slick clones became lazy (built on first interaction).
- Published-origin gate (`gate.sh … pub1..pub3`): pub1 1440 7.97 % / Δh −78 (the newsletter form inherited the band padding — own class), 360 Δh +49 was a capture artefact (footer block loads last; gate.sh gained a `GATE_BUILD_SETTLE=1` pass-through). Confirmation pub3 `--full`: **1440 2.46 % / Δh 2 / 0 structural / overflow +1; 360 3.82 % / Δh 2 / 0 structural / overflow +1**; chrome-parity 1440 = the 10 Montserrat PAIR deltas recorded at C0, 360 parity. content-diff 75 advisory lines (title attrs, live inline scripts/honeypot, the sr-only map legend, the video fallback link); visual-diff 9 (object-fit STRETCHED, one lazy card image outside the slick viewport at 360).
- Main-agent crop-compare on the pub3 captures (`stardust/rollout/gates/home/`): header 1440 2.61 % (glyph-only residual, unchanged), footer 1440 0.76 %, header 360 1.08 %, footer 360 1.99 % — all at or under the C0 numbers.
- One foundation request queued (`intro-columns` section style for the 20/60/20 intro band; scoped override in hero.css until C-final). Open owner decision carried: the newsletter form posts interim to the source's Gravity Forms handler. `foundation-freeze.mjs check`: unchanged (19 files). Unit `home` done. Next: C-final (freeze check, apply the request once, re-gate the archetype at both widths, `update-coverage`, `C-deliver end`).

## Rollout C-deliver — unit final: request applied, re-gated, phase closed (2026-09-28)

- `foundation-freeze.mjs check` unchanged (19 files). The one queued request (`intro-columns` section style, 20/60/20 WordPress columns for the intro band) applied once: rules moved from `blocks/hero/hero.css` into `styles/styles.css` beside `band`/`section-intro` (`6611bb3`, lint clean, Code Sync polled on the decompressed served file — `curl --compressed`, the CDN serves gzip to a bare curl).
- Re-gate on the published origin: pub4 1440 2.48 % / Δh 2; pub4 360 showed Δh 49 (the short build capture — footer block loads last; `GATE_BUILD_SETTLE=1` is the project-copy pass-through, not on by default). pub5 with the settle pass at both widths: **1440 2.46 % / Δh 2 / overflow +1; 360 3.82 % / Δh 2 / overflow +1** — identical to the pub3 confirmation. Foundation re-frozen with the same path set (19 files).
- Discipline note for the record: the cluster's content-diff rounds ran with `--main body` (whole-document scoping, chrome included) instead of a symmetric content root; the result (0 structural 🔴 across the whole document) is stricter, not looser, so it was not re-run. stitch-shot warns that the `gotham-*-fallback` size-adjust faces (local() sources) do not load in the container; the Montserrat substitute faces do (foundation chrome probe), so the captures render the intended type.
- Coverage: 1/1 pages deployed, 6/6 blocks converted. C-deliver closed. Next: D-site (root resolves to the page already; sitemap/robots/manifest, served-sitemap verify), D2-dynamic, E-full-site, E2-link-audit, F-optimize, G-aem, H-report, I-dashboard.

## Rollout D-site — root resolves to the page, chrome documents noindex, served sitemap verified (2026-09-28)

- The source root serves a page (200, no redirect chain), so the delivered `/index` document IS the root: `curl -sIL …aem.page/` → 200; no `stardust/redirects.tsv`, no redirects sheet needed.
- The served `/sitemap.xml` listed `/`, `/nav` and `/footer` — the chrome documents lacked `Robots: noindex`. Added a metadata block (`robots | noindex`) to `content/nav.html` and `content/footer.html`, republished both with `deploy-batch --force` (2/2 live), `<meta name="robots" content="noindex">` confirmed on the served `/nav`; the served sitemap settled to the single page within a minute.
- `assemble.mjs --verify-origin https://main--22880d22--aemcoder.aem.live`: served 1 = assembled 1, extra 0, missing 0, exit 0 → `stardust/rollout/site/{sitemap.xml,robots.txt,manifest.json}` (`servedSitemap` recorded). Foundation manifest refreshed for the two chrome documents (19 files).
- Follow-up: after the republish the live-origin `/sitemap.xml` still listed `/nav` for several minutes (the preview-origin sitemap lists only `/`; the served `/nav` carries the noindex meta). `/nav` was republished once more; re-verify the live sitemap at E-full-site and record the settled count there.

## Rollout D2-dynamic — seven features replayed on the live origin, 8/8 checks pass (2026-09-28)

- `stardust/dynamics/parity.json` authored from the seven `dynamic-features.md` rows; `dynamics-check.mjs --origin https://main--22880d22--aemcoder.aem.live` → `stardust/qa/dynamics-report.{md,json}`: 8 checks over 7 features, pass 8, fail 0.
- Newsletter form (#1, interim): the five captured field names + submit present, `aria-required` count 3 = the source's (the consent checkbox carries only the asterisk label; my first run expected 4 and was wrong). A filled `form-flow` submission was deliberately not fired — the interim action is the customer's production Gravity Forms handler; the owner decision on the endpoint stays open.
- Nav dropdowns (#2, done): 4 `aria-haspopup` toggles, 0 page errors (click behaviour proven by the foundation chrome probe 43/43). Tags (#4–#7, interim): no request to any Google tag / analytics / Facebook host before consent.
- Hero video (#3): `video-plays` first FAILed with 0 playback requests. Probe (`stardust/.work/rollout/probes/video-playback-probe.mjs`): player.vimeo.com answers this network with 403 text/html (Cloudflare) and Chromium blocks it as `net::ERR_BLOCKED_BY_ORB` on the SOURCE site and on the build alike → recorded as `environmentLimit` (rule 4: rows, not failures), structural check on the `<video>` + `<source>` (same URL and attributes) passes. Verify playback from a regular browser/region.
- Live-origin `/sitemap.xml` still lists `/nav` (noindex meta served); re-check at E-full-site.

## Rollout E-full-site — the one page verified on the live origin (2026-09-28)

- `verify.mjs --base https://main--22880d22--aemcoder.aem.live --all`: checked 1, verified 1, failed 0 (type page); coverage row `index` → `verified` (rollout.json lastRun: 1/1 verified). Rendered check of the template's page: the cluster's rendered probe (22/22 at 1440 + 360) and D2's `no-page-errors` on the live origin.
- Live-origin `/sitemap.xml` still lists `/nav` beside `/` (the preview-origin sitemap and the served `/nav` noindex meta are correct; `/footer` dropped on the first republish). Carried to the report as a platform re-index follow-up; no page defect.

## Rollout E2-link-audit — every href checked on the live origin, source-site targets repointed by decision (2026-09-28)

- `localize-links.mjs --source-host balbriggan.ie --content content --dry-run --json`: 3 documents, 3 map entries, 0 to localize, 0 to normalize, 26 distinct source-site paths (48 link occurrences, 41 distinct URLs) kept absolute — the migrate `internal-links` decision (scope extension → repoint), now named in `direction.md § Link audit` with the full path list as scope debt.
- Fetched `/`, `/nav`, `/footer` on `main--22880d22--aemcoder.aem.live`: 55 distinct hrefs. Internal ones are root-relative and extensionless (`/`, `/styles/styles.css`, `/favicon.png`); the three absolute `aem.live` hrefs are the canonical links; the four `href="#"` anchors are the source nav's dropdown toggles (4 in the capture, 4 delivered).
- GET on every href: 52 × 200 (all 26 source-site paths included), Facebook 400 (verbatim external URL from the capture; Facebook answers 400 to non-browser clients), Vimeo mp4 403 (environment limit shared with the source, D2-dynamic). No 404 anywhere. Evidence: `stardust/rollout/link-audit.json`.
- Nothing to deploy or republish: the nav/footer targets are all on the source site by decision. Next: F-optimize.

## Rollout F-optimize — one P2 open, gate green (2026-09-28)

- `optimize.mjs --all` against `https://main--22880d22--aemcoder.aem.live` (run-1): 1 page + site checks, health 90/100 (ai-search 90; accessibility, seo and cross-page layers report null — nothing detected to score on one page), open P1 0 · P2 1 · P3 0, source parity 0 (the capture is present, no shared finding).
- The one finding: `ai-search/jsonld` P2 on `index` — no JSON-LD structured data; fixability `platform-migration` (a re-deploy fix, candidate for G-aem autofix). GATE: no open P1.
- Next: G-aem (autofix dry-run first, then apply → re-deploy → re-run verify + optimize).

## Rollout G-aem — no fixable finding, the one P2 stays manual (2026-09-28)

- `autofix-aem.mjs --project . --dry-run`, then apply: 1 candidate, 0 applied, 1 manual, 0 failed. The `ai-search/jsonld` P2 on `index` has no safe EDS fixer: JSON-LD is placed through `head.html` / the metadata pipeline and needs a payload decided with the owner. The source carries a WordPress SEO graph whose entities and URLs name balbriggan.ie; copying it verbatim onto the new origin would publish structured data about another domain, so no edit was made. The finding keeps `autofix.status: manual` and stays open (P2, not gated) for the report's to-deliver list.
- No project file changed → no re-deploy; verify (E-full-site 1/1) and optimize (F run-1, health 90, 0 P1) stand. Next: H-report.

## Rollout H-report — summary block, dynamic parity table and five learnings written (2026-09-28)

- `stardust/rollout/report.md`: the summary block from `rollout.json.lastRun` + `optimize/scorecard.json` (1/1 verified, 1 template, 6/6 blocks, health 90, P1 0 / P2 1 / P3 0, nothing left to deliver), the delivery ledger with the published-origin gate numbers, the D2 dynamic parity table beside it (7 features, 8/8 checks, the dataLayer row without a check), the one open P2, the link audit, and the follow-ups (sitemap re-index, fonts, scope debt, JSON-LD / form endpoint / tags).
- `stardust/learnings.md`: five pending entries, one per failure class — stitch-shot stall guard on a shrinking document, gate.sh chrome roots on landmark-less sites, build capture before the last block decorates, sitemap propagation after a noindex republish, font census naming unloaded faces.
- Next: I-dashboard.

## Rollout I-dashboard — dashboard written, run complete (2026-09-28)

- `dashboard.mjs` → `stardust/rollout/dashboard/index.html` + `data.json` (self-contained, brand tokens from the migrated page): 1 page, cumulative identified 1 · prototyped 1 · deployed 1 · optimised 0 (the open P2 JSON-LD finding keeps `index` short of `optimised`, by the dashboard's own definition). `stardust/` is in `.hlxignore`, so the dashboard is not served from the site.
- The replica run is complete: the one page in scope is live at `/` on the preview and live origins, gated on the published origin, links audited, quality scored, report and learnings written. Owner items in `stardust/rollout/report.md § Follow-ups`.
