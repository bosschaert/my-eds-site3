# Dynamics parity check — https://main--53deb2f5--aemcoder.aem.live — 2026-10-29T22:16:35.197Z

Replayed 9 checks over 9 features · pass 9 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| auto-rotating hero banner slider (pause/play, dots) | M/V | done | dom-count | PASS | 2 × .hero-carousel .hero-slide (min 2) |  |
| auto-rotating hero banner slider (pause/play, dots) | M/V | done | dom-count | PASS | 3 × .hero-carousel .hero-controls button, .hero-carousel .hero-dot (min 3) |  |
| product tile sliders (2), authored rows | L | done | dom-count | PASS | 2 × .product-carousel (min 2) |  |
| product tile sliders (2), authored rows | L | done | dom-count | PASS | 12 × .product-carousel .product-image (min 8) |  |
| header mega-menu, account, locale and cart panels | M | done | dom-count | PASS | 5 × header button[aria-controls^='nav-mega-'] (min 3) |  |
| header mega-menu, account, locale and cart panels | M | done | click-dialog | PASS | dialog 744px · heading "Choose Your Location" · 0 fields · Escape closes: true |  |
| footer 'Stay in touch' newsletter form | F | interim | dom-count | PASS | 1 × footer form.footer-form input[type=email][required] (min 1) |  |
| TrustArc CMP, Adobe Launch, Klaviyo, Impact, Crobox, Kustomer, UserWay, Cloudflare insights, RapidSpike | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 11 gated host pattern(s) before consent |  |
| TrustArc CMP, Adobe Launch, Klaviyo, Impact, Crobox, Kustomer, UserWay, Cloudflare insights, RapidSpike | T | scaffolded-awaiting-owner | no-page-errors | PASS | none on 1 page(s) |  |

## Features without checks

- header search (S) — interim · owner: D2: search backend on the new host
- sign-in / account / cart (X) — interim · owner: D1: commerce and auth on the new host
- hreflang locale variants (I18N) — interim · owner: D6: locale trees
- dataLayer / adobeDataLayer (A) — done
