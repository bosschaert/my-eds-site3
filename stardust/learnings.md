# Learnings

- 2026-10-28 · rollout E · A source page with no `<h1>` fails `verify.mjs` ("exactly one <h1>") after every pixel gate
  has passed. Replica answer: a register entry for a visually-hidden h1 carrying the captured `<title>` verbatim —
  zero pixel delta (re-gated 2.48% / 6.74%, unchanged). Decide it at Phase 2 next time, not at verify.
- 2026-10-28 · rollout G · optimize's jsonld detector reads the raw served HTML, so a JS-injected JSON-LD would not
  count; the site-wide nodes of the source's Yoast graph (WebSite + Organization) belong in `head.html`.
- 2026-10-28 · rollout D2 · Never replay `form-flow` against a production subscription endpoint (the WordPress
  newsletter form): record presence plus the owner decision instead.
- 2026-10-28 · curl of aem.live code assets needs `--compressed`; a bare `grep` over the gzip body silently misses.
