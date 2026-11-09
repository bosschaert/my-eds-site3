<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-02T22:35:05.806Z · input stardust/current/_dynamics.json (2 pages, 8 findings) · target probe https://main--f1157cd0--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 2/2 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 2 | f-form-text-headerkeyword-origin-en-search-result-1-fields | F | form "text:headerKeyword" → origin /en/search/result (1 fields) | 2/2 | rebuild-native | block | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 3 | i18n-locale-variants-na-na-kr-kr-na | I18N | locale variants na,na,kr,kr,na | 1/2 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://www.bobcat.com/na/en/buying-tool" |
| 4 | i18n-locale-variants-na-na-kr-na-ap | I18N | locale variants na,na,kr,na,ap | 1/2 | rebuild-native | runtime | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://www.bobcat.com/na/en/buying-tool" |
| 5 | t-unknown-third-party-host-static-cloudflareinsights-com | T | unknown third-party host static.cloudflareinsights.com | 2/2 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 6 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 2/2 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 7 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 2/2 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 8 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 2/2 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 1 row(s) — read-settings.
- **One owner decision batch:** 5 row(s) — production endpoint; interim capture ships now · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 2 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.

## Phases

- **tags** — 4
- **locale wave** — 2
- **detect** — 1
- **forms** — 1
