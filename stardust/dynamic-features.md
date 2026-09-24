# Dynamic features — sorra.jp (home page, bounded-single run)

Curated from `stardust/current/_dynamics.json` (detected 2026-09-24, 1/1 pages) and the crawl's reach roll-up, plus the interaction classes visible in the captured DOM (Splide, drawer, hover submenu). Every row has a disposition; the static recreation never waits on this table.

## Listings contract
none — the JOURNAL block on the home page is a fixed 3-card snapshot in this run (see L-01). When journal pages join the migration it becomes index-backed: each journal post must emit `<meta name="category">`, `<meta name="tags">`, `<meta name="published">`, `<meta name="image">` and the home block reads `/journal/query-index.json` sorted by `published` desc, limit 3.

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | c-hero-slideshow | Hero fade slideshow (9 slides, autoplay, dot pagination, circular progress counter, per-slide title + link, 9 s zoom) | C client interaction | 1/1 | rebuild-native | self | planned (Phase 3 interaction parity) | block JS, no external data | none | index.html `#front-fv-splide` (Splide 4.1.4 fade) |
| 2 | c-mobile-drawer | Hamburger → full-screen drawer nav (aria-hidden toggle, line morph, WORKS category accordion) | C client interaction | 1/1 | rebuild-native | self | planned (Phase 3 interaction parity) | header block JS | none | `.c-hamburger`, `.l-drawer`, `.js-catToggleButton` |
| 3 | c-works-submenu | WORKS hover submenu in the desktop header; WORKS accordion in the mobile front-nav | C client interaction | 1/1 | rebuild-native | self | planned (Phase 3 interaction parity) | header/nav block CSS+JS | none | `.works-menu__container:hover .works-menu__categories` |
| 4 | l-listing-candidate-p-journal-list-3-cards | JOURNAL latest-3 listing | L listing | 1/1 | static-snapshot | self | done (content) | authored cards | none — unfreeze: when `/journal/*` migrates, switch to index-backed per Listings contract | `.p-journal__list` 3 cards |
| 5 | t-tag-manager-google-tag-manager | Google Tag Manager container GTM-TT59JCD4 (+ gtag GT-WFFLQB7N) | T tag / consent | 1/1 | embed-passthrough | owner | needs-decision | `scripts/delayed.js` loader | owner: confirm the GTM container id may load on the new origin; no CMP exists on the source | www.googletagmanager.com |
| 6 | t-analytics-google-analytics-ads | Google Analytics / Ads hits | T tag / consent | 1/1 | embed-passthrough | owner | needs-decision | fired by GTM (#5), nothing separate | covered by #5 | analytics.google.com |
| 7 | t-marketing-ad-retargeting-pixel | DoubleClick retargeting pixel | T tag / consent | 1/1 | embed-passthrough | owner | needs-decision | fired by GTM (#5) | covered by #5 | stats.g.doubleclick.net |
| 8 | f-form-protection-captcha-antibot | reCAPTCHA v3 badge script (Contact Form 7, site-wide) | F form | 1/1 | decided-out | n/a | decided | — | no form on the home page; contact page outside this run's scope | www.google.com/recaptcha |
| 9 | a-cms-app-settings-object-wp | WordPress `wp` settings object | A settings | 1/1 | decided-out | n/a | decided | — | WordPress runtime; no consumer on the migrated page | window.wp |
| 10 | a-cms-app-settings-object-datalayer | `dataLayer` global | A settings | 1/1 | embed-passthrough | owner | needs-decision | created by the GTM snippet (#5) | covered by #5 | window.dataLayer |
| 11 | v-iframe-without-src-runtime-injected-embed | 0×0 runtime iframe | V media | 1/1 | decided-out | n/a | decided | — | GTM / reCAPTCHA helper frame, not content | 0×0 iframe |

Dropped as noise: `i18n-locale-variants-qa-qa-qa-qa` — the detector matched the `/qa` (Q&A) path as a locale code; the site is single-language Japanese.

## Decision batch
To the site owner, one message: (a) may the Google Tag Manager container GTM-TT59JCD4 load on the new origin (rows 5–7, 10)? The source site has no consent manager; if one is wanted it is a new feature, not a replica item.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| reCAPTCHA v3 badge (Contact Form 7) | no form on this page; the contact page is not in this run | The home page ships without the reCAPTCHA script; it returns with the contact form page. |
| WordPress `wp` settings object | platform runtime with no consumer | Not present on Edge Delivery; nothing on the page reads it. |
| 0×0 runtime iframe | helper frame of GTM/reCAPTCHA | Appears only if GTM is enabled (row 5). |
