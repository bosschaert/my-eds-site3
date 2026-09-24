# Rollout report — balbriggan.ie/community-development/ → main--stardust-replica-fe635832--of1-labs (2026-09-23)

## Summary

| | |
|---|---|
| Pages | 2 of 2 verified (`/community-development` and the root `/`, which serves the same page by the run's contract); 0 failed, 0 pending, 0 stale |
| Templates | 1 — pillar-page (archetype `community-development`), gated on the published origin: 1440 pixel 2.47 % Δh 1 px · 360 pixel 4.40 % Δh 1 px · content-diff 0 structural · overflow ok · header/footer crops 2.55 % / 1.04 % @1440, 1.08 % / 1.21 % @360 |
| Blocks | 1 content block (`columns`, template-slotted, EW editable 6/6) + foundation blocks `header` and `footer`; foundation frozen and unchanged (19 files) |
| Quality | optimize health 90/100 (ai-search 80, cross-page 100); open P1 0 · P2 2 · P3 0; 2 findings accepted by design; dynamics replay 6/6 PASS; link audit 25/26 targets 200 (1 external vendor block), 0 localizable links left; served sitemap 2 = assembled 2; `/` 200 on aem.page and aem.live |
| Fonts | licensed Gotham → Montserrat 300/500/600 (inconsistency register R-01), brand family first in the stack |

## To deliver (owner)

1. **JSON-LD structured data** on both paths (2 × P2 `ai-search/jsonld`): the source carries a Yoast schema graph with organisation data; place the confirmed payload through `head.html` or the metadata pipeline. Not auto-fixable.
2. **Tags on the new host** (GTM container, GA4, Facebook pixel — interim tier, not loaded): decide which tags run and under which ids; the consent gate is already in place (no third-party request leaves the page).
3. **Licensed web font**: drop in Gotham under the site's licence to remove the substitute-face glyph residuals (header crop 2.55 % against a 2 % bar; 360 members-list bands 5.0–6.6 %).
4. **Scope**: the 18 navigation and footer targets outside this one-page run stay pointed at balbriggan.ie until those pages are migrated.
