# Rollout report — https://www.example.com/ → aem-eds (2026-09-23)

```
rollout — www.example.com → aem-eds
==================================================
Pages       1 total · 1 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   1 (index: 1/1 delivered)
Blocks      0 total · 0 converted · 0 pending   (default content only; empty header/footer blocks)
Quality     health 100/100 · open P1 0 / P2 0 / P3 0   (1 source-parity note: no JSON-LD, same as source)
To deliver  none
Content     0 pages awaiting content track
```

## Delivery ledger
| path | status | put | preview | live | published gate 1440 | 360 | verify |
|---|---|---|---|---|---|---|---|
| `/` (index) | live, verified | 201 | 200 | 200 | 0.00% hΔ0 | 0.00% hΔ0 | ok |

Site: sitemap served 1 url = assembled 1; root `/` 200 on preview and live; 1 external href (verbatim, resolves); no redirects; no chrome documents.

## Dynamic parity (Phase D2)
From `stardust/qa/dynamics-report.md`: replayed 0 checks over 0 features · pass 0 · fail 0. The source page is fully static (no scripts, no forms, no endpoints, no players); nothing was decided out and nothing is owner-pending.

| feature | class | reach | status | owner decision | replayed check |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

## What's missing
Nothing: no pending, stale or failed pages; no content-pending pages.
