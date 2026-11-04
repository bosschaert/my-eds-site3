<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-28T14:44:15.898Z · input stardust/current/_dynamics.json (1 pages, 9 findings) · target probe https://main--755b9b33--aemcoder.aem.live -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-mpc-prod-25-s6uit34pua-wl-a-run-a | A | unknown third-party host mpc-prod-25-s6uit34pua-wl.a.run.app | 1/1 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-cms-app-settings-object-wp | A | CMS / app settings object wp | 1/1 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 1/1 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 4 | f-form-gform-1-origin-5-fields | F | form "gform_1" → origin / (5 fields) | 1/1 | rebuild-native | block | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 5 | m-modal-trigger-aria-haspopup-chrome-only-a-content | M | modal trigger aria-haspopup (chrome only) → a:content | 1/1 (reach 4/1) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 6 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 7 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 8 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 9 | t-unknown-third-party-host-www-facebook-com | T | unknown third-party host www.facebook.com | 1/1 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 3 row(s) — read-settings, chrome-interaction.
- **One owner decision batch:** 6 row(s) — inspect the XHR, add a vendor row · production endpoint; interim capture ships now · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.

## Phases

- **tags** — 4
- **detect** — 3
- **forms** — 1
- **interactive** — 1
