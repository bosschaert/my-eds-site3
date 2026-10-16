# Encoder notes — template `legal` (archetype en-general-legal-notice)

Run: `node stardust/rollout/encoders/encode.mjs <slug> [--out content]` → `content/<eds-path>.html`.
Core contract is in the header comment of `encode.mjs`; modules live in `modules/<block>.mjs`.

## Section model
- `main > .o-container` → one section; ground class (is-lightgray, is-yellow, is-pastel-*, has-image)
  → section-metadata Style; is-white → none (scripts.js adds is-white).
- any other `main` child → its own section (hero: Style `full-bleed`, set by the module).
- the page `metadata` block (Title = <title>, Description, Image = og:image) closes the LAST section
  (an own metadata-only section rendered as an empty trailing section → +64px bottom padding).

## modules/hero-teaser.mjs — `.c-heroteaser--small` → block `hero-teaser (small)`
- one row per picture rendition, source `<picture>` order: row 1 `<source media=(min-width:1023px)>`,
  row 2 `(min-width:767px)`, row 3 fallback `<img>`; alt verbatim on each. Block CSS shows exactly one
  rendition per range (3 → lg|md|sm, 2 → lg|below, 1 → all). Accepts `<img>` or delivered `<picture>`.
- `.c-heroteaser-fixed` (single-slide or slider stage) is NOT matched — hero-stage-slider / a later
  module. The block moves any non-picture row into `.hero-teaser-content` (unstyled) for a text variant.
- davids-model-lint 🟡 D1 (3 image-only rows) is expected: art direction, not prose.

## modules/text-media.mjs — `.o-page__ce:has(> .row > .col > .c-media__content.is-textpic)`
- text-only CE with a plain heading header → DEFAULT CONTENT (h* + richtext). The foundation's
  default-content rhythm (3.66rem between CEs, 1.83rem header→text) reproduces o-page__ce stacking
  exactly (legal archetype: 0 px geometry delta at 1440 and 360).
- block `text-media` when the CE has gallery images, a `.c-media__meta` eyebrow, or a light heading:
  rows `[media]` (per figure: `<p><img></p>` — `<a href><img></a>` when the source picture is
  linked — then caption / creator `<p>`s) and `[text]` (eyebrow `<p>`, header headings, then the
  c-media__text children walked through the normal dispatch). Variants: image-below,
  image-left / image-right (is-image-intext), heading-light (h*.u-text-light); none = image above.
- galleries with non-image embeds (`.c-media__embed.is-video`) → returns null → the video player
  inside surfaces as UNMAPPED until a video module claims that CE (give it a higher `priority`).

## Legal siblings
Encode cleanly today (hero + text CEs only): de-impressum, de-meta-cookie-richtlinie,
de-meta-rechtliche-hinweise, en-general-cookie-policy, en-general-site-notice,
en-us-general-data-protection. `en-country-selector` / `de-country-selector` stop on
`UNMAPPED ul.c-country-selector__list` (needs a country-selector module).
Content tags that contain layout/widget markup (div, form, button, iframe, …) are UNMAPPED, never
silently flattened.
