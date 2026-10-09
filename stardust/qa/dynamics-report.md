# Dynamics parity check — https://main--bf989f9e--aemcoder.aem.live — 2026-10-07T20:42:50.734Z

Replayed 8 checks over 10 features · pass 8 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| HCP self-certification modal | M | done | dom-count | PASS | 2 × .selfcert-modal .selfcert-box .selfcert-actions a (min 2) |  |
| HCP self-certification modal | M | done | dom-count | PASS | 1 × .selfcert-modal .selfcert-overlay (min 1) |  |
| Kaltura player, click-to-play poster | V | done | video-plays | PASS | iframe/video: true · playback requests 31 (ok) | cdnapisec.kaltura.com:302×1 cdnapisec.kaltura.com:200×6 cfvod.kaltura.com:200×15 stats.kaltura.com:200×5 analytics.kaltura.com:200×4 :200×1 |
| RUM telemetry (rum.hlx.page) | T | done | no-page-errors | PASS | none on 10 page(s) |  |
| Tealium iQ + Adobe Target / Mouseflow / LinkedIn Insight | T | interim | consent-gate | PASS | no request to 5 gated host pattern(s) before consent |  |
| Cookie Reports consent banner | T | interim | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |
| header search box | F | interim | dom-count | PASS | 1 × header form.site-search-form input.site-search-input (min 1) |  |
| social-features favorite counter (socialFeaturesPost.json) | A | interim | dom-count | PASS | 1 × .social-features (min 1) |  |

## Features without checks

- Tealium data layer utag_data (A) — interim · owner: part of the tags decision: once Tealium runs on the new host the data layer ships with it
- DE / IT language switcher links (I18N) — decided-out · owner: whether the DE and IT trees migrate
- sign-in / account links (X) — decided-out
