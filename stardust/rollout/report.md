# Rollout report — https://sorra.jp/ → AEM Edge Delivery (replica, bounded single page)

Written 2026-09-24T12:30Z by stardust:rollout H-report from `stardust/rollout/rollout.json.lastRun`,
`stardust/rollout/optimize/scorecard.json`, `stardust/replica/progress.json`, `stardust/dynamics/parity.json`.

```
rollout — sorra.jp → aem-eds
==================================================
Pages       1 total · 1 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale
Templates   1 (home: 1/1 delivered)
Blocks      3 total · 3 converted · 0 pending   (carousel, front-nav, cards) + chrome header/footer
Quality     health 100/100 · open P1 0 / P2 0 / P3 0   (seo 100 · ai-search 100; a11y/xpage not assessed)
To deliver  none
Content     0 pages awaiting content track
```

## Delivery
- Root: https://main--stardust-replica-d32c145a--of1-labs.aem.page/ → 200 (the source root serves a page, so `/index` is the root document; no redirects sheet). Preview only — publish to live is the owner's call.
- Chrome: `/nav` and `/footer` previewed; header block renders the logo as the page's only `<h1>` (h1 > a > img alt SORRA), as the source does.
- Site assets staged: `stardust/rollout/site/sitemap.xml` (1 url), `robots.txt`, `manifest.json`.

## Fidelity (published-origin gate, live https://sorra.jp/ vs preview, round pub6)
| width | pixel diff | height Δ | content-diff structural | chrome-parity |
|---|---|---|---|---|
| 1440 | 0.98 % (bar 10 %) | 0 px | 0 🔴 (22 rows) | 24 deltas, unchanged since pub5 (icon signature / media renames) |
| 360 | 1.74 % (bar 10 %) | 0 px | 0 🔴 (22 rows) | 18 deltas, unchanged since pub5 |

Archetype gate (harness, Phase 4): 1440 0.11 % · 360 0.92 %; motion-compare 12 parity / 0 missing / 0 extra @1440.
Inconsistency register: R-01 (autoplay tick suppressed off-screen), R-02 (zoom hook) — no design deltas.

## Dynamic surface (`stardust/qa/dynamics-report.md`, re-run after G-aem)
12 checks over 11 features · 12 pass · 0 fail. Rebuild-native: hero slideshow (9 slides, autoplay 7 s, dots, ring),
mobile drawer (aria-hidden toggle, Escape), WORKS hover submenu + accordions. Static snapshot: JOURNAL latest-3
(unfreeze to index-backed when `/journal/*` migrates). Decided-out: reCAPTCHA (no form on page), WordPress `wp`, 0×0 helper iframe.

## Owner decisions outstanding
1. Google Tag Manager container GTM-TT59JCD4 (GA/Ads hits, DoubleClick pixel, dataLayer): may it load on the new origin?
   Until confirmed the page ships without tags (`consent-gate` check: no request to the three tag hosts).
2. Publish to live (`aem.live`): every deploy in this run was preview-only.

## Link audit (E2)
22 internal paths (38 hrefs in page/nav/footer) target pages outside this run's one-page scope → repointed to
https://sorra.jp/<path> (scope extension, decision recorded in `stardust/direction.md`). 24/24 targets GET 200.
When sibling pages join a later run, `localize-links.mjs` turns them back into root-relative links as each ships.

## Findings ledger (`stardust/rollout/optimize/findings.json`)
- f-da4ee99ebd seo/single-h1 — accepted: fixed in the rendered DOM (header h1); the raw-HTML detector cannot see the fragment-injected header.
- f-54be5a397f ai-search/jsonld — wontfix: the source has no JSON-LD; adding it is a new feature, not a replica item.
