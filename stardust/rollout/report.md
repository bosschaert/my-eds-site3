# Rollout report — Example Domain (https://www.example.com/) → aemcoder/c228fa32 main (2026-09-28)

## Summary

| Area | Result |
|---|---|
| Pages | 1 discovered · 1 selected · 1 migrated · 1 deployed (preview) · 1 verified · 0 failed · 0 pending |
| Templates | 1 (landing: `index`) — archetype gated at 0.00 % pixel diff, Δh 0, overflow 0 at 1440 and 360, on the published preview origin |
| Blocks | 0 distinct blocks (the page is default content: h1, p, p > a); 0 fragments (no header/footer on the source) |
| Quality | optimize health 100/100 · open P1 0 · P2 0 · P3 0 · 1 source-parity note (no JSON-LD, source has none) · ai-readability code 100 · content-diff 0 structural red · visual-diff 0 flags · dynamics 0/0 |
| To deliver | 0 pages. Owner items: publish decision (site is preview-only: https://main--c228fa32--aemcoder.aem.page/), sitemap configuration once published (the source serves no sitemap or robots.txt) |

## Delivered

| Page | Path | Preview | Gate 1440 | Gate 360 | Status |
|---|---|---|---|---|---|
| Example Domain | / | https://main--c228fa32--aemcoder.aem.page/ | 0.00 % / Δh 0 | 0.00 % / Δh 0 | verified |

## Foundation

`styles/styles.css` (source canon: 60vw column, 15vh offset, #eee canvas, system-ui, h1 1.5em, links #348, wrapper opacity .8, chrome hidden), `styles/fonts.css` (no web fonts — system-ui), `content/index.html` (verbatim strings). Frozen: 16 files, 0 change requests.

## Residuals

- Served `/sitemap.xml` is 404 on the preview host: the platform indexes published documents and the run is preview-only; source parity (the source has none). Resolves on publish + site configuration.
- Local harness `qa-gate` reports "header/footer renders non-empty" as 2 fails on a chrome-less site (structural assert without an opt-out); the published-origin gate is the verdict.
