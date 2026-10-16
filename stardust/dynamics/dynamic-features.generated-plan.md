<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-09T18:44:21.775Z · input stardust/.work/dynamics-b2/_dynamics.json (5 pages, 42 findings) · target probe https://main--d9ddbc54--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 5/5 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 2 | a-cms-app-settings-object-utag-data | A | CMS / app settings object utag_data | 5/5 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | a-unknown-third-party-host-charts3-equitystory-com | A | unknown third-party host charts3.equitystory.com | 2/5 | static-snapshot | needs-human-capture | delivered-by-capture | inspect | inspect the XHR, add a vendor row | output already carries "charts3.equitystory.com" |
| 4 | a-first-party-api-get-cs-cz-api-dc | A | first-party API GET /cs-cz/api-dc/ | 1/5 (reach 1/99) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 5 | a-first-party-api-get-de-country-selector-api-dc | A | first-party API GET /de/country-selector/api-dc/ | 1/5 (reach 1/99) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 6 | a-first-party-api-get-de-investoren-aktie-api-dc | A | first-party API GET /de/investoren/aktie/api-dc/ | 1/5 (reach 1/99) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 7 | a-first-party-api-get-de-stories-api-dc | A | first-party API GET /de/stories/api-dc/ | 1/5 (reach 1/99) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 8 | a-unknown-third-party-host-api-admiralcloud-com | A | unknown third-party host api.admiralcloud.com | 1/5 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 9 | a-unknown-third-party-host-analytics-admiralcloud-com | A | unknown third-party host analytics.admiralcloud.com | 1/5 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 10 | a-unknown-third-party-host-mediafra-217-admiralcloud-com | A | unknown third-party host mediafra-217.admiralcloud.com | 1/5 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 11 | a-first-party-api-get-de-api-dc | A | first-party API GET /de/api-dc/ | 1/5 (reach 1/99) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 12 | cr-client-rendered-slot-video-js-vjs-default-skin-vjs-paused | CR | client-rendered slot video-js vjs-default-skin vjs-paused | 1/5 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 13 | cr-client-rendered-slot-vjs-control-bar | CR | client-rendered slot vjs-control-bar | 1/5 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 14 | cr-client-rendered-slot-vjs-progress-control-vjs-control | CR | client-rendered slot vjs-progress-control vjs-control | 1/5 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 15 | cr-client-rendered-slot-vjs-progress-holder-vjs-slider-vjs-s | CR | client-rendered slot vjs-progress-holder vjs-slider vjs-slider-horizontal | 1/5 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 16 | cr-client-rendered-slot-vjs-current-time-vjs-time-control-vj | CR | client-rendered slot vjs-current-time vjs-time-control vjs-control | 1/5 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 17 | cr-client-rendered-slot-vjs-current-time-display | CR | client-rendered slot vjs-current-time-display | 1/5 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 18 | cr-client-rendered-slot-vjs-error-display-vjs-modal-dialog-v | CR | client-rendered slot vjs-error-display vjs-modal-dialog vjs-hidden | 1/5 | static-snapshot | self | delivered-by-capture | settled-dom-snapshot | inspect the consumer | output already carries "This is a modal window." |
| 19 | cr-client-rendered-slot-vjs-caption-settings-vjs-modal-overl | CR | client-rendered slot vjs-caption-settings vjs-modal-overlay vjs-hidden | 1/5 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 20 | cr-client-rendered-slot-vjs-tracksettings | CR | client-rendered slot vjs-tracksettings | 1/5 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 21 | cr-client-rendered-slot-vjs-tracksettings-colors | CR | client-rendered slot vjs-tracksettings-colors | 1/5 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 22 | cr-client-rendered-slot-vjs-fg-color-vjs-tracksetting | CR | client-rendered slot vjs-fg-color vjs-tracksetting | 1/5 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 23 | cr-client-rendered-slot-vjs-text-opacity-vjs-opacity | CR | client-rendered slot vjs-text-opacity vjs-opacity | 1/5 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 24 | d-first-party-data-file-get-assets-hash-javascript-hyphenopo | D | first-party data file GET /_assets/{hash}/JavaScript/Hyphenopoly/ExcludedWords.json | 5/5 (reach 99/99) | data-fed | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 25 | f-form-tx-solr-search-form-pi-results-header-origin-de-meta- | F | form "tx-solr-search-form-pi-results-header" → origin /de/meta/suche/ (1 fields) | 4/5 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 26 | f-form-tx-solr-search-form-pi-results-header-origin-cs-cz-me | F | form "tx-solr-search-form-pi-results-header" → origin /cs-cz/meta/content-syndication-search/ (1 fields) | 1/5 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 27 | i18n-locale-variants-de-de-en-x-default | I18N | locale variants de-DE,en,x-default | 3/5 | rebuild-native | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://www.continental.com/en/investors" |
| 28 | i18n-locale-variants-en-us-cz-cz | I18N | locale variants en-us,cz,cz | 1/5 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 29 | i18n-locale-variants-en-us-en-hv-en-en | I18N | locale variants en-us,en,hv,en,en | 1/5 | rebuild-native | needs-business-decision | delivered-by-capture | locale-tree | scope of the locale trees | output already carries "https://www.continental.com/en/" |
| 30 | l-listing-candidate-c-country-selector-list-mb-6-6-cards | L | listing candidate c-country-selector__list mb-6 (6 cards) | 1/5 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 31 | l-listing-candidate-c-heroteaser-fixed-slides-3-cards | L | listing candidate c-heroteaser-fixed__slides (3 cards) | 1/5 | index-backed | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 32 | m-modal-trigger-c-cs-stage-overlay-target-outside-dom-at-cap | M | modal trigger c-cs-stage__overlay → target outside DOM at capture | 1/5 | rebuild-native | self | pending | modal-loader | none |  |
| 33 | t-unknown-third-party-host-d-delivery-consentmanager-net | T | unknown third-party host d.delivery.consentmanager.net | 5/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 34 | t-unknown-third-party-host-cdn-consentmanager-net | T | unknown third-party host cdn.consentmanager.net | 5/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 35 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 5/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 36 | t-third-party-mount-div-data-src-tag-manager-injected-widget | T | third-party mount <div data-src> (tag-manager-injected widget) | 4/5 | embed-passthrough | needs-credential | pending | embed-passthrough | vendor account ids stay the owner's |  |
| 37 | t-unknown-third-party-host-plugins-flockler-com | T | unknown third-party host plugins.flockler.com | 1/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 38 | t-third-party-mount-div-data-article-cluster-focus-image-tag | T | third-party mount <div data-article-cluster-focus-image> (tag-manager-injected widget) | 1/5 | embed-passthrough | needs-credential | pending | embed-passthrough | vendor account ids stay the owner's |  |
| 39 | t-unknown-third-party-host-player-admiralcloud-com | T | unknown third-party host player.admiralcloud.com | 1/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 40 | t-unknown-third-party-host-images-admiralcloud-com | T | unknown third-party host images.admiralcloud.com | 1/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 41 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 5/5 | embed-passthrough | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 42 | x-commerce-signals-cart-true-prices-0 | X | commerce signals (cart: true, prices: 0) | 5/5 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 15 row(s) — read-settings, settled-dom-snapshot, sheet-sync, modal-loader.
- **One owner decision batch:** 22 row(s) — which tier for the target host; consumer on the migrated pages? · inspect the XHR, add a vendor row · production endpoint; interim capture ships now · scope of the locale trees · index-driven or editorially curated? · CMP domain script reuse on the new host.
- **Already delivered by the capture pipeline:** 4 row(s) — no work.
- **Host-bound on the target:** 6 of 6 probed API paths — the off-origin data work.

## Phases

- **capture** — 12
- **detect** — 6
- **tags** — 6
- **off-origin data** — 5
- **locale wave** — 3
- **embeds** — 3
- **forms** — 2
- **listings** — 2
- **data** — 1
- **interactive** — 1
- **register** — 1
