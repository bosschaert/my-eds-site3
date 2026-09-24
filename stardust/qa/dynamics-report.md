# Dynamics parity check — https://main--stardust-replica-1a972ee3--of1-labs.aem.page — 2026-09-23T14:33:10.133Z

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
