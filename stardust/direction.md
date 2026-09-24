---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-23T19:12:11Z
  againstInput: https://balbriggan.ie/community-development/
  readArtifacts:
    - stardust/current/pages/community-development.json
    - stardust/replica/lift/tokens.json
    - stardust/replica/lift/live-measure.txt
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of
https://balbriggan.ie/community-development/, promoted mechanically (no direct
invocation, no creative decisions).

Synthesized (bounded-single): current/pages/community-development.json + Phase-3 CSS lift
→ PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-09-23T19:12:11Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(1 entry — R-01, font substitution for the licensed Gotham kit).

Fidelity: ia verbatim · design verbatim · content verbatim.

Hands-off mode activated at run start (2026-09-23T19:12:11Z): prototype approval is granted by the agent's
own judgment after all gates pass (approvedBy: hands-off); one canonical direction; scope is
exactly one page (stardust/.labs/site-plan.json), which the site root must resolve to.

Named observations (not deltas):
- Font stacks (Gotham-Light / GothamMedium / GothamBold) are declared by the theme but never
  loaded; the live page renders in the browser fallback face. Stacks are carried verbatim, so the
  rendering is identical on both sides of the gate and on the delivered site. No substitution.
- The Google Fonts links (Open Sans, Libre Baskerville) are loaded by the page but no element on it
  uses them; they are not carried (a dropped unused stylesheet changes no pixel).
