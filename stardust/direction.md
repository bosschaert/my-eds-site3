---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-05T10:17:37Z
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
current/DESIGN.json → DESIGN.json (at 2026-10-05T10:17:37Z). Provenance: verbatim `--prep` promotion
(extract ran `--prep --dynamics --pages /`; the full descriptive synthesis exists, so the
bounded branch does not apply).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Hands-off activation

Hands-off mode activated at 2026-10-05T10:17:37Z by `--hands-off` on `stardust:replica`.
`state.json.handsOff: true`. Every interactive gate auto-resolves; every quality gate
runs at full strength. Prototype approval is recorded as `approvedBy: "hands-off"`
only after the source-fidelity gate passes at every breakpoint.

Named assumptions:
- Scope: the one page selected in `stardust/.labs/site-plan.json` (`/`). Volume caps are
  moot; no roster beyond it is built.
- Breakpoints: `desktop,mobile` from run.json → 1440 and 360 (the replica defaults).
- Color scheme: the source declares `color-scheme: light dark`; the captured and gated
  state is light. The target keeps the same declaration so dark-scheme visitors keep
  seeing what they see today.
- Publish decision: publish (made by the run; recorded in stardust/eds-conversion-log.md).
