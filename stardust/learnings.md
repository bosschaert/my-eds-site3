# Learnings — static-website.david-bosschaert.workers.dev replica run (2026-10-06)

### Sub-pixel chrome reservation rounded to a whole pixel
- failure class: fidelity-drift (a lifted value rounded at authoring time)
- evidence: `--nav-height: 72px` in styles.css for a source header bar measuring 71.66px; every element below the header sat +0.34px lower on the published page — index read 2.39 % at 1440 (band 1000–1500 at 9.7 % from photo texture) and 0.05 % once the exact value shipped at C-final (page1 0.55 % → 0.03 %; 360: 2.66 % → 0.36 %, 1.06 % → 0.44 %)
- proposed change: `skills/replica/reference/recreation-procedure.md` § Fixed and sticky chrome — lift chrome heights to two decimals into the custom property; never round a value that reserves vertical space (the diff below it is offset-contaminated)
- status: pending

### Foundation request applied after the roster gate
- failure class: ledger-order (C-deliver unit sequence)
- evidence: session 4 recorded `gate-all` done before `final`; the queued foundation request was applied in `final`, which forced a second roster gate (`gate-all --skip-existing --recapture-eds`) for the same pages
- proposed change: `skills/replica/reference/handoff-contract.md` § 3 row C — state that the C-final request application (and the per-archetype re-gate) precedes the `gate-all` unit, or that `gate-all` after an applied request re-runs with `--recapture-eds`; mirror it in the run prompt's unit list (`… final-requests, gate-all, final`)
- status: pending

### Chrome blocks never flipped in the block coverage ledger
- failure class: ledger-drift
- evidence: `coverage/blocks.json` read site-header / site-footer `pending` at H-report (blocks 3/5 converted in `rollout.json.lastRun`) although both shipped and were gated in unit `foundation` (crop-compare 0.00 % both widths); flipped by hand at H with `update-coverage.mjs --block … --status verified`
- proposed change: `skills/replica/reference/handoff-contract.md` § 3 row C, C0 foundation — add `update-coverage.mjs --block <header-id> --status verified --eds-name header` (and footer) to the unit's end steps beside `foundation-freeze.mjs freeze`
- status: pending

### `/index` alias is not redirectable on EDS
- failure class: path-safety
- evidence: the source 307s `/index` → `/`; a `/index → /` row in `/redirects.json` (published, other rows live within 5 s) left `https://main--bb2d4d27--aemcoder.aem.live/index` at 404 — the platform reserves the path for the root document
- proposed change: `skills/replica/reference/handoff-contract.md` § 3 row D — note that `/index` is platform-reserved and a source redirect from it has no EDS equivalent; record it as an alias gap, do not iterate on the sheet
- status: pending

### No lifecycle transition to `deployed`
- failure class: tooling-gap
- evidence: `state.mjs advance <slug> --to deployed` does not exist; sessions 4 set `status: deployed` (+ `liveUrl`, `deployedPath`) with a node snippet, against the "never a hand edit" rule (eds-conversion-log, archetype page1 entry)
- proposed change: `skills/stardust/scripts/state.mjs` — add the `migrated → deployed` transition with `--live-url` / `--deployed-path`; document it in `skills/stardust/reference/state-machine.md` § Page lifecycle states
- status: pending
