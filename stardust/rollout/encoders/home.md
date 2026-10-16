# Encoder notes — template `home` (archetype en → /en)

Run: `node stardust/rollout/encoders/encode.mjs <slug> [--out content]`. Section model, metadata,
hero-stage-slider, teaser, teaser-embed, fact-box as in `hub.md` / `content.md` / `legal.md`.
Siblings: `de` (/de) and `index` (root `/` → content/index.html) — both encode cleanly today
(same video id b44d4543-…, same shapes). Modules added by this unit (files in `modules/`):

## Pre-passes (not blocks, always return null)
- `fact-box-spacer.mjs` (priority 260, `.o-container__content` / `.c-fact-box`): a fact-box text
  `<p>` ending in `<br>&nbsp;` → the trailing nbsp becomes U+200B. The pipeline trims a trailing
  `&nbsp;` and the source box loses its blank lines (113 → 91 / 68px at 1440; units gate off).

## section-background.mjs — `.o-container__bg-image` → block `section-background` (priority 300)
ONE cell `<img src="background-image url" alt="">`; variants `lucent` (is-lucent, opacity .3),
`x-left|x-center|x-right`, `y-top|y-center|y-bottom`. Emitted first in its section; section Style
`has-image` comes from the core GROUNDS. Block JS/CSS: absolute cover layer behind the section
content (section `isolation: isolate`, layer z-index -1, img object-fit cover). Its CSS also
carries the interim has-image band rhythm (foundation request filed) and zeroes the top margin
of a text-media block right after the layer. 12 captured pages carry a bg image.

## media-header.mjs — header-only CE with a `.c-media__meta` eyebrow (priority 4)
`<p>eyebrow</p><h2>…</h2>` in ONE text row of block `text-media` (+ heading-light). Header CEs
without an eyebrow stay default content.

## header-row.mjs — CE inside `.o-container__header` followed by a content row (priority 20)
Delegates to media-header.mjs / text-media.mjs; when the result is a text-media BLOCK it adds the
variant `header-row` (block margin-bottom 2.7429rem = the source header-row gap, no header margin
when header-only). Default-content results → null (normal dispatch). No effect on the legal /
content / hub archetypes (0 hits when re-encoded).

## teaser-embed-wide.mjs — col-md-8 teaser + col-md-4 iframe-widget row (priority 11)
teaser-embed.mjs rows unchanged, block class `teaser wide-narrow with-embed` (teaser-embed.mjs
alone gives cols-2). Block CSS: the share-price frame is 512px in the narrow column.

## video-player.mjs — AdmiralCloud video CE → block `video-player` (priority 12)
Video-only CE = textmedia CE whose gallery is ONE `.c-media__embed.is-video` with
`[data-ac-container]` and no header/text. The vendor video.js UI is never copied.
- Row with two non-empty columns, one video-only CE → ONE row [video cell, text cell] in source
  order; variants from the video column: col-md-4 → `narrow` (4/8 >= 1023), col-md-8 → `wide`,
  col-sm-6 only → `half`; `order-2` → `video-last-mobile`; video second → `video-right`.
- Lone video-only CE → ONE cell (full content width).
- video cell = `<p><img src="poster" alt=""></p>` (video.js `poster` = the AdmiralCloud
  deliverEmbed URL; media-reconcile keeps it, the pipeline ingests it into the media bus) +
  `<p><a href="https://player.admiralcloud.com/?v=<uuid>">same URL</a></p>` (uuid from the inline
  `new AcPlayer({ link })` script) + caption `<p>` + creator `<p>` (© line).
- text cell = the other column walked (bold rich text; a `c-button--*` link inside running text
  stays an inline c-button — block JS).
Block JS: poster + big play button; click loads player.admiralcloud.com/acplayer.js and mounts
`new AcPlayer({ container, link })`; the vendor answers 403 on aem.page / aem.live (owner
allowlist, dynamic-features row 9) → after 8s without a media element the poster comes back.
NOT handled (→ UNMAPPED, cluster adds): video CEs with a header/text in the same CE
(de-presse-mediathek media cards, en-company / de-unternehmen video + text CE).

## Home rhythm notes
- Section header rows: default content (h2 + p) already sits 2.7429rem above a following teaser
  / fact-box block (shared rules); text-media header CEs use `header-row` (above).
- fact-box (shared): the block JS equalises heads, feet AND the foot text once the block has a
  size (guarded: only boxes with foot text; the first pass ran while the section was hidden).
- Hero (shared hero-stage-slider): autoplay 8s / hoverpause; at 360 the published gate captures
  the two sides at different autoplay ticks (override in gates/all-360/overrides.json).
