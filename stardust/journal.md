# Stardust journal — niravmanubhai.com replica

## Extract — bounded single-page capture of the home page (2026-09-28)

- Flow: replica (hands-off). Scope fixed by `stardust/.labs/site-plan.json`: one page, `/` → slug `index`.
- `crawl.mjs --max 1 --dynamics` captured the page headless in 11 s: HTTP 200, waitMode medium (2500 ms),
  10 headings, 37 body strings, 42 CTAs, 11 real images, no CSS backgrounds, no forms/modals/videos/iframes.
  Full-page screenshot 1440×7403 (`assets/screenshots/index.png`), rendered DOM `pages/index.html`.
- The site sits behind Cloudflare but served real content; the only dynamic endpoints are the
  Cloudflare challenge beacon, Cloudflare RUM and Google Analytics — no data-driven surface.
- Fonts: Google Fonts (Playfair Display, Inter, Rasa) — open faces, same public source usable.
  12 first-party stylesheets (`assets/house-*.css`, `series-common`, `home-books`) to lift from in Phase 3.
- Bounded run: no PRODUCT.md / DESIGN.md / DESIGN.json synthesis — Phase 2 takes the bounded promotion branch.
- Observation for recreation: a blank framed box sits under the welcome copy in the capture (likely a
  hover/scroll-revealed or lazy image) — capture-state policy applies: replicate as captured, verify at gate.

## Preserve direction — bounded promotion, empty register, dynamics triaged (2026-09-28)

- No `current/PRODUCT.md`/`DESIGN.md`/`DESIGN.json` on the bounded entry → synthesized root `PRODUCT.md`,
  `DESIGN.md`, `DESIGN.json` with provenance `bounded-single` from `pages/index.json` + the CSS lift.
- CSS lift: 12 first-party sheets + 4 inline `<style>` blocks assembled in cascade order
  (`stardust/replica/lift/cascade.css`, 143 KB); computed styles for 89 selectors at 1440 and 360 via
  `measure.mjs` (`lift/computed-{1440,360}.tsv`); tokens in `lift/tokens.json`. Root 16px; display Playfair Display,
  body Inter, Gujarati Rasa; `.wrap` 74rem / 7vw gutters; `.split` .86fr/1.14fr collapsing ≤ 820px; `.btn` 44px outline.
- Live overflow baseline: scrollWidth 1425 @1440 and 345 @360 (headless scrollbar), overflowX 0 on both.
- `stardust/direction.md` written (preserve mode, bounded-single, hands-off activation, named assumptions).
- Inconsistency register: empty — pure replica.
- Dynamics: detector found 6 findings, all tag/meta artefacts (GA4 gtag, Cloudflare Insights, hreflang en/x-default,
  a 1×1 loader iframe, dataLayer). No forms, search, modals, players or data endpoints. Curated into
  `stardust/dynamic-features.md` + `-plan.md`: tags ship as interim tier (disabled, owner decision named),
  hreflang rebuilt natively, iframe decided-out.

## Recreate — home archetype authored and self-measured at Δ0 (2026-09-28)

- One authoring subagent, briefed by file pointers, wrote `stardust/prototypes/index-proposed.html` (191 lines),
  `canon.css` (156) and `index.css` (148): clean semantic HTML, every string/href/alt verbatim from the rendered DOM,
  role parity (sr-only h1, hidden `#departure-heading`, `.r24-short`/`.r24-long` variants), values lifted from the
  cascade-ordered source CSS and the computed tables; universal border-box reset lifted (source has one).
- 19/19 images harvested to `stardust/current/assets/media/` with the live `srcset`/`sizes`; fonts from the same
  Google Fonts link. `stardust/prototypes/current` symlinks `../current` so the http.server resolves media.
- `measure.mjs --against` at 1440 and 360: Δx/Δy/Δw/Δh 0 and props equal on all 23 selectors; root scrollWidth /
  scrollHeight Δ0 at both widths (one round-1 fork — `.departure p` line-height — fixed from the source).
- Replicated as captured: `.host-img` blank framed box; `nav.nav` display:none; drawer off-canvas; the live 1px fixed
  dark top line. No scrolled-state header class in the source → no JS.
- Served at http://localhost:8791/index-proposed.html (PID in `stardust/.work/http-8791.pid`). Gate rounds next.

## Source-fidelity gate — home archetype passes at 1440 and 360 (2026-09-28)

- 1440: iter1 --full 1.27% / Δh 41 / hot band 1500–2000 (host portrait unpainted on the build, books image lazy height,
  back-to-top button absent when scrolled) → iter2 0.00% Δ0 → iter3 --full: content-diff none, visual-diff advisory only,
  chrome-parity footer Δy +41 (live unscrolled lazy state; crops 100%) → iter4 0.00% Δ0 after motion scripts.
- 360: iter1 --full 0.07% Δ0, content none, chrome ✓, crops header 100% / footer 99.99% → iter2 0.07% Δ0.
- Overflow assert ok at both widths (build scrollWidth = viewport). Visual-diff STRETCHED IMAGE flags justified: the
  source uses object-fit: cover on those frames; measure.mjs shows props equal.
- Interaction parity observed, not inferred: drawer open/close, back-to-top show, progress bar fill implemented with the
  live numbers; header scroll-morph and button hovers dead on live → not implemented. motion-compare 4 parity, 0 extra.
- Approved hands-off (state.json index → approved). Prototype served on :8791 during the gate; residuals in progress.json.

## Migrate plan — one template, one page, no siblings (2026-09-28)

- Page map: index → `/` → `stardust/migrated/index.html`, 0 collisions. Template `home`, archetype `index`, tier archetype.
- Units in `stardust/migrate/progress.json`: `plan` (done), `home` (render: index), `report`. No `assets` unit — editorial
  images are rehosted through the DA media uploader inside C-deliver; migrate.mjs only bundles them locally.
- Deploy and rollout script sets copied to `stardust/scripts/deploy/` and `stardust/scripts/rollout/` (Phase 5 copy step).

## Migrate render — home archetype placed at the site root (2026-09-28)

- `migrate.mjs render index`: branch A (archetype), `/` → `stardust/migrated/index.html`, 21 assets bundled, 7 sections, 0 refused.
- 37 internal links to 17 sibling pages (`/my-books`, `/story-nursery`, …) are `not-in-inventory`: they are outside this run's
  one-page scope (scope extension, E2 rule) and will be repointed to the source site at delivery, never left as 404s.
- Sidecar: modules[] recorded (hero, host-note, story-feature, rooms-doors, bouquet-feature, conversation-doors, departure);
  gate-evidence.mjs filled pixel-gate-1440 0.00%/Δ0, pixel-gate-360 0.07%/Δ0, content-count none, delivery-lint 0P0·0P1·1P2;
  content-fidelity declared from the gate's content-diff (findings none). media-reconcile waits for the delivered content file.

## Migrate state-and-report — index advanced to migrated (2026-09-28)

- `state.mjs advance index --to migrated`; summary: 1 page, archetype tier, gates 5 (media-reconcile follows the delivered file).
- Units plan / home / report all `done` in `stardust/migrate/progress.json`. Rollout begins with A-inventory.

## Rollout A-inventory — one page, one template (2026-09-28)

- `inventory.mjs`: 1 page (index → `/`), 1 template (index), 7 modules; `rollout.json` site filled: DA org `aemcoder`,
  site `fdc3c10d`, ref `main`, live host `main--fdc3c10d--aemcoder.aem.live`.

## Rollout B-block — 7 distinct blocks, one conversion each (2026-09-28)

- `blocks.mjs`: 7 module blocks (hero, host-note, story-feature, rooms-doors, bouquet-feature, conversation-doors, departure),
  0 chrome/fragment entries (header + footer are the foundation unit). `plan.mjs`: one representative page (index), all 7 convert
  there. Decode tiers at C-deliver: template-slotted for the fixed compositions, reconstructive for the door/card repeat groups.

## Rollout B2-dynamic — inventory re-verified, nothing blocks delivery (2026-09-28)

- Fresh `dynamics-detect` on the live page: 6 findings, ids identical to Phase 2; `dynamics-plan --target-origin` host-bound 0/0.
- Dispositions unchanged: 2 decided (settings object, hreflang), 1 decided-out (1×1 tag frame), 3 interim (GA4 / gtag /
  Cloudflare Insights — owner decision, shipped disabled). No forms, search, modals, players or listings.

## Rollout C-deliver — foundation and home page authored; publishing blocked on the DA token (2026-09-28)

- Scripts copied: `stardust/scripts/deploy/`, `stardust/scripts/rollout/`. C-deliver started 09:47Z with units foundation / home / final.
- C0 foundation (one subagent): runtime contract, `styles/styles.css` + `fonts.css` from canon.css, 5 self-hosted woff2 (Inter,
  Playfair Display normal+italic, Rasa latin+gujarati; Roboto removed), captured favicon, template-slotted header (sticky bar,
  drawer, reading-progress bar, back-to-top with the measured motion) and footer, `content/nav.html` + `content/footer.html`
  (sibling links absolute to the source site). block-roundtrip --ew 0/0 (EW 10/10), lint pass. Frozen: 22 files.
- C1 home (one subagent): 7 blocks — hero, host-note, story-feature, bouquet-feature, departure template-slotted; rooms-doors,
  conversation-doors reconstructive — and `content/index.html` (12 editorial images as content.da.live/…/media/home/ URLs,
  manifest `stardust/deploy/media-manifest-home.json`). Whole-page roundtrip 72/72 editable, qa-gate pass, delivery-lint
  0 P0/P1, davids 0 red, content-diff 0 red, lint pass, foundation unchanged.
- No DA token anywhere the pipeline looks (no `.env`, no `DA_TOKEN`, no `~/.aem/da-token.json`); obtaining one needs an
  interactive login. Media upload, PUT → preview of nav/footer/index and the published-origin gates are the remaining C-deliver
  work; resume commands are in `stardust/rollout/progress.json` `units.home.resume`. Nothing pixel-shaped was run on the harness.

## Rollout C-deliver — home page live on the preview origin, gates pass at 1440 and 360 (2026-09-28)

- Resumed with the token available as a file (`ADOBE_IMS_TOKEN_FILE`, never read or copied): 12 images uploaded to `media/home/`,
  media-reconcile 12 hosted, `deploy-batch --no-publish` previewed /nav, /footer, /index; the site root resolves to the home page.
- Published round pub1 (1440): 3.64 %, Δh −6, chrome-parity 28. Every fix came off an instrument: crop → the rooms-doors block
  letterboxed card 04 by image ratio while the live page marks card 02 by class (authored config word `poster`, @ew-exempt);
  measure/anchor → the bouquet lede, conversation heading and ledes wrapped differently → font-probe: Google Fonts serves
  browser-specific builds of Inter and Playfair Display (one heading string 802 vs 811 px) and the self-hosted @fontsource copy
  matched only one → the live page's own Google Fonts URL (head link + fonts.css import, eager at every width); chrome-parity →
  drawer and overlay hosted after `<header>` as on the live DOM, skip link dropped, footer ground on the element.
- Published round pub1 (360): stitched build 7400 px vs live 7792 px while the loaded page measured 7792 px on both sides —
  the pipeline's `<picture>` wrapper sizes to its content, so lazy images below the fold had a 0-px box before load
  (`.visual picture { display:block; width:100% }` in bouquet-feature and conversation-doors).
- Final: 1440 pub4 **0.00 %** Δh 0; 360 pub4 **0.63 %** Δh 0; content-diff 0 structural at both; overflow ok; header/footer crops
  100 %/100 % at both widths; motion 6 parity (+ the card hover confirmed by direct probe). Residuals: footer Δy +41 on an
  unscrolled 1440 load (the live books image is bistable; parity in the stitched capture) and the title tag `<span>`→`<p>`.
- Foundation requests 1–5 applied once at C-final, refrozen (17 files); units foundation / home / final recorded `done`.
  Publish decision unchanged: preview-only.

## Rollout D-site — root answers, chrome noindexed, served sitemap unavailable (2026-09-28)

- The source root serves its page (200, no Location chain), so the home page stays the root `index` document and no redirects
  sheet is written (no `stardust/redirects.tsv`: one page, no moved paths). `curl -sIL` on the preview root ends in 200.
- `/nav` and `/footer` gained a `Robots | noindex` metadata row inside their last section (delivery-lint clean, type fragment),
  were re-PUT and re-previewed with `deploy-batch --force --no-publish` (2 ok); the served pages carry
  `<meta name="robots" content="noindex">`, and `nav.plain.html` is unchanged (the pipeline strips the block).
- `assemble.mjs` wrote `site/{sitemap.xml,robots.txt,manifest.json}`: 1 expected url; the fragments list is empty because
  header/footer are foundation blocks, not rows of `coverage/blocks.json` (script shape, not a gap — the noindex rows are on the documents).
- `assemble.mjs --verify-origin` against the preview origin (publish decision unchanged: preview-only) exits 1: `/sitemap.xml`
  and `/query-index.json` answer 404 — the site has no index configured, and the config service answers 401 to the migration
  token, so it cannot be added from this run. Recorded as P2 `served-sitemap` (seo, out-of-scope) for the owner; decisions in
  `direction.md § Site assembly decisions`.

## Rollout D2-dynamic — interim tags shipped disabled, hreflang emitted, parity replayed (2026-09-28)

- The plan's two build items had not shipped: no site-config entry for the GA4 id and no `hreflang` alternates on the served
  page. Added `scripts/site-config.js` (`analytics.googleTagId` G-00QDEH6N5W, `enabled: false`), a `consented.js` that loads
  gtag only when enabled AND consented (the boilerplate consent hook imports it on consent), and `decorateAlternates()` in the
  lazy phase of `scripts/scripts.js` (en + x-default on the canonical URL). eslint clean; foundation requests 6–7 recorded and
  the foundation refrozen (18 files, same path set).
- `stardust/dynamics/parity.json`: 7 rows, 5 checks (no-page-errors ×2, dom-count, consent-gate ×2). Replay on the preview origin
  (`stardust/qa/dynamics-report.md`): 4 PASS, 1 FAIL — the hreflang dom-count reads 0 because the new code is not on the origin
  until the checkpoint is pushed. Verified instead on the preview page with the local `scripts/*.js` intercepted in: 2 alternates
  on the canonical, 0 tag requests, 0 page errors; enabled path (`enabled: true` + `?consent=accept`) → one
  `googletagmanager.com/gtag/js` request, dataLayer 4. Re-run the on-origin replay at E-full-site.
- The local `aem up` harness served an Adobe sign-in page instead of the site (proxy login), so its replay was discarded and the
  server stopped; the interception probe lives under `stardust/.work/rollout/probes/`.
- Owner decisions unchanged and named in the parity rows: GA4 on the new host (rows 3–4), Cloudflare Insights not carried (row 5).

## Rollout E-full-site — one page verified, dynamics 5/5 on the origin, pixel unchanged after the code push (2026-09-28)

- `verify.mjs --all --base https://main--fdc3c10d--aemcoder.aem.page`: checked 1 · 1 verified · 0 failed (reachable, no
  `about:error`, internal hrefs resolve); coverage row `index` → verified, `rollout.json.lastRun` verifyFailures 0.
- The D2 code (site config, consented.js, `decorateAlternates()`) reached the preview origin with the checkpoint push;
  `dynamics-check` re-run on the origin: 5/5 PASS — hreflang dom-count 2, no tag requests, no page errors. Parity row 2 → done.
- Render check after the script change: pixel rounds pub5 on the preview origin — 1440 **0.00 %** Δh 0 (18 px), 360 **0.63 %**
  Δh 0 — identical to the pub4 numbers; overflow ok at both widths.

## Rollout E2-link-audit — 23 targets fetched, 21 × 200, two social hosts refuse bots, scope debt named (2026-09-28)

- Authored vs served href sets match on all three documents (index 18, nav 13, footer 7 unique hrefs). Internal links: `/` only.
- 17 source-host absolutes are SCOPE EXTENSION (the scope is fixed to one page): kept pointing at www.niravmanubhai.com, all 200,
  listed as scope debt in `direction.md § Link-audit decisions`. `localize-links --check` PASS (0 still localizable).
- External: substack, wa.me, whatsapp, instagram 200; facebook 400 / linkedin 999 are bot refusals (same URLs as the source).
  No 404 anywhere. Evidence: `stardust/.work/rollout/probes/e2-hrefs-status.txt`.

## Rollout F-optimize — gate passes, health 90, two P2 findings (2026-09-28)

- `optimize.mjs --all --base <preview> --current stardust/current`: health 90/100 (seo 90 · ai 90; a11y and cross-page not
  assessed by the deterministic layers on one page). Open: P1 0 · P2 2 · P3 0; source parity 0. ✓ GATE — no open P1.
- P2 `ai-search/jsonld` [index] — no JSON-LD structured data (platform-migration: G-aem autofix candidate, only if the source
  carries it — replica adds nothing the source lacks). P2 `seo/served-sitemap` [site] — out-of-scope (index config, owner).

## Rollout G-aem — JSON-LD carried from the source, applied by hand after the dry run (2026-09-28)

- `autofix-aem.mjs --project . --dry-run`: candidates 1 · applied 0 · manual 1 (`eds-jsonld`: place via head.html / metadata).
- Source parity check first: the source page carries one schema.org graph (WebSite · Person · WebPage, 1098 chars), so adding it
  is fidelity, not an improvement. The graph is carried verbatim in `scripts/site-config.js` (`schema.graph`, eslint --fix for
  quoting); `decorateJsonLd()` in the lazy phase repoints `https://www.niravmanubhai.com` ids/urls to the canonical origin and sets
  `primaryImageOfPage.url` to the page's og:image (the source's `/assets/courtyard-cebb67.jpg` has no counterpart on the new host).
- Verified on the preview page with the local scripts intercepted in: 3 nodes (WebSite, Person, WebPage), ids on the canonical
  origin, WebPage name verbatim, image = og:image, alternates still 2, 0 tag requests, 0 page errors.
- Foundation request 8 recorded, refrozen (18 files). The on-origin re-run of verify + optimize (jsonld → fixed) opens H-report,
  after the checkpoint push lands the code.

## Rollout H-report — verify and optimize re-run on the origin, JSON-LD closed with rendered evidence, learnings written (2026-09-28)

- The G-aem push had landed (served `scripts/site-config.js` hash = local). `verify.mjs --all` on the origin: 1/1 verified, 0 failed.
- `optimize.mjs --all --base …` still reported `P2 ai-search/jsonld` open: the detector reads the fetched HTML, and the graph is
  emitted at runtime. Checked the rendered DOM on the origin (one Playwright page, 1440): 1 `ld+json` script, 3 nodes
  (WebSite, Person, WebPage), ids and urls on the canonical origin. Resolved `f-54be5a397f` as fixed with that note → health 95/100,
  open P1 0 · P2 1 (served-sitemap, out-of-scope) · P3 0. Later re-runs of optimize will re-open it until the detector renders (learning 1).
- Summary block, fidelity table, dynamic parity table and owner actions written to `stardust/rollout/report.md`.
- `stardust/learnings.md`: 8 entries, one failure class each — detector-gap (runtime JSON-LD), api-dependency (token probed late),
  capture-gap (Google Fonts builds vs self-hosted copies), silent-render (`<picture>` 0-px box before lazy load), index-empty
  (retired `helix-query.yaml` remedy vs config-service 401), false-warning (stitch-shot on `*-fallback` faces), sequencing
  (dynamics replay before the checkpoint push), false-finding (social hosts refusing bot GETs). All `status: pending`.
- Next: I-dashboard (`dashboard.mjs`), then `replica handoff end`.

## Rollout I-dashboard — dashboard generated, replica handoff closed (2026-09-28)

- `dashboard.mjs` → `stardust/rollout/dashboard/index.html` + `data.json`: 1 page at `optimised` (identified / prototyped / deployed
  cumulative 1), 1 template, 7/7 blocks, health 95/100, open P1 0 · P2 1 · P3 0. No external script; `stardust/` is in `.hlxignore`.
- `replica handoff end`: the home page is the site root on the preview origin (publish decision preview-only); the published-origin
  gate stands at 1440 0.00 % Δh 0 and 360 0.63 % Δh 0, content-diff 0 structural, overflow ok, motion 6/6.
- Owner actions are listed in `stardust/rollout/report.md` (site index / sitemap, analytics tags, publish, source-host links).
- The run is complete on the preview origin; nothing remains for a next session.
