---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-01T13:48:12Z
  againstInput: https://www.thebeastisback.com/
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/replica/lift/tokens.json
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.thebeastisback.com/,
promoted mechanically (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift
→ PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-10-01T13:48:12Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Hands-off activation
Activated 2026-10-01T13:48:12Z by `--hands-off` on `stardust:replica`. Flow `replica` (flowSource user-phrase). One canonical direction, no variants. Scope: exactly one page (`/`), no siblings; the site root resolves to it. Publish decision: publish (recorded by the run brief).

## Named assumptions
- Fonts: PT Serif and Source Sans Pro are open faces; the live site loads them through Squarespace's Typekit kit, the replica self-hosts the Google Fonts builds (PT Serif 400, Source Sans 3 variable). Any metric difference is a logged residual, not a substitution.
- The masonry column model between 750px and 1440px is encoded from four measured widths (see tokens.json grid.measured); only 1440 and 360 are gated.

## Link-audit decision — out-of-scope targets (rollout E2, 2026-10-01)
**Scope extension, not a capture gap.** The run's fixed scope is the home page only. The 99 root-relative targets linked from the delivered content (`/about`, `/blog`, `/contact` and the 96 project pages) stay on the current site: the published redirects sheet forwards each (slash and slashless form) to the same path on `https://www.thebeastisback.com/` (301). Full list: `stardust/redirects.tsv`; audit evidence: `stardust/rollout/link-audit.json` (102 hrefs, 102 ok).
