<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-05T16:07:03.319Z · input stardust/current/_dynamics.json (1 pages, 28 findings) · target probe https://main--061e4e3f--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-first-party-api-get-api-chatapi-json-faq-json | A | first-party API GET /_api/chatApi/json/faq.json | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 2 | a-first-party-api-get-api-chatapi-json-setting-json | A | first-party API GET /_api/chatApi/json/setting.json | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 3 | a-first-party-api-get-assets-models-blender-rabbit-k-rabbit- | A | first-party API GET /assets/models/blender/rabbit/k/rabbit.gltf | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 4 | a-first-party-api-get-assets-models-blender-lizard-d-lizard- | A | first-party API GET /assets/models/blender/lizard/d/lizard.gltf | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 5 | a-first-party-api-get-assets-models-blender-raccoon-g-raccoo | A | first-party API GET /assets/models/blender/raccoon/g/raccoon.gltf | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 6 | a-first-party-api-get-assets-models-blender-fox-e-fox-gltf | A | first-party API GET /assets/models/blender/fox/e/fox.gltf | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 7 | a-first-party-api-get-assets-models-blender-cat-h-cat-gltf | A | first-party API GET /assets/models/blender/cat/h/cat.gltf | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 8 | a-first-party-api-get-assets-models-blender-koala-d-koala-gl | A | first-party API GET /assets/models/blender/koala/d/koala.gltf | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 9 | a-first-party-api-get-assets-models-blender-goat-f-goat-gltf | A | first-party API GET /assets/models/blender/goat/f/goat.gltf | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 10 | a-first-party-api-get-assets-models-blender-device-desktop-g | A | first-party API GET /assets/models/blender/device/desktop.gltf | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 11 | a-first-party-api-get-assets-models-blender-device-ipad-gltf | A | first-party API GET /assets/models/blender/device/ipad.gltf | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 12 | a-first-party-api-get-assets-models-blender-hachi-e-hachi-gl | A | first-party API GET /assets/models/blender/hachi/e/hachi.gltf | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 13 | a-first-party-api-get-assets-models-blender-device-iphone-gl | A | first-party API GET /assets/models/blender/device/iphone.gltf | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 14 | a-first-party-api-get-assets-models-blender-office-office-fl | A | first-party API GET /assets/models/blender/office/office-floor3.gltf | 1/1 (reach 1/1) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (404)** |
| 15 | a-cms-app-settings-object-nuxt | A | CMS / app settings object __NUXT__ | 1/1 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 16 | cr-client-rendered-slot-js-h-s-wrapper-is-chat-loaded | CR | client-rendered slot js-h s-wrapper is-chat-loaded | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 17 | cr-client-rendered-slot-sw-js-sp-s-scroller | CR | client-rendered slot Sw js-sp s-scroller | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 18 | cr-client-rendered-slot-ph-st-js-iv | CR | client-rendered slot Ph St js-iv | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 19 | cr-client-rendered-slot-description-lead-f-logo | CR | client-rendered slot description lead f-logo | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 20 | cr-client-rendered-slot-site-title-js-iv-js-h-mb | CR | client-rendered slot site-title js-iv js-h-mb | 1/1 | static-snapshot | self | delivered-by-capture | settled-dom-snapshot | inspect the consumer | output already carries "What can we make next" |
| 21 | cr-client-rendered-slot-page-title-words-serif | CR | client-rendered slot page-title words serif | 1/1 | static-snapshot | self | delivered-by-capture | settled-dom-snapshot | inspect the consumer | output already carries "What can we make next" |
| 22 | cr-client-rendered-slot-pb-st-js-iv | CR | client-rendered slot Pb St js-iv | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 23 | cr-client-rendered-slot-intro-clip-y-auto | CR | client-rendered slot intro clip-y auto | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 24 | cr-client-rendered-slot-st-wrap-js-h-mb | CR | client-rendered slot St-wrap js-h-mb | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 25 | cr-client-rendered-slot-mq-pickup-h1-cases-h1 | CR | client-rendered slot mq pickup-h1 cases-h1 | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 26 | cr-client-framework-nuxt | CR | client framework nuxt | 1/1 | static-snapshot | self | pending | settled-dom-snapshot | inspect the consumer |  |
| 27 | i18n-locale-variants-en-ja-x-default | I18N | locale variants en,ja,x-default | 1/1 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 28 | t-unknown-third-party-host-d1oo4riy5et4sg-cloudfront-net | T | unknown third-party host d1oo4riy5et4sg.cloudfront.net | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 10 row(s) — read-settings, settled-dom-snapshot.
- **One owner decision batch:** 16 row(s) — which tier for the target host; consumer on the migrated pages? · scope of the locale trees · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 2 row(s) — no work.
- **Host-bound on the target:** 14 of 14 probed API paths — the off-origin data work.

## Phases

- **off-origin data** — 14
- **capture** — 11
- **detect** — 1
- **locale wave** — 1
- **tags** — 1
