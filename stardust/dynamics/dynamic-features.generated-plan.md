<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-06T11:39:10.984Z · input stardust/current/_dynamics.json (1 pages, 28 findings) · target probe https://main--b7aaf274--aemcoder.aem.live · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-hz-gneiss-adobe-io | A | unknown third-party host hz-gneiss.adobe.io | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-api2-branch-io | A | unknown third-party host api2.branch.io | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-platform-cs-adobe-io | A | unknown third-party host platform-cs.adobe.io | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-unknown-third-party-host-bps-il-adobe-io | A | unknown third-party host bps-il.adobe.io | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | a-first-party-api-get-json | A | first-party API GET /json/ | 1/1 (reach 2/2) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 6 | a-first-party-api-get-webpage-dyft29wzo0qlk-branding | A | first-party API GET /webpage/DYft29Wzo0QLK/branding | 1/1 (reach 1/2) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 7 | a-first-party-api-post-ims-check-v6-token | A | first-party API POST /ims/check/v6/token | 1/1 (reach 2/2) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 8 | a-first-party-api-get-service-floodgate-fg-api-v3-feature | A | first-party API GET /service/floodgate/fg/api/v3/feature | 1/1 (reach 2/2) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 9 | a-first-party-api-post-ee-v1-interact | A | first-party API POST /ee/v1/interact | 1/1 (reach 2/2) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 10 | a-first-party-api-get-ims-country-code-v1 | A | first-party API GET /ims/country_code/v1 | 1/1 (reach 2/2) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 11 | a-first-party-api-get-service-xcs-assets-cdn-unified | A | first-party API GET /service/xcs-assets-cdn/unified | 1/1 (reach 2/2) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 12 | a-first-party-api-get-webpage-api-metadata-dyft29wzo0qlk | A | first-party API GET /webpage/api/metadata/DYft29Wzo0QLK | 1/1 (reach 2/2) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 13 | a-first-party-api-post-ee-v2-interact | A | first-party API POST /ee/v2/interact | 1/1 (reach 2/2) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 14 | cr-client-rendered-slot-banner-success-js-report-success | CR | client-rendered slot banner success js-report-success | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 15 | cr-client-rendered-slot-banner-error-js-report-error | CR | client-rendered slot banner error js-report-error | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 16 | cr-client-rendered-slot-report-abuse-dialog-js-report-abuse- | CR | client-rendered slot report-abuse-dialog js-report-abuse-dialog | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 17 | cr-client-rendered-slot-report-abuse-form-js-report-abuse-fo | CR | client-rendered slot report-abuse-form js-report-abuse-form | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 18 | cr-main-empty-at-load-filled-after-client-rendered-page | CR | main empty at load, filled after (client-rendered page) | 1/1 | static-snapshot | needs-human-capture | pending | client-rendered-page | human-browser capture; never migrate blank |  |
| 19 | d-first-party-data-file-get-static-en-us-6335cc348a9f4adc-js | D | first-party data file GET /static/en-US.6335cc348a9f4adc.json | 1/1 (reach 2/2) | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 20 | d-first-party-data-file-get-content-dam-pandora-react-mini-a | D | first-party data file GET /content/dam/pandora/react-mini-app-susi-light-login/v1/en-us/main/index.cfm.gql.json | 1/1 (reach 2/2) | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 21 | f-form-report-abuse-form-no-action-js-wired-9-fields | F | form "report-abuse-form" → no action (JS-wired) (9 fields) | 1/1 | client-only | self | pending | client-compute | none |  |
| 22 | i18n-locale-variants-go-go-go | I18N | locale variants go,go,go | 1/1 | rebuild-native | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "http://www.adobe.com/go/privacy" |
| 23 | t-tag-manager-adobe-launch | T | tag manager: Adobe Launch | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 24 | t-unknown-third-party-host-app-link | T | unknown third-party host app.link | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 25 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 26 | t-rum-new-relic | T | RUM: New Relic | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 27 | t-rum-error-monitoring | T | RUM: error monitoring | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 28 | x-auth-identity-provider | X | auth: identity provider | 1/1 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 7 row(s) — settled-dom-snapshot, sheet-sync, client-compute.
- **One owner decision batch:** 19 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · human-browser capture; never migrate blank · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 1 row(s) — no work.
- **Host-bound on the target:** 11 of 11 probed API paths — the off-origin data work.

## Phases

- **off-origin data** — 9
- **capture** — 5
- **tags** — 5
- **detect** — 4
- **data** — 2
- **client tools** — 1
- **locale wave** — 1
- **register** — 1
