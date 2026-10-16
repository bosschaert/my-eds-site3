---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-09T17:35:18Z
  againstInput: https://www.continental.com/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.continental.com/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-10-09T17:35:18Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica; measured divergences kept verbatim are listed there for the record).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Hands-off activation (2026-10-09T17:35:18Z)

Run hands-off (`--hands-off`): every interactive gate auto-resolves; every quality gate runs at
full strength. Named assumptions:

- **Scope** — fixed by `stardust/.labs/site-plan.json` (100 selected pages; 99 exist on the
  source, `/en/investors/api-events/` answers 404). No volume cap beyond the plan.
- **Gate breakpoints** — run.json `breakpoints: "desktop,mobile"` → the replica defaults 1440 and 360.
- **Consent state** — captured and gated in the "Reject all" state of the consentmanager.net CMP
  (the first-visit page a visitor sees once the banner is answered); the banner itself is
  platform chrome delivered by the CMP script, not recreated.
- **Brand font** — ContinentalStagSansW is a licensed corporate face. It is NOT rehosted on the
  new origin: the delivered @font-face references the owner's existing font files on
  cdn.continental.com (served with `Access-Control-Allow-Origin: *`), the brand family name
  first in the stack and a metric-matched system fallback after it.
- **Publish decision** — publish (recorded in stardust/eds-conversion-log.md).
- **Page types** — nine, inferred from URL + component composition (see journal, Extract).

## E2 link audit — named decision: out-of-scope targets repointed to the source site (2026-10-10)
- The page scope is fixed at the 100 selected pages of the site plan (99 delivered + the 2 dynamics-built search endpoints). Every internal target outside it is SCOPE EXTENSION, not a capture gap, and is repointed to https://www.continental.com regardless of count.
- Chrome: 607 distinct root-relative targets in the nav/footer documents (20 docs, 622 hrefs) answered 404 on the new origin; all repointed to the source site (spot check 10/10 → 200 on the source). List: `stardust/rollout/e2-repointed-targets.txt`.
- Page bodies: `localize-links.mjs --check` passes (0 localizable); the absolute source-host links that remain (~420 targets: PDFs under /fileadmin, press releases, IR sub-pages …) are the honest scope boundary, kept absolute.
- Other-locale roots: the 10 captured locale roots are delivered; locale subtrees beyond them are listed in `stardust/state.json` `site.captureGaps` and stay on the source site.
