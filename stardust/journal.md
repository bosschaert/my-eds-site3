# Journal — replica migration of https://www.niravmanubhai.com/

## Extract — one page captured live, fonts and CSS harvested (2026-10-12)

Bounded single-page entry (`extract --single --dynamics`); scope fixed to `/` by
`stardust/.labs/site-plan.json`. `crawl.mjs` captured the home page headless
(HTTP 200, waitMode medium then slow, 12 images, 10 headings, 3965 chars of
main text, full-page screenshot 1440×7593). No bot wall: the only
Cloudflare traffic is the passive `cdn-cgi/challenge-platform` beacon and RUM.

Vision check: ok. Hero ("Come, Sit." + Gujarati line over the courtyard photo),
palette and wordmark match the pixels. Two image boxes (the host portrait and the
"My Study" card) paint blank in the crawler's full-page screenshot only; a live
probe shows all 12 images complete and visible and clipped captures paint them.
Recorded in `_crawl-log.json#visionCheck`.

Harvested beyond the crawl: the page stylesheet
(`current/assets/css/home.css`, 1190 rules), the Google Fonts CSS and 29 woff2
files (Playfair Display, Inter, Rasa — latin, latin-ext and Rasa's Gujarati
subset; all open-licence, self-hostable), and the computed-style census at
1440 and 360 (`current/_computed-styles.json`). The logo is a text wordmark
("Nirav Manubhai"), not an image. The hero `<picture>` carries
`data-nmh-seasonal-default="diwali-courtyard-2026"` — a seasonal asset switch
to note for capture-state policy.

Dynamic surface (reach): 2 same-site data endpoints (both Cloudflare telemetry),
GA4 collect, no forms, no modals, no players. Depth and dispositions follow in
Phase 2 (dynamics triage).

Bounded run: no `current/PRODUCT.md`/`DESIGN.md`/`DESIGN.json` were
synthesized; Phase 2 takes the bounded promotion branch.

## Preserve direction — bounded-single spec synthesized, empty register, dynamics triaged (2026-10-12)

No `current/PRODUCT.md`/`DESIGN.md`/`DESIGN.json` existed (bounded entry), so the
spec was synthesized, not promoted: `stardust/replica/tokens.json` lifts palette, type
ramp, buttons, header, container model and spacing from the site's own `:root` custom
properties, `home.css` rules and the 1440/360 census; `cap-probe.mjs` measured the cap
model (fluid shell, 1184px content cap on 5 of 7 sections, 1100px Story Nursery band,
full-bleed hero) into `current/DESIGN.json`, carried verbatim into the root
`DESIGN.json`. Root `PRODUCT.md`, `DESIGN.md`, `DESIGN.json` carry provenance
`bounded-single`. `stardust/direction.md` records the branch.

Register: empty — pure replica. Nothing is permitted to change.

Dynamics: detector found 6 findings, all telemetry or metadata (GTM/gtag, GA4,
Cloudflare Insights + bot-management frame, hreflang alternates, GTM dataLayer). No
forms, players, search or client-rendered content. Curated into 4 rows in
`stardust/dynamic-features.md`; tags ship OFF on the new host (hands-off interim tier,
owner decision named: property `G-00QDEH6N5W`); hreflang alternates are re-emitted at
deploy. Static recreation is unblocked.

Finding worth remembering for recreation: the hero's "Come, Sit. / આવો, બેસો." is
painted into the photograph; the `<h1>` is `sr-only`. The header is a text wordmark.

## Recreate — landing archetype authored from captured content and lifted CSS, gated at 1440 and 360 (2026-10-12)

One page type (`landing`), one archetype: `stardust/prototypes/index-proposed.html` with
`css/canon.css` (tokens, self-hosted @font-face, base type, container, buttons, header, drawer,
footer, back-to-top, reading-progress) and `css/index.css` (the seven sections). Content verbatim
from `current/pages/index.json`/`index.html`; every value lifted from `home.css` through
`css-rules.mjs` (per-section notes in `stardust/replica/lift/index-notes.md`); images and six
responsive renditions harvested into `current/assets/images/` with the live `srcset`/`sizes` and
`<picture>` source. Fonts: Google serves different builds per UA — the gate's Chrome/143 gets
unhinted files whose advances differ from the Chrome/129 capture; the prototype self-hosts the
Chrome/143 set (`fonts/gf143/`), which reproduced the live line breaks exactly. `measure.mjs` on
12 section selectors: Δ0 at both widths; roots 7599 (1440) and 7972 (360) on both sides.

Gate (prototype regime, `#main`, marker "Nirav Manubhai"), three `--full` rounds per width:
- 1440: iter1 0.17 % / Δh −31 px → the build capture read the document before the lazy "My Books"
  image loaded; live declares 1536×1024 for a 1672×941 file, so the pre-load page is 31 px taller.
  Prototype declares the true size → iter2 0.17 % / Δh 0. iter3 0.05 % / Δh 0 after the fix below.
- 360: 0.15 % → 0.15 % → 0.04 %, Δh 0 throughout.
- content-diff none (main + chrome), chrome-parity quiet, clip 0, overflow 0 at both widths;
  header crops 1.22 % / 1.23 % (thin-edge texture, under the 2 % bar), footer crops 0 %;
  cap-probe PASS at 2560 (8 rows); prototype table `gates/prototypes-{1440,360}/` PASS.
- visual-diff: 9/8 STRETCHED IMAGE advisories — the live `object-fit: cover` crops, justified.

Interaction parity: `motion-observe` live (menu poke + 6 hover families) found the drawer `open`
toggle, the back-to-top `show` toggle, and 398 `width` transitions on `div.nm-reading-progress >
span` — a 2 px scroll-progress bar injected by site-enhancements.js, absent from the authored
HTML and therefore missed by the first build; `motion-compare` named it MISSING. Added (markup,
lifted CSS, minimal rAF scroll handler with the live formula); the re-observed build reports
6 parity / 0 missing / 0 extra. Hovers measured no change on live → none authored beyond the lift.
Header is sticky and constant (no morph). `progress.json` carries the per-breakpoint results,
justified flags, capture-state notes and the motion inventory. Archetype approved hands-off.

## Migrate plan — one approved archetype in scope, canon auto-bootstrapped (2026-10-12)

Handoff opened (`replica handoff start`). Migrate Setup found no `stardust/canon/`: bootstrapped it
from the approved prototype — `header.html`, `footer.html`, `nav-drawer.html` (overlay + drawer),
`reading-progress.html` lifted verbatim, `canon.css` = the prototype's shared layer with a provenance
comment; `DESIGN.json.extensions.canon` records files + shas, `source: "auto-bootstrap: index"`.

```
migrate plan
============
In scope: 1 page
  Path A  (approved)   1 page: index → /  (index.html), tier archetype
Skipped:  0 stale, 0 unscoped
DESIGN.md sha 94644f4 · DESIGN.json sha ec019f9 · canon header:0bc3b6b4 footer:0b2134b6 css:ebb948a8
Provenance OK on 1 page (live playwright capture, 200). Mobile-adapt: viewport ok, 12 max-width
rules, ≤640 px breakpoints present. Dynamic surface: stardust/dynamic-features.md present (4 rows).
Output: stardust/migrated/ + _meta.json sidecar; idempotent skip enabled.
```

Units in `stardust/migrate/progress.json`: `plan` done; `render-landing`, `assets`, `report` pending.
No siblings exist, so the landing render is the archetype itself (Path A) and runs next.

## Migrate render — index placed at / with sidecar, content count unchanged (2026-10-12)

`migrate.mjs render index`: `A index → index.html (landing; 32 assets, 33 links, 30 broken, 7
sections)`, rendered 1 / refused 0. Provenance comment first in `<head>`, canon `:root` first in the
first `<style>`, canon.css + index.css + fonts + 18 images bundled under `migrated/assets/`.
Content count rendered = prototype (12 headings, 12 img, 40 a, 44 p) — `content-count` gate recorded
with the recreate content-diff ("findings none") as evidence. The 30 "broken" internal links are
19 distinct site pages outside this run's one-page scope (`/kabir-vaidya`, `/stills`, `/my-books` …,
`/privacy`, `/sitemap`): recorded as a `link-scope` decision — they are repointed to the source
origin at delivery, never left as 404s. Two `dynamic-dependency` deviations: tags off (GTM/GA4 +
Cloudflare analytics, owner decision pending) and hreflang alternates re-emitted at deploy.
Unit `render-landing` done; `assets` and `report` next.

## Migrate assets — bundle self-contained, portability audits clean (2026-10-12)

Sitewide assets: the capture carries no logo file (the header is typographic) — warned, continued;
favicon bundled; `robots.txt` + `sitemap.xml` written under `stardust/migrated/` for the one URL.
The 30 internal hrefs to the 17 out-of-scope site pages, which the page map had rewritten to
`./<slug>/index.html`, were repointed to `https://www.niravmanubhai.com/<slug>` per the recorded
`link-scope` decision (`stardust/.work/migrate/probes/repoint-out-of-scope.mjs`, sidecar-driven).
Audits: no `../current/` escapes, no absolute `href`/`src`/`url(/…)`, no directory-only hrefs,
`pagemap-audit: OK (1 entries)`, `file-protocol-audit: OK (1 pages)`. `state.json.migrate` written
by the driver (selfContained true, 32 assets). Unit `assets` done; `report` next.

## Migrate state-and-report — 1 page migrated, state advanced (2026-10-12)

```
migrate complete
================
   1 migrated     index  (Path A, tier archetype, 32 assets, 7 sections)
   0 unchanged    0 failed    0 stale skipped
Render branches:  Path A 1 · Path A′ 0 · Path B 0
Decisions:        index  link-scope (30 hrefs / 17 out-of-scope targets → source origin)
Deviations:       index  dynamic-dependency ×2 (tags off pending owner; hreflang re-emitted at deploy)
Broken internal links after repoint: 0
```

`state.mjs advance index --to migrated` (approved → migrated, migratedPath set). Migrate units all
done. Rollout follows: A-inventory on `stardust/migrated/`.

## Rollout A-inventory — one page, one template, coverage seeded (2026-10-12)

`inventory.mjs --site-url https://www.niravmanubhai.com/ --state stardust/state.json`: pages 1
(index → `/`, pending), templates 1, blocks 0 (sidecar `modules[]` still empty — filled in B-block
once the block names lock, then the inventory is re-run). `rollout.json` DA coordinates set:
org `aemcoder`, site `9552f862`, ref `main`, live host `main--9552f862--aemcoder.aem.live`.
Gated-archetype precondition: landing archetype passes at 1440 (0.05 %) and 360 (0.04 %), Δh 0.

## Rollout B-block — nine blocks locked from the seven prototype sections (2026-10-12)

Single-page naming ceremony (block name = section class): `hero`, `host`, `story-nursery`,
`doors` (4 reading-doors, reconstructive), `books`, `rooms-also` (reconstructive), `bouquet`,
`conversation`, `departure`; the `rooms` intro stays default content under a `rooms` section style;
chrome `header` (with drawer, overlay, reading-progress, back-to-top) and `footer` from `/nav` and
`/footer`. Tiers, D1/D11 triage and the publish decision (publish) are in
`stardust/eds-conversion-log.md`. `section-schema.mjs` → `stardust/eds-schema/index.json`
(7 sections, one repeat group `A.reading-door` × 4 non-uniform, 53 editable texts);
`style-fingerprint.mjs` → one variation group in `rooms`. Sidecar `modules[]` set (9 ids), inventory
re-run, `blocks.mjs`: 9 distinct module blocks, `plan.mjs`: index is the representative, converts all
nine. The prototype is served from `localhost:8791` (python http.server, PID in
`stardust/.work/rollout/proto-server.pid`).

## Rollout B2-dynamic — inventory re-verified, no new rows (2026-10-12)

Fresh detect on the live page: 6 findings, the same set Phase 2 triaged into 4 rows (two merges).
Plan against the target origin: host-bound 0/0, owner batch 4 (tags stay off pending the owner),
self 1 (hreflang alternates, emitted at deploy). No new evidence → no new rows; every row
dispositioned. Verification note appended to `stardust/dynamic-features.md`.

## Rollout C-deliver — one page delivered and gated on the published origin, foundation requests applied (2026-10-12)

Units: `foundation` (nav + footer live, shell gated), `archetype-landing` (index → `/`, 9 blocks, preview gate
1440 1.41 % / 360 0.63 %, two rounds — the second traced an 11.56 % mobile diff to fonts.css loading lazily
below 900 px and shipped a scoped hero override plus a foundation request), `cluster-landing` (no siblings),
`gate-all` and `final` in this session. C-final applied the two queued requests once: `loadFonts()` runs in
loadEager at every width (hero override removed) and the header title renders as `span.nmh-title-property`
(tag parity with the live header). Code pushed to `main`; both origins served it before the roster gate ran
with fresh captures: 1440 1.41 % Δh −1, 360 0.63 % Δh 0, clip 0, content MISSING/HIDDEN 0 at both widths;
chrome-parity 0 deltas (header 3/3, footer 7/7). Coverage `delivery.gate` written from both summaries, no
status flips; foundation re-frozen (21 files). Publish decision: publish — the page is live on
`main--9552f862--aemcoder.aem.live`.

## Rollout D-site — site files assembled, served sitemap matches, root answers (2026-10-12)

The source root serves a page (no redirect chain), so it is delivered as the root `index` document and the
redirects sheet carries no `/` row; `stardust/redirects.tsv` does not exist for this one-page run, so no sheet
is wired. `curl -sIL` on the preview root ends in 200; `/nav` and `/footer` are live (200) and carry
`Robots: noindex` — the served sitemap lists exactly one URL, `/`. `assemble.mjs --verify-origin` exit 0:
served 1 = assembled 1, extra 0, missing 0; `site/{sitemap.xml,robots.txt,manifest.json}` written under
`stardust/rollout/` (expected set; the platform serves its own sitemap).

## Rollout D2-dynamic — four parity rows replayed on the live origin, hreflang rebuilt (2026-10-12)

`stardust/dynamics/parity.json` carries the four inventory rows. The one self-owned row still pending —
hreflang `en` + `x-default` — is rebuilt natively in `scripts.js` loadEager (both self-referential, as the
source does), pushed and served before the replay; the foundation manifest was regenerated afterwards.
`dynamics-check.mjs` against `main--9552f862--aemcoder.aem.live`: dom-count 2 hreflang links, no page errors,
consent-gate 0 requests to GTM/GA hosts, 0 to Cloudflare Insights — 4/4 PASS. The two tag rows stay
`scaffolded-awaiting-owner` with the decision named (property id, consent banner); the dataLayer row is done
with nothing to ship. No `/query-index.json` consumer on this site, so no index or search page is built.

## Rollout E-full-site — one page verified on the live origin, interactions at parity (2026-10-12)

`verify.mjs --all --base https://main--9552f862--aemcoder.aem.live`: checked 1, verified 1, failed 0 (reachable,
no `about:error`, internal hrefs resolve, `delivery.gate.pass` true from the roster table at both widths).
Headless render check on the template's only page: `motion-observe` on the published `/` with the archetype's
pokes (menu button + 6 hover families) against the live-source observation — drawer `open`, back-to-top `show`,
reading-progress `width` transitions (398/398), opacity/transform/visibility 200 ms: 6 parity, 0 missing,
0 extra. `restoreAtDelivery`: no timed media on this page (0 videos); the analytics entry is the owner-pending
tags row (off). Evidence: `stardust/replica/motion/index-published{,-compare}.json`.

## Rollout E2-link-audit — every link answers, 17 out-of-scope targets stay on the source (2026-10-12)

41 href occurrences on the live `/`, `/nav.plain.html`, `/footer.plain.html` → 27 unique targets. GET sweep:
25 × 200 (the delivered `/`, styles, favicon, the 17 source-origin pages, Substack, WhatsApp, Instagram);
Facebook 400 and LinkedIn 999 are those hosts refusing a non-browser client (external targets, kept as authored);
one `mailto:` skipped. `localize-links.mjs --source-host www.niravmanubhai.com --content content --check`:
PASS, 0 still localizable, 17 absolutes KEPT because their targets are not in the migration set — recorded in
`stardust/direction.md` as the named SCOPE EXTENSION decision with the list (the run's scope is one page; no
`captureGaps`). Internal hrefs on the new tree are root-relative and extensionless (`/`); no 404 anywhere.

## Rollout F-optimize — gate clean, one P2 (2026-10-12)

`optimize.mjs --all --base https://main--9552f862--aemcoder.aem.live --current stardust/current`: 1 page + site
checks, health 90/100 (ai-search 90; accessibility and seo layers raised no finding; cross-page not applicable
to one page; judgment layers not assessed). Open P1 0 · P2 1 · P3 0 — `ai-search/jsonld` on `/`: no JSON-LD
structured data. The source page carries none either (verified with a direct fetch; the bounded capture JSON
has no `jsonld` key, so the optimizer could not tag it `source parity`). GATE ✓ no open P1. Ledger
`stardust/rollout/optimize/findings.json`, scorecard beside it.

## Rollout G-aem — nothing to autofix, the one P2 accepted as source parity (2026-10-12)

`autofix-aem.mjs --project . --dry-run`: 1 candidate, applied 0, manual 1 (`eds-jsonld`: placement via
head.html / metadata pipeline, payload from a schema pass). No project file edited. `findings.mjs resolve`
→ `accepted` with the reason: the source page carries no JSON-LD, a pure replica mirrors it; structured
data is noted as an owner recommendation. Re-run `verify.mjs`: 1/1 verified; re-run `optimize.mjs`: health
100/100, open P1 0 · P2 0 · P3 0, GATE ✓.

## Rollout H-report — summary block written, learnings recorded (2026-10-12)

`stardust/rollout/report.md`: 1/1 page verified, 1 template, 9/9 blocks + chrome, quality row (published gate
1.41 % / 0.63 %, chrome 0 deltas, interactions 6/0/0, dynamics 4/4, optimize 100/100 open 0), site row
(sitemap 1 = 1, `/` 200), links row (27 targets, 0 404s, 17 kept on the source), nothing outstanding in
scope; owner decisions (tags, JSON-LD, production domain) and the 17-page scope debt listed by name.
`stardust/learnings.md`: six entries (font lazy-load vs mobile gates, gzip-encoded served code, chrome tag
parity, bounded-capture `jsonld`, link-scope record on single-page runs, published-origin motion check).

## Rollout I-dashboard — dashboard rendered (2026-10-12)

`dashboard.mjs` → `stardust/rollout/dashboard/index.html` + `data.json`: one page node (`/`, landing
archetype) at the optimised stage — identified → prototyped → migrated → deployed → optimised — with the
coverage and optimize snapshots behind it. `stardust/` is in `.hlxignore`, so the dashboard is a repo
artifact, not a served page.

## Handoff — run complete (2026-10-12)

`done-check.mjs --live-host main--9552f862--aemcoder.aem.live`: ✓ complete; the runner's done-check:
`complete: true, gaps: []`. Delivered: https://www.niravmanubhai.com/ → `/` on
`main--9552f862--aemcoder.aem.live` (published), 9 blocks + header/footer, published-origin gate 1440 1.41 % /
360 0.63 %, chrome-parity 0 deltas, interaction parity 6/0/0, dynamics 4/4, optimize 100/100. Open for the
owner: tags on the new host, optional JSON-LD, production domain mapping; 17 out-of-scope link targets stay on
the source origin. No background process left running (run-bg jobs all ended; harness and prototype servers
from earlier sessions were already down).
