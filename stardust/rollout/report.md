# Rollout report — https://new.express.adobe.com/webpage/DYft29Wzo0QLK → AEM Edge Delivery (2026-10-06)

```
rollout — new.express.adobe.com/webpage/DYft29Wzo0QLK → aem-eds
==================================================
Pages       1 total · 1 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   1 (webpage-dyft29wzo0qlk: 1/1 delivered)
Blocks      5 total · 5 converted · 0 pending   (hero, photo-band, cards, figure, photo-grid; + bumper, header, footer foundation)
Quality     health 100/100 · open P1 0 / P2 0 / P3 0   (2 source-parity rows, informational: no JSON-LD, title "test-page")
Pixel table prototypes 1/1 PASS · deployed 1/1 PASS (pixel-only 1/1) — gates/{prototypes,all}-1440/summary.md
            1440: 2.39 % Δh −8 clip 0 content 0 · 360: 5.23 % Δh +7 clip 0 content 0 (published origin)
To deliver  none
Content     0 pages awaiting content track
```

Live origin: https://main--b7aaf274--aemcoder.aem.live — `/`, `/index.html` and the source's mixed-case path redirect to `/webpage/dyft29wzo0qlk` (200). `/nav` and `/footer` published with `noindex`. Served sitemap 1 = assembled 1. Publish decision: publish (recorded in `stardust/eds-conversion-log.md`).

## What's missing
Nothing pending, stale or failed. Owner items, non-blocking: analytics tags (EDS RUM is on; add Adobe Launch if the same reporting is wanted); the "Made in Adobe Express" badge is replicated as captured and can be removed on request (register R-03); the Report Abuse control is not offered (register R-01); headings render in Anton with `poplar-std` first in the stack until a licensed Poplar Std drop-in is provided (register R-02).

## Dynamic parity (stardust/qa/dynamics-report.md, replayed 2026-10-06 on the live origin — 9/9 PASS)
| feature | class | reach | status | owner decision | replayed check |
|---|---|---|---|---|---|
| client-rendered page delivered as static EDS content | CR | 1/1 | done | — | dom-count 10 headings, 13 images — PASS |
| "Copy link" buttons beside each h2/h3 (clipboard + toast) | CR | 1/1 | done | — | dom-count 9 buttons + 9 tooltips — PASS |
| fixed "Made in Adobe Express" badge | static | 1/1 | done | remove on request (R-03) | dom-count badge 1 + link 1 — PASS |
| adobe.com/go links kept verbatim | I18N | 1/1 | done | — | dom-count 1 — PASS |
| site root resolves to the page; no page errors | static | 1/1 | done | — | no-page-errors (2 pages) + h1 on `/` — PASS |
| Express publication / identity / feature-flag / edge APIs | A | — | decided-out | — | no check (host-bound, no consumer) |
| Express platform services (telemetry, deep links) | A | — | decided-out | — | no check |
| Report Abuse dialog + form | CR/F | — | decided-out | — | no check (R-01) |
| runtime locale bundle + login mini-app | D | — | decided-out | — | no check |
| Adobe Launch / analytics / New Relic / error monitoring | T | — | decided-out | add Launch if wanted | no check |
| IMS identity | X | — | decided-out | — | no check |

## Link audit
`localize-links --check` PASS; 13/13 media 200; one source-host link kept absolute by design (Express template-picker in the footer badge). The two external adobe.com footer links answer 403 "Access Denied" from this environment's egress address in curl and Chromium alike — an environment limit on adobe.com's side, to be verified from a regular network.

## Verification trail
`stardust/status.jsonl` (ledger), `stardust/journal.md` (one section per phase), `stardust/rollout/progress.json` (C-deliver units), `stardust/replica/gates/` (pixel evidence), `stardust/dynamics/parity.json`, `stardust/rollout/optimize/scorecard.json`.
