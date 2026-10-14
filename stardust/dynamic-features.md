# Dynamic features — balbriggan.ie (home page only)

Source: `stardust/current/_dynamics.json` (detector, 7 findings) + manual reading of the captured DOM and the
theme script (`wp-content/themes/balbriggan2024/js/scripts.js`). Curated 2026-10-13, hands-off.

## Listings contract
none — the home page's "What's New" rail is a hand-ordered set of 4 stories captured as content (no listing
block reads an index in this one-page scope).

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-wp | WP settings object | A | 1/1 | decided-out | self | done | read-settings | none — WordPress runtime globals have no consumer on the rebuilt page | `wp` global |
| 2 | a-cms-app-settings-object-datalayer | dataLayer object | A | 1/1 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | merged into row 5 (GTM owns dataLayer) | `dataLayer` global |
| 3 | f-form-gform-1-origin-5-fields | Newsletter sign-up (First/Last/Email + GDPR consent) | F | 1/1 | rebuild-native | needs-backend | interim | forms | production endpoint (owner). Interim: native form posts the same Gravity Forms fields to the source origin's form handler (top-level POST to https://balbriggan.ie/#gf_1 — the source's own non-AJAX submission path) | gform_1, 5 fields + hidden state |
| 4 | m-modal-trigger-aria-haspopup-chrome-only-a-content | Main-menu dropdowns (4) + mobile hamburger collapse | M | 1/1 | rebuild-native | self | pending | chrome-interaction | none (header contract is the spec) | `.dropdown-toggle`, `.navbar-toggler` |
| 5 | t-tag-manager-google-tag-manager | Google Tag Manager | T | 1/1 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | which tags run on the new host; container id (owner) | www.googletagmanager.com |
| 6 | t-analytics-google-analytics-ads | Google Analytics | T | 1/1 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | merged with row 5 | www.google-analytics.com |
| 7 | t-marketing-ad-retargeting-pixel | Facebook pixel | T | 1/1 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | merged with row 5 | connect.facebook.net |
| 8 | m-hero-video | Hero background video (autoplay, muted, loop) | M | 1/1 | embed-passthrough | self | pending | media | none — same Vimeo-hosted mp4 | `video#videobanner` src player.vimeo.com/external/625598732 |
| 9 | m-news-carousel | "What's New" carousel (slick: 3-up, 4 slides, dots + arrows, no autoplay) | M | 1/1 | rebuild-native | self | pending | carousel | none | `.news-cards` slick config in theme scripts.js |
| 10 | m-map-pins | Project map: 12 linked pins, hover scale + sliding label | M | 1/1 | rebuild-native | self | pending | client-only | none (CSS hover; pin links to /town-transformation/#projectN) | inline SVG `.map-pin` |
| 11 | m-sticky-header | Sticky header compacts after 100px scroll (`.scrolled`) | M | 1/1 | rebuild-native | self | pending | chrome-interaction | none | theme scripts.js `$(window).scroll` |

## Decision batch
One message to the site owner (recorded, hands-off — each item ships its interim path):
1. **Newsletter form endpoint** — interim posts to the existing Gravity Forms handler on balbriggan.ie; confirm
   whether that stays, or name the new list provider / endpoint.
2. **Tags** — GTM / Google Analytics / Facebook pixel: which tags run on the new host, with which container and
   property ids, and under which consent banner. Interim: none are loaded on the new host.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| WP settings object (`wp`) | WordPress runtime global, no consumer on the rebuilt page | not needed on Edge Delivery |

## Pre-import verification (rollout B2, 2026-10-13)
Fresh `dynamics-detect.mjs` run (scrollTo shim) + `dynamics-plan.mjs --target-origin https://main--e8103195--aemcoder.aem.page --migrated stardust/migrated`: 7 findings, all 7 ids present above; no host-bound first-party API; dispositions unchanged.
