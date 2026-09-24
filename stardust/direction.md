---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-24T09:52:37Z
  againstInput: https://sorra.jp/
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/assets/css/main.css
    - stardust/replica/lift/tokens.json
    - stardust/replica/lift/measure-live.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://sorra.jp/,
promoted mechanically (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift
→ PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-09-24T09:52:37Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Decision — E2 link audit: scope extension, repoint to source (2026-09-24)

This run migrates exactly one page (https://sorra.jp/ → `/`). Every other internal target
on the page, the header (`/nav`) and the footer (`/footer`) lies outside the declared scope
(the direction's caps never meant to include it), so it is SCOPE EXTENSION → repointed to the
source site verbatim (the captured absolute hrefs), never left as a 404 on the new origin.
Repointed (22 paths, 38 hrefs): /about, /contact, /journal, /journal/1300/, /journal/1310/,
/journal/1316/, /qa, /recruit, /service_flow, /works-category/architecture/,
/works-category/indoor-green/, /works-category/landscaping/, /works/1041/, /works/1085/,
/works/1148/, /works/1151/, /works/1223/, /works/1225/, /works/474/, /works/479/, /works/632/.
Kept root-relative: `/` (the delivered page). External: https://www.instagram.com/sorra.jp,
tel:. Every target GET → 200 (24/24, incl. the preview root) on 2026-09-24. When sibling
pages join a later run, `localize-links.mjs` turns these back into root-relative links as
each target ships (scope debt: none — nothing in scope was left out).
