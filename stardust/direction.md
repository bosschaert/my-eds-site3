---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-28T14:20:46Z
  againstInput: https://balbriggan.ie/
  mode: bounded-single
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/replica/lift/tokens.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://balbriggan.ie/ (no direct invocation, no
creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift (stardust/replica/lift/tokens.json)
→ PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-10-28T14:20:46Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md (empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Publish decision (owner, pre-recorded for this run): publish — delivered pages, redirects and chrome documents go live.

## Link boundary decision — E2 link audit (2026-10-28)

Scope is fixed at one page (the home page). Every other balbriggan.ie target linked from the page, nav and footer
(26 distinct paths: /town-transformation, /news, /faq, /contact, /downloads, the news articles, the PDF downloads, …)
is SCOPE EXTENSION outside the declared cap → kept as absolute links to the source site (repointed, never 404).
`localize-links.mjs --check` PASS (0 localizable). GET of all 34 hrefs from the live page, nav and footer: 32 × 200;
2 × 403 that are vendor-side and identical on the source (Vimeo external MP4, LinkedIn bot wall).
