<!-- stardust provenance: skill=stardust:dynamics (via stardust:replica Phase 2) · curated 2026-10-28 · from stardust/dynamics/dynamic-features.generated-plan.md -->
# Dynamic features — balbriggan.ie home page (curated)

Scope: one page (`/`). Source: `stardust/current/_dynamics.json` (9 findings). Hands-off run: owner decisions ship the
interim tier and are named in the decision batch; nothing is `decided-out`.

## Listings contract

None. The "What's New" carousel shows four news cards rendered server-side by WordPress at capture time; on the new
site they are authored rows (document-first) — no index feed in this one-page scope.

## Features

| # | id | class | feature | disposition | target | reproducibility | status | notes |
|---|---|---|---|---|---|---|---|---|
| 1 | t-beacon-mpc-a-run-app | T | POST `mpc-prod-…a.run.app/events` (tracking beacon fired by the tag stack) | embed-passthrough | embed | needs-business-decision | pending | merged into the tag decision (row 6); not reproduced by the page itself |
| 2 | a-cms-app-settings-object-wp | A | WordPress `wp` settings object (i18n/a11y bootstrapping) | static-snapshot | content | self | done | no visible effect; nothing to carry — the page's content is captured verbatim |
| 3 | a-cms-app-settings-object-datalayer | A | `dataLayer` (GTM) | static-snapshot | content | self | done | belongs to the tag stack (row 6) |
| 4 | f-form-gform-1 | F | Newsletter form (Gravity Forms `gform_1`: first name, last name, email, GDPR consent; posts to the WordPress origin) | rebuild-native | block | needs-backend | interim | UI rebuilt verbatim; submission target named in the decision batch (D1). Personal data (name + email) → no silent capture on the new host |
| 5 | m-chrome-dropdowns | M | Header dropdown menus (4 `aria-haspopup` toggles) + mobile toggler | rebuild-native | runtime | self | in-progress | implemented in the header (click to open, same as Bootstrap); header contract is the spec |
| 6 | t-tags | T | Google Tag Manager + Google Analytics + Meta pixel (`connect.facebook.net`, `www.facebook.com`) | embed-passthrough | embed | needs-business-decision | interim | scaffolded off on the new host until the owner names which tags and property ids run there (D2) |
| 7 | v-hero-video | V | Hero background video (Vimeo progressive MP4, `autoplay muted loop playsinline`, blue multiply overlay) | rebuild-native | block | self | in-progress | delivered as the same external MP4 source; capture freezes it (captureState) |
| 8 | s-news-carousel | M | "What's New" slick carousel (3 per view, arrows, dots, infinite) | rebuild-native | block | self | in-progress | block JS, no clones |
| 9 | s-map-hover | M | Town map pins: labels slide in on hover, pins scale in on load | rebuild-native | block | self | in-progress | CSS only |

## Decision batch (owner)

- **D1 — newsletter submissions.** Where should sign-ups go on the new site (the current WordPress Gravity Forms
  endpoint, a mailing-list provider, or an AEM form sheet)? Interim: the form posts to the existing endpoint on
  balbriggan.ie exactly as today.
- **D2 — tags.** Which of Google Tag Manager / Google Analytics / Meta pixel should run on the new host, with which ids?
  Interim: none load on the new host.

## Register

No inconsistency-register entry is needed for any row above (no design delta).
