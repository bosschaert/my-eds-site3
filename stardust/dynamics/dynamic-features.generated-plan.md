<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-07T12:05:37.929Z · input stardust/current/_dynamics.json (3 pages, 10 findings) · target probe https://main--bf989f9e--aemcoder.aem.live · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-utag-data | A | CMS / app settings object utag_data | 3/3 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 2 | a-first-party-api-post-content-intelligentcontent-portals-hc | A | first-party API POST /content/intelligentcontent/portals/hcp/ch/fr/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz/jcr:content.socialFeaturesPost.json | 1/3 (reach 1/10) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 3 | a-first-party-api-post-content-intelligentcontent-portals-hc | A | first-party API POST /content/intelligentcontent/portals/hcp/ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/home/jcr:content.socialFeaturesPost.json | 1/3 (reach 1/10) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 4 | f-form-text-search-text-box-no-action-js-wired-1-fields | F | form "text:search-text-box" → no action (JS-wired) (1 fields) | 3/3 | client-only | self | pending | client-compute | none |  |
| 5 | i18n-locale-variants-en-us-en-gb-en-us-de-en | I18N | locale variants en-us,en-gb,en-US,de,en | 2/3 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 6 | i18n-locale-variants-en-us-en-gb-en-us-de-it | I18N | locale variants en-us,en-gb,en-US,de,it | 1/3 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 7 | t-unknown-third-party-host-rum-hlx-page | T | unknown third-party host rum.hlx.page | 3/3 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 8 | t-unknown-third-party-host-policy-cookiereports-com | T | unknown third-party host policy.cookiereports.com | 3/3 | embed-passthrough | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "policy.cookiereports.com" |
| 9 | t-tag-manager-tealium | T | tag manager: Tealium | 3/3 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 10 | x-sign-in-account-links | X | sign-in / account links | 3/3 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 2 row(s) — read-settings, client-compute.
- **One owner decision batch:** 6 row(s) — which tier for the target host; consumer on the migrated pages? · scope of the locale trees · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 1 row(s) — no work.
- **Host-bound on the target:** 2 of 1 probed API paths — the off-origin data work.

## Phases

- **tags** — 3
- **off-origin data** — 2
- **locale wave** — 2
- **detect** — 1
- **client tools** — 1
- **register** — 1
