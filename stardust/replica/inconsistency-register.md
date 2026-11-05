# Inconsistency register — page1

One entry. Everything else is a pure replica.

## R-01 — Team tab bar widens the whole page on phones

- **Evidence:** `measure.mjs` on the live page @360: `horizontal overflow +41px (scrollWidth 401 > viewport 360)`; `.tab-buttons button:last-child` x 266 w 135 (right edge 401). The build reproduced it exactly and `gate.sh` failed the hard overflow assert (`stardust/replica/gates/page1-360/overflow-iter1.txt`).
- **Finding:** defect — three fixed-padding tab buttons (padding 1em 2em, 1.1em bold) are 401px wide in total, so below ~410px the document scrolls sideways.
- **Minimal change:** `.tab-buttons { overflow-x: auto; }` — the overflow scrolls inside the tab bar instead of the document; sizes, colours, spacing and the wide-screen look are unchanged.
- **Status:** applied
- **Where:** page1 (landing) — tabs section, widths below ~410px.
