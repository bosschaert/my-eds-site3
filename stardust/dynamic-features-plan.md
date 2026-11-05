# Dynamic features plan — page1

| phase | deliverable | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|
| tabs | `blocks/tabs` — one row per tab: label cell + panel cell (team cards: image, h4 name, bio) | authors add/remove tabs and cards as rows | click each tab on the published origin at 1440 and 360; active class + panel visibility | none | S |
| video | `blocks/video-gallery` — mp4 links → native `<video controls playsinline preload=metadata>` | authors swap the linked mp4 | both players present with controls on the published origin | none | S |
| media | portraits + field photos rehosted with the page content | — | no off-origin image requests besides none | none | XS |
| martech | `scripts/martech.js` from the empty, disabled contract | owner edits `stardust/martech-contract.json` | dynamics-check `martech` feature: `/` requests no tag host | enable parts (none exist on source) | XS |
