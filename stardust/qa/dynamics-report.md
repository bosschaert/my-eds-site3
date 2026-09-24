# Dynamics parity check — https://main--stardust-replica-d32c145a--of1-labs.aem.page — 2026-09-24T12:29:07.921Z

Replayed 12 checks over 11 features · pass 12 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| Hero fade slideshow (9 slides, autoplay 7 s, dot pagination, ring counter, per-slide title + link) | C | done | dom-count | PASS | 9 × .carousel .splide-slide (min 9) | fonts.gstatic.com:200×31 |
| Hero fade slideshow (9 slides, autoplay 7 s, dot pagination, ring counter, per-slide title + link) | C | done | dom-count | PASS | 9 × .carousel .splide-pagination-page[aria-label] (min 9) | fonts.gstatic.com:200×31 |
| Hero fade slideshow (9 slides, autoplay 7 s, dot pagination, ring counter, per-slide title + link) | C | done | dom-count | PASS | 1 × .carousel .splide-slide.is-active (min 1) | fonts.gstatic.com:200×31 |
| Hero fade slideshow (9 slides, autoplay 7 s, dot pagination, ring counter, per-slide title + link) | C | done | dom-count | PASS | 1 × .carousel .progress-ring-circle (min 1) | fonts.gstatic.com:200×31 |
| Hero fade slideshow (9 slides, autoplay 7 s, dot pagination, ring counter, per-slide title + link) | C | done | no-page-errors | PASS | none on 1 page(s) |  |
| Hamburger → full-screen drawer nav (aria-hidden toggle, line morph, WORKS accordion, Escape closes) | C | done | dom-count | PASS | 1 × header #nav-drawer[aria-hidden] (min 1) | fonts.gstatic.com:200×31 |
| Hamburger → full-screen drawer nav (aria-hidden toggle, line morph, WORKS accordion, Escape closes) | C | done | dom-count | PASS | 1 × header .c-hamburger button[aria-controls="nav-drawer"][aria-expanded] (min 1) | fonts.gstatic.com:200×31 |
| Hamburger → full-screen drawer nav (aria-hidden toggle, line morph, WORKS accordion, Escape closes) | C | done | dom-count | PASS | 1 × header .drawer-menu > ul > li[aria-expanded] (min 1) | fonts.gstatic.com:200×31 |
| WORKS hover submenu (desktop header); WORKS accordion in the mobile front-nav | C | done | dom-count | PASS | 3 × header .nav-sections > ul > li > ul > li (min 3) | fonts.gstatic.com:200×31 |
| WORKS hover submenu (desktop header); WORKS accordion in the mobile front-nav | C | done | dom-count | PASS | 1 × .front-nav li[aria-expanded] (min 1) | fonts.gstatic.com:200×31 |
| JOURNAL latest-3 listing | L | done | dom-count | PASS | 3 × .cards .journal-item (min 3) | fonts.gstatic.com:200×31 |
| Google Tag Manager container GTM-TT59JCD4 (+ gtag GT-WFFLQB7N); fires GA/Ads hits, DoubleClick pixel, dataLayer (rows 6, 7, 10) | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 3 gated host pattern(s) before consent | fonts.gstatic.com:200×31 |

## Features without checks

- Google Analytics / Ads hits (T) — scaffolded-awaiting-owner · owner: covered by t-tag-manager-google-tag-manager (fired by GTM)
- DoubleClick retargeting pixel (T) — scaffolded-awaiting-owner · owner: covered by t-tag-manager-google-tag-manager (fired by GTM)
- dataLayer global (A) — scaffolded-awaiting-owner · owner: covered by t-tag-manager-google-tag-manager (created by the GTM snippet)
- reCAPTCHA v3 badge (Contact Form 7) (F) — decided-out
- WordPress wp settings object (A) — decided-out
- 0×0 runtime iframe (GTM / reCAPTCHA helper) (V) — decided-out
