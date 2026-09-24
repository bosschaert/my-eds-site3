# Local edits to shipped script copies (this project)

- 2026-09-23 — all `window.scrollTo(` calls inside page-context evaluates were replaced by
  `window.scroll(` (same native API). Reason: balbriggan.ie's theme script
  (`themes/balbriggan2024/js/scripts.js`) declares a global `function scrollTo(target)` that
  shadows `window.scrollTo`; the crawler's scroll step then threw
  `Cannot read properties of undefined (reading 'top')` and captured nothing. Behaviour is
  identical on every other site. Files: crawl.mjs, style-census.mjs, visual-diff.mjs,
  content-diff.mjs, stitch-shot.mjs, measure.mjs, anchor.mjs, chrome-parity.mjs,
  sibling-variance.mjs, motion-observe.mjs.
- 2026-09-23 — same replacement applied to stardust/scripts/dynamics/*.mjs (dynamics-detect failed the same way).
