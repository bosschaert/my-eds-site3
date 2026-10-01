# Dynamic features — www.niravmanubhai.com

## Listings contract
none — the page has no listing blocks; every card and link is authored content.

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-datalayer | `dataLayer` settings object (Google tag) | A | 1/1 | static-snapshot | self | decided | read-settings | — | `window.dataLayer` populated by gtag only; no endpoints, ids or vendors beyond the tag row |
| 2 | i18n-locale-variants-en-x-default | hreflang alternates `en` / `x-default` | I18N | 1/1 | rebuild-native | self | decided | locale-tree | scope of locale trees: none — both alternates point at the same URL, one language | `<link rel="alternate">` en + x-default → same canonical |
| 3 | t-analytics-google-analytics-ads | Google Analytics 4 tag (G-00QDEH6N5W) via gtag.js | T | 1/1 | embed-passthrough | needs-business-decision | interim | consent-gated-tags | owner: confirm the property runs on the new host; shipped disabled in the site config until then | `googletagmanager.com/gtag/js`, `google-analytics.com/g/collect` 204 |
| 4 | t-tag-manager-google-tag-manager | gtag loader (same tag as row 3) | T | 1/1 | embed-passthrough | needs-business-decision | interim | consent-gated-tags | merged into row 3 (one property, one loader) | same script |
| 5 | t-unknown-third-party-host-static-cloudflareinsights-com | Cloudflare Web Analytics beacon | T | 1/1 | embed-passthrough | needs-business-decision | interim | consent-gated-tags | owner: Cloudflare Insights is bound to the current Cloudflare zone; the new host has its own RUM — not carried unless the owner asks | `static.cloudflareinsights.com/beacon.min.js`, `/cdn-cgi/rum` 204 |
| 6 | v-iframe-without-src-runtime-injected-embed | 1×1 iframe injected at runtime | V | 1/1 | decided-out | — | decided | embed-passthrough | none — the frame is the tag loader's hidden 1×1 frame; no visible surface, no consumer | evidence `1×1`, `media.iframes: []` in the capture |

The page has no forms, no search, no modals, no players, no client-rendered content and no first-party data
endpoints (`/cdn-cgi/*` are Cloudflare's own). The static recreation carries the whole visible surface.
The drawer menu (`button.nmh-menu-btn` → `nav.nmh-menu`) is chrome interaction, handled by replica's interaction-parity step, not a dynamic feature.

## Decision batch
- **Tags on the new host (rows 3–5):** which analytics run on the migrated site and under which property.
  Interim tier shipped: the Google tag id is recorded in the site config, disabled; Cloudflare Insights not carried.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| 1×1 runtime iframe | tag-loader artefact, no visible surface | The migrated page contains no hidden frames; analytics, once enabled, injects its own. |

## Pre-import verification (rollout B2, 2026-09-28)
Fresh detect on the live page: the same 6 findings (ids identical to the Phase 2 inventory); target-origin probe
`https://main--fdc3c10d--aemcoder.aem.page`: 0 first-party API paths host-bound (0/0). Every row keeps its disposition above.
No dynamic feature blocks C-deliver; rows 3–5 stay interim (analytics decision with the owner).
