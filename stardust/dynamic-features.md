# Dynamic features — The Beast Is Back Inc (https://www.thebeastisback.com/)

Curated from `stardust/dynamics/dynamic-features.generated-plan.md` (10 draft rows → 7 rows after merging the five platform-host rows into one and adding the two client behaviours the static detector cannot see). Hands-off run: owner decisions are recorded by name and the interim tier ships.

## Listings contract
none — the page has no listing block that reads an index; the project grid is authored content (96 links with images), not a query.

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-first-party-api-post-api-census-recordhit | Squarespace visitor census beacon POST /api/census/RecordHit | A | 1/1 | decided-out | n/a | decided-out | platform-telemetry | none — platform-internal analytics; Edge Delivery RUM replaces it | POST → 200 on source, 404 on target |
| 2 | a-first-party-api-post-api-census-form-render | Squarespace form-render telemetry POST /api/census/form-render | A | 1/1 | decided-out | n/a | decided-out | platform-telemetry | none — fires only for the Squarespace newsletter block runtime | POST → 200 on source, 404 on target |
| 3 | cr-client-rendered-slot-project-gallery-project | Project grid: server-rendered items, positioned client-side by the Squarespace autocolumns masonry | CR | 1/1 | static-snapshot + client-compute (layout) | self | planned (replica Phase 3: `project-grid` block with the shortest-column layout) | settled-dom-snapshot | none | 96 `.project` items absolutely positioned; model in `stardust/replica/lift/tokens.json#grid` |
| 4 | cr-client-rendered-slot-yui3-js-enabled-js-flexbox | Root class flags (yui3-js-enabled, js, flexbox) | CR | 1/1 | decided-out (noise) | n/a | decided-out | — | none — framework feature-detect classes, no content | documentElement.classList.add |
| 5 | f-form-newsletter-form-no-action-js-wired-1-fields | Newsletter signup form (email → Squarespace newsletter block, no action attribute) | F | 1/1 | static-snapshot (UI recreated verbatim; submit non-functional) | needs-business-decision | skipped-source-broken | client-compute | **Owner:** choose a newsletter provider/endpoint for the new host (the source block is itself unconfigured: its hidden status box reads "This newsletter signup form needs a storage option") | `.newsletter-form-banner--hidden` storage warning in the captured DOM |
| 6 | t-platform-hosts-squarespace | Squarespace platform hosts (static1.squarespace.com, assets.squarespace.com, definitions.sqspcdn.com, file.squarespace-cdn.com, images.squarespace-cdn.com) | T | 1/1 | decided-out (platform runtime); images rehosted | n/a | decided-out | asset-rehost | none — no third-party tags or consent tooling detected; the hosts serve Squarespace's own JS/CSS/fonts and the images, which the migration rehosts | 98 images harvested to `stardust/current/assets/media/` |
| 7 | i-mobile-nav-toggle | Mobile "Menu" link toggles the mobile nav (≤750px) | I | 1/1 | client-only | self | planned (replica Phase 3, verified by interaction parity) | client-compute | none | `#mobileMenuLink a` + `#mobileNav` height 0 → auto |

## Decision batch
One message to the owner, non-blocking (the static page ships regardless):
- **Newsletter storage (row 5).** The source form has no storage configured. Tell us the provider (Mailchimp, Campaign Monitor, a Google Sheet via a form service, …) and we wire the "Sign Up" button to it; until then the form renders as on the source and the button does not submit.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| Squarespace census beacons (/api/census/*) | platform-internal telemetry of the Squarespace runtime | Does not exist on the new host; Edge Delivery's RUM provides traffic analytics. |
| Root feature-detect classes | framework noise, no user-visible content | Not carried. |
| Squarespace platform hosts | they serve the Squarespace runtime, not site content | Not carried; images are rehosted on the new origin, fonts self-hosted from their open source. |

## Verification — rollout B2-dynamic (2026-10-01T14:41:56Z)

Fresh detector run on the live page (`dynamics-detect.mjs --urls https://www.thebeastisback.com/ --reach stardust/current`): 10 raw findings, identical to the Phase 2 set (2 census beacons, 2 client-rendered slots, 1 newsletter form, 5 Squarespace platform hosts). The curated rows above stand: no new feature, no changed reach. Target-origin probe (`dynamics-plan.mjs --target-origin https://main--c151e704--aemcoder.aem.live --migrated stardust/migrated`): both `/api/census/*` paths are host-bound (dead on the target) — consistent with their `decided-out` disposition. Row 5 (newsletter provider) remains the one owner decision, non-blocking: the form UI ships verbatim with a non-functional submit until a provider is named. Row 7 (mobile menu toggle) is implemented in the header block and re-verified by the published-origin motion check at C-deliver.
