# Rollout report — static-website.david-bosschaert.workers.dev → AEM Edge Delivery (2026-10-06)

```
rollout — https://static-website.david-bosschaert.workers.dev/ → aem-eds
==================================================
Pages       2 total · 2 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   2 (landing 1/1 · static 1/1)
Blocks      5 total · 5 converted · 0 pending   (header, footer, team-tabs, media-cells, prose-block)
Quality     health 98/100 · open P1 0 / P2 0 / P3 0 (1 P3 accepted: duplicate description — source carries none)
Pixel table prototypes 2/2 PASS · deployed 2/2 PASS (pixel-only 2/2) — gates/{prototypes,all}-1440/summary.md
            published origin after C-final: 1440 index 0.05 % · page1 0.03 % — 360 index 0.36 % · page1 0.44 % (Δh 0, clip 0, content 0 missing)
To deliver  none
Content     0 pages awaiting content track
```

Live origin: https://main--bb2d4d27--aemcoder.aem.live/ (`/`, `/page1`, chrome `/nav` + `/footer` noindex, `/redirects.json` 3 rows). Served sitemap 2 = assembled 2. Links: 3 hrefs site-wide, every target 200.

## Dynamic parity (stardust/qa/dynamics-report.md, D2)

| feature | class | reach | status | owner decision | replayed check | result |
|---|---|---|---|---|---|---|
| YouTube embed (video b4Rr_7y068U) in a media-table cell | V media | home (1/2) | done | none — public player id | video-plays: iframe present, 9 playback requests to youtube.com | PASS |
| Team tabs: 3 buttons toggle `.active`, content fades in 0.4 s | X interaction | home + page1 (2/2) | done | none | dom-count 3 tabs + 3 panels on both pages; no page errors; motion-compare 5 parity / 0 missing / 0 extra | PASS |
| Remote images (randomuser.me, picsum.photos, fastly.picsum.photos — 9 files) | M media | home + page1 (2/2) | done (static snapshot 2026-10-06) | none | dom-count 9 `main img` on `/`, 6 on `/page1`; 0 broken | PASS |

## What's missing

Nothing pending, stale or failed. Alias parity gap (informational): the source 307s `/index` → `/`; EDS reserves `/index` for the root document and answers 404 there — not redirectable through the sheet, not linked anywhere.

## Owner follow-ups (optional)

- Meta descriptions: the source has none; the platform derives one from the first paragraph, shared by both pages. Author a `Description` metadata row per page if distinct descriptions are wanted.
- `<title>` "Good Morning!" is shared by both pages, as on the source.
