---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-28T09:18:45Z
  againstInput: https://balbriggan.ie/
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/replica/tokens.json
    - stardust/current/_computed-styles.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://balbriggan.ie/,
promoted mechanically (no direct invocation, no creative decisions).

Synthesized (bounded-single): current/pages/index.json + Phase-3 CSS lift
(stardust/replica/tokens.json) → PRODUCT.md · DESIGN.md · DESIGN.json (at 2026-09-28T09:18:45Z).
Bounded entry (`extract --single --dynamics`): current/PRODUCT.md, DESIGN.md, DESIGN.json do not
exist, so nothing was promoted verbatim. A later site-scope re-run with `--prep` replaces this
synthesized spec with the verbatim promotion.

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Scope: one page (https://balbriggan.ie/, slug `index`, page type `home`), fixed by
stardust/.labs/site-plan.json. The site root of the new host resolves to it. No siblings.

Fonts (amended in recreate, 2026-09-28): the theme's style.css imports fonts/font.css, which declares
GothamBold / GothamBook / GothamMedium / Gotham-Light as self-hosted webfonts — a licensed commercial
kit. Per the replica fonts policy nothing is rehosted: every stack keeps the Gotham family name first
and falls to a self-hosted Montserrat face (OFL) chosen by measured glyph widths (Light→400,
Medium→500, Bold→700). A licensed Gotham drop-in supplied by the owner wins without a code change.
The earlier note that no @font-face existed was wrong (the @import was missed).

Dynamic surface: stardust/dynamic-features.md (7 rows, every row dispositioned) and
stardust/dynamic-features-plan.md. Hands-off decisions recorded by name there: newsletter form
posts to the source handler until an endpoint is supplied; no tags load on the preview host.

## Hands-off activation
Hands-off mode activated at run start (`--hands-off`); `state.json.handsOff: true`. Every
interactive gate auto-resolves per the master skill § Hands-off mode; approvals are recorded as
`approvedBy: "hands-off"` after the gates pass. Breakpoints: 1440 (desktop) and 360 (mobile).

## Link audit — repointed targets (E2-link-audit, 2026-09-28)
Scope is one page (the home page at `/`); there are no captured siblings and no capture gaps
(`state.json.site.captureGaps` empty). Every internal href on the delivered documents (`/`, `/nav`,
`/footer`) is root-relative and extensionless (`/`, `/styles/styles.css`, `/favicon.png`). The four
`href="#"` anchors are the source nav's Bootstrap dropdown toggles, carried verbatim (4 in the capture,
4 delivered). **Scope extension → repoint**: 48 links on 26 distinct source-site paths
stay absolute on `https://balbriggan.ie` because those pages are outside this run's declared scope;
every one answers 200 on the source site (evidence `stardust/rollout/link-audit.json`). Listed as
scope debt for a later run: `/town-transformation`, `/news`, `/education-skills-training`, `/community-development`, `/economic-development`, `/sustainability-climate-action-and-biodiversity`, `/downloads`, `/contact`, `/loves-learning-festival/loves-learning-festival-2023`, `/faq`, `/e15-million-harbour-square-will-be-heartbeat-of-balbriggan`, `/prestigious-musical-theatre-degree-and-masters-to-be-offered-in-balbriggan`, `/balbriggan-to-be-seen-by-millions-worldwide-as-it-hosts-nfl-draft`, `/planning-for-balbriggan-swimming-pool-moves-to-next-phase`, `/wp-content/uploads/2020/08/ar_dturas.pdf`, `/wp-content/uploads/2020/06/our-journey-newsletter.pdf`, `/wp-content/uploads/2021/11/web-a3-balbriggan-irish.pdf`, `/wp-content/uploads/2021/11/web-a3-balbriggan-english.pdf`, `/newsletters`, `/smart-balbriggan`, `/urbact-iplace`, `/time4eu`, `/leadership-governance`, `/the-team`, `/loves-learning-festival`, `/community-platform`.
External targets (LinkedIn, Instagram, Facebook, Twitter, fingalcoco.ie, fingal.ie privacy policy, the
Vimeo hero mp4) are kept as captured.
