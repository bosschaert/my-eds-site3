---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-23T13:26:50Z
  againstInput: https://static-website.david-bosschaert.workers.dev/page1
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://static-website.david-bosschaert.workers.dev/page1,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-09-23T13:26:50Z). Provenance: verbatim `--prep` promotion.

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Hands-off activation

Hands-off mode activated at 2026-09-23T13:26:50Z (`--hands-off` on the replica invocation). All interactive gates auto-resolve; quality gates run unchanged. Prototype approval is recorded as `approvedBy: "hands-off"`.

Named assumptions and caps:
- Flow: replica, chosen by the invocation (`flowSource: user-phrase`).
- Roster: both discovered pages (`/` = landing archetype `index`, `/page1` = static archetype `page1`); volume caps (100 overall / 20 per template) are not reached. `/page2` exists but is unlinked and was not discovered — out of roster.
- Gate breakpoints: desktop = 1440, mobile = 360 (run.json "desktop,mobile").
- Fonts: the source declares Poppins / Playfair Display but loads neither on the roster pages; the replica keeps the declared stack and loads nothing, so the rendered fallback faces match. (Not a register entry — nothing changes.)
- Register: no audit run, no user-supplied items → empty register (hands-off policy: adopt none).
