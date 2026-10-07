---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-06T10:17:45Z
  againstInput: https://static-website.david-bosschaert.workers.dev/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of
https://static-website.david-bosschaert.workers.dev/, promoted verbatim
(no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-10-06T10:17:45Z). Provenance: verbatim `--prep`
promotion (full-prep branch; byte-for-byte copies, no per-variant files).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(2 entries, both deferred — no applied delta; effectively a pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Dynamic surface: stardust/dynamic-features.md + stardust/dynamic-features-plan.md
(dynamics Phases 1–3, run inside this phase).
