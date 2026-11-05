<!-- stardust provenance: skill=stardust:replica (dynamics Phases 1–3) · 2026-11-05 · curated from stardust/dynamics/dynamic-features.generated-plan.md + stardust/current/_dynamics.json -->
# Dynamic features — static-website.david-bosschaert.workers.dev

## Listings contract
none — the single page carries no listing blocks.

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | m-team-tabs | Team tabs (Alpha / Beta / Gamma) switched by inline `onclick` → `showTabSection(i)` toggling `.active` on button + panel, 0.4s fadeIn | M | 1/1 | rebuild-native | block (`tabs`, authored rows per tab) | self | planned | tabs | — | `stardust/current/assets/css/script.js`, `.tab-buttons button[onclick]` |
| 2 | v-native-video | Two first-party `<video controls playsinline preload=metadata>` players (`/vids/rec_1.mp4`, `/vids/rec-2.mp4`) | V | 1/1 | rebuild-native | block (`video-gallery`, authored mp4 links) | self | planned | native-video | — | `figure.video-gallery video` |
| 3 | t-unknown-third-party-host-randomuser-me | randomuser.me — classified from the response bodies: team portrait JPEGs (content images), not a tag | T→content | 1/1 | static-snapshot | content (rehosted to the media bus) | self | planned | — | — | 6 × `randomuser.me/api/portraits/*.jpg`, 200 image/jpeg; reason: images are page content; unfreeze: n/a |
| 4 | martech | Analytics / tags / consent carry-over (owner request) | T | 0/1 | embed-passthrough | runtime (`scripts/martech.js`, all parts disabled) | needs-business-decision | scaffolded-awaiting-owner | consent-gated-tags | owner enables parts in `stardust/martech-contract.json` | spec-martech on `/` and `/page1`: no CMP, no Launch, no tag manager, no data layer |

## Decision batch
- **Martech (row 4):** the source loads no analytics, tag manager or consent manager. The contract is scaffolded empty and disabled; if the owner adds tags later they go into `stardust/martech-contract.json` and `martech-scaffold.mjs` is re-run. Hands-off assumption: ship disabled.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | — | — |
