# Dynamic features plan — static-website.david-bosschaert.workers.dev

Source of truth: `stardust/dynamic-features.md` (3 rows, all `self`). No owner
decision batch, no host-bound API, no index, no forms.

## Phase media — YouTube embed (row 1)
- **Deliverable:** `embed` block (or the boilerplate embed) carrying `https://www.youtube.com/embed/b4Rr_7y068U` as the authored URL; rendered as the same iframe size as the source media-table cell.
- **Authoring contract:** one block row with the video URL as a link; no autoplay parameters added (none on the source).
- **Verification:** published-origin page shows one iframe whose `src` host is `www.youtube.com` and video id `b4Rr_7y068U`; pixel gate band over the media table within bar (poster is third-party, capture-state policy applies).
- **Effort:** small.

## Phase interaction — Team tabs (row 2)
- **Deliverable:** `team-tabs` block JS: click on button *i* sets `.active` on button *i* and panel *i* only; panels hidden otherwise; `fadeIn 0.4s` on activation (CSS verbatim).
- **Authoring contract:** one block, one row per tab (tab label cell + card cells); first tab active on load (as captured).
- **Verification:** `motion-observe.mjs` on the live page (`--click` each button in order) → `stardust/replica/motion/<slug>.json`; same pokes on the served prototype → `-build.json`; `motion-compare.mjs` reports parity for the 3 class toggles; pixel number returns to the gated value.
- **Effort:** small.

## Phase media — Remote images (row 3)
- **Deliverable:** already delivered by extract: 9 files in `stardust/current/assets/media/`; the migrate asset step uploads them to the target media bus.
- **Verification:** `media-reconcile` at import: 9/9 images resolve on the preview origin; no request to randomuser.me / picsum.photos from the migrated pages.
- **Effort:** none beyond the asset step.

## Owner decisions
none.
