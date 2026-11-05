# EDS conversion log — balbriggan.ie

- **Publish decision (2026-10-28): publish.** Decided for this run up front: every delivered page, the redirects
  sheet and the chrome documents (nav, footer) go live on the aem.live origin (deploy-batch without `--no-publish`,
  or `POST https://admin.hlx.page/live/…`).
- Target: org `aemcoder`, repo `755b9b33`, branch `main` → https://main--755b9b33--aemcoder.aem.page/ ; content via
  DA (admin.da.live), token from the job's IMS token file (`--token-file`), never written to the repo.
- Scope: one page — https://balbriggan.ie/ → DA `/index` (site root).

## archetype-home — /index (template "home") — C-ARCHETYPE

- Schema: `stardust/eds-schema/index.json` (section-schema.mjs over the gated prototype, 7 sections).
- Blocks + decode tier:
  - `hero` — template-slotted (one cell: h2 + CTA link + "Background video" link paragraph; the video
    link is consumed as the `<video autoplay muted loop playsinline>` source, `@ew-exempt config`).
    Section style `flush`; wrapper made full-bleed in hero.css. davids-model 🟡 "single-column prose
    block" justified: bespoke video band + overlay + card, not default content. The video link lives in
    the card cell (not its own cell) so D1 (embed URL alone in a block cell) does not apply — it is a
    direct mp4, not an embed player.
  - `news-carousel` — reconstructive (one row per card: image | title link). Card-as-link: href/title
    read off the authored anchor, anchor unwrapped, its <p> + picture moved. slick parity: 3 per view,
    infinite loop with aria-hidden instrumentation-stripped clones (last 3 before, all 4 after), dot
    labels "1 of 2".."4 of 2" verbatim, no auto-advance (prototype parity).
  - `explore-grid` — template-slotted (one row per tile: image | label link; overlay = card-as-link;
    hover colour #2600e6 + blue overlay + yellow border).
  - `town-map` — template-slotted. Decision: the prototype carries 12 pin links whose names exist
    (drawn as SVG <text> in the artwork), so it is a BLOCK whose 12 rows carry the pin name + link;
    the SVG (blocks/town-map/town-map.svg + pins/*.jpg) is presentational code artwork — decorate()
    inlines it and sets each pin's href from its row, and the authored <p>s are moved into a
    visually-hidden list (pin names for assistive tech). Drawn labels cannot be node-slotted into
    SVG text without value-slotting, so they stay artwork. Not a widget.
  - `documents` — reconstructive (one row per document: cover image | h4 title link; cover link
    built from the title href; even columns column-reverse via a generated class).
  - `newsletter` — template-slotted (row: h2 + intro p). The form is integration code (dynamic-features
    D1 interim): posts to https://balbriggan.ie/#gf_1 with input_1/2/3/4.1 + honeypot, as the source.
    davids-model 🟡 "single-column prose block" justified: the block owns the form + blue band.
  - Intro = default content, section style `fluid, intro` (CSS shipped scoped in hero.css; foundation
    request logged).
- Media: 13 editorial images on DA `media/home/` (da-media-upload); hero video keeps the source
  Vimeo mp4 URL (as the prototype); PDFs stay on https://balbriggan.ie/wp-content/… (not migrated).
- Links: every page other than the home page is out of scope, so links stay absolute to
  https://balbriggan.ie/… (localize-links --check PASS, 0 localizable).
- Headings: the source/prototype has no <h1> (hero title is h2); kept as the prototype —
  delivery-lint P0 `h1` (0 found) is a recorded source-parity exception.
- Heading/text encoding: "Céard eile atá ag tarlú?" uses combining accents (NFD) as the source.
- Delivered (commit 0aaa6e8 code+content; deploy-batch PUT→preview→publish /index live).
  Gate root: `--main ":not(:not(#homepage-wrapper):not(main))"` — the live #homepage-wrapper is a div
  with a nested intro-only <main>, the build root is <main>; this comma-free selector resolves the
  content root on both sides (a plain `#homepage-wrapper` fell back to <main> on both = intro only).
  pub2 --full: 1440 2.48% Δh1 / 360 6.74% Δh1, content-diff 0🔴 / 0 nothing-lost🟡 (75 advisory:
  sr-only pin-link EXTRA, foundation-set link titles, Gotham→Sora face), clip 0 / 2 (allow 2),
  overflow ok; gate-all rows 1440 PASS / 360 PASS (state.json page → deployed for gate-all).
  Crop: header 2.68% @1440 (frozen-foundation nav glyph substitution, accepted PAIR residual) / 0.77%
  @360; footer 0.26% / 0.69%.
- Residuals: hero Vimeo mp4 answers 403 / ERR_BLOCKED_BY_ORB upstream — identical on the live site
  (same URL), so the band renders as the blue overlay on both; ai-readability code 92% (main servedGap
  0 with allowlist stardust/.work/rollout/archetype-home/ai-allow.json for code-generated form labels,
  carousel controls, SVG artwork text; the remaining 38 words are header/footer chrome from the
  foundation nav/footer documents); delivery-lint P0 h1 kept (source parity).
