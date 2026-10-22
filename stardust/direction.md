---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-14T09:00:21Z
  againstInput: https://www.skerriesmills.ie/
  mode: bounded-single
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/replica/lifted-tokens.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.skerriesmills.ie/,
synthesized from the capture (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift → PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-10-14T09:00:21Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md (empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Link-audit decision — scope extension repointed to the source (2026-10-14, rollout E2)

- Declared scope: one page (`/`). The home page, nav and footer link 33 distinct www.skerriesmills.ie pages
  outside that scope → SCOPE EXTENSION: kept absolute to the source site (all 33 answer 200), never authored
  from a live read. List: `stardust/rollout/scope-extension-targets.txt`.
- The root link is root-relative `/` (200 on …aem.live). External targets kept verbatim; prf.hn affiliate and
  weareopen.ie answer 403 to a bare curl (bot wall), identical hrefs on the source.
