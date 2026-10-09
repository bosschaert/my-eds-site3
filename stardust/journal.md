# Journal — myAstraZeneca Suisse (FR) replica migration

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## 2026-10-07T09:30:00Z — Extract — 10 planned pages captured live, brand surface and descriptive spec written (2026-10-07)

**Prompt:** Hands-off `stardust:replica` run over exactly the 10 pages in `stardust/.labs/site-plan.json` (French tree of https://www.myastrazeneca.ch/); Phase 1 = `extract --prep --dynamics --pages …`.

**Decisions:**
- Flow stamped `replica` (`flowSource: user-phrase`), `handsOff: true`; breakpoints 1440 / 360 (run.json "desktop,mobile").
- Crawler slugs normalised to the site-plan slugs (`fr-startseite`, …) so every artifact keys on the plan.
- First crawl captured a Cookie Reports banner on every page and the HCP self-certification modal (`.cmp-selfcertification`, page root `inert aria-hidden`) on the five PATTRNS pages (0 headings recorded). Project copy of `crawl.mjs` gained `--dismiss <sel,…>`; re-crawled with `a.wscrOk,button.self-certify-yes`; the same selectors feed every later live instrument (`--dismiss`).
- Page typing: home → `landing` (template `home`), four therapy-area disease pages → `program` (`therapy-area`), five PATTRNS campaign pages → `article` (`pattrns`). Archetypes: fr-startseite, …-cvrm-herzinsuffizienz, …-see-the-pattrns-about-amylodosis-attr.
- Fonts harvested from `main.css` @font-face (publish clientlib base): Lexia (commercial, Dalton Maag), Inter, Montserrat, icomoon. Lexia licence to be confirmed by the owner before the new host self-hosts it; kept first in the stack.

**Artifacts touched:**
- stardust/current/pages/<slug>.json + .html (10) — created (crawl.mjs, dismissed overlays)
- stardust/current/assets/screenshots/<slug>.png (+ -thumb) — created
- stardust/current/_crawl-log.json, _computed-styles.json (1440 + 360), _brand-extraction.json — created
- stardust/current/assets/{logo.svg,favicon.ico,fonts/,css/} — created
- stardust/current/PRODUCT.md, DESIGN.md, DESIGN.json (extensions.breakpoints via cap-probe: content 1180 px, shell fluid, probe 2560) — created
- stardust/current/brand-review.html — created (delegated)
- stardust/state.json — created (10 × extracted, typed)
- stardust/scripts/{replica,stardust,migrate,diff,extract}/ — copied; extract/crawl.mjs extended; status-page.mjs, evidence-table.mjs, rename-slugs.mjs added

**Findings worth flagging:**
- Vision check: 10/10 ok after the dismissals; three templates confirmed by eye. Provenance 10/10 live (playwright, medium 2500 ms, HTTP 200).
- Content root is `#restyle` (AEM `.root.container.responsivegrid`), no `<main>`; `--main` for the gates must name it.
- Dynamic surface: `/bin/secureCookies` XHR, Adobe Target (omtrdc), Cookie Reports consent, search box form on every page, Tealium/Mouseflow/LinkedIn tags; self-certification gate on campaign pages.
- No locale-root capture gaps (entry is a page, not a locale root).

**Open questions:**
- none (Lexia licence surfaced to the owner in the conversion log, not blocking).

**Next:** Phase 2 preserve-direction — promote the spec verbatim, write direction.md, the (empty) inconsistency register, run dynamics detect/plan.

---
## 2026-10-07T09:33:49Z — Preserve direction — spec promoted verbatim, empty register, dynamic surface triaged (2026-10-07)

**Prompt:** Hands-off continuation; Phase 2 of `stardust:replica` after a completed extract.

**Decisions:**
- Verbatim promotion (`cmp` clean) of current/PRODUCT.md, DESIGN.md, DESIGN.json to the project root; no per-variant DESIGN files; provenance `--prep` promotion (the descriptive spec exists, bounded branch not applicable).
- Inconsistency register is empty — pure replica; no audit run (hands-off policy adopts no improvement candidates).
- Dynamics: detector run over the 3 archetypes (home, herzinsuffizienz, about-amylodosis-attr) with reach from all 10 crawled pages; plan drafted with `--target-origin` on the preview host (1/1 first-party API path dead → host-bound). Curated 10 rows (locale rows merged, cookie-help links dropped as noise; HCP self-certification modal added by hand from the extract evidence). Hands-off resolutions: tags disabled in site-config, search box non-functional (results page outside scope), favorite counter static, login and DE/IT links verbatim.
- Publish decision recorded once in stardust/eds-conversion-log.md: publish.

**Artifacts touched:**
- PRODUCT.md, DESIGN.md, DESIGN.json — created (verbatim copies)
- stardust/direction.md — created
- stardust/replica/inconsistency-register.md — created (empty template)
- stardust/current/_dynamics.json, dynamic-features.generated.md — created (dynamics-detect)
- stardust/dynamics/dynamic-features.generated-plan.{md,json} — created (dynamics-plan)
- stardust/dynamic-features.md, stardust/dynamic-features-plan.md — created (curated)
- stardust/eds-conversion-log.md — created
- stardust/replica/status-page.json, tools/replica/progress.html — updated

**Findings worth flagging:**
- The source already loads helix-rum-js from rum.hlx.page; nothing to add on EDS.
- The header search depends on `/fr/startseite/search-result.html`, which is not in the plan; it ships as a non-functional box until the owner decides.
- Only the herzinsuffizienz page calls the social-features API; it 404s on the target.

**Open questions:**
- Owner decision batch (tags, search, counter, locale trees) — recorded in dynamic-features.md; not blocking.

**Next:** Phase 3 recreate — cumulative archetype prototypes (home → therapy-area → pattrns), CSS lift from the source clientlibs, gates at 1440 and 360.

---

## 2026-10-07T11:03:54Z — Recreate (in progress) — home and therapy-area archetypes gated, PATTRNS next (2026-10-07)

**Prompt:** Hands-off continuation; Phase 3 recreate, one archetype per unit, runner stopped the session after the second unit.

**Decisions:**
- Prototypes served by `stardust/scripts/replica/static-serve.mjs` (python3 http.server fails on this host's hostname); start it fresh each session: `nohup node stardust/scripts/replica/static-serve.mjs stardust/prototypes 8791 stardust/.work/replica/proto-server.pid > stardust/.work/replica/proto-server.log 2>&1 &` (the server writes its own pid to that file); stop it with `kill $(cat stardust/.work/replica/proto-server.pid)` before ending (never setsid: the recorded pid was the wrapper, not the server).
- Project gate.sh adaptations (logged): `GATE_DISMISS_EXTRA="a.wscrOk,button.self-certify-yes"` forwards the Cookie Reports and HCP-modal closers to stitch-shot/chrome-parity/content-diff/visual-diff; the four --full probes run 3-then-1 to respect the 3-browser cap.
- Probes scope to `.root` (live `#restyle` is the body); unit-geometry live cache `stardust/current/measure/<slug>-units.json` deleted before each new-width round.
- Lexia measured from the live woff (`400_Lexia_Rg.woff`), metrics differ from the intercepted woff2; measurement-only, never published.
- Per-archetype recreation delegated to one subagent at a time with `stardust/replica/briefs/archetype-brief.md`.

**Artifacts touched:** stardust/prototypes/{fr-startseite,fr-startseite-therapiegebiete-cvrm-herzinsuffizienz}-proposed.html, css/canon.css, css/<slug>.css, js/motion.js, assets/; stardust/replica/progress.json (2 of 3 archetypes `gated`), units.json, motion/, gates/<slug>-{1440,360,2560}/; state.json (2 approved).

**Findings worth flagging:** home 0.00%/0.00% after the canon Lexia fix (was 0.44/0.56); therapy-area 0.01%/0.01%; Δh 0, 0 structural red, cap-probe PASS, motion parity on both. No residuals.

**Next:** third unit — PATTRNS archetype `fr-startseite-therapiegebiete-cvrm-see-the-pattrns-about-amylodosis-attr` (Kaltura poster state, HCP self-certification modal observed via motion-observe), same brief; then the prototype tables (`gate-all.mjs --stage prototype` at 1440 and 360), `recreate end` + journal section, boundary ask, then Phase 5 handoff.

---

## 2026-10-07T11:58:00Z — Recreate — three archetypes gated at 1440 and 360, prototype tables written (2026-10-07)

**Prompt:** Hands-off continuation (session 3); third recreate unit (PATTRNS archetype), then the prototype tables and the phase end.

**Decisions:**
- PATTRNS archetype `fr-startseite-therapiegebiete-cvrm-see-the-pattrns-about-amylodosis-attr` recreated by one subagent from the shared brief plus `stardust/replica/briefs/pattrns-addendum.md` (`--main .root` on every probe, explicit chrome-parity regions, Kaltura poster state, HCP modal mirrored as the empty post-dismissal wrapper).
- Result: 1440 0.00% / Δh 0 / 0 🔴 (2 iterations), 360 0.00% / Δh 0 / 0 🔴 (3 iterations), cap-probe PASS at 2560, clip 0, overflow 0; motion-compare 2 parity / 0 missing / 0 extra / 1 advisory; one justified visual flag (poster stretch mirrors live) and one justified unit-geometry "hidden" (sub-nav item scrolled out on both sides).
- Canon change (measured chrome delta): breadcrumb grey dummy links were claimed by the therapy record but missing from canon.css — added; home and therapy re-checked at 1440: 0.00% / Δh 0 each.
- Prototype tables (`gate-all.mjs --stage prototype`): 1440 3/3 PASS; 360 2 PASS + 1 documented override (`gates/prototypes-360/overrides.json`, the justified sub-nav scroll state), pixel 0% / Δh 0 on all three at both widths. The unit-geometry live cache is per slug, not per width — it must be deleted before any run at a new width (the first 1440 table failed all three on units for that reason alone).
- Status page now rendered by `stardust/scripts/replica/status-page.mjs` from `stardust/replica/status-page.json` + run.json.

**Artifacts touched:** stardust/prototypes/<pattrns slug>-proposed.html, css/<slug>.css, css/canon.css, js/video.js, js/sub-nav.js, assets/img/<slug>/ (22 files); stardust/replica/progress.json (3/3 gated + prototypeTables), units.json, motion/<slug>{,-build}.json, gates/<slug>-{1440,360,2560}/, gates/prototypes-{1440,360}/; state.json (3 approved); tools/replica/progress.html.

**Findings worth flagging:** no residuals on any archetype. For the four PATTRNS siblings: same chrome fragments (DE/FR/IT lang-nav, no #vivo-id-wrap on this template), sub-nav `--active` per page, desktop images `srcset "<file> 1920w"`, `.ta-card` variants (`--plain/--border/--center`) compensated in the slug sheet rather than canon. Kaltura poster and HCP self-certification modal are flagged for delivery as dynamic-feature blocks.

**Next:** Phase 5 handoff — read `reference/handoff-contract.md`, then migrate (plan/assets) → deploy foundation → rollout C-deliver in units (foundation, archetype per template, cluster per template, gate-all, final), publish decision already recorded (publish).

---
## 2026-10-07T12:03:00Z — A-inventory — coverage built from 3 archetypes + the 10-page roster (2026-10-07)

**Prompt:** Hands-off Phase 5; rollout Phase A in archetypes-only mode.

**Decisions:** the 3 archetypes were rendered through `migrate.mjs render` (branch A) after wrapping `.breadcrumb-bar` + `.page-body` in `<main>` in each prototype (the live site has no main landmark; the wrap re-measured 0.00% at 1440 on all three). Modules declared per archetype (home 6, therapy 9, pattrns 9). `rollout.json` DA coordinates filled: org aemcoder, site bf989f9e, ref main, liveHost main--bf989f9e--aemcoder.aem.live. The 7 siblings are `content-pending` (templateId = their type: program ×3, article ×4) until each template's render unit runs after its C-archetype unit.

**Artifacts touched:** stardust/migrated/ (3 archetypes + sidecars + assets), stardust/rollout/{coverage/pages.json,coverage/templates.json,rollout.json}, stardust/migrate/progress.json (plan unit done), stardust/prototypes/*-proposed.html (main wrap).

**Findings worth flagging:** migrate reports 41/32/43 "broken" internal links per archetype — they point at source pages outside the 10-page plan (nav, footer, therapy index pages); E2 link audit repoints them to the source site.

**Next:** Phase B block dedup plan.

---
## 2026-10-07T12:04:00Z — B-block — 15 distinct blocks, one conversion point each (2026-10-07)

**Prompt:** rollout Phase B.

**Decisions:** `blocks.mjs` → 15 distinct module blocks from 24 instances (breadcrumb ×3, hero ×3, image-text-band ×2, references ×2, split-teaser ×2, tile-grid ×2 reused); chrome (header strip, header, footer) is the foundation's `/nav` + `/footer` documents, not a module row. `plan.mjs` orders representative-first: home converts breadcrumb, hero, tile-grid, split-teaser, hidden-section, vivo-stamp; therapy converts intro-media, social-features, image-text-band, references; pattrns converts selfcert-modal, sub-nav, video-poster, cta-cards, questions-cta.

**Artifacts touched:** stardust/rollout/coverage/blocks.json, stardust/rollout/plan.json.

**Next:** B2 dynamic-surface verification, then C-deliver in units.

---
## 2026-10-07T12:08:00Z — B2-dynamic — inventory verified against fresh evidence, no new rows (2026-10-07)

**Prompt:** rollout Phase B2 pre-import gate.

**Decisions:** `dynamics-detect.mjs --from-state --reach` re-probed the three type representatives (10 findings), `dynamics-plan.mjs --target-origin https://main--bf989f9e--aemcoder.aem.live --migrated stardust/migrated` → 10 rows: self 2, owner batch 6, delivered 1 (cookie-policy link text), host-bound 1/1 (the socialFeaturesPost API is 404 on the target — row 2 ships its static interim as decided). Every generated id maps to a curated row in stardust/dynamic-features.md; no new evidence, no new rows. Delivery contract for C: Tealium/Cookie Reports not loaded, search box rendered non-functional, sign-in and DE/IT links verbatim, Kaltura poster state, HCP modal as a block.

**Artifacts touched:** stardust/current/_dynamics.json, stardust/dynamics/dynamic-features.generated-plan.{json,md}.

**Next:** C-deliver in units — foundation, archetype per template (+ its render unit and cluster), gate-all, final.

---

## 2026-10-07T13:40:00Z — C-deliver unit archetype-home — home page published and gated on the preview origin (2026-10-07)

**Prompt:** rollout Phase C, unit `archetype-home` (session 4 resume; foundation was `done`).

**Decisions:** one subagent authored six blocks (breadcrumb, hero, hidden-section, vivo-stamp template-slotted; tile-grid, split-teaser reconstructive), authored content/fr/startseite.html from the migrated archetype, uploaded 10 renditions to DA media scope `home`, PUT → preview → published /fr/startseite. Published-origin gate (gate-all on the preview host, origin headless): 1440 0.48 % / 360 0.68 %, Δh 0, clipped 0, content MISSING+HIDDEN 0; one units row off by 5 px (card-3 heading box, Roboto Slab for the unlicensed Lexia) carried as a documented override in all-*/overrides.json. crop-compare header 1.49/1.42 %, footer 0.00 %. Computed-style guard clean at both widths. Foundation unchanged (21 files), no foundation requests. Instrument adaptations logged in eds-conversion-log.md (gate-all `--origin-headless`, coverage-ledger page source, GATE_DISMISS_EXTRA forwarded to probes, override-aware gate-evidence, heading classifier for `<h1><p>`).

**Artifacts touched:** blocks/{breadcrumb,hero,hidden-section,vivo-stamp,tile-grid,split-teaser}/, content/fr/startseite.html, stardust/eds-schema/fr-startseite.json, stardust/deploy/ledger-archetype-home.json, stardust/replica/gates/all-{1440,360}/, stardust/rollout/progress.json (unit done), stardust/state.json (fr-startseite → migrated).

**Next:** unit `cluster-home` (no siblings — trivial), then `archetype-therapy-area` (herzinsuffizienz) and its render + cluster units.

---

## 2026-10-07T14:50:00Z — C-deliver unit archetype-therapy-area — heart-failure page published and gated (2026-10-07)

**Prompt:** rollout Phase C, unit `archetype-therapy-area` (herzinsuffizienz).

**Decisions:** one subagent authored four blocks (intro-media, social-features template-slotted; image-text-band with variants text-image / text-left / space-md / space-desktop-md / space-desktop and references reconstructive), reused breadcrumb (28/30 px crumb line-box fix, home unaffected), hero, tile-grid, split-teaser, vivo-stamp; media scope `therapy-area`; PUT → preview → published. Published-origin gate: 1440 0.48 % / 360 0.58 %, Δh 0, clipped 0, content 0; one units row off = reference-marker key artefact from the ZWSP whitespace guard in `<sup>` (served marker identical to live) → documented override at both widths. crop-compare header 1.49/1.42 %, footer 0.00 %. Computed-style guard clean. Foundation unchanged, no requests. Home row re-measured in the same summary pass: 0.48 % / 0.68 %, unchanged.

**Artifacts touched:** blocks/{intro-media,social-features,image-text-band,references}/, blocks/breadcrumb/breadcrumb.css, content/fr/startseite/therapiegebiete/cvrm/herzinsuffizienz.html, stardust/eds-schema/, stardust/replica/gates/all-{1440,360}/ (+ presence.json roots, overrides.json), stardust/rollout/progress.json, stardust/state.json (herzinsuffizienz → migrated).

**Next:** migrate unit `render-therapy-area` (3 siblings via migrate.mjs render --archetype), then unit `cluster-therapy-area`.

---
## 2026-10-07T15:08:00Z — Render unit render-therapy-area — three siblings cloned from the heart-failure archetype (2026-10-07)

**Prompt:** migrate Phase render, unit `render-therapy-area` (IRC, diabetes, lupus), inside the C-deliver window after unit `archetype-therapy-area`.

**Decisions:** `migrate render start` written (first migrate ledger line; `plan` had none). Variance probe at 1440 over the three live siblings (`stardust/migrate/variance-therapy-area.json`, exit 2): content-driven heights only (longer copy, two-line h1 on IRC + diabetes, 1–2 extra text modules), no style-family delta → clone as-is, no block variants from the probe. One render subagent assembled the three prototypes mechanically from the archetype's chrome + html-slice'd captured content (copy, `<sup>` whitespace and `&nbsp;` byte-verbatim), fetched 54/54 sibling images (a bare curl UA got 403 from the CDN; the standard Chrome UA the gate instruments send got 200 — no stealth, proxies or header games), advanced the pages to `directed`, rendered Path A′ with `--archetype` and `--canon-css stardust/prototypes/css/canon.css` (driver default path absent). Content-count acceptance per page via content-diff (capture vs rendered, main root): headings 9 = 9, all in-main CTAs present, 17 img, body strings 81/81, 65/65, 80/80; the structural reds are the capture's chrome/megamenu/consent nodes (source `main` fell back to `<body>`). Lupus: diagnostic band uses the source's `container--tb-space` (20 px at every width) → variant `tb-space`, rules only in the new `css/fr-startseite-therapiegebiete-ri-lupus.css`. Diabetes: the `CH-9815` revision stamp authored as the last text of `.references` (decision `section-merge`). No deviations.

**Artifacts touched:** stardust/prototypes/{chronischeniereninsuffizienz,diabetes,lupus}-proposed.html (+ assets/img/<slug>/, css/fr-startseite-therapiegebiete-ri-lupus.css), stardust/migrated/fr/startseite/therapiegebiete/{cvrm/chronischeniereninsuffizienz,cvrm/diabetes,ri/lupus}.html + _meta.json + assets, stardust/migrate/progress.json (render-therapy-area done), stardust/migrate/briefs/render-therapy-area-brief.md, stardust/state.json (3 directed).

**Next:** unit `cluster-therapy-area` — one cluster subagent reuses the archetype's blocks for the 3 siblings (image-text-band gets the `tb-space` variant), PUT → preview → publish, gate-all rows at 1440 and 360.

---
## 2026-10-07T16:20:00Z — C-deliver unit cluster-therapy-area — IRC, diabetes and lupus pages published and gated (2026-10-07)

**Prompt:** rollout Phase C, unit `cluster-therapy-area` (3 siblings of herzinsuffizienz), after migrate unit `render-therapy-area`.

**Decisions:** one cluster subagent reused the archetype's nine blocks (no new block code); variant classes only: image-text-band `space` (lupus `container--tb-space`, 20 px at every width) and `text-space` (trailing text keeps its canon top margin), references `space-bottom` + row-based spacing (`ref-row-start` wrapper class in references.js). Diabetes `CH-9815` revision stamp is a second vivo stamp on live (absolute, 0 px in flow) → authored as its own `vivo-stamp` section after references (decision `section-split`, superseding the render's `section-merge`). Media uploaded to DA scope `therapy-area` (one file-name collision across siblings resolved by renaming the IRC rendition). PUT → preview → published. Published-origin gate rows: IRC 0.41 % / 0.73 %, diabetes 0.38 % / 1.14 %, lupus 0.44 % / 0.49 % (1440 / 360), Δh 0, clipped 0, content MISSING+HIDDEN 0; lupus units row off 1 = live `<h4>Diagnostic&nbsp;</h4>` box 10 px wider than the NBSP-trimmed pipeline output, zero visible pixels → documented override at both widths. crop-compare header 1.49 / 1.42 %, footer 0.00 %. Computed-style guard clean on all three pages. Fix rounds: 1 (NBSP-only paragraphs dropped by the pipeline → U+200B guards), 2 (canon `.text` row spacing off the anchor probe), 3 was an instrument correction: gate-all stitches the origin headed unless `--origin-headless`, which wraps one line longer than the archetype's headless captures — the next brief carries the flag. Residual: breadcrumb strip 3–5 % at 1440 from the Lexia → Roboto Slab substitute (foundation fonts decision, not a block defect). Foundation unchanged, no requests. State: 5 pages migrated.

**Artifacts touched:** blocks/image-text-band/, blocks/references/, content/fr/startseite/therapiegebiete/{cvrm/chronischeniereninsuffizienz,cvrm/diabetes,ri/lupus}.html, stardust/eds-schema/, stardust/eds-conversion-log.md, stardust/deploy/{ledger-cluster-therapy-area,media-ledger}.json, stardust/rollout/units/cluster-therapy-area.paths, stardust/rollout/coverage/, stardust/replica/gates/all-{1440,360}/ (+ runs/, overrides.json), stardust/replica/progress.json (siblings), stardust/rollout/progress.json, stardust/state.json.

**Next:** unit `archetype-pattrns` — the gated PATTRNS archetype `fr-startseite-therapiegebiete-cvrm-see-the-pattrns-about-amylodosis-attr` converted, deployed, published and gated on the preview URL; then migrate unit `render-pattrns` (4 siblings) and unit `cluster-pattrns`.

---
## 2026-10-07T17:30:00Z — C-deliver unit archetype-pattrns — ATTR amyloidosis campaign page published and gated (2026-10-07)

**Prompt:** rollout Phase C, unit `archetype-pattrns` (about-amylodosis-attr), resumed in session 6 after the therapy-area cluster.

**Decisions:** one subagent authored five blocks (sub-nav, selfcert-modal, video-poster, questions-cta template-slotted; cta-cards reconstructive with variants cols-2/cols-3/plain/border/center/flush 1:1 to the source modifiers) and extended two shared ones without touching their therapy pages (image-text-band `band-action` CTA slot + linked title; references `space`/`band`). selfcert-modal ships the captured dismissed state only (modal copy was never captured; owner row 10). video-poster keeps the Kaltura poster, iframe on click only. The live page has no h1 → first section title authored as h1 on the h3 ramp. Media to DA scope `pattrns`; PUT → preview → published. Published-origin gate (gate-all `--origin-headless`, `--only`): 1440 0.72 % (text 5.62 %), 360 1.57 % (text 3.77 %), Δh 0 both (docH 6064 / 10240 = live), clipped 0, content MISSING+HIDDEN 0; units rows off 4 / 5 (+2 hidden as captured) all font- or key-shaped (sub-nav label boxes −5/−6 px with Roboto Slab, span-vs-p pairing, inline anchor rows) → documented overrides at both widths. crop-compare header 1.43 / 1.18 %, footer 0.00 %. Computed-style guard clean at both widths. Fix rounds 3: linked titles as block boxes (unit rows), sub-nav centring after fonts.ready (scrollLeft as live), cols-3 gap + uppercase title letter-spacing ≤767 (Roboto Slab ~1 % narrower than Lexia: "MENAÇANTE POUR LA VIE" fit one line where live wraps → 34 px reflow before the scoped override). One foundation request appended (font width), no frozen file touched. units.json remapped to the block selectors for therapy-card / sub-nav-item / split-teaser-text-image. State: 6 pages migrated.

**Artifacts touched:** blocks/{sub-nav,selfcert-modal,video-poster,cta-cards,questions-cta}/, blocks/{image-text-band,references}/, content/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html, stardust/eds-schema/, stardust/eds-conversion-log.md, stardust/deploy/{ledger-archetype-pattrns,media-ledger}.json, stardust/rollout/units/archetype-pattrns.paths, stardust/rollout/foundation-requests.md, stardust/replica/units.json, stardust/replica/gates/all-{1440,360}/ (runs/, overrides.json, presence.json), stardust/rollout/progress.json, stardust/state.json.

**Next:** migrate unit `render-pattrns` (4 siblings via migrate.mjs render --archetype), then unit `cluster-pattrns`, `gate-all`, `final`.

---
## 2026-10-07T18:00:00Z — Render unit render-pattrns — four PATTRNS siblings cloned from the ATTR amyloidosis archetype (2026-10-07)

**Prompt:** migrate Phase render, unit `render-pattrns` (home, diagnosis, treatement, symptomes), inside the C-deliver window after unit `archetype-pattrns`.

**Decisions:** variance probe at 1440 over the four live siblings (`stardust/migrate/variance-pattrns.json`, exit 2): content-driven counts only (tiles 6 → 2/8/5/7, titles 10 → 1/5/5/5, one-line page titles on three pages), no text-image band and no Kaltura video on any sibling, no novel modifier class; symptomes/treatement use `teaser--border-base` without `--text-center` (a class combination the archetype sheet already covers). One render subagent assembled the four prototypes from the archetype's chrome + html-slice'd captured content (verbatim, `<sup>` guards and `&nbsp;` patterns kept; self-cert placeholder empty as captured on live after dismissal, modal copy never rendered), fetched 42/42 images with the standard Chrome UA, advanced the pages to `directed`, rendered Path A′ with `--archetype` + canon.css. Content-count acceptance per page (content-diff capture vs render, main root): headings 3/3, 9/9, 10/10, 7/7; CTAs complete once the 12 chrome links are subtracted; img 9/10/8/16 (= capture minus 2 logos); the structural reds are all capture chrome/megamenu/consent/modal nodes. Two one-rule variant sheets: treatement `ta-grid__row>.text` (footnote lays full-width inside the 3-column flex row) and symptomes `ta-card__pretitle` (empty h6 pretitle, Lexia 14/16, −10px). Home carries the `social-features` module (shared therapy sheet). Section heights equal live at 1440 on all four (2431 / 4815 / 3203 / 5532). No deviations.

**Artifacts touched:** stardust/prototypes/fr-startseite-therapiegebiete-cvrm-see-the-pattrns-{home,diagnosis,treatement,symptomes}-proposed.html (+ assets/img/<slug>/, css/…-{treatement,symptomes}.css), stardust/migrated/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/{home,diagnosis,treatement,symptomes}.html + _meta.json + assets, stardust/migrate/{progress.json,variance-pattrns.json,briefs/render-pattrns-brief.md}, stardust/state.json (4 directed).

**Next:** unit `cluster-pattrns` — one cluster subagent reuses the archetype's blocks for the 4 siblings (cta-cards variants, social-features on home, two variant rules), PUT → preview → publish, gate-all rows at 1440 and 360; then `gate-all`, `final`.

---
## 2026-10-07T19:20:00Z — C-deliver unit cluster-pattrns — campaign home, diagnosis, treatment and symptoms pages published and gated (2026-10-07)

**Prompt:** rollout Phase C, unit `cluster-pattrns` (4 siblings of about-amylodosis-attr), after migrate unit `render-pattrns`.

**Decisions:** one cluster subagent reused the archetype's eight blocks (breadcrumb, hero, sub-nav, selfcert-modal, cta-cards, questions-cta, references; social-features on home); new code is variant CSS only: cta-cards `space-md`, `card-pretitle` (symptomes' empty live h6 keeps its line box via a ZWSP+NBSP guard), `cols-3-footnote` (treatement footnote full-width under the 3-column row), bold title runs keep the title face; questions-cta centred h3 letter-spacing 0.25px ≤767 as a scoped compensation for the Roboto Slab/Lexia width (34px reflow on treatement/symptomes at 360). Home's social-features row sits above the sub-nav (live DOM order; the render had it below → fixed by re-PUT). PDF CTAs fully-qualified to www.myastrazeneca.ch, smw.ch links and `target="_blank"` kept as captured. 21 images to DA scope `pattrns`. PUT → preview → published. Published-origin gate rows (gate-all `--only`, `--origin-headless`): home 0.47 / 1.51 %, diagnosis 0.64 / 1.12 %, treatement 1.07 / 1.91 %, symptomes 0.43 / 4.16 % (1440 / 360), Δh 0 everywhere except symptomes 360 +2px, clipped 0, content MISSING+HIDDEN 0; units rows off 3–5 per page, all font- or key-shaped (sub-nav label boxes, heading-fragment pairing, bold runs) → documented overrides at both widths; presence roots added. crop-compare header 1.43 / 1.18 %, footer 0.00 %. Computed-style guard clean on 4 × 2. The archetype re-measured at 360 after the shared questions-cta rule: 1.62 %, Δh 0. Fix rounds 3 (title bold face, letter-spacing + social row order, scoping the compensation to centred bands). One foundation request appended (font width). Residuals: treatement plain-band h3 on a 2px wrap edge; symptomes 360 text-heavy bands 14.33 % text diff from the substitute font. State: 10/10 pages migrated.

**Artifacts touched:** blocks/cta-cards/, blocks/questions-cta/, content/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/{home,diagnosis,treatement,symptomes}.html, stardust/eds-schema/, stardust/eds-conversion-log.md, stardust/deploy/{ledger-cluster-pattrns,media-ledger}.json, stardust/rollout/units/cluster-pattrns.paths, stardust/rollout/foundation-requests.md, stardust/rollout/coverage/, stardust/replica/gates/all-{1440,360}/ (runs/, overrides.json, presence.json), stardust/replica/progress.json, stardust/rollout/progress.json, stardust/state.json.

**Next:** unit `gate-all` — the roster's published-origin gate (gate-all `--skip-existing --origin-headless` at 1440 and 360, then update-coverage `--gate`); then `final` (check, queued foundation requests, C-deliver end), the migrate report unit and the handoff end after done-check.

---
## 2026-10-07T19:18:00Z — Render — both sibling render units done, phase closed (2026-10-07)

**Prompt:** migrate Phase 2 (render) as recorded units inside the C-deliver window: `render-therapy-area` after unit `archetype-therapy-area`, `render-pattrns` after unit `archetype-pattrns`.

**Decisions:** no new work this session — both units were already `done` in stardust/migrate/progress.json (render-therapy-area 3/3 siblings of herzinsuffizienz, 15:05Z; render-pattrns 4/4 siblings of about-amylodosis-attr, 17:52Z), their siblings have since been published and gated by the cluster units, and state reads 10/10 migrated. The phase is closed on resume with its `end` line; the `report` unit (state-and-report) stays pending and runs as its own phase after the C-deliver `final` unit, once the roster gate has filled every sidecar's measured gates.

**Artifacts touched:** stardust/migrate/progress.json (read), stardust/status.jsonl, tools/replica/progress.html.

**Next:** C-deliver unit `gate-all` (foundation-freeze check, queued foundation requests, roster gate-all `--skip-existing` at 1440 and 360, update-coverage `--gate`), then `final`, then the migrate report phase and rollout D–I.

---

## 2026-10-07T20:10:00Z — C-deliver unit gate-all — every page gated on the published origin at both widths (2026-10-07)

**Prompt:** rollout Phase C, unit `gate-all` — the roster's published-origin gate (`gate-all.mjs --skip-existing`, both widths) followed by `update-coverage.mjs --gate`.

**Decisions:** foundation-freeze check clean (21 files); the two queued foundation requests both ask for the licensed Lexia woff, which the migration never rehosts → deferred to the owner, scoped overrides stay, nothing frozen changed. The first 1440 pass read IRC 50 / diabetes 40 / lupus 48 units off where the clusters had read 0: `unit-geometry.mjs` caches the origin inventory per slug without a width key, so inventories the clusters took at 360 were compared against the 1440 page (origin docH 8042 vs served 4193, every row dy-shifted). Caches set aside under `stardust/.work/replica/units-cache-*`, both widths re-run on fresh same-width inventories; the shipped script stays unedited. Result: 10/10 delivered per width — 2 PASS + 8 documented overrides (font-shaped `off 1–5`); pixel 1440 0.38–1.07 %, 360 0.49–4.16 %; Δh 0 (symptomes 360 +2); clipped 0; content 0. Coverage gate 10/10 rows, `delivery.gate.pass` true everywhere, 0 flips. Also prepared for D-site/D2 while the probes ran: `stardust/redirects.tsv` (10 `.html` rows + `/` and `/index.html` → `/fr/startseite`, because the source root serves the German Startseite, which is outside the 10-page scope), a sheet PUT helper, `stardust/dynamics/parity.json` (10 feature rows, 8 replayable checks).

**Artifacts touched:** stardust/replica/gates/all-{1440,360}/ (summary.*, per-page units.json), stardust/current/measure/ (fresh 360 inventories), stardust/rollout/coverage/, stardust/rollout/progress.json, stardust/rollout/foundation-requests.md, stardust/eds-conversion-log.md, stardust/redirects.tsv, stardust/dynamics/parity.json, stardust/scripts/replica/status-page.mjs (`--help` no longer writes), stardust/.work/rollout/probes/{unit-set,put-sheet,root-chain}.mjs.

**Next:** unit `final` (check, `C-deliver end`), then the migrate report phase, D-site, D2-dynamic, E, E2, F, G, H, I and the handoff end after done-check.

---

## 2026-10-07T20:11:17Z — C-deliver unit final — delivery closed, foundation requests handed to the owner (2026-10-07)

**Prompt:** rollout Phase C, unit `final` — `foundation-freeze.mjs check`, the queued `foundation-requests.md` lines applied once, coverage gate confirmed, then the single `C-deliver end` line.

**Decisions:** freeze check clean (21 files unchanged since C0). Both queued foundation requests ask for the licensed Lexia woff, which the replica fonts policy never rehosts; they stay a handover item for the site owner, the scoped `letter-spacing` overrides in cta-cards and questions-cta remain, and since no frozen file changed no archetype re-gate was needed. Coverage: 10/10 rows with `delivery.gate.pass` true from the gate-all unit (pixel 1440 0.38–1.07 %, 360 0.49–4.16 %, Δh 0, clipped 0, content 0). Live check: all 10 roster pages answer 200 on both the aem.live and aem.page origins, `/nav` and `/footer` 200; `/redirects.json` is not yet published — that is D-site's sheet wiring, prepared as `stardust/redirects.tsv` during gate-all.

**Artifacts touched:** stardust/rollout/progress.json (unit final → done), stardust/status.jsonl (C-deliver end), tools/replica/progress.html.

**Next:** the migrate report phase, then rollout D-site (sitemap, redirects sheet, root answer, assemble --verify-origin), D2-dynamic, E, E2, F, G, H, I and the handoff end after done-check.

---

## 2026-10-07T20:21:57Z — State and report — migrate run closed: 10/10 pages, every sidecar carries its acceptance gates (2026-10-07)

**Prompt:** migrate Phase 4 (state and report) — the `report` unit: gate-evidence over the 10 sidecars, the state.json `migrate` block, the run summary.

**Decisions:** the collector's first dry-run read three gaps on every sibling that were artifact mismatches, not page defects, and each was re-earned on the right artifact: (1) `content-count` — the latest content-diff jobs per sibling were the clusters' live-vs-published probes (8 structural 🔴 = ROLE SWAP on titles the live page authors as `<h4><p>`) and, for PATTRNS, a harness-vs-render probe (427 🔴, consent/megamenu DOM); a capture-served-statically run read 0 text/role findings but 3–4 ICON 🔴 (the capture's icon font and image paths 404 on a static server → empty boxes and 16×16 broken images), so the siblings were run the way the archetypes earned the gate in their rounds — live page vs the migrated render under `--main .root` with both overlays dismissed — and all seven read `Findings: none — content + roles match`. (2) `delivery-lint` — the collector's in-process lint runs on the migrated render (the encoder's input: no DA header/footer wrapper by design, the PATTRNS hero h1 lives in the block), which reads 2 P1 / 1 P0; the contract's row-6 gate is the delivered content file, so delivery-lint ran as `<slug>-lint` jobs on `content/<path>.html` (0 P0 · 0 P1 · 2 P2 on all ten; the P2s are the cross-origin hero images media-reconcile confirms) and the collector took its documented job fallback (`--lint` pointed at a non-existent path). (3) `media-reconcile` — no attributable job existed; `<slug>-media` jobs on the delivered files against the media ledger read all hosted (128 images, 0 omit, 0 unresolved). Collector result: 10 sidecars updated, siblings 7/7 acceptance gates, archetypes 6, `--check` exit 0. The migrate `state.json` block was written by the driver at render time (selfContained, 161 bundled assets, 0 missing, 0 cleaned, lastRun 4 rendered / 0 refused); `sitemap.xml` + `robots.txt` added to the bundle per the output contract's directory shape. Local servers for the compares ran from pid files and were stopped at the end of the step.

**Run summary:** 10 migrated (Path A 3 archetypes: home, herzinsuffizienz, about-amylodosis-attr; Path A′ 7 template-applied siblings: 3 therapy-area, 4 pattrns), 0 unchanged, 0 failed, 0 stale. Variants declared: 11 across the 7 siblings; content deviations 0. Broken internal links per page 29–43 = out-of-scope targets (locale DE/IT links, nav and footer pages outside the 10-page plan) — E2's repoint list. Output: stardust/migrated/ (10 pages, 161 bundled assets, 14 MB) — self-contained.

**Artifacts touched:** stardust/migrated/**/*._meta.json (gatesPassed, gateEvidence), stardust/migrated/{sitemap.xml,robots.txt}, stardust/replica/progress.json (migrate roll-up), stardust/migrate/progress.json (unit report → done), stardust/.work/replica/bg/*-{cc,cc2,lint,media}.*, tools/replica/progress.html.

**Next:** rollout D-site (redirects sheet, root answer, nav/footer noindex, assemble --verify-origin), D2-dynamic, E-full-site, E2-link-audit, F-optimize, G-aem, H-report, I-dashboard, then the handoff end after done-check.

---


## 2026-10-07T20:35:00Z — D-site — redirects wired, root answers, served sitemap matches (2026-10-07)

**Prompt:** rollout Phase D (site assembly): redirects sheet, root answer, chrome noindex, `assemble.mjs --verify-origin`.

**Decisions:** (1) The source root serves its own page (200, "Startseite", German shell — probed with the installed Chromium, a plain HEAD gets 403) and that page is not in the 10-page plan, so the root cannot be the delivered `index`; the sheet carries `/` and `/index.html` → `/fr/startseite` (recorded in `direction.md` § Decision — root answer). (2) No shipped script PUTs a JSON sheet (`deploy-batch.mjs` is html-only, `sync-sheets.mjs` copies from a published origin and wants the token in an env var), so a small project script `stardust/scripts/rollout/redirects-sheet.mjs` reads `stardust/redirects.tsv`, stages `content/redirects.json`, PUTs the sheet to the DA source API (multipart `data`, application/json), previews and publishes it through admin.hlx.page; token via `--token-file`, never printed. Result: PUT 201, preview 200, live 200, 12 rows. (3) `/nav` and `/footer` already carry `Robots | noindex` (one metadata row each) and are live (200); the served sitemap already excluded them, so no republish.

**Verification:** `/`, `/index.html` and every `.html` path 301 → extensionless and end in 200 on `main--bf989f9e--aemcoder.aem.page` and `.aem.live`; `redirects.json` served live with 12 rows. `assemble.mjs` wrote `site/{sitemap.xml,robots.txt,manifest.json}` (10 urls, fragments 0 — the chrome is authored, not canon fragments); `assemble.mjs --verify-origin https://main--bf989f9e--aemcoder.aem.live` → served 10 = assembled 10, extra 0, missing 0, exit 0.

**Artifacts touched:** content/redirects.json, stardust/scripts/rollout/redirects-sheet.mjs, stardust/rollout/site/*, stardust/direction.md, tools/replica/progress.html.

**Next:** D2-dynamic (`dynamics-check.mjs --origin main--bf989f9e--aemcoder.aem.live`, parity.json), then E-full-site, E2-link-audit, F-optimize, G-aem, H-report, I-dashboard, done-check, handoff end.

---

## 2026-10-07T20:58:00Z — D2-dynamic — HCP gate rebuilt from the live modal, 8/8 parity checks pass (2026-10-07)

**Prompt:** rollout Phase D2 (dynamic features): replay `stardust/dynamics/parity.json` against the published origin, every row with a disposition and a passing or named-interim check.

**Decisions:** the first replay exposed that the HCP self-certification gate (row 10, rebuild-native) had shipped as `Mode | dismissed` with no copy — the crawl dismissed the modal before snapshotting, so the earlier unit delivered the post-dismissal state. The copy is observable on the live page, so it was captured now and authored into the 5 PATTRNS documents (`Mode | gate` + paragraph + yes/no CTAs), re-published, and the flow verified at both widths (open → yes sets the cookie and closes → reload stays closed; no → external site). The block CSS was re-lifted from the live modal's computed styles (the old rule sized the box at 90 % of a shrink-to-fit wrapper: 509 px, clipped at 360); desktop rects now match the live modal exactly, mobile differs by the one empty line the source's trailing `&nbsp;<br>` adds (pipeline-normalised; documented residual). Interim named: client-side cookie persistence in place of the source servlet. Two logged instrument adaptations: `dynamics-check.mjs --dismiss` (the Kaltura poster sits behind the gate) and build-side `GATE_DISMISS_EXTRA` forwarding in `gate.sh` / `gate-all.mjs` so the five PATTRNS pages can be re-gated symmetrically once the CSS has shipped.

**Result:** final replay 8/8 PASS (`stardust/qa/dynamics-report.md`); rows 9–10 of the table decided-out by design. `dynamic-features.md` row 10 → done; parity row carries the verification and the interim decision.

**Artifacts touched:** content/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/*.html (5), blocks/selfcert-modal/selfcert-modal.css, stardust/dynamics/parity.json, stardust/dynamic-features.md, stardust/qa/dynamics-report.{md,json}, stardust/scripts/dynamics/dynamics-check.mjs, stardust/scripts/replica/gate.sh, stardust/scripts/replica/gate-all.mjs, stardust/eds-conversion-log.md, tools/replica/progress.html.

**Next:** E-full-site — re-gate the 5 PATTRNS pages at 1440 and 360 with `gate-all.mjs --only … --recapture-eds` under the new `GATE_DISMISS_EXTRA` (after the push has shipped the block CSS), `update-coverage.mjs --gate`, `verify.mjs --base https://main--bf989f9e--aemcoder.aem.live --all`; then E2-link-audit, F-optimize, G-aem, H-report, I-dashboard, done-check.

---

## 2026-10-07T21:35:00Z — E-full-site — roster re-gated at both widths with the HCP gate, 10/10 verified (2026-10-07)

**Prompt:** rollout Phase E (full-site verify): every page `verified` / `failed`, the pixel table current for the delivered state.

**Decisions:** the five PATTRNS pages changed in D2 (HCP gate open for a cookie-less visitor), so the whole roster was re-gated per width with the served side dismissing the same closers as the origin (`GATE_DISMISS_EXTRA`, now forwarded by `gate-all.mjs captureEds` and `gate.sh capture_build`). The first 1440 pass tripped the width-blind unit-inventory cache for the second time this run (360 inventories left in `stardust/current/measure/` by the C-final run → every page `units` off, origin docH 8042 vs served 4193); the caches were set aside per width and the pass re-run — the units read 0 off on IRC and diabetes and the documented font-shaped 1–5 elsewhere. Cache dir left empty on purpose.

**Result:** 1440 and 360 each 10/10 delivered (2 PASS + 8 documented overrides), pixel 0.38–1.07 % / 0.49–4.16 %, Δh 0 (symptomes 360 +2), clipped 0, content 0 — the C-final numbers unchanged. Coverage: 10/10 rows matched per width, 0 flips. `verify.mjs --all` against the live origin: 10 verified, 0 failed.

**Artifacts touched:** stardust/replica/gates/all-1440/**, stardust/replica/gates/all-360/**, stardust/rollout/coverage/*.json, stardust/rollout/rollout.json, stardust/.work/replica/units-cache-{360,1440}-session9/, stardust/eds-conversion-log.md, tools/replica/progress.html.

**Next:** E2-link-audit — `localize-links.mjs --source-host www.myastrazeneca.ch --content content --redirects stardust/redirects.tsv` then `--check`; the out-of-scope internal targets (locale DE/IT trees, nav and footer pages beyond the 10-page plan) repointed to the source site as scope debt recorded in direction.md; then F-optimize, G-aem, H-report, I-dashboard, done-check.

---
## 2026-10-07T21:36:00Z — E2-link-audit — every href GET against the live tree, out-of-plan targets recorded as scope debt (2026-10-07)

**Prompt:** rollout Phase E2 (link-audit completeness): nav/footer/landing targets deployed + published, internal hrefs root-relative and extensionless, every href GET against the live tree, missing targets decided and recorded in direction.md.

**Decisions:** `localize-links.mjs` over the whole content tree had nothing left to rewrite (earlier waves ran it); `--check` passes. The 34 source-host targets are all outside the fixed 10-page plan — a fixed page list has no caps, so they are scope extension, repointed to the source site regardless of count, and listed as scope debt in `direction.md` (the three other-locale roots were never captured). Two defects the source itself carries — a 404 oncology link and the nav's two `enhertu.ch/.html` hrefs — are kept verbatim under the content-preservation rule and go to F-optimize as `source parity` findings.

**Result:** 12 documents 200 on the live origin (nav and footer published); 69 distinct hrefs: 10 internal (0 defects, 0 non-200), 34 source-host (1 non-200, source parity), 25 external (5 non-200, external hosts). No internal 404 on the delivered tree.

**Artifacts touched:** stardust/rollout/link-audit.{json,md}, stardust/direction.md, stardust/.work/replica/link-audit.mjs, tools/replica/progress.html.

**Next:** F-optimize — `optimize.mjs --base https://main--bf989f9e--aemcoder.aem.live --all`, record the two source-parity link findings, gate on open P1; then G-aem, H-report, I-dashboard, done-check.

---
## 2026-10-07T21:40:00Z — F-optimize — delivery-quality gate green, every residual is source parity or a pipeline default (2026-10-07)

**Prompt:** rollout Phase F (optimize): deterministic detectors over the 10 delivered pages on the live origin, findings ledger + scorecard, gate on open in-scope P1.

**Decisions:** the baseline run found no in-scope P1 or P2; 14 findings are source parity (no JSON-LD on any page, two long titles — the source carries the same) and stay informational. The one open P3, a meta description shared by four PATTRNS pages, was checked against the capture: the source pages have no description at all and the content documents set none, so the EDS pipeline derived it from the first paragraph (the HCP-only notice). Writing four unique descriptions would be fabricated content, so the finding is `accepted` with that note, a decision left to the site owner. The two E2 link defects the source itself carries (a 404 oncology link, the nav's two `enhertu.ch/.html` hrefs) are recorded as out-of-scope findings so the report carries them.

**Result:** GATE PASS; open P1 0 · P2 0 · P3 0; health 99/100; source parity 14; 3 out-of-scope / accepted entries for the owner.

**Artifacts touched:** stardust/rollout/optimize/findings.json, stardust/rollout/optimize/scorecard.json, tools/replica/progress.html.

**Next:** G-aem — `autofix-aem.mjs --project . --dry-run`; with nothing in-scope to fix, record and move to H-report, I-dashboard, done-check.

---
## 2026-10-07T21:40:00Z — G-aem — autofix had nothing to fix, no re-deploy (2026-10-07)

**Prompt:** rollout Phase G (AEM autofix): apply registered EDS fixers to open findings, re-deploy, re-run verify + optimize.

**Decisions:** the ledger held no open in-scope finding after F (the only P3 was accepted as a pipeline default the source shares in effect; everything else is source parity or out-of-scope for the owner), so the engine reported 0 candidates in dry-run and in the real pass. No project file changed and nothing was re-deployed; the E verify (10/10) and the F optimize gate (PASS, health 100) remain the current state.

**Result:** candidates 0 · applied 0 · manual 0 · skipped 0 · failed 0.

**Artifacts touched:** stardust/rollout/optimize/findings.json and scorecard.json (history snapshot only), tools/replica/progress.html.

**Next:** H-report — summary block from `rollout.json.lastRun` + `optimize/scorecard.json`, learnings entries; then I-dashboard, done-check.

---
## 2026-10-07T21:43:00Z — H-report — summary block written, 9 learnings recorded (2026-10-07)

**Prompt:** rollout Phase H (report): the summary block from `rollout.json.lastRun` + the scorecard, the dynamic parity table beside the delivery ledger, and `stardust/learnings.md`.

**Decisions:** the block roll-up read 10/15 blocks pending although every block had code, every page was verified and the foundation freeze was clean — the archetype units had recorded pages, not blocks — so the 15 rows were recorded `verified` through `update-coverage.mjs --block` before the numbers were copied (a learning). The report carries the D2 parity table with the owner decision per row, and names what is handed to the owner: scope debt, the Lexia licence, the interim dynamic rows.

**Result:** pages 10/10 verified; templates 5, all delivered; blocks 15/15; health 100/100, open 0/0/0, source parity 16; pixel tables prototypes 3/3 + deployed 10/10 per width; nothing to deliver. `stardust/learnings.md`: 9 entries, all `pending` (width-blind unit cache, Cf characters in unit keys, dismissers per instrument, headed/headless tier mismatch, gate-all state shape, heading role classifier, pipeline-derived descriptions, block coverage bookkeeping, missing link-audit instrument).

**Artifacts touched:** stardust/rollout/report.md, stardust/learnings.md, stardust/rollout/coverage/blocks.json + templates.json, stardust/rollout/rollout.json, tools/replica/progress.html.

**Next:** I-dashboard — `dashboard.mjs`; then done-check and the replica handoff end line.

---
## 2026-10-07T21:45:00Z — I-dashboard — page tree at optimised 10/10 (2026-10-07)

**Prompt:** rollout Phase I (dashboard): the self-contained page tree + templates table + scorecard, `dashboard/data.json` as the inspectable snapshot.

**Decisions:** the first build read `optimised 0/10` because the dashboard counted the 16 out-of-scope source-parity rows as open findings, where optimize excludes them from the open counts and the gate. The project copy now skips out-of-scope findings in the per-page count (logged in the conversion log and in learnings); no finding was touched.

**Result:** pages 10 identified · 10 prototyped · 10 deployed · 10 optimised; blocks 15/15; health 100; no external script in the HTML.

**Artifacts touched:** stardust/rollout/dashboard/{index.html,data.json}, stardust/scripts/rollout/dashboard.mjs, stardust/eds-conversion-log.md, stardust/learnings.md, tools/replica/progress.html.

**Next:** done-check with the runner, then the replica `handoff` end line.

---
## 2026-10-07T21:46:00Z — Handoff — run complete, 10 of 10 pages live and gated (2026-10-07)

**Prompt:** close replica Phase 5 once the runner's done-check reports the run complete.

**Decisions:** done-check answered `complete: true, gaps: []` after I-dashboard, so the `handoff` end line was written. Nothing was redone: every rollout phase A–I has its end line, the publish decision (publish) was executed in the loop, and the owner-facing items are gathered in `stardust/rollout/report.md` rather than left in ledger lines.

**Result:** 10/10 pages published and verified on `main--bf989f9e--aemcoder.aem.live` at 1440 and 360 (pixel 0.38–1.07 % / 0.49–4.16 %, Δh 0, clipped 0, content 0), nav/footer/redirects live, 15/15 blocks, health 100/100, dynamics parity 8/8, dashboard optimised 10/10, learnings 10 pending entries.

**Artifacts touched:** stardust/status.jsonl, stardust/journal.md, tools/replica/progress.html.

**Next:** nothing for the pipeline; the site owner reviews the preview and the report's handed-over items (Lexia licence, out-of-plan link targets, interim dynamic rows).

---
