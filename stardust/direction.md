---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-13T10:43:04Z
  againstInput: https://current-design.jp/
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/replica/lift/tokens.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://current-design.jp/, synthesized descriptively (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift → PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-10-13T10:43:04Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md (1 entry — R-01 licensed font substitution).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Link-audit decision — out-of-scope internal targets repointed (2026-10-13)

The run's scope is the home page only (site-plan.json selects one page). Every other internal target is a SCOPE EXTENSION, not a capture gap, so it is repointed to the source host (absolute https://current-design.jp/… links) rather than delivered: /welcome, /service (+ #designwork, #brandingdesign, #conceptcreation), /works (+ /works/halo, /works/mizkaraproject, /works/nihonvarity), /company, /news (+ /news/260529, /news/voice_aru-hairdesign, /news/voice_eyokokai, /news/category/voice), /contact. Scope debt: these 16 paths, for a later run. Logo/Home links stay root-relative (`/`).
