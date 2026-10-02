# Dynamic features — plan (The Beast Is Back Inc)

Static first, then wire. Nothing in this plan blocks the static recreation.

## Phase: client tools (self, this run)
- **Project grid masonry (row 3).** Deliverable: `blocks/project-grid` — authored list of image+link rows, decorated into the grid; JS computes `n = max(1, floor(W/300))`, column width `(W − 12(n−1))/n`, places each item in the shortest column (12px vertical gap), sets the container height; re-runs on resize and after each image load. Authoring contract: one row per project, cell 1 = picture (300w rendition; 500w source for ≤750px), cell 2 = link with the project title. Verification: replica gates at 1440/360 + content-presence (96 links) + unit-geometry family `project` within 4px. Effort: S.
- **Mobile nav toggle (row 7).** Deliverable: header block — "Menu" link toggles the nav list open/closed below 750px with the lifted styles. Verification: motion-observe live vs build (click `#mobileMenuLink a`). Effort: XS.

## Phase: capture / static-snapshot (self, this run)
- **Newsletter form UI (row 5).** Deliverable: `blocks/newsletter` rendering the title, description, email input, "Sign Up" button and footnote verbatim; the form has no action and the button is `type="button"` (no-op) until the owner names a provider. Verification: pixel gate + content-diff; the round records the no-op as the interim tier. Effort: XS.

## Phase: owner decisions (non-blocking)
- **Newsletter storage (row 5).** Owner names the provider; follow-up wires the endpoint in the block JS (no content change). Effort after decision: S.

## Decided-out
Rows 1, 2, 4, 6 — see the register in `stardust/dynamic-features.md`.
