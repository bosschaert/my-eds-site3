---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-11-02T21:20:23Z
  againstInput: https://www.doosanbobcat.com/en
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.doosanbobcat.com/en,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-11-02T21:20:23Z). Provenance: verbatim --prep promotion (scoped by --pages to the 2-page run plan).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Hands-off: activated 2026-11-02T21:20:23Z by the run invocation (--hands-off). Roster fixed by stardust/.labs/site-plan.json (2 pages; caps not applicable). Publish decision: publish (made by the run owner).

## Decision — out-of-scope link targets (E2 link audit, 2026-11-02)
SCOPE EXTENSION (outside the run's fixed 2-page plan): every internal target other than `/en` and `/en/management/esg_result` — the product, about, investment, media center, contact and other management pages linked from the home page, nav and footer (~90 distinct paths) — is repointed to the source site `https://www.doosanbobcat.com<path>`. No capture gaps (the plan is fixed). No internal link 404s on the delivered tree.
