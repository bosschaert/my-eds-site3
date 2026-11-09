# Dynamics parity check — https://main--f1157cd0--aemcoder.aem.live — 2026-11-02T23:30:35.797Z

Replayed 8 checks over 10 features · pass 8 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| header search form | F | interim | dom-count | PASS | 1 × header form (min 1) |  |
| home hero autoplay video carousel | M | done | video-plays | PASS | iframe/video: false · video playing (Δt 0.81s) |  |
| home hero autoplay video carousel | M | done | dom-count | PASS | 3 × .home-visual .mvisual-pagination li (min 3) |  |
| home section-at-a-time scroller | X | done | dom-count | PASS | 6 × #fp-nav li, .fp-nav li, [class*='fp-nav'] li (min 3) |  |
| home product card carousel | X | done | dom-count | PASS | 3 × .product-card-swiper li.swiper-slide (min 3) |  |
| header mega menu + drawer | X | done | dom-count | PASS | 5 × header ul.gnb > li (min 3) |  |
| ESG results tab bar | X | done | dom-count | PASS | 3 × nav.sub-tab a (min 2) |  |
| no uncaught errors | X | done | no-page-errors | PASS | none on 2 page(s) |  |

## Features without checks

- dataLayer settings object (A) — static-snapshot
- locale + related-site links (I18N) — interim · owner: locale-tree scope
- tags (GTM, GA, ad pixel, Cloudflare insights) (T) — interim · owner: which tags run on the new host
