# rollout — https://www.myastrazeneca.ch/ (fr, 10-page plan) → aem-eds

Origin: https://main--bf989f9e--aemcoder.aem.live · preview: https://main--bf989f9e--aemcoder.aem.page · report written 2026-10-07T21:42Z

```
rollout — www.myastrazeneca.ch → aem-eds
==================================================
Pages       10 total · 10 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   5 (fr-startseite 1/1 · therapy-area archetype 1/1 · program 3/3 · PATTRNS archetype 1/1 · article 4/4)
Blocks      15 total · 15 converted · 0 pending
Quality     health 100/100 · open P1 0 / P2 0 / P3 0 · source parity 16 (informational) · accepted 1 · out-of-scope 2
Pixel table prototypes 3/3 PASS at 1440, 3/3 delivered at 360 (2 PASS + 1 documented override) · deployed 10/10 delivered per width (pixel-only 10/10; 2 PASS + 8 documented units overrides) — gates/{prototypes,all}-{1440,360}/summary.md
To deliver  (none)
Content     0 pages awaiting content track
```

## Pages (published origin, both widths)

| page | pixel 1440 | pixel 360 | Δh 1440 / 360 | clipped | content missing | verdict 1440 / 360 |
|---|---|---|---|---|---|---|
| /fr/startseite | 0.48 % | 0.68 % | 0 / 0 | 0 / 0 | 0 / 0 | delivered (override: therapy-card unit 3 heading box 5px narrower (Roboto Slab su) / delivered (override: therapy-card unit 3 heading box 5px narrower (Roboto Slab su) |
| /fr/startseite/therapiegebiete/cvrm/chronischeniereninsuffizienz | 0.41 % | 0.73 % | 0 / 0 | 0 / 0 | 0 / 0 | PASS / PASS |
| /fr/startseite/therapiegebiete/cvrm/diabetes | 0.38 % | 1.14 % | 0 / 0 | 0 / 0 | 0 / 0 | PASS / PASS |
| /fr/startseite/therapiegebiete/cvrm/herzinsuffizienz | 0.48 % | 0.58 % | 0 / 0 | 0 / 0 | 0 / 0 | delivered (override: Diagnostic band reference marker paired with the wrong serve) / delivered (override: Diagnostic band reference marker paired with the wrong serve) |
| /fr/startseite/therapiegebiete/cvrm/see-the-pattrns/home | 0.47 % | 1.51 % | 0 / 0 | 0 / 0 | 0 / 0 | delivered (override: sub-nav labels 5–6px narrower (Roboto Slab substitute for th) / delivered (override: sub-nav labels 5–6px narrower (Roboto Slab substitute for th) |
| /fr/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis | 0.64 % | 1.12 % | 0 / 0 | 0 / 0 | 0 / 0 | delivered (override: sub-nav labels 5–6px narrower (Roboto Slab substitute for th) / delivered (override: sub-nav labels 5–6px narrower (Roboto Slab substitute for th) |
| /fr/startseite/therapiegebiete/cvrm/see-the-pattrns/treatement | 1.07 % | 1.91 % | 0 / 0 | 0 / 0 | 0 / 0 | delivered (override: sub-nav labels 5–6px narrower (Roboto Slab substitute for th) / delivered (override: sub-nav labels 5–6px narrower (Roboto Slab substitute for th) |
| /fr/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes | 0.43 % | 4.16 % | 0 / 2 | 0 / 0 | 0 / 0 | delivered (override: sub-nav labels 5–6px narrower (Roboto Slab substitute for th) / delivered (override: sub-nav labels 5–6px narrower (Roboto Slab substitute for th) |
| /fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr | 0.72 % | 1.57 % | 0 / 0 | 0 / 0 | 0 / 0 | delivered (override: 3 sub-nav labels 5–6px narrower and the 360 scroller centred) / delivered (override: 3 sub-nav labels 5–6px narrower and the 360 scroller centred) |
| /fr/startseite/therapiegebiete/ri/lupus | 0.44 % | 0.49 % | 0 / 0 | 0 / 0 | 0 / 0 | delivered (override: Diagnostic heading box 10px narrower: the live heading carri) / delivered (override: Diagnostic heading box 10px narrower: the live heading carri) |

The per-page rows live in `stardust/replica/gates/all-1440/summary.md` and `all-360/summary.md`: pixel 0.38–1.07 % at 1440, 0.49–4.16 % at 360, Δh 0 on every page (symptomes 360 +2 px), clipped text 0, missing/hidden headings or links 0. `verify.mjs --all`: 10 verified, 0 failed. Link audit (E2): 69 distinct hrefs on the 12 published documents, 10 internal all 200 extensionless, 34 source-host targets outside the plan repointed to the source site, 25 external (`stardust/rollout/link-audit.md`).

## Templates

| template | pages | archetype | gate |
|---|---|---|---|
| Home (`fr-startseite`) | 1 | fr-startseite | prototype 0.00 % / 0.00 %; published 1440 + 360 delivered |
| Therapy-area archetype | 1 | herzinsuffizienz | prototype 0.00 % / 0.01 %; published delivered |
| Therapy-area siblings (`program`) | 3 | IRC, diabetes, lupus | sibling tier: content-count none, 1 variant class; published delivered |
| PATTRNS archetype | 1 | about-amylodosis-attr | prototype 0.00 % / 0.00 %; published delivered |
| PATTRNS siblings (`article`) | 4 | home, diagnosis, treatement, symptomes | sibling tier: content-count none, 2 variant classes; published delivered |

## Blocks (15, all verified on the published origin)

breadcrumb, hero, hidden-section, image-text-band, intro-media, references, social-features, split-teaser, tile-grid, vivo-stamp (home + therapy-area), cta-cards, questions-cta, selfcert-modal, sub-nav, video-poster (PATTRNS); plus the foundation header/footer/fragment. Block code frozen at C0 (`foundation-freeze.json`, 21 files, clean at C-final).

## Dynamic surface — parity replay on the published origin (D2, 8/8 PASS)

| feature | class | status | check | result | owner decision |
|---|---|---|---|---|---|
| HCP self-certification modal | M | done | dom-count ×2 | PASS | rebuilt from the live modal copy on the 5 PATTRNS pages; interim client-side cookie |
| Kaltura player, click-to-play poster | V | done | video-plays | PASS | playback requests reach cdnapisec/cfvod.kaltura.com |
| RUM telemetry (rum.hlx.page) | T | done | no-page-errors | PASS | platform default |
| Tealium iQ + Adobe Target / Mouseflow / LinkedIn Insight | T | interim | consent-gate | PASS | no gated host called before consent; tags decision with the owner |
| Cookie Reports consent banner | T | interim | consent-gate | PASS | no gated host called before consent |
| header search box | F | interim | dom-count | PASS | form present; search backend is host-bound (owner) |
| social-features favorite counter (socialFeaturesPost.json) | A | interim | dom-count | PASS | API 404 on the target → static interim |
| Tealium data layer utag_data | A | interim | — | not checked | ships with the Tealium decision |
| DE / IT language switcher links | I18N | decided-out | — | — | DE/IT trees are out of the 10-page plan; links repointed to the source |
| sign-in / account links | X | decided-out | — | — | login is host-bound; repointed to the source |

Full table: `stardust/qa/dynamics-report.md`; dispositions: `stardust/dynamic-features.md`, `stardust/dynamic-features-plan.md`.

## Quality (F-optimize, scorecard run-2)

- Open: P1 0 · P2 0 · P3 0; health 100/100 (seo 100, ai-search 100, cross-page 100; a11y not assessed by the baseline detectors).
- Source parity, informational (the source carries the same): no JSON-LD on any of the 10 pages; 2 long titles (home 76 chars, lupus 82 chars); 2 broken links the source itself carries (`…/onkologie/leberkrebs.html` 404 on the source; the nav's two `enhertu.ch/.html` hrefs as captured).
- Accepted (owner decision): 4 PATTRNS pages share a pipeline-derived meta description because the source pages have none and the content documents set none; authoring 4 new descriptions would be fabricated content.
- Autofix (G): 0 candidates, nothing re-deployed.

## What's missing / handed to the owner

- **Scope debt (direction.md decisions):** the German root shell at `/` (redirected to `/fr/startseite`), 34 link targets outside the 10-page plan (therapy-area and product landing pages, DE/EN/IT roots, contact, login, 2 PDFs) repointed to the source site.
- **Foundation requests (`foundation-requests.md`):** the licensed Lexia woff for the new domain — Roboto Slab substitutes render 26 px uppercase titles ~1 % narrower (two PATTRNS wrap deltas, the documented 360 residual). Never rehosted by the migration.
- **Dynamic interim rows:** Tealium/consent tags, search backend, social-features API, HCP cookie persistence.
- Nothing pending, stale or failed in the coverage ledger.
