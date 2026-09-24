# Rollout report — https://www.niravmanubhai.com/ → AEM Edge Delivery (2026-09-23)

```
rollout — www.niravmanubhai.com → aem-eds
==================================================
Pages       1 total · 1 verified · 0 deployed-only · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   1 (home: 1/1 delivered)
Blocks      6 total · 6 converted · 0 pending   (hero, host, story-nursery, rooms, conversation, departure)
Quality     health 100/100 · open P1 0 / P2 0 / P3 0 · fixed P2 1 (JSON-LD)
To deliver  none
Content     0 pages awaiting content track
```

Preview: https://main--stardust-replica-38f927f4--of1-labs.aem.page/ (root `/` = index document; `/nav`, `/footer` noindex).

## Fidelity (published origin, `--full`, pub3 confirmation)

| width | pixel | height Δ | overflow | content 🔴 | header / footer crop | chrome deltas |
|---|---|---|---|---|---|---|
| 1440 | 0.02 % | 0 | 0 | 0 | 0.00 % / 0.00 % | 1 accepted (header title tag `<p>` vs `<span>`) |
| 360 | 1.02 % | 0 | 0 | 0 | 0.00 % / 1.09 % | — |

Accepted residuals: header title tag; content-diff 🟡 EXTRA TITLE ×7 (runtime `decorateButtons`), MISSING ARIA-LABEL on one section (runtime sections are `<div>`); footer-link 180 ms colour fade absent on the build. Site: sitemap served 1 = assembled 1; 27 hrefs audited, 0 internal 404 (20 out-of-scope internal targets repointed absolute to the source, see `stardust/direction.md`).

## Dynamic parity (D2, replayed on the published origin)

Replayed 7 checks over 7 features · pass 7 · fail 0 (`stardust/qa/dynamics-report.md`, `stardust/dynamics/parity.json`).

| feature | class | reach | status | owner decision | replayed check |
|---|---|---|---|---|---|
| Cloudflare Web Analytics beacon | T (tag) | site | interim | owner batch — embed passthrough, not loaded on the preview host | consent-gate PASS |
| gtag.js loader (G-00QDEH6N5W) | T (tag) | site | interim | owner batch | consent-gate PASS |
| GA4 collect + house-analytics event helpers | T (tag) | site | interim | owner batch | consent-gate PASS |
| Hamburger menu drawer (button → drawer + overlay, close, Escape) | M (motion) | site (header) | done | rebuild-native, carried by the foundation | dom-count ×2 PASS, no-page-errors PASS |
| body entrance fade (.42 s, off under reduced motion) | M (motion) | site | done | rebuild-native | dom-count PASS |
| dataLayer global (gtag bootstrap) | A (api) | site | decided-out | bootstrap only; lands with the tags | — |
| hreflang en / x-default alternates | I18N | page | decided-out | single page, single language | — |

## Learnings

Six pending entries in `stardust/learnings.md` (font build fork, Latin-only font subset, JSON-LD autofix routed to manual, hover transition invisible to the motion sampler, runtime title-attribute noise in content-diff, bounded crawl leaving state unwritten).
