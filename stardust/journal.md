# Journal — replica migration of https://www.example.com/

## Extract — one page captured live, brand surface is five CSS rules (2026-09-23)

- Scope: 1 of 1 discovered pages (`/`, slug `index`), per `stardust/.labs/site-plan.json`. Ran `crawl.mjs --pages https://www.example.com/ --dynamics` and `style-census.mjs` at 1440 and 360.
- Provenance: 1/1 live (playwright, medium wait 2500 ms, HTTP 200). Vision check: ok. The crawler's `spaShellSuspect` flag is a false positive on a genuinely minimal page.
- Brand surface: background #eeeeee, text #000000 under an 80% opacity wrapper, link #334488; `system-ui, sans-serif` at 16 px / 24 px bold. No logo, favicon, imagery, fonts, motifs, chrome or scripts. The page's whole stylesheet is inline and recorded in `DESIGN.json.extensions.sourceCss`.
- Dynamic surface: none (0 endpoints, 0 forms, 0 third-party hosts, not hydrated).
- Page type: `static`. Module candidates: none (single page, no repeats). Capture gaps: none.
- Wrote `current/PRODUCT.md`, `DESIGN.md`, `DESIGN.json`, `brand-review.html`, `_brand-extraction.json`, `state.json` (flow replica, handsOff true).

## Preserve direction — verbatim promotion, empty register, no dynamics (2026-09-23)

- Promoted `current/PRODUCT.md`, `DESIGN.md`, `DESIGN.json` byte-identical to the project root (verified with `cmp`). `.hlxignore` excludes `*.md`, so the Markdown is not served.
- Wrote `stardust/direction.md` (PRESERVE mode, hands-off activation, named assumptions: breakpoints 1440/360, scope = 1 page, flow replica).
- Register: `stardust/replica/inconsistency-register.md` is empty — pure replica. No audit was run (hands-off policy: adopt none).
- Dynamics: `dynamics-detect.mjs` on `/` found 0 features; `dynamics-plan.mjs` drafted 0 rows. `stardust/dynamic-features.md` and `-plan.md` record "none". Page `index` advanced to `directed`.

## Recreate — one archetype authored from captured content and lifted CSS (2026-09-23)

- `stardust/prototypes/index-proposed.html` + `css/canon.css` (shared tokens: #eeeeee ground, #334488 links, system-ui, 60vw column, 15vh margins, 0.8 wrapper opacity, 1.5em h1) + `css/index.css` (archetype layer). Every value is lifted from the source's five inline rules; every string is verbatim from `current/pages/index.json`.
- No fonts to harvest (system stack), no media, no chrome, no dynamics. Content root on both sides: `body > div`.
- Served from `stardust/prototypes` on port 8791 (probed free before starting).

## Source-fidelity gate — index passes at 1440 and 360 on the first round (2026-09-23)

- iter1 `--full` at both widths: pixel 0.00% (threshold 10%), height Δ 0 px, overflow assert ok (scrollWidth = viewport), content-diff none, visual-diff 0 flags.
- chrome-parity's default header/footer regions matched nothing on either side (the source has no chrome); recorded as justified. A `--no-defaults --region content="body > div"` run paired 3/3 texts at both widths (✓).
- Interaction parity: motion-observe on live found 0 animations, 0 transitions, 0 class mutations; the `a` hover is dead on live, so nothing was implemented. motion-compare: 0 missing, 0 extra.
- iter2 pixel confirmation after the motion pass: 0.00% at both widths. Residuals: none. `index` advanced prototyped → approved (approvedBy hands-off). `stardust/replica/progress.json` records the unit.

## Migrate plan — one cluster, the archetype alone (2026-09-23)

- Scope check: `stardust/.labs/site-plan.json` selects one page (`index`); `state.json` holds that page at `approved` with its gated prototype. No siblings exist, so no variance probe and no clone step.
- Plan recorded in `stardust/migrate/progress.json`: one `render` unit (`index`, archetype tier, branch A from the prototype), no `assets` unit (the capture has no media, fonts or logo), then `report`.
- Phase 5 script copies made: `stardust/scripts/deploy/` and `stardust/scripts/rollout/` beside the replica, diff and dynamics copies.

## Migrate render — the archetype placed, two prototype adjustments proven render-neutral (2026-09-23)

- The driver refused the prototype once (strict 2: no `<main>`); the content wrapper became `<main class="content">` and empty `<header></header>` / `<footer></footer>` wrappers were added so delivery-lint's wrapper rule passes. Both changes were re-gated: pixel rounds iter3 and iter4 at 1440 and 360 read 0.00%, height Δ 0, overflow ok.
- canon.css comments carried `{ … }` fragments that truncated the driver's inline `:root` copy; the comments were reworded (no rendering change) and the page re-rendered with `--force`.
- `stardust/migrated/index.html` + `_meta.json`: archetype tier, 2 CSS assets bundled, 0 links to localize, 0 deviations; `modules[]` empty by decision (default content only). Content-count against the captured page: 3/3 nodes paired, findings none.
- Sidecar gates: content-fidelity, pixel-gate-1440, pixel-gate-360, content-count, delivery-lint (0 P0 · 0 P1 · 1 P2 — no metadata block yet; the content document adds it). media-reconcile n/a: the page has no images.

## Migrate state-and-report — one page migrated (2026-09-23)

- `index` advanced approved → migrated (`migratedPath: stardust/migrated/index.html`). Summary: 1 archetype, 0 siblings, 0 thin, 0 refused. All three migrate units are `done` in `stardust/migrate/progress.json`; rollout follows.

## A-inventory — one page, one template, no blocks (2026-09-23)

- `inventory.mjs` read the one migrated page: template `index` (representative `index`), path `/`, status pending. Blocks: none — the sidecar's `modules[]` is empty by decision (default content only), so Phase B has nothing to dedup.
- `rollout.json` site fields filled: DA org `of1-labs`, site `stardust-replica-0c7311e9`, ref `main`, live host `www.example.com`.

## B-block — nothing to dedup, plan is the one page (2026-09-23)

- `blocks.mjs`: 0 distinct blocks (0 module, 0 chrome/fragment). `plan.mjs`: delivery order `index` alone, nothing to convert, nothing to reuse. The delivered page will be default content (heading, paragraph, link paragraph) under an empty header and footer, with the site foundation carrying the source's five CSS rules.

## B2-dynamic — dynamic surface re-verified: still none (2026-09-23)

- Fresh `dynamics-detect.mjs` probe of the live page: 0 third-party hosts, 0 first-party APIs, 0 forms, 0 triggers, 0 media, not client-rendered → 0 findings. `dynamics-plan.mjs` against the preview origin: 0 rows, 0 host-bound. `stardust/dynamic-features.md` stamped re-verified; nothing blocks Phase C.

## C-deliver — foundation, one cluster and final, all recorded done (2026-09-23)

- **Foundation (C0)**: one subagent authored and deployed the shell — `styles/styles.css` + `fonts.css` from the source's five inline rules, zero-height header/footer blocks (the live page has no chrome), `content/index.html`, the runtime contract — PUT 201 → preview 200 → live 200. Published-origin gate on the shell: 1440 0.00% hΔ0, 360 0.00% hΔ0, overflow = viewport, content-diff 1 finding 0 structural (pipeline-added `<a title>`), visual-diff 0 flags, chrome parity content region 3/3. Frozen (16 files) and committed.
- **Cluster index (C1)**: the cluster's only page IS the foundation shell page, already delivered by C0, so the unit re-verified the chain instead of re-running it — page 200, `.plain.html` 3 nodes verbatim, delivery-lint 0P0·0P1·0P2, localize-links CHECK PASS, gate-evidence 1440=0.00%/Δ0 360=0.00%/Δ0, freeze unchanged — and recorded coverage `index → deployed`. Gates inherited from the pub1 rounds (same page, same origin).
- **Final (C-final)**: freeze check unchanged; no foundation-requests queued, nothing applied; preview 200. Unit ledger: 3/3 done.
- Next: D-site (site-wide assembly), D2-dynamic (0 features → trivially empty), E-full-site verify, E2-link-audit, F–I.

## D-site — one-url sitemap, served set equals the assembled set (2026-09-23)

- `assemble.mjs --verify-origin` on the live origin: sitemap.xml 1 url, robots.txt written, fragments 0; served sitemap 1 url = assembled 1, extra 0, missing 0 → exit 0.
- Root: the source root serves a page (200, no Location chain), so `index` is delivered as the root document and no redirects sheet exists (`stardust/redirects.tsv` absent, nothing to wire). Preview `/` 200, live `/` 200.
- Chrome: the source has no header or footer; the header/footer blocks stay empty without `/nav` / `/footer` documents, none were published, and the served sitemap carries no chrome paths — nothing to mark noindex.

## D2-dynamic — empty parity, nothing to replay (2026-09-23)

- `stardust/dynamics/parity.json` written with 0 features (method line names the detect + re-verify evidence). `dynamics-check.mjs --origin <live>`: 0/0 checks pass, exit 0 → `stardust/qa/dynamics-report.md`. No `/query-index.json` is needed: there are no listings. No coverage rows added: no page was built here.

## E-full-site — one page verified on the live origin (2026-09-23)

- `verify.mjs --all --base <live>`: checked 1 · 1 verified · 0 failed (reachable 200, no `about:error`, internal hrefs none). Coverage row `index` → verified.
- Headless render check on the one template (`measure.mjs` on the live `/`, 1440 and 360): h1, both paragraphs and the outbound link visible with text; scrollWidth = viewport at both widths.

## E2-link-audit — one external href, resolves; nothing to repoint (2026-09-23)

- Delivered page and live `.plain.html` carry exactly one href, `https://iana.org/domains/example`, the same string the capture recorded — external, kept verbatim (the register is empty; no repoint needed). GET follows 301 → 301 → 200.
- `localize-links.mjs --check`: 0 source-host links remain. No internal hrefs, no `/nav` or `/footer` targets, `state.json` `site.captureGaps` empty → no capture-gap or scope-extension decision to record in `direction.md`.

## F-optimize — health 100, no open findings, one source-parity note (2026-09-23)

- `optimize.mjs --all --base <live>` run-1: 1 page + site checks, health 100/100 (ai 100; a11y/seo/xpage null = nothing detected), open P1 0 · P2 0 · P3 0 → ✓ GATE.
- Source parity 1 (informational, not scored): `ai-search/jsonld` on index — no JSON-LD, and the source has none either. The register is empty, so it stays as-is: adding structured data would be an unregistered improvement.

## G-aem — no fixable findings, no project edits (2026-09-23)

- `autofix-aem.mjs --project . --dry-run` and the apply run: candidates 0 · applied 0 · manual 0 · skipped 0 · failed 0. No EDS file changed (foundation-freeze check: unchanged, 16 files), so no re-deploy and no re-run of verify/optimize.

## H-report — one page, one template, no blocks, health 100 (2026-09-23)

- `stardust/rollout/report.md`: pages 1 total · 1 verified; templates 1 (index 1/1); blocks 0; quality 100/100, open 0/0/0; to deliver none; content-pending 0; dynamic parity table empty (0 features). Delivery ledger row for `/` (PUT 201 / preview 200 / live 200 / gate 0.00% both widths / verify ok).
- `stardust/learnings.md` written with three pending entries: the migrate driver's `<main>` refusal of a gated prototype, comment braces truncating the inline `:root` copy, and coverage left `pending` after the foundation unit delivered the shell page.

## I-dashboard — one page, stage optimised (2026-09-23)

- `dashboard.mjs` → `stardust/rollout/dashboard/index.html` + `data.json` (self-contained, no script). First run: identified 1 · prototyped 1 · deployed 1 · optimised 0 — the source-parity JSON-LD finding counted as open. Resolved `f-54be5a397f` as `accepted` (source has no JSON-LD; register empty), re-ran: optimised 1/1, openFindings 0. Learning recorded.

## Handoff — Phase 5 complete: one page live, verified and optimised (2026-09-23)

- migrate (plan → render → report), deploy (PUT 201 / preview 200 / live 200) and rollout A → I all ended. Published-origin gate 1440 0.00% / 360 0.00%, hΔ 0; verify 1/1; health 100; sitemap served 1 = assembled 1; 1 external link resolves; dynamic surface empty; blocks 0 (default content only). `state.json`: index `migrated` (the terminal pipeline status). Learnings: 4 pending entries.
