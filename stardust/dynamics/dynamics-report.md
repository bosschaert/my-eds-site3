# Dynamics parity check — https://main--e8103195--aemcoder.aem.live — 2026-10-13T16:27:09.311Z

Replayed 6 checks over 6 features · pass 5 · fail 1. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| Hero background video (autoplay muted loop) | M | done | video-plays | FAIL | iframe/video: false · video NOT playing (Δt 0.00s) · video not playing (paused false, Δt 0.00s, readyState 0, 100% visible) |  |
| What's New carousel (3-up, 4 slides, dots + arrows) | M | done | dom-count | PASS | 4 × .news .news-slide (min 4) |  |
| Project map, 12 linked pins | M | done | dom-count | PASS | 12 × .map .map-pin (min 12) |  |
| Newsletter sign-up | F | interim | dom-count | PASS | 5 × .newsletter form input:not([type=hidden]) (min 4) |  |
| Google Tag Manager / Analytics / Facebook pixel | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 3 gated host pattern(s) before consent |  |
| page runs without uncaught errors | M | done | no-page-errors | PASS | none on 1 page(s) |  |

## Features without checks
