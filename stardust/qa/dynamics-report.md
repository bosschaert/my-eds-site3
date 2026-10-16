# Dynamics parity check — https://main--d9ddbc54--aemcoder.aem.live — 2026-10-10T12:47:19.233Z

Replayed 25 checks over 18 features · pass 22 · fail 3. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| header quick search + results over the migrated corpus | S | interim | fetch-json | PASS | 200 · 99 rows · keys columns,data,offset,limit,total,:type |  |
| header quick search + results over the migrated corpus | S | interim | search-query | PASS | 1 results (source 1) · first: impressum · matches the source | cdn.continental.com:200×3 |
| header quick search + results over the migrated corpus | S | interim | search-query | PASS | 1 results (source 1) · first: produktanfragen · matches the source | cdn.continental.com:200×3 |
| header quick search + results over the migrated corpus | S | interim | search-query | FAIL | 3 results (source 6) · first: legal notice · count 3 vs source 6 · top-3 titles differ — source: legal notice / contact form data protection / trust · here: legal notice / contact form data protection / data protection | cdn.continental.com:200×3 |
| Solr results lists (press releases, media library, career events) | L | interim | dom-count | PASS | 9 × .search .search-result (min 9) | cdn.continental.com:200×3 |
| Solr results lists (press releases, media library, career events) | L | interim | dom-count | PASS | 2 × .search, .video-player (min 1) | cdn.continental.com:200×3 |
| image / share lightbox (data-lightbox) | M | done | click-dialog | PASS | dialog 1440px · heading "" · 0 fields · Escape closes: true | cdn.continental.com:200×4 |
| image / share lightbox (data-lightbox) | M | done | click-dialog | PASS | dialog 1440px · heading "Share:" · 0 fields · Escape closes: true | cdn.continental.com:200×3 |
| language menu dropdown + country selector | M | done | dom-count | PASS | 1 × .lang-menu-dropdown a[href^="/de"] (min 1) | cdn.continental.com:200×3 charts3.equitystory.com:200×11 |
| language menu dropdown + country selector | M | done | dom-count | PASS | 1 × .lang-menu-dropdown a[href^="/en"] (min 1) | cdn.continental.com:200×3 charts3.equitystory.com:200×11 |
| hreflang alternates (de/en/x-default + country sites) | I18N | interim | dom-count | FAIL | 0 × link[rel=alternate][hreflang] (min 2) | cdn.continental.com:200×3 charts3.equitystory.com:200×11 |
| stories stage overlay | M | done | dom-count | PASS | 1 × .cs-stage .cs-stage-overlay[href] (min 1) | cdn.continental.com:200×3 |
| hero slider, tabs, accordions, content slider, fact-box counters | L | done | dom-count | PASS | 4 × .tabs [role=tab] (min 2) | cdn.continental.com:200×3 |
| hero slider, tabs, accordions, content slider, fact-box counters | L | done | dom-count | PASS | 14 × .accordion details, .accordion [aria-expanded] (min 2) | cdn.continental.com:200×3 |
| hero slider, tabs, accordions, content slider, fact-box counters | L | done | no-page-errors | PASS | none on 9 page(s) |  |
| AdmiralCloud player | V | interim | video-plays | FAIL | iframe/video: false · no <video> · playback requests 2 (ok) · no player: neither a vendor iframe nor a <video> found · 1 ≥400 — check whether the probe leaked auth to the vendor | cdn.continental.com:200×3 player.admiralcloud.com:200×1 api.admiralcloud.com:403×1 |
| EquityStory share-price / IR widgets | T | interim | dom-count | PASS | 1 × iframe[src*=equitystory], script[src*=equitystory], [id*=equitystory i], [class*=equitystory i] (min 1) | cdn.continental.com:200×3 charts3.equitystory.com:200×11 |
| job search / job list widgets | T | interim | dom-count | PASS | 2 × form.job-search-box input.job-search-input (min 1) | cdn.continental.com:200×3 plugins.flockler.com:200×3 api.flockler.app:200×1 stats-api.flockler.app:200×1 media-api.flockler.com:303×14 fl-1.cdn.flockler.com:200×1 |
| job search / job list widgets | T | interim | dom-count | PASS | 1 × .job-list-item (min 1) | cdn.continental.com:200×3 |
| contact forms (Portugal one-pager, sustainability) | F | interim | dom-count | PASS | 6 × form.webform-form [required] (min 6) | cdn.continental.com:200×3 |
| contact forms (Portugal one-pager, sustainability) | F | interim | dom-count | PASS | 5 × form.webform-form [required] (min 1) | cdn.continental.com:200×3 |
| data-protection request form (caralegal iframe) | F | done | dom-count | PASS | 1 × .embed.caralegal iframe[src*="caralegal"] (min 1) | cdn.continental.com:200×3 webform.caralegal.de:200×13 publiclink.caralegal.de:200×1 www.captcha.eu:200×1 |
| consentmanager CMP + GTM + analytics | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 4 gated host pattern(s) before consent | cdn.continental.com:200×3 charts3.equitystory.com:200×11 |
| first-party icons / data files | D | done | dom-count | PASS | 86 × .u-icon svg, svg use (min 20) | cdn.continental.com:200×3 charts3.equitystory.com:200×11 |
| Flockler social wall | E | interim | dom-count | PASS | 1 × .embed.flockler iframe[src*="flockler"] (min 1) | cdn.continental.com:200×3 plugins.flockler.com:200×3 api.flockler.app:200×1 stats-api.flockler.app:200×1 media-api.flockler.com:303×14 fl-1.cdn.flockler.com:200×1 |

## Features without checks

- download cart (tx_condownload checkboxes, header folder, zip export) (F) — interim · owner: server-side zip endpoint (assumed: per-file links); the client cart panel is not built — header cart button is inert (count 0)
- IP-redirect banner data (/<path>/api-dc/) (A) — interim · owner: geo-redirect service for the new host (host-bound: dead on target)
- sign-in / portal links (X) — done
