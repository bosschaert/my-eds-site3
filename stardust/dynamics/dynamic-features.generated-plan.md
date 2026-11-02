<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-29T20:15:31.966Z · input stardust/current/_dynamics.json (1 pages, 35 findings) · target probe main--53deb2f5--aemcoder.aem.live -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-hydro-flask-pxf-io | A | unknown third-party host hydro-flask.pxf.io | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-api-crobox-com | A | unknown third-party host api.crobox.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-unknown-third-party-host-p2iqhncxyh-execute-api-eu-central | A | unknown third-party host p2iqhncxyh.execute-api.eu-central-1.amazonaws.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | a-unknown-third-party-host-cdn-userway-org | A | unknown third-party host cdn.userway.org | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 6 | a-unknown-third-party-host-fast-a-klaviyo-com | A | unknown third-party host fast.a.klaviyo.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 7 | a-unknown-third-party-host-api-userway-org | A | unknown third-party host api.userway.org | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 8 | a-unknown-third-party-host-static-forms-klaviyo-com | A | unknown third-party host static-forms.klaviyo.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 9 | a-unknown-third-party-host-hydroflask-api-kustomerapp-com | A | unknown third-party host hydroflask.api.kustomerapp.com | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 10 | a-unknown-third-party-host-cdn77-api-userway-org | A | unknown third-party host cdn77.api.userway.org | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 11 | a-first-party-api-post-cdn-cgi-zaraz-t | A | first-party API POST /cdn-cgi/zaraz/t | 1/1 (reach 1/1) | data-fed | block | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? | **dead on target (Failed to parse URL from main--53deb2f5--aemcoder.aem.live/cdn-cgi/zaraz/t)** |
| 12 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 1/1 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 13 | a-cms-app-settings-object-adobedatalayer | A | CMS / app settings object adobeDataLayer | 1/1 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 14 | f-form-needsclick-no-action-js-wired-1-fields | F | form "needsclick" → no action (JS-wired) (1 fields) | 1/1 | rebuild-native | block | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 15 | f-form-needsclick-no-action-js-wired-5-fields | F | form "needsclick" → no action (JS-wired) (5 fields) | 1/1 | rebuild-native | block | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 16 | i18n-locale-variants-en-gb-en-fi-en-ie-en-nl-en-cz-en-pl-fr- | I18N | locale variants en-gb,en-fi,en-ie,en-nl,en-cz,en-pl,fr-fr,fr-lu,fr-be,de-de,de-at,es-es,en-us,x-default | 1/1 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 17 | m-modal-trigger-aria-haspopup-chrome-only-button-content-nav | M | modal trigger aria-haspopup (chrome only) → button:content/nav:content/section:content/link:content | 1/1 (reach 5/1) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 18 | s-site-search-form-js-submitted | S | site search form → (JS-submitted) | 1/1 (reach 0/1) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 19 | t-consent-trustarc-iab-cmp | T | consent: TrustArc / IAB CMP | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 20 | t-unknown-third-party-host-static-cloudflareinsights-com | T | unknown third-party host static.cloudflareinsights.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 21 | t-unknown-third-party-host-d5yoctgpv4cpx-cloudfront-net | T | unknown third-party host d5yoctgpv4cpx.cloudfront.net | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 22 | t-social-proof-reviews-widget | T | social proof: reviews widget | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 23 | t-unknown-third-party-host-utt-impactcdn-com | T | unknown third-party host utt.impactcdn.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 24 | t-tag-manager-adobe-launch | T | tag manager: Adobe Launch | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 25 | t-analytics-adobe-analytics-experience-cloud-id | T | analytics: Adobe Analytics / Experience Cloud ID | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 26 | t-unknown-third-party-host-cdn-crobox-io | T | unknown third-party host cdn.crobox.io | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 27 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 28 | t-unknown-third-party-host-www-ojrq-net | T | unknown third-party host www.ojrq.net | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 29 | t-unknown-third-party-host-static-klaviyo-com | T | unknown third-party host static.klaviyo.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 30 | t-unknown-third-party-host-cdn-kustomerapp-com | T | unknown third-party host cdn.kustomerapp.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 31 | t-unknown-third-party-host-static-tracking-klaviyo-com | T | unknown third-party host static-tracking.klaviyo.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 32 | t-unknown-third-party-host-cdn-assets-rapidspike-com | T | unknown third-party host cdn-assets.rapidspike.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 33 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 1/1 | embed-passthrough | embed | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 34 | x-sign-in-account-links | X | sign-in / account links | 1/1 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |
| 35 | x-commerce-signals-cart-true-prices-13 | X | commerce signals (cart: true, prices: 13) | 1/1 | decided-out | — | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 4 row(s) — read-settings, chrome-interaction, search-index-backed.
- **One owner decision batch:** 29 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · production endpoint; interim capture ships now · scope of the locale trees · CMP domain script reuse on the new host · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 1 of 1 probed API paths — the off-origin data work.

## Phases

- **tags** — 14
- **detect** — 12
- **forms** — 2
- **register** — 2
- **off-origin data** — 1
- **locale wave** — 1
- **interactive** — 1
- **search** — 1
- **embeds** — 1
