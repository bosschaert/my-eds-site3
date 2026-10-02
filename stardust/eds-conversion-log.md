# EDS conversion log — www.niravmanubhai.com (stardust:replica, bounded single page)

Target: `aemcoder/fdc3c10d` (`main`), preview `main--fdc3c10d--aemcoder.aem.page`. Spec = the gated
prototype `stardust/prototypes/index-proposed.html` + `canon.css` + `index.css` (0.00 % @1440 / 0.07 % @360).

## C0 Foundation (2026-09-28)

### Decode tier decisions
| Unit | Tier | Notes |
|---|---|---|
| header | template-slotted | `blocks/header` builds the source chrome DOM (`.nmh-header` bar, `.nmh-menu` drawer + overlay + close, `.nm-reading-progress`, skip link, `.nm-top`, the legacy 1px top rule) and MOVES the authored `/nav` sections into it (section 1 -> home link + title, section 2 -> drawer lists/labels). |
| footer | template-slotted | `blocks/footer` moves the authored `/footer` list into `div.nmh-footer`; the `<a>` stays the flex item (`li { display: flex }`) so row heights match the live page. |

### Publish decision
**Preview-only until the owner confirms.** `deploy-batch` is invoked with `--no-publish`; nothing is published to `aem.live` by this run.
Deploy status this run: **skipped — no DA token available** (checked by existence only: `.env`, `$DA_TOKEN`, `~/.aem/da-token.json`; none present). `content/nav.html` and `content/footer.html` are ready; `localize-links --check` PASS (0 localizable — the sibling pages are not migrated, so their links stay absolute to the source site by design), `davids-model-lint` PASS (0/0).

### Runtime contract (`stardust/runtime-contract.json`)
vanilla-eds; `decorateBlock` wraps in `div.<name>-wrapper` (+ `.block`, section `.<name>-container`); buttonization is **formatted-only** (`<strong><a>` -> `a.button.primary`, `<em><a>` -> `a.button.secondary`, both -> `.accent`, parent `p.button-wrapper`; bare links stay links); fragments are inert (Trusted Types policy strips `<script>`); `main .section:empty { display: none }` added.

### Foundation (`styles/styles.css`)
- `:root` lifted verbatim from canon.css (palette `--paper --parch --ink --ink-soft --leaf --leaf-dark --gold --noir --cream --line --taupe`, spacing `--nm-space-1..7`, `--nm-radius`, `--nm-shadow`, `--nm-focus`, frame ratios) plus foundation names: `--body-font-family`, `--heading-font-family`, `--gujarati-font-family`, `--body-font-size` 17px, `--body-line-height` 1.7, `--heading-line-height` 1.16, `--h2-font-size` clamp(2.2rem,5vw,3.6rem), `--wrap-max` 74rem, `--wrap-pad` 7vw, `--section-pad` clamp(4rem,8vh,6rem), `--split-gap` clamp(1.6rem,4vw,3rem), `--button-solid-text` #fbf8f1, `--background-color` (alias for the boilerplate demo blocks still in the repo).
- Reset as in the source: universal `border-box`, `* { margin: 0; padding: 0 }`, `img { display: block; max-width: 100%; height: auto }`, `a { color: inherit; text-decoration: none }`, `html { scroll-behavior: smooth; scrollbar-gutter: stable; scroll-padding-top: 5rem }`, `h1,h2,h3` Playfair 400 / 1.16, `h2` size + margin `.25rem 0 1rem`, `main p { widows/orphans: 3 }`, focus ring, `a[target=_blank]:not(.button)::after " ↗"`, `body.appear` fade-in (`nm-page-in .42s`, off under reduced motion).
- Chrome reservation: the live bar is `position: sticky` and in flow (motion/index.json: 81px @1440, bodyPadTop/mainPadTop 0; computed-360: 77px). So `body > header { position: sticky; top: 0; z-index: 50; height: var(--nav-height); background: var(--paper) }` with `--nav-height: 81px`, `77px` at `width <= 720px`. **No body padding-top, no spacer** — the hero starts right under the bar exactly as on the live page (`.hero` margin-top nets to 0 at every width).
- Sections: `main > .section` and `main > .section > div` have zero margin/padding and no max-width — blocks own `.wrap` (74rem / 0 7vw), section padding, top rules and grounds.
- Buttons: `a.button` = source `.btn` (outline leaf, min-height 44, padding .72rem 1rem, Inter 600 .74rem, tracking .07em, uppercase, radius 3px, **margin-top 1.15rem as in the source**, hover tint + translateY(-1px)); `.primary`/`.accent` = `.r24-btn-solid` (leaf fill, #fbf8f1 text, no hover tint); `.secondary` = outline. `width: 100%` at `<= 430px`; 48px min-height on coarse pointers. `p.button-wrapper { margin: 0 }`. Edit-mode repaint (EW3) and card-inner-anchor rule (EW6) included.

### Fonts
Self-hosted from Google Fonts / fontsource 5.3.0 (SIL OFL 1.1 — no licensing alert needed): Inter (latin, wght 100–900), Playfair Display (latin, normal + italic, wght 400–900), Rasa (latin + **gujarati**, wght 300–700 — the departure blessing is Gujarati). Declared in `styles/fonts.css` (loaded by `loadFonts()`, `font-display: swap`); metric-matched `inter-fallback` (Arial), `playfair-display-fallback`, `rasa-fallback` (Times New Roman) in `styles.css`, values computed with fontTools (a–z frequency-weighted advance vs Arial/Times, next/font method). Roboto files removed. Not fetched: latin-ext subsets (content is English + Gujarati).

### Favicon
`stardust/current/assets/favicon.png` (128×128) copied to `/favicon.png`; `head.html` gained the one permitted line `<link rel="icon" href="/favicon.png"/>`; `/favicon.ico` replaced by a PNG-in-ICO wrapper of the same image (the Adobe default is gone).

### Chrome documents (`content/`)
`nav.html`: section 1 = `<p><a href="/">Home</a></p>` + `<p>Nirav Manubhai</p>`; section 2 = drawer as `<ul>` lists with `<p>` group labels (Stories / Also in the House / The House), verbatim text. `footer.html`: one `<ul>` of 7 links. All links to sibling pages are absolute (`https://www.niravmanubhai.com/...`); only `/` is root-relative.

### Interaction parity (header block JS, mirrors the live scripts and motion/index.json)
Menu button toggles `.open` on `.nmh-menu` + `.nmh-overlay` (+ `aria-expanded`); overlay click, close button and Escape close. `.nm-top.show` above 500px of scroll; click = `scrollTo({top:0, behavior: reduced-motion ? 'auto' : 'smooth'})` (the live `site-enhancements` script). Progress bar `width = scrollY / (scrollHeight - innerHeight)`, `.08s linear`. No hover effects or scroll morphs beyond the source. Listeners drop themselves when their nodes leave the DOM (EW9).

### Local QA
- `block-roundtrip.mjs --ew` (header, footer) against a chrome-only wrapper of the prototype (`stardust/.work/deploy/probes/chrome-proto.html`, generated by `make-chrome-probe.mjs`, served on :8792): exit 0 — header 21/21 text nodes (3 eyebrows, 15 CTAs, 3 body), footer 7/7; EW editable 10/10, dead 0, duplicated 0.
- `render-harness.mjs` crop @1440: bar, top rule and footer row as in the prototype.
- `npm run lint`: pass (eslint + stylelint). `stardust/` added to `.eslintignore` (captured live-site JS and tooling are not served code; `eslint --fix` had rewritten the captures once — restored from git). `@babel/core` (peer of the configured parser) installed `--no-save` to run eslint; package.json untouched.

### Deliberately left for the page blocks (cluster)
`.wrap`, `.split`, `.visual`, `.house-section-media`, `.rooms`/`.room-section`/`.alt`, `.eyebrow`, `.lede`, `.sr-only`, `section[id] { scroll-margin-top }` and every rule in `index.css`. Section grounds/padding/rules are block-owned; no section `style` vocabulary was added.

## C1 cluster `home` (template `index`) — page blocks

Page: `/` → `content/index.html` (body fragment; metadata block Title + Description from `stardust/migrated/_meta.json`). Spec: `stardust/prototypes/index-proposed.html` + `canon.css` + `index.css`; schema `stardust/eds-schema/index.json`; fingerprint `stardust/.work/deploy/style-fingerprint-index.json` (only variation: the first "Also in the House" link has no left rule — CSS `:first-child` on the generated anchor).

### Decode tier decisions
| Block | Source section | Tier | Notes |
|---|---|---|---|
| hero | `section.hero#courtyard` | template-slotted | `<h1>` → `.hero-title` (sr-only, as the source), wide picture → `.hero-media`; the authored mobile crop (`courtyard-mobile-*.webp`, a different CROP) becomes a `<source media="(max-width: 640px)">` on the wide picture and the element itself stays in the hidden `.hero-media-narrow` slot (editable). Round-trip reports 🟡 IMG COUNT 2 vs 1 for exactly this reason — intentional. Region label (`aria-label="Courtyard"`) authored as section metadata and applied by the block (`role=region`). |
| host-note | `section.room-section#host` | template-slotted | h2 → `.host-note-heading`; first paragraph after it → `.host-note-intro`; remaining paragraphs → `.host-note-copy`; portrait → `.host-note-portrait` (width min(340px,100%) on the wrapper, border/shadow on the img). |
| story-feature | `section.story-nursery-home#story-nursery` | template-slotted | eyebrow = text BEFORE the heading; link paragraph = plain underlined link (`formatted-only` buttonization: a bare `<a>` in a `<p>` stays a link). |
| rooms-doors | `section.rooms#rooms` | reconstructive | Rows classified by content: h2 row = head; one-cell row with image + h3 = door card (texts in schema order: number, long, short, rhythm); TWO-cell row (image \| copy) with h3 = the books card — the source renders it as a 2-column grid, hence the two cells (davids D3 "ragged rows" 🟡 is this deliberate shape); link paragraphs without h3 = "Also in the House" (link p opens an item, the following p is its line). Cards are generated `<a>`s, inner authored links unwrapped after the href is read (EW6). Poster variant (`.poster-insert`, CSJA card) is derived from the image's natural portrait ratio at load — the source's per-instance variant. `#stills`/`#axiom`/`#bookshelf-door` link ids not reproduced (no in-page target uses them). |
| bouquet-feature | `section.room-section.r24-bouquet#story-bouquet-home` | template-slotted | picture → `.visual.house-section-media`; eyebrow/heading/lede/CTA (`<strong><a>` → `a.button.primary`, moved as its paragraph, EW3) in `.bouquet-copy`; `.bouquet-cta { margin-top: 1.4rem }` + the foundation button's 1.15rem top margin = the source's `p.bouquet-cta > a.btn`. |
| conversation-doors | `section.room-section.alt#conversation` | reconstructive | Order-driven segmentation: link-free text after the heading = ledes until the first link paragraph; consecutive link paragraphs = the six doors (`<em><a>` → `a.button.secondary`), any text after them opens the follow group (eyebrow, body, `<strong><a>` CTA). `.doors p { display: flex }` keeps the button the flex item (source: bare `<a>` items). Block sets `target=_blank rel=noopener noreferrer` on external links and `aria-label="Send email"` on the mailto door — attributes only, mirroring the source. The source's `#conversation … !important` layer over `.split/.visual/.house-section-media` is resolved to final values in the block CSS. |
| departure | `section.departure` | template-slotted | hidden h2 (→ `aria-labelledby`), then paragraphs in schema order (eyebrow, note, doors-open, blessing; the Gujarati blessing detected by script), link-only paragraph → `.departure-cta`, mixed paragraph → `.departure-now`; picture + the text after it → `.departure-portrait`. Margins sit on the paragraphs so they collapse like the source's sibling `<p>`s. |

Section ids (`#courtyard #host #story-nursery #rooms #story-bouquet-home #conversation`) are authored as `section-metadata` `id` rows (folded by the pipeline / build-harness) AND set by each block on its section when absent (belt and braces; `scroll-margin-top` per block CSS as canon `section[id]`).

davids-model-lint 🟡 D1 on hero/host-note/story-feature/bouquet-feature/conversation-doors/departure ("prose-only block, default-content candidate"): justified — each is a bespoke fixed composition (sr-only hero heading over a full-bleed picture, split grids with framed visuals, the flex door row, the two-column departure) that default content cannot lay out; pixel replica requires the template. 🟡 D3 on rooms-doors: the books card row is deliberately two cells (see above).

### Images
Editorial images authored as `https://content.da.live/aemcoder/fdc3c10d/media/home/<file>` inside `<p>` (DA's own shape — a bare `<img>` first in a cell is folded by `wrapTextNodes` into one `<p>`, #104, which the round-trip caught as DROPPED CONTENT before the fix). Files = `stardust/migrated/assets/media/*` names; manifest of the 12 referenced files: `stardust/deploy/media-manifest-home.json`. No block calls `createOptimizedPicture` — the pipeline's `<picture>` (750/2000 webply) is the srcset; the moved authored picture stays editable. delivery-lint's 2 × P2 "cross-origin-optimize in .hero" is the lint's default assumption that a block named hero optimizes; this one does not.

### Local QA (harness, no pixel work)
block-roundtrip `--ew` per block exit 0 (maps: host-note=#host, story-feature=#story-nursery, rooms-doors=#rooms, bouquet-feature=#story-bouquet-home, conversation-doors=#conversation, departure=section.departure); whole page exit 0 — EW editable 72/72, dead 0, duplicated 0. qa-gate PASS (25 ok, 1 warn: hero wrapper 1425/1440 = the 15px `scrollbar-gutter: stable`, as the source). delivery-lint 0 P0 / 0 P1 (2 P2, above). media-reconcile: 12 content-host URLs unresolved — expected, no media ledger before upload. localize-links `--check` PASS (sibling pages not migrated stay absolute by design). davids-model-lint PASS (0 🔴, 7 🟡 justified above). content-diff harness vs prototype (`--profile generic --main main`): 0 structural 🔴; 🟡 EXTRA TITLE ×14 come from the frozen runtime's `decorateButtons` (`a.title = textContent`). Fonts-ready geometry probe (`stardust/.work/deploy/probes/geo-probe.mjs`): every section/inner box Δ ≤ 1px at 1440 and 360 (measure.mjs without a fonts-ready wait showed +31/−36px on bouquet/conversation — the prototype measured before Google Fonts landed; identical once `document.fonts.ready`). `npm run lint` pass. foundation-freeze: unchanged. No foundation-requests line needed.

### Deploy
Skipped — no DA token (`.env`, `$DA_TOKEN`, `~/.aem/da-token.json` absent). Commands for a later session: see the C1 report.

## C-final — published-origin gates and the foundation request queue (2026-09-28)

- Token: the harness hands the IMS token over as a file (`ADOBE_IMS_TOKEN_FILE`); every deploy script took `--token-file`. Media: 12/12 → `media/home/`, `media-reconcile` 12 hosted. `deploy-batch --no-publish`: /footer, /index, /nav previewed; `.plain.html`: one h1, 0 about:error, 0 `/img/`.
- **Publish decision unchanged: preview-only.** The site root `https://main--fdc3c10d--aemcoder.aem.page/` resolves to the home page (200); nothing is published to `aem.live`.
- Published-origin gate, round pub1 at 1440: 3.64 % / Δh −6 / chrome 28 deltas. Causes, each off an instrument: (1) rooms-doors letterboxed card 04 (aspect-ratio heuristic; the live page marks card 02 by class) → authored config word `poster`; (2) the self-hosted @fontsource woff2 matched only one of the browser-specific Inter/Playfair builds Google Fonts serves (font-probe: 802 vs 811 px for one heading string) → the live page's own Google Fonts URL, linked from head.html and imported by fonts.css, loaded eagerly at every width; (3) drawer + overlay hosted after `<header>` as on the live DOM, skip link dropped (the live page has none); (4) `footer` ground on the element itself.
- Round pub1 at 360: stitched build 7400 px vs live 7792 px — the `<picture>` wrapper sizes to its content, so a lazy image below the fold had a 0-px box before load (live's bare `<img>` keeps its attribute placeholder) → `.visual picture { display:block; width:100% }` in bouquet-feature and conversation-doors.
- Final: 1440 pub4 0.00 % Δh 0; 360 pub4 0.63 % Δh 0; content-diff 0 structural at both (17 🟡 = pipeline `title` attributes on links, the drawer "×"); overflow ok; header/footer crops 100 %/100 % at both widths. chrome-parity residuals: footer Δy +41 at 1440 (the live books image is bistable on an unscrolled load, parity in the stitched capture), title tag `<span>`→`<p>` (authored paragraph, EW1). Motion: 6 parity, `.reading-door` hover confirmed by direct probe (translateY −3 px).
- Foundation: requests 1–5 applied once, `foundation-freeze.mjs freeze` (17 files; the woff2 files are gone), `check` unchanged.
