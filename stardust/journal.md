# Journal — current-design.jp replica

## Extract — single-page capture of the home page (2026-10-13)

- `crawl.mjs --max 1 --dynamics` (headless, no bot protection): `index` captured, HTTP 200, 9 headings, 12 images, fullPage screenshot 1440×7971.
- Site is a STUDIO.design build (assets on storage.googleapis.com/production-os-assets). No same-site data endpoints, no search form, no hydration flags.
- Bounded entry: no PRODUCT/DESIGN synthesis (bounded-single branch in preserve-direction). state.json written: 1 page, type `home`, flow `replica`, handsOff.

## Preserve-direction — bounded-single spec synthesized, register R-01 (2026-10-13)

- Bounded branch: PRODUCT.md / DESIGN.md / DESIGN.json synthesized from pages/index.json + the CSS lift (stardust/replica/lift/tokens.json; inline STUDIO styles extracted to stardust/current/css/inline.css; computed styles of 242 element classes at 1440/360 in stardust/replica/lift/live-*.tsv).
- cap-probe: containerMaxWidth 1280 (module ×6), shell fluid, probeWidth 2560.
- Register: R-01 (applied) — TypeSquare 秀英角ゴシック金 is domain-licensed; Noto Sans JP self-hosted behind the brand name. No other deltas.
- Dynamics: 21 detector rows triaged in stardust/dynamic-features.md — menu overlay rebuilt natively; tags + font licence are owner decisions with interim tiers; no forms/search/APIs.
- Assets harvested: 27 images (stardust/current/assets/media/manifest.json), Noto Sans JP + Montserrat slices, Material Icons, FA brands.

## Recreate — home archetype gated at 1440 and 360 (2026-10-13)

- Prototype `stardust/prototypes/index-proposed.html` + `canon.css` (tokens, fonts, chrome, buttons, interactions) + `index.css` + `index.js`; clean semantic sections, every value from the STUDIO CSS lift / computed styles; photos as cover backgrounds (mirrors the source's granularity — content-diff counts imgs).
- Iterations: iter1 11.9%/20.0% → iter2 (palt-tracking compensation for R-01, bgimg granularity) → iter3 regression (`.bgimg` cascade order) → iter4 9.96%/9.62%, height Δ0 both. Masked hero (rotating carousel): 2.76% @1440, 3.90% @360.
- content-diff 0 structural 🔴 (header/main/footer), clip 0, overflow ok, cap-probe PASS (1280 ×6), gate-all prototype rows PASS both widths.
- Interaction parity: motion-observe live vs build — 12 parity / 0 missing at 1440, 5 / 0 at 360. Residuals in progress.json.

## Source-fidelity-gate — index passes all criteria at 1440/360 (2026-10-13)

- Final round (`final`): 1440 Δh 0, 10.00% raw / 2.76% with the hero-carousel mask; 360 Δh 0, 9.53% raw / 3.90% masked. content-diff 0 structural red, clip 0, overflow ok; cap-probe PASS; prototype-stage gate-all rows PASS (masks sidecar in gates/prototypes-<w>/masks.json).

## Plan — migrate scope is the single approved archetype (2026-10-13)

- 1 page in scope: `index` (home), Path A (approved, gated 1440/360 in replica progress.json). No siblings; dynamic-features.md present.

## Render — index placed into the migrated tree (2026-10-13)

- `migrate.mjs render index` → `stardust/migrated/index.html` (6 sections, assets bundled). 36 internal links target pages outside the one-page scope; rollout E2 repoints them to the source host. State advanced to `migrated`.

## Assets — bundled with the page (2026-10-13)

- Fonts, media and canon CSS bundled under `stardust/migrated/assets/`; editorial images go to DA media at deploy.

## State-and-report — 1 page migrated, 0 refused (2026-10-13)

- migrate summary: index migrated (Path A). Next: rollout A–I.

## A-inventory — 1 page, 1 template (2026-10-13)

- `inventory.mjs` over the migrated tree: index (home) pending. DA target aemcoder/032a8915@main, live host main--032a8915--aemcoder.aem.live.

## B-block — 9 distinct blocks, representative index (2026-10-13)

- modules: header, hero, news-list, about, service-cards, works, company, contact-band, footer. Fragments header/footer (contact-band rides the footer fragment, as on the source where it sits outside main). plan.json: index converts all 7 module blocks.

## B2-dynamic — triage re-confirmed against the target origin (2026-10-13)

- `dynamics-plan.mjs --target-origin main--032a8915--aemcoder.aem.page --migrated`: 21 rows, 0 host-bound first-party APIs, 3 already delivered by the capture. Curated dynamic-features.md unchanged: menu overlay rebuilt natively (header), tags off pending owner decision D1, font substitute per R-01/D2.

## C-deliver — home page live and gated on the published origin (2026-10-13)

- foundation: styles, fonts, header (nav + 10-link menu dialog), footer (contact band + site footer) live; /nav, /footer published; frozen (148 files).
- archetype-home: 6 blocks (hero, news-list, about, service-cards, works, company), content /index published; gate-all 1440 2.8% / 360 3.9% (hero carousel mask), Δh 0, clip 0, content missing 0; crop header 0.00% / footer 1.22%.
- cluster-home: no siblings. gate-all roster: 1/1 PASS both widths. final: freeze unchanged, 2 foundation requests reviewed, no edit.
- Header contract on aem.live: menu parity holds; one 🔴 left — the source logo link has no accessible name, so chrome-compare cannot pair its hover state by name (build logo has the same hover slide). Only a site-owner decision clears it.

## D-site — sitemap served 1 = assembled 1, root 200 (2026-10-13)

- `assemble.mjs --verify-origin https://main--032a8915--aemcoder.aem.live` exit 0 (1 url). `/` answers 200 on aem.page and aem.live (root `index` document). /nav and /footer published with robots noindex. No redirects.tsv was emitted (the delivered path equals the source path), so no redirects sheet rows are needed.

## D2-dynamic — parity 2/2 on the live origin (2026-10-13)

- parity.json: menu overlay (10 links in the dialog; open/close flow asserted by the header contract at 390) and hero carousel (4 slides). `dynamics-check.mjs --origin aem.live` 2/2 PASS. No listings/search/forms; tags stay off pending owner decision D1; font substitute per R-01/D2.

## E-full-site — index verified on aem.live (2026-10-13)

- `verify.mjs --base aem.live --all`: 1/1 verified (after the E2 repoint). Render check: hero rotates unpoked, footer marquee animating (restoreAtDelivery honoured); appear reveals shipped in the blocks.

## E2-link-audit — 16 out-of-scope targets repointed to the source host (2026-10-13)

- Scope-extension targets repointed (decision in stardust/direction.md); `localize-links --check` PASS; /index, /nav, /footer re-published (deploy-batch --force, 3/3 live). No 404 on any internal link.

## F-optimize — health 100, 0 open P1 (2026-10-13)

- `optimize.mjs --base aem.live --all`: P1 0 · P2 0 · P3 0; one source-parity note (no JSON-LD, as on the source), informational.

## G-aem — nothing to autofix (2026-10-13)

- `autofix-aem.mjs --dry-run`: no fixable findings (0 open).

## H-report — 1 page, 1 template, 9 blocks delivered (2026-10-13)

- Pages 1/1 verified (home, the site root). Template 1 (home). Blocks 9/9 (hero, news-list, about, service-cards, works, company + header, footer with the contact band). Quality: gate 1440 2.8% / 360 3.9% (hero mask), Δh 0; optimize health 100, P1 0. To deliver: none in scope; 16 out-of-scope paths repointed to the source (scope debt). Owner decisions open: D1 tags, D2 font licence, and the header-contract logo finding.

## I-dashboard — dashboard written (2026-10-13)

- `dashboard.mjs` → stardust/rollout/dashboard/index.html + data.json.

## Handoff — home page delivered, published and gated on aem.live (2026-10-13)

- migrate → rollout A–I complete for the single in-scope page; site root `/` serves it on aem.page and aem.live. Runner done-check: complete, no gaps.
- Open for the site owner (not run-blocking per the runner): header contract finding `control-missing@1440 link` — the source logo link has no accessible name, so the instrument cannot pair its hover state (the build implements the same twin-slide hover); clear it in stardust/chrome/header-decisions.json if accepted. Plus dynamics decisions D1 (tags) and D2 (font licence).
