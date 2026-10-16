# EDS conversion log — continental.com

## Publish decision (2026-10-09)

Decision: **publish**. Every delivered page, the redirects sheet and the chrome documents (nav, footer and their locale variants) go live on the aem.live origin (deploy-batch.mjs without --no-publish, or POST https://admin.hlx.page/live/…). Decided by the run brief; not re-asked.

## C0 foundation (2026-10-09)

- Chrome decode tier: **template-slotted** (header, footer, social band). Authored nav/footer nodes are
  moved into the canon chrome template; the off-canvas tree and the dropdown title (when no alt h3) are
  presentational clones (EW4, stripInstrumentation). Exempt (`@ew-exempt`): search placeholder /
  aria-labels read from authored link text.
- EW7 deviation recorded by chrome-parity: live `<button>` nav triggers / language button are `<a role=button>`
  (no `<button>` may host authored text); footer column labels / copyright are `<p>` (live `<div>`).
- Chrome documents: 10 locale pairs (/en, /de, /cs-cz, /sk-sk, /pt-pt, /en-pt, /es-mx, /fr-fr, /ro-ro,
  /en-us) generated verbatim from each locale's capture (stardust/.work/foundation/gen-chrome.cjs), Robots noindex.
- Shell: /en/general/legal-notice as default content only (legal archetype unit replaces it).
- Lint: clean (eslint airbnb-base, stylelint standard; per-file `no-descending-specificity` disable keeps the
  source cascade order); `lint:breakpoints` wired (no target set in DESIGN.json → skipped).

## C-archetype legal — en-general-legal-notice (2026-10-09)

- Blocks: `hero-teaser` (variant small) — template-slotted (art-directed renditions moved into
  range slots); `text-media` — template-slotted (header / gallery / richtext slots). Encoder core
  `stardust/rollout/encoders/encode.mjs` + modules hero-teaser, text-media; notes in
  `stardust/rollout/encoders/legal.md`.
- Text-only c-media CEs are authored as default content (David's model; foundation default-content
  rhythm equals o-page__ce stacking). The legal archetype therefore has 1 block (hero-teaser);
  text-media is exercised by image CEs on sibling templates (render-harness --ew: 7/7 editable).
- davids-model-lint 🟡 D1 on hero-teaser (3 image-only rows): justified — art-directed renditions
  (1920×327 / tablet / 800×454) differ in aspect ratio, one image cannot reproduce the hero height.
- qa-gate cap row (DESIGN.json containerMaxWidth 1920 vs content cap 1460 at 2560) fails on the
  default-content wrapper the foundation owns; prototype carries the same 1460 cap — not a block defect.

## C-archetype home — en (2026-10-09)

- Blocks: NEW `video-player` (template-slotted: poster / play / caption / text-column slots; D3
  AdmiralCloud embed on click, poster fallback when the vendor refuses the host), NEW
  `section-background` (template-slotted: o-container__bg-image layer). Shared, additive only:
  text-media variant `header-row`; teaser `wide-narrow.with-embed` 512px frame; fact-box guarded
  equalise re-run (boxes with foot text). Encoder modules + notes: stardust/rollout/encoders/home.md.
- Section schema: stardust/eds-schema/en.json from an annotated copy (one data-section per block,
  stardust/.work/archetype-home/annotate.cjs). qa-gate PASS 39/0/0; block-roundtrip --ew
  video-player 4/4 editable, section-background 0/0. Whole page: pre-existing EW findings in the
  shared hero-stage-slider (7 dead: textLine moves childNodes) and fact-box (6 dead), teaser
  URL-display embed link (by design), text-media role swap on the light h1 — not touched (shared).
- davids-model-lint 🟡 D1 section-background (image-only layer, decorative), D1 text-media eyebrow
  header (bespoke c-media__meta styling), D3 teaser with-embed (embed row is one cell by design).
- Published gate: 1440 2.42 % Δh 2 PASS; 360 16.09 % Δh 0 → override (headed-both 4.08 % Δh 2;
  hero autoplay tick). Crop 1440 header 1.27 % / footer 0.92 %.
