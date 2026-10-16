# Encoder notes — template `stories` (archetype en-stories)

Run: `node stardust/rollout/encoders/encode.mjs <slug> [--out content]`. Sibling: `de-stories` (the
only other page with `c-cs-*` modules). No core change was needed.

## Section model
Each `main > section.o-container` (py-0 / my-8 c-cs-article-cluster__container) is one section with
no ground (is-white). The block CSS owns the band rhythm through the section class:
`main > .section.cs-stage-container` padding 0; `main > .section.cs-article-cluster-container`
margin 88px 0, padding 0 (source my-8 py-0). Both blocks' wrappers carry the 1460 content cap.

## modules/cs-stage.mjs — `.o-container__content:has(> article.c-cs-stage)` → block `cs-stage`
- row intro: `h1.u-cs-text--h1` → `<h1><strong>bold </strong>light</h1>` (whitespace between parts
  kept as one space) + `.u-cs-text--subtitle` → `<p>`.
- row media: one `<p><img></p>` per `<picture>` rendition, source order (3 → ≥1279 | 767–1278 | <767).
  Lazy pictures: `data-srcset` / `data-src` are the settled URLs (src/srcset = lazy placeholder).
- row text: `.c-cs-stage__label` → `<p>`, `.c-cs-stage__title` → `<h3><strong>bold</strong> thin</h3>`,
  popup `<p>`s, CTA → `<p><strong><a href>Read article</a></strong></p>` (a.button; the block
  reuses its href for the presentational overlay link). Exports `lazyPictureImgs`, `splitHeading`.

## modules/cs-article-cluster.mjs — `.o-container__content:has(a.c-cs-article-cluster__teaser)`
Block `cs-article-cluster` (variant `wide-first` when the first card column is `col-lg-8`; a wide
card elsewhere → WARN, rendered normal). Rows:
- heading: `h2.u-cs-text--h2` → `<h2><strong>bold </strong>light</h2>`.
- featured (`.c-cs-article-cluster`): `[<p><img></p>]` | eyebrow `<p>`, `<h3>`, teaser `<p>`,
  `<p><strong><a href>Read article</a></strong></p>` — the BOLD CTA marks the featured story.
- card (each teaser column): `[<p><img ≥767></p><p><img <767></p>]` | eyebrow `<p>`, `<h3>`,
  teaser `<p>` (empty ones dropped), `<p><a href>Read article</a></p>` (plain link = card).
- load-more (`button[data-constories-loadmore]`): a text-only row `<p>More articles</p>`, then the
  card rows the constories endpoint returns, read from the captured snapshot
  `stardust/prototypes/assets/stories-api/<contentElement>-offset<offset>.html` (parsed from
  `data-constories-xhr`). The block hides every card after that row until the button is pressed.
  No snapshot → button dropped, captured cards kept, `WARN … dynamic-dependency` (log it).
  **de-stories needs 183620-offset6.html and 183736-offset4.html** (fetch the `data-constories-xhr`
  URLs server-side from www.continental.com into that folder before encoding; the live API sends no
  CORS headers, so the browser can never call it).

## Lint
davids-model-lint 🟡 D1 on cs-stage (prose-only rows: the stage is a positioned widget with a
hover popup + overlay link) and 🟡 D3 on cs-article-cluster (1-cell heading / more rows beside
2-cell story rows) — both expected.

## captureState restoreAtDelivery (all implemented)
- lazy images → native `loading="lazy"` on card/featured images; cs-stage sets `eager` on the
  rendition matching the current breakpoint.
- constories "More articles" → authored hidden card rows revealed on click (no XHR at runtime).
- stage popup → CSS `:hover` / `:focus-within` on `.cs-stage-article` (desktop off-canvas).

## Gate at 360
Headless Chromium shell and real Chrome set several 360 text blocks at different heights on both
origin and EDS; gate-all mixes them (origin headed, EDS headless) → 12.9 % Δh +20. Symmetric
headed capture 3.49 % Δh +2; override recorded in stardust/replica/gates/all-360/overrides.json.
