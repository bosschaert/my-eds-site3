---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-05T15:16:00Z
  againstInput: https://garden-eight.com/
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/replica/tokens.json
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://garden-eight.com/,
promoted mechanically (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift
(stardust/replica/tokens.json) → PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-10-05T15:16:00Z).
Provenance `bounded-single`: this run migrates exactly one page; a later site-scope re-run with
`extract --prep` replaces this spec with the verbatim promotion.

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Hands-off activation (2026-10-05T15:02Z)

`--hands-off` on the `stardust:replica` invocation: `state.json.handsOff: true`. Every interactive
gate auto-resolves per the master skill § Hands-off mode; quality gates run unchanged.

## Named assumptions (hands-off)

- **Scope:** one page, `index` (https://garden-eight.com/), the home template; no siblings, no
  volume cap needed. The site root of the preview/live origin resolves to it.
- **Flow:** `replica`, `flowSource: user-phrase` (the invocation is the keep-design phrase).
- **Fonts:** the site self-hosts `gunsan` and TWK Lausanne (200/300/400) under its own
  /assets/fonts with no CORS headers. For the local prototype gate the four woff2 files are loaded
  from the capture copies under stardust/current/assets/fonts/ (evidence, not served). For
  delivery, the files are treated as the site owner's own self-hosted font assets moving with the
  owner's own site to the owner's new origin — a migration of the owner's asset, not a re-host on a
  third party's domain; `lausanne` / `gunsan` stay first in every font stack so a replacement kit
  drops in without a code change. Surfaced to the owner in stardust/eds-conversion-log.md: the
  owner confirms that the TWK Lausanne licence covers the new origin, or supplies a substitute.
- **WebGL canvas (capture-state):** the fixed three.js canvas paints the beige surface and floating
  3D models; it is replicated as captured — a static CSS paint of the sampled canvas colour — not
  re-implemented (video/animated hero rule, recreation-procedure § capture-state). Logged as an
  expected residual of the pixel gate.
- **Scroll-jacked page:** the live document is 900 px tall with main translated by the site's
  scroller; the gate's stitched capture cannot scroll it (gate doc § Hardening 13). The prototype
  scrolls natively; the pixel probe is run on what can be measured and the breakpoint is recorded
  per the gate contract, with content-diff / visual-diff carrying the structural verdict.
- **Publish decision:** publish (given in the run brief; recorded in stardust/eds-conversion-log.md).

## Link-audit decision — out-of-scope targets repointed to the source (2026-10-05, rollout E / E2)

Scope extension, not a capture gap: this run migrates the home page only (site-plan selects `/`). The ten internal targets the page, nav and footer link to are outside the declared scope and are repointed to the same path on the source site, as absolute hrefs, in `content/index.html`, `content/nav.html` and `content/footer.html`: `/about`, `/cases`, `/ja` (other locale, root never captured), `/faq`, `/contact`, `/archives`, `/ai`, `/cases/photoyoshi`, `/cases/phil-studio`, `/cases/anai-wood`. The redirects sheet (`/redirects.json`, D-site) keeps the same ten rows so inbound requests for those paths on the new origin never 404. When those pages are migrated later, `localize-links.mjs --source-host garden-eight.com` folds the hrefs back to root-relative form. Link text, order and visible rendering are unchanged.
