---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-23T18:41:35Z
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
current/DESIGN.json → DESIGN.json (at 2026-09-23T18:41:35Z). Provenance: verbatim `--prep` promotion
(extract ran with `--prep --dynamics --pages https://www.example.com/`; the descriptive files exist).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Hands-off activation (2026-09-23T18:41:35Z)

Hands-off mode active (`--hands-off`): `state.json.handsOff: true`. Interactive gates auto-resolve;
prototype approval is granted only after the source-fidelity gate passes at every breakpoint and is
recorded as `approvedBy: "hands-off"`. Quality gates run at full strength.

## Named assumptions

- Gate breakpoints: run.json says `desktop,mobile`; mapped to the skill defaults 1440 and 360.
- Page scope: the one `selected: true` page in stardust/.labs/site-plan.json (`/`, slug `index`,
  type `static`). No fan-out, no siblings. Volume caps are moot.
- Flow: `replica`, source `user-phrase` (the `replica` skill was invoked directly).
- Fonts: the source uses `system-ui, sans-serif` with no web fonts; the replica uses the same stack.
  Rendered glyphs depend on the platform font, which is identical on both sides of the gate.
