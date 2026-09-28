# rollout — https://balbriggan.ie/ → aem-eds (2026-09-28)

```
rollout — https://balbriggan.ie/ → aem-eds
==================================================
Pages       1 total · 1 verified · 0 deployed-unverified · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   1 (home: 1/1 delivered — index → /)
Blocks      6 total · 6 converted · 0 pending  (hero, news-carousel, explore-grid, map, downloads, newsletter; header/footer via the foundation)
Quality     health 90/100 · open P1 0 / P2 1 / P3 0 · source parity 0
To deliver  none — the one page in scope is live at / on main--22880d22--aemcoder.aem.page and .aem.live
Content     0 pages awaiting content track
```

## Delivery ledger

| Page | Path | Template | Published gate 1440 | Published gate 360 | Status |
|---|---|---|---|---|---|
| index (home) | `/` | home | 2.46 % pixel · Δh 2 px · 0 structural · overflow +1 px · header crop 2.61 % · footer crop 0.76 % | 3.82 % pixel · Δh 2 px · 0 structural · overflow +1 px · header crop 1.08 % · footer crop 1.99 % | verified on the live origin |

Gate rounds: prototype confirmation (1440 / 360), then the published origin `pub3 --full` after the
newsletter-form padding fix; content-diff 75 advisory lines, 0 🔴 on the main and chrome roots;
chrome-parity 10 text-metric PAIR deltas at 1440 (Montserrat substituted for the licensed Gotham the
source never loads), parity at 360. Interaction parity from observation: sticky nav, slick news
carousel, Bootstrap dropdowns / collapse implemented; dead classes recorded.

## Dynamic parity (from `stardust/qa/dynamics-report.md`, replayed on the live origin)

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| Newsletter sign-up form (Gravity Forms gform_1) | F | interim | dom-count | PASS | 5 × form.gform-newsletter [name="input_1"], form.gform-newsletter [name="input_2"], form.gform-newsletter [name="input_3"], form.gform-newsletter [name="input_4.1"], form.gform-newsletter input[type="submit"] (min 5) |  |
| Newsletter sign-up form (Gravity Forms gform_1) | F | interim | dom-count | PASS | 3 × form.gform-newsletter [aria-required="true"] (min 3) |  |
| Primary navigation dropdowns (4 aria-haspopup menu items) | M | done | dom-count | PASS | 4 × header a.dropdown-toggle[aria-haspopup="true"] (min 4) |  |
| Primary navigation dropdowns (4 aria-haspopup menu items) | M | done | no-page-errors | PASS | none on 1 page(s) |  |
| Hero background video (autoplay loop muted, Vimeo-hosted mp4) | V | done | dom-count | PASS | 1 × video.vimeo-hero[autoplay][muted][loop][playsinline] source[type="video/mp4"][src*="player.vimeo.com/external/625598732"] (min 1) |  |
| Google Tag Manager container | T | interim | consent-gate | PASS | no request to 4 gated host pattern(s) before consent |  |
| Google Analytics / Ads beacon | T | interim | consent-gate | PASS | no request to 3 gated host pattern(s) before consent |  |
| Facebook pixel | T | interim | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |

Without an automated check: dataLayer global (GTM data layer), class A — interim, owner decision in the
same batch as the tag container. Video playback itself is an environment limit shared with the source
(Vimeo 403/ORB from this network); markup and attributes verified.

Owner decisions open (recorded in `stardust/dynamic-features-plan.md`): the newsletter form endpoint
(interim: posts to the source handler) and the tag stack (GTM / GA / Facebook pixel; nothing loads
before consent on the new origin).

## Quality findings (`stardust/rollout/optimize/`)

| Severity | Check | Page | Fixability | Status |
|---|---|---|---|---|
| P2 | ai-search/jsonld — no JSON-LD structured data | index | platform-migration → manual | open; the source ships a WordPress SEO graph (Organization, BreadcrumbList, SearchAction …) whose entities name balbriggan.ie; a payload for the new origin is an owner decision, placed via `head.html` |

Accessibility, seo and cross-page layers detected nothing to score on the one page (reported null).

## Links (`stardust/rollout/link-audit.json`)

55 distinct hrefs on `/`, `/nav`, `/footer`: internal hrefs root-relative and extensionless; 26 source-site
paths (48 link occurrences) repointed to https://balbriggan.ie by the scope-extension decision
(`stardust/direction.md § Link audit`), all answering 200; 0 404s. External: Facebook answers 400 to
non-browser clients (verbatim URL), the Vimeo mp4 403 is the environment limit above.

## Follow-ups for the platform / owner

- Live-origin `/sitemap.xml` still lists `/nav` beside `/` (the served `/nav` carries `robots noindex`; the preview-origin sitemap is correct) — re-index follow-up, no page defect.
- Fonts: the source computes Gotham faces but declares no `@font-face` for them, so it renders fallbacks; the migration keeps the same stacks and Montserrat as the metric substitute. A licensed Gotham drop-in wins automatically (brand family first in the stack).
- Scope debt: the 26 source-site paths linked from the home page (list in `stardust/direction.md § Link audit`) for a later run.
- JSON-LD payload (P2 above); newsletter form endpoint; tag stack activation.
