# Dynamics parity check — https://main--061e4e3f--aemcoder.aem.live — 2026-10-05T18:01:24.791Z

Replayed 6 checks over 8 features · pass 6 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| clipped line reveals, split headline, case marquee (settled text authored verbatim) | CR | done | dom-count | PASS | 6 × .clip-y (min 1) |  |
| clipped line reveals, split headline, case marquee (settled text authored verbatim) | CR | done | dom-count | PASS | 3 × .cases .pickup-a (min 3) |  |
| clipped line reveals, split headline, case marquee (settled text authored verbatim) | CR | done | dom-count | PASS | 3 × .cases .mq (min 1) |  |
| clipped line reveals, split headline, case marquee (settled text authored verbatim) | CR | done | no-page-errors | PASS | none on 1 page(s) |  |
| "M : hello@garden-eight.com" copy-to-clipboard control (Copy to clipboard / Copied) | CR | done | dom-count | PASS | 1 × .ui-btn-mail (min 1) |  |
| "M : hello@garden-eight.com" copy-to-clipboard control (Copy to clipboard / Copied) | CR | done | dom-count | PASS | 1 × .ui-btn-mail a[href^='mailto:'] (min 1) |  |

## Features without checks

- three.js WebGL background (GLTF models + draco decoder) on the fixed canvas (A) — interim · owner: decide whether to port the 3D scene as a block script with the models on the code bus (13 model fetches, draco from jsdelivr)
- lazily attached background videos on the case marquee and the about image (CR) — interim · owner: supply the video sources if the thumbnails should play
- locale variants en / ja (/ja/), hreflang (I18N) — done
- CloudFront asset host (favicon, icons) (T) — done
- chat / FAQ settings fetch (/_api/chatApi/json/*) (A) — decided-out
- Nuxt hydration state __NUXT__ (CR) — decided-out
