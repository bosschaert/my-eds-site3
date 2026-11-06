# Dynamic features — static-website.david-bosschaert.workers.dev

<!-- stardust provenance: skill=stardust:dynamics · phase=triage (curated) · 2026-11-05 · from stardust/dynamics/dynamic-features.generated-plan.md + source script.js -->

## Listings contract
none — no listing blocks on the two in-scope pages.

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | x-team-tabs | team tabs (3 buttons switch 2-card panels; `showTabSection(idx)` in /script.js) | X | 2/2 | rebuild-native | block | self | done | tabs | none | `.tabs-section` + `onclick="showTabSection(n)"` on both pages |
| 2 | v-video-youtube | YouTube embed (b4Rr_7y068U) in the first media table | V | 1/2 | embed-passthrough | embed | self | done | media-as-url | none (player ids are public) | www.youtube.com/embed/b4Rr_7y068U; its subresources www.gstatic.com, jnn-pa.googleapis.com, www.google.com, yt3.ggpht.com, i.ytimg.com, googleads/static.doubleclick.net (merged rows 1,2,6,7,8 of the draft — all loaded by the YouTube player iframe, not by the site) |
| 3 | v-native-video | two native `<video controls>` (/vids/rec_1.mp4, /vids/rec-2.mp4) | V | 1/2 | rebuild-native | block | self | done | media-as-file | none | page1 `.video-gallery` |
| 4 | m-remote-images | content images hot-linked from picsum.photos / fastly.picsum.photos and randomuser.me portraits | M | 2/2 | static-snapshot | content | self | done | media-ingest | none — images become authored DA media | draft rows 3,4,5 (image hosts, not tags) |

## Decision batch
Nothing needs the owner for the static or dynamic surface. Martech: the source runs no tag manager, CMP or analytics of its own (the only ad pixel is YouTube's inside its iframe); `stardust/martech-contract.json` is scaffolded with every part disabled per the owner's request to keep tags and consent — see `stardust/martech-handoff.md`.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
