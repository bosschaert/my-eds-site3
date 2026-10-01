<!-- stardust provenance: skill=stardust:replica · phase=preserve-direction (dynamics Phases 1–3) · 2026-09-28 · curated from stardust/current/_dynamics.json + stardust/dynamic-features.generated-plan.md · target https://main--22880d22--aemcoder.aem.page -->
# Dynamic features — balbriggan.ie (home page only)

## Listings contract
none — the single migrated page has no listing block that reads an index (the "What's New" cards are three fixed, authored cards on the home page, replicated as captured).

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | f-form-gform-1-origin-5-fields | Newsletter sign-up form (Gravity Forms `gform_1`: first name, last name, email, consent checkbox, honeypot) | F form | 1/1 | rebuild-native | needs-backend | interim shipped | forms | **Owner:** production endpoint for newsletter sign-ups. Interim: the form is rebuilt as captured and posts to the source site's form handler (`https://balbriggan.ie/#gf_1`, method POST, same field names), so submissions keep landing in the existing Gravity Forms inbox until a new endpoint is configured. | `_dynamics.json` row f-form-gform-1…; captured fields input_1, input_2, input_3, input_4.1 |
| 2 | m-modal-trigger-aria-haspopup-chrome-only-a-content | Primary navigation dropdowns (4 `aria-haspopup` menu items: Plans & Projects, Discover, Leadership & Governance, Loves Lea…) | M modal / interactive | 4/1 (chrome) | rebuild-native | self | planned (header block; verified by motion-observe in the gate phase) | chrome-interaction | none | `_dynamics.json` row m-modal-trigger…; 4 `.dropdown-toggle` links |
| 3 | v-hero-video-vimeo-external-mp4 | Hero background video (`<video autoplay loop muted>` sourced from `player.vimeo.com/external/625598732.hd.mp4`) | V media | 1/1 | embed-passthrough | self | planned (same Vimeo-hosted file, same attributes) | media | none — Vimeo keeps hosting the file; the owner may later rehost it | `pages/index.json` media.videos[0] |
| 4 | t-tag-manager-google-tag-manager | Google Tag Manager container | T tag / consent | 1/1 | embed-passthrough | needs-business-decision | interim shipped (no tags on the preview host) | consent-gated-tags | **Owner:** which tags run on the new host and the GTM container id; the boilerplate's delayed script slot is where it goes | `_dynamics.json` row t-tag-manager…; host www.googletagmanager.com |
| 5 | t-analytics-google-analytics-ads | Google Analytics / Ads (`/g/collect` beacon) | T tag / consent | 1/1 | embed-passthrough | needs-business-decision | interim shipped (not loaded on the preview host) | consent-gated-tags | **Owner:** same batch as #4 (property id) | `_dynamics.json` row t-analytics…; region1.google-analytics.com |
| 6 | t-marketing-ad-retargeting-pixel | Facebook pixel (`connect.facebook.net`) | T tag / consent | 1/1 | embed-passthrough | needs-business-decision | interim shipped (not loaded on the preview host) | consent-gated-tags | **Owner:** same batch as #4 (pixel id, consent policy) | `_dynamics.json` row t-marketing… |
| 7 | a-cms-app-settings-object-datalayer | `dataLayer` global (GTM data layer) | A settings | 1/1 | embed-passthrough | needs-business-decision | folded into #4 — ships with the GTM snippet when the owner enables it | consent-gated-tags | same batch as #4 | `_dynamics.json` row a-cms-app-settings-object-datalayer |

## Decision batch
One message to the site owner, two items:
1. **Newsletter form endpoint** (#1). Where should sign-ups from the new site go? Until then the rebuilt form posts to the existing site's Gravity Forms handler, so nothing is lost.
2. **Tags on the new host** (#4–#7). Confirm the Google Tag Manager container id (and, if not managed through it, the GA property and Facebook pixel ids) and the consent policy. The preview ships with no tags loaded.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| a-cms-app-settings-object-wp (`wp` global settings object) | WordPress runtime object with no consumer on the migrated page (no block, script or embed reads it) | The new site is not WordPress; the `wp` object does not exist there and nothing on the home page depends on it. |

## B2 verification (2026-09-28, pre-import)
Fresh detection (`dynamics-detect.mjs` on https://balbriggan.ie/, 7 findings) and the target probe (`dynamics-plan.mjs --target-origin https://main--22880d22--aemcoder.aem.page --migrated stardust/migrated`): every finding maps to an existing row (#1, #2, #4–#7, and the decided-out `wp` object); 0 host-bound APIs; the dropdown row (#2) is already carried by the migrated output. Row #3 (hero video) rests on the capture (`pages/index.json`). No new rows. Evidence: `stardust/dynamics/verify/`.
