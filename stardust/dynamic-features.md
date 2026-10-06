# Dynamic features — garden-eight.com (home page only)

Curated from stardust/dynamics/dynamic-features.generated-plan.md (28 drafted rows, 2026-10-05T15:10Z).
Target probe: every first-party API path is host-bound (14/14 → 4xx on https://main--061e4e3f--aemcoder.aem.page).

## Listings contract
none — the home page carries no listing block; the three case links are authored content.

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | webgl-scene (merges a-first-party-api-get-assets-models-blender-* ×13, draco from cdn.jsdelivr.net) | three.js WebGL background: GLTF/GLB models (animals, devices, office, plants) + draco decoder, drawn on the fixed canvas `#js-back` | A | 1/1 | static-snapshot | needs-business-decision | decided (interim) | capture-state | hands-off: the canvas is replicated as captured — a static CSS paint of the sampled surface colour; the animated 3D scene is not re-implemented. Owner may later port the scene as a block script with the models on the code bus. | GET /assets/models/blender/**/*.gltf|.glb|.bin → 200; `#js-back` 1440×900 fixed |
| 2 | a-first-party-api-get-api-chatapi-json-faq-json + …-setting-json | chat / FAQ settings fetch (`/_api/chatApi/json/{faq,setting}.json`) feeding the `is-chat-loaded` chat widget | A | 1/1 | decided-out | host-bound | decided | off-origin-data | hands-off: no chat widget surface is visible in the captured page; the endpoint has no consumer on the migrated page. Owner may re-enable via a same-origin data snapshot later. | GET → 200 on source, host-bound on target |
| 3 | a-cms-app-settings-object-nuxt / cr-client-framework-nuxt | Nuxt hydration state `__NUXT__` | A/CR | 1/1 | decided-out | n/a | decided | framework | not a feature: the migrated page is static HTML served by EDS | `window.__NUXT__` |
| 4 | cr-client-rendered-slot-* (×10: s-wrapper, scroller, Ph, description, site-title, page-title, Pb, intro, St-wrap, mq) | content rendered/animated client-side: clipped line reveals (`.clip-y .t`), split headline words, case marquee | CR | 1/1 | rebuild-native | self | decided (implemented) | motion-observed | the settled text is authored verbatim; the behaviours that fired (clip-y line reveals, hr draw, editor fade, case-title reveal, marquee visibility) ship in the block code; motion-compare 4 parity / 0 extra | motion/index.json, motion/index-compare.json |
| 5 | i18n-locale-variants-en-ja-x-default | locale variants en / ja (/ja/), hreflang | I18N | 1/1 | static-snapshot | self | decided | locale | out of scope for this one-page run: the JA link stays a link to the source-equivalent path; hreflang emitted for en + x-default only, ja not migrated | `<link rel=alternate hreflang=ja href=/ja/>` |
| 6 | t-unknown-third-party-host-d1oo4riy5et4sg-cloudfront-net | CloudFront asset host (favicon, icons) | T | 1/1 | static-snapshot | self | decided | asset-rehost | favicon captured to stardust/current/assets/favicon.svg and self-hosted | /v3-1/assets/icon/favicon.svg |
| 7 | mail-copy (from captured DOM, not in the detector table) | "M : hello@garden-eight.com" copy-to-clipboard button (Copy to clipboard / Copied) | CR | 1/1 | client-only | self | decided (implemented) | inline-js | fired on click in motion-observe (label slides to "Copied", 0.7s) → implemented in the footer block | motion/index.json, `.ui-btn-mail` |
| 8 | case-thumb-videos (from captured DOM) | lazily attached background videos on the case marquee and the about image (`.js-bg-video-inview`) | CR | 1/1 | static-snapshot | needs-asset | decided (interim) | capture-state | empty in the settled capture (no `<video>` attached); replicated as captured. Owner may supply the video sources. | `.thumb.bg-img .img .b` empty |

## Decision batch
- Owner: confirm or replace the WebGL background (row 1) and the case/about videos (row 8); confirm the TWK Lausanne licence for the new origin (stardust/eds-conversion-log.md).
- Owner: whether the chat/FAQ widget (row 2) is wanted on the migrated site; if so, snapshot `/_api/chatApi/json/*` to a same-origin JSON.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| chat / FAQ settings fetch | no consumer on the migrated page; host-bound on the target | The migrated home page ships without the chat widget; `/_api/chatApi/json/*` is not proxied. |
| Nuxt hydration state | framework artefact | The migrated page is static EDS HTML; no `__NUXT__` payload exists. |
