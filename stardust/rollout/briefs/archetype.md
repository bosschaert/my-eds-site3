# Unit C-archetype-<template> — deploy the gated archetype and pass its published gate row

Read stardust/rollout/briefs/common.md first; it binds you. Read stardust/runtime-contract.json (what
the frozen foundation gives you). Other units may run in parallel on OTHER templates: touch only the
blocks this brief names as yours (new block dirs you create, plus existing block dirs listed as
yours), the content files of your pages, and your own ledgers/logs.

Inputs (filled in by the coordinator at the bottom): template, archetype slug, live URL, EDS path,
prototype, the blocks you own (from stardust/rollout/plan.json + stardust/rollout/coverage/blocks.json),
the archetype's captureState[].restoreAtDelivery list (stardust/replica/progress/<slug>.json) — every
entry is implemented before done.

## Steps
1. Section schema: `node stardust/scripts/deploy/section-schema.mjs http://localhost:8791/<slug>-proposed.html
   --out stardust/eds-schema/<slug>.json` (the prototype server on :8791 serves stardust/prototypes/;
   verify with curl -sI; if it does not answer, start `python3 -m http.server 8791` from
   stardust/prototypes in the background, record its PID, stop it by PID before returning).
2. Blocks: one EDS block per composite module (names from coverage/blocks.json `edsBlockName`, kebab
   case). Decode tier: template-slotted for fixed compositions (hero, stage, fact row, text-media),
   reconstructive for repeat groups (teasers, cards, lists, tabs, slides). Block CSS = the module's
   rules from canon.css / <slug>.css, re-scoped under `.blockname` (no page-level CSS). Block JS =
   decorate() that MOVES authored nodes into the prototype's DOM shape (EW1–EW10; no innerHTML —
   trusted types). Behaviour (sliders, tabs, count-up, lightbox, load-more, hover) re-implemented per
   the archetype's motion record (stardust/replica/progress/<slug>.json → motion.implemented).
   Images: content cells carry `<img src>` of the captured cdn.continental.com rendition (verbatim
   alt). Icons: /icons/<name>.svg via the foundation's icon helper (runtime-contract.json).
3. Encoder — the content is GENERATED, never hand-typed: 94 sibling pages reuse it. The encoder
   lives in `stardust/rollout/encoders/`: `encode.mjs` (core, `node encode.mjs <slug> [--out content]`:
   reads stardust/current/pages/<slug>.html + .json, walks `<main>` in order, dispatches each TYPO3
   module element by class to a module file, emits default content for plain text/headings, writes
   `content/<eds-path>.html` + the metadata block; unknown module → a loud `UNMAPPED <class>` line
   and a non-zero exit) and one file per module `encoders/modules/<block>.mjs` exporting
   `{ match: '<css selector>', encode(el, ctx) }` returning the block table. If encode.mjs does not
   exist yet you write it (cheerio is installed); if it exists you only ADD module files for your
   blocks (never restructure the core; a core change you need goes in a comment line at the top of
   your module file and in your return lines). Then run it for your archetype:
   `content/<eds-path>.html` in DA format (sections, block tables as div-class form,
   section-metadata, a closing metadata block with Title / Description / og image from the capture),
   all strings verbatim from stardust/current/pages/<slug>.html. Internal links: absolute source URLs
   are fine before localize-links rewrites them.
4. Local structural asserts (never pixel): build-harness.mjs → qa-gate.mjs, block-roundtrip.mjs --ew
   per block then whole page: exit 0 (needs `npx -y @adobe/aem-cli up --no-open --port 3000` from the
   root — or another free port — in the background, PID recorded, stopped by PID at the end).
5. Chain: npm run lint → delivery-lint.mjs → media-reconcile.mjs --deploy-host
   main--d9ddbc54--aemcoder.aem.live --apply → localize-links.mjs --source-host www.continental.com
   --content content --redirects stardust/redirects.tsv then --check → davids-model-lint.mjs →
   sanitise.js (one file) → commit + git push (code) → poll code sync for your block JS (bounded) →
   deploy-batch.mjs (`--paths stardust/rollout/units/archetype-<template>.paths --ledger
   stardust/deploy/ledger-archetype-<template>.json --log stardust/.work/rollout/archetype-<template>/deploy.log
   --concurrency 2 --token-file "$ADOBE_IMS_TOKEN_FILE"`) via run-bg. A re-PUT of an already-live page
   needs `--force`. Check `.plain.html`: 200, one h1, 0 about:error, no /img/.
6. Published gate row, both widths, through run-bg — 1440 first, then 360 (sequential, never together:
   the unit-geometry origin cache below is shared):
   `node stardust/scripts/replica/gate-all.mjs --only <slug> --eds-host main--d9ddbc54--aemcoder.aem.page --width 1440`
   and `--width 360`. Bar: pixel ≤ 10 %, |Δh| ≤ 5 %, clipped 0, content MISSING+HIDDEN 0. Also
   crop-compare header/footer bands ≤ 2 % once. Unit-geometry caveat: the origin inventory cache
   stardust/current/measure/<slug>-units.json is keyed by slug only — delete it before switching
   width. Fix rounds cap 3 (gate doc § What a failing row means: block CSS/JS → push; content →
   re-PUT with --force). Never edit a frozen file (requests file instead).
7. Coverage: `node stardust/scripts/rollout/update-coverage.mjs <slug> --status deployed --url <preview url>`
   after the PUT, and per block `--block <id> --status deployed --eds-name <name>`.

## Return
`archetype-<template>: <slug> live, blocks k (<names>), gate 1440 x% Δh / 360 y% Δh, clip 0, content 0, crop h a%/f b%, rounds r, requests n`
+ ≤ 10 lines: block list, residuals, anything the sibling clusters must know (encoder notes: how a
captured TYPO3 module maps to your block's content rows — the cluster reuses this encoder for every
sibling, so write it down as stardust/rollout/encoders/<template>.md).
