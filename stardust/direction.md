---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-08T09:27:26Z
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
current/DESIGN.json → DESIGN.json (at 2026-10-08T09:27:26Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Hands-off: activated at 2026-10-08T09:27:26Z (`--hands-off` on `stardust:replica`); `state.json.handsOff: true`.
Approvals are recorded as `approvedBy: "hands-off"` after every gate passes. One canonical
direction; no variant fan-out. Volume: 1 page in scope (the run's site plan), 1 template.

Named assumptions:
- Colour scheme: the source declares `color-scheme: light dark`; the gate captures and the
  delivered page reproduce the light scheme (background #eee), the state the capture recorded.
- Scope is fixed to the site plan (1 page); no sibling discovery, no brand-sources.
