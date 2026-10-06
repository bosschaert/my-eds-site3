# Journal — Garden Eight replica migration

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## 2026-10-05T15:10:00Z — Extract — bounded single-page capture of https://garden-eight.com/ (2026-10-05)

**Prompt:** Hands-off replica migration of exactly one page, https://garden-eight.com/, to AEM Edge Delivery; Phase 1 as `extract --single --dynamics`, bounded promotion branch in Phase 2, gate breakpoints desktop,mobile (1440/360).

**Decisions:**
- Flow stamped `replica` (`flowSource: user-phrase`), `handsOff: true`; state.json created by replica (bounded crawl writes no state), one page `index`, type `home`, status `extracted`.
- Crawl ran headless (technique=headless), no bot protection, no consent overlay; 1/1 captured, screenshot mode fullPage at 1440×900 — the document does not scroll natively (virtual scroller `.ui-scroll.ui-fixed` / `.ui-scroll-body`), so the full-page capture equals one viewport.
- Fonts: the site self-hosts `gunsan` (600) and `lausanne` (TWK Lausanne 200/300/400) under /assets/fonts with no CORS headers; the four woff2 files were saved under `stardust/current/assets/fonts/` as capture evidence for the local prototype gate. Licensing treatment is decided in Phase 2 (direction.md).
- Gate dependencies (playwright, pixelmatch, pngjs, cheerio) resolve from the harness; nothing was installed into the repo.

**Artifacts touched:**
- stardust/current/pages/index.json, index.html — created (crawl.mjs)
- stardust/current/assets/screenshots/index.png, index-thumb.png — created
- stardust/current/assets/css/index-inline.css — created (the three SSR `<style>` blocks, 101 KB, for css-rules.mjs)
- stardust/current/assets/fonts/ — created (4 woff2)
- stardust/current/_crawl-log.json — created
- stardust/state.json — created
- stardust/scripts/{replica,stardust,migrate,diff,extract,dynamics}/ — copied from the plugin
- stardust/scripts/status-page.mjs, stardust/.work/progress-state.json — created (status page generator)
- tools/replica/progress.html — rewritten

**Findings worth flagging:**
- The page is a Nuxt SSR app with inline stylesheets (no external CSS), a three.js canvas (`#js-back`, 1440×900) drawing GLTF models behind the content, zero `<img>`/`<video>` elements, one `<h1>` ("Garden Eight"), display headline "What can we make next" split into per-letter spans, and a virtual scroller. Pixel gating must account for the animated canvas and the non-native scroll.
- Dynamic surface: 49 same-site data endpoints (GLTF/GLB models, draco decoder from jsdelivr, `/_api/chatApi/json/{faq,setting}.json`), no forms, framework hint nuxt.

**Open questions:**
- none

**Next:** Phase 2 — bounded promotion (cap-probe → DESIGN.json, minimal PRODUCT.md/DESIGN.md with provenance bounded-single), direction.md, empty inconsistency register, dynamics triage.

---
## 2026-10-05T15:18:00Z — Preserve-direction — bounded promotion, empty register, dynamics triage (2026-10-05)

**Prompt:** Phase 2 of the hands-off replica run: bounded promotion branch (provenance bounded-single) for the single page.

**Decisions:**
- Spec synthesized, not invented: PRODUCT.md / DESIGN.md / DESIGN.json at the root carry `mode: bounded-single` and trace every value to `current/pages/index.json` or `stardust/replica/tokens.json` (the CSS lift from the SSR stylesheets + live computed styles + canvas colour sampling). cap-probe wrote `extensions.breakpoints`: fluid, no caps, probeWidth 2560.
- Inconsistency register empty — pure replica.
- Dynamics: 28 drafted rows curated to 8 features. WebGL scene and lazy case/about videos → static-snapshot (capture-state); chat/FAQ settings fetch and Nuxt state → decided-out; client-rendered reveals, marquee and mail-copy → rebuild-native / client-only pending motion-observe; locale ja → out of this run's scope.
- Fonts: owner's self-hosted woff2 move with the site; brand family first in every stack; owner confirmation requested in the conversion log. Publish decision recorded: publish.
- Page advanced `extracted → directed`.

**Artifacts touched:**
- stardust/replica/tokens.json — created · stardust/current/DESIGN.json — updated (cap-probe + lift) · PRODUCT.md, DESIGN.md, DESIGN.json (root) — created
- stardust/direction.md, stardust/replica/inconsistency-register.md — created
- stardust/current/_dynamics.json, dynamic-features.generated.md, stardust/dynamics/* — created (scripts) · stardust/dynamic-features.md, stardust/dynamic-features-plan.md — created
- stardust/eds-conversion-log.md — created · stardust/state.json — updated

**Findings worth flagging:**
- The visible beige surface is the canvas's paint; the DOM alone is dark-on-dark. The recreation must paint the sampled surface colour in CSS.
- The site's sizing is vw-based (main 1.076vw, display headline 14.93vw, gutters 3.125vw / 2.625vw / 2.0833vw) with px plateaus ≤1366 and ≤640 — lift the model, not the 1440 px values.

**Open questions:**
- Owner: TWK Lausanne licence on the new origin; WebGL scene and video sources (post-run).

**Next:** Phase 3 — recreate the home archetype (stardust/prototypes/index-proposed.html + CSS), then the gate at 1440 and 360.

---
## 2026-10-05T15:57:00Z — Recreate — home archetype authored and iterated against the live page (2026-10-05)

**Prompt:** Phase 3 of the hands-off replica run: recreate the single home archetype as clean HTML/CSS and iterate it against https://garden-eight.com/ at 1440 and 360.

**Decisions:**
- Prototype: stardust/prototypes/index-proposed.html + canon.css (tokens, fonts, fixed chrome) + index.css (sections) + motion.css/motion.js (fired-only motion layer); fonts served from stardust/prototypes/fonts/ (the capture copies). Content verbatim from index.json; values from tokens.json and live computed styles (measure.mjs at 1440/360).
- Capture-state: the WebGL canvas is a static CSS surface paint; the `.Pf` footer block is painted `--col-black` (the canvas paints it dark on live); case titles are shown as DOM text (WebGL text on live); case/about videos are empty slots.
- Scroll-jacked live page: the stitched live capture is one viewport, so the pixel probe measures the first 900 px; the build scrolls natively (main height 3662 vs live main 3671 at 1440).
- Iterations: 1440 — iter1 6.42% → iter2 3.47% (headline `.t` had been made block: 5 lines instead of 4) → iter3 3.48% (text-node whitespace, nav tags, JA box, marquee clip room) → conf1 3.47%, 0 🔴, clip 0, header parity quiet. 360 — iter1 10.13% → iter2 7.81% (fresh-load headline 18.6625vw, description 15px/1.6, intro 1.25em line boxes) → iter3 7.95% → conf1/conf2 7.95%, 0 🔴, clip 0, header parity 11/11 quiet (closed mobile menu kept at live geometry, opacity 0).
- Motion (observed, never inferred): implemented clip-y reveals (1.4s), hr draw (1.2s), editor paragraph fade, pickup `entered`/`selected`, marquee `data-visible`, mail `copied` (+ clipboard). Dead on live: header morph, all hovers. Not applicable: image/video load classes (no media). Pixel after motion: 3.47% / 7.95% (unchanged).
- Local server: Python's http.server crashes on this host (idna hostname error); stardust/scripts/serve.mjs serves the prototypes dir on 8791 (pid in stardust/.work/http.pid).

**Artifacts touched:**
- stardust/prototypes/{index-proposed.html,canon.css,index.css,motion.css,motion.js,fonts/,favicon.svg,logo-vr.svg} — created
- stardust/replica/gates/index-1440/, index-360/, index-2560/ — gate evidence (iter1–3, conf1/2, motion1, cap-probe PASS)
- stardust/replica/motion/{index.json,index-build.json,index-compare.json} — created
- stardust/replica/progress.json — created · stardust/state.json — index → prototyped

**Findings worth flagging:**
- A fresh 360 load renders the display headline at 18.6625vw while a 1440→360 resize keeps 14.93vw: measure mobile on a fresh load, never by resizing.
- chrome-parity skips `visibility:hidden` text (reports MISSING) while clip-probe counts transform-clipped text as hidden: a closed overlay satisfies both only at `opacity:0` with live geometry.

**Open questions:** none

**Next:** source-fidelity-gate record (prototype tables), approval, then handoff (deploy → publish → published-origin gate).

---
## 2026-10-05T15:58:00Z — Source-fidelity-gate — prototype tables recorded, archetype approved (hands-off) (2026-10-05)

**Prompt:** Phase 4 record for the home archetype.

**Decisions:**
- Prototype tables (`gate-all --stage prototype`): 1440 → pixel 3.47% PASS, clip 0 (allowance 2 for the mail tips, documented), content n/a (prototype regime); 360 → pixel 7.95% PASS, clip 0. The height criterion fails by construction on this scroll-jacked page (live document 900 px) and is carried as a documented override in `gates/prototypes-<w>/overrides.json`, shown beside the number — 1 delivered at each width.
- Approval granted under hands-off after all gates: `approvedBy: hands-off` on the `approved` history entry.
- Residuals (progress.json): WebGL models and canvas gradient (3.47% at 1440; 7.95% at 360, the lizard model) — capture-state, flagged for delivery; footer REGION note of chrome-parity (no `<footer>` on either side) — instrument limitation.

**Artifacts touched:**
- stardust/replica/gates/prototypes-1440/, prototypes-360/ — summary.{json,md}, overrides.json, clip-allow.json
- stardust/state.json — index → approved (hands-off)
- stardust/replica/progress.json — gate record pointers

**Open questions:** none

**Next:** handoff — deploy the archetype to EDS (blocks, nav/footer, fonts), publish, published-origin gate, rollout bookkeeping, done-check.

---
## 2026-10-05T16:07:00Z — Render — home archetype placed in the migrated tree, no siblings (2026-10-05)

**Prompt:** Phase 5 entry: the rollout inventory reads `stardust/migrated/`, so the gated archetype is placed there first.

**Decisions:**
- `migrate.mjs render index` (branch A, canon from `stardust/prototypes/canon.css`): 9 assets bundled, 3 sections, 16 links of which 13 point at paths outside this one-page scope (`/cases/`, `/about/`, `/archives/`, `/contact/`, `/ai/`, `/faq/`, `/ja/` and the case detail pages). They stay as authored; the redirects sheet maps them to the source site (scope debt, recorded in direction.md at D-site).
- Sidecar: modules header / hero / cases / about-teaser / footer; Phase 4 gates recorded (pixel 1440 + 360, content-diff, clip-probe, cap-probe).
- One render unit (`render-home`) in `stardust/migrate/progress.json`; there is no sibling cluster, so no further render unit follows the archetype unit of C-deliver.

**Artifacts touched:** stardust/migrated/index.html, stardust/migrated/_meta.json, stardust/migrated/assets/, stardust/migrate/progress.json

**Open questions:** none

**Next:** rollout A-inventory → B-block → B2-dynamic → C-deliver.

---

## 2026-10-05T16:10:00Z — A-inventory — one page, one template (2026-10-05)

**Prompt:** Rollout Phase A over the migrated tree in archetypes-only mode.

**Decisions:**
- `inventory.mjs --site-url https://garden-eight.com/ --state stardust/state.json`: 1 page (index), 1 template (index, its own archetype), 1 to deliver, no content-pending siblings.
- `rollout.json.site` filled: DA org `aemcoder`, site `061e4e3f`, ref `main`; live host `main--061e4e3f--aemcoder.aem.live`, preview host `main--061e4e3f--aemcoder.aem.page`.

**Artifacts touched:** stardust/rollout/coverage/pages.json, coverage/templates.json, rollout.json

**Open questions:** none

**Next:** B-block (dedup ledger + plan), B2-dynamic, C-deliver.

---

## 2026-10-05T16:12:00Z — B-block — five distinct blocks, three to convert on the home page (2026-10-05)

**Prompt:** Rollout Phase B dedup ledger and conversion plan.

**Decisions:**
- `blocks.mjs`: 5 distinct blocks — 3 module blocks (hero, cases, about-teaser) + 2 chrome fragments (header → /nav, footer → /footer). `plan.mjs`: index is the representative and converts all three; the fragments deliver once in the foundation unit.
- Decode tiers (recorded in eds-conversion-log.md at C-deliver): hero and about-teaser template-slotted; cases reconstructive (repeat group of case links); header and footer template-slotted chrome.

**Artifacts touched:** stardust/rollout/coverage/blocks.json, stardust/rollout/plan.json

**Open questions:** none

**Next:** B2-dynamic (verify the triage against the target origin), then C-deliver.

---

## 2026-10-05T16:14:00Z — B2-dynamic — triage re-verified, every row dispositioned (2026-10-05)

**Prompt:** Rollout Phase B2, the pre-import dynamic-surface gate.

**Decisions:**
- `dynamics-plan.mjs --target-origin https://main--061e4e3f--aemcoder.aem.page --migrated stardust/migrated`: 28 drafted rows, 14/14 first-party API paths host-bound on the target (as at Phase 2), 2 features already delivered by the migrated tree.
- `stardust/dynamic-features.md`: rows 4 (client-rendered reveals) and 7 (mail copy-to-clipboard) move from pending to decided (implemented) — motion-compare reported 4 parity / 0 extra at Phase 3 and the mail click fired. No row stays pending; rows 1 and 8 (WebGL scene, lazy videos) remain interim capture-state decisions for the owner.

**Artifacts touched:** stardust/dynamic-features.md, stardust/dynamics/dynamic-features.generated-plan.{json,md}

**Open questions:** owner decisions on the WebGL background and the case/about videos (interim: replicated as captured).

**Next:** C-deliver — foundation unit (styles, fonts, header/footer blocks, /nav + /footer), then the archetype unit.

---

## 2026-10-05T17:58:00Z — C-deliver — the home page, its header and footer live on the published origin (2026-10-05)

**Prompt:** Rollout Phase C in recorded units: foundation, archetype (home), cluster (home), gate-all, final.

**Decisions:**
- `foundation`: one subagent authored and deployed styles, fonts, header/footer blocks and the /nav + /footer documents (preview + publish); the main agent gated the shell geometry at 1440 and 360 against the prototype, then froze the foundation (17 files after the C-final re-freeze).
- `archetype-home`: /index (served as /) converted with hero (template-slotted), cases (reconstructive) and about-teaser (template-slotted); published-origin gate 1440 4.69 % / 360 2.16 %, clipped 2/2 allowed, content 0/0 at 1440; the two 360 MISSING findings were register R1 (presence sidecar) and the footer mail control (queued request). One fix round.
- `cluster-home`: no siblings in scope (single-page run), recorded 0/0 with nothing to PUT.
- C-final request queue applied once before `gate-all`: the footer mail control is one link as on the source (tip lines aria-hidden, mobile touch state under the site's breakpoint); nav/footer fragment hrefs normalised without trailing slash. Foundation re-frozen.
- `gate-all`: roster run against main--061e4e3f--aemcoder.aem.live, 1/1 delivered — 1440 4.69 %, 360 2.16 %, content 0/0 at both widths, clipped 2/2 allowed, height under the documented scroll-jack override (`gates/all-<w>/overrides.json`); `update-coverage.mjs --gate` wrote the verdict into coverage.
- `final`: freeze check clean, 0 requests pending, `/`, `/nav`, `/footer` answer 200 on aem.page and aem.live.

**Artifacts touched:** stardust/rollout/progress.json, stardust/rollout/foundation-freeze.json, stardust/rollout/foundation-requests.md, stardust/rollout/coverage/pages.json, stardust/replica/gates/all-1440/, stardust/replica/gates/all-360/, blocks/, styles/, content/

**Open questions:** none for this phase; the WebGL background and the case/about videos stay capture-state decisions for the owner (dynamic-features.md rows 1 and 8).

**Next:** D-site — redirects sheet for the out-of-scope link targets, sitemap/robots assembly, origin verification.

---

## 2026-10-05T18:00:00Z — D-site — redirects wired, served sitemap matches, root answers (2026-10-05)

**Prompt:** Rollout Phase D, site-level assembly for the one-page delivery.

**Decisions:**
- The source root serves a page, so `/` is served from the delivered `index` document; no `/` row in the redirects sheet.
- `stardust/redirects.tsv`: the ten internal link targets this run does not migrate (/about, /cases, /ja, /faq, /contact, /archives, /ai, three case detail pages) map to the same path on https://garden-eight.com/ (scope debt recorded in eds-conversion-log.md). PUT as `/redirects.json` (Source / Destination), previewed and published; every path answers 301 to the source on aem.live.
- `assemble.mjs`: sitemap 1 url, robots.txt staged under stardust/rollout/site/; `--verify-origin` against aem.live: served 1 = assembled 1 (the /nav and /footer documents carry `robots | noindex` and are absent from the served sitemap).
- `curl -sIL` on the aem.page root ends in 200.

**Artifacts touched:** stardust/redirects.tsv, stardust/rollout/site/{sitemap.xml,robots.txt,manifest.json,redirects-deploy.json}

**Open questions:** none.

**Next:** D2-dynamic — parity rows for the delivered dynamic features against the published origin.

---

## 2026-10-05T18:05:00Z — D2-dynamic — parity rows replayed against the published origin, 6/6 pass (2026-10-05)

**Prompt:** Rollout Phase D2, dynamics Phases 4–5 for the one-page delivery.

**Decisions:**
- `stardust/dynamics/parity.json`: 8 features. Two carry replayable checks — the client-rendered reveals (6 clip-y line wrappers, 3 case links, 3 marquee tracks, no page errors) and the footer mail control (1 control, 1 mailto link); both `done`. WebGL scene and lazy case videos stay `interim` (capture-state, owner decisions named); locale variants (/ja → source via the redirects sheet), favicon rehost (200 on the origin) `done` without flows; chat/FAQ settings and the Nuxt payload `decided-out`.
- `dynamics-check.mjs --origin https://main--061e4e3f--aemcoder.aem.live`: 6/6 PASS, report in stardust/qa/dynamics-report.{md,json}. The first two rounds failed on a guessed marquee selector; the DOM was measured once and the check now names the real classes.
- No query index is needed: no listing, search or form on the migrated page.

**Artifacts touched:** stardust/dynamics/parity.json, stardust/qa/dynamics-report.md, stardust/qa/dynamics-report.json

**Open questions:** owner decisions on the WebGL background and the case/about videos (interim: replicated as captured).

**Next:** E-full-site — verify.mjs against the published origin; coverage rows verified from the gate table.

---

## 2026-10-05T18:10:00Z — E-full-site — the page verified on the published origin after the out-of-scope links were repointed (2026-10-05)

**Prompt:** Rollout Phase E, full-site verification.

**Decisions:**
- First `verify.mjs --all` against aem.live read the page `failed`: five root-relative hrefs (/about, /cases, three case detail pages) have no coverage row. They are scope extension for this one-page run (not a capture gap), so per the link-audit rule they are repointed to the source site: the ten out-of-scope hrefs in content/index.html, content/nav.html and content/footer.html became absolute `https://garden-eight.com/<path>/` URLs. Decision and list recorded in stardust/direction.md; the redirects sheet keeps the same ten rows for inbound requests.
- /index, /nav and /footer re-PUT, previewed and published (3/3 ok). `localize-links.mjs --source-host garden-eight.com --check` passes (0 localizable).
- The roster gate re-ran at both widths with the delivered side re-captured: 1440 4.69 % (Δh −2762 under the documented scroll-jack override), 360 2.16 % (Δh −1984, same override), content MISSING 0 / HIDDEN 0, clipped 2/2 allowed; `update-coverage.mjs --gate` rewrote the verdicts.
- `verify.mjs --all`: 1 checked, 1 verified, 0 failed. Headless render evidence: the roster captures and dynamics-check's no-page-errors on `/`.

**Artifacts touched:** content/index.html, content/nav.html, content/footer.html, stardust/direction.md, stardust/deploy/ledger-relink.json, stardust/replica/gates/all-{1440,360}/, stardust/rollout/coverage/pages.json, stardust/rollout/rollout.json

**Open questions:** none.

**Next:** E2-link-audit — every href on the delivered tree GET-checked; nav/footer targets confirmed live.

---

## 2026-10-05T18:12:00Z — E2-link-audit — 17 distinct hrefs, 15 fetched, all 200 (2026-10-05)

**Prompt:** Rollout Phase E2, link-audit completeness over the delivered tree.

**Decisions:**
- Hrefs collected from /index, /nav and /footer on aem.live: 17 distinct. `/` 200 on the new origin; the ten repointed source targets 200 on garden-eight.com; patio.garden-eight.com, LinkedIn, X (twitter.com → x.com) and Instagram (login interstitial, 200) answer; `mailto:` and the `#` anchor (as on the source) skipped.
- No capture gap: the site plan selects `/` only; every other internal target is scope extension, repointed (decision in stardust/direction.md, E-full-site) and covered by the redirects sheet. Nothing 404s.
- `localize-links.mjs --check` (E-full-site) passes: 0 localizable links remain.

**Artifacts touched:** stardust/rollout/link-audit.tsv

**Open questions:** none.

**Next:** F-optimize — optimize.mjs findings + scorecard; gate on open P1.

---

## 2026-10-05T18:14:00Z — F-optimize — health 90, no open P1, one P2 (2026-10-05)

**Prompt:** Rollout Phase F, the in-flow delivery-quality gate.

**Decisions:**
- `optimize.mjs --base https://main--061e4e3f--aemcoder.aem.live --all`: 1 page + site checks, health 90/100 (ai-search 90; a11y / seo / cross-page layers null for this run), open P1 0 · P2 1 · P3 0, source-parity findings 0.
- The one P2 (`ai-search/jsonld`, no JSON-LD structured data on `/`) is tagged platform-migration; it goes to G-aem for the autofix dry-run and is otherwise recorded, not gated.
- ✓ GATE: no open P1 findings.

**Artifacts touched:** stardust/rollout/optimize/findings.json, stardust/rollout/optimize/scorecard.json

**Open questions:** none.

**Next:** G-aem — `autofix-aem.mjs --dry-run`, apply only what is fixable without changing the replicated design, re-verify.

---

## 2026-10-05T18:16:00Z — G-aem — the one P2 fixed in the project, health 100 (2026-10-05)

**Prompt:** Rollout Phase G, EDS project autofix for the open findings.

**Decisions:**
- `autofix-aem.mjs --project . --dry-run`: 1 candidate, 0 auto-applied, 1 manual — `eds-jsonld [index]` must be placed via head.html / the metadata pipeline.
- The source's JSON-LD is a site-wide base graph (Organization, WebSite, BreadcrumbList, WebPage; 1,940 bytes). Carried verbatim into `head.html` (no payload authored, no values changed; noted in eds-conversion-log.md with the per-page caveat for later pages). Code pushed; the live `/` carried the block on the first poll. Foundation re-frozen (17 files).
- Re-run: `optimize.mjs` health 100/100, open P1 0 · P2 0 · P3 0 (P2 jsonld → fixed); `verify.mjs --all` 1 verified; live `/` 200, one h1, 0 about:error.

**Artifacts touched:** head.html, stardust/rollout/optimize/{findings.json,scorecard.json,source-jsonld.json}, stardust/rollout/foundation-freeze.json, stardust/eds-conversion-log.md

**Open questions:** none.

**Next:** H-report — the summary block from rollout.json.lastRun + the scorecard; learnings.

---

## 2026-10-05T18:18:00Z — H-report — one page verified, health 100, five learnings (2026-10-05)

**Prompt:** Rollout Phase H, the report and the learnings ledger.

**Decisions:**
- Block rows recorded `verified` in coverage (hero, cases, about-teaser, header, footer) — the clusters had not written them; the roll-up now reads 5/5.
- `stardust/rollout/report.md`: summary block (1/1 verified, 5/5 blocks, health 100, open 0/0/0, pixel tables 1/1 delivered at both widths under the documented height override), site assembly, the dynamic parity table beside the ledger, the owner decisions outstanding.
- `stardust/learnings.md`: five pending entries — verify vs redirect-backed links, gate-all's page selection, the scroll-jacked height criterion, no click-state check type, page lint on fragments.

**Artifacts touched:** stardust/rollout/report.md, stardust/learnings.md, stardust/rollout/coverage/blocks.json, stardust/rollout/rollout.json

**Open questions:** none.

**Next:** I-dashboard — dashboard.mjs; then the done-check and the replica handoff end.

---

## 2026-10-05T18:20:00Z — I-dashboard — dashboard rendered for the one-page run (2026-10-05)

**Prompt:** Rollout Phase I, the self-contained progress dashboard.

**Decisions:**
- `dashboard.mjs`: stardust/rollout/dashboard/index.html + data.json from coverage, optimize and state.json — one page (home, archetype) at the optimised stage, 5/5 blocks, health 100.

**Artifacts touched:** stardust/rollout/dashboard/index.html, stardust/rollout/dashboard/data.json

**Open questions:** none.

**Next:** done-check with the runner, then the replica handoff end line.

---

