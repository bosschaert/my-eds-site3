# EDS conversion log — skerriesmills.ie (replica, bounded single page)

## Publish decision (2026-10-14)

- **Publish.** Decided by the run owner before Phase 5: every delivered page, the redirects sheet and the
  chrome documents (nav, footer) go live on main--1370701b--aemcoder.aem.live (deploy-batch.mjs without
  --no-publish / POST admin.hlx.page/live/…). Recorded once here; not re-asked.

## Target

- DA: aemcoder/1370701b, branch main. Preview main--1370701b--aemcoder.aem.page, live …aem.live.
- Scope: one page, `/` (source https://www.skerriesmills.ie/), delivered as the root `index` document.

## C0 foundation (2026-10-14)

- **Runtime probe** → `stardust/runtime-contract.json`: vanilla EDS, `.block` + `<name>-wrapper`/`-container`,
  buttons `a.button.primary|secondary|accent` in `p.button-wrapper`, formatted-only buttonization, section
  metadata server-rendered, no `delayed.js` in this boilerplate vintage (loadDelayed → consent-check.js).
- **styles/styles.css** = prototype canon (`css/canon.css`): `--sm-*` tokens, tailwind-preflight reset incl.
  global border-box, type ramp (h1–h4, p, li sans), container model as the `--sm-wrap` token
  (100%/640/768/1024/1280/1536) + `.sm-wrap` utility; `main > .section > div` is full-bleed (blocks paint
  their bands and cap inner content with `var(--sm-wrap)`), only `.default-content-wrapper` is capped.
  Shared canon utilities kept: `.sm-rich`, `.sm-more`, `.sm-txtlink`, `.sm-card-link`, `.sm-icon`.
  Buttons: strong-link = primary = live `.btn` (green → maroon hover); em-link = secondary = live
  `.btn.brand-maroon` (maroon → green); accent = primary paint. Shadow variant left to the owning block.
  EW edit-mode CTA repaint + card-link snippets included.
- **Fonts.** Libre Baskerville (OFL) self-hosted (`fonts/`, 4 woff2, latin + latin-ext, roman 400–700 +
  italic 400) in `styles/fonts.css`. proxima-nova = the owner's Adobe Fonts kit `pbd5qiw`, referenced
  exactly as the prototype/live do (`@import url('https://use.typekit.net/pbd5qiw.css')` at the top of
  `styles/fonts.css`, so it loads via `loadFonts()` — never in head.html, never rehosted; kit serves the
  aem.page origin, verified 200). Metric-matched fallbacks in styles.css, computed with fontTools from the
  real faces against Liberation Sans/Serif: `proxima-nova-fallback` (Arial) size-adjust 98.12% /
  ascent 109.97% / descent 33.12%; `libre-baskerville-fallback` (Times New Roman) 127.33% / 76.18% / 21.2%.
  Stacks: `--sm-sans: proxima-nova, proxima-nova-fallback, sans-serif`; `--sm-serif: 'Libre Baskerville',
  libre-baskerville-fallback, serif`. Boilerplate roboto woff2 removed.
- **Chrome = overlay** (#108): `body > header` is `position: fixed` over the hero, `--nav-height: auto`
  (nothing reserved, nothing shifts). Decode tier for header and footer: **template-slotted** — the blocks
  hold the prototype's chrome DOM and MOVE authored nodes into fixed role slots (EW1); `<li><p><a>` live
  shape unwrapped (#98).
  - `/nav` contract: 1 brand (two `/` links holding `:skerries-logo:` desktop + `:skerries-mob-logo:` mobile),
    2 left `<ul>`, 3 right `<ul>` (last item = green Book Now), 4 tools (mobile Book Now), 5 mobile-menu
    `<ul>` (authored separately because the live mobile menu carries different items than the desktop
    dropdowns). Behaviour per `stardust/chrome/header-contract.json`: hover/focus-within dropdowns
    (contiguous: top 100%, -3px), header `.scrolling` at scrollY ≥ bar height (logo 10rem → 8rem),
    burger toggle (no scroll lock, as live) + per-item sub-list toggles; Escape closes the menu (a11y floor).
  - `/footer` contract: 1 logo (`:skerries-footer-logo:`), 2 columns (each `<h4>` opens a column; icon-led
    paragraphs = items; icon-only links = social row), 3 partner logos (DA media `media/footer/*.png`) +
    support line, 4 legal `<ul>` + credit. Grass band = decorative CSS background (`blocks/footer/footer-grass.png`).
  - Logos and pictograms are small pure-vector SVGs served from the code repo `/icons/` via the EDS icon
    convention (desktop logo extracted from the prototype's inline SVG with its fills embedded).
  - Chrome documents authored in `content/nav.html` + `content/footer.html` (Robots: noindex), lint 0🔴,
    sanitised, PUT → preview → **published** (`stardust/deploy/ledger-foundation.json`). `content/` added to
    `.hlxignore` so the source copies are not served as code.
- **Scroll reveal** lives in `scripts/scripts.js` `initReveal()` (started in loadEager): blocks add
  `.js-show-on-scroll` / `.js-show-on-scroll-img`; the layer adds `.opacity-0` and toggles
  `.animate-fade-in` / `.animate-fade-in-y` from an IntersectionObserver (re-animates on each entry, as live);
  a MutationObserver picks up elements decorated later. No JS → nothing hidden (#16 safe).
- **Favicon**: `stardust/current/assets/favicon.png` → `/favicon.png` + the one permitted head.html line;
  boilerplate `favicon.ico` removed.
- **Lint**: `.eslintignore` gains `stardust/prototypes` + `stardust/migrated` (design artifacts, not EDS
  runtime); stylelint `no-descending-specificity` disabled per file in the chrome/canon CSS (prototype
  source order kept). `npm run lint` clean (1 warning in stardust tooling).
- **Verification** (deployed preview): 404 shell + /nav render header/footer decorated, Libre Baskerville +
  proxima-nova 400/500 loaded, no pageerror, no broken images. `chrome-parity` vs live @1440/@390: header
  26/26 texts paired, no box/style deltas beyond icon file names; mobile logo/Book Now rects identical to the
  live header contract; footer geometry identical relative to the footer origin (remaining deltas = page
  position, live partner logos not yet lazy-loaded on the live probe, support-line padding on wrapper vs p).

## Instrument fix — chrome-compare pairing of unnamed controls (2026-10-14, C0 gate)

- `stardust/scripts/diff/chrome-compare.mjs` `pairControls()` paired only by name (key) or by FAMILIES kind
  (search/cart/account/locale/drawer). The source header's mobile toggle `#menu-btn` and its sub-menu toggles
  are unnamed `<button>`s of kind `menu`, so they could never pair → permanent false 🔴 `control-missing@390`.
- Run-local fix (one line, commented): an unnamed source control pairs in order with an unnamed build control
  of the same kind. Upstream candidate. The header block mirrors the source (no aria-label on those toggles)
  for role/aria parity, as the gated prototype did.

### C0 header-contract parity follow-up (2026-10-14)

- Burger `#menu-btn` and mobile sub-menu toggles carry no aria-label (role/name parity with source +
  prototype; aria-expanded kept). Accessibility trade-off accepted for replica parity — revisit post-launch.
- Mobile sub-menu now mirrors the live theme JS (main.3ebd13ef…js): chevron swaps down/up
  (`/icons/chevron-up-white.svg`), and a parent link first opens its sub-list, navigating only once open.
- The Escape-closes-drawer handler was removed (source records no escape close path); supersedes the
  earlier "Escape closes the menu" note.
- `chrome-compare --profile replica` → 0 errors, 2 warnings (logo link-missing, accepted) →
  `stardust/chrome/header-parity.json`.

## C-archetype — landing (home `/index` → `/`), 2026-10-14

- **Blocks + decode tiers** (schema `stardust/eds-schema/index.json`; each block's JSDoc cites it):
  - `hero` — template-slotted (replaces the stock boilerplate hero). One cell: img · h1 · lede · strong-link CTA.
    davids-model D1 🟡 ("prose-only 1-row block") justified: bespoke full-bleed photo layer + scrim + bottom-left
    pinned copy; not expressible as default content. Live's duplicated desktop/mobile `<img>` is ONE authored
    image with a breakpoint `object-position` (left below 768) — roundtrip 🟡 IMG COUNT 2→1 is intentional.
  - `split` — template-slotted, 3 instances; variants `reverse`, `art-windmill`, `art-wheat` (decorative PNG
    artwork = block-owned CSS assets). Café opening hours authored as a `<ul>` (days, time); clock icon is CSS.
  - `callout` — template-slotted; harbour photo authored (editorial, alt "") and rendered as the background layer
    under the 94 % maroon wash; opening-hours line = last plain paragraph, clock icon CSS.
  - `attractions` — reconstructive (one row per card; card-as-link, EW6); Swiper-equivalent loop carousel ported
    from prototype motion.js (autoplay 5500 ms, prev/next arrows, live breakpoints 4.2/3.2/2.2/1 per view).
    Live's `--fixed` body height on the History card (≥1024) not reproduced — no authored marker, no visible effect.
  - `reviews` — reconstructive (one row per review: quote | name); loop carousel with bullets + autoHeight,
    autoplay 5500 ms; four presentational stars generated (no text).
  - `tickets` — reconstructive: six ticket cards (card-as-link; Go City keeps its split links when the title is a
    link) + the image-less "Useful Information" row as the span-2 panel (icons via `/icons/*.svg` icon spans,
    IOE artwork CSS).
  - `posts` — reconstructive, 2 instances (Latest Events / Latest News); trailing CTA row = "View All".
  - Section heads (The Attractions, What Our Visitors Say, Tickets, Latest Events/News) authored as default
    content and reabsorbed (EW8). Decorative section washes (attractions texture, reviews photo under 95 % overlay)
    are block CSS assets; all 23 editorial images on DA `media/home/` (ledger `stardust/deploy/media-ledger-landing.json`).
- **Gates**: delivery-lint 0 P0/P1; media-reconcile 23 hosted; davids-model 0 🔴; block-roundtrip whole page
  0 structural 🔴, EW 100/100 editable. qa-gate (static harness): 3 instrument/harness FAILs — header/footer empty
  (no `/nav` `/footer` on a static server) and the split ≥4 unit check (matches every `sm-split` schema section to
  the first instance and counts Farmers Market prose `<p>`s as units).
- **Published-origin gate** (`gate-all --only index`, state copy in `.work` since `state.json` is coordinator-owned;
  `--eds-host` needs the scheme): 1440 1.79 % Δh 26 px, 360 2.18 % Δh 19 px, clipped 0, MISSING/HIDDEN 0.
  Sidecar `stardust/replica/gates/all-{1440,360}/presence.json` roots live at `main > div.flex-1` because live puts
  its header/footer INSIDE `<main>` (first run: 21 MISSING, all chrome links). Instrument note: content-presence
  sees only the hero on both sides (scroll-reveal leaves off-screen items at opacity 0 — RES-2); a reveal-neutralised
  one-shot check (`stardust/.work/deploy/probes/presence-revealed.mjs`) matched 29/29 headings, 34/34 links @1440.
- Crop bands: header 1.55 % (1440) / 0.69 % (360); footer 1.50 % (1440) / 2.18 % (360 — live "Manage consent" tab,
  RES-3; 0.65 % excluding those rows). chrome-parity @1440: 32 deltas, same classes as C0 (icon file names, live
  partner logos 0×0 at probe time, support-line padding).
