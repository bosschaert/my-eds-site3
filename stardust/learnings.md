# Learnings — thebeastisback.com replica run (2026-10-01)

### gate-all cannot select a delivered page from the shipped state writer
- failure class: path-safety (ledger/state contract gap between two shipped scripts)
- evidence: `gate-all.mjs` selects pages with `status: "deployed"` + `liveUrl` from `--state`, but `state.mjs advance` stops at `approved`/`migrated`; C-deliver unit `archetype(index)` had to derive `stardust/.work/replica/gate-state.json` (gitignored) to run the roster gate at all (journal § C-deliver, 2026-10-01T15:50Z)
- proposed change: `skills/stardust/scripts/state.mjs` — accept `advance <slug> --to deployed --url <liveUrl>` (state-machine.md § Stages) so `gate-all.mjs --state stardust/state.json` works unmodified; `skills/replica/reference/handoff-contract.md` § 3 row C names that command
- status: pending

### Brand h1 lives in the header fragment, so the server HTML has no h1
- failure class: silent-render (SEO heading only present after client-side fragment load)
- evidence: `optimize.mjs` P1 seo/single-h1 on `/` and `verify.mjs` h1 check both failed because the source site's only h1 is the brand mark in the header; the recreated header fragment carried it, the page document did not (ledger F-optimize → G-aem, 2026-10-01T16:07Z). Fixed by authoring the h1 in the page document in a hidden `brand` section adopted by `header.js`.
- proposed change: `skills/deploy/SKILL.md` § 3 (foundation / chrome fragments) — rule: a heading the source renders inside the header must be authored in each page document and adopted into the header by `header.js`, never left in `/nav`; `skills/rollout/SKILL.md` § Phase F names the fragment-h1 case as the expected cause of seo/single-h1 on replica runs
- status: pending

### verify.mjs h1 and link heuristics read server HTML only
- failure class: capture-gap (verification probes the unrendered document)
- evidence: `verify.mjs` flagged `index` for a missing h1 (rendered by the header fragment at the time) and for 99 coverage-row hrefs that are out-of-scope paths intentionally 301-redirected to the source site; both overridden with evidence in `stardust/eds-conversion-log.md § E-full-site` (ledger E-full-site, 2026-10-01T16:05Z)
- proposed change: `skills/rollout/scripts/verify.mjs` — evaluate headings on the rendered DOM (Playwright, same live-session hardening as gate-all) and treat an href whose path matches a `redirects.json` source row as resolved; `skills/rollout/SKILL.md` § Phase E documents the redirected-href allowance
- status: pending

### aem.live origin serves code gzipped regardless of Accept-Encoding
- failure class: capture-gap (false "code not live" reading)
- evidence: after pushing `header.js` / `styles.css` in G-aem, a plain `curl … | grep` on the live origin found no match because the body was gzip-compressed even with `Accept-Encoding: identity`; `curl --compressed` showed the change (journal § G-aem, 2026-10-01T16:18Z)
- proposed change: `skills/replica/reference/handoff-contract.md` § 4 (deploy script usage) and `skills/deploy/SKILL.md` § code-push verification — every live-code check uses `curl --compressed` (or the admin API's `code` status) before concluding the push did not land
- status: pending

### Rollout block coverage stays `pending` after a foundation-unit delivery
- failure class: index-empty (roll-up never updated by the path that delivered the blocks)
- evidence: `rollout.json.lastRun.blocks` read `3 pending · 0 converted` at H-report although header, footer and project-grid had been live since the C-deliver `foundation` unit; fixed with three `update-coverage.mjs --block <id> --status verified` lines at H-report (ledger H-report, 2026-10-01T16:20Z)
- proposed change: `skills/replica/reference/handoff-contract.md` § 3 row C (foundation unit) — the foundation subagent's chain ends with `update-coverage.mjs --block <id> --status deployed --eds-name <name>` per delivered block, and the `gate-all` unit flips them to `verified`
- status: pending
