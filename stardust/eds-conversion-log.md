# EDS conversion log — niravmanubhai.com (single page, replica flow)

Target: `aemcoder/9552f862`, branch `main`, preview `main--9552f862--aemcoder.aem.page`,
live `main--9552f862--aemcoder.aem.live`. Content source: DA (`admin.da.live/source/aemcoder/9552f862`).

## Publish decision

**Publish.** Decided for this run before delivery began: every delivered page, the redirects sheet
and the chrome documents (`/nav`, `/footer`) go live on the aem.live origin (`deploy-batch.mjs`
without `--no-publish`). Recorded once here (2026-10-12).

## Block names — locked before any code (deploy step 2; single-page ceremony: name = section class)

| # | Prototype section | D1 block? | D11 collection pattern | Block name | Decode tier | Notes |
|---|---|---|---|---|---|---|
| 1 | `section.hero#courtyard` (picture + sr-only h1) | yes | hero | `hero` | template-slotted | full-bleed `object-fit: cover` image at a fixed height; boilerplate `buildHeroBlock` autoblock shape (picture + h1) |
| 2 | `section.room-section#host` (h2, tagline, figure image, 4 note paragraphs) | yes | — | `host` | template-slotted | fixed composition: heading, tagline, portrait figure, note |
| 3 | `section.story-nursery-home` (eyebrow, h2, p, cta, figure) | yes | — | `story-nursery` | template-slotted | copy left, image right |
| 4a | `section.rooms` intro (eyebrow, h2, p) | no — default content | — | — | section style `rooms` | intro stays prose in the `rooms` section |
| 4b | `.r24-doors` (4 × reading-door: image, h3, p, link) | yes | cards-like | `doors` | reconstructive | one row per door: image \| text; `uniform: false` long/short rhythm → variant by position class |
| 4c | `.r24-books` (image + copy + cta) | yes | — | `books` | template-slotted | |
| 4d | `.r24-also` (eyebrow, title, 3 line items) | yes | — | `rooms-also` | reconstructive | one row per line |
| 5 | `section.room-section.r24-bouquet` (split: visual + eyebrow, h2, lede, p, cta) | yes | — | `bouquet` | template-slotted | |
| 6 | `section.room-section.alt#conversation` (split: visual + copy, 4 door links, follow block) | yes | — | `conversation` | template-slotted | 7 links keep their `<p>`s (EW3) |
| 7 | `section.departure` (eyebrow, h2, opening, blessing, links, portrait, thanks) | yes | — | `departure` | template-slotted | |
| — | header (`.nmh-header` + drawer + overlay + reading-progress + back-to-top) | chrome | header | `header` | template-slotted | `/nav` document; drawer `open`, back-to-top `show`, reading-progress width — observed motion, implemented |
| — | footer (`.nmh-footer`) | chrome | footer | `footer` | template-slotted | `/footer` document |

Reserved-class guard (#15): no name is `section`, `block`, `wrap`, `button`, nor ends in `-wrapper`/`-container`.
Component-model shapes: `doors`, `rooms-also` = container (one row per unit); every other block = simple (one property per row).

## Section schema

`stardust/eds-schema/index.json` (section-schema.mjs on the served prototype, width 1280): 7 sections,
one repeat group (`A.reading-door` × 4, `uniform: false`), 53 editable texts. Style fingerprint
(`stardust/.work/rollout/style-fingerprint.json`): one variation group in `rooms` (three anchor
styles: door link, bordered item, bordered item with image).

## Dynamic surface at delivery

- Tags (GTM/gtag `G-00QDEH6N5W`, Cloudflare Web Analytics): **off** — owner decision pending
  (`stardust/dynamic-features-plan.md`). No martech scaffold ships.
- hreflang alternates `en` + `x-default` → `/`: emitted as metadata rows on the page document.

## Links

17 distinct internal targets outside this run's scope (every other page of the site) are repointed
to `https://www.niravmanubhai.com/<path>`; the home link is `/`.

## Foundation (rollout C-deliver, unit `foundation`, 2026-10-12)

**Runtime contract** (`stardust/runtime-contract.json`, probed from `scripts/scripts.js` +
`scripts/aem.js`):
vanilla-eds; `blockWrapperClass: block` (`div.<name>-wrapper`, section `.<name>-container`);
buttons `a.button` + `.primary` (`<strong>`) / `.secondary` (`<em>`) / `.accent` (both) inside
`p.button-wrapper`; `buttonization: formatted-only` (a bare `<a>` alone in a `<p>` stays a link);
`fragmentScriptPolicy: inert-innerHTML`; `emptySectionCollapse: true` (→ `main .section:empty {
display: none }`).

**Token lift** (`styles/styles.css`): every canon.css `:root` token verbatim (`--paper … --line`,
`--nm-*`, `--frame-*`, `--house-*`, `--font-display/body/ui/eyebrow/gujarati`), plus boilerplate
aliases (`--background-color`, `--text-color`, `--link-color`, `--body-font-family`,
`--heading-font-family`) and layout tokens `--nav-height: 81px` (77px ≤ 720px — the source header
drops to 16px padding there) and `--max-width: 1184px` (DESIGN.json `containerMaxWidth`). Global
`*, *::before, *::after { box-sizing: border-box }` + `* { margin: 0; padding: 0 }` reset,
`html { scrollbar-gutter: stable; scroll-behavior: smooth }`, `img { display: block; max-width:
100%;
height: auto }`. Module cap on `main > .section > div { max-width: var(--max-width); padding: 0 7vw
}`
(= the source `.wrap`), ONE template-level escape `main > .section > div:where(.hero-wrapper),
main > .section.full-bleed > div { max-width: none; padding: 0 }`; `#story-nursery`'s 1100px cap is
that block's own CSS. Button system = `.btn` (outline) on `a.button`, `.r24-btn-solid` on
`.primary`/`.accent`; EW3 edit-mode repaint + EW6 card-link snippet shipped (no `:where()` utility
wrappers yet — no block utilities exist at this stage). The boilerplate structural layer is kept
verbatim (`body` appear gate, `header { height: var(--nav-height) }` + visibility gates, section
scaffold) — so blocks must not emit `<header>` (#107). Default-content section styles: none yet
(the `rooms` style belongs to the content unit). Token-completeness gate: empty.

**Fonts** (`styles/fonts.css`, `fonts/`): self-hosted Google builds (Chrome/143 variable woff2, the
gate's files) — Inter 300–600 (latin, latin-ext), Playfair Display 400–600 normal + italic
(latin, latin-ext), Rasa 400–600 (latin, latin-ext, gujarati); 9 files, `font-display: swap`.
Roboto files removed. Metric-matched fallbacks in styles.css (fontTools a–z advance average vs
Liberation Sans/Serif = Arial/Times metrics): `inter-fallback` size-adjust 109.38% / ascent 88.57% /
descent 22.05%; `playfair-display-fallback` 110.64% / 97.8% / 22.69%; `rasa-fallback` 97.22% /
74.88% / 27.98% / line-gap 22.42%. `loadFonts()` in scripts.js stays stock. All three families
are SIL OFL — no licensing alert.

**Favicon**: `stardust/current/assets/favicon.png` → `/favicon.png`; one line added to `head.html`
(`<link rel="icon" href="/favicon.png">`); `favicon.ico` left in place.

**Chrome documents** (body fragments, `content/nav.html`, `content/footer.html`, both end with a
metadata block `Robots: noindex`): `/nav` section 1 = `<p><a href="/">Home</a></p>` +
`<p>Nirav Manubhai</p>`; section 2 = ONE `<ul>`: `<li><a href="/">Home</a></li>` then one `<li>`
per group with `<p>Group label</p>` + nested `<ul>` of that group's links (Stories ×5, Also in the
House ×3, The House ×4 — 13 links, strings verbatim); section 3 = the metadata block (no tools).
Delivered shape on live: top-level `<li>` links come back as `<li><p><a>` (loose list), nested
ones as `<li><a>` — `header.js` normalises both (#98). `/footer` = one `<ul>` of 7 links.
Link scope: home → `/`; the 17 other internal targets stay `https://www.niravmanubhai.com/<path>`
(`localize-links.mjs --check`: 0 localizable; `davids-model-lint --source-host`: PASS 0 🟡).
`data-broken-link` attributes stripped. Lint: delivery-lint 0/0/0 both docs; sanitise encoded
1 character (`&mdash;`) in nav.

**Blocks**: `blocks/header` — `div.nmh-header` (fixed, 81px; the source's sticky at constant
height renders identically — sticky inside the 81px `<header>` host would not stick) with
`div.nmh-home` (moved `<p><a>`), `div.nmh-title` (moved `<p>`), block-generated
`button.nmh-menu-btn` (☰, aria-label/aria-controls/aria-expanded); `nav.nmh-menu#nmh-drawer`
with generated close button (×) + the moved `<ul>` (group `<p>` wrapped in `div.nmh-menu-group`,
EW2); body-level `div.nm-reading-progress>span`, `div.nmh-overlay`, `button.nm-top` created
idempotently (EW9). Motion implemented: drawer `open` on button / close / overlay / Escape with
aria-expanded + focusout close; back-to-top `show` at scrollY > 500, smooth scroll unless
reduced-motion; reading progress rAF-ticked width. `blocks/footer` — `div.nmh-footer` + moved
`<ul>` (li as flex child so the row geometry equals the source's anchor-row). CSS scoped under
`header .header …`, `footer .footer …`, `body > .nmh-overlay / .nm-top / .nm-reading-progress`.

**Lint**: `npm run lint` passes. `.eslintignore` gained `stardust/` — the captured live scripts
under `stardust/current|prototypes/assets/js` (70 pre-existing airbnb errors) are inputs, not
served code (`.hlxignore` already excludes `stardust/`). stylelint `no-descending-specificity`
is disabled around the EW repaint snippet whose selector order the deploy skill fixes.

**Deploy** (`deploy-batch`, publish): `/nav` PUT 201 / preview 200 / live 200 / verify ok;
`/footer` PUT 201 / 200 / 200 / ok. Live `.plain.html`: both 200, 0 `about:error`, 14 and 7
`<a>`. Code sync: `styles/styles.css` carried the new tokens on the first poll after push
(`c4427fe` landed after 3 polls); `/favicon.png` 200; `blocks/header/header.js` served.

**Shell render** (`stardust/.work/rollout/probes/shell-render.mjs`, deployed `/nav`, Playwright
Chromium): 1440 — header host 81px, row fixed 81px (reserve delta 0), drawer 13 links / 3 groups
opens on click (overlay open, aria-expanded true) and closes on Escape, back-to-top `show` after
scrollTo 800 (page forced tall — `/nav` itself is short) and hidden again at top, progress 38.1%,
footer 7 links 83px, fonts Inter + Playfair Display loaded, scrollWidth 1425 vs clientWidth 1440
(15px = the `scrollbar-gutter: stable` reservation, overflow 0), pageerrors 0. 360 — host 77px,
row 77px (delta 0 after the responsive reservation fix in `c4427fe`; round 1 measured 81 vs 77),
drawer x=93 (width 267 = 70vw), footer wraps to 170px, overflow 0, pageerrors 0.

**Chrome-parity round 1 (coordinator gate) → fixed in `fe22d45`**: (1) `<header>` host is now the
sticky element (`position: sticky; top: 0; z-index: 20`, stock `--nav-height` reservation kept),
the `.nmh-header` row sits in normal flow; because a sticky host is a stacking context the drawer
`nav.nmh-menu` moved to body level (`body > .nmh-menu`, above the body-level overlay, as on the
source). (2) The lifted `.nmh-home` box (inline-flex, min-height 44px, padding-right 8px) is on
the authored anchor via `header .header .nmh-home a:any-link`; the authored `<p>` is
`display: contents; margin: 0`. (3) `.nmh-menu-btn` keeps the UA font (`arial, sans-serif`) and
`line-height: normal` as live. (4) `footer` host carries `background: var(--parch)` +
`border-top: 1px solid var(--line)`; `.nmh-footer` keeps padding/type only. Re-run at 1440 and
360: header 1 delta (`"Nirav Manubhai" tag <span> → <p>` — EW1 forbids retagging; geometry
matches), footer 8 deltas all `Δy` (the `/nav` shell page is short; the content page places the
footer at the live y). No other lines.

## Archetype — index (/) (rollout C-deliver, unit `archetype-landing`, 2026-10-12)

Page: `content/index.html` → DA `/index.html`, web path `/`, PUT → preview → live (publish decision PUBLISH), deploy-batch `1 ok, 0 failed`, ledger `stardust/deploy/ledger-archetype-landing.json`. Preview `https://main--9552f862--aemcoder.aem.page/`, live `https://main--9552f862--aemcoder.aem.live/`.

### Decode tier per block (EW round-trip, `block-roundtrip.mjs --ew` against the prototype)

| block | tier | authored shape | round-trip | EW editable |
|---|---|---|---|---|
| `hero` | template-slotted | simple: h1 / landscape image / mobile image | closed (🟡 IMG COUNT 1→2: the live `<picture>` art direction — `(max-width:640px)` mobile source — is authored as a second image row and toggled by CSS at 640px) | 1/1 |
| `host` | template-slotted | simple: h2 / tagline / portrait / note paragraphs | closed | 5/5 |
| `story-nursery` | template-slotted | simple: eyebrow / h2 / image / body / text CTA (bare link, not a button) | closed | 4/4 |
| `doors` | reconstructive | container: one row per door `image \| h3(link) + long, short, rhythm` | closed (4 units) | 16/16 |
| `books` | template-slotted | simple: `image \| h3(link) + line + free note` | closed | 3/3 |
| `rooms-also` | reconstructive | container: eyebrow row + one row per item `[image] \| title(link) + line` (uniform: false — the image-bearing third item is reproduced) | closed (3 units) | 7/7 |
| `bouquet` | template-slotted | simple: image / eyebrow, h2, lede, `<strong><a>` CTA | closed | 4/4 |
| `conversation` | template-slotted | simple rows classified by content: image / copy (eyebrow, h2, 4 ledes) / 6 `<em><a>` door links (each keeps its `<p>`, EW3) / follow panel (eyebrow, p, `<strong><a>`) | closed | 15/15 |
| `departure` | template-slotted | simple: hidden h2 / copy paragraphs / portrait / thanks | closed after one fix (the thanks paragraph moved to its own row: a media-led cell with a sibling `<p>` folds into ONE `<p>` on live, which left the authored paragraph dead) | 9/9 |

Whole-page round-trip: 9 blocks, 0 structural 🔴, EW editable 64/64, dead 0, duplicated 0, exempt 0. Card-as-link blocks (`doors`, `books`, `rooms-also`) unwrap the authored inner anchor after moving its href to the card (EW6). `qa-gate.mjs` on the harness: PASS 30 ok / 0 warn / 0 fail (one h1, 7 sections, all blocks loaded, doors 4/4 units, content cap 1184px holds at 2560). The `rooms` section intro (eyebrow, h2, first-visit note) is default content under section style `rooms`; the foundation has no `.section.rooms` rule, so `blocks/doors/doors.css` styles the intro through `main .section.rooms .default-content-wrapper` descendant selectors (`p:has(+ h2)` for the eyebrow — relational, not positional). The `story-nursery` section is authored style `full-bleed` (foundation escape) and the block carries the source's own `min(1100px, 92vw)` / `min(920px, 86vw)` caps. Section-level paint (`border-top`, parch background) rides the `.<name>-container` section classes from the block CSS.

Live-cascade notes carried into block CSS: `.departure p { line-height: 1.8 }` outranks `.r24-doors-open` (1.6) and `.home-now-note` (1.7) on live, so the block does not set those two line-heights (round-1 fix, −13 px at 360 before it); `.reading-door p` outranks the `.r24-rhythm` font shorthand, so the rhythm line keeps .9rem/1.55 ink-soft at desktop and .72rem below 720px.

### Media
13 files uploaded to `https://content.da.live/aemcoder/9552f862/media/index/` (12 page images + the hero's mobile art-direction source), ledger `stardust/deploy/media-ledger.json`; `media-reconcile` 13 hosted. Delivered `.plain.html`: 13 `<picture>`/`<img>` with the verbatim alts, 0 `about:error`, 0 `/img/`. The pipeline emits no `width`/`height` on `<img>`; frames with an aspect ratio (doors, also, nursery) reserve space, the others rely on the settled capture.

### Static chain
delivery-lint 0 P0 / 0 P1 / 2 P2 (content.da.live images in the hero — reconciled as hosted) · localize-links `--check` PASS, 0 localizable (17 source-host targets kept by decision § Links; `data-broken-link` attributes stripped, 0 left) · media-reconcile exit 0 · davids-model-lint PASS 0 🔴 / 4 🟡 (D1 single-column prose blocks hero/bouquet/departure — bespoke compositions, kept as blocks; D3 rooms-also rows of 1 and 2 cells — the image-less items, decode classifies by content) · sanitise 54 non-ASCII → entities · section-fidelity: 7 sections, 12 headings match the source outline · `npm run lint` clean · token-completeness gate: no undefined `var(--…)` · foundation-freeze `foundation unchanged (21 files)` before every commit.

### Deploy checks
live `/index.plain.html` 200 and preview `/` 200: one `<h1>`, 0 `about:error`, 0 `/img/`, 13 images with alts; `curl -sIL` preview ends HTTP/2 200; title/description from the metadata block; ai-readability code 100 % / strict 100 % (gate 98). Coverage: page `index` deployed, 9 blocks deployed. hreflang `en` + `x-default` → `/`: not representable as page metadata rows in this pipeline — deferred (head.html is frozen). `aria-label="Send email"` on the mailto link and `target=_blank` on the social links do not survive DA transport as attributes; the `conversation` block re-adds `target=_blank rel="noopener noreferrer"` to off-site links, the aria-label is deferred.

### Published-origin gate (preview URL, `gate-all.mjs --only index`, same browser tier both sides)

| round | 1440 pixel % (text) | Δh | clip | content | 360 pixel % (text) | Δh | clip | content | note |
|---|---|---|---|---|---|---|---|---|---|
| 1 (14:58 / 15:00) | 3.45 (12.26) PASS | +3 | 0 | 0/0 | 11.56 (13.56) FAIL | −47 | 0 | 0/0 | instrument asymmetry (below) + departure −13 px |
| 2 (15:09 / 15:11) | 3.54 (12.29) PASS | −7 | 0 | 0/0 | 11.68 (13.51) FAIL | −60 | 0 | 0/0 | departure fixed; eager fonts.css from hero (no effect on the capture) |
| 3 (15:24 / 15:22) | **1.41 (4.25) PASS** | −1 | 0 | MISSING 0 / HIDDEN 0 | **0.63 (0.85) PASS** | 0 | 0 | MISSING 0 / HIDDEN 0 | both sides stitched in real Chrome |

Round-1/2 diagnosis (instruments, not eyeballing): anchor.mjs live vs preview at 360 — every section y/h equal except departure −13; measure.mjs `.rooms img/h3/a` Δ0 at 360 while the capture showed +19 px at the doors and +41 px in `#conversation` (band offset profile from the two PNGs); a probe (`stardust/.work/rollout/probes/fonts-360.mjs`) showed every text box equal to live in real Chrome at 360×900 with the stitch UA, and the stitched EDS capture 60 px taller. Root cause: `gate-all.mjs` stitched the ORIGIN with `--headed` (real Chrome) and the EDS side with the bundled Chromium; the two tiers round glyph advances differently (same page, both sides: Chrome 155 docH 7912 / `#conversation h2` 3 lines vs Chromium 156 docH 7972 / 4 lines; canvas `measureText` 113.84 vs 120.00 px for the same string). **Instrument fix (documented in the script, flagged for upstreaming):** the EDS stitch in the project copy of `stardust/scripts/replica/gate-all.mjs` now passes `--headed` too, so both captures come from the same tier. Invalidated runs: all-360 15:00 and 15:11, all-1440 14:58 and 15:09 (their numbers above are kept as calibration). `gate.sh` captures both sides without `--headed` (symmetric already).

`gate.sh index … pub1` (no `--full`: its parallel probe set exceeds the 2-Chromium cap of this machine; chrome-parity and the crops ran separately): 1440 → 1.39 %, Δh −1, overflow ok (scrollWidth 1425 = viewport) PASS; 360 → 0.53 %, Δh 0, overflow ok (345 = viewport) PASS. Chrome crops (`crop-compare.mjs`, live.png vs build.png): header 1440 1.22 % / 360 1.23 % PASS (≤ 2 %), footer 1440 0.00 % / 360 0.00 % PASS. chrome-parity pub1 (1440 and 360): footer parity 7/7; header 1 delta — the title "Nirav Manubhai" is `<span>` on live and `<p>` in the frozen header block (tag only; filed in foundation-requests.md).

### Interaction check (deployed preview, 1440, `stardust/.work/rollout/probes/interaction.mjs`)
0 pageerrors; 8 `main .section` (7 + the metadata section, hidden by the foundation's `:empty` rule); 9 blocks with `data-block-name`, all `loaded`; grid/flex: doors grid / books / also grid / bouquet split / conversation split / departure grid compute `grid`, host figure and conversation links `flex`; drawer `open` on the menu button (aria-expanded true) and closed again by ×; back-to-top `show` at scrollY 1200 and click returns to 0; reading-progress bar width 255.5 px at scrollY 1200 → 0 at top; every visible `<img>` clientWidth > 0 (12 visible at 1440 and 360 — the off-breakpoint hero art-direction image is display:none by design). qa metadata check: see below.

### Foundation requests (appended to `stardust/rollout/foundation-requests.md`)
1. fonts.css loaded lazily below 900px — scoped override: `hero.js` requests `/styles/fonts.css` in `decorate()` (loadEager) so mobile first paint uses the brand faces.
2. header title tag `<span>` → `<p>` (chrome-parity delta, no pixel effect).

### Deferred
hreflang alternates (head-level, frozen head.html); `aria-label="Send email"` on the mailto link (attribute lost in DA transport); `width`/`height` on delivered `<img>` (pipeline).

qa.mjs `--checks metadata --max-pages 1` on the live host: 1 error `metadata/noindex-on-live` (x-robots-tag noindex is the aem.live default until the production domain is mapped — platform state, not page content), 1 warn: missing-og-type page has no og:type. Neither `favicon-broken` nor `favicon-default` reported.

## C-final — foundation requests applied, roster gate (2026-10-12)

Freeze check: unchanged (21 files). The two queued requests applied once: `scripts/scripts.js` loadEager
calls `loadFonts()` at every width (the hero's scoped `loadCSS(fonts.css)` override removed);
`blocks/header/header.js` renders the site title as `span.nmh-title-property` (CSS selector widened).
Pushed to `main`; both origins served the new code before the gate ran. Roster `gate-all` on the
published origin, fresh captures: 1440 1.41 % Δh −1 clip 0 content 0 PASS; 360 0.63 % Δh 0 clip 0
content 0 PASS. chrome-parity 1440 / 360: header 3/3, footer 7/7, 0 deltas. Coverage `delivery.gate`
written from both summaries. Foundation re-frozen (manifest regenerated after the applied requests).

## D-site (2026-10-12)

Root `/` serves the delivered index document (source root is a page, not a redirect). No `redirects.tsv`
(single page, no moved paths) → no redirects sheet. Served sitemap 1 url = assembled 1; `/nav`, `/footer`
noindex and live.

## D2-dynamic (2026-10-12)

hreflang alternates (deferred at deploy as head-level) implemented in `scripts/scripts.js` loadEager: `en` +
`x-default` `<link rel=alternate>` pointing at the page's own URL (source behaviour: both → `/`). Foundation
re-frozen after the edit. Parity replay on the live origin 4/4 PASS (`stardust/qa/dynamics-report.md`): hreflang
2 links, no page errors, no GTM/GA request, no Cloudflare Insights request. Tags stay off pending the owner.
