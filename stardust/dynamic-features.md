<!-- stardust provenance: skill=stardust:replica · phase=preserve-direction (dynamics Phases 1–3) · curated from stardust/dynamics/dynamic-features.generated-plan.md (3 archetypes probed, reach 10/10 crawled pages) · target probe https://main--bf989f9e--aemcoder.aem.page -->
# Dynamic features — myastrazeneca.ch (FR, 10 planned pages)

## Listings contract
none — no listing, rail or search-results block is in the 10-page scope. The header search box (row 3) targets `/fr/startseite/search-result.html`, a page outside the plan; no index is read by any migrated page, so no `helix-query.yaml` is authored in this run.

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-utag-data | Tealium data layer `utag_data` (campaign_*, page keys) | A | 10/10 | static-snapshot | self | planned | read-settings | none — keys only name the Tealium property; ships as part of the disabled integrations config | `_dynamics.json` findings[0] |
| 2 | a-first-party-api-post-content-intelligentcontent-portals-hc | first-party API `POST …/jcr:content.socialFeaturesPost.json` feeding the `cmp-socialFeatures` favorite counter | A | 1/10 (herzinsuffizienz) | static-snapshot | needs-business-decision | interim-shipped | off-origin-data | **dead on target (404)**; owner: which tier for the counter on the new host (same-origin proxy / snapshot / drop). Interim: counter replicated as captured, no POST | findings[1]; pages/…-herzinsuffizienz.html `cmp-socialFeatures__favorite-count` |
| 3 | f-form-text-search-text-box-no-action-js-wired-1-fields | header search box (`#search-text-box`, JS-wired to `data-search-page=/fr/startseite/search-result.html`, index `hcp-switzerland-fr-prod-live`) | F | 10/10 | static-snapshot | needs-business-decision | interim-shipped | client-compute | results page is outside the 10-page scope → form is **non-functional** on the new host (UI rebuilt in the header, submit disabled, no fabricated results). Owner: add `search-result.html` + an index to the scope, or keep the link to the live results page | findings[2]; pages/fr-startseite.html `<form>` |
| 4 | i18n-locale-variants (merged rows 4+5) | language switcher links to the DE / IT trees (`/de/…`, `/it/…`); the en-us / en-gb / en-US evidence is browser cookie-help links in the cookie-policy copy, not locale variants (noise, dropped) | I18N | 10/10 | decided-out | needs-business-decision | decided | locale-tree | DE/IT trees are outside the plan's 10 FR pages; links kept verbatim as captured. Owner: scope of the locale trees | findings[3], findings[4] |
| 5 | t-unknown-third-party-host-rum-hlx-page | `rum.hlx.page` helix-rum-js (Adobe operational telemetry the source already loads) | T | 10/10 | embed-passthrough | self | planned | consent-gated-tags | none — Edge Delivery's `aem.js` emits RUM natively; nothing extra to load | findings[5] |
| 6 | t-unknown-third-party-host-policy-cookiereports-com | Cookie Reports consent banner (`policy.cookiereports.com`, dismissed with `a.wscrOk` during capture) | T | 10/10 | embed-passthrough | needs-business-decision | interim-shipped | consent-gated-tags | owner: which CMP / property id runs on the new host. Interim: disabled entry in `scripts/site-config.js`; pages ship in the banner-dismissed state they were captured in | findings[6] |
| 7 | t-tag-manager-tealium | Tealium iQ (`tags.tiqcdn.com`; Adobe Target / Mouseflow / LinkedIn Insight load through it) | T | 10/10 | embed-passthrough | needs-business-decision | interim-shipped | consent-gated-tags | owner: which tags run on the new host, property id, consent wiring. Interim: disabled entry in `scripts/site-config.js` | findings[7] |
| 8 | v-player-element-div | Kaltura player (partner 432521, uiconf 30358591, entry `1_7kar7zpp`), click-to-play thumbnail | V | 1/10 (about-amylodosis-attr) | embed-passthrough | self | planned | media-as-url | none — player ids are public; `video` block renders the captured poster, loads the Kaltura iframe on click | findings[8]; pages/…-about-amylodosis-attr.html `.cmp-video` |
| 9 | x-sign-in-account-links | sign-in / account links (`/fr/user/login.html`, external `tagrisso.ch`) | X | 10/10 | decided-out | needs-backend | decided | decided-out | no auth on the new host; links kept verbatim as captured (absolute to the live login) | findings[9] |
| 10 | m-hcp-self-certification-modal | HCP self-certification modal (`.cmp-selfcertification`, page root `inert`) on the 5 PATTRNS pages; dismissed with `button.self-certify-yes` during capture | M | 5/10 | rebuild-native | self | done | modal-loader | none — rebuilt as a block-level modal on the PATTRNS template, cookie-persisted like the source; observed in Phase 3 motion-observe before implementation | journal § Extract; `--dismiss` selectors in `_crawl-log.json` |

Every row has a disposition. Rows with reproducibility `self` (1, 5, 8, 10) ship in Phase 3/5; every other row is in the decision batch below and ships its interim tier (hands-off resolution: interim tier shipped, decision recorded by name, run continues).

## Decision batch
One message to the site owner, grouped by what each needs:

- **Tags and consent on the new host** (rows 1, 6, 7): which of Tealium iQ, Cookie Reports, Adobe Target, Mouseflow and LinkedIn Insight should run on the Edge Delivery origin, with their property ids and consent wiring. Interim: all listed, all disabled, in `scripts/site-config.js`.
- **Search** (row 3): the header search box targets `/fr/startseite/search-result.html`, which is not one of the 10 planned pages. Decide: extend the scope with the results page (then a query index is authored), keep the box linking to the live results page, or leave it non-functional (interim).
- **Social-features counter** (row 2): `socialFeaturesPost.json` does not exist on the new host. Decide: proxy same-origin, snapshot, or drop the counter. Interim: the captured count ships static.
- **Locale trees** (row 4): DE / IT switcher links point at trees outside this run. Decide whether they migrate; until then the links stay as captured.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| sign-in / account links (`/fr/user/login.html`) | session-bound AEM login; no auth backend on the new host | Login remains on the current origin; migrated pages link to it verbatim. |
| DE / IT locale trees | outside the fixed 10-page FR scope | The language switcher links keep their captured hrefs; the DE and IT pages are not migrated in this run. |
