# Inconsistency register — static-website.david-bosschaert.workers.dev replica

One entry. Everything not listed here is frozen; any other design delta found by the gate is a
defect, not an improvement.

## R-01 — Team tab row overflows the mobile viewport

- **Evidence:** measure.mjs on both live pages at 360: `root scrollWidth 401 > viewport 360 (+41px)`;
  the three `.tab-buttons button` boxes span x 32→401 (119 + 115 + 135 px wide, text already
  wrapped to min-content). gate.sh overflow assert evidence:
  `stardust/replica/gates/index-360/overflow-iter1.txt`, `stardust/replica/gates/page1-360/overflow-iter1.txt`.
- **Finding:** defect — the page scrolls horizontally on phones because the tab row cannot shrink
  below its buttons' min-content width (the source's own 900px rule stacks the cards but never the tabs).
- **Minimal change:** the tab row scrolls inside itself (`overflow-x: auto; scrollbar-width: none`);
  button sizes, padding, type and colours unchanged. At ≥ 401px viewports nothing changes.
- **Status:** applied
- **Where:** team tabs on both page types (landing, static), widths below ~401px. Expected gate delta:
  the 3rd tab's last ~73px is scrolled out of view inside the tab row at 360 instead of overhanging the page.
