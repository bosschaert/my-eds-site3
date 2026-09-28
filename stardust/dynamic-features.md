<!-- stardust:provenance
  writtenBy: stardust:replica
  writtenAt: 2026-09-28T07:25:17Z
  readArtifacts:
    - stardust/current/_dynamics.json
    - stardust/current/dynamic-features.generated.md
    - stardust/dynamics/dynamic-features.generated-plan.md
  synthesizedInputs: []
  stardustVersion: 0.25.1
-->
# Dynamic features — www.example.com

Pages probed: / (the whole site) · settle 5000 ms · width 1440 · reach from 1/1 crawled pages.
Target probe: https://main--c228fa32--aemcoder.aem.page (0 first-party API paths recorded, none to probe).

## Features

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|

No dynamic features detected: 0 third-party hosts, 0 first-party API calls, 0 forms, 0 triggers, 0 media players, 0 client-rendered regions. The page is fully static HTML with one outbound link.

## Listings contract

None — no listing, search or index surface exists.

## Decision batch

Empty — nothing requires an owner decision.

## Register

Empty — every row (none) has a disposition; the Phase 2 gate passes.

## Pre-import re-verification (rollout B2, 2026-09-28T07:39Z)

Re-probed https://www.example.com/ live (settle 5000 ms, width 1440): 0 third-party hosts, 0 first-party API calls, 0 forms, 0 triggers, 0 media players, 0 client-rendered regions. Target probe against https://main--c228fa32--aemcoder.aem.page: 0 API paths, none host-bound. Reconciled against stardust/migrated: 0 rows. The gate passes with an empty register; nothing blocks C-deliver.
