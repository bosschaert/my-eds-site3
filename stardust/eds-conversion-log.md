# EDS conversion log — balbriggan.ie

## Publish decision (2026-10-13)

Publish: every delivered page, the redirects sheet and the chrome documents (nav, footer) go live on
main--e8103195--aemcoder.aem.live (deploy-batch.mjs without --no-publish / POST admin.hlx.page/live). Decided by the run brief (hands-off).

## Foundation

- **Runtime contract:** `stardust/runtime-contract.json` — vanilla EDS, `.block` wrapper,
  `p.button-wrapper` + `a.button.primary|secondary|accent`, formatted-only buttonization, empty
  metadata section collapsed (`main .section:empty`). Chrome hosts are `header.header-wrapper` /
  `footer.footer-wrapper` directly.
- **Foundation CSS:** `styles/styles.css` — canon.css shared layer verbatim (tokens, reset, base type,
  `.heading-rule`, the `.btn` pill as the EDS button family, `.social`), boilerplate structural layer
  kept (body gate, chrome reservation: `--nav-height` 98px >= 1200 / 90px below, released to
  `height: auto` once the header block has loaded so the sticky header can compact to 75/77px),
  section scaffold = the source's bootstrap container (1140/960/720/540/fluid, 15px gutters),
  EW edit-mode repaint for CTAs. `main { min-height: calc(100vh - var(--nav-height)) }` keeps short
  pages (the chrome shell) from floating the footer mid-viewport — no effect on the home page.
  Canon keeps images inline (`vertical-align: middle`), so the EDS `img` reset adds only
  `max-width: 100%; height: auto` (#36), not `display: block`.
- **Fonts (R-01):** `fonts/montserrat-{300,500,700}.woff2` (SIL OFL) self-hosted as
  `Gotham Light/Medium/Bold Sub` in `styles/fonts.css` with canon's size-adjust and
  ascent/descent/line-gap overrides verbatim; `Gotham-Light` / `GothamMedium` / `GothamBold` stay
  first in every stack (Gotham is never rehosted). Metric-matched `gotham-*-fallback` faces
  (local Arial, computed against Liberation Sans with fontTools) sit third in each stack for first
  paint. Boilerplate roboto files removed. No font lines in `head.html`.
- **Icons:** no Font Awesome/slick webfont shipped. The four social glyphs are the Font Awesome 4
  outlines extracted with fontTools into `styles/icons/{facebook,twitter,linkedin,instagram}.svg`,
  drawn at FA's 20px em box (advance/1792 em wide, baseline offset -256/1792 em), so geometry
  matches the source `<i class="fa">` glyphs.
- **Favicon:** `favicon.png` (from `stardust/prototypes/assets/favicon.png`) + one
  `<link rel="icon" href="/favicon.png"/>` line in `head.html`; boilerplate `favicon.ico` removed.
- **header** (`blocks/header/`) — decode tier: template-slotted. `/nav` sections: (1) brand link,
  (2) utility links `<ul>` + social `<ul>`, (3) main nav `<ul>` with nested `<ul>` panels and the
  `<strong>` CTA. Authored nodes are moved into the canon chrome DOM (`site-header-*` classes,
  kebab-cased from canon's BEM for stylelint); labels of icon/logo links are moved into `.sr-only`
  spans, never rebuilt. Logo = `blocks/header/balbriggan-logo.svg` served from the code origin
  (SVG brand mark). Behaviour per `stardust/chrome/header-contract.json`: the source opens its four
  dropdowns on click/Enter (the contract records no hover state), closes on Escape (focus returns
  to the trigger), click outside and trigger toggle; < 1200px a drawer with a 350ms height collapse
  and drill-down dropdowns; sticky header compacts (`is-scrolled`) after 100px. Two canon values
  were corrected against the live site where the prototype had never been gated in the open state:
  dropdown items inherit the nav `li` font-size/margins (12px in the 1200–1469 band, 14.4px in the
  drawer), and the utility links stay hidden when the drawer is open.
- **footer** (`blocks/footer/`) — decode tier: template-slotted. `/footer` sections become the two
  bootstrap columns (council mark | social + Privacy). Council mark = `blocks/footer/fcc-logo.svg`.
- **Content:** `content/nav.html`, `content/footer.html` (metadata `Robots | noindex`),
  `content/drafts/foundation-shell.html` (Title + `Robots | noindex`, one `<h1>`). davids-model-lint
  PASS (0 🔴, 0 🟡); sanitise: no non-ASCII. Deployed and published with deploy-batch
  (ledger `stardust/deploy/ledger-foundation.json`).
- **Lint:** own files clean (eslint airbnb-base on `blocks/`+`scripts/`, stylelint standard on all
  CSS). `npm run lint` as a whole still reports 2 pre-existing errors in tracked stardust evidence
  files outside this unit's write scope (`stardust/prototypes/proto.js`,
  `stardust/migrated/assets/proto.js`: `no-use-before-define`) and 1 warning in
  `stardust/scripts/deploy/sanitise.js`.
- **Residue (R-01):** header band 1440 measures 2.29% vs live (build vs prototype 0.07%; prototype vs
  live 2.28%) — Montserrat glyph widths/antialiasing; header-contract open-state crops differ
  4.6–7.3% for the same reason (behaviour findings all clear). Needs a site-owner decision on the
  font substitution in `stardust/chrome/header-decisions.json`.

## Archetype index

Unit C-archetype `index` (template `index`, page `/`, DA document `/index`). Prototype
`stardust/prototypes/index-proposed.html` (+ `index.css`, `canon.css`, `proto.js`); content
verbatim from `stardust/current/pages/index.json`; schema `stardust/eds-schema/index.json`.

**Triage + names (locked):** one block per prototype section; names = section intent.

| section | block | D1/D11 | decode tier | authored shape |
|---|---|---|---|---|
| `.hero` | `hero` (boilerplate block replaced) | bespoke video hero (D11 hero) | template-slotted | `<h1>` + `<strong><a>` CTA in the block; video `.mp4` link as default content before the block (D1: no embed URL inside a block), reabsorbed — the `<p>` moves into the `<video>` as fallback content |
| `.intro` | `intro` | prose; kept a block because the foundation CSS is frozen (no section-style vocabulary) | template-slotted | one cell: `<h2>` + paragraphs |
| `.band.news` | `news` | carousel (D11 carousel-like rail) | reconstructive | `<h2>` row; per story `img \| <p><a>title</a></p>`; `<strong><a>See All</a>` row |
| `.band.explore` | `explore` | tile grid (D11 cards) | reconstructive | `<h2>` row; per tile `img \| <p><a>label</a></p>` |
| `.map` | `map` | client-only map (dynamic-features row 10) | template-slotted | per pin `img \| <p><a href=…#projectN>label</a></p>`; `@ew-exempt all` (pin labels are SVG artwork) |
| `.band.docs` | `docs` | card list (D11 cards) | reconstructive | `<h2>` row; per doc `<h4><a pdf>title</a></h4> \| img`; `<strong><a>See All</a>` row |
| `.newsletter` | `newsletter` | form (dynamic-features row 3) | template-slotted | `<h2>`+`<p>`; `<ul>` field labels; consent `<p>` (moved into its `<label>`); submit `<p>`; `@ew-exempt` labels/submit |

**Decisions:**
- Hero headline authored as the page's single `<h1>` (source markup is an `<h2>`; same text,
  same paint — `.hero-title` carries the type, the heading inherits).
- All blocks are full-bleed: each escapes the foundation's `main > .section > div` container
  with a scoped `main > .section > div:has(> .<block>)` override and rebuilds the source's
  bootstrap `.container` (1140/960/720/540/fluid) inside where the prototype has one.
- Hero video: same Vimeo mp4 (external host, never content.da.live), `autoplay muted loop
  playsinline` set as attributes + properties and `play()` attempted after decoration; no
  reduced-motion pause (source parity; a paused/poster video is not the deliverable).
- News rail: proto.js behaviour rebuilt natively in `news.js` (3-up, dots + arrows, no
  autoplay, 500ms ease transform); the slick icon font ships as `blocks/news/slick.woff`
  (block-scoped `@font-face`) so arrows/dots render the same glyphs.
- Map: the 320 KB source artwork is split — the pin layer (12 linked pins, clip paths, labels,
  17 KB) lives in `map.js` so it renders synchronously; the town artwork (`blocks/map/map-bg.svg`,
  fixed decorative asset) is fetched and inlined (so its text uses the page fonts) behind it.
  Each authored row slots one pin's href + photo (matched by `#projectN`). Pin hover scale +
  label slide + load animation as on the source (CSS); disabled under reduced motion.
- Newsletter: native form, `POST https://balbriggan.ie/#gf_1` multipart with the same Gravity
  Forms field names and hidden state (interim, dynamic-features row 3).
- Links to other balbriggan.ie pages stay absolute (only `/` is migrated) — localize-links
  dry-run confirmed it keeps them (targets not in the migration set).
- Media: 25 editorial images uploaded to `media/index/` (ledger
  `stardust/deploy/media-ledger-index.json`), authored as content.da.live URLs, alt="" as on
  the source.
- Motion (progress.json `motion.implemented`): button hover (foundation), explore hover,
  news dots/arrows, map pin hover + label slide, hero video autoplay — implemented; dead ones
  (outline transitions) not implemented.

**Local gates:** delivery-lint clean (0 P0/P1/P2); davids-model-lint PASS 0 🔴 / 5 🟡 (hero and
intro single-cell bespoke widgets — justified above; D3 differing cell counts on news/explore/docs
come from the in-table section heading row); block-roundtrip `--ew` exit 0 (27/41 editable, 0 dead,
14 declared exempt); qa-gate 34 ok / 3 fail, all three instrument artefacts: the schema names the
news/explore/docs sections all `band` (explore's 5 units get checked against the news block), the
map's repeat selector is `g.[object SVGAnimatedString]` (SVG className), and the 2560 "no cap"
check reads `containerMaxWidth: null` while the source's bootstrap container caps at 1140 (the
prototype's cap-probe vs live PASSED at 2560 with the same caps). Lint clean.

**Delivery (archetype index):** DA `/index` PUT → preview → live via deploy-batch (ledger
`stardust/deploy/ledger-index.json`); `.plain.html` 200, one `<h1>`, 0 `about:error`, no `/img/`,
25 `<img>`; `https://main--e8103195--aemcoder.aem.page/` 200 (live host 200). media-reconcile: 25
hosted. Deployed probe: hero `<video>` autoplay/muted/loop/playsinline, `paused: false`, 0 page
errors, 4 slides + 4 dots, 5 tiles, 12 linked pins with photos + artwork, 4 docs, 0 broken images.

**Published-origin gate** (`gate-all --only index`, state copy `stardust/.work/rollout/index/state.json`
marking `/` deployed — `stardust/state.json` untouched):
- 1440: pixel 1.43 % (text 6.67 %), Δh 0, clip 0, MISSING 0 / HIDDEN 0, units 0 off — PASS.
  Fix rounds (block CSS/JS only, 3): news title `<p>` carries the 9rem flex box; doc and explore
  `<picture>` boxes take the image geometry (unit-geometry measured the inline picture);
  explore tiles carry the `explore__item` alias the `stardust/replica/units.json` family uses.
- 360: pixel 2.40 % (text 3.19 %), Δh 0, clip 2 (allow 2, source parity sidecar copied to
  `gates/all-360/clip-allow.json`), MISSING 0 / HIDDEN 0. Row prints FAIL (elements) from a
  unit-geometry instrument artefact: the origin unit inventory is cached per slug
  (`stardust/current/measure/index-units.json`, written by the 1440 run) and reused at 360
  (origin docH 4696, 350px cards vs a 360px viewport). A fresh, uncached 360 measurement
  (`stardust/.work/rollout/index/units-360-fresh.json`) reads 32/32 within 4px, 0 off.
- Origin capture: the fresh 1440 stitch of balbriggan.ie this session was degraded (lazy
  explore/doc/footer images unpainted, doc row wrapped, +122px → 12.74 %; kept in
  `stardust/.work/rollout/index/fresh-origin-1440/`), so both widths gate against the archetype
  round's verified captures (`gates/index-<w>/live.png`, noted in each `origin.json`).
- Chrome bands (crop-compare): header 1440 2.29 % (R-01 font residual, known), footer 1440
  0.43 %; header 360 0.01 %, footer 360 0.20 %.
- content-diff (generic): 0 structural 🔴 (110 findings, all 🟡/advisory — chrome icon renders).
- Video: Vimeo `external` mp4 answers 403 to this sandbox (curl and headless), so playback could
  not be observed here; the element is wired exactly as the source (autoplay muted loop
  playsinline, `play()` resolved without error in headless).
