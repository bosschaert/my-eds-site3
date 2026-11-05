# Inconsistency register — balbriggan.ie

The ONLY permitted design deltas for this replica. No audit was requested and no items were supplied; one entry
was forced by the gate's non-waivable horizontal-overflow assert (source-fidelity-gate § Pass bar). Otherwise a pure replica.

## R1 — horizontal overflow at 360 (What's New carousel arrow)

- **Evidence:** live @360 `document.documentElement.scrollWidth` 370 > 360 (measure.mjs root line,
  `stardust/replica/lift/measure-live.txt`); the only box past the viewport is `button.slick-next` (right 370, w 20,
  `right: -25px` from slick-theme.css). The prototype replicated it and failed gate.sh's overflow assert (iter1).
- **Minimal change:** `.whats-new { overflow-x: clip }` — the arrow's off-viewport 10px are clipped at the section
  edge. Inside the viewport the render is unchanged (the live viewport already cuts the same 10px); the page simply
  stops scrolling sideways.
- **Status:** applied (recreate iter2).

Not register entries (documented elsewhere because they are fallbacks, not design changes):
- Gotham (commercial kit) → Sora substitute, brand names first in the stacks (fonts policy; logged in progress.json residuals).

## R2 — page-title h1 (assistive tech / search only, not painted)

- **Evidence:** the live home page renders 0 `<h1>` (curl of https://balbriggan.ie/ — first heading is an h2); rollout
  `verify.mjs` fails the delivered page on "exactly one <h1>, found 0" (E-full-site, 2026-10-28).
- **Minimal change:** one `<h1>Our Balbriggan</h1>` — the page's captured title, verbatim — first in the hero card,
  visually hidden by `.hero-page-title` (clip-path, 1px absolute). No pixel, layout or visible-text change.
- **Status:** applied (E-full-site).
