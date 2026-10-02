# Rollout report — https://www.thebeastisback.com/ → aem-eds (2026-10-01)

```
rollout — https://www.thebeastisback.com/ → aem-eds
==================================================
Pages       1 total · 1 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   1 (index: 1/1 delivered)
Blocks      3 total · 3 converted (header, footer, project-grid) · 0 pending
Quality     health 100/100 · open P1 0 / P2 0 / P3 0 (P1 seo/single-h1 fixed in G-aem; P2 ai-search/jsonld accepted)
Pixel table prototypes 1/1 PASS · deployed 1/1 PASS (pixel-only 1/1) — gates/{prototypes,all}-1440/summary.md
            published origin 1440 1.83% (text 3.95%) / 360 0.78% (text 1.95%) · Δh 1 px · clipped 0 · MISSING 0 / HIDDEN 0
To deliver  none
Content     0 pages awaiting content track
```

Delivered and published on `https://main--c151e704--aemcoder.aem.live`: `/` (site root resolves to the migrated home page), `/nav`, `/footer` (chrome, noindexed), `/redirects.json` (198 rows: 99 out-of-scope paths → source site, `/about` 301), sitemap, robots, manifest. Link audit 102/102 hrefs resolve on the live tree.

## Dynamic parity (Phase D2 — `stardust/qa/dynamics-report.md`, 2026-10-01T16:02Z)

Replayed 6 checks over 7 features · pass 6 · fail 0. Flows, not presence.

| feature | class | reach | status | owner decision | replayed check |
|---|---|---|---|---|---|
| Project grid: 96 server-rendered items positioned client-side (shortest-column masonry) | CR | / | done | — | 96 × `.project-grid a.project` PASS · 96 × `.positioned` PASS · no page errors PASS |
| Mobile "Menu" link toggles the mobile nav (≤750px) | I | / | done | — | 1 × `#mobileMenuLink a` PASS · 5 × `#mobileNav #topNav li a` PASS · motion replay vs live 3 parity / 0 missing / 0 extra |
| Squarespace platform hosts | T | / | decided-out | — | consent-gate PASS (no request to 5 gated host patterns) |
| Newsletter signup form (email + Sign Up) | F | / | skipped-source-broken | open, non-blocking: choose a newsletter provider/endpoint; the footer block then posts the email to it | — |
| Squarespace census beacon POST /api/census/RecordHit | A | / | decided-out | host-bound analytics, not carried | — |
| Squarespace form-render telemetry POST /api/census/form-render | A | / | decided-out | host-bound analytics, not carried | — |
| Root feature-detect classes | CR | / | decided-out | Squarespace runtime detail, no visible effect | — |

## What's missing

Nothing pending, stale or failed. One owner decision stays open and is non-blocking: the newsletter form's provider on the new host (the form renders as captured; submissions have no endpoint until one is chosen).
