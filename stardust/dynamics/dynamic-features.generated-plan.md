<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-01T14:41:56.611Z · input stardust/current/_dynamics.json (1 pages, 10 findings) · target probe https://main--c151e704--aemcoder.aem.live · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-first-party-api-post-api-census-recordhit | A | first-party API POST /api/census/RecordHit | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 2 | a-first-party-api-post-api-census-form-render | A | first-party API POST /api/census/form-render | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 3 | cr-client-rendered-slot-yui3-js-enabled-js-flexbox | CR | client-rendered slot yui3-js-enabled js flexbox | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 4 | cr-client-rendered-slot-project-gallery-project | CR | client-rendered slot project gallery-project | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 5 | f-form-newsletter-form-no-action-js-wired-1-fields | F | form "newsletter-form" → no action (JS-wired) (1 fields) | 1/1 | client-only | self | pending | client-compute | none |  |
| 6 | t-unknown-third-party-host-assets-squarespace-com | T | unknown third-party host assets.squarespace.com | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 7 | t-unknown-third-party-host-definitions-sqspcdn-com | T | unknown third-party host definitions.sqspcdn.com | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 8 | t-unknown-third-party-host-static1-squarespace-com | T | unknown third-party host static1.squarespace.com | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 9 | t-unknown-third-party-host-images-squarespace-cdn-com | T | unknown third-party host images.squarespace-cdn.com | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 10 | t-unknown-third-party-host-file-squarespace-cdn-com | T | unknown third-party host file.squarespace-cdn.com | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 3 row(s) — settled-dom-snapshot, client-compute.
- **One owner decision batch:** 7 row(s) — which tier for the target host; consumer on the migrated pages? · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 2 of 2 probed API paths — the off-origin data work.

## Phases

- **tags** — 5
- **off-origin data** — 2
- **capture** — 2
- **client tools** — 1
