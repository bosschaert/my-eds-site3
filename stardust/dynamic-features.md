# Dynamic features — continental.com

Source: `stardust/current/_dynamics.json` (10 archetype probes + reach from 99 crawled pages),
draft `stardust/dynamics/dynamic-features.generated-plan.json` (66 raw rows, curated here: video-js
slots merged into the player row, solr forms merged into search, the "cart" commerce signal is the
download cart, listing candidates that are sliders/tabs merged into the client-only row).
Hands-off: every non-`self` row ships its interim tier; each owner decision is a named assumption.

## Listings contract

- `press-releases` (de-presse-pressemitteilungen, de-presse-mediathek, de-karriere-veranstaltungen,
  hub "latest news" rails): source is a Solr-driven results list over a corpus that is NOT in this
  run's scope. Interim: the captured first results page ships as authored teaser cards
  (static-snapshot); pages emit `<meta name="template">`, `title`, `description`, `image` and
  `publication-date` (when captured) so an index-backed listing can replace it later.
- Stories (`en-stories`, `de-stories`): the article cluster is captured content — authored cards.

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | header-search | header quick search (Solr, `tx-solr-search-form-pi-results-header`) + suggest box | S | 99/99 | index-backed | self | pending | search-index-backed over the migrated corpus (`/query-index.json`) | corpus smaller than source = parity note | f-form-tx-solr-search-form-pi-results-header* |
| 2 | solr-listings | Solr results lists with facet tabs / date filter (press releases, media library, career events) | L / CR | 3/99 | static-snapshot | needs-business-decision | interim | captured first page as authored cards; facets static | owner: keep a live news feed? (assumed: snapshot until the press corpus migrates) | f-form-tx-solr-search-form-pi-results, cr-…c-search-facet-tab, f-…datesel |
| 3 | download-cart | download cart (checkbox `tx_condownload`, header folder button, zip export) | F (client) | 9/99 | client-only | needs-backend | interim | per-file download links kept; cart UI rebuilt client-side, zip export links to files | owner: server-side zip endpoint (assumed: per-file links) | f-form-checkbox-…tx_condownload* |
| 4 | lightbox | image/video lightbox (`data-lightbox`) | M | 83/99 | rebuild-native | self | pending | modal-loader in block JS | — | m-modal-trigger-data-lightbox |
| 5 | language-menu | language menu dropdown + country-selector button | M / I18N | 99/99 | rebuild-native | self | pending | header chrome JS | — | m-modal-trigger-aria-haspopup |
| 6 | locale-variants | hreflang alternates (de/en/x-default + country sites) | I18N | 99/99 | rebuild-native | self | pending | metadata `hreflang` per captured pair | out-of-scope twins keep source URLs | i18n-locale-variants-* |
| 7 | stage-overlay | stories stage overlay (`c-cs-stage__overlay`) | M | 2/99 | rebuild-native | self | pending | block JS | — | m-modal-trigger-c-cs-stage-overlay |
| 8 | client-widgets | hero slider, tabs, accordions, content slider, fact-box counters | L (false) / client | 70+/99 | client-only | self | pending | block JS, no network | — | l-listing-candidate-* (sliders/tabs) |
| 9 | video-player | AdmiralCloud player (`player.admiralcloud.com/acplayer.js`, video-js UI) | V / T | ~20/99 | embed-passthrough | needs-business-decision | interim | poster + play opens the AdmiralCloud player iframe by media id | owner: allow the player on the new host (assumed yes, CSP is EDS-side) | t-…player-admiralcloud, cr-…vjs-*, a-…admiralcloud |
| 10 | share-widget | share-price / IR charts (`charts3.equitystory.com` loader) | T | investors pages | embed-passthrough | needs-business-decision | interim | widget loader embed by container id | owner: EquityStory domain allowlist for the new host | a-unknown-third-party-host-charts3-equitystory |
| 11 | job-widget | job search/list widgets (SmartRecruiters / Altru) | T | career pages | embed-passthrough | needs-business-decision | interim | embed kept by widget config | owner: widget allowlist | c-job-widget-* (DOM), CSP hosts |
| 12 | contact-forms | contact forms (Portugal one-pager, sustainability `c-webforms`) | F | 3/99 | rebuild-native | needs-backend | interim | form UI rebuilt, submit shows "no backend connected" notice | owner: form handler endpoint (assumed: none yet) | f-form-portugalen-contactonepager, f-form-internationalen-contact-sustainab… |
| 13 | caralegal-form | data-protection request form (caralegal iframe) | F / V | 1/99 | embed-passthrough | self | pending | iframe embed (webform.caralegal.de) | — | c-caralegal (DOM) |
| 14 | ip-banner | IP-redirect banner data (`GET /<path>/api-dc/`) | A | 99/99 | data-fed | needs-business-decision | interim | banner not rendered (host-bound on the target) | owner: geo-redirect service for the new host | a-first-party-api-get-*-api-dc (host-bound 10/10) |
| 15 | consent-tags | consentmanager.net CMP + Google Tag Manager + analytics hosts | T | 99/99 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | martech off by default (not requested) | owner: tags + CMP on the new host | t-…consentmanager, t-tag-manager-google-tag-manager, a-cms-app-settings-object-* |
| 16 | site-assets | first-party data files under `/_assets/{hash}/` (icon sprites, JS data) | D | 99/99 | data-fed | self | pending | icons self-hosted in code bus | — | d-first-party-data-file-get-assets |
| 17 | external-links | sign-in / portal links | X | few | static-snapshot | self | done | links migrate as links (no account features on this site) | — | x-sign-in-account-links |
| 18 | social-wall | Flockler social wall embed (`plugins.flockler.com`) on career hubs | E / T | 5/99 | embed-passthrough | needs-business-decision | interim | embed block loads the same Flockler script after consent (found at B2 re-verify) | owner: keep the Flockler feed on the new host | t-unknown-third-party-host-plugins-flockler-com |

## Decision batch

One message to the owner (hands-off: recorded, interim tiers ship):
- **Backends:** form handler for contact forms (#12); server-side zip for the download cart (#3);
  geo-redirect data for the IP banner (#14).
- **Third-party allowlists on the new host:** AdmiralCloud player (#9), EquityStory IR widgets (#10),
  job widgets (#11), consentmanager + GTM (#15).
- **Business:** keep live Solr-backed news/media listings or snapshot until the press corpus is
  migrated (#2).

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none (no owner statement; hands-off never decides out) | — |
