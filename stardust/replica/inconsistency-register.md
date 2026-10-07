# Inconsistency register — static-website.david-bosschaert.workers.dev replica

Hands-off run: no audit was run and no `--register` file was supplied, so no
improvement candidate was adopted. The two entries below come from the extract
cap-probe (`DESIGN.json.extensions.breakpoints.capRegister`); both are
**deferred** — this run replicates them exactly as captured. There are no
`applied` entries, so the source-fidelity gate has no exempted zones: any
design delta the gate finds is a defect, not an improvement.

## R-01 — Content width differs between the two templates (1200px vs 800px)

- **Evidence:** cap-probe at 2560px (DESIGN.json `extensions.breakpoints.caps`):
  home `body > table` capped at 1200px via `max-width`; `body > p` capped at
  800px via `max-width` on both pages, and page1 has no 1200px element.
  Source CSS (`stardust/current/assets/css/styles.css`): `table { max-width: 1200px }`
  (L95), `p { max-width: 800px }` (L79).
- **Finding:** the two templates have no shared content container; the home
  page reads 1200px wide (media table) while page1 reads 800px wide (lede
  paragraph). Both values are authored in the same stylesheet.
- **Minimal change:** none in this run. A later unification would set one
  container width per template; it would change the rendered layout.
- **Status:** deferred
- **Where:** home (landing) — media table; page1 (static) — lede paragraph.

## R-02 — Section heading capped at 285px on the home page (`body > h2`)

- **Evidence:** cap-probe at 2560px: `body > h2` fixed at 285px on the home
  page. Source CSS L67: `h2 { display: inline-block; border-bottom: 3px solid #26c6da; … }`
  — a shrink-to-fit heading whose underline spans only its own text.
- **Finding:** the heading's width is its text width, not a layout cap; the
  underline length therefore depends on the heading text. Authored intent
  (inline-block underline), not a defect.
- **Minimal change:** none in this run; replicate `display: inline-block`
  verbatim so the underline stays text-wide.
- **Status:** deferred
- **Where:** home (landing) — section headings; any page that uses `h2`.

## R-03 — Team-tab buttons overflow the viewport on narrow screens (401px at 360px)

- **Evidence:** `measure.mjs` at 360px on the live home page and page1: root
  `scrollWidth 401 > viewport 360 (+41px)`; `.tab-buttons button` widths
  119 / 115 / 135px (padding 17.6px 35.2px) inside a 296px `.tab-buttons`
  row — the third button sits outside the tabs panel and the page scrolls
  sideways. Evidence file: `stardust/replica/gates/index-360/overflow-iter1.txt`.
- **Finding:** the source's `.tab-buttons button { padding: 1em 2em }` has
  no narrow-screen rule, so the three buttons cannot fit in the 328px page
  column; the page gains horizontal scroll (a defect, not a preference —
  and the gate's hard horizontal-overflow assert fails any build that
  reproduces it).
- **Minimal change:** at `max-width: 768px`, `padding: 1em 1em` on the tab
  buttons (row height unchanged at 80px; buttons 97 / 91 / 108px, row inside
  the panel; no other change). Expected gate delta: the tab-button row only
  (one band at 360px, ≈ 22–46px horizontal shift of the button labels).
- **Status:** applied
- **Where:** home (landing) and page1 (static) — team tabs, ≤ 768px only.
