# Dynamics parity check — https://main--c151e704--aemcoder.aem.live — 2026-10-01T16:02:27.103Z

Replayed 6 checks over 7 features · pass 6 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| Project grid: 96 server-rendered items positioned client-side (shortest-column masonry) | CR | done | dom-count | PASS | 96 × .project-grid a.project (min 96) |  |
| Project grid: 96 server-rendered items positioned client-side (shortest-column masonry) | CR | done | dom-count | PASS | 96 × .project-grid a.project.positioned (min 96) |  |
| Project grid: 96 server-rendered items positioned client-side (shortest-column masonry) | CR | done | no-page-errors | PASS | none on 1 page(s) |  |
| Mobile "Menu" link toggles the mobile nav (≤750px) | I | done | dom-count | PASS | 1 × #mobileMenuLink a (min 1) |  |
| Mobile "Menu" link toggles the mobile nav (≤750px) | I | done | dom-count | PASS | 5 × #mobileNav #topNav li a (min 5) |  |
| Squarespace platform hosts | T | decided-out | consent-gate | PASS | no request to 5 gated host pattern(s) before consent |  |

## Features without checks

- Newsletter signup form (email + Sign Up) (F) — skipped-source-broken · owner: Choose a newsletter provider/endpoint for the new host; the footer block then posts the email to it.
- Squarespace census beacon POST /api/census/RecordHit (A) — decided-out
- Squarespace form-render telemetry POST /api/census/form-render (A) — decided-out
- Root feature-detect classes (CR) — decided-out
