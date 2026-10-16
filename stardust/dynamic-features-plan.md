# Dynamic features plan — continental.com

| phase | deliverable | rows | authoring contract | verification |
|---|---|---|---|---|
| D1 static-first | every page renders complete without network features; snapshots authored as content | 2, 3, 12, 14, 17 | sections authored in DA; interim notices in block JS | gate rows (pixel/content) |
| D2 client behaviour | lightbox, language menu, sliders/tabs/accordions, stage overlay, download-cart UI | 3, 4, 5, 7, 8 | block JS, no external data | motion-observe parity per archetype |
| D3 embeds | AdmiralCloud player, EquityStory widgets, job widgets, caralegal iframe | 9, 10, 11, 13 | embed block keyed by live-DOM ids | dynamics-check presence |
| D4 index | `helix-query.yaml` + header search results over the migrated corpus; hreflang metadata | 1, 6 | query index config in code branch | search-query parity (count + titles over migrated corpus) |
| owner | backends, allowlists, martech, live listings | 2, 3, 9–12, 14, 15 | decision batch in dynamic-features.md | — |
