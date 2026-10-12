<!-- stardust provenance: skill=stardust:dynamics · phase=triage (curated) · 2026-10-06 · re-verified at rollout B2 2026-10-06T10:50Z (dynamics-detect fresh run: same 9 findings, 0 new; dynamics-plan --migrated: v-video-youtube alreadyDelivered) · input stardust/current/_dynamics.json (2 pages, 9 detected findings) + stardust/current/_crawl-log.json dynamicSurface + source script.js · target probe https://main--bb2d4d27--aemcoder.aem.page -->
# Dynamic features — static-website.david-bosschaert.workers.dev

Source: a two-page static worker. No forms, no search, no first-party API, no
hydration, no framework, no consent manager, no site-level tags. One script
(`script.js`, 396 bytes) implements one behaviour: team tabs. One third-party
surface: a YouTube embed on the home page. Every third-party host the detector
listed is either a sub-request of that embed or an image CDN whose files
extract already downloaded.

## Listings contract

none — there are no listing blocks, no query index is needed (`helix-query.yaml` not required).

## Features

| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | v-video-youtube | YouTube embed (video b4Rr_7y068U) in a media-table cell | V media | home (1/2) | embed-passthrough | self | planned | media-as-url | none — player id is public; re-authored from the captured iframe src | `stardust/current/pages/index.json` iframe `https://www.youtube.com/embed/b4Rr_7y068U`; detector rows 1, 2, 6, 7, 8 (gstatic, jnn-pa.googleapis, doubleclick, google.com, yt3.ggpht) are the embed's own sub-requests and are merged here |
| 2 | c-team-tabs | Team tabs: 3 buttons toggle `.active` on `.tab-buttons button` and `.tab-content`; content fades in 0.4s | X interaction (client) | home + page1 (2/2) | client-only | self | planned | tabs | none | source `script.js` `showTabSection(idx)` (inline `onclick` on 3 buttons per page); `styles.css` L182–L212 (`.tab-content { display:none; animation: fadeIn 0.4s }`, `.active` flex). Missed by the detector (triggers 0) — added from the capture |
| 3 | m-remote-image-hosts | Remote images from randomuser.me, picsum.photos, fastly.picsum.photos (9 files) | M media | home + page1 (2/2) | static-snapshot | self | delivered | media-rehost | none — not tags; `<img src>` references | `stardust/current/assets/media/` (9 files, content-hashed by extract); detector rows 3, 4, 5 merged here |

Register (per-row notes):
- Row 1 ships as the `media-cells` block (`video` variant): the authored YouTube link in the first cell is turned into the iframe at decorate time (iframe passthrough, same src, same aspect). The ad pixel (`googleads.g.doubleclick.net/pagead/id`) fires from inside the YouTube iframe, not from the site; nothing to migrate or consent-gate at site level.
- Row 2 is implemented in the archetype as block JavaScript after motion-observe confirms the behaviour fired (replica Phase 4 interaction parity); the 0.4s fade is CSS, carried verbatim.
- Row 3: media is rehosted on the target (EDS media bus); no runtime dependency on the picture hosts remains.

## Decision batch

none — every row is reproducibility `self`; no owner decision is needed.

## Register (decided-out)

| feature | reason | production statement |
|---|---|---|
| — | no decided-out rows | — |
