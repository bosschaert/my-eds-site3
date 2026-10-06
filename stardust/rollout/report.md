<!-- stardust provenance: skill=stardust:rollout · phase=H-report · 2026-10-05 · inputs stardust/rollout/rollout.json#lastRun, stardust/rollout/optimize/scorecard.json, stardust/replica/gates/{prototypes,all}-{1440,360}/summary.json, stardust/qa/dynamics-report.md -->
```
rollout — www.example.com → aem-eds (https://main--b3ee2d3b--aemcoder.aem.live)
==================================================
Pages       1 total · 1 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   1 (landing: 1/1 delivered)
Blocks      1 total · 1 converted · 0 pending   (notice)
Quality     health 100/100 · open P1 0 / P2 0 / P3 0 · 1 source-parity informational (no JSON-LD; source has none)
Pixel table prototypes 1/1 PASS · deployed 1/1 PASS (pixel-only 1/1) — gates/{prototypes,all}-1440/summary.md
            1440: prototype 0.01 % Δh 0 · published 0.08 % Δh 0 · 360: prototype 0.05 % Δh 0 · published 0.29 % Δh 0
            clipped 0 · content MISSING 0 / HIDDEN 0 · cap-probe PASS @ 2560 · overflow ok
To deliver  none
Content     0 pages awaiting content track
Publish     live on aem.live: / (index), /nav, /footer (chrome noindex); served sitemap 1 url = assembled 1; redirects none needed
```

## Dynamic parity (Phase D2)

Replayed 0 checks over 0 features · pass 0 · fail 0 (`stardust/qa/dynamics-report.md`). The source is one static page: no third-party hosts, no API calls, no forms, no modals or players. Nothing shipped static that was dynamic.

## What's missing

Nothing: no pending, stale or failed page; no ungated deployed page (1/1 rows in `all-1440` and `all-360`).
