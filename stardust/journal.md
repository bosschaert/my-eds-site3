# Journal — Example Domain replica migration

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## Extract — one page captured live, descriptive spec written (2026-09-28)

**Prompt:** Hands-off replica migration of https://www.example.com/ to Edge Delivery; scope fixed to the one selected page (/), breakpoints desktop (1440) and mobile (360).

**Decisions:**
- Flow stamped `replica`, `handsOff: true`; scripts copied from the plugin into `stardust/scripts/{replica,stardust,migrate,diff,extract}`.
- Crawl restricted with `--pages /` (never `--all`); `--dynamics` recorded an empty dynamic surface.
- Page typed `landing` (the site's only page, its home). No module candidates: a single page has no cross-page repeats.
- The source stylesheet is five inline rules; everything else is user-agent default. Recorded verbatim in `current/DESIGN.md` so Phase 3 lifts values, not guesses.
- The crawler's `spaShellSuspect` flag fired on substance heuristics (1 heading, 125 chars, no media); the rendered HTML confirms this IS the whole page, so the flag is noted, not acted on.

**Artifacts touched:**
- stardust/current/pages/index.json, index.html — created (crawl); `slots` added
- stardust/current/assets/screenshots/index.png, index-thumb.png — created
- stardust/current/_computed-styles.json — created (style census, 1440 + 360)
- stardust/current/PRODUCT.md, DESIGN.md, DESIGN.json, brand-review.html — created
- stardust/state.json — created (1 page, extracted)
- stardust/scripts/status-page.mjs, stardust/replica/status-model.json, tools/replica/progress.html — created / rewritten

**Findings worth flagging:**
- No favicon on the source (`href="data:,"`); deploy would ship the boilerplate icon unless suppressed — a fidelity note for Phase 5.
- Provenance 1/1 live (playwright, medium wait 2500 ms, HTTP 200). No locale roots, so no capture gaps.

**Open questions:** none

**Next:** Phase 2 preserve-direction — promote the three current-state files verbatim, empty inconsistency register, dynamics triage over an empty surface.

---

## Preserve direction — verbatim promotion, empty register, empty dynamic surface (2026-09-28)

**Prompt:** Phase 2 of the hands-off replica run: promote the captured spec, build the inconsistency register, triage the dynamic surface.

**Decisions:**
- Full-prep branch: `current/PRODUCT.md`, `DESIGN.md`, `DESIGN.json` copied byte-for-byte to the project root (verified with `cmp`). No bounded synthesis, no per-variant files.
- Register empty (no audit, no `--register`) → pure replica; the standard freeze template written verbatim.
- Dynamics detect + plan ran: 0 findings, 0 rows; curated files record the empty inventory so the Phase 2 gate ("every row has a disposition") is met explicitly.
- Hands-off activation and named assumptions recorded in `stardust/direction.md`.

**Artifacts touched:**
- PRODUCT.md, DESIGN.md, DESIGN.json — created (promoted)
- stardust/direction.md — created
- stardust/replica/inconsistency-register.md — created (empty)
- stardust/current/_dynamics.json, dynamic-features.generated.md; stardust/dynamics/dynamic-features.generated-plan.{md,json} — created (scripts)
- stardust/dynamic-features.md, stardust/dynamic-features-plan.md — created (curated)
- stardust/scripts/dynamics/ — copied from the plugin

**Findings worth flagging:**
- Nothing on the source is scripted; interaction parity in Phase 3 will be observed, not assumed, but expect the link hover/underline only.

**Open questions:** none

**Next:** Phase 3 recreate — one archetype (`index`, landing): lift the five source rules, author the standalone prototype, then gate at 1440 and 360.

---

## Recreate — index archetype authored from the lifted rules, 0.00% at both widths (2026-09-28)

**Prompt:** Phase 3 of the hands-off replica run: recreate the one archetype (index, landing) and take it through the gate at 1440 and 360.

**Decisions:**
- Lifted the source's five inline rules into `stardust/replica/tokens.json`; canon CSS (`replica-canon.css`) carries body/h1/link, the archetype file (`index.css`) the 80% opacity wrapper. No user-agent default was re-specified.
- Prototype uses `<main class="notice">` as the content root; both sides scoped with `--main "body > :first-child"` (the live root is a class-less div).
- Fonts: `system-ui, sans-serif` on both sides; nothing rehosted, nothing substituted.
- Gate round iter1 --full: pixel 0.00% / height Δ 0 / overflow 0 / content-diff none / visual-diff 0 flags at BOTH widths. chrome-parity's default regions report "no header, no footer" on both sides — parity, confirmed with `--no-defaults --region content=…` (exit 0). Chrome crop gate not applicable (no chrome); the whole page is at 0.00%.
- Interaction parity: motion-observe on live and build with `--hover a` → 0 animations, 0 transitions; the link hover is dead on live, so nothing was implemented. motion-compare: 0 missing, 0 extra.
- Iterations used: 1 of 3 per breakpoint; residuals: none.

**Artifacts touched:**
- stardust/prototypes/index-proposed.html, replica-canon.css, index.css — created
- stardust/replica/tokens.json, progress.json — created
- stardust/replica/gates/index-1440/, index-360/ — created (gate.sh evidence)
- stardust/replica/motion/index.json, index-build.json, index-compare.{txt,json} — created

**Findings worth flagging:**
- On a chrome-less page gate.sh --full can never exit 0 (default chrome regions); the region-scoped chrome-parity run is the parity evidence. Worth a flag on gate.sh upstream.

**Open questions:** none

**Next:** Phase 4 source-fidelity-gate — record the confirmation round and approve the archetype (hands-off), then Phase 5 handoff.

---

## Source-fidelity gate — confirmation round passed, archetype approved hands-off (2026-09-28)

**Prompt:** Phase 4 of the hands-off replica run: confirm the gate numbers after the interaction-parity pass and approve the archetype.

**Decisions:**
- Confirmation pixel round (`conf`) at 1440 and 360 on the unchanged prototype: 0.00% / height Δ 0 / overflow 0 at both widths — the number held after the motion pass (nothing was implemented, nothing changed).
- Pass bar per breakpoint: content-diff 0 🔴 (iter1 --full), visual-diff 0 flags, pixel 0.00% ≤ 10%, |Δh| 0 ≤ 8, overflow 0 ≤ 4; chrome crop gate not applicable (no header/footer on either side, region parity ✓).
- Approved by hands-off after all gates passed; state.json: index extracted → directed → prototyped → approved (approvedBy hands-off).
- Residuals: none. Iterations used: 1 of 3 per breakpoint.

**Artifacts touched:**
- stardust/state.json — updated (index approved)
- stardust/replica/progress.json — updated (confirmation round, approved)
- stardust/replica/gates/index-1440/, index-360/ — conf round evidence added

**Findings worth flagging:** none beyond the Phase 3 note on gate.sh's default chrome regions.

**Open questions:** none

**Next:** Phase 5 handoff — read the contract card, migrate the single page at archetype tier, deploy, gate on the published origin.

---

## Handoff / A-inventory — one page, one template, no blocks (2026-09-28)

**Prompt:** Phase 5 handoff: hand the gated archetype to migrate → deploy → rollout.

**Decisions:**
- Deploy/rollout/dynamics scripts copied under `stardust/scripts/`; DA token taken from the runner's token file via `--token-file` (never read or printed).
- `migrate.mjs render index` placed the archetype at `stardust/migrated/index.html` (archetype tier; no siblings exist).
- Rollout A-inventory: 1 page (index), 1 template, 0 blocks (the page is default content: h1, p, p>a). `rollout.json` site filled: aemcoder / c228fa32 / main; liveHost = the preview host (publish decision recorded in the conversion log at C0).

**Artifacts touched:**
- stardust/migrated/index.html, _meta.json — created (migrate.mjs)
- stardust/eds-schema/index.json — created (0 sections: no blocks)
- stardust/rollout/rollout.json, coverage/pages.json, coverage/templates.json — created

**Findings worth flagging:** none

**Open questions:** none

**Next:** rollout B-block (0 blocks → empty plan), B2-dynamic, then C-deliver units (foundation, landing cluster, final).

---

## B-block — block dedup plan: 0 distinct blocks, one page delivers as default content (2026-09-28)

**Prompt:** Rollout Phase B: derive the distinct-block ledger and the representative-first conversion plan.

**Decisions:**
- `blocks.mjs`: 0 distinct blocks (0 module, 0 chrome/fragment) — the page's `modules[]` is empty and there is no header/footer on either side, so no /nav or /footer fragment is planned.
- `plan.mjs`: delivery order = [index], `convert: []`, `reuse: []`, `fragments: []`. The page will be delivered as EDS default content (h1, p, p>a) with the page-level styles in the foundation.

**Artifacts touched:**
- stardust/rollout/coverage/blocks.json — created (empty ledger)
- stardust/rollout/plan.json — created (1 step, no conversions)

**Findings worth flagging:** none

**Open questions:** none

**Next:** B2-dynamic (re-verify the empty dynamic surface against fresh evidence), then C-deliver units: foundation, landing cluster (index), final.

---

## B2-dynamic — empty dynamic surface re-verified against fresh evidence (2026-09-28)

**Prompt:** Rollout Phase B2: verify `stardust/dynamic-features.md` against fresh evidence before the first import.

**Decisions:**
- `dynamics-detect.mjs` re-probed the live page (HTTP 200, settle 5000 ms, 1440): 0 findings in every class — identical to the Phase 2 result.
- `dynamics-plan.mjs --target-origin --migrated`: 0 rows, 0 host-bound of 0 API paths, 0 already delivered. Nothing to curate; a re-verification note was appended to `stardust/dynamic-features.md`.

**Artifacts touched:**
- stardust/current/_dynamics.json, dynamic-features.generated.md — refreshed
- stardust/dynamics/dynamic-features.generated-plan.{json,md} — refreshed
- stardust/dynamic-features.md — re-verification section appended

**Findings worth flagging:** none

**Open questions:** none

**Next:** C-deliver — unit `foundation` (styles + runtime contract, PUT the foundation, published-origin gate, freeze), then unit `landing` (index), then `final`.

---

## C-deliver — foundation, landing and final units: 1/1 page live on the preview origin at 0.00% (2026-09-28)

**Prompt:** Rollout Phase C: deliver the site in recorded units (foundation → template clusters → final).

**Decisions:**
- Chrome-less site: the shell document IS the index page, so the foundation unit (one subagent) authored the foundation AND PUT `/index`; the landing unit re-verified the live page instead of re-authoring it. Recorded in `stardust/eds-conversion-log.md`.
- Foundation = `styles/styles.css` rewritten from the lifted canon (body 60vw / 15vh auto / #eee / system-ui; h1 1.5em; links #348; `main { opacity: .8 }`; header/footer hidden; section wrappers zeroed; boilerplate typography/buttons/fonts removed), `styles/fonts.css` emptied of the roboto fallbacks. `stardust/runtime-contract.json`: vanilla-eds, `.block`, buttonization formatted-only, inert-innerHTML, emptySectionCollapse false.
- Publish decision: PREVIEW ONLY (`--no-publish`); liveHost = main--c228fa32--aemcoder.aem.page. Content: `content/index.html`, verbatim strings, bare `<p><a>` (not buttonized by this clone).
- Published-origin gate on `https://main--c228fa32--aemcoder.aem.page/` with `--main "body > div, main"` (live root is a class-less div, delivered root is main): pub1 `--full` (subagent) and pub2 (main-agent confirmation) at 1440 and 360 — pixel 0.00%, Δh 0, overflow 0, content-diff 0 structural red, visual 0 flags, chrome content-region parity 3/3 (the default header/footer regions report "live has no element" on this chrome-less page — known quirk). ai-readability code 100. 1 iteration per width.
- Foundation frozen (16 files) after the gate; freeze check clean at every unit end; 0 foundation requests.
- gate-evidence sidecar: `lint=0P0·2P1·1P2` is measured on `stardust/migrated/index.html` (self-contained page without `<header>/<footer>` wrappers); the delivered `content/index.html` lints 0 P0 · 0 P1 · 1 P2 (no metadata block — none authored, verbatim rule).
- Local harness qa-gate: 8 ok, 2 fail "block header/footer renders non-empty" — chrome-less by design (structural assert has no flag to suppress); the published gate is the verdict.

**Artifacts touched:**
- styles/styles.css, styles/fonts.css — rewritten (frozen)
- content/index.html — created; PUT 201, preview 200 (`stardust/deploy/ledger-foundation.json`)
- stardust/runtime-contract.json, stardust/eds-conversion-log.md, stardust/rollout/units/foundation.paths — created
- stardust/rollout/progress.json (foundation, landing, final = done), foundation-freeze.json, foundation-requests.md — created
- stardust/replica/gates/index-{1440,360}/*pub1*, *pub2* — gate evidence
- stardust/migrated/_meta.json — gatesPassed/gateEvidence written by gate-evidence.mjs
- stardust/rollout/coverage/pages.json — index `deployed`; stardust/state.json — index `migrated`

**Findings worth flagging:** `npm run lint:js` needed a project-root `npm install` (missing @babel/core in the checkout); package-lock unchanged.

**Open questions:** none

**Next:** D-site (sitemap/robots/manifest, no redirects), D2-dynamic (empty surface), E-full-site verify, E2-link-audit, F-optimize, G-aem, H-report, I-dashboard.

---

## D-site — root serves the index document; expected sitemap assembled, served sitemap unavailable on a preview-only site (2026-09-28)

**Prompt:** Rollout Phase D: site assembly — sitemap, robots, manifest, redirects, the root answer.

**Decisions:**
- `assemble.mjs`: sitemap.xml 1 url (expected set), robots.txt, manifest.json, 0 fragments.
- Root: `curl -sIL` on the preview root → 200 in one hop; the source root serves a page, so no `/` redirect row and no redirects sheet (no `stardust/redirects.tsv`).
- `assemble.mjs --verify-origin` on the preview host: served sitemap UNREADABLE (HTTP 404). Cause: preview-only publish decision (the platform indexes published documents) + config-service-owned site configuration. Source parity: the source serves no sitemap and no robots.txt (both 404). Recorded in `stardust/eds-conversion-log.md` as a residual; not a blocker.

**Artifacts touched:**
- stardust/rollout/site/{sitemap.xml,robots.txt,manifest.json} — created (manifest records the served-sitemap result)
- stardust/eds-conversion-log.md — D-site decision appended

**Findings worth flagging:** served sitemap cannot be verified on a preview-only site; the `D-site end` detail names the served count honestly (0, HTTP 404).

**Open questions:** none for the run; owner: publish + sitemap configuration when the site goes live.

**Next:** D2-dynamic (empty surface → empty parity report), E-full-site verify.

---

## D2-dynamic — empty parity report replayed, 0/0 (2026-09-28)

**Prompt:** Rollout Phase D2: build and replay the dynamic parity report against the published origin.

**Decisions:**
- `stardust/dynamics/parity.json` written with 0 features (the detect → triage → B2 re-probe chain found none); no query-index is needed (no listing, search or index surface), so no `helix-query.yaml` and no interim sheet.
- `dynamics-check.mjs --origin <preview>`: 0/0 pass, report at `stardust/qa/dynamics-report.{md,json}`.

**Artifacts touched:**
- stardust/dynamics/parity.json — created
- stardust/qa/dynamics-report.md, dynamics-report.json — created

**Findings worth flagging:** none

**Open questions:** none

**Next:** E-full-site verify (`verify.mjs --base <preview>`), E2-link-audit, F-optimize, G-aem, H-report, I-dashboard.

---

## E-full-site — 1/1 page verified on the preview origin (2026-09-28)

**Prompt:** Rollout Phase E: full-site verification of every delivered page.

**Decisions:**
- `verify.mjs --base https://main--c228fa32--aemcoder.aem.page --all`: checked 1, verified 1, failed 0 (reachable 200, no `about:error`, no unresolved internal hrefs — the page's only link is external).
- Headless render check of the one template is covered by the published-origin pixel gate (pub1 `--full`, pub2 confirmation: 0.00% at 1440 and 360, 0 page errors from the gate captures).

**Artifacts touched:**
- stardust/rollout/coverage/pages.json — index `verified`; rollout.json roll-ups re-derived

**Findings worth flagging:** none

**Open questions:** none

**Next:** E2-link-audit (one external href; localize-links --check), F-optimize, G-aem, H-report, I-dashboard.

---

## E2-link-audit — one external href, resolves; nothing to repoint (2026-09-28)

**Prompt:** Rollout Phase E2: link-audit completeness over the delivered tree.

**Decisions:**
- Delivered tree carries 1 href: `https://iana.org/domains/example` (external, verbatim from the source — the captured page's single link). GET → 301 to `https://www.iana.org/domains/example` → 200. Kept as authored (the source links the bare host and follows the same redirect); no repoint.
- `localize-links.mjs --check`: CHECK PASS, 0 source-host links remain, 0 internal hrefs (nothing to normalize).
- No internal targets, no nav/footer, no capture gaps (`site.captureGaps` empty) → no `direction.md` decision entry needed.

**Artifacts touched:** none (read-only audit)

**Findings worth flagging:** none

**Open questions:** none

**Next:** F-optimize, G-aem, H-report, I-dashboard.

---

## F-optimize — health 100/100, 0 open findings, 1 source-parity note (2026-09-28)

**Prompt:** Rollout Phase F: the in-flow delivery-quality gate.

**Decisions:**
- `optimize.mjs --base <preview> --all` (run-1): 1 page + site checks, health 100/100 (ai 100; a11y/seo/xpage null = no detector hit), open P1 0 · P2 0 · P3 0. GATE passed.
- 1 source-parity finding, informational: P2 ai-search/jsonld on index — the source page has no JSON-LD either. Not scored, not gated, not auto-fixed (verbatim rule).

**Artifacts touched:**
- stardust/rollout/optimize/findings.json, scorecard.json — created

**Findings worth flagging:** none

**Open questions:** none

**Next:** G-aem (dry-run expected to find nothing fixable), H-report, I-dashboard.

---

## G-aem — nothing to fix: 0 candidates (2026-09-28)

**Prompt:** Rollout Phase G: apply EDS project edits for fixable optimize findings, re-deploy, re-verify.

**Decisions:**
- `autofix-aem.mjs --project . --dry-run`: candidates 0 · applied 0 · manual 0 · skipped 0 · failed 0 (no open findings after F). The non-dry run was not needed; no project file changed; foundation freeze check clean (16 files). No re-deploy, no re-verify required.

**Artifacts touched:** none

**Findings worth flagging:** none

**Open questions:** none

**Next:** H-report (summary block + learnings), I-dashboard.

---

## H-report — summary block written, learnings recorded (2026-09-28)

**Prompt:** Rollout Phase H: the summary block (pages / templates / blocks / quality / to-deliver) + learnings.

**Decisions:**
- `stardust/rollout/report.md`: 1/1 page migrated, deployed (preview), verified; 1 template gated 0.00% at 1440/360 on the published origin; 0 blocks; health 100/100, 0 open findings; 0 pages left to deliver; owner items = publish decision + sitemap configuration.
- `stardust/learnings.md`: 6 entries (chrome-less shell = archetype, `--main "body > div, main"`, gate.sh chrome step on chrome-less pages, gate-evidence lints the migrated file, sitemap on preview-only runs, lint deps on a fresh checkout).

**Artifacts touched:**
- stardust/rollout/report.md, stardust/learnings.md — created

**Findings worth flagging:** none

**Open questions:** none

**Next:** I-dashboard (`dashboard.mjs`), then `replica handoff end`.

---

## I-dashboard — dashboard rendered; handoff complete (2026-09-28)

**Prompt:** Rollout Phase I: the self-contained progress dashboard; then close the replica handoff.

**Decisions:**
- `dashboard.mjs` → `stardust/rollout/dashboard/index.html` + `data.json` (page tree: 1 page, stage deployed/optimised).
- Replica Phase 5 handoff closed: 1/1 page delivered to the preview origin, published-origin gate 0.00% at 1440 and 360, health 100, 0 open findings. Owner items: publish decision, sitemap configuration after publish.
- Status page for the site owner updated to Ready / 100%.

**Artifacts touched:**
- stardust/rollout/dashboard/index.html, data.json — created
- tools/replica/progress.html — rewritten (Ready)

**Findings worth flagging:** none

**Open questions:** none

**Next:** nothing — the run is complete; a further session has no phase to run.

---
