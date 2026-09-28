# Learnings — Example Domain replica (2026-09-28)

- **Chrome-less sites collapse C0 and C1.** With no header/footer and one page, the shell document IS the archetype page; the foundation unit PUT it and gated it, the cluster unit only re-verified. Recording that in `progress.json` kept the unit ledger honest without a redundant subagent.
- **`--main` on a delivered page is not `body > :first-child`.** EDS renders `header` first; the symmetric root for a class-less source wrapper vs the delivered `main` is the compound selector `"body > div, main"`. The recreate-phase selector would have gated the empty header.
- **gate.sh `--full` chrome step on chrome-less pages.** The default header/footer regions report "live has no element" against the delivered (empty, hidden) elements; the region-scoped `chrome-parity.mjs --no-defaults --region content=…` run is the parity evidence. Worth an upstream flag.
- **gate-evidence lints the migrated file, not the delivered one.** `lint=…2P1` came from the self-contained `stardust/migrated/index.html` (no `<header>/<footer>` wrappers); `content/index.html` lints clean — read both before treating the sidecar line as a delivery defect.
- **Sitemap verification is impossible on a preview-only run.** `assemble.mjs --verify-origin` cannot pass while nothing is published; name the served count (0, HTTP 404) in the ledger and point the owner at publish + configuration.
- **A fresh checkout may lack lint deps.** `npm run lint:js` failed until a project-root `npm install` (missing @babel/core); package-lock unchanged.
