# Foundation requests

- archetype-home | `main > .section > div { max-width: 1280px }` caps every block wrapper; all 6 home blocks are full-bleed bands with their own 1280 inner | each block CSS carries `main > .section > .<name>-wrapper { max-width: none }` (qa-gate --full-bleed 6/6 at 1440) | home
- archetype-home | pill hover twin is CSS-only (title attr) so block-roundtrip / content-diff read proto "View allView all" vs EDS "View all" as MISSING CTA on every pill (6 on home) | block-roundtrip whole-page: only 🔴 are the 6 pill-twin pairs, EW 46/46; gate-all content MISSING 0 | home

## Applied at C-final (2026-10-13)

- Request 1 (block wrapper 1280 cap): reviewed, kept as the block-scoped overrides already shipped — one template, every band full-bleed; no foundation edit, no visible change.
- Request 2 (pill twin label read as MISSING by block-roundtrip): instrument artifact of the CSS-drawn twin; duplicating the label as real text would add words to the page. No change; gate-all content MISSING 0.
