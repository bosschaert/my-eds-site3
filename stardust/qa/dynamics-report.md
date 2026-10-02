# Dynamics parity check — https://main--fdc3c10d--aemcoder.aem.page — 2026-09-28T11:34:14.539Z

Replayed 5 checks over 7 features · pass 5 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| dataLayer settings object (Google tag) | A | done | no-page-errors | PASS | none on 1 page(s) |  |
| hreflang alternates en / x-default | I18N | done (awaiting code push) | dom-count | PASS | 2 × link[rel="alternate"][hreflang] (min 2) | fonts.googleapis.com:200×1 fonts.gstatic.com:200×5 |
| Google Analytics 4 tag (G-00QDEH6N5W) via gtag.js | T | interim | consent-gate | PASS | no request to 3 gated host pattern(s) before consent | fonts.googleapis.com:200×1 fonts.gstatic.com:200×5 |
| Cloudflare Web Analytics beacon | T | interim | consent-gate | PASS | no request to 2 gated host pattern(s) before consent | fonts.googleapis.com:200×1 fonts.gstatic.com:200×5 |
| no forms, search, modals or players (source parity) | A | done | no-page-errors | PASS | none on 1 page(s) |  |

## Features without checks

- gtag loader (same tag as row 3) (T) — interim · owner: same decision as row 3
- 1×1 iframe injected at runtime (V) — decided-out
