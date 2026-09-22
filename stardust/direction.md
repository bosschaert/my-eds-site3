---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-22T09:13:00Z
  againstInput: https://www.example.com/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
    - stardust/.labs/run.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.example.com/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-09-22T09:13:00Z). Provenance: verbatim `--prep`
promotion (extract ran in prep mode on the full one-page inventory; byte-identical copies).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Hands-off activation

Activated 2026-09-22T09:06Z by `--hands-off` on `stardust:replica` (managed migration job,
`stardust/.labs/run.json`). `state.json.handsOff: true` is stamped. Every interactive gate
auto-resolves per the master skill § Hands-off mode; quality gates run unchanged.

Named assumptions and caps for this run:

- Gate breakpoints: the run input says `desktop,mobile`; resolved to the skill's default
  widths 1440 and 360 (one gate pass each).
- Volume caps: 100 pages overall, 20 per template. Not binding: the site has one page.
- Register policy: no audit was requested, so no improvement candidates were surfaced; the
  register is empty (pure replica).
- Page typing: the single page `index` is typed `static` (informational, no marketing or tool
  indicators); it is the one archetype. There is no `direct --prep` confirmation step in
  replica mode, so the type stands as inferred.
- Dynamic surface: detector found 0 findings (no scripts, endpoints, forms, media, third-party
  hosts); `stardust/dynamic-features.md` records the null inventory.
- One canonical direction, no variant fan-out.
