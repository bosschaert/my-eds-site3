<!-- stardust provenance: skill=stardust:replica (dynamics Phase 3 curation) · 2026-10-14 · from stardust/dynamics/dynamic-features.generated-plan.md (22 rows) -->
# Dynamic features — skerriesmills.ie (home page only)

Hands-off run: every owner decision ships the interim tier and is named in the decision batch; nothing is `decided-out`.

## Listings contract

Attractions (6 cards), Tickets (6 cards), Latest Events (3), Latest News (3) and the testimonials (7 slides) are
**document-first**: the item text is authored as rows in the page document (the settled DOM snapshot), no index.
Interim tier = editorially curated static rows. Decision batch D-2 asks whether events/news should later be fed
from an index once those sections migrate.

## Features

| id | class | feature | disposition | reproducibility | status | notes |
|---|---|---|---|---|---|---|
| booking | A/T | FareHarbor booking (fareharbor.com, otel-hfo.fareharbor.engineering, marketing.fareharbor.com, fh-kit.com buttons CSS) | embed-passthrough | self | planned | Book Now CTAs keep their fareharbor.com/embeds/book/skerriesmills/… hrefs verbatim (open the booking page). The lightframe overlay script (`fareharbor.com/embeds/api/v1/?autolightframe=yes`) is a delayed-load passthrough — decision D-1. |
| cart-iframe | V | FareHarbor cart iframe (runtime-injected) | embed-passthrough | self | planned | Injected by the lightframe script; arrives with it (D-1). Not authored. |
| consent | A | Complianz consent banner + /wp-json/complianz/v1/banner (host-bound on target) | static-snapshot | needs-business-decision | interim | WordPress endpoint does not exist on EDS. Martech scaffolded off (no tags fire → no consent needed). Decision D-3. |
| tags | T | Google Tag Manager GTM-5579WLK2, GA4 G-K1BCT8CCR0, RUM/error monitoring, cloudfront pixel | embed-passthrough | needs-business-decision | interim | Not loaded on the new host until the owner names the tags (D-3). EDS RUM is built in. |
| settings | A | dataLayer settings object | static-snapshot | self | n/a | Only feeds GTM; nothing to migrate beyond D-3. |
| carousels | CR | Attractions Swiper (arrows) + testimonials Swiper (bullets, autoheight) | static-snapshot | self | planned | Settled DOM recreated; scroll-track driver per recreation-procedure § Interaction parity. |
| reveal | CR | `.js-show-on-scroll` / `.js-show-on-scroll-img` IntersectionObserver fade-ins | static-snapshot | self | planned | Shared motion layer reusing the live class names (gate symmetry). |
| client-slots | CR | remaining client-rendered slots (intro row, cpt cards, tickets band) | static-snapshot | self | planned | Settled DOM — content present in the capture, nothing blank. |

## Decision batch (owner)

- **D-1 Booking overlay:** load FareHarbor's lightframe script on the new site (Book Now opens as an overlay, as today) — interim: script loaded delayed, links work with or without it.
- **D-2 Events/news feeds:** keep curated rows or feed from an index after those sections migrate — interim: curated rows.
- **D-3 Tags + consent:** which tags (GTM-5579WLK2 / GA4) run on the new host and with which consent tool — interim: none loaded.

## Register

No design deltas arise from this triage (inconsistency register stays empty).
