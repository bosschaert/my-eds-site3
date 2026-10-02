# Dynamics parity check — https://main--22880d22--aemcoder.aem.live — 2026-09-28T12:18:00.493Z

Replayed 8 checks over 7 features · pass 8 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| Newsletter sign-up form (Gravity Forms gform_1) | F | interim | dom-count | PASS | 5 × form.gform-newsletter [name="input_1"], form.gform-newsletter [name="input_2"], form.gform-newsletter [name="input_3"], form.gform-newsletter [name="input_4.1"], form.gform-newsletter input[type="submit"] (min 5) |  |
| Newsletter sign-up form (Gravity Forms gform_1) | F | interim | dom-count | PASS | 3 × form.gform-newsletter [aria-required="true"] (min 3) |  |
| Primary navigation dropdowns (4 aria-haspopup menu items) | M | done | dom-count | PASS | 4 × header a.dropdown-toggle[aria-haspopup="true"] (min 4) |  |
| Primary navigation dropdowns (4 aria-haspopup menu items) | M | done | no-page-errors | PASS | none on 1 page(s) |  |
| Hero background video (autoplay loop muted, Vimeo-hosted mp4) | V | done | dom-count | PASS | 1 × video.vimeo-hero[autoplay][muted][loop][playsinline] source[type="video/mp4"][src*="player.vimeo.com/external/625598732"] (min 1) |  |
| Google Tag Manager container | T | interim | consent-gate | PASS | no request to 4 gated host pattern(s) before consent |  |
| Google Analytics / Ads beacon | T | interim | consent-gate | PASS | no request to 3 gated host pattern(s) before consent |  |
| Facebook pixel | T | interim | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |

## Features without checks

- dataLayer global (GTM data layer) (A) — interim · owner: same batch as the tag container
