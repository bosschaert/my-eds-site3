# Rollout report — https://www.niravmanubhai.com/ → main--9552f862--aemcoder (2026-10-12)

Flow: replica (same design, bounded-single provenance). Publish decision: publish.

## Summary

| | |
|---|---|
| Pages | 1 total · 1 verified · 0 failed · 0 pending (`/` ← https://www.niravmanubhai.com/) |
| Templates | 1 (`landing` — archetype `index`, 0 siblings) |
| Blocks | 9 converted / 9 (hero, host, story-nursery, doors, books, rooms-also, bouquet, conversation, departure) + header/footer chrome; `/nav`, `/footer` published noindex |
| Quality | published-origin gate 1440 1.41 % Δh −1 · 360 0.63 % Δh 0 · clip 0 · content MISSING/HIDDEN 0 · chrome-parity 0 deltas · interaction parity 6/0/0 · dynamics 4/4 PASS · optimize health 100/100, open P1 0 · P2 0 · P3 0 (1 accepted: jsonld, source parity) |
| Site | served sitemap 1 url = assembled 1 · `/` 200 on preview and live · robots default · no redirects (single page) |
| Links | 27 unique targets, 0 404s; 17 out-of-scope targets kept on the source origin (scope-extension decision, `stardust/direction.md`) |
| To deliver | nothing in scope outstanding |

## Owner decisions outstanding
- Tags on the new host (GTM/gtag `G-00QDEH6N5W`, Cloudflare Web Analytics) — off until the property id and consent requirement are confirmed (`stardust/dynamic-features-plan.md`).
- Structured data (JSON-LD) — the source has none; a later content pass may add WebSite/Person schema.
- Production domain mapping lifts the `noindex` the aem.live preview origin carries by default.

## Scope debt
17 internal targets linked from `/`, `/nav`, `/footer` are outside this one-page run and remain on the source
origin: /axiom-stories /come-sit-just-ask /contact /follow /house-specials /kabir-vaidya /license /my-books
/my-study /now /patrons /privacy /quiet-signal /sitemap /stills /story-bouquet /story-nursery.

Sources: `stardust/rollout/rollout.json` (lastRun), `stardust/rollout/optimize/scorecard.json`,
`stardust/replica/gates/all-{1440,360}/summary.json`, `stardust/qa/dynamics-report.md`.
