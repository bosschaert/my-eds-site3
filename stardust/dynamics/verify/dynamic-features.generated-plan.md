<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-09-28T10:19:37.305Z · input stardust/dynamics/verify/_dynamics.json (1 pages, 7 findings) · target probe https://main--22880d22--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-wp | A | CMS / app settings object wp | 1/1 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 2 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 1/1 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | f-form-gform-1-origin-5-fields | F | form "gform_1" → origin / (5 fields) | 1/1 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 4 | m-modal-trigger-aria-haspopup-chrome-only-a-content | M | modal trigger aria-haspopup (chrome only) → a:content | 1/1 (reach 4/1) | rebuild-native | self | delivered-by-capture | chrome-interaction | none (motion-observe evidence) | output already carries "https://balbriggan.ie/#" |
| 5 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 6 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 7 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 2 row(s) — read-settings.
- **One owner decision batch:** 4 row(s) — production endpoint; interim capture ships now · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 1 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.

## Phases

- **tags** — 3
- **detect** — 2
- **forms** — 1
- **interactive** — 1
