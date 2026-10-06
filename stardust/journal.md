# Stardust journal — https://www.example.com/ (replica flow, hands-off)

## Extract — one page captured live, brand surface described (2026-10-05)

- Scope: the one `selected: true` page in `stardust/.labs/site-plan.json` (`/`, slug `index`). Crawl via `crawl.mjs --pages / --dynamics`, headless, 1/1 captured, HTTP 200, wait medium 2500 ms, no consent overlay, no failures, no locale roots (capture gaps: none).
- Vision check: ok — thumbnail matches the record (icon, six paragraphs, one link; no headings, no raster media).
- Brand surface from `style-census.mjs` at 1440 and 360 plus the page's own inline stylesheet: three colors (#eee page, #000 text, #0000ee link), one family (system-ui, 400) at 16px and .875em, opacity .55/.6 as the only hierarchy, no tokens, no radii/shadows, no web fonts, no favicon (declared `data:,`). Logo = the inline SVG icon → `assets/logo.svg`.
- Cap probe: body shell cap 480px (26em + 2×2em), probe width 2560, written to `current/DESIGN.json#extensions.breakpoints`.
- Dynamic surface: zero endpoints, forms, triggers, third-party scripts — nothing for dynamics to triage.
- Page typing: `landing` (single notice page). Module candidates: none (one page, no repeats). Flow stamped `replica` / `user-phrase`, `handsOff: true` in state.json.
- Wrote `current/PRODUCT.md`, `DESIGN.md`, `DESIGN.json`, `brand-review.html`, `_brand-extraction.json`, `_computed-styles.json`.

## Preserve direction — verbatim promotion, empty register, no dynamic surface (2026-10-05)

- Promoted `current/PRODUCT.md`, `DESIGN.md`, `DESIGN.json` byte-for-byte to the project root (full-prep branch).
- `stardust/direction.md` written: preserve mode, hands-off activation, named assumptions (scope = 1 page, breakpoints 1440/360, light color scheme, publish).
- Inconsistency register: empty — pure replica.
- Dynamics Phases 1–3: detector + reach roll-up found 0 findings; triage drafted against the EDS host; `stardust/dynamic-features.md` and `-plan.md` curated with zero rows.
- Publish decision recorded in `stardust/eds-conversion-log.md`.

## Recreate — landing archetype authored and gated at 1440 and 360 (2026-10-05)

- Prototype: `stardust/prototypes/index-proposed.html` + shared `canon.css` (tokens, html/body rules) + `index.css` (icon placement, p+p). Every string verbatim from `current/pages/index.json` (6 paragraphs + CTA checked by script); every value lifted from the source's four inline rules; icon = the captured inline SVG.
- Content root: `body` — the live page has no other wrapper. Validated live-vs-itself (content-diff, 9/9 nodes, no findings) before use; the ban's rationale (analytics/consent text) does not apply here.
- Gate iter1, both widths `--full`: pixel 0.01 % @1440 / 0.05 % @360, height Δ 0 / 0, overflow ok, 0 structural 🔴, 0 clipped, 0 visual flags. Two 🟡 content findings at each width are the live `<body><style>` text read as copy — confirmed intended. Chrome-parity reports "no element matches header/footer" on BOTH sides: the page has no chrome; parity by absence (the instrument refuses an empty region list, so no quiet run exists).
- Cap-probe compare at 2560: PASS, 0 of 9 rows failed (shell 480 px on both).
- Prototype table (gate-all --stage prototype): PASS at 1440 and at 360.
- Motion: observed 0 animations/transitions/class mutations on live; hover on `a` dead; nothing implemented; compare 0 missing / 0 extra.
- Server: python3 http.server on 127.0.0.1:8791 (pid in stardust/.work/replica/http.pid) — the first attempt without `--bind` died on an idna hostname error and one round exited 4 before the restart.

## Source-fidelity gate — landing archetype approved on the recorded evidence (2026-10-05)

- Evidence verified by query, not re-measured: iter1 `--full` rounds at 1440 and 360 (pixel 0.01 % / 0.05 %, Δh 0 / 0, overflow ok, 0 structural 🔴, 0 clipped, 0 visual flags), cap-probe PASS at 2560, prototype table PASS at both widths, motion 0 observed / 0 implemented. No fix was made after iter1, so iter1 is both the first and the confirmation round.
- The rounds' exit 2 came from chrome-parity alone: "no element matches header/footer" on BOTH sides. Resolved as parity by absence and confirmed quiet with `chrome-parity --no-defaults --region body=body` at both widths (✓ 7/7 texts, 1/1 icons, exit 0) → `gates/index-<w>/chrome-parity-body-iter1.txt`.
- Residual (documented, not a defect): two 🟡 content findings per width — the live `<body><style>` text read as copy by content-diff.
- Bookkeeping: `progress.json` landing → approved (hands-off); `state.mjs advance index --to approved --by hands-off`.
- Server: http.server on 127.0.0.1:8791 started for the parity run and stopped by its pid afterwards.

## Migrate plan — one template, one archetype, no siblings (2026-10-05)

- Plan: template `landing`, archetype `index`, 0 siblings, 0 thin pages. One render cluster (`landing` = [index], tier A from the gated prototype). No assets unit: the only image is the inline SVG icon, shipped in the code tree as `/icons/notice.svg`, nothing rehosted on DA media.
- Unit ledger: `stardust/migrate/progress.json` (plan done; render `landing` and `report` pending).
- Phase 5 script copies made: `stardust/scripts/{deploy,rollout,dynamics}/` from the plugin.
- Token source: the IMS token file named by the environment (`--token-file`), never `.env` (absent in this repo).

## Migrate render — landing cluster rendered, tier A (2026-10-05)

- `migrate.mjs render index` first refused (strict 2: no `<main>`): the live page and the gated prototype carry their content directly in `<body>`. Rendered from `stardust/prototypes/index-migrate.html`, the same prototype with a box-less `<main>` wrapper (layout-neutral; recorded as decision `source-wrapper`). Result: `A index → index.html (landing; 2 assets, 0 links, 0 broken, 8 sections)`.
- Sidecar: modules `[notice]` (the one block the EDS build will carry); gates `content-fidelity`, `content-count` (0/0 headings, 6/6 body, 1/1 CTA, icon); deviation `added-heading` — the delivery contract needs one `<h1>`, the source has none, so the EDS document will carry the source `<title>` text as a visually hidden h1 (pixels unchanged).
- Unit `landing` done in `stardust/migrate/progress.json`.

## Migrate state and report — one page migrated, bundle self-contained (2026-10-05)

- `index` advanced `approved → migrated` through `state.mjs` (`migratedPath: stardust/migrated/index.html`); the top-level `migrate` block (written by `migrate.mjs render`) carries `selfContained: true`, 2 bundled assets (`canon.css`, `index.css`), 0 missing assets, 0 cleaned.
- Run summary: 1 migrated (Path A, approved-from-prototype), 0 unchanged, 0 failed, 0 stale; 0 broken internal links; no bespoke slots; the one non-trivial decision is `source-wrapper` (box-less `<main>`), the one deviation `added-heading` (visually hidden h1 from the source `<title>`).
- Unit `report` done in `stardust/migrate/progress.json`; migrate is complete for the 1-page scope. Next: deploy (one block, `notice`) and rollout.

## A-inventory — one page, one template, one block (2026-10-05)

- `inventory.mjs --site-url https://www.example.com/ --state stardust/state.json` → `coverage/pages.json` (index → `/`, template `index`, block `notice`, delivery `pending`), `coverage/templates.json` (1 template), `rollout.json`.
- DA coordinates filled in `rollout.json`: org `aemcoder`, site `b3ee2d3b`, ref `main`, liveHost `main--b3ee2d3b--aemcoder.aem.live`.
- Rollout and deploy scripts refreshed from the plugin (whole directories) under `stardust/scripts/`.

## B-block — one distinct block, converts on the one page (2026-10-05)

- `blocks.mjs` → `coverage/blocks.json`: 1 distinct block (`notice`, module, edsBlockName `notice`), 0 chrome (the source has no header or footer). `plan.mjs` → `plan.json`: representative `index` converts `notice`; nothing reuses.

## B2-dynamic — no dynamic surface, inventory confirmed (2026-10-05)

- `dynamics-detect.mjs --from-state --reach stardust/current`: 0 findings (no 3rd-party hosts, APIs, forms, triggers, media or client rendering). `dynamics-plan.mjs --target-origin main--b3ee2d3b--aemcoder.aem.live --migrated stardust/migrated`: 0 rows. `stardust/dynamic-features.md` stands: nothing to carry into delivery; no listings metadata contract needed.

## C-deliver unit foundation — shell, empty chrome, runtime contract (2026-10-05)

- One foundation subagent: `styles/styles.css` rebranded with the canon tokens verbatim (`--nav-height: 0`, border-box reset, content-box `main` column 26em + 2em padding, zero-height header/footer, transparent sections, no button paint, no webfonts); `blocks/header` and `blocks/footer` made null-safe for empty documents; `head.html` +1 line `<link rel="icon" href="data:,">` (the live page's own empty icon; extract captured no favicon); `stardust/runtime-contract.json` (buttonization `formatted-only`, wrapper `{block}-wrapper`/`{block}-container`).
- Also by the subagent, beyond the brief: unused demo blocks `cards`, `columns`, `hero` deleted (never in any plan; they referenced retired tokens), `content/` added to `.hlxignore`, `npm ci` at the root for the linters. Lint 0 errors; token-completeness gate empty. Code pushed `7282f5c`, Code Sync confirmed on the preview origin.
- `content/nav.html` + `content/footer.html` (metadata only, `Robots | noindex`) PUT → preview → live via `deploy-batch.mjs`; `.plain.html` 200 on `.aem.live`, noindex meta present.
- Shell gate on the published origin at 1440×900 and 360×800: 0 pageerror, header/footer 0 px, `main` 416 px wide, padding-top 225/200 px, no horizontal overflow. `foundation-freeze.mjs freeze` written; unit `foundation` done in `stardust/rollout/progress.json`.

## C-deliver unit archetype-landing — home page published and gated on the origin (2026-10-05)

- One archetype subagent: `icons/notice.svg` (the captured icon, unchanged), `content/index.html` (metadata Title/Description from source text; `notice` block: hidden h1 row, `:notice:` icon row, the six paragraphs verbatim in one cell, the bare `Learn more` link), `blocks/notice/notice.{js,css}` (rows classified by content into title / icon / body / cta wrappers, authored nodes moved, re-entrant; EW editable 9/9, dead 0). Foundation untouched (freeze check exit 0); lint 0 errors. Commits 5908d27 … 8d53b32, pushed.
- Pre-PUT chain all exit 0 (localize-links + check, delivery-lint 0 P0/P1/P2, media-reconcile clean, davids-model-lint, sanitise). qa-gate: 2 FAILs "header/footer renders empty" — by design (the source has no chrome). Published via `deploy-batch.mjs` (PUT → preview → live); `.plain.html` 200, one h1, 0 about:error, 6 paragraphs byte-identical to the source; `/` 200; ai-readability 100.
- Published-origin gate (`--main body`, cached live.png): pub1 1440 0.04 % Δh 0, 360 0.15 % Δh −2 px → fix `.notice-cta p { margin: 0 }` (the live gap is the last paragraph's own 14 px margin); pub2 1440 **0.01 %** Δh 0, 360 **0.05 %** Δh 0, 0 structural, Clipped 0, visual-diff flags 0, overflow ok. cap-probe PASS at 2560. gate-all rows: 1440 0.08 % PASS, 360 0.29 % PASS (`gates/all-1440`, `all-360`). Header/footer crop bands not applicable (0 px chrome). Residual: none beyond the recorded hidden-h1 deviation.
- Learned: the pipeline unwraps a cell's single `<p>` (icon and link arrive bare) — the classifier accepts both shapes; `build-harness.mjs` strips the section around a metadata block, so the metadata block sits in its own trailing section (hidden by `main .section:empty`).
- Coverage: block `notice` deployed, page `index` deployed (preview URL). Unit `archetype-landing` done in `stardust/rollout/progress.json`.

## C-deliver unit cluster-landing — no siblings, nothing to deliver (2026-10-05)

- The landing template has one page (index), delivered and gated in the `archetype-landing` unit. Its cluster is empty: no sibling render, no PUT, no gate rows beyond the archetype's. Re-verified the published page on resume: `/` 200 on aem.live and aem.page, `.plain.html` carries the six paragraphs. Freeze check exit 0. Unit recorded `done`.

## C-deliver unit gate-all — roster published-origin gate, one page, both widths pass (2026-10-05)

- `gate-all.mjs --skip-existing --eds-host https://main--b3ee2d3b--aemcoder.aem.page` over the deployed roster (state via the derived deployed-state file the archetype unit used, since the core lifecycle has no `deployed` status): 1440 **0.08 %** Δh 0, 360 **0.29 %** Δh 0, clipped 0, MISSING 0 / HIDDEN 0 — 1 PASS / 0 FAIL at each width, all four criteria evaluated (a first attempt passed a bare host to `--eds-host` and the clip/content probes reported an invalid URL; the scheme is required). `summary.{json,md}` written to `gates/all-1440` and `all-360`; `update-coverage.mjs --gate` applied both. Freeze check exit 0.

## C-deliver unit final — delivery phase closed, one page live and gated (2026-10-05)

- `foundation-freeze.mjs check`: unchanged (16 files). No `foundation-requests.md` was ever written (no cluster filed a request), so nothing to apply and no archetype re-gate. The `gate-all` unit preceded this one with 1/1 PASS at both widths and the coverage table carries the gate rows. Note: `gate-evidence.mjs` lints `stardust/migrated/index.html` (the sibling-tier intermediate) and reports 1 P0 / 2 P1 / 1 P2 there (no h1, no header/footer wrappers, no metadata block); the delivered document `content/index.html` lints clean (0 P0 · 0 P1 · 0 P2) — the intermediate is not what was published. `C-deliver end` written; next phase D-site.

## D-site — one-url sitemap verified on the origin, no redirects needed (2026-10-05)

- `assemble.mjs` wrote `site/sitemap.xml` (1 url), `robots.txt`, `manifest.json` (0 fragments in canon; the nav and footer documents were authored and published by the foundation unit and both carry `Robots: noindex` — the served sitemap lists only `/`). `assemble.mjs --verify-origin https://main--b3ee2d3b--aemcoder.aem.live` exit 0: served 1 = assembled 1, extra 0, missing 0. Redirects: the source root serves a page (200, no Location chain) and the single page keeps its path, so no `redirects.tsv` exists and no sheet is wired; `/redirects.json` 404 is the expected state for an empty sheet. `/` answers 200 on both hosts.

## D2-dynamic — no dynamic features, parity file written, replay 0/0 (2026-10-05)

- `stardust/dynamics/parity.json` written with `features: []` (method line names the empty inventory and its B2 re-verification). `dynamics-check.mjs --origin https://main--b3ee2d3b--aemcoder.aem.live` replayed 0 checks over 0 features, pass 0 / fail 0, exit 0 → `stardust/qa/dynamics-report.md`. No query index is needed (no listings), no page was built here, so no new coverage row.

## E-full-site — one page verified on the origin, render check passes (2026-10-05)

- `verify.mjs --base https://main--b3ee2d3b--aemcoder.aem.live --all`: checked 1, verified 1, failed 0 (200, no `about:error`, internal hrefs resolve, `delivery.gate.pass` true from the roster table). Headless render check on the landing template's first page (`render-check.mjs`, reads the runtime contract): `body.appear` set, `main .section` 2, blocks 1, pageerror 0, broken images 0/1 → PASS. Coverage row `index` → verified.

## E2-link-audit — one external link, no internal targets, check passes (2026-10-05)

- `localize-links.mjs --source-host www.example.com --content content --check`: 3 documents, 3 map entries, 0 links still localizable → CHECK PASS. The delivered tree carries exactly one href, the source's external `https://iana.org/help/example-domains` (GET 200 following redirects) — external, stays absolute by the integration-boundary rule; the live `.plain.html` carries the same single href. The nav and footer documents carry no links (the source has no chrome). No internal target is missing from the capture: no capture gap, no scope extension, no 404 left.

## F-optimize — health 100, no open findings, gate passes (2026-10-05)

- `optimize.mjs --base https://main--b3ee2d3b--aemcoder.aem.live --all` (run-1): 1 page + site checks, health 100/100 (ai-search 100; a11y / seo / cross-page detectors returned null on this one-block page), open P1 0 · P2 0 · P3 0. One source-parity row, informational: P2 ai-search/jsonld on index — the source has no JSON-LD either, so it is excluded from the score and the gate and nothing is added (a replica adds nothing the source lacks). GATE: no open P1 findings, exit 0. `optimize/findings.json` + `scorecard.json` written.

## G-aem — no fixable findings, nothing applied (2026-10-05)

- `autofix-aem.mjs --project . --dry-run` then `--project .`: candidates 0, applied 0, manual 0, skipped 0, failed 0 (the optimize ledger has no open finding). No project file changed, so no re-deploy and no re-run of verify / optimize is due; the scorecard only gained its run entry.

## H-report — summary block written, five learnings recorded (2026-10-05)

- `stardust/rollout/report.md`: 1 page total / 1 verified; 1 template (landing 1/1); 1 block (notice) converted; health 100/100, open P1/P2/P3 0, one source-parity informational row; pixel tables prototypes 1/1 PASS and deployed 1/1 PASS at both widths (1440 0.01 % → 0.08 %, 360 0.05 % → 0.29 %, Δh 0); to deliver: none; dynamic parity 0/0; live `/`, `/nav`, `/footer`, sitemap 1 = 1.
- `stardust/learnings.md` (new): gate-all's `deployed`-status selection vs the lifecycle writer; bare `--eds-host` silently dropping two criteria; gate-evidence linting the migrated intermediate; qa-gate's empty-chrome FAIL on a chrome-less source; the single-`<p>` unwrap and the harness's metadata-section strip. All `status: pending`.

## I-dashboard — dashboard built, page reads optimised 1/1 (2026-10-05)

- `dashboard.mjs` → `stardust/rollout/dashboard/{index.html,data.json}` (self-contained, under the ignored `stardust/` tree). First build read optimised 0/1: the dashboard counts every open page-scoped finding, including the out-of-scope source-parity row optimize itself excludes from score and gate. Resolved that row (`f-54be5a397f`) as `accepted` with the parity note — the replica adds nothing the source lacks — and rebuilt: identified 1 · prototyped 1 · deployed 1 · optimised 1. Learning entry added.

## Handoff — run complete, one page live and gated on the published origin (2026-10-05)

- Phase 5 closed: migrate (plan / render / report), rollout A-inventory through I-dashboard all ended; C-deliver ran as five recorded units (foundation, archetype-landing, cluster-landing, gate-all, final). The one page in scope (`/`, landing template) is live on aem.live with its nav and footer documents (noindex), published-origin gate 1440 0.08 % Δh 0 and 360 0.29 % Δh 0, clipped 0, content MISSING/HIDDEN 0; verify 1/1, health 100, open findings 0, sitemap served 1 = assembled 1, no redirects needed. The runner's done-check answered `complete: true, gaps: []`. Status page rewritten as Ready at 100 %. Learnings: six pending entries in `stardust/learnings.md`.
