# Dynamics parity check — https://main--52c25a12--aemcoder.aem.live — 2026-11-05T19:24:01.380Z

Replayed 10 checks over 5 features · pass 10 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| team tabs (3 buttons switch 2-card panels) | X | done | dom-count | PASS | 3 × main .tabs [role='tab'], main .tabs button (min 3) | www.youtube.com:200×6 fonts.gstatic.com:200×1 static.doubleclick.net:200×1 googleads.g.doubleclick.net:302×1 googleads.g.doubleclick.net:200×1 www.google.com:200×1 i.ytimg.com:200×1 www.gstatic.com:200×1 yt3.ggpht.com:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| team tabs (3 buttons switch 2-card panels) | X | done | dom-count | PASS | 6 × main .tabs .tabs-panel .team-card (min 6) | www.youtube.com:200×7 fonts.gstatic.com:200×1 static.doubleclick.net:200×1 googleads.g.doubleclick.net:302×1 i.ytimg.com:200×1 googleads.g.doubleclick.net:200×1 www.google.com:200×1 yt3.ggpht.com:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| team tabs (3 buttons switch 2-card panels) | X | done | dom-count | PASS | 6 × main .tabs .tabs-panel .team-card (min 6) |  |
| team tabs (3 buttons switch 2-card panels) | X | done | no-page-errors | PASS | none on 2 page(s) |  |
| YouTube embed (b4Rr_7y068U) in the first media table | V | done | dom-count | PASS | 1 × main .media-table iframe[src*='youtube.com/embed/b4Rr_7y068U'] (min 1) | www.youtube.com:200×7 fonts.gstatic.com:200×1 static.doubleclick.net:200×1 googleads.g.doubleclick.net:302×1 googleads.g.doubleclick.net:200×1 www.google.com:200×1 i.ytimg.com:200×1 yt3.ggpht.com:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| two native <video controls> (rec_1.mp4, rec-2.mp4) | V | done | dom-count | PASS | 2 × main video (min 2) |  |
| content images (picsum / randomuser) re-hosted as DA media | M | done | dom-count | PASS | 9 × main img (min 9) | www.youtube.com:200×7 fonts.gstatic.com:200×1 static.doubleclick.net:200×1 googleads.g.doubleclick.net:302×1 www.google.com:200×1 googleads.g.doubleclick.net:200×1 i.ytimg.com:200×1 yt3.ggpht.com:200×1 www.youtube.com:204×1 jnn-pa.googleapis.com:200×1 |
| content images (picsum / randomuser) re-hosted as DA media | M | done | dom-count | PASS | 8 × main img (min 8) |  |
| content images (picsum / randomuser) re-hosted as DA media | M | done | consent-gate | PASS | no request to 2 gated host pattern(s) before consent | www.youtube.com:200×8 fonts.gstatic.com:200×1 googleads.g.doubleclick.net:302×1 static.doubleclick.net:200×1 www.google.com:200×1 googleads.g.doubleclick.net:200×1 i.ytimg.com:200×1 yt3.ggpht.com:200×1 www.youtube.com:204×2 jnn-pa.googleapis.com:200×1 |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (0 gated · 1 cross-site host(s) blocked) |  |

## Features without checks
