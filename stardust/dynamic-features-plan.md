# Dynamic features — plan

| phase | deliverable | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|
| tabs | `tabs` block reproducing the source tab switcher (first panel active, click switches active button + panel, fadeIn 0.4s) | one row per tab: label cell + cards (image, h4 name, description) | motion-observe source vs build (click each tab), published origin at 1440 + 360 | none | S |
| media | YouTube embed as an authored link the media-table block turns into the iframe; native videos as authored links to the mp4 files the video-gallery block turns into `<video controls playsinline preload=metadata>` | link per cell | content-diff + pixel gate; dynamics-check video presence | none | S |
| images | remote images ingested as DA media | image per cell, alt verbatim | content-presence | none | S |
| martech | `scripts/martech.js` scaffold, all parts disabled | `stardust/martech-contract.json` | dynamics-check `martech` feature: `/` requests no tag host | turn parts on (owner) | XS |
