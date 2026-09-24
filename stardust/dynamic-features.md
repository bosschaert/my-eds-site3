<!-- stardust:provenance
  writtenBy: stardust:replica
  writtenAt: 2026-09-23T13:28:24Z
  readArtifacts: [stardust/current/_dynamics.json, stardust/dynamics/dynamic-features.generated-plan.md]
  synthesizedInputs: []
  stardustVersion: 0.25.0
-->
# Dynamic features — static-website.david-bosschaert.workers.dev

## Listings contract
none — the site has no listing blocks, no query index consumers.

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | v-video-youtube | YouTube embed b4Rr_7y068U in the first media table | V | index (1/2) | embed-passthrough | self | planned | media-as-url | none — player id is public | _dynamics.json (draft rows 1,2,6,7,8,9 are this iframe's own subresources: gstatic, jnn-pa.googleapis, google.com, yt3.ggpht, ad pixel — merged here) |
| 2 | c-team-tabs | Team tabs: 3 buttons toggle 3 panels via class swap (`showTabSection(i)`), 0.4 s fade-in | C | index, page1 (2/2) | client-only | self | planned | inline-js-widget | none | pages/*.html `.tabs-section`; script.js; motion observed in Phase 3 |
| 3 | t-image-hosts | Hot-linked images: randomuser.me portraits (6), picsum.photos photos (3, served via fastly.picsum.photos) | T | index, page1 (2/2) | embed-passthrough | self | planned | media-as-url | hands-off decision: keep the source URLs as captured (capture-state policy); rollout media-reconcile may rehost | draft rows 3,4,5 |

## Decision batch
none — every row is reproducibility `self`. Under hands-off, the image-host row keeps the captured URLs (interim tier); a later owner may choose to rehost.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | — | — |
