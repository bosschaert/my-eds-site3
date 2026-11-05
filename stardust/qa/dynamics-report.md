# Dynamics parity check — https://main--1588603b--aemcoder.aem.live — 2026-11-05T12:11:34.136Z

Replayed 6 checks over 4 features · pass 6 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| team tabs | M | done | dom-count | PASS | 3 × .tabs .tab-buttons [role=tab] (min 3) |  |
| team tabs | M | done | dom-count | PASS | 6 × .tabs .team-card (min 6) |  |
| native video players | V | done | dom-count | PASS | 2 × .video-gallery video source[src$='.mp4'] (min 2) |  |
| portrait images | T | done | dom-count | PASS | 6 × .team-card img (min 6) |  |
| portrait images | T | done | no-page-errors | PASS | none on 1 page(s) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (0 gated · 0 cross-site host(s) blocked) |  |

## Features without checks
