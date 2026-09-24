# EDS conversion log — balbriggan.ie replica (rollout C-deliver, unit C0 foundation)

Page: https://balbriggan.ie/community-development/ → `/community-development` (also served at `/`).
Prototype ground truth: `stardust/prototypes/community-development-proposed.html` (gated 2.48 % @1440, 4.32 % @360).

## Decisions

- **publish: yes** — single page, live tree needed for the root and sitemap checks
  (`deploy-batch.mjs` run without `--no-publish`).
- **Lint:** lint binaries absent (the boilerplate's eslint/stylelint devDependencies are not installed and
  `npm install` would prune the gate's test deps); code written to the rules (airbnb-base + stylelint
  standard: kebab-case classes / custom properties, one statement per line, lines ≤ 100 chars, ESM, range
  media queries, modern color notation). One line over 100 chars remains by necessity: the hamburger
  icon data URI in `blocks/header/header.css` (stylelint 17 has no max-line-length rule).
- **Fonts (register R-01):** Gotham is a licensed kit and is substituted by Montserrat 300/500/600
  (OFL) + FontAwesome 4.7, self-hosted under `fonts/`, declared in `styles/fonts.css`; the brand family
  names stay first in every stack (`Gotham-Light, 'Montserrat-300', sans-serif` …). No metric-matched
  `-fallback` face: the fontsource calibration was unreachable and the fontTools estimate from the
  latin subset (size-adjust 141 %) is implausible — a wrong value would cost more CLS than none;
  `fonts.css` loads eagerly at ≥ 900px. The boilerplate's roboto files were removed.
- **Links:** the page's own links resolve root-relative (`/` brand, `/community-development` in the
  Leadership dropdown — `localize-links.mjs` canonical form, extensionless); every other balbriggan.ie
  link stays absolute to the source site (out of scope for this run; 17 targets listed by the tool).
- **Media:** editorial images on `content.da.live/of1-labs/stardust-replica-fe635832/media/community-development/`
  (chair photo `newsletter.jpg`, `balbriggan-logo.svg` 14.6 KB and `fcc-logo.svg` 16.9 KB — pure vector,
  no `<image>`/base64, under 40 KB). Ledger: `stardust/deploy/media-ledger.json`.
- **Runtime contract:** `stardust/runtime-contract.json` — vanilla EDS, `p.button-wrapper` /
  `a.button.primary|secondary|accent`, formatted-only buttonization, section-metadata folded by the
  pipeline, `main .section:empty { display: none }` added for the metadata section.

## Decode tier per section

| Section | Tier | Notes |
|---|---|---|
| Header (`nav.navbar`) | Template-slotted (`blocks/header`) | `/nav` = brand / main menu (nested lists = dropdowns, `<strong>` item = yellow nav button) / tools (top menu + social). Live mechanics reproduced: `.scrolled` past 100px (300ms logo shrink), Bootstrap-4 collapse (`.collapsing` 350ms) at < 1200px, click dropdowns with outside-click + Escape close; state on the trigger's `aria-expanded`, no classes on authored elements. |
| Page title `h1.entry-title` | Default content | `main h1` + `::after` yellow bar in `styles.css`. |
| Intro (`.pillar-intro`) | Default content + section style `pillar-intro` | Centred 80 % column (`calc(80% - 3.2em)`), 3rem padding/margin, `#eee` rule; 2em stack gaps below 782px. CTA authored `<strong><a>` → the single theme button. |
| Membership (`.pillar-membership`) | `columns` block (stock code; cluster unit refines) + section style `pillar-membership` | One row, three cells: chair photo / Chair h4 + 2 p / Members h4 + 2 lists. Round-trip closed: 98/98 text nodes, EW editable 6/6. Trailing empty `<ul><li></li></ul>` authored verbatim after the block. |
| Footer (`#wrapper-footer-full`) | Template-slotted (`blocks/footer`) | `/footer` = logo link paragraph, social list, privacy link; classified by content (media / social / rest). |

## Gates

- `localize-links.mjs --check` exit 0; `davids-model-lint.mjs content/` PASS (0 🔴, 2 🟡 SVG advisories verified pure-vector).
- `block-roundtrip.mjs --blocks columns --map columns=.pillar-membership --ew` exit 0.
- `block-roundtrip.mjs --blocks header,footer --ew` (3 runs incl. `--map`): residual — the harness inlines
  block JS and cannot resolve the `getMetadata` / `loadFragment` module imports every chrome block needs
  (documented tool limitation); chrome editability is verified on the deployed origin with
  `ew-editability-probe.mjs <url>` instead (see below).

## Deployed verification (https://main--stardust-replica-fe635832--of1-labs.aem.page)

- `deploy-batch.mjs` 4/4 live (PUT → preview → live): `/community-development`, `/index`, `/nav`, `/footer`
  (ledger `stardust/deploy/ledger-foundation.json`); `/` 200 on aem.page and aem.live.
- `.plain.html` per document: 200, one `<h1>` on the page docs (0 on nav/footer), 0 `about:error`,
  1 `<img>` each (chair photo / logo / logo), no `/img/` src. `<title>`, description and canonical delivered.
- Pipeline shapes confirmed and handled: `<li><p><a></p><ul>` trigger wrapping (#98), `href="#"` kept,
  the emphasised nav item arrives buttonized (`p.button-wrapper > a.button.primary`) — the header styles
  `li:has(strong) a` and `li:has(a.button) a` alike; the empty metadata section is skipped by role.
- `measure.mjs --against` prototype @1440 + @360: `.navbar`, `.navbar-brand img`, `.topnav`, `.primarynav`,
  `.list-social` (+ li), `.navbar-toggler`, `h1`, nav button, first dropdown trigger and first top link
  all Δ 0 px; footer band 130 / 200 px with row, logo (192×70), social row and privacy line at the
  prototype's coordinates; `.pillar-intro` wrapper 195 / 403 px at y 231 / 271 like the prototype.
- Interaction drive (Playwright, deployed): 0 page errors, header/columns/footer `loaded`, all images
  render non-zero, Montserrat 300/500/600/700-alias + FontAwesome loaded; dropdown opens on click
  (`display: block`, 179×122) and closes on outside click; hamburger runs collapse → collapsing → show
  (menu 250 px, header 398 px at 360) and back; `.scrolled` past 100 px shrinks the logo to 144×56.
- `ew-editability-probe.mjs` on the deployed page: authored 9, editable 9, dead 0, duplicated 0.
- Open for the cluster unit: `blocks/columns` still runs the stock CSS — page height 2473 vs 1969 @1440
  (chair photo 354 px wide instead of 165, no 40 % / 60 % nesting, no yellow rule under "Chair", no blue
  border under the photo); the trailing empty `<ul><li></li></ul>` was delivered.

## Foundation fix (coordinator gate, chrome-parity.mjs live vs deployed)

- Nav button "Get Involved": computed font-weight 400 in `var(--font-medium)` (live renders GothamMedium
  at 400 — the theme's `li:not(.btn) .nav-link { font-weight: 400 }` out-specifies the 700 in the
  btn-nav rule); the body `.btn-secondary` button stays 700. `blocks/header/header.css`.
- Social anchors (header + footer) are icon-only like live: the authored label moves to `aria-label`,
  the anchor's only content is `<i class="fa fa-<network>" aria-hidden="true">` with the FontAwesome
  glyph via `::before` (canon `.fa` / `.fa-*` rules); declared `@ew-exempt` in both block JSDocs
  ("icon-only anchor on live"). Documents unchanged (labels stay authored as list text).
- Verified deployed @1440 + @360: button 129×27 weight 400 `GothamMedium, Montserrat-500, sans-serif`;
  8 social anchors text-node-free with aria-label, glyph boxes 11/19/17/17 × 24 (prototype 11×24);
  header 98/90, footer 130.4/200.4 unchanged; 0 page errors; `.plain.html` and `/` re-checked.

## Cluster pillar-page — columns block (2026-09-23)

- Decode tier: template-slotted recreation. The page's single `columns` row (3 cells: chair photo /
  "Chair" h4 + 2 p / "Members" h4 + 2 lists) is rebuilt as the prototype's nested WordPress DOM —
  `.columns-membership` row → `.columns-membership-lead` (flex-basis 40 %) holding `.columns-chair`
  (photo cell 40 % | text cell 60 %, align-items center) + `.columns-members` (flex-basis 0, grow 1).
  `decorate()` classifies cells by content (cell with `picture|img`, cell with `ul|ol`, remaining text
  cell) and MOVES the authored cells into empty slot containers with `append()`/`prepend()`; authored
  h4/p/ul/picture nodes are styled through descendant selectors only; re-entrant guard on
  `.columns-membership`; any other row shape falls back to plain equal columns.
- Values lifted from `stardust/prototypes/css/community-development.css`: row gap 2em, wrap below 782 px
  (`flex-basis: 100%`), nowrap + basis 0 / grow 1 above; inline `flex-basis` 40 % / 40 % / 60 % of the
  prototype columns; `.wp-block-image` margin 0 0 1em, img width 100 % height auto; `h4` in
  `var(--font-medium)`; `.pillar-chair h4::after` 2 px `var(--brand-yellow-alt)` rule, margin .5em auto;
  `img` border-bottom 5 px `var(--brand-blue)`; the 360 wrap-parity `li:nth-child(11) { padding-right: 2px }`
  (≤767 px). `word-break: break-word` (deprecated) written as `overflow-wrap: anywhere`.
- Harness vs prototype (`measure.mjs`, both widths): row 1110×1267 / 330×2757, lead 444 / 330,
  members 634×1267, chair 444×269, photo 164.797×253.016 with `5px solid rgb(36,148,210)`, text column
  247.203, "Chair" h4 42.797, list 11 y offsets identical; every rect matches the prototype to the
  sub-pixel. One fix during authoring: `.columns .columns-chair > div` (0,2,1) out-specified the
  40 % / 60 % rules (chair split 206/206) → inner-column rules written as `.columns .columns-chair > .…`.
- Structural asserts: `block-roundtrip --blocks columns --map columns=.pillar-membership --ew` exit 0
  (98/98 text nodes, EW editable 6/6, dead 0, duplicated 0); whole-page round-trip 0 structural 🔴;
  `qa-gate` on the harness 11 ok / 1 fail — the fail is `header renders non-empty h=0` (fragment import
  unresolvable on the static harness, documented limitation; header is frozen foundation); columns
  h=1267 loaded. `delivery-lint` 0 P0 / 0 P1 / 1 P2 (cross-origin img — `media-reconcile` 1 hosted);
  `davids-model-lint` PASS 0/0. `section-schema.mjs` emits 0 sections for this prototype (WordPress
  `<article>` + `.wp-block-columns`, no `<section>` landmarks) — the ENCODE/DECODE contract is carried by
  the `--map` round-trip. ESLint airbnb-base + Stylelint standard clean on `blocks/columns`.
- Delivery: code pushed (columns.css / columns.js served from the code origin), `deploy-batch` 2/2 live
  (`/community-development`, `/index`; ledger `stardust/deploy/ledger-pillar-page.json`); `.plain.html`
  both 200, one `<h1>`, 0 `about:error`, 0 `/img/`.
- Published gate (label pub3, `--full`, 1 round per width; live capture cached):
  1440: 2.47 % differing (bar 10 %), Δh 1 px (1970 → 1969), bands 2.2 / 2.9 / 3.1 / 1.6 %, overflow ok
  (scrollWidth 1440), content-diff 53 / 0 structural 🔴, visual-diff 0 flags.
  360: 4.40 %, Δh 1 px (3778 → 3777), bands 5.8 / 1.4 / 1.5 / 5.0 / 6.6 / 6.3 / 6.2 / 0.9 %, overflow ok,
  content-diff 53 / 0 structural 🔴, visual-diff 0 flags. Previous stock-block round pub2 was
  22.81 % / Δ−503 @1440 and 11.41 % / Δ156 @360.
  Hot bands explained: the gated prototype itself measured 2.48 % / 4.32 % against live with the same
  substitute faces; the published page reproduces it within 0.1 pt, and the 360 bands at y 1500–3500
  (5.0–6.6 %) cover the 47-line members list where every glyph differs (Montserrat-300 for Gotham-Light)
  with no line shift (Δh 1 px, list 11 at the prototype's y offset).
- Chrome: crop-compare header / footer 2.55 % / 1.04 % @1440, 1.08 % / 1.21 % @360 — the frozen
  foundation's recorded numbers to the pixel. `gate.sh`'s built-in chrome-parity (default live regions
  `header=header` / `footer=footer`) reports 20 / 9 deltas because on balbriggan.ie `<header>` is the
  entry-header h1 band (1110×73) and `<footer>` an empty element — a region-mapping artefact, not a build
  delta. Re-run against the coordinator's real-region cache (`nav.navbar` / `#wrapper-footer-full`,
  `chrome-parity-pub3-real.txt`): 0 MISSING / 0 EXTRA at both widths, 11/11 nav labels paired within
  Δx ≤ 8 px / Δw ≤ 5 px (substitute-face advance widths), logo icons paired (signature svg → media hash),
  "Privacy" Δh +4 (line box), header `position relative → sticky` (frozen; foundation request filed).
- `ew-editability-probe` deployed: authored 9, editable 9, dead 0, duplicated 0 (columns 6/6, drift 0).
  Coverage: page `community-development` verified, block `columns` verified. Foundation unchanged.
- Residuals: header crop 2.55 % over the 2 % crop bar (frozen, pre-recorded); `section-schema` empty for
  WordPress landmarks; harness header h=0; chrome-parity default region mapping on this live theme.

## C-final (2026-09-23)

- `foundation-freeze.mjs check`: foundation unchanged (19 files). Request queue: 1 line, resolved with no edit (see stardust/rollout/foundation-requests.md — sticky wrapper structures are equivalent).
- No frozen file changed, so the published gate of record for the pillar-page template is round pub3: 1440 2.47% Δh1, 360 4.40% Δh1, 0 structural, overflow ok.
- media-reconcile on content/community-development.html: 1 hosted (content.da.live), 0 missing. Both delivered paths pass the `.plain.html` checks; the site root serves the page.
