# Learnings — replica migration of https://www.example.com/ (2026-09-23)

### Prototype refused by the migrate driver for a missing `<main>`
- failure class: silent-render
- evidence: `migrate` render of `index` exited strict 2 the first time — the gated prototype `stardust/prototypes/index-proposed.html` wrapped its content in a plain `<div>`; adding `<main class="content">` plus empty `<header>`/`<footer>` wrappers made it pass, and iter3/iter4 pixel rounds re-proved 0.00% at 1440 and 360 (journal § Migrate render).
- proposed change: `skills/replica/reference/recreation-procedure.md` § Cumulative archetype prototypes — require the landmark skeleton (`header`, `main`, `footer`, empty when the source has no chrome) from the first authored line, so the gate passes a prototype the migrate driver will accept.
- status: pending

### Comment braces in canon.css truncated the driver's inline `:root` copy
- failure class: silent-render
- evidence: `canon.css` comments containing `{ … }` fragments cut the migrate driver's inline `:root` extraction short; rewording the comments (no rendering change) and re-rendering with `--force` fixed it (journal § Migrate render).
- proposed change: `skills/migrate/scripts/migrate.mjs` — strip `/* … */` comments before scanning for the `:root` block; and `skills/replica/reference/recreation-procedure.md` § CSS lifting — "no braces inside CSS comments in canon.css".
- status: pending

### Coverage left `pending` after the foundation unit delivered the shell page
- failure class: path-safety
- evidence: C0 delivered `/index` (deploy ledger `live`, published gate 0.00%/0.00%) but `stardust/rollout/coverage/pages.json` still read `delivery.status: pending` at the next session's start; the cluster unit had to run `update-coverage.mjs index --status deployed` before `assemble`/`verify` could see the page.
- proposed change: `skills/replica/reference/handoff-contract.md` § 3 row C (C0 foundation) — list `update-coverage.mjs <slug> --status deployed --url …` as the last step of the foundation subagent's chain whenever the shell page IS a coverage page, mirroring the cluster chain.
- status: pending

### Dashboard counted an out-of-scope source-parity finding as open
- failure class: silent-render
- evidence: `dashboard.mjs` first run showed `index` at stage `deployed`, `openFindings 1`, optimised 0/1, while `optimize.mjs` reported open P1/P2/P3 0/0/0 and health 100 — the one finding (`f-54be5a397f`, ai-search/jsonld, `fixability: out-of-scope`, evidence prefix `source parity:`) is excluded from optimize's counts but not from the dashboard's. Resolving it `accepted` via `findings.mjs` flipped the stage to `optimised`.
- proposed change: `skills/rollout/scripts/dashboard.mjs` — exclude findings with `fixability: out-of-scope` (or `source parity:` evidence) from `openFindings`, matching `optimize.mjs`'s scoring rule; or have `optimize.mjs` record parity findings as `accepted` at detect time.
- status: pending
