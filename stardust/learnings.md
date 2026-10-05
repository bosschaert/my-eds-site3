# Learnings — www.example.com replica run (2026-10-05)

Entries per `skills/stardust/reference/learnings.md` § Entry shape. One per failure class this run surfaced.

### gate-all's roster selection needs a `deployed` status the core lifecycle cannot write
- failure class: index-empty (the roster gate selected zero pages: `gate-all: no deployed pages selected`)
- evidence: `gate-all.mjs --stage published` filters `state.pages` on `status === 'deployed' && liveUrl`; `state.mjs advance --to` accepts only extracted|directed|prototyped|approved|migrated, and no deploy/rollout step writes `liveUrl` into `stardust/state.json`. The archetype unit worked around it with a derived copy (`stardust/.work/replica/probes/state-gate.json`, status deployed + liveUrl + deployedPath) passed via `--state`; the roster unit had to find and reuse that file.
- proposed change: `skills/replica/reference/handoff-contract.md` § 3 row C (unit `gate-all`) and § 5 — name the derived gate-state step (or have `gate-all.mjs` read `stardust/rollout/coverage/pages.json` rows with `deployedUrl` when `--state` has no deployed page); alternatively add a `deployed` transition with `--live <url>` to `state.mjs`.
- status: pending

### `--eds-host` without a scheme breaks the clip and content probes silently
- failure class: silent-render (a PASS verdict with two criteria unevaluated)
- evidence: `gate-all.mjs --eds-host main--b3ee2d3b--aemcoder.aem.page` (bare host, as the help text's "<host>" suggests): the pixel row reused cached captures and printed PASS 1/1, while `content-presence` and `clip-probe` failed with `Cannot navigate to invalid URL` and were counted `content n/a` — the summary still read 1 PASS. Re-run with `https://…` evaluated all four criteria.
- proposed change: `skills/replica/scripts/gate-all.mjs` — normalise `--eds-host` to an origin (prepend `https://` when no scheme) and treat a probe `ERROR` on the eds side as `error`, not `n/a`; help text `--eds-host <origin>`.
- status: pending

### gate-evidence lints the migrated intermediate, not the delivered document
- failure class: path-safety (the evidence row names a P0 on a page whose delivered document is clean)
- evidence: `gate-evidence.mjs` ran `delivery-lint.mjs --file stardust/migrated/index.html` and reported `lint=1P0·2P1·1P2` (no h1, no header/footer wrappers, no metadata block) while `content/index.html`, the document that was PUT and published, lints `0 P0 · 0 P1 · 0 P2`. On a replica run the migrated tree is the encoder's input, not the delivered artefact.
- proposed change: `skills/replica/scripts/gate-evidence.mjs` — lint `<content>/<path>.html` when it exists (the `--content` default is already `content`), falling back to `stardust/migrated/` only when it does not; document which file the lint column reads.
- status: pending

### qa-gate fails "header/footer renders empty" on a source with no chrome
- failure class: silent-render (a by-design state reads as FAIL)
- evidence: the source page has no header or footer; the foundation delivered empty `/nav` and `/footer` documents (noindex) and `qa-gate.mjs` reported 2 FAILs "header/footer renders empty" on every run, which the archetype unit had to justify by hand.
- proposed change: `skills/deploy/scripts/qa-gate.mjs` — read `navHeight: 0` (or an explicit `chrome: none`) from `stardust/runtime-contract.json` and downgrade the empty-chrome checks to informational when the source has no chrome.
- status: pending

### The pipeline unwraps a cell's single `<p>`; the harness strips the section around a metadata block
- failure class: silent-render (a block decorator written against the authored shape misses the served shape)
- evidence: in `.plain.html` a cell whose only child is one `<p>` arrives bare (the `:notice:` icon row and the `Learn more` link lost their `<p>`), so a row classifier keyed on `p` matched nothing until it accepted both shapes; `build-harness.mjs` removed the section wrapping a metadata block, leaving the metadata in its own trailing section that `main .section:empty` hides.
- proposed change: `skills/deploy/SKILL.md` § 2b (block authoring) — state the single-`<p>` unwrap and require classifiers to accept bare and wrapped cells; `skills/deploy/scripts/build-harness.mjs` — keep the section structure around a metadata block identical to the pipeline's.
- status: pending

### The dashboard counts informational source-parity rows as open findings
- failure class: index-empty (the dashboard's `optimised` stage read 0/1 for a verified page with no scored finding)
- evidence: `optimize.mjs` tags source-parity rows `fixability: out-of-scope` and excludes them from the score and the gate ("informational, not scored, not gated"), but `dashboard.mjs` `openByPage` counts every `status: open` page-scoped finding regardless of fixability, so the only page stayed at `deployed` until the row was resolved `accepted` by hand.
- proposed change: `skills/rollout/scripts/dashboard.mjs` — skip `fixability === 'out-of-scope'` (or `evidence` prefixed `source parity: `) in `openByPage`, matching optimize's own exclusion.
- status: pending
