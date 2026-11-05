<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-05T11:48:52.635Z · input stardust/current/_dynamics.json (1 pages, 1 findings) · target probe https://main--1588603b--aemcoder.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | t-unknown-third-party-host-randomuser-me | T | unknown third-party host randomuser.me | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 0 row(s) — none.
- **One owner decision batch:** 1 row(s) — which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.
- **Martech:** no CMP · 0/0 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 1
