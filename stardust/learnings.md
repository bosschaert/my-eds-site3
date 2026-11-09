# Learnings

- 2026-11-02 · EDS sanitises `_` in path segments (`esg_result` → `esg-result`); rollout `inventory.mjs` kept the source path in coverage, so `done-check`/`verify` probed a 404. Set the coverage `path` to `eds-path.deliveredUrl()` and wire the source path into the redirects sheet at D-site.
- 2026-11-02 · `publicUrl()` adds a trailing slash when `migratedHtml` ends in `index.html`, but leaf pages are served without one; a trailing-slash redirect row keeps verify and visitors on 200.
- 2026-11-02 · DA normalises `<a><strong>` into `<strong><a>`; chrome CSS written against `a strong` misses — style `li strong` too (footer link weight/colour delta in chrome-parity).
- 2026-11-02 · In a fixed-scope run, nav/footer carry many root-relative links to pages outside the plan; repoint them to the source origin at E2 (scope extension), or verify reports them broken.
- 2026-11-02 · verify.mjs flags widget references (`/widgets/<path>/<name>.html`) as broken internal links though they serve 200.
