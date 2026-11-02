<!-- stardust provenance: skill=stardust:replica · phase=preserve-direction (dynamics triage) · 2026-10-29 · input stardust/dynamics/dynamic-features.generated-plan.md (35 rows) -->
# Dynamic features — hydroflask.com home page (curated)

Scope: one page (`/`). Every generated row has a disposition below; the static recreation continues regardless.
Hands-off: owner decisions ship the interim tier and are named in § Decision batch — never `decided-out` without an owner statement.

## Listings contract
- **Product carousels** ("Lightweight Collection", "Level up lunch"): Magento-rendered product tiles (name, price, image, link). Disposition `static-snapshot` → authored rows in the page document (document-first; text never fetched). Prices are a capture-date snapshot; refresh is an owner decision (D3).

## Features
| id | class | feature | disposition | target | reproducibility | status |
|---|---|---|---|---|---|---|
| chrome-megamenu | M | header mega-menu / account / cart popups (`aria-haspopup`) | rebuild-native | runtime (header block) | self | pending |
| hero-carousel | M/V | auto-rotating hero banner slider (pause/play) | rebuild-native | block | self | pending |
| product-carousels | L | product tile sliders (2) | static-snapshot | block (authored rows) | self | pending |
| site-search | S | header search (JS-submitted) | link-out interim: submits to source `https://www.hydroflask.com/catalogsearch/result/?q=` | widget | needs-business-decision | pending (D2) |
| newsletter-forms | F | footer "Stay in touch" Klaviyo form (needsclick, 1 + 5 fields) | rebuild-native UI, submission → "no backend connected" interim | block | needs-backend | pending (D4) |
| account-cart | X | sign-in / account / cart links + commerce signals | link-out to the source store (absolute hydroflask.com URLs) | content | needs-backend | pending (D1) |
| settings-objects | A | `dataLayer`, `adobeDataLayer` | static-snapshot (evidence only; no consumer on migrated page) | content | self | done (no-op) |
| zaraz-endpoint | A | first-party POST /cdn-cgi/zaraz/t (host-bound on target) | tag transport — folded into D5 | — | needs-business-decision | pending (D5) |
| locales | I18N | hreflang variants (en-gb … x-default) | rebuild-native: hreflang links kept pointing at source locales | runtime | needs-business-decision | pending (D6) |
| tags | T | TrustArc CMP, Adobe Launch/Analytics, Klaviyo tracking, Impact (utt.impactcdn / pxf.io), Crobox, Kustomer chat, UserWay a11y widget, Cloudflare insights, RapidSpike, ojrq, cloudfront tag, reviews widget, google.com | embed-passthrough, scaffolded OFF | embed | needs-business-decision | pending (D5) |
| runtime-iframe | V | iframe without src (runtime-injected by a tag) | folded into D5 (tag-owned) | embed | needs-human-capture | pending (D5) |

Unknown third-party hosts (rows 1–10, 20–21, 23, 25, 28–32) classified from host names: Impact affiliate (pxf.io, impactcdn), Crobox (api/cdn.crobox), UserWay (cdn/api/cdn77.userway), Klaviyo (fast.a/static/static-forms/static-tracking), Kustomer (api/cdn.kustomerapp), RapidSpike monitoring, Cloudflare insights, AWS API gateway (execute-api, tag-owned), www.google.com (recaptcha/ads), ojrq.net (Impact), d5yoctgpv4cpx.cloudfront.net (tag CDN) → all class T under D5.

## Decision batch (owner)
- D1 Commerce/auth on the new host — interim: links to the existing store.
- D2 Search backend — interim: header search hands off to the store's search results.
- D3 Product data refresh for the carousels — interim: capture-date snapshot.
- D4 Newsletter endpoint (Klaviyo list) — interim: form UI, "no backend connected".
- D5 Which tags/consent run on the new host — interim: none (scaffolded off).
- D6 Locale trees — interim: this run migrates en-US home only.

## Register
No design deltas arise from dynamics; see stardust/replica/inconsistency-register.md (empty).

## Verification (rollout B2, 2026-10-29)
Fresh detect on https://www.hydroflask.com/ (1440): 35 findings, same rows as the triage above (self 4, owner batch 29, host-bound 1). No new dispositions; the curated plan stands.
