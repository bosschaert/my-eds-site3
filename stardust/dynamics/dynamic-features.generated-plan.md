<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-06T10:49:28.245Z · input stardust/current/_dynamics.json (2 pages, 9 findings) · target probe https://main--bb2d4d27--aemcoder.aem.page · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-www-gstatic-com | A | unknown third-party host www.gstatic.com | 1/2 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-jnn-pa-googleapis-com | A | unknown third-party host jnn-pa.googleapis.com | 1/2 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | t-unknown-third-party-host-randomuser-me | T | unknown third-party host randomuser.me | 2/2 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 4 | t-unknown-third-party-host-picsum-photos | T | unknown third-party host picsum.photos | 1/2 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 5 | t-unknown-third-party-host-fastly-picsum-photos | T | unknown third-party host fastly.picsum.photos | 1/2 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 6 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 1/2 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 7 | t-unknown-third-party-host-www-google-com | T | unknown third-party host www.google.com | 1/2 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 8 | t-unknown-third-party-host-yt3-ggpht-com | T | unknown third-party host yt3.ggpht.com | 1/2 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 9 | v-video-youtube | V | video: YouTube | 1/2 | embed-passthrough | self | delivered-by-capture | media-as-url | none (player ids are public) | output already carries "www.youtube.com" |

## Triage

- **Ships autonomously (reproducibility `self`):** 0 row(s) — none.
- **One owner decision batch:** 8 row(s) — inspect the XHR, add a vendor row · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 1 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.

## Phases

- **tags** — 6
- **detect** — 2
- **media** — 1
