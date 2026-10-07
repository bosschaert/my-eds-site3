# Capture notes — CSS lift (static-website.david-bosschaert.workers.dev)

Source: `stardust/current/assets/css/styles.css` (4261 B, 33 rules, fetched 2026-10-06), `script.js` (396 B).
Lifted into `stardust/prototypes/css/canon.css` (shared) + `css/index.css` (landing only). Nothing eyeballed.

## Box model
`* { box-sizing: border-box }` — universal on the source. Every container family is border-box; the EDS
boilerplate's universal border-box reset matches the source and needs no scoping on this site.

## Container model (cap-probe, DESIGN.json extensions.breakpoints)
- 1200px module cap (max-width) on: header, footer, media table, prose block → `--container`.
- 800px max-width on every `p` (lede and team bios) — authored, kept (register R-01).
- `.tabs-section` has NO cap: `margin: 2em 0` → full body width (1376px @1440, 328px @360).
- `h2` inline-block → text-wide (285px @1440) — authored, kept (register R-02).
- Page padding: body 2rem (≤768px: 1rem). Body margin 0, min-height 100vh, gradient on body.

## Type ramp (no font files served; stacks verbatim; both sides fall back identically on the gate machine)
| element | family | size | weight | lh | other |
|---|---|---|---|---|---|
| body | Poppins, Segoe UI, system-ui, sans-serif | 16px | 400 | 1.6 | color #333 |
| h1 | Playfair Display, Georgia, serif | 3rem (1.8rem ≤768) | 700 | inherit | #6a1b9a, center, ls -0.5px, text-shadow 2px 2px 4px rgba(106,27,154,.15), mb .5rem |
| h2 | Playfair Display, Georgia, serif | 2rem (1.4rem ≤768) | 600 | inherit | #00897b, inline-block, mt 2.5rem mb 1.5rem pb .5rem, bb 3px #26c6da |
| p (lede, team bio) | inherit | 1.15rem | 500 | inherit | #5e35b1, center, max-w 800, m 0 auto 2rem |
| nav a | Poppins stack | 1.05rem | 600 | inherit | #6a1b9a, pad .4rem 1rem, r 8px, hover bg #f3e5f5 / #4a148c |
| footer | inherit | 0.95rem | 400 | inherit | #777, center, pad 1.5rem, bt 2px #e0e0e0, mt 2rem |
| prose div | inherit | 1.05rem | 400 | 1.8 | #444, pad 2rem, r 12px, bl 4px #ec407a, gradient bg |
| tab button | **UA default control face** (no font-family set) | 1.1em | bold | — | #666; active #2196F3 + bb 3px + bg #fff |
| h4 (team name) | inherit | UA 1em | UA bold | inherit | m .2em 0 |

## Modules
- Media cells: source = layout `table` (w 100%, max-w 1200, m 1.5rem auto, border-collapse separate,
  border-spacing 1.5rem); `td` white card (r 12, pad 1rem, shadow, 2px transparent border, hover lift/-4px);
  `img, iframe` block, w 100%, h auto, aspect-ratio 16/9, r 8px. Recreated as a 2-col grid: gap 1.5rem,
  padding 1.5rem (= outer border-spacing), cells (1200−72)/2 = 564px @1440 (cap-probe: td 564 fixed).
  ≤768: border-spacing 0, tr flex column gap 1rem, td block mb 1rem → grid 1 col, row-gap 2rem, pb 1rem.
- Team tabs: `.tabs-section` m 2em 0, pad 1em, r 12, bg #f8f8f8; `.tab-buttons` flex, bb 2px #ddd, mb 1em;
  `.tab-content` display none + fadeIn .4s, `.active` flex space-between gap 2em; `.team-card` 48%, pad 1em,
  r 10, shadow 0 2px 8px rgba(0,0,0,.07), column, center; photo 120×120 round cover mb 1em.
  ≤900: column, gap 1.2em, card 100%.
- Chrome: no `<header>` element on the source (nav.site-header is the banner); `<footer>` present.

## Media renditions
- picsum 800×600 JPEGs rendered at 16/9 (object-fit fill → stretched, as captured); rehosted copies in
  `stardust/prototypes/assets/` (extract's downloads). randomuser portraits 128×128 → 120×120 cover.
- YouTube iframe kept as the same embed src (dynamic-features row 1, embed-passthrough).

## Interaction (observed, motion-observe 2026-10-06)
- 3 clicks → 6 class mutations (`active` on button i + panel i), 3 `fadeIn` animations; hover transitions on
  nav links and media cells. Implemented in `js/team-tabs.js`; dead classes: none.

## Gate-driven corrections (iteration 1 → 2)
- Missing universal `* { box-sizing: border-box }` in the first canon draft (every 1200px box read 1248 and x −24; body min-height 100vh + padding made page1 964px tall). Added verbatim.
- Video row: the source's auto table layout gives the iframe column 324px and the image column 804px of 1128px @1440
  (iframe intrinsic 300 + 36 chrome : img 800 + 36). Encoded as `.media-cells--video { grid-template-columns: 336fr 836fr }`.
- R-03 (applied): tab-button padding 1em 1em at ≤768px so the row stays inside the 360px viewport (live overflows to 401px).
