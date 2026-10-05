---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-28T07:24:36Z
  againstInput: https://www.example.com/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.example.com/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-09-28T07:24:36Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Hands-off activation

Activated at 2026-09-28T07:24:36Z by `--hands-off` on `stardust:replica`. Every interactive gate
auto-resolves per the master skill § Hands-off mode; quality gates run unchanged.

Named assumptions and caps:
- One canonical direction (preserve); no variant fan-out.
- Roster: the single selected page in stardust/.labs/site-plan.json (/, slug `index`,
  type `landing`). Volume caps are moot at 1 page; no page outside the plan is added.
- Register source: none (no audit requested, no `--register`) → adopt none.
- Font policy: the source uses `system-ui, sans-serif` — no webfont to rehost or substitute.
