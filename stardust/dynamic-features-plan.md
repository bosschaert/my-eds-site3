# Dynamic features — plan

Source: stardust/dynamic-features.md (10 curated rows from 29 findings; re-verified at rollout B2 against 28 fresh findings — no new row).

## Phase A — static recreation (Phase 3, this run)
- Deliverable: the page as EDS content + blocks; settled DOM from the static page mode is the content source (row 1).
- Authoring contract: verbatim text, images rehosted, footer per register R-01, badge per R-03.
- Verification: source-fidelity gate (pixel, content-diff, visual-diff, clip, overflow) at 1440 and 360.

## Phase B — interaction parity (Phase 3 § Interaction parity)
- Row 9 (heading "Copy link") — DONE in Recreate (observed, implemented, motion-compare parity): motion-observe on the live static page (hover a heading, click an anchor); implement only observed behaviour (clipboard write + tooltip) as a tiny block script; re-observe the build and compare.
- Effort: small. Owner decision: none.

## Phase C — decided-out
- Rows 2–5, 7, 8: nothing to build; production statements recorded in dynamic-features.md § Register.

## Owner decisions (non-blocking)
- Analytics (row 7) and badge (row 10) — see § Decision batch.
