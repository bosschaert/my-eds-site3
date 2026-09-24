# Dynamic features — balbriggan.ie (community-development, bounded single-page run)

Curated from stardust/dynamics/dynamic-features.generated-plan.md (detector: 1 page, 5 findings). Hands-off: owner decisions are recorded by name, the interim tier ships, the static recreation continues regardless.

## Listings contract
none — the page has no listing blocks, no search form, no same-site data endpoints.

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-datalayer | WordPress/GTM `dataLayer` settings object | A | 1/1 | decided-out | self | done | read-settings | none — the object only feeds the tag manager (row 3); no page content reads it | stardust/current/_dynamics.json |
| 2 | m-modal-trigger-aria-haspopup-chrome-only-a-content | Header primary-menu dropdowns (4 × `aria-haspopup`, Bootstrap 4 collapse/dropdown) + mobile hamburger | M | 1/1 | rebuild-native | self | done | chrome-interaction | none — implemented in the header block only for behaviours motion-observe records as firing (Phase 4 interaction parity) | stardust/current/pages/community-development.json#dynamic.triggers |
| 3 | t-tag-manager-google-tag-manager | Google Tag Manager container | T | 1/1 | embed-passthrough | needs-business-decision | interim: not loaded | consent-gated-tags | Owner: which tags run on the new host and under which property ids. Interim tier ships without the container. | third-party script host www.googletagmanager.com |
| 4 | t-analytics-google-analytics-ads | Google Analytics (GA4 collect) | T | 1/1 | embed-passthrough | needs-business-decision | interim: not loaded | consent-gated-tags | Owner: same decision as row 3 (GA4 loads through GTM). | POST www.google-analytics.com/g/collect |
| 5 | t-marketing-ad-retargeting-pixel | Facebook pixel / SDK | T | 1/1 | embed-passthrough | needs-business-decision | interim: not loaded | consent-gated-tags | Owner: same decision as row 3; pixel id lives in the source page. | third-party script host connect.facebook.net |

## Decision batch
One message to the site owner: **Tags on the new host** — confirm whether Google Tag Manager (and through it GA4 and the Facebook pixel) should load on the migrated site, with the container/property ids to use. Until confirmed, the migrated page ships without third-party tags (rows 3–5, interim tier). No pixel or content on the page depends on them.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| `dataLayer` settings object (row 1) | only a carrier for the tag manager's configuration; nothing rendered reads it | Not migrated as content; re-created automatically if and when the GTM snippet is added per the decision batch. |
