---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-29T19:26:02Z
  againstInput: https://www.hydroflask.com/
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/_computed-styles.json
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.hydroflask.com/ (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift (stardust/replica/tokens.json) → PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-10-29T19:26:02Z).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md (empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Fonts: HydroFlask Sans is the brand's own self-hosted face (served from hydroflask.com, not a third-party kit); rehosted with the migrated site under the brand family name. Owner to confirm the font licence covers the new host.

## Link audit decision (rollout E2, 2026-10-29)
- Scope extension, repointed to the source (kept absolute): every internal target of the home page, nav and footer except `/` — 134 hrefs to www.hydroflask.com over ~110 distinct paths (shop categories, account, cart, search, content pages). This run's declared scope is the home page only (`stardust/.labs/site-plan.json`); none of these targets is a captured page, so none is delivered here.
- Localized: the store switcher's "United States English ($)" → `/` (nav republished).
- External targets kept as authored. Live GET: 153 × 200; facebook.com 400 to non-browser clients (environment limit); cybergrants 200 once the `&amp;` entity is decoded; www.hydroflask.com.hk fails TLS (certificate expired at the source — the source's own store-switcher target, kept verbatim, owner to note).
