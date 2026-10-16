# Encoder notes — template `hub` (archetype en-investors → /en/investors)

Run: `node stardust/rollout/encoders/encode.mjs <slug> [--out content]`. Section model, metadata,
text-media, teaser, figure as in `legal.md` / `content.md`. Modules added by this unit
(files in `modules/`):

## Pre-passes (not blocks, always return null)
- `lazy-src.mjs` (priority 1000, once per page): every `img[data-src]` gets src = data-src and
  every `source[data-srcset]` without srcset gets srcset. Lazy images the capture never scrolled
  to carry the blurred lazyload placeholder in `src` (e.g. `csm_…_df535887eb.png`). Affects ALL
  templates (13 of 22 en-investors images; 3 on en-career-working-at-continental, 1 on the legal
  notice) — re-encoding a delivered page now picks the real rendition. Belongs in the core
  ctx.img()/pictureImgs().
- `teaser-color.mjs` (priority 250, `.o-container__content`): drops `is-color-*` from
  c-teaser__content of NON image-layout teasers (no rule in site.css; teaser.mjs refuses coloured
  cards otherwise).
- `section-gray.mjs` (priority 200, `.o-container.is-gray > .o-container__content`): section
  Style `is-gray` (core GROUNDS lacks it; foundation request filed, interim CSS in teaser.css).
- `spacer-paragraph.mjs` (priority 50, `.o-container__header p`): `<p>&nbsp;</p>` spacer lines in
  a section header CE → `<p>&#8203;</p>` (zero-width space). The pipeline drops `<p>&nbsp;</p>`
  and `<p><br></p>` (verified on .plain.html); each spacer is a full line + margin (60px @1440).

## hero-stage-slider.mjs — `.c-heroteaser-fixed` (slider or single) → block `hero-stage-slider`
Section Style `full-bleed`. One row per `.c-heroteaser-fixed__slide`: [renditions, text].
Renditions = ctx.pictureImgs (source ≥1279, source ≥767, fallback) → 3 / 2 / 1 pictures.
Text = `<p>title</p><p>description</p><p><strong><a>CTA</a></strong></p>`; a title/description in
`span.u-padded-text` is `<p><em>…</em></p>` (white highlight box). Variant `text-white` for
c-heroteaser__textcolor-white (de-presse, en-press, en-us-career). Video slides: image only + WARN.
Block JS: Glide autoplay 8s / hoverpause / 1000ms slide / text re-enter; the CTA box is hidden
until the first slide change (live behaviour); single slide → no dots/arrows.

## tabs.mjs — `.o-tabs` → block `tabs` (+ the panels as the following blocks)
One row per header item. A panel that walks to exactly ONE block → label-only row and that block
is emitted right after the tabs block (tab order); the block JS moves the next N block wrappers
into the panels. A text-only panel → [label, content]. Mixed panels → null (UNMAPPED). Variants
`header-gap` (teaser.mjs headerGap), `dark-line` (in is-gray / is-pastel-yellow containers).

## news-sidebar.mjs — `.c-news-sidebar` (solr news list) → block `news-sidebar`
One row per card: [img, `<h3>header</h3><p><strong>date</strong> text</p><p><a>label</a></p>`];
last row = the "show all" link `<p><strong><a></a></strong></p>`. Cards render through the
teaser block (cols-3). Captured snapshot of a server-side query (dynamic: future query-index).

## fact-box.mjs — fact-box grid `.row` / lone `.c-fact-box` → block `fact-box`
Row per box: [`<p>title</p><p>subtitle</p>`, `<p>prefix<strong>final value</strong>suffix</p>`,
text?]. The strong value = data-count-to formatted like the source end state
(data-count-locale, decimals, tsdsep). Variants cols-4/cols-2, white, yellow, number-white.
Block JS: equalised heads/feet, count-up via utils countUp (locale from html[lang]).

## content-list.mjs — `.c-content-list` (and the `.row` holding it) → block `content-list`
Rows: [header] / [`<p>day</p><p>month</p>`, `<p>title</p><p>date</p><p><a>link</a></p>`] /
[`<p><strong><a>footer</a></strong></p>`]. Variant `inner` (.container--inner). When the list
shares its row with another column the module claims the row: the other column is walked first
and the list gets `beside` (block CSS lays the previous wrapper and the list 8/4, 6/6 >= 767).

## teaser-image.mjs — `c-teaser.is-layout-image` → block `teaser` (image-layout single [text-black])
## teaser-embed.mjs — has-columns row: teaser column(s) + iframe-widget column →
block `teaser <grid> with-embed`; widget row = `<p><a href=src>src</a></p>` + its buttons.

## Hub siblings (17) — dry run today: 3 encode cleanly
CLEAN: de-investoren, fr-fr-carriere, ro-ro-cariera. Still UNMAPPED (cluster must add modules):
flockler social wall / carousel (cs-cz, de-karriere, en-career, en-us-career), c-hotspots-image
(same 4), o-accordion (de-nachhaltigkeit, en-sustainability, en-pt, pt-pt, sk-sk), video.js player
(de-unternehmen, en-company, sk-sk), c-job-widget-list (en-pt, pt-pt, sk-sk, es-mx-carrera) +
app-root widgets (de-karriere, en-career, es-mx-carrera), forms / search (de-presse, en-press,
en-pt, pt-pt), image figure with caption `picture.c-image__picture` / figcaption outside
text-media (cs-cz, de-karriere, en-career, de-unternehmen, en-company, sk-sk).
Notes: source hubs carry several `<h1>` per page (en-investors 4: section headers) — encoded
verbatim (delivery-lint P1 is source parity). Event "add to calendar" links point at the source
API (/en/investors/api-events/?…ical) — dynamic, not migrated.
