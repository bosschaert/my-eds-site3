# Dynamics parity check — https://main--9552f862--aemcoder.aem.live — 2026-10-12T15:43:10.609Z

Replayed 4 checks over 4 features · pass 4 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| hreflang alternates en + x-default → self | I18N | done | dom-count | PASS | 2 × link[rel="alternate"][hreflang] (min 2) |  |
| hreflang alternates en + x-default → self | I18N | done | no-page-errors | PASS | none on 1 page(s) |  |
| Google Tag Manager / gtag G-00QDEH6N5W (+ GA4 collect) | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 5 gated host pattern(s) before consent |  |
| Cloudflare Web Analytics beacon + bot-management challenge frame | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |

## Features without checks

- window.dataLayer (GTM queue) (A) — done
