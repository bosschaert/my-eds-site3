# Dynamics parity check — https://main--755b9b33--aemcoder.aem.live — 2026-10-28T15:27:09.715Z

Replayed 5 checks over 8 features · pass 5 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| header dropdown menus + mobile toggler | M | done | dom-count | PASS | 4 × header [aria-haspopup] (min 4) |  |
| What's New carousel | M | done | dom-count | PASS | 11 × .news-carousel [class*=slide] (min 3) |  |
| town map pins with hover labels | M | done | dom-count | PASS | 24 × .town-map a, .town-map li (min 12) |  |
| newsletter form (first, last, email, GDPR consent) | F | interim | dom-count | PASS | 1 × form.newsletter-form input[type=email] (min 1) |  |
| no uncaught page errors | A | done | no-page-errors | PASS | none on 1 page(s) |  |

## Features without checks

- hero background video (Vimeo progressive MP4, autoplay muted loop) (V) — skipped-source-broken · environment limit: Vimeo external MP4 returns 403 to this network for both origins; a playback check would measure the vendor, not the build
- GTM + GA + Meta pixel (incl. the run.app event beacon) (T) — scaffolded-awaiting-owner · owner: which tags, container and property IDs go live on the new host
- WordPress wp / dataLayer bootstrap objects (A) — done
