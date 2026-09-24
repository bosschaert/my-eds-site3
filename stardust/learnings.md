# Learnings — stardust replica run, static-website.david-bosschaert.workers.dev (2026-09-23)

### Token captured in the background-runner job record
- failure class: credential-leak
- evidence: C1 brief launched `run-bg.mjs start -- env DA_TOKEN="$(cat "$ADOBE_IMS_TOKEN_FILE")" node deploy-batch.mjs …`; the shell expanded the token and run-bg wrote it verbatim into `stardust/.work/replica/bg/deploy-site-blocks.json`, which the `git add -A` checkpoint committed and pushed (013c9a6). Caught by a pre-commit grep for `eyJ…`; redacted, amended, force-pushed, history re-scanned clean.
- proposed change: `replica/scripts/run-bg.mjs` — redact any `<NAME>TOKEN…=<value>` / `Authorization` arg before writing the job JSON and log; `replica/reference/handoff-contract.md § 3 row C` + fan-out discipline — "a credential never appears on a run-bg command line: export it inside a wrapper script under stardust/.work/…/probes/ or run deploy-batch in the foreground with `--token-env`"; master checkpoint command — add the `eyJ` grep guard before `git add -A`.
- status: pending

### `table-layout: fixed` on a media table the source lays out by intrinsic width
- failure class: silent-render
- evidence: index pub1 on the published origin measured 27.95% / Δh −135px while the prototype had gated at 0.00%; the pipeline wraps cells in `<picture>` and the block CSS had `table-layout: fixed`, so the two columns split 50/50 where the source splits by intrinsic media width (iframe 560 vs image). Dropping the rule → 0.01%.
- proposed change: `replica/reference/recreation-procedure.md § CSS lifting` — lift `table-layout` explicitly for table-based modules and note that `<picture>` wrapping changes intrinsic-width resolution; `deploy/SKILL.md § Step 10` — list "table/grid column split" among the first hot bands to measure on the published origin.
- status: pending

### chrome-parity region deltas on a source without header/footer landmarks
- failure class: false-red
- evidence: every published round reported `chrome-parity ✗ 2–3 delta(s)`: `REGION live: no element matches "header"` (source nav is `nav.site-header` directly under body) and a footer REGION BOX delta (live `footer.site-footer` 1200px vs EDS `footer` host 1376px) plus the recorded `<p>`-vs-bare-text pairing; pixel crops of both bands were 0.00%.
- proposed change: `replica/reference/source-fidelity-gate.md § chrome parity` — when the source lacks a landmark, the gate brief must pass `--region header=<liveSel>|<buildSel>` (and footer) so the instrument compares the same boxes; gate.sh — forward `--region` to chrome-parity.
- status: pending

### qa-gate "units" FAIL on a single-section page
- failure class: false-red
- evidence: `qa-gate.mjs` on the index harness paired the schema's only section with block 0 (media-grid) and reported a unit-count FAIL although block-roundtrip (`--ew`) was clean and the published page carried 3 panels / 6 cards.
- proposed change: `deploy/scripts/qa-gate.mjs` — match schema sections to blocks by name/order of appearance rather than index; `deploy/SKILL.md § Local QA` — document the artifact until fixed.
- status: pending

### Foundation unit did not record chrome blocks in coverage
- failure class: bookkeeping-gap
- evidence: after C0, `coverage/blocks.json` still had site-header/site-footer `pending`; rollout.json showed `blocks 3/5 converted` until C-final ran `update-coverage.mjs --block … --status deployed`.
- proposed change: `replica/reference/handoff-contract.md § 3 row C` (C0 brief) — add the two `update-coverage.mjs --block <id> --status deployed --eds-name <name>` calls to the foundation subagent's chain.
- status: pending

### Boilerplate ESLint parser dependency absent in a no-install environment
- failure class: tooling-gap
- evidence: `npm run lint:js` failed at parser load (`@babel/core` absent from node_modules; installs forbidden); `npx eslint --parser espree` ran the airbnb-base rules unchanged.
- proposed change: `deploy/SKILL.md § Boilerplate lint` — record the `--parser espree` fallback for environments where installs are forbidden.
- status: pending
