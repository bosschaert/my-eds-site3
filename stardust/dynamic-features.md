# Dynamic features — https://new.express.adobe.com/webpage/DYft29Wzo0QLK

Detected 2026-10-06 (dynamics-detect, app mode + static mode; reach from extract --dynamics). Draft: stardust/dynamics/dynamic-features.generated-plan.md. Target origin probe: all 11 first-party API paths are host-bound (4xx on the EDS host).

Verified 2026-10-06 (rollout B2-dynamic): detector re-run on the live page → 28 findings (29 at triage; the two footer `/go/` locale rows merged into one), all mapped to the 10 rows below; dynamics-plan with `--target-origin https://main--b7aaf274--aemcoder.aem.live --migrated stardust/migrated` → host-bound 11/11, footer links already delivered in the migrated HTML. Every row is decided; nothing blocks C-deliver.

## Listings contract
none — a single page with no listing blocks.

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | cr-main-empty-at-load | client-rendered page (publication JSON → DOM) | CR | 1/1 | static-snapshot | n/a off-origin | decided | settled DOM captured from the static page mode; content authored as EDS documents | self | text at load 57 → settled 2209 |
| 2 | a-first-party-api-* (json, branding, metadata, floodgate, xcs-assets-cdn, ims/*, ee/*) | Express publication, feature-flag, identity and edge APIs | A | 2/2 | decided-out | host-bound | decided | no consumer on a static page | self | 11/11 host-bound |
| 3 | a-unknown-third-party-host-* (hz-gneiss, platform-cs, bps-il adobe.io; api2.branch.io) | Express platform services | A | 1/1 | decided-out | host-bound | decided | platform telemetry/branch deep links | self | app-mode only |
| 4 | cr-report-abuse-* + f-form-report-abuse-form | Report Abuse dialog + form (9 fields, JS-wired) | CR/F | 1/1 | decided-out | session-bound | decided | register R-01 | self | posts to Express moderation |
| 5 | d-first-party-data-file-* (en-US locale json, susi-light login gql) | runtime locale bundle + login mini-app | D | 2/2 | decided-out | n/a | decided | app runtime only | self | — |
| 6 | i18n-locale-variants-go | adobe.com/go redirect links (privacy, tou) | I18N | 1/1 | embed-passthrough | self | decided | footer links kept verbatim | self | — |
| 7 | t-tag-manager-adobe-launch, t-analytics, t-rum-new-relic, t-rum-error-monitoring, t-app-link | tags, analytics, RUM | T | 1/1 | decided-out | owner | decided | EDS RUM replaces; owner may add Launch later | owner (non-blocking) | — |
| 8 | x-auth-identity-provider | IMS identity | X | 1/1 | decided-out | session-bound | decided | no sign-in on the migrated page | self | — |
| 9 | heading-anchor-copy-link | "Copy link" buttons beside each heading (page-heading-anchor) | CR | 1/1 | rebuild-native | self | decided | observed with motion-observe (click → clipboard write + toast); implemented in the archetype, parity confirmed by motion-compare; 3 dead classes not implemented | self | 9 buttons in the static DOM; stardust/replica/motion/ |
| 10 | made-in-express-badge | fixed "Made in Adobe Express" badge | static | 1/1 | static-snapshot | self | decided | replicated as captured (register R-03) | owner may remove | inline style block 5 |

## Decision batch
Nothing blocks delivery. For the owner, non-blocking: (7) analytics tags — EDS RUM is on by default; add Adobe Launch to the project if the same reporting is wanted. (10) badge — say the word and it is removed (register R-03).

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| Express publication/identity/feature-flag/edge APIs | host-bound, no consumer | The migrated page is static content; none of the Express runtime APIs are called. |
| Report Abuse dialog + form | session-bound Express moderation | The footer carries Terms of Service and Privacy Policy; Report Abuse is not offered (R-01). |
| Adobe Launch / Analytics / New Relic / Sentry | owner decision | EDS RUM replaces; no third-party tag ships by default. |
| IMS identity | session-bound | No sign-in surface on the migrated page. |
