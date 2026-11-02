# Rollout report — https://www.hydroflask.com/ → aem-eds (2026-10-29)

```
rollout — www.hydroflask.com → aem-eds
==================================================
Pages       1 total · 1 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale
Templates   1 (landing 1/1)
Blocks      7 total · 7 converted · 0 pending   (+ header, footer foundation)
Quality     health 100/100 · open P1 0 / P2 0 / P3 0
Pixel table prototypes 1/1 PASS · deployed 1/1 PASS (pixel-only 1/1) — gates/{prototypes,all}-1440/summary.md
            published origin: 1440 0.39% Δh 0 · 360 1.89% Δh 0 · clip 0 · content missing 0
To deliver  none (scope: home page only)
Content     0 pages awaiting content track
```

Live: https://main--53deb2f5--aemcoder.aem.live/ (preview https://main--53deb2f5--aemcoder.aem.page/). Published: `/` (index), `/nav`, `/footer` (noindex). Redirects: none needed (root delivered as the index document).

## Dynamic parity (stardust/qa/dynamics-report.md — 9/9 checks PASS on aem.live)

| feature | class | status | owner decision | check |
|---|---|---|---|---|
| hero carousel (auto-rotate, pause, dots) | M/V | done | — | dom-count ×2, rotation advances unpoked (E) |
| product carousels (2) | L | done, snapshot 2026-10-29 | D3 product data refresh | dom-count ×2 |
| header mega-menu, account, store switcher, cart | M | done | — | dom-count, click-dialog (Escape closes) |
| newsletter form | F | interim — refuses empty, states no data sent | D4 newsletter endpoint | dom-count |
| third-party tags + consent manager | T | scaffolded off | D5 tags/consent on the new host | consent-gate (0 requests to 11 hosts), no-page-errors |
| header search | S | interim — hands off to the store's search | D2 search backend | — |
| account / cart | X | interim — links to the existing store | D1 commerce/auth | — |
| locale variants | I18N | interim — hreflang to source locales | D6 locale trees | — |

## Residuals and owner items
- Header parity residuals (C-deliver): search typeahead (D1), Hydro Finder (third-party Crobox, D5), measurement artefacts on rotating/Klaviyo areas.
- HydroFlask Sans is self-hosted from the source capture — licence to confirm by the owner.
- Store switcher target www.hydroflask.com.hk fails TLS at the source (certificate expired).
- Out-of-scope internal links (≈110 store paths) point to the current store by design (E2 decision in `stardust/direction.md`).
