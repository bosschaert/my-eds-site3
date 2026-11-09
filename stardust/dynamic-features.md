<!-- stardust provenance: skill=stardust:replica (dynamics Phases 1–3, hands-off) · 2026-11-02 · input stardust/dynamics/dynamic-features.generated-plan.md + archetype DOM review -->
# Dynamic features — Doosan Bobcat (2-page replica)

## Listings contract
No listing / index-fed bands on the two in-scope pages (the home "Media Center" band links out to /en/mediacenter/news; its cards are static in the captured DOM and are authored as content).

## Features

| # | id | class | feature | pages | disposition | target | reproducibility | status | notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-datalayer | A | dataLayer settings object | 2/2 | static-snapshot | content | self | planned | only GA ids; nothing rendered depends on it |
| 2 | f-header-search | F | header search form → /en/search/result | 2/2 | rebuild-native | block (header) | needs-backend | interim | UI rebuilt in header; interim submits to the source origin's /en/search/result (results page out of scope). Decision named: search backend on the new host |
| 3 | i18n-locale-variants | I18N | header/footer locale + related-site links (KR / NA / AP) | 2/2 | rebuild-native | content (nav/footer links) | needs-business-decision | interim | links kept verbatim to their source URLs. Decision named: locale-tree scope |
| 4 | t-tags (GTM, GA, ad pixel, Cloudflare insights) | T | tags | 2/2 | embed-passthrough | embed | needs-business-decision | interim | not loaded on the new host (martech scaffolded off — not requested). Decision named: which tags run on the new host |
| 5 | m-hero-video-carousel | M | home hero: 3 autoplay videos in a fading swiper with numbered progress pagination | en | rebuild-native | block JS | self | planned | timer-driven media = fired; deliver autoplay/loop |
| 6 | x-fullpage-scroller | X | home: jquery.fullpage.js section-at-a-time scroller | en | rebuild-native | page JS | self | planned | replicated per motion-observe evidence |
| 7 | x-product-swiper | X | home: product card drag carousel | en | rebuild-native | block JS | self | planned | |
| 8 | x-header-megamenu | X | header mega menu (hover/click), mobile drawer | 2/2 | rebuild-native | header block | self | planned | header contract |
| 9 | x-esg-tabs | X | ESG results: in-page tab bar (Planet / People / …) | esg | rebuild-native | block | self | planned | verify on motion-observe |

## Decision batch (owner, hands-off interim shipped)
1. Search backend on the new host (row 2) — interim: submit to source search.
2. Locale-tree scope (row 3) — interim: links to source locale sites.
3. Tags on the new host (row 4) — interim: none loaded.

## Register
No `regulated-pii` forms. No host-bound first-party APIs (0 probed paths dead). No `decided-out` rows.
