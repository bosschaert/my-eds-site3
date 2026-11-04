<!-- stardust provenance: skill=stardust:replica (dynamics Phases 1–3) · 2026-09-23 · input stardust/current/_dynamics.json (1 page, 5 findings) · target probe https://main--stardust-replica-38f927f4--of1-labs.aem.page -->
# Dynamic features — niravmanubhai.com (home page only)

## Listings contract
none — the home page has no listing blocks; every room card is authored content with a static link.

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-datalayer | `dataLayer` global (gtag bootstrap) | A | 1/1 | static-snapshot | self | decided | read-settings | none — the object only carries GA4 config; nothing on the page reads it | `_dynamics.json` globalState |
| 2 | i18n-locale-variants-en-x-default | hreflang `en` / `x-default` on the canonical | I18N | 1/1 | decided-out | needs-business-decision → hands-off: interim | decided (hands-off) | locale-tree | site scope is one page, one language; no locale tree exists to migrate | `<link rel=alternate hreflang>` in head |
| 3 | t-unknown-third-party-host-static-cloudflareinsights-com | Cloudflare Web Analytics beacon | T | 1/1 | embed-passthrough | needs-business-decision → hands-off: interim | interim (hands-off) | consent-gated-tags | host-bound to the Cloudflare zone of the source domain; not re-wired on the preview host. Owner decides whether to keep it on the new host. | script src static.cloudflareinsights.com/beacon.min.js |
| 4 | t-tag-manager-google-tag-manager | gtag.js loader (G-00QDEH6N5W) | T | 1/1 | embed-passthrough | needs-business-decision → hands-off: interim | interim (hands-off) | consent-gated-tags | tag not loaded on the preview host (would report preview traffic into the production property); owner confirms property id for the launch host | script src googletagmanager.com/gtag/js |
| 5 | t-analytics-google-analytics-ads | GA4 collect + house-analytics.js / analytics-enhancements-v143.js event helpers | T | 1/1 | embed-passthrough | needs-business-decision → hands-off: interim | interim (hands-off) | consent-gated-tags | same decision as #4; the helper scripts only push events to gtag | POST www.google-analytics.com/g/collect |
| 6 | nav-drawer | Hamburger menu drawer (`.nmh-menu-btn` → `.nmh-menu.open` + `.nmh-overlay`, close button, Escape) | M | 1/1 | rebuild-native | self | planned (replica Phase 3 interaction parity) | chrome-interaction | none — pure client behaviour, no data | nmh-navigation-foundation.js; observed in motion-observe (Phase 3) |
| 7 | page-in | `body.nm-ready` entrance animation (.42s, disabled under reduced motion) | M | 1/1 | rebuild-native | self | planned (replica Phase 3) | chrome-interaction | none | site-enhancements-v132.js adds `nm-js`/`nm-ready`; house-foundation.css `nm-page-in` |

No forms, no search, no players, no iframes, no client-rendered content, no same-site data endpoints other than the Cloudflare RUM beacon (`/cdn-cgi/rum`, part of #3).

## Decision batch
One message to the owner, after launch planning:
- **Analytics on the new host (#3, #4, #5):** confirm the GA4 property id (G-00QDEH6N5W) and whether Cloudflare Web Analytics should follow the site to the new host. Interim: none of the three tags load on the preview host, so preview traffic never pollutes production analytics.
- **Locale (#2):** the site is single-language; `hreflang` alternates are dropped on the replica. Confirm nothing else is expected.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| hreflang en / x-default alternates | single page, single language; there is no locale tree to point at | The replica page emits no hreflang alternates. |
