# Rollout report — www.example.com → main--f4c8728b--aemcoder (2026-10-08)

## Summary
- **Pages:** 1 of 1 delivered — 1 verified · 0 deployed-only · 0 pending · 0 stale · 0 failed. Live on https://main--f4c8728b--aemcoder.aem.live/ (preview https://main--f4c8728b--aemcoder.aem.page/). Publish decision: publish (recorded in `stardust/eds-conversion-log.md`).
- **Templates:** 1 (`static`, archetype `index`); 0 siblings.
- **Blocks:** 1 distinct (`notice`, template-slotted, EW round-trip exit 0) — 1 verified. Foundation: 16 frozen files; 1 change request applied at C-final (runtime link `title` dropped).
- **Quality:** published-origin gate index 1440 0.08% / 360 0.28% pixel, Δh 0, clipped 0, presence 0/0 (archetype rows 0.00% / 0.00%); optimize health 100/100 (seo 100, ai 100), open P1/P2/P3 0 / 0 / 0, 2 source-parity P2 informational (no JSON-LD, no meta description — the source has neither); dynamics surface empty, parity 0/0 pass; sitemap served 1 = assembled 1; links 1 external (200), 0 internal; verify 1/1 (h1 rule accepted by decision `no-h1`).
- **To deliver:** nothing outstanding. Decisions carried: `no-h1` (source renders no heading), `chrome-fetch-404` (header/footer keep the `/nav`, `/footer` convention; neither exists on this chrome-less site), color-scheme captured light (`captureState`).

## Evidence
- Unit ledger `stardust/rollout/progress.json`; gates `stardust/replica/gates/all-{1440,360}/summary.json`, `index-{1440,360}/*-pub3.txt`; coverage `stardust/rollout/coverage/`; optimize `stardust/rollout/optimize/scorecard.json`; dynamics `stardust/qa/dynamics-report.md`; site `stardust/rollout/site/manifest.json`.
