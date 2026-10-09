---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-06T10:49:00Z
  againstInput: https://new.express.adobe.com/webpage/DYft29Wzo0QLK
  readArtifacts:
    - stardust/current/pages/webpage-dyft29wzo0qlk.json
    - stardust/current/assets/css/inline-theme.css
    - stardust/replica/lift/measure-static.json
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://new.express.adobe.com/webpage/DYft29Wzo0QLK,
promoted mechanically (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/webpage-dyft29wzo0qlk.json + Phase-3 CSS lift
→ PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-10-06T10:49:00Z).

Capture source: the page's own static mode (`?page-mode=static`) — the app mode is a
virtual-scroll renderer that stitched capture cannot measure (gate doc § Hardening rule 13);
the static mode renders the same publication, theme and fonts as a scrolling document and is
the live side of every gate.

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(3 entries: R-01 applied, R-02 applied, R-03 deferred).

Fidelity: ia verbatim · design verbatim · content verbatim.
