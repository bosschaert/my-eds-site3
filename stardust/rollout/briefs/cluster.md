# Unit C-cluster-<template> — deliver every sibling of one template

Read stardust/rollout/briefs/common.md first; it binds you. Read stardust/runtime-contract.json,
stardust/rollout/encoders/<template>.md (the archetype unit's encoder notes) and the encoder core
stardust/rollout/encoders/encode.mjs (header comment only). Other clusters run in parallel on OTHER
templates: you own your pages' content files, the NEW block dirs you create, your ledgers/logs, and
NEW module files under stardust/rollout/encoders/modules/. Existing blocks are shared: a change an
existing block needs for your pages is a VARIANT (an extra class on the block in your content,
styled in the block's CSS under `.blockname.variant`) — edit an existing block's files only to ADD
a variant rule or a guarded code path that leaves the archetype's rendering unchanged; never
restructure it. Never edit frozen foundation files (requests file instead).

Inputs (coordinator, at the bottom): template, archetype, sibling slugs with their source URL and EDS
path, the modules each sibling has beyond the archetype (stardust/migrate/module-census.json
`newModules`), the variance-probe JSON per render unit (stardust/migrate/variance/<unit>.json), and
the archetype's captureState[].restoreAtDelivery list — implemented wherever your pages carry it.

## Per page (the whole chain — handoff card §3 row C)
1. `node stardust/rollout/encoders/encode.mjs <slug>` → content/<eds-path>.html. An `UNMAPPED`
   module → write its module file (and its block if no existing block fits: CSS lifted from
   stardust/current/assets/css/site.css with css-rules.mjs, scoped to `.blockname`; JS per EW1–EW10,
   no innerHTML). Content verbatim, nothing invented; a module that cannot be delivered statically
   (Solr search results, job widgets, forms needing a backend) follows its stardust/dynamic-features.md
   row's interim disposition and is logged with
   `node stardust/scripts/migrate/migrate.mjs deviation <slug> --kind dynamic-dependency --source "<what>" --target "<what ships>" --reason "dynamic-features row <n>"`.
2. Content-count acceptance comes from the gate row's content criterion (step 6: gate-all's
   content-presence, MISSING+HIDDEN 0). Only for a page that fails it, run
   `node stardust/scripts/diff/content-diff.mjs <live-url> <preview-url> --profile generic --main main`
   through run-bg to locate the drop. Once the row passes:
   `migrate.mjs gate <slug> content-fidelity --evidence "gate-all content 0 missing/hidden @1440+360"`.
3. npm run lint (if you touched code) → delivery-lint.mjs → media-reconcile.mjs --apply →
   localize-links.mjs --source-host www.continental.com --content content --redirects
   stardust/redirects.tsv, then --check → davids-model-lint.mjs → sanitise.js (one file per call).
4. Code first: commit + git push your block changes, poll code sync (bounded curl).
5. Deploy: write your EDS paths (one per line) to stardust/rollout/units/cluster-<template>.paths and run
   `node stardust/scripts/deploy/deploy-batch.mjs --org aemcoder --repo d9ddbc54 --branch main
   --content content --paths stardust/rollout/units/cluster-<template>.paths --ledger
   stardust/deploy/ledger-cluster-<template>.json --log stardust/.work/rollout/cluster-<template>/deploy.log
   --concurrency 1 --token-file "$ADOBE_IMS_TOKEN_FILE"` through run-bg (it publishes live).
   `.plain.html` checks on each page (200, one h1, 0 about:error, no /img/).
6. Gate rows: `node stardust/scripts/replica/gate-all.mjs --only <your slugs, comma-joined>
   --eds-host main--d9ddbc54--aemcoder.aem.page --width 1440 --origin-concurrency 1 --eds-concurrency 1`
   through run-bg, then the same with `--width 360` (sequential; delete
   stardust/current/measure/<slug>-units.json for your slugs between widths). Bar per page:
   pixel ≤ 10 %, |Δh| ≤ 5 %, clipped 0, content MISSING+HIDDEN 0. Failing pages: fix rounds cap 3 per
   page (block CSS/JS → push; content → re-encode + deploy-batch --force on that path), then
   re-gate only the failing slugs. After 3 rounds a still-failing page is reported, not hidden.
   Also crop-compare header/footer on one sibling per width (≤ 2 %).
7. Coverage: `node stardust/scripts/rollout/update-coverage.mjs <slug> --status deployed --url <preview url>`
   per page after its PUT; `--status failed --error "<gate numbers>"` for a page still failing after
   its rounds; new blocks: `--block <id> --status deployed --eds-name <name>`.
8. Record per page: `node stardust/scripts/migrate/migrate.mjs modules <slug> <block ids…>`.

Budget: be economical — gate in batches, read only verdict lines (`run-bg.mjs log <job> --grep`).

## Return
`cluster-<template>: pages n/n live, blocks k (new: <names>), gate 1440 pass p/n (worst x%) / 360 pass q/n (worst y%), failing <slugs or none>, requests r`
+ ≤ 10 lines of facts (residuals, deviations logged, foundation requests filed).
