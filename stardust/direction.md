---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-13T14:43:31Z
  againstInput: https://balbriggan.ie/
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/replica/lift/tokens.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://balbriggan.ie/,
synthesized mechanically (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift → PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-10-13T14:43:31Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(1 entry — font substitution forced by licensing; otherwise pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Link scope decision (rollout E2, 2026-10-13)

The run's page scope is fixed to the home page. Its 28 other balbriggan.ie link targets (menus, footer, cards, map pins)
are SCOPE EXTENSION and stay pointed at the source site (absolute https://balbriggan.ie/… URLs, all answer 200);
external targets kept as authored. No link on the delivered page 404s.
