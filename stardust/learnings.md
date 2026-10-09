# Learnings — run bf989f9e (www.myastrazeneca.ch fr, replica, 2026-10-07)

### Unit-inventory live cache is width-blind
- failure class: false-measurement
- evidence: `stardust/current/measure/<slug>-units.json` is keyed by slug only; a 360 inventory compared against the 1440 served page read IRC 50 / diabetes 40 / lupus 48 units off, 0 within, origin docH 8042 vs 4193 (gate-all 1440, C-final and again E-full-site; eds-conversion-log L92, L107). Resolved by parking the caches per width under `stardust/.work/replica/units-cache-*`.
- proposed change: `skills/diff/scripts/unit-geometry.mjs` (cache record) — key the cache file by slug AND width (`<slug>-units-<w>.json`) and refuse a record whose `width` differs from the run; `skills/replica/reference/source-fidelity-gate.md` § Pass bar item 7 — name the per-width cache.
- status: pending

### Unit-geometry keys ignore zero-width characters
- failure class: false-measurement
- evidence: `norm()` collapses `\s` only; U+200B around a reference marker made the served key "​ 1 ​" pair with the next origin "1" (dx/dy of another element) on every page at both widths, although the marker itself measures identical (eds-conversion-log L51; `gates/all-{1440,360}/overrides.json`). 8 of 10 pages are delivered on a documented override for this alone.
- proposed change: `skills/diff/scripts/unit-geometry.mjs` `norm()` — strip Unicode Cf characters (U+200B/C/D, U+2060, U+FEFF) before keying.
- status: pending

### Overlay dismissers must reach every instrument that opens the origin
- failure class: false-measurement
- evidence: gate-all's origin stitch, measure-live's `visit()` (content-presence / clip / unit probes) and dynamics-check all opened the origin without `GATE_DISMISS_EXTRA`; with the Cookie Reports banner up every heading under it read `inChrome: true` → `MISSING 5 / EXTRA 16`; the Kaltura click timed out behind the HCP modal (eds-conversion-log L8, L34, L101).
- proposed change: `skills/diff/scripts/live-session.mjs` — read `GATE_DISMISS_EXTRA` inside `dismissOverlays` once, so every caller (gate.sh, gate-all.mjs, measure-live.mjs, dynamics-check.mjs) inherits it; document the env var in `skills/replica/reference/source-fidelity-gate.md` § Hardening.
- status: pending

### Headed origin stitch vs headless served stitch is a tier mismatch
- failure class: false-measurement
- evidence: the stealth headed window's classic scrollbar narrowed the origin layout (360 → 345 px: one extra wrapped line → 24 px shift → 16.61 %; 1440 → 10 px Δh) while every DOM probe measured live = served (eds-conversion-log L37). `--origin-headless` added to gate-all.
- proposed change: `skills/replica/scripts/gate-all.mjs` — default the origin stitch to the served side's tier and escalate to headed only on a challenge (exit 3), as gate.sh already does; note in `source-fidelity-gate.md` § The all-pages published-origin gate.
- status: pending

### gate-all published stage reads a state shape nothing writes
- failure class: path-safety
- evidence: `--only fr-startseite` exited "no deployed pages selected" because the stage selected `state.pages[].status === 'deployed' && liveUrl`, while `state.mjs` stops at `migrated` and delivery lives in `stardust/rollout/coverage/pages.json`; `--eds-host <bare host>` also produced a scheme-less URL (eds-conversion-log L32, L33).
- proposed change: `skills/replica/scripts/gate-all.mjs` — read the coverage ledger's `delivery.status` / `deployedUrl` first and prefix a bare `--eds-host` with `https://`; `skills/replica/reference/handoff-contract.md` § 4 — one usage line naming the coverage source.
- status: pending

### Headings wrapped in inline containers classify as body
- failure class: silent-render
- evidence: AEM markup `<h1><p>…</p></h1>` / `<h2><span>` read as `body` against the authored `<h1>`, a ROLE SWAP 🔴 on every heading of every page in content-inventory / block-roundtrip / section-schema / content-diff (eds-conversion-log L30).
- proposed change: `skills/deploy/scripts/content-inventory.mjs` (role classifier) — a text run with an `h1–h6` ancestor is a heading; share the rule with `skills/diff/scripts/content-diff.mjs`.
- status: pending

### Pipeline-derived meta description where the source has none
- failure class: source-parity-gap
- evidence: 4 PATTRNS pages carry no description on the source and set none in content; the EDS pipeline derives one from the first paragraph (the HCP-only notice), so optimize raised `cross-page/duplicate-description` P3 (f-84656633a4) that parity could not clear; accepted by hand.
- proposed change: `skills/rollout/scripts/optimize.mjs` § Source parity — when the source page has no description AND the migrated document sets none, tag the derived-description findings `source parity:`; `skills/rollout/reference/checks.md` § Source parity — name the pipeline default.
- status: pending

### Block coverage rows stay pending when archetype units deploy blocks in bulk
- failure class: bookkeeping
- evidence: `coverage/blocks.json` read 10/15 blocks `pending` at H-report while every block had code, every page verified and `foundation-freeze` was clean; the archetype units recorded pages, not blocks (rollout.json.lastRun.blocks converted 5 / pending 10 until H).
- proposed change: `skills/replica/reference/handoff-contract.md` § 3 row C (archetype unit) and `skills/rollout/SKILL.md` § Phase C — the unit's done-check runs `update-coverage.mjs --block <id> --status deployed` for each block the archetype ships; `verify.mjs` flips blocks to `verified` with their pages.
- status: pending

### Link audit has no shipped live-GET instrument
- failure class: coverage-gap
- evidence: E2 requires every href GET against the live tree; `localize-links.mjs` resolves structurally and `verify.mjs` checks the roster's own links, so the audit over nav/footer/all pages was an ad-hoc script (`stardust/.work/replica/link-audit.mjs`: 69 hrefs, 10 internal, 34 source-host, 25 external).
- proposed change: `skills/rollout/scripts/` — ship `link-audit.mjs --base <origin> --docs nav,footer,<roster>` writing `rollout/link-audit.json` (kind, status, defects, pages), referenced from `skills/rollout/SKILL.md` § Phase E2 and `handoff-contract.md` § 4.
- status: pending

### Dashboard counts out-of-scope findings as open
- failure class: bookkeeping
- evidence: `dashboard.mjs` `openByPage` counted the 16 `open|out-of-scope` source-parity rows, so every verified page stayed at `deployed` and the roll-up read `optimised 0/10` while optimize reported health 100 and open 0/0/0 (run bf989f9e, I-dashboard). Adapted in the project copy (eds-conversion-log 21:44Z).
- proposed change: `skills/rollout/scripts/dashboard.mjs` — skip `fixability === 'out-of-scope'` in `openByPage` (mirror optimize.mjs § Source parity); `skills/rollout/SKILL.md` § Phase I — state that `optimised` ignores informational findings.
- status: pending
