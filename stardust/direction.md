---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-23T18:47:00Z
  againstInput: https://www.niravmanubhai.com/
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/pages/index.html
    - stardust/current/assets/css/ (10 linked stylesheets + inline-styles.css + google-fonts.css)
    - stardust/replica/lift/live-measure.json
    - stardust/replica/lift/tokens.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of
https://www.niravmanubhai.com/, promoted mechanically (no direct invocation,
no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift
→ PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-09-23T18:47:00Z).
`stardust/current/PRODUCT.md` / `DESIGN.md` / `DESIGN.json` do not exist on this
run (bounded `extract --single`), so there was nothing to promote verbatim;
every value in the synthesized spec traces to the captured JSON or a lifted
CSS/measured value. When this pilot grows to site scope, a `--prep` extract
REPLACES the synthesized spec with the verbatim promotion.

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Flow: replica (flowSource: user-phrase — the run invoked `replica` directly).
Gate breakpoints: 1440 and 360 (run.json `desktop,mobile`).

## Hands-off activation

Hands-off mode activated 2026-09-23T18:27Z by `--hands-off` on the replica
invocation. `state.json.handsOff: true`. Interactive gates auto-resolve per
the master skill § Hands-off mode; quality gates run unchanged.

Named assumptions (hands-off):
- Scope is exactly one page (`/`), per `stardust/.labs/site-plan.json`; links
  to room pages keep their source paths and are not migrated.
- Third-party tags (GA4 `G-00QDEH6N5W`, Cloudflare Web Analytics) are not
  loaded on the preview host — an owner decision recorded in
  `stardust/dynamic-features.md` § Decision batch.
- `hreflang` alternates are decided out (single page, single language).
- Fonts: Google Fonts under the OFL, self-hosted from the intercepted files —
  no substitution needed.

## Dynamic surface

`stardust/dynamic-features.md` — 7 rows, every row has a disposition
(2 rebuild-native chrome interactions ship with the archetype; 3 tags
embed-passthrough interim; 1 static-snapshot; 1 decided-out).
Plan: `stardust/dynamic-features-plan.md`.

## Link scope decision (E2-link-audit, 2026-09-23)

Scope is one page (`/`). Every internal target the home page, `/nav` and `/footer` link to is a SCOPE EXTENSION (outside the declared one-page scope) and is repointed absolute to the source site rather than delivered: `/axiom-stories`, `/come-sit-just-ask`, `/contact.html`, `/house-specials`, `/house-specials.html`, `/kabir-vaidya`, `/kabir-vaidya.html`, `/license.html`, `/my-books.html`, `/my-study`, `/now`, `/patrons`, `/privacy.html`, `/quiet-signal`, `/quiet-signal.html`, `/sitemap`, `/stills`, `/stills.html`, `/story-bouquet`, `/story-nursery`. No capture gap: none of these was ever selected in `stardust/.labs/site-plan.json`. External targets are kept as authored.
