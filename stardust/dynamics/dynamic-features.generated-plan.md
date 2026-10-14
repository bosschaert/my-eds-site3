<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-14T09:00:43.445Z · input stardust/current/_dynamics.json (1 pages, 22 findings) · target probe main--1370701b--aemcoder.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-fareharbor-com | A | unknown third-party host fareharbor.com | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-otel-hfo-fareharbor-engineering | A | unknown third-party host otel-hfo.fareharbor.engineering | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-first-party-api-get-wp-json-complianz-v1-banner | A | first-party API GET /wp-json/complianz/v1/banner | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (Failed to parse URL from main--1370701b--aemcoder.aem.page/wp-json/complianz/v1/)** |
| 4 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 1/1 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 5 | cr-client-rendered-slot-mx-auto-flex-flex-col-reverse | CR | client-rendered slot mx-auto flex flex-col-reverse | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 6 | cr-client-rendered-slot-attraction-carousel-relative-pb-32 | CR | client-rendered slot attraction-carousel relative pb-32 | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 7 | cr-client-rendered-slot-flex-flex-col-items-stretch | CR | client-rendered slot flex flex-col items-stretch | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 8 | cr-client-rendered-slot-flex-flex-col-space-y-4 | CR | client-rendered slot flex flex-col space-y-4 | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 9 | cr-client-rendered-slot-testimonials-bg-brand-blue-js-show-o | CR | client-rendered slot testimonials bg-brand-blue js-show-on-scroll | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 10 | cr-client-rendered-slot-py-16-pt-8-js-show-on-scroll | CR | client-rendered slot py-16 pt-8 js-show-on-scroll | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 11 | cr-client-rendered-slot-flex-flex-col-js-show-on-scroll-img | CR | client-rendered slot flex flex-col js-show-on-scroll-img | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 12 | l-listing-candidate-flex-flex-col-6-cards | L | listing candidate flex flex-col (6 cards) | 1/1 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 13 | l-listing-candidate-mob-sub-6-cards | L | listing candidate mob-sub (6 cards) | 1/1 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 14 | l-listing-candidate-swiper-wrapper-6-cards | L | listing candidate swiper-wrapper (6 cards) | 1/1 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 15 | l-listing-candidate-grid-grd-cols-1-3-cards | L | listing candidate grid grd-cols-1 (3 cards) | 1/1 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 16 | t-unknown-third-party-host-fh-kit-com | T | unknown third-party host fh-kit.com | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 17 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 18 | t-unknown-third-party-host-dipr2nuwo661l-cloudfront-net | T | unknown third-party host dipr2nuwo661l.cloudfront.net | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 19 | t-rum-error-monitoring | T | RUM: error monitoring | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 20 | t-unknown-third-party-host-marketing-fareharbor-com | T | unknown third-party host marketing.fareharbor.com | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 21 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 22 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 1/1 | embed-passthrough | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 8 row(s) — read-settings, settled-dom-snapshot.
- **One owner decision batch:** 14 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · index-driven or editorially curated? · which tags run on the new host; property ids · resolve the runtime src from a rendered capture.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 1 of 1 probed API paths — the off-origin data work.

## Phases

- **capture** — 7
- **tags** — 6
- **listings** — 4
- **detect** — 3
- **off-origin data** — 1
- **embeds** — 1
