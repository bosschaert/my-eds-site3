# Dynamic features — niravmanubhai.com (home page, single-page scope)

Source: `stardust/current/_dynamics.json` (1 page probed, 6 findings) · draft
`stardust/dynamics/dynamic-features.generated-plan.md` · contract `skills/dynamics/reference/triage.md`.

## Listings contract
none — no listing blocks, no search form, no query index needed on this page.

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-datalayer | `window.dataLayer` (GTM's own array) | A | 1/1 | static-snapshot | self | done — no consumer on the page; nothing to ship (reason: it is the tag manager's queue, not app settings; unfreeze: if tags are enabled, GTM recreates it) | read-settings | — | `_dynamics.json` globalState |
| 2 | i18n-locale-variants-en-x-default | hreflang alternates `en` + `x-default`, both → `/` | I18N | 1/1 | rebuild-native | self | done (D2-dynamic: scripts.js loadEager emits `en` + `x-default` alternates pointing at the page URL; replay dom-count 2/2) | locale-tree | none — single locale, self-referential | `index.html` head |
| 3 | t-tag-manager-google-tag-manager | Google Tag Manager / gtag `G-00QDEH6N5W` (+ GA4 collect, row 5 merged) | T | 1/1 | embed-passthrough | needs-business-decision | interim: scaffolded OFF on the new host (hands-off tier); decision named below | consent-gated-tags | owner: which tags run on the new host; property id | `www.googletagmanager.com`, `www.google-analytics.com/g/collect` |
| 4 | t-unknown-third-party-host-static-cloudflareinsights-com | Cloudflare Web Analytics beacon + Cloudflare bot-management `cdn-cgi/challenge-platform` (its hidden 1×1 iframe, row 6 merged) | T | 1/1 | embed-passthrough | needs-business-decision | interim: OFF — Cloudflare-edge features that do not exist on the aem.live origin; no visible surface | consent-gated-tags | owner: analytics vendor on the new host | `static.cloudflareinsights.com`, `/cdn-cgi/rum`, hidden `iframe[width=1][height=1]` |

Merged: row 5 (analytics: Google Analytics / Ads) into row 3 — same gtag script; row 6 (iframe without src, 1×1, `visibility:hidden`) into row 4 — the Cloudflare challenge-platform frame, not an embed.

## Decision batch
One message to the owner (interim tier ships regardless; nothing blocks the static page):
- **Tags on the new host.** The source loads Google Tag Manager/gtag `G-00QDEH6N5W` and Cloudflare Web Analytics. The migrated page ships with no tags (martech off). To carry them over, confirm the property id and whether a consent banner is required; then `dynamics-plan.mjs --martech` scaffolds the disabled routes.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none decided out (hands-off never writes decided-out) | — |

## B2 verification (2026-10-12, rollout pre-import gate)

Re-detected live (`dynamics-detect.mjs --from-state --reach`): 6 findings, identical to the Phase-2
set (dataLayer, hreflang, Cloudflare beacon + challenge iframe, GTM/gtag, GA4 collect) — no new rows.
`dynamics-plan.mjs --target-origin https://main--9552f862--aemcoder.aem.live --migrated stardust/migrated`:
host-bound 0/0 (no first-party API the page depends on), owner batch 4 (the tag rows, off), self 1.
Every row keeps its disposition above; the inventory is verified for delivery.

## D2-dynamic verification (2026-10-12)

`dynamics-check.mjs --origin https://main--9552f862--aemcoder.aem.live`: 4/4 PASS — hreflang dom-count 2, no page errors on `/`, no request to any GTM/GA host, no request to any Cloudflare Insights host (tags off pending the owner decision above). Report: `stardust/qa/dynamics-report.md`; rows: `stardust/dynamics/parity.json`.
