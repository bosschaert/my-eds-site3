<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-13T11:13:15.394Z · input stardust/current/_dynamics.json (1 pages, 21 findings) · target probe https://main--032a8915--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-typesquare-com | A | unknown third-party host typesquare.com | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-l-typesquare-com | A | unknown third-party host l.typesquare.com | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-analytics-studiodesignapp-com | A | unknown third-party host analytics.studiodesignapp.com | 1/1 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 1/1 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 5 | m-modal-trigger-data-modal-chrome-only-dialog-content | M | modal trigger data-modal (chrome only) → dialog:content | 1/1 (reach 1/1) | rebuild-native | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 6 | m-modal-trigger-modal-menu-sd-2-target-outside-dom-at-captur | M | modal trigger modal-menu__sd-2 → target outside DOM at capture | 1/1 (reach 1/1) | rebuild-native | self | pending | modal-loader | none |  |
| 7 | m-modal-trigger-modal-menu-sd-8-target-outside-dom-at-captur | M | modal trigger modal-menu__sd-8 → target outside DOM at capture | 1/1 (reach 1/1) | rebuild-native | self | delivered-by-capture | modal-loader | none | output already carries "https://current-design.jp/" |
| 8 | m-modal-trigger-modal-menu-sd-13-target-outside-dom-at-captu | M | modal trigger modal-menu__sd-13 → target outside DOM at capture | 1/1 (reach 1/1) | rebuild-native | self | pending | modal-loader | none |  |
| 9 | m-modal-trigger-modal-menu-sd-18-target-outside-dom-at-captu | M | modal trigger modal-menu__sd-18 → target outside DOM at capture | 1/1 (reach 1/1) | rebuild-native | self | pending | modal-loader | none |  |
| 10 | m-modal-trigger-modal-menu-sd-23-target-outside-dom-at-captu | M | modal trigger modal-menu__sd-23 → target outside DOM at capture | 1/1 (reach 1/1) | rebuild-native | self | pending | modal-loader | none |  |
| 11 | m-modal-trigger-modal-menu-sd-28-target-outside-dom-at-captu | M | modal trigger modal-menu__sd-28 → target outside DOM at capture | 1/1 (reach 1/1) | rebuild-native | self | pending | modal-loader | none |  |
| 12 | m-modal-trigger-modal-menu-sd-33-target-outside-dom-at-captu | M | modal trigger modal-menu__sd-33 → target outside DOM at capture | 1/1 (reach 1/1) | rebuild-native | self | pending | modal-loader | none |  |
| 13 | m-modal-trigger-modal-menu-sd-38-target-outside-dom-at-captu | M | modal trigger modal-menu__sd-38 → target outside DOM at capture | 1/1 (reach 1/1) | rebuild-native | self | pending | modal-loader | none |  |
| 14 | m-modal-trigger-modal-menu-sd-43-target-outside-dom-at-captu | M | modal trigger modal-menu__sd-43 → target outside DOM at capture | 1/1 (reach 1/1) | rebuild-native | self | pending | modal-loader | none |  |
| 15 | m-modal-trigger-modal-menu-sd-49-target-outside-dom-at-captu | M | modal trigger modal-menu__sd-49 → target outside DOM at capture | 1/1 (reach 1/1) | rebuild-native | self | delivered-by-capture | modal-loader | none | output already carries "https://www.instagram.com/design_current" |
| 16 | m-modal-trigger-modal-menu-sd-50-target-outside-dom-at-captu | M | modal trigger modal-menu__sd-50 → target outside DOM at capture | 1/1 (reach 1/1) | rebuild-native | self | delivered-by-capture | modal-loader | none | output already carries "https://jp.pinterest.com/currentbranding" |
| 17 | t-unknown-third-party-host-storage-googleapis-com | T | unknown third-party host storage.googleapis.com | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 18 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 19 | t-unknown-third-party-host-wf-typesquare-com | T | unknown third-party host wf.typesquare.com | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 20 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 21 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 1/1 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 10 row(s) — read-settings, chrome-interaction, modal-loader.
- **One owner decision batch:** 8 row(s) — inspect the XHR, add a vendor row · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 3 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.

## Phases

- **interactive** — 12
- **tags** — 5
- **detect** — 4
