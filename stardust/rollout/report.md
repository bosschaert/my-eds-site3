# Rollout report — www.niravmanubhai.com → aem-eds (2026-09-28)

```
rollout — www.niravmanubhai.com → aem-eds
==================================================
Pages       1 total · 1 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   1 (index: 1/1 delivered — the home page is the site root)
Blocks      7 total · 7 converted · 0 pending
            hero, host-note, story-feature, bouquet-feature, departure (template-slotted);
            rooms-doors, conversation-doors (reconstructive); header + footer as foundation blocks
Quality     health 95/100 · open P1 0 / P2 1 / P3 0
            P2 seo/served-sitemap — out-of-scope, owner action (see below)
            jsonld fixed at runtime (verified on the origin: 1 ld+json script, 3 nodes)
To deliver  none
Content     0 pages awaiting content track
```

Preview origin: https://main--fdc3c10d--aemcoder.aem.page/ (publish decision: preview-only; the source root serves its page, no redirects).

## Fidelity (published-origin gate, pub4 = pub5)

| width | pixel diff | height Δ | content-diff | overflow | header / footer crops |
|---|---|---|---|---|---|
| 1440 | 0.00 % | 0 | 0 structural | ok | 100 % / 100 % |
| 360 | 0.63 % | 0 | 0 structural | ok | 100 % / 100 % |

Motion: 6 behaviours observed on the live page, 6 at parity on the build (card hover confirmed by direct probe).
Residuals: footer Δy +41 on an unscrolled 1440 load (the live books image is bistable; parity in the stitched capture);
the title tag `<span>` → `<p>` (pipeline markup).

## Dynamic parity (from stardust/qa/dynamics-report.md, replayed on the origin at E-full-site: 5/5 PASS)

| feature | class | reach | status | owner decision | replayed check |
|---|---|---|---|---|---|
| dataLayer settings object (Google tag) | A | page | done | — | no-page-errors PASS |
| hreflang alternates en / x-default | I18N | page | done | — | dom-count PASS (2 alternates) |
| Google Analytics 4 tag (G-00QDEH6N5W) via gtag.js | T | page | interim (shipped disabled, consent-gated) | confirm the GA4 property for the new host | consent-gate PASS |
| Cloudflare Web Analytics beacon | T | page | interim (disabled) | keep, replace or drop on the new host | consent-gate PASS |
| gtag loader (same tag as row 3) | T | page | interim | same decision as row 3 | — |
| 1×1 iframe injected at runtime | V | page | decided-out | — | — |
| no forms, search, modals or players (source parity) | A | page | done | — | no-page-errors PASS |

## Owner actions

1. **Sitemap / index** — `/sitemap.xml` and `/query-index.json` answer 404 on the preview origin: no index is configured and the
   config service refuses the migration token. Configure the index at tools.aem.live (or provide an admin-scoped token).
2. **Analytics** — GA4 `G-00QDEH6N5W` and the Cloudflare beacon are carried over but disabled in `scripts/site-config.js` until you confirm
   they should run on the new host.
3. **Publish** — the page is on the preview origin only; publishing to the live origin is a separate decision.
4. **Scope debt** — 17 links point at the source host (the other pages of the site were not in this run's scope; see `stardust/direction.md`).
5. **Social link checks** — facebook.com (400) and linkedin.com (999) refuse automated fetches; the URLs are identical to the source page's.

## What's missing

pending: none · stale: none · failed: none · content-pending: none.
