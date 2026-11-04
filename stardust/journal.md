# Journal — niravmanubhai.com replica migration

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## Extract — single-page bounded capture of the home page (2026-09-23)

**Prompt:** `/stardust:replica --hands-off` migrating exactly one page, https://www.niravmanubhai.com/, as a same-design replica; Phase 1 via `extract --single --dynamics`, bounded promotion branch in Phase 2.

**Decisions:**
- Flow stamped `replica` (`flowSource: user-phrase`), `handsOff: true` in `stardust/state.json`; the state file was created by replica since the bounded crawl does not write it.
- Bounded entry: `crawl.mjs --pages / --max 1 --dynamics` only; no brand-surface synthesis (PRODUCT/DESIGN come from the Phase-2 bounded branch).
- Gate breakpoints: run.json says `desktop,mobile` → 1440 and 360 (the skill defaults).

**Artifacts touched:**
- stardust/current/pages/index.json, index.html — created (playwright, medium wait 2500 ms, HTTP 200, fullPage screenshot 1440×6206)
- stardust/current/assets/screenshots/index.png (+ index-thumb.png) — created
- stardust/current/assets/favicon.png, stardust/current/_crawl-log.json — created
- stardust/state.json — created (1 page `extracted`, slug `index`, type `home`)
- stardust/scripts/{replica,diff,stardust,migrate,extract}/ — project copies of the shipped scripts
- stardust/scripts/status-page.mjs, tools/replica/progress.html — status page generator + page

**Findings worth flagging:**
- Static hand-authored site: 9 same-origin stylesheets under /assets/, Google Fonts (Playfair Display, Inter, Rasa — open licences, self-hostable), a hamburger menu driven by /assets/nmh-navigation-foundation.js.
- 12 headings, 28 body paragraphs, 38 CTAs, 13 images, no CSS backgrounds, no video/iframe/modals captured. Three of the nine room cards render as parchment placeholders in the capture (lazy or missing images) — capture-state policy applies in Phase 3.
- Dynamic surface: GA4 collect (gtag) + Cloudflare RUM only; no forms, no search, no hydration. Third-party hosts: googletagmanager, cloudflareinsights.

**Open questions:** none

**Next:** Phase 2 preserve-direction on the bounded branch (needs the Phase-3 CSS lift for the synthesized DESIGN.json), then recreate `index`.

---
## Preserve-direction — bounded-single synthesis, empty register, dynamics triaged (2026-09-23)

**Prompt:** Phase 2 of `/stardust:replica --hands-off` on the bounded branch (no `current/PRODUCT.md` to promote).

**Decisions:**
- Synthesized `PRODUCT.md`, `DESIGN.md`, `DESIGN.json` at the project root with `mode: bounded-single` provenance, every value from `current/pages/index.json` or the CSS lift; `DESIGN.json` added to `.hlxignore` so it is not served.
- Inconsistency register written empty (pure replica) — no audit run, no user items.
- Dynamics Phases 1–3: 5 detected findings + 2 chrome interactions (drawer, page-in) curated into `stardust/dynamic-features.md`; every row has a disposition. Tags are embed-passthrough *interim* (not loaded on the preview host); hreflang decided-out.
- CSS lift done up front for both gate breakpoints (`measure.mjs` at 1440/360/1920, all-matches) so Phase 3 authors mobile from lifted rules, not by shrinking desktop.

**Artifacts touched:**
- PRODUCT.md, DESIGN.md, DESIGN.json — created (root, target spec)
- stardust/direction.md — created (preserve mode + hands-off assumptions)
- stardust/replica/inconsistency-register.md — created (empty)
- stardust/dynamic-features.md, stardust/dynamic-features-plan.md — created; stardust/dynamics/, stardust/current/_dynamics.json — generated drafts
- stardust/current/assets/css/ (10 sheets + inline + google-fonts + nmh-navigation-foundation-v142.css), assets/fonts/ (4 variable woff2 + manifest), assets/media/ (14 images + 8 responsive renditions + courtyard-mobile.webp), assets/js/ (4 scripts) — harvested
- stardust/replica/lift/{live-measure.json, live-1440.txt, live-360.txt, live-1920.txt, delta-1440-360.txt, tokens.json} — created
- stardust/scripts/replica/measure-dump.mjs, measure-delta.mjs — small read helpers over measure.mjs JSON
- stardust/state.json — direction stamped; index → directed

**Findings worth flagging:**
- Header/footer/drawer chrome is styled by `/assets/nmh-navigation-foundation-v142.css`, a tenth stylesheet (href precedes rel in the link tag).
- The legacy `<header>` element is empty but keeps `position:fixed; background:#4e5d44; border-bottom:1px; box-shadow` — a 1px green line with shadow at the top of every viewport. Replicate as captured.
- Live root uses `scrollbar-gutter: stable`: root scrollWidth is viewport − 15px at every width (1425 @1440, 345 @360). The prototype must carry the same rule or every box is 15px wide of the mark.
- Mobile hero swaps to `courtyard-mobile.webp` (1672×941) via `<picture><source media="(max-width:640px)">`, `object-fit: contain`, intrinsic height (194px at 360).
- Card grid: 3 → 2 (≤920) → 1 (≤600) via `house-stability.css` `!important` rules that override the inline-style flex rail.
- Fluid check 1440→1920: `.wrap` holds 1184px (74rem) while its 7vw padding grows; cards shrink accordingly. Encode the rules, not px.

**Open questions:** none

**Next:** Phase 3 recreate — author `stardust/prototypes/index-proposed.html` + CSS from the lift, serve on 8791, gate at 1440 and 360.

---

## Recreate + source-fidelity gate — home archetype authored and gated at 1440/360 (2026-09-23)

**Prompt:** Phase 3–4 of `/stardust:replica --hands-off`, resumed session 2 after preserve-direction.

**Decisions:**
- Authored `stardust/prototypes/index-proposed.html` as clean semantic HTML from `current/pages/index.json` + the captured DOM's element wrapping (role parity), with three CSS layers: `fonts.css` (self-hosted Google faces), `replica-canon.css` (tokens, base, chrome — shared layer for later archetypes), `index-proposed.css` (sections). Every value lifted from the source sheets with the cascade resolved by hand (`!important` ID rules in house-visual-hospitality beat house-frames on the conversation media; stability sheet's grid beats the inline flex rail).
- Two uncaptured sheets fetched (`house-a11y-v139.css`, `house-visual-continuity-v140.css`) — the 14px conversation-media radius lives in the latter.
- Legacy empty `<header>` replicated as `.nm-legacy-bar` (fixed 1px line + shadow); the hidden legacy `.nav` was not carried (display:none!important on live, no rendered role).
- Bounded JS (sanctioned): scroll-state chrome (progress bar width, back-to-top `.show` at 500px) and the drawer toggle — thresholds lifted from the site's own scripts.
- Chrome parity, crop-compare (100% header/footer at both widths), fluid check at 1920 and motion parity (7 parity / 0 missing / 0 extra) all recorded in `stardust/replica/progress.json`.

**Gate numbers (iter3, `--full`):** 1440 → 0.02% px, Δh 0, overflow 0, content 🔴 0, chrome ✓ · 360 → 0.05% px, Δh 0, overflow 0, content 🔴 0, chrome ✓. iter1 was 1.61% / Δ33 and 3.45% / Δ37.

**Findings worth flagging:**
- **Font fork, two layers.** (1) Declaring the variable faces with weight RANGES (`300 600`) instead of Google's per-weight single-value faces changed glyph advances 1–5% (footer "RETURN HOME" 100→105px; conversation h2 wrapped 3 lines instead of 4). (2) Google Fonts serves a different build per UA: the crawl intercepted the Windows-hinted files (curl with a Windows UA reproduces the same URLs) while the gate's live capture (Mac Chrome UA in `live-session.mjs`) gets the unhinted build — same family, 19 different URLs, different advances. Fix: `fonts.css` is Google's css2 response verbatim for the site's exact request, URLs rewritten to `assets/fonts/gf/` files downloaded with the Mac UA. Phase 5's self-hosting must ship these files and this declaration model, not the crawl's `fonts/*.woff2`.
- The blessing paragraph's inline `margin-top:1.2rem` overrides the class rule's 1.4rem — encoded as 1.2rem.
- The intercepted Rasa file was the latin subset only; the Gujarati blessing needs the gujarati-subset face (now in `gf/`).
- visual-diff "STRETCHED IMAGE" flags (11/10) are object-fit cover/contain crops lifted verbatim — justified, not residuals.

**Artifacts touched:** stardust/prototypes/{index-proposed.html, index-proposed.css, replica-canon.css, fonts.css, assets→../current/assets}; stardust/current/assets/css/{house-a11y-v139, house-visual-continuity-v140}.css; stardust/current/assets/fonts/gf/ (19) + rasa-gujarati-variable.woff2; stardust/replica/{progress.json, motion/index.json, motion/index-build.json, gates/index-1440/, gates/index-360/, lift/measure-against-{1440,360,1920}.json}; stardust/state.json (index → prototyped → approved, hands-off); .impeccable/config.json (contrast ignore scoped to the prototype: replica preserves the source palette).

**Open questions:** none.

**Next:** Phase 5 handoff — migrate (single page, archetype tier), deploy the foundation + page to DA, publish, published-origin gate with `--marker "Nirav Manubhai"`.

---

## Handoff · A-inventory — one page, one template, migrate units done (2026-09-23)

**Prompt:** Phase 5 of `/stardust:replica --hands-off`, session 3, resumed after the source-fidelity gate.

**Decisions:**
- Migrate ran first as three recorded units (plan, render `home`, report): `migrate.mjs render index` → `stardust/migrated/index.html` (archetype tier, 45 assets bundled, 6 sections), modules `hero host story-nursery rooms conversation departure`, state `index → migrated`.
- 27 internal hrefs point at sibling pages outside the single-page scope (`/story-nursery`, `/stills`, …). Per the E2 rule they are scope extension → repointed at the source site in the delivered content; only `/` stays local. Recorded as a `links` decision on the sidecar.
- Inventory: 1 page (index), 1 template (index/home), 0 siblings. `rollout.json.site` filled: DA org `of1-labs`, site `stardust-replica-38f927f4`, ref `main`, live host `main--stardust-replica-38f927f4--of1-labs.aem.live`.
- Deploy and rollout script sets copied to `stardust/scripts/deploy/` and `stardust/scripts/rollout/`; `stardust/runtime-contract.json` written from the target's own `scripts.js` (formatted-only buttonization, `p.button-wrapper`, trusted-types CSP, fonts via `loadFonts()`).

**Next:** B-block (dedup plan), B2-dynamic, then C-deliver: foundation subagent (styles, fonts, header drawer + scroll chrome, footer, `/nav` + `/footer`), home cluster subagent (6 blocks + `content/index.html` + media upload), published-origin gate with `--marker "Nirav Manubhai"`.

## Handoff · B-block — six blocks, one conversion each (2026-09-23)

**Decisions:** `blocks.mjs` + `plan.mjs` from the migrated sidecar's `modules[]`: 6 distinct module blocks (`hero`, `host`, `story-nursery`, `rooms`, `conversation`, `departure`), each converting on the one page (index is the representative; no reuse rows). Chrome (header drawer, footer, reading-progress line, legacy bar, back-to-top) is the foundation, not a plan row. Decode tiers for C-deliver: template-slotted for hero, host, story-nursery, conversation, departure (fixed compositions); reconstructive for the `rooms` door grid (repeat group of 8 cards).

**Next:** B2-dynamic (re-verify the seven triaged rows against the plan), then C-deliver.

## Handoff · B2-dynamic — seven rows re-verified, nothing blocks delivery (2026-09-23)

**Decisions:** `dynamics-plan.mjs --target-origin … --migrated stardust/migrated` re-drafted 5 detector rows (1 self, 3 owner batch, 1 already delivered, 0 host-bound); the two manual motion rows (nav drawer, page-in fade) stay `rebuild-native` and are carried by the foundation: the header block owns the drawer, overlay, reading-progress line, legacy bar and back-to-top; `styles.css` owns the entrance fade on `body.appear`. Analytics tags (#3–#5) stay interim: not loaded on the preview host pending the owner's decision. No forms, players, search or listings — the pre-import gate is clear.

**Next:** C-deliver — C0 foundation subagent, C1 home cluster subagent, C-final.

## Handoff · C-deliver — foundation, home cluster and final delivered to the published origin (2026-09-23)

**Units:** C0 foundation (previous session): tokens, fonts, header drawer + scroll chrome, footer, `/nav` + `/footer` live, frozen at 35 files. C1 home (one cluster subagent): six blocks (hero, host, story-nursery, conversation, departure template-slotted; rooms reconstructive), `content/index.html` authored verbatim, 14 images rehosted under `media/home/`, lint 0, block-roundtrip `--ew` 66/66 editable and 0 🔴, `/index` PUT → preview → live; published-origin gate pub2 at 1440 0.02 % / Δh 0 and at 360 1.02 % / Δh 0, overflow 0, content 🔴 0, header/footer crops 0.00 % (footer 1.09 % at 360), ai-readability 100. C-final (main agent): freeze check clean; of the two queued foundation requests the footer root background was applied (`footer { background: var(--parch) }`) and the header title tag change was declined (retagging authored text breaks EW1; 0 px crop delta); pub3 confirmation rounds unchanged at 0.02 % / 1.02 %, chrome deltas 2 → 1; freeze manifest refreshed.

**Residuals (accepted):** header title `<p>` vs source `<span>` (tag only); content-diff 🟡 EXTRA TITLE ×7 from the runtime's `decorateButtons`, MISSING ARIA-LABEL on the courtyard section (runtime sections are `<div>`); visual-diff advisories for object-fit images. Non-visual, all documented in `stardust/eds-conversion-log.md`.

**Next:** rollout D-site (root resolves, redirects, chrome noindex), D2-dynamic, E-full-site verify, F-optimize, G-aem, H-report, I-dashboard, then `replica handoff end`.

## Handoff · D-site — root resolves, sitemap verified, chrome noindex (2026-09-23)

**Decisions:** the source root serves a page (200), so `/index` is the root document and no redirects sheet exists (no `stardust/redirects.tsv`, no `/` row — a row would shadow the page). `assemble.mjs --verify-origin` → served sitemap 1 url = assembled 1 url, 0 extra / 0 missing. `/nav` and `/footer` answer 200 as `.plain.html` and carry `Robots | noindex`. Preview and live origins both answer 200 on `/`. The served robots.txt is the platform default; a custom one is a site-configuration item at tools.aem.live, not a repo file.

**Next:** D2-dynamic parity replay, then E-full-site verify.

## Handoff · D2-dynamic — seven features replayed on the published origin, 7/7 checks pass (2026-09-23)

**What ran:** `stardust/dynamics/parity.json` written from the seven triaged rows (2 decided-out with no checks; 3 tag rows gated by `consent-gate` on googletagmanager / google-analytics / cloudflareinsights — no request before consent on the preview host; the drawer and the page-in fade as `dom-count` + `no-page-errors`). `dynamics-check.mjs --origin <preview>` → `stardust/qa/dynamics-report.md`: 7 PASS, 0 FAIL. Chrome interaction beyond presence: `motion-observe` on the published origin with the Phase 3 pokes vs the live observation → 6 parity, 1 "missing" (footer link hover) that a direct probe disproved — the link colour changes rgb(107,95,71) → rgb(44,37,25) on hover on both sides, fresh and after the drawer open/close; the drawer opens and closes cleanly.

**Residual:** the source fades footer-link colour over 180 ms; the build (and the gated prototype) change it instantly. Frozen footer left untouched; recorded here and in `parity.json`.

**Next:** E-full-site verify.

## Handoff · E-full-site — 1 of 1 pages verified on the preview origin (2026-09-23)

`verify.mjs --base <preview> --all`: checked 1 · 1 verified · 0 failed (type page:1); `rollout.json.lastRun` now 1 verified / 0 deployed-only / 0 failed, 6 of 6 blocks converted. Next: E2-link-audit (every href on the delivered tree GETs against the live tree; internal links root-relative).

## Handoff · E2-link-audit — 27 hrefs audited, no 404s (2026-09-23)

`localize-links.mjs --check` PASS (0 still localizable). Every href on the delivered `/`, `/nav`, `/footer`: 27 unique; 24 → 200 (the preview root, 20 out-of-scope source-site pages kept absolute per the link scope decision in `stardust/direction.md`, Substack, WhatsApp, Instagram); Facebook 400 and LinkedIn 999 are those hosts' bot walls for non-browser clients, identical targets to the source; 1 mailto skipped. No internal 404: the only in-scope internal target is `/`.

## Handoff · F-optimize — ai-search 90, one open P2 (JSON-LD) handed to G-aem (2026-09-23)

`optimize.mjs --all --current stardust/current` on the preview origin: open P1 0 · P2 1 · P3 0; gate ✓ (no open P1). The P2 is `ai-search/jsonld` on index — the source page carries one `application/ld+json` block, the replica none (fixability `platform-migration`, not source parity). Scorecard overall 90 (ai-search 90; other dimensions not scored on a one-page run). Next: G-aem applies the JSON-LD fix, re-deploys, re-runs verify + optimize.

## Handoff · G-aem — JSON-LD carried over, scorecard 100 (2026-09-23)

`autofix-aem.mjs` marked the `eds-jsonld` finding `manual` (placement via head.html / metadata pipeline). Applied by hand: the source's `application/ld+json` block (a `@graph` of WebSite, Person, WebPage; 1091 bytes) copied verbatim into `head.html` — the source places it statically in the head, and both the optimizer and crawlers read the raw served HTML, so a runtime injection would not have counted. `/nav` and `/footer` also carry it (noindex fragments; harmless). Pushed; the preview root served the block after two polls and it parses to the same 3 nodes. Re-run: optimize open P1 0 / P2 0 / P3 0, fixed P2 1, ai-search 100, overall 100; verify 1/1. Head-only change — no pixel re-gate needed (the rendered page is unchanged). Freeze manifest refreshed (head.html is in the frozen set; edit sanctioned by this phase).

**Next:** H-report, I-dashboard, then `replica handoff end`.

## Handoff · H-report — one page delivered, health 100, six learnings recorded (2026-09-23)

Summary block written to `stardust/rollout/report.md` from `rollout.json.lastRun` + `optimize/scorecard.json`: 1 page total · 1 verified · 0 pending/stale/failed; 1 template (home 1/1); 6 blocks 6/6 converted; health 100/100, open P1 0 / P2 0 / P3 0, fixed P2 1; nothing left to deliver, no content-pending pages. The dynamic parity table (7 features, 7/7 replayed checks pass, 2 decided-out) sits next to the delivery numbers, with the published-origin fidelity table (1440 0.02 % / 360 1.02 %, Δh 0) and the accepted residuals. `stardust/learnings.md` created with six `pending` entries, each naming a skill file + section: Google Fonts UA build fork + weight-range declarations; Latin-only font subset intercept; `autofix-aem` routing static JSON-LD to manual; hover colour transitions invisible to `motion-observe`; runtime `decorateButtons` title attributes read as content 🟡; `extract --single` not writing `state.json`.

**Next:** I-dashboard (`dashboard.mjs`), then `replica handoff end`.

## Handoff · I-dashboard — page tree of one, every stage reached (2026-09-23)

`dashboard.mjs --out stardust/rollout` wrote `stardust/rollout/dashboard/index.html` (self-contained, 0 external scripts or styles, brand tokens from the migrated page) and `data.json` (10 keys: stage counts, pages, templates, blocks, quality, findings). Cumulative stages: identified 1 · prototyped 1 · deployed 1 · optimised 1 — the home page reached every stage; 6/6 blocks converted, quality overall 100. `stardust/` is in `.hlxignore`, so the dashboard is not served from the site.

**Next:** `replica handoff end` — the run is complete after it.

## Handoff — complete: one page delivered to the published origin, quality 100 (2026-09-23)

Phase 5 closed. Rollout A–I all ended: 1 page (`/`, the root index document) delivered, verified and optimised on the preview origin; 1 template (home), 6 blocks converted; published-origin gate 1440 0.02 % / 360 1.02 %, Δh 0, content 🔴 0; dynamic parity 7/7; sitemap served 1 = assembled 1; 27 hrefs, 0 internal 404; scorecard 100 with 0 open findings; report in `stardust/rollout/report.md`, dashboard in `stardust/rollout/dashboard/`, six pending learnings in `stardust/learnings.md`. Root check at close: preview and live origins both answer 200 on `/`. Source-site root https://www.niravmanubhai.com/ resolves to the migrated page. No blocked lines in the run.

**Next:** nothing — the run is complete. Owner follow-ups are listed in `stardust/dynamic-features.md` (three analytics tags held as interim pending the owner's consent decision).
