# Dynamics parity check — https://main--b7aaf274--aemcoder.aem.live — 2026-10-06T13:05:55.031Z

Replayed 9 checks over 11 features · pass 9 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| client-rendered page (publication JSON → DOM) delivered as static EDS content | CR | done | dom-count | PASS | 10 × main h1, main h2, main h3 (min 10) |  |
| client-rendered page (publication JSON → DOM) delivered as static EDS content | CR | done | dom-count | PASS | 13 × main img (min 5) |  |
| "Copy link" buttons beside each h2/h3 (click copies the deep link and shows the toast) | CR | done | dom-count | PASS | 9 × main button.page-heading-anchor (min 9) |  |
| "Copy link" buttons beside each h2/h3 (click copies the deep link and shows the toast) | CR | done | dom-count | PASS | 9 × main button.page-heading-anchor .anchor-tooltip (min 9) |  |
| fixed "Made in Adobe Express" badge (register R-03, replicated as captured) | static | done | dom-count | PASS | 1 × .made-in-express .brand-btn (min 1) |  |
| fixed "Made in Adobe Express" badge (register R-03, replicated as captured) | static | done | dom-count | PASS | 1 × footer a[href*='new.express.adobe.com/webpage/template-picker'] (min 1) |  |
| adobe.com/go redirect links kept verbatim | I18N | done | dom-count | PASS | 1 × main a[href*='adobe.com/go/'] (min 1) |  |
| site root resolves to the page; no uncaught exceptions on the delivered pages | static | done | no-page-errors | PASS | none on 2 page(s) |  |
| site root resolves to the page; no uncaught exceptions on the delivered pages | static | done | dom-count | PASS | 1 × main h1 (min 1) |  |

## Features without checks

- Express publication, feature-flag, identity and edge APIs (A) — decided-out
- Express platform services (telemetry, branch deep links) (A) — decided-out
- Report Abuse dialog + form (CR/F) — decided-out
- runtime locale bundle + login mini-app (D) — decided-out
- Adobe Launch, analytics, New Relic, error monitoring (T) — decided-out · owner: add Adobe Launch to the project if the same reporting is wanted; EDS RUM is on by default
- IMS identity (X) — decided-out
