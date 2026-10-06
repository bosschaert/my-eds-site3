# Learnings — garden-eight.com replica run (2026-10-05)

### Full-site verify counts redirect-backed out-of-scope links as broken
- failure class: path-safety (scope boundary)
- evidence: `verify.mjs --all` flipped the only page to `failed` ("broken internal links: /cases/photoyoshi, …") although every target was a row in the published `/redirects.json` (D-site) and answered 301 → 200; fixed by repointing the hrefs to the source as E2 prescribes, which E runs before
- proposed change: `skills/rollout/scripts/verify.mjs` — treat the sources of `stardust/redirects.tsv` as known paths (or run the E2 repoint before E in the handoff contract § 3 so E never sees them)
- status: pending

### Published-stage gate-all selects pages the lifecycle writer never produces
- failure class: silent-render (gate skipped by selection, not by verdict)
- evidence: `gate-all.mjs --stage published` filters `state.json` pages on `status === 'deployed' && liveUrl`; the lifecycle leaves delivered pages `migrated` with no `liveUrl`, so "no deployed pages selected" and a derived state file (`stardust/.work/rollout/probes/state-gate.json`) was needed on every run
- proposed change: `skills/replica/scripts/gate-all.mjs` — read the roster from `stardust/rollout/coverage/pages.json` (`delivery.deployedUrl`, status deployed|verified) when present, falling back to state.json
- status: pending

### Scroll-jacked source page fails the height criterion by construction
- failure class: capture-gap (measurement policy)
- evidence: the source document is 900 px high with an inner transform-driven scroller; every stitched capture compared a 900 px origin against a 3,600 px build (Δh −2762 at 1440, −1984 at 360) and the row was delivered only through `overrides.json`
- proposed change: `skills/replica/reference/source-fidelity-gate.md` § height — detect `scrollHeight ≈ innerHeight` with a transformed scroller and measure the scroller's content height; `stitch-shot` should scroll the inner scroller
- status: pending

### No replayable check for a click-toggles-state control
- failure class: dynamic-gap (instrument coverage)
- evidence: the footer "M : hello@garden-eight.com" copy control was verified by motion-observe (label → "Copied", 0.7 s) but `dynamics-check.mjs`'s closed set offers only presence (`dom-count`) for it
- proposed change: `skills/dynamics/scripts/dynamics-check.mjs` — add a `click-state { path, trigger, expectClass | expectText, within }` check type
- status: pending

### Page lint applied to chrome fragments
- failure class: path-safety (false P0)
- evidence: `delivery-lint.mjs --file content/nav.html` and `content/footer.html` report P0 "expected exactly one h1, found 0" although fragments carry no heading by design; the foundation unit shipped them as-is
- proposed change: `skills/rollout/scripts/delivery-lint.mjs` — a `--fragment` flag (or auto-detect `/nav`, `/footer`, `nav-*`, `footer-*`) that skips the page-shape rules
- status: pending
