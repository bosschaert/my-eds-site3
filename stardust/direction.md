---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-12T13:02:46Z
  againstInput: https://www.niravmanubhai.com/
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/replica/tokens.json
    - stardust/current/_computed-styles.json
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of
https://www.niravmanubhai.com/, promoted mechanically (no direct invocation, no creative
decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift
(stardust/replica/tokens.json) → PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-10-12T13:02:46Z).
Bounded entry: `extract --single --dynamics`; no current/PRODUCT.md, DESIGN.md or
DESIGN.json existed to promote verbatim. A later site-scope re-run with `--prep` replaces
this synthesized spec with a verbatim promotion.

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Breakpoints: source breakpoints kept (no --target-breakpoints). Gate widths 1440 and 360.

Dynamic surface: stardust/dynamic-features.md (6 findings, every row dispositioned;
tags scaffolded off pending the owner's decision, recorded by name).

## Link-scope decision — SCOPE EXTENSION, repointed to the source (2026-10-12, E2-link-audit)

This run's scope is fixed to one page (`/`). The delivered page, `/nav` and `/footer` carry 17 internal
targets that are outside the declared scope and were never captured — a scope extension, not a capture gap
(`state.json` has no `site.captureGaps`; the page cap was the single URL). Decision: every such target stays an
absolute link to the source origin `https://www.niravmanubhai.com`, so no visitor meets a 404 on the new tree;
`localize-links.mjs --check` PASS with these KEPT absolutes (re-run after a wave that ships them):
/axiom-stories /come-sit-just-ask /contact /follow /house-specials /kabir-vaidya /license /my-books /my-study
/now /patrons /privacy /quiet-signal /sitemap /stills /story-bouquet /story-nursery.
External targets (Substack, WhatsApp, Facebook, Instagram, LinkedIn, mailto) are kept as authored.
