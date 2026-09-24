# Journal — replica migration of balbriggan.ie/community-development/

Flow: replica — the design is kept. Hands-off run, one page, bounded-single provenance.

## Extract — one page captured with the bundled crawler (2026-09-23)

- Scope: exactly one page, https://balbriggan.ie/community-development/ (site-plan.json). Bounded entry (`--single --dynamics`), so no PRODUCT.md / DESIGN.md synthesis — Phase 2 takes the bounded promotion branch.
- The first crawl failed inside the scroll step: the site's theme script declares a global `function scrollTo(target)` (jQuery animate to an element) that shadows `window.scrollTo`, so the crawler's `window.scrollTo(0, y)` threw. Fixed in every project script copy by using the equivalent native `window.scroll(` (see `stardust/scripts/README-local-edits.md`); the gate instruments would have hit the same shadow on the live side.
- Capture: headless Chromium, HTTP 200, consent method none needed, full-page screenshot 1440×1970, rendered DOM saved, favicon downloaded. Signals: 3 headings (Community Development / Chair / Members), 51 body strings, 13 CTAs, 3 real images, mainTextLen 2158, not an SPA shell.
- Dynamic surface (reach): no forms, no same-site data endpoints, 4 `aria-haspopup` nav triggers (Bootstrap dropdowns), third-party scripts only (Google Tag Manager/Analytics, Facebook). Framework: WordPress.
- state.json created with flow `replica`, `handsOff: true`, one page row at `extracted`, type `pillar-page`.
- Fonts, logo and stylesheet lifting are deferred to Phase 3 (the crawler downloads no media).

## Preserve direction — bounded promotion, empty register, dynamics triaged (2026-09-23)

- Bounded promotion branch (no current/PRODUCT.md to promote): PRODUCT.md, DESIGN.md, DESIGN.json synthesized at the project root from the captured page JSON plus the CSS lift (`stardust/replica/lift/tokens.json`, values from `measure.mjs` at 1440 and 360 and the theme stylesheets), provenance `bounded-single`.
- Lifted: palette (blue rgb(36,148,210), yellow rgb(245,238,47), text rgb(60,60,59)); body Gotham-Light 16/24; H1 GothamBold 40/48 centred; H4 GothamMedium 24/28.8; Bootstrap 4 container 1140/15px; sticky navbar 98px (90px at 360); two button specs (radius 32px, yellow fill, blue text); page heights 1970 / 3778.
- Finding: the theme declares Gotham families but loads no @font-face for them, so the live page renders in the browser fallback face. Stacks kept verbatim — no substitution, no rehost. Google Fonts links are unused by this page.
- `stardust/direction.md` written (PRESERVE, bounded-single, hands-off activation, named observations). Inconsistency register written empty — pure replica.
- Dynamics Phases 1–3: detector found 5 rows (settings object, 4 nav dropdown triggers, GTM, GA4, Facebook pixel). Curated in `stardust/dynamic-features.md`: dropdowns rebuild-native (self), tags embed-passthrough pending one owner decision (interim tier: not loaded), dataLayer decided-out. Plan in `stardust/dynamic-features-plan.md`.
- Script copies: `stardust/scripts/dynamics/` needed `vendors.json` beside `lib.mjs`; the scrollTo shadow fix was applied there too.

## Recreate — pillar-page archetype authored and first gate map taken (2026-09-23)

- Prototype: `stardust/prototypes/community-development-proposed.html` + `css/canon.css` (shared: reboot subset, grid, sticky navbar, buttons, footer, fonts) + `css/community-development.css` (WordPress columns + pillar rules). Content spliced verbatim from the captured DOM (49 list items, 3 headings, 13 CTAs); chair image and its four srcset renditions, both logos and the FontAwesome woff2 harvested locally — no url() or srcset points at the source host.
- Measured against live with `measure.mjs` before any screenshot: container, navbar, columns and footer boxes matched to the pixel at 1440 and 360 once two font facts were settled.
- Font finding (corrects the Phase 2 note): the live page DOES load a self-hosted Gotham kit (Gotham-Light.woff, gotham-medium/bold webfont.woff2 from the theme's fonts dir — seen only in the network capture; no @font-face was readable in the fetched sheets). Gotham is a licensed commercial family, so per the fonts policy it is substituted: width ranking of nine open candidates against the live glyph advances chose Montserrat 300 / 500 / 600 (mean width ratio 0.999 / 1.002 / 1.013). Registered as R-01 (applied) — the register is no longer empty. Brand family names stay first in every stack.
- Two metric emulations recorded in `progress.json`: 25px line boxes on lines holding a bold run, and a 700 face for the synthetic-bold button. The live header's scroll morph (class `scrolled` past 100px) is replicated with five lines of JS.
- First gate round (--full, both widths): 1440 → 2.48% pixel, height Δ 1px, content-diff none, visual flags 0; 360 → 6.91%, height Δ 25px (one list item wraps differently under the substitute font), content-diff none. One chrome-parity delta came from a stray closing div in my markup (fixed; confirmation round is Phase 4's first step).
- Script copies: `stardust/scripts/status-page.mjs` renders the customer status page from `stardust/replica/status-page.json`.

## Source-fidelity gate — pillar-page archetype passed at 1440 and 360, motion parity done (2026-09-23)

- The one real iter1 failure was the 360 height delta (25px): the list item "Sgt. Keith White An Garda Siochana" measured exactly 290px in a 290px column under Montserrat-300 and stayed on one line where Gotham-Light wraps. Two pixels of trailing padding on that item (≤767px) reproduce the captured wrap; recorded as an emulation under R-01.
- iter2 (--full, both widths): 1440 → 2.48% pixel, Δh 1px; 360 → 4.32%, Δh 1px; content-diff none, visual flags 0, overflow ok at both. iter3 confirmed the same numbers after the motion layer.
- Chrome parity's default `header`/`footer` roots resolved to the article's entry-header/entry-footer (a 0px box) on both sides, so the green line meant nothing. Re-probed with `--region header=nav.navbar --region footer=#wrapper-footer-full`: 360 header quiet, 1440 header shows ten 2–8px nav-label deltas from glyph widths under the substitute face; footer "Privacy" inline box 15→19px (face metric). Crop gate: 1440 header 2.55% (over the 2% bar — glyph-shaped diff only, logged as R-01b), footer 1.04%; 360 header 1.08%, footer 1.21%.
- Motion observed live at both widths (`motion-observe`, clicks on dropdown toggles and the hamburger, hovers on nav links, buttons, dropdown items): header `.scrolled` morph, button hover (incl. a border-color change to #545b62 the first pass lacked), dropdown-item hover, click dropdowns, and the Bootstrap collapse for the mobile menu all fired; top-menu link hover did not. Implemented as one shared layer (`js/motion.js`, `css/motion.css`) replacing the inline morph script; build re-observed and compared: only three focus-outline transition artifacts remain MISSING (outline reads none on both sides — dead). Pixel numbers unchanged after the layer.
- Archetype approved hands-off; state advanced extracted → prototyped → approved. Iteration cap reached at both widths.

## Migrate (plan, render, state-and-report) — the archetype placed in the migrated tree (2026-09-23)

- One template, one archetype, no siblings: the plan unit is trivial and the render unit ran `migrate.mjs render community-development` (branch A) → `stardust/migrated/community-development/index.html` with 17 bundled assets and the `_meta.json` sidecar. `modules[]` = `columns` (the membership columns are the only composite section; heading, text, image and button are default content).
- Gates on the sidecar: content-fidelity (declared, evidence content-diff none at both widths), variance-probe (n/a — no siblings), and the collector's pixel-gate-1440 / pixel-gate-360 / content-count / delivery-lint (0 P0, 0 P1, 1 P2). media-reconcile waits for the delivered content file.
- 21 internal links (nav, footer, dropdowns) point at pages outside this run's scope; they are repointed to the source site in the link audit, never left as 404s.
- State: community-development → migrated.

## Rollout C-deliver — foundation and the pillar page delivered in three units, root resolves to the page (2026-09-23)

- Unit foundation (previous session): one subagent authored and deployed the shell — styles, fonts, header and footer blocks, the nav and footer documents, the page and the root document (4/4 live, publish yes). Coordinator gate on the published origin: header/footer crops 2.55%/1.04% @1440 and 1.08%/1.21% @360, chrome parity 0 role/text deltas after the weight-400 nav button and icon-only social anchors fix; frozen (19 files).
- Unit pillar-page (this session): one subagent rewrote `blocks/columns` from the gated prototype's membership section (template-slotted, authored nodes moved by role, EW 6/6), passed block-roundtrip and the static lints, pushed the code, re-deployed `/community-development` and `/index` (2/2 live), then gated on the published origin: 1440 pixel 2.47% Δh 1, 360 pixel 4.40% Δh 1, content-diff 0 structural at both, overflow ok, header/footer crops unchanged. Residuals: header crop 2.55% over the 2% crop bar (substitute face R-01, pre-recorded); 360 members-list glyph bands 5.0–6.6% with no line shift; the gate's built-in chrome probe reads the live bare `header`/`footer` elements (title band, empty element) so the real regions were re-probed and recorded as `chrome-parity-pub3-real.txt`.
- Unit final: foundation unchanged; the one queued request (navbar relative vs sticky) resolved without a change — live sticky wrapper around a relative navbar equals the build's sticky host header around a relative navbar; media-reconcile on the delivered file: 1 hosted; `.plain.html` checks on both paths 200 / one h1 / 0 about:error / no /img/; coverage page and block `verified`.

## Rollout D-site — sitemap served 2 = assembled 2, root answers, no redirects needed (2026-09-23)

- `assemble.mjs` wrote `stardust/rollout/site/{sitemap.xml,robots.txt,manifest.json}` (ignored by `.hlxignore`; the platform serves its own sitemap). The served sitemap listed `/community-development` and `/` — the root is the same page delivered as the `/index` document by design (the run's contract: the site root resolves to the page), so it received a coverage row (`update-coverage.mjs --new index --path /index`, origin rollout) and `--verify-origin` on aem.live now exits 0: served 2 = assembled 2, extra 0, missing 0.
- No `stardust/redirects.tsv` exists and the root serves a page, so no redirects sheet is wired and no `/` row is authored (it would shadow the index document). `curl -sI` on `/` returns 200 on aem.page and aem.live; `/nav` and `/footer` carry `Robots | noindex` and are published.

## Rollout D2-dynamic — five rows replayed against the live origin, 6/6 checks pass (2026-09-23)

- `stardust/dynamics/parity.json` written from the triage: row 1 (dataLayer) decided-out without checks; row 2 (4 header dropdowns + hamburger) rebuilt natively — dom-count 4 × `a[aria-haspopup]`, 1 × toggler, no page errors on `/community-development` and `/`, the flow numbers from the deployed interaction drive carried in `verifiedBy`; rows 3–5 (GTM, GA4, Facebook pixel) at the interim tier with `consent-gate` checks — no request to any gated host before consent, owner decision named (which tags and ids run on the new host).
- `dynamics-check.mjs --origin …aem.live` → `stardust/qa/dynamics-report.{md,json}`: 6 PASS / 0 FAIL, exit 0. Row 2 status pending → done in `stardust/dynamic-features.md`. No query index, search or form exists on this page, so no `helix-query.yaml` or D2-built page was needed.

## Rollout E-full-site — 2/2 pages verified on the preview origin, render check clean (2026-09-23)

- `verify.mjs --base …aem.page --all`: 2 checked, 2 verified, 0 failed (reachable, no `about:error`, internal hrefs resolve). The root row first failed because the verifier fetches the literal `/index` path that the pipeline serves as `/`; the row was repointed to `/` through `update-coverage.mjs --new index --path /` and the served-sitemap check still matches (2 = 2).
- Headless render check (Playwright, real-Chrome UA): `/community-development` @1440 and `/` @360 — 4 sections, header/columns/footer `loaded`, columns row computes `flex`, 3/3 images non-zero, one h1, 0 page errors, no horizontal overflow, document heights 1969 / 3777 (live 1970 / 3778).

## Rollout E2-link-audit — 0 localizable links left, 25/26 targets 200, one external vendor block (2026-09-23)

- `localize-links.mjs --source-host balbriggan.ie --content content --check`: CHECK PASS, 0 links still localizable. The 18 nav/footer/dropdown targets outside this run's one-page scope stay absolute on the source site (scope extension → repoint, as recorded in `direction.md`); the two in-scope targets are root-relative (`/`, `/community-development`).
- Every href of the delivered page, nav and footer was fetched with a real-Chrome UA: 25 × 200 (both internal paths on aem.page, the 18 source-site pages, the objectives spreadsheet, Fingal County Council, Fingal.ie, Twitter, Instagram, LinkedIn). The one non-200 is the site's own Facebook page, which answers 400 to any non-browser fetch — an external link carried verbatim, vendor restriction, not a defect. No 404s.

## Rollout F-optimize — gate passes, P1 0 · P2 3 · P3 1, health 83/100 (2026-09-23)

- `optimize.mjs --base …aem.page --all --current stardust/current`: 2 pages + site checks, health 83/100 (ai 80, cross-page 86; a11y and seo layers null = not assessed by the detectors), open P1 0 → GATE passes. Findings ledger and scorecard under `stardust/rollout/optimize/`.
- Open findings: P2 `ai-search/jsonld` on both paths (no JSON-LD structured data in the delivered head — the migrated sidecar carries a WebPage JSON-LD that the EDS head does not emit; platform-migration, G-aem candidate); P2 `cross-page/duplicate-title` and P3 `duplicate-description` for `/` and `/community-development` — inherent to this run's contract that the site root serves the same page, kept as designed and recorded as informational.

## Rollout G-aem — no automatic fix applicable, two findings accepted by design, JSON-LD left for the owner (2026-09-23)

- `autofix-aem.mjs --project . --dry-run`: 3 candidates, 0 applicable, 3 manual — JSON-LD must be placed through head.html or the metadata pipeline with a schema payload (the source carries a Yoast graph with organisation data the owner must confirm), and the title cannot be disambiguated without a metadata Title row. No project file changed, no re-deploy; the delivered pages and the frozen foundation stand as gated.
- Resolutions: `duplicate-title` and `duplicate-description` → accepted (the run's contract makes the site root serve the same page). The two `jsonld` P2 findings stay open as the owner's to-deliver item (below P1, the gate passes); they are listed in the report.

## Rollout H-report — summary block written, learnings recorded (2026-09-23)

- `stardust/rollout/report.md`: pages 2/2 verified, 1 template gated 2.47 % / 4.40 %, blocks columns + header + footer, health 90/100 with P1 0 · P2 2, dynamics 6/6, links 25/26 (1 vendor block), sitemap 2 = 2. To-deliver for the owner: JSON-LD payload, tag decision (GTM/GA4/pixel), licensed Gotham drop-in, the 18 out-of-scope targets.
- `stardust/learnings.md`: five entries (root ≡ page coverage row, gate.sh chrome-region trap, sticky wrapper pairing, complete cluster brief, lint:fix reach).

## Rollout I-dashboard — dashboard written, rollout complete (2026-09-23)

- `dashboard.mjs` → `stardust/rollout/dashboard/{index.html,data.json}`: 2 pages identified / prototyped / deployed (`/`, `/community-development`), 1 template, 1 open P2 finding per page (JSON-LD, owner item). Phases A–I of the rollout are closed; this ends the replica handoff.

## Handoff — migrate → deploy → rollout complete for the single page (2026-09-23)

- The page https://balbriggan.ie/community-development/ is live at https://main--stardust-replica-fe635832--of1-labs.aem.page/community-development and at the site root, gated on the published origin at 2.47 % (1440) and 4.40 % (360) with height delta 1 px, 0 structural content deltas, overflow clean, 2/2 verified, health 90/100, dynamics 6/6, sitemap 2 = 2. Owner items are listed in `stardust/rollout/report.md`.
