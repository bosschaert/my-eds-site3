# Encoder notes — template `content` (archetype en-career-working-at-continental)

Run: `node stardust/rollout/encoders/encode.mjs <slug> [--out content]`. Section model, metadata,
hero-teaser and text-media as in `legal.md`. Modules added by this unit (files in `modules/`):

## button.mjs — pre-pass, not a block (priority 100, always returns null)
`a.c-button*` (c-button, --internal, --external, --download, --mail) inside any `.o-page__ce` or
slide is wrapped in `<strong>` in the capture DOM, so default content keeps it as an EDS button
(`p > strong > a` → `a.button`). Belongs in the core `cleanNode()`; kept as a module so the core is
untouched. Residual: the foundation picks the button icon from the href (absolute → external
icon), the source from the class — a `c-button--internal` link to a not-yet-migrated page shows
the external icon until localize-links makes it root-relative.

## breadcrumb.mjs — `nav.c-breadcrumb` → block `breadcrumb`
One cell: `<ul>` with one `<li>` per step (`<a href>` ancestors, plain text = current page).
Spacers are block chrome. The block CSS owns its section: band padding 2.7429rem top / 0 bottom
(source `o-container pb-0`), hidden below 767 (`d-none d-sm-flex`), and the white section after
it keeps its top padding (the source band is not is-white).

## teaser.mjs — c-teaser cards → block `teaser`
- A `.row` whose non-empty columns each hold exactly one teaser CE → ONE block, one row per card.
  Variant from the column class: `col-md-3` → `cols-4`, `col-md-4` → `cols-3`, `col-sm-6` only →
  `cols-2`, alternating `col-md-8`/`col-md-4` → `wide-narrow`. Empty columns are dropped (no mb-5
  in the source → no height). Other mixes → null (warned) → a lone `a.c-teaser` / `div.c-teaser`
  becomes a one-card block.
- Card row = `[<img> (picture fallback rendition, alt verbatim), <h3>header</h3> + c-teaser__text
  paragraphs + <p><a href title>link label</a></p>]`. The whole card is the link (EW6).
- `header-gap` variant: the section's header CE ends with an EMPTY `c-media__content` row after the
  heading (source keeps the header's 1.8286rem margin → +32px). Shared helper `headerGap()`.
- Not handled (→ UNMAPPED, cluster adds): `is-layout-image` teasers, coloured content
  (`is-color-white|black`).
- `teaserRow()` is exported for the slider.

## content-slider.mjs — `.c-content-slider` → block `content-slider` (priority 10)
One row per `li.c-content-slider__slide`, source order: teaser slide → the teaser card row (2
cells); other slide → one cell with the slide's CEs walked through the normal dispatch; EMPTY slide
→ a row of empty cells (the source keeps empty slides as gaps in the track; DA/pipeline keep empty
rows — verified on .plain.html). `header-gap` like teaser. Block JS: Glide-like perView 1/2/3/4
(<767/<1023/<1279/else), gap 32, wraps, swipe, first slide `is-active`; teaser slides get the
teaser block loaded on them (same DOM/CSS, gray card ground).

## figure.mjs — image-only CE in a has-columns row → block `figure` (coverage id `image`)
EDS name `figure` because davids-model-lint hard-fails any block NAMED `image` (D1 🔴).
Claims only `.has-columns .row` with exactly two non-empty `col-sm-6` columns (no `col-md-*`), one
holding an image-only c-media CE (gallery of image embeds, no header, no text). ONE row, one cell
per column in source order: image cell `<p><img></p>` (+ caption / creator `<p>`s), text cell =
the other column walked (headings + rich text + button). Block: 50/50 columns >= 767, each mb 48px.
Other has-columns shapes (md-4/md-8 image|text, gallery+text pairs) are NOT claimed yet.

## page-options.mjs — `.c-pageoptions` → block `page-options`
One cell: the share window heading (`<h3>Share:</h3>`) + `<ul>` of share links (href + title
verbatim, link text = network label). Share / close / print icons are chrome; share opens the
window in the foundation lightbox (GLightbox content look), print = window.print(). The block CSS
gives its section the full band padding (source o-container without ground).

## text-media-copy.mjs — lead copy → block `text-media (copy)` (priority 5)
A header-less text CE whose paragraphs are ALL `p.u-text-copy` (1.25rem / 1.5rem >= 767). Mixed
u-text-copy / plain paragraphs → null + WARN (default content, lead size lost; 2 content pages).
The copy block sits 2.7429rem under a default-content header (o-container__header rhythm).

## Content siblings (65 `content` pages) — encode status today
32 encode cleanly. Missing modules by page count: c-heroteaser-fixed (stage hero with text / CTA)
24, `span.u-padded-text` inline highlight 15, tabs 9, `<strong>` holding layout 8, search / forms
5+2, content-list 4, image figures outside text-media (`picture.c-image__picture`, figcaption) 5,
video.js player 3, accordion 3, contact list 2, `u-text-style__*` spans 3.
Gate note: gate-all stitches the origin `--headed` and the EDS side headless; at 360 headless text
sets ~3 % wider (the archetype's 360 row reads 18.6 % / Δh -25; symmetric headed capture 3.32 % /
Δh 0 — recorded in stardust/replica/gates/all-360/overrides.json).

## Cluster-content modules (64 siblings) — added by unit cluster-content
All in `modules/`; blocks they create are listed per module. Every module returns null outside its
shape, so earlier templates encode unchanged (archetype re-encode diffed: renditions only).

### accordion.mjs — `.o-accordion` → block `accordion` (priority 10; NEW block)
Rows [<p>label</p>, panel]: panel = the item content walked; a panel that walks to a block → null
(blocks do not nest). Block: bordered items, orange plus/minus (`.u-icon.has-bg` + foundation
`.u-icon-plus-minus`), all closed initially, click/Enter/Space toggles; header div role=button
(EW7). White separators on grounded sections. Reusable for any o-accordion (hub: FAQ / downloads).
Variant `events` (events-list.mjs): label cell [logo p, date p, time p, title p (strong), location p].

### events-list.mjs — `.c-events-list` → `accordion (events)` (priority 10)
Career events list (Solr, dynamic row 2 snapshot): captured items; the share lightbox is chrome.

### search.mjs — `.c-search` / `form:has(.c-search)` → block `search` (priority 10; NEW block)
Rows whose LAST cell names the kind: search (placeholder) | filters ([label] + ul tabs) | options
(ul of the visible tab's options) | count (count + sort label) | result ([img], type, date, h3>a,
teaser, "n Dokument(e)") | pagination (ul) | tag. Static snapshot of the captured first page
(dynamic-features row 2): box submits ?q= to the page, tabs only switch the active bar. Reuse:
hub search forms / listings. Deviation logged per page (migrate.mjs deviation, row 2).

### webform.mjs — `form.c-webforms` → block `webform` (priority 10; NEW block)
Rows: [<p>text</p>] legend / consent copy; [<ul>steps</ul>]; [<p>label</p>, <p>type [required]</p>]
(textarea | text | email | select | checkbox — checkbox label keeps its link); [<p>label</p>,
<p>submit</p>]. Honeypot / hidden inputs dropped. Block: floating labels, client validation, submit
shows the "no backend connected" notice (dynamic row 12 interim; deviation logged).

### contact-list.mjs — consecutive `.c-contact` → block `contact-list` (priority 10; NEW block)
One row per person [<p><img></p>, <p><strong>name</strong></p><p>job</p>…<ul><li><a tel:|mailto:>]].
Icons (icons/phone.svg added from the capture, email.svg) are chrome by link scheme. `has-bg`.
Layout: image col-md-6 col-lg-4 | text, row mb 64px.

### sidebar.mjs — `.o-container__content > .row:has(> .o-container__sidebar)` → block `sidebar`
(priority 30; NEW block). Emits main column (walked) + `sidebar` block (cell = sidebar default
content, may be empty) + the sidebar's blocks. Block JS moves itself and the following wrappers
into `.sidebar-aside`, section gets `.has-sidebar` (grid 75/25 >= 1279, 66.67/33.33 >= 1023,
stacked below with the aside last). sidebar.css also styles a content-list inside the aside
(source `.o-container__sidebar .c-content-list`: gray box, compact). Pages: IR contact, Vitesco.

### quote.mjs — `.c-quote` alone or its has-columns row (image column | quote) → block `quote`
(priority 8; NEW block). Rows per column: image cell [<p><img></p> + caption] or quote cell
[<p><img portrait></p>? <blockquote><p>text</p></blockquote> <p>author</p>]. Variants static,
alt-icon („), image-left, dark, yellow. Quote mark is CSS chrome.

### hotspots.mjs — `.c-hotspots-image` → block `hotspots` (priority 10; NEW block)
Row 1 [<p><img></p>]; per hotspot [<p>left top side width</p> (source inline %), rich text].
Points / boxes / indicator are chrome; click toggles one box. (`@ew-exempt` config cell.)

### tabs-panels.mjs — `.o-tabs` with panels mixing text + blocks → `tabs (panels)` (priority 11)
Rows [<p>label</p>, <p>n</p>]: the panel takes the next n wrappers (each default-content run and
each block counts one). tabs.js guarded path for variant `panels`. Two panels whose boundary would
merge two default-content runs → null.

### video-gallery.mjs — `.row` of video textmedia cards (header + AdmiralCloud video + text) →
`video-player (gallery cols-N)` (priority 13). Rows = cards [heading | video cell | text]; video cell
as video-player.mjs. video-player.js guarded path `gallery` (cards grid). Reuse: hub video.js in
c-image + figcaption.

### download-list.mjs — download-only `.c-content-list` (single or a row of lists) →
`content-list (downloads [inner] [beside half])` (priority 11). Rows [title, <a>label <em>meta</em></a>].
content-list.js guarded path `downloads` (download icon, slate meta), CSS `half` keeps a list pair 50/50.

### text-copy.mjs — `.u-text-copy` lead copy shapes text-media-copy.mjs refuses (priority 6)
Lead + button-only paragraphs → text-media (copy); header + lead in one CE → heading default
content + text-media (copy in-header) or, under a section header row, heading inside the block;
image gallery → text-media.mjs output + `copy` (linked figure titles kept). text-media.css: copy
button paragraphs keep the richtext size; `in-header` gap 1.8286rem.

### figure-meta.mjs / figure-order.mjs — figure.mjs rows (priority 6)
figure-meta: text column with a c-media__meta eyebrow → figure `meta` (figure.js lifts the eyebrow).
figure-order: text `order-2` / image `order-1` columns → figure `image-first-mobile` (< 767).

### heading-gap.mjs / subheadline.mjs — section header rhythm (priority 7)
heading-gap: header CE with an empty media row followed by a CE heading → Style `heading-gap`
(+1.8286rem above the next heading). subheadline: `h2.u-text-subheadline` → Style `subheadline`
(h2 pulled to the h1). CSS hosted in teaser.css (foundation request filed).

### Gate notes (cluster-content)
- hero-stage-slider autoplay: origin and EDS stitch at different slides → hero band mismatch +
  MISSING hero link; overrides use pixel-compare --mask 0:600 (1440) / 0:560 (360) on the same PNGs.
- 360 (and some 1440) rows: headless/headed text-wrap fork — headed EDS re-stitch evidence under
  stardust/.work/cluster-content/gate<w>-headed/ (headed.sh), overrides via ovr360.sh.
- gate-all `units` criterion: the content template declares content-slider-slide units required,
  so slider-less pages read "FAIL (elements)"; the cluster bar (pixel, Δh, clip, content) is applied.
