# Rollout report — static-website.david-bosschaert.workers.dev → of1-labs/stardust-replica-1a972ee3 (aem-eds)

Generated 2026-09-23T14:38Z by stardust:replica Phase 5 (rollout H-report).

```
rollout — static-website.david-bosschaert.workers.dev → aem-eds
==================================================
Pages       2 total · 2 verified · 0 deployed-unverified · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   2 (index/landing 1/1 · page1/static 1/1)
Blocks      5 total · 5 converted · 0 pending  (header, footer, team-tabs, media-grid, content-block)
Quality     health 100/100 · open P1 0 / P2 0 / P3 0  (3 P2 accepted: 2× no JSON-LD, 1× shared <title> — verbatim replicas of the source)
To deliver  none
Content     0 pages awaiting content track
```

## Fidelity (published origin, live site vs main--stardust-replica-1a972ee3--of1-labs.aem.page)

| page | template | 1440 pixel / Δh | 360 pixel / Δh | content-diff 🔴 | header / footer bands |
|---|---|---|---|---|---|
| / (index) | landing | 0.01% / 0px | 0.14% / 0px | 0 | 0.00% / 0.00% |
| /page1 | static | 0.03% / 0px | 0.17% / 0px | 0 | 0.00% / 0.00% |

Chrome parity: pixel bands 0.00% at both widths; the instrument's region deltas are scoping artifacts (the source has no `<header>` landmark; its footer text is a bare text node), recorded at the foundation unit.

## Dynamic parity (stardust/qa/dynamics-report.md, Phase D2)

Replayed 9 checks over 3 features · pass 9 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| YouTube embed b4Rr_7y068U in the first media table | V | done | dom-count | PASS | 1 × iframe[src*='youtube.com/embed/b4Rr_7y068U'] (min 1) | www.youtube.com:200×7 fonts.gstatic.com:200×1 googleads.g.doubleclick.net:302×1 static.doubleclick.net:200×1 googleads.g.doubleclick.net:200×1 www.google.com:200×1 i.ytimg.com:200×1 yt3.ggpht.com:200×1 www.gstatic.com:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| YouTube embed b4Rr_7y068U in the first media table | V | done | video-plays | PASS | iframe/video: true · playback requests 19 (ok) | www.youtube.com:200×13 fonts.gstatic.com:200×4 static.doubleclick.net:200×1 googleads.g.doubleclick.net:302×1 googleads.g.doubleclick.net:200×1 www.google.com:200×1 i.ytimg.com:200×4 yt3.ggpht.com:200×2 www.youtube.com:204×5 jnn-pa.googleapis.com:200×1 rr3---sn-2ohpa5-55.googlevideo.com:200×1 rr1---sn-2o25g5-5c.googlevideo.com:200×2 |
| Team tabs: 3 tabs toggle 3 panels via class swap | C | done | dom-count | PASS | 3 × .team-tabs [role='tab'] (min 3) | www.youtube.com:200×9 fonts.gstatic.com:200×1 static.doubleclick.net:200×1 googleads.g.doubleclick.net:302×1 www.google.com:200×1 googleads.g.doubleclick.net:200×1 i.ytimg.com:200×1 yt3.ggpht.com:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| Team tabs: 3 tabs toggle 3 panels via class swap | C | done | dom-count | PASS | 3 × .team-tabs [role='tabpanel'] (min 3) | www.youtube.com:200×8 fonts.gstatic.com:200×1 static.doubleclick.net:200×1 googleads.g.doubleclick.net:302×1 www.google.com:200×1 googleads.g.doubleclick.net:200×1 i.ytimg.com:200×1 yt3.ggpht.com:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| Team tabs: 3 tabs toggle 3 panels via class swap | C | done | dom-count | PASS | 3 × .team-tabs [role='tab'] (min 3) |  |
| Team tabs: 3 tabs toggle 3 panels via class swap | C | done | dom-count | PASS | 6 × .team-tabs [role='tabpanel'] .team-card (min 6) |  |
| Team tabs: 3 tabs toggle 3 panels via class swap | C | done | no-page-errors | PASS | none on 2 page(s) |  |
| Hot-linked images: randomuser.me portraits (6), picsum.photos photos (3) | T | done | dom-count | PASS | 9 × main img (min 9) | www.youtube.com:200×8 fonts.gstatic.com:200×1 static.doubleclick.net:200×1 googleads.g.doubleclick.net:302×1 www.google.com:200×1 googleads.g.doubleclick.net:200×1 i.ytimg.com:200×1 yt3.ggpht.com:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| Hot-linked images: randomuser.me portraits (6), picsum.photos photos (3) | T | done | dom-count | PASS | 6 × main img (min 6) |  |

## Features without checks

## Delivery ledger
- Foundation (C0): styles, header/footer blocks, /nav + /footer documents, /page1 shell — published, header/footer bands 0.00%.
- Cluster site-blocks (C1): team-tabs, media-grid, content-block blocks; /index and /page1 content — published, gates above.
- Final (C-final): foundation freeze unchanged (16 files), 0 foundation requests.
- Site assembly: sitemap.xml (2 urls) + robots.txt + manifest.json staged; root served from the index document (200 on preview and live); no redirects (source root serves a page).
- Verify: 2/2 verified. Link audit: 2 internal hrefs, both 200; 0 source-host links kept.

## Notes for the owner
- Fonts: the source declares Poppins / Playfair Display but loads neither; the replica loads no web font (matches what visitors see).
- Images: the source hot-links randomuser.me / picsum.photos; the delivery pipeline rehosted the captured images.
- Credential handling: one background-job record briefly captured the deploy token and reached a pushed checkpoint commit; redacted within minutes, history rewritten and re-scanned clean. Rotating the IMS token used for this run is recommended.
