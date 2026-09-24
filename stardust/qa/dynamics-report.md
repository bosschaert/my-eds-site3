# Dynamics parity check — https://main--stardust-replica-fe635832--of1-labs.aem.live — 2026-09-23T20:44:35.513Z

Replayed 6 checks over 5 features · pass 6 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| Header primary-menu dropdowns (4 x aria-haspopup) + mobile hamburger collapse | M | done | dom-count | PASS | 4 × .header a[aria-haspopup="true"] (min 4) |  |
| Header primary-menu dropdowns (4 x aria-haspopup) + mobile hamburger collapse | M | done | dom-count | PASS | 1 × .header .navbar-toggler (min 1) |  |
| Header primary-menu dropdowns (4 x aria-haspopup) + mobile hamburger collapse | M | done | no-page-errors | PASS | none on 2 page(s) |  |
| Google Tag Manager container | T | interim | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |
| Google Analytics (GA4 collect) | T | interim | consent-gate | PASS | no request to 3 gated host pattern(s) before consent |  |
| Facebook pixel / SDK | T | interim | consent-gate | PASS | no request to 3 gated host pattern(s) before consent |  |

## Features without checks

- WordPress/GTM dataLayer settings object (A) — decided-out
