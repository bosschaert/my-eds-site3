# Rollout report — garden-eight.com → aem-eds (2026-10-05)

```
rollout — https://garden-eight.com/ → aem-eds
==================================================
Pages       1 total · 1 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   1 (home 1/1 delivered)
Blocks      5 total · 5 converted · 0 pending   (hero, cases, about-teaser + header/footer chrome)
Quality     health 100/100 · open P1 0 / P2 0 / P3 0
Pixel table prototypes 1/1 PASS (1440; 360 1/1) · deployed 1/1 PASS (1440; 360 1/1; pixel-only 0/1 — height under the documented scroll-jack override) — gates/{prototypes,all}-1440/summary.md
To deliver  none
Content     0 pages awaiting content track
```

Published origin: https://main--061e4e3f--aemcoder.aem.live/ (root serves the home page; preview https://main--061e4e3f--aemcoder.aem.page/).
Gate numbers on the published origin: 1440 pixel 4.69 % (text 9.08 %), 360 pixel 2.16 % (text 9.23 %); content MISSING 0 / HIDDEN 0 at both widths; clipped 2/2 allowed (footer mail tip lines); height Δ −2762 / −1984 px under the documented override (the source page is scroll-jacked: a 900 px document with an inner scroller, gates/all-<w>/overrides.json).

## Site assembly
- Redirects: 10 rows (/about, /cases, /ja, /faq, /contact, /archives, /ai, three case detail pages → the same path on garden-eight.com); all 301 on aem.live. The same ten hrefs are repointed to the source in the content (scope extension, direction.md).
- Sitemap served 1 = assembled 1; /nav and /footer carry robots noindex. Link audit: 15/15 fetched hrefs 200.
- JSON-LD: the source site graph carried verbatim in head.html.

## Dynamic parity (stardust/qa/dynamics-report.md)
| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| clipped line reveals, split headline, case marquee (settled text authored verbatim) | CR | done | dom-count | PASS | 6 × .clip-y (min 1) |  |
| clipped line reveals, split headline, case marquee (settled text authored verbatim) | CR | done | dom-count | PASS | 3 × .cases .pickup-a (min 3) |  |
| clipped line reveals, split headline, case marquee (settled text authored verbatim) | CR | done | dom-count | PASS | 3 × .cases .mq (min 1) |  |
| clipped line reveals, split headline, case marquee (settled text authored verbatim) | CR | done | no-page-errors | PASS | none on 1 page(s) |  |
| "M : hello@garden-eight.com" copy-to-clipboard control (Copy to clipboard / Copied) | CR | done | dom-count | PASS | 1 × .ui-btn-mail (min 1) |  |
| "M : hello@garden-eight.com" copy-to-clipboard control (Copy to clipboard / Copied) | CR | done | dom-count | PASS | 1 × .ui-btn-mail a[href^='mailto:'] (min 1) |  |

Features without replayable checks (stardust/dynamics/parity.json): WebGL background scene — interim, capture-state (owner: port the three.js scene as a block script or keep the static paint); case/about background videos — interim, capture-state (owner: supply the video sources); locale variants — /ja repointed to the source; favicon — self-hosted, 200; chat/FAQ settings fetch and Nuxt payload — decided-out.

## What is missing
Nothing in scope. Owner decisions outstanding: the WebGL scene and the lazy videos (both shipped as captured).
