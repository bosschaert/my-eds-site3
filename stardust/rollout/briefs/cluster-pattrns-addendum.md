# Addendum — unit `cluster-pattrns` (supersedes stardust/rollout/briefs/archetype-brief.md where they differ)

Template `pattrns`; archetype `fr-startseite-therapiegebiete-cvrm-see-the-pattrns-about-amylodosis-attr` is LIVE and gated
(1440 0.72 % / 360 1.57 %); its page content/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html is the
authoring MODEL for every sibling (same blocks, same shapes). Read also stardust/rollout/briefs/archetype-pattrns-addendum.md (the
archetype unit's inherited findings — all apply) and the archetype unit record:
`node stardust/scripts/replica/json-query.mjs stardust/rollout/progress.json --path units.archetype-pattrns --width 300`.

## Pages (slug → DA path; migrated input stardust/migrated/<path>.html + ._meta.json; rendered prototype stardust/prototypes/<slug>-proposed.html served on :8791)
- fr-startseite-therapiegebiete-cvrm-see-the-pattrns-home        → /fr/startseite/therapiegebiete/cvrm/see-the-pattrns/home
- fr-startseite-therapiegebiete-cvrm-see-the-pattrns-diagnosis   → /fr/startseite/therapiegebiete/cvrm/see-the-pattrns/diagnosis
- fr-startseite-therapiegebiete-cvrm-see-the-pattrns-treatement  → /fr/startseite/therapiegebiete/cvrm/see-the-pattrns/treatement
- fr-startseite-therapiegebiete-cvrm-see-the-pattrns-symptomes   → /fr/startseite/therapiegebiete/cvrm/see-the-pattrns/symptomes
Live: https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/<home|diagnosis|treatement|symptomes>.html
Media scope `pattrns`; paths file stardust/rollout/units/cluster-pattrns.paths; batch ledger stardust/deploy/ledger-cluster-pattrns.json;
logs stardust/.work/rollout/cluster-pattrns/. Variance probe DONE (stardust/migrate/variance-pattrns.json) and the render's variants are
recorded in each page's _meta.json sidecar (`variants[]`) — do not re-run sibling-variance.

## Blocks: REUSE only — no new block code unless a variant needs CSS
breadcrumb, hero, sub-nav (one <ul>, active item resolved by pathname — no per-page variant), selfcert-modal (`Mode | dismissed`),
cta-cards (variants cols-2 / cols-3 / plain / border / center / flush 1:1 with the source teaser + container modifiers), questions-cta
(title/text/CTA bands; section style `tinted` for container--bgColor-supporting-1), references, social-features (home only — the
therapy-area block). No video-poster and no image-text-band on these four pages.
Render findings to budget as cta-cards variant classes (add the CSS in blocks/cta-cards/ only, scoped to the variant class, and record
`node stardust/scripts/migrate/migrate.mjs variant <slug> <class>` for each new class):
- symptomes + diagnosis + treatement: `border` cards WITHOUT `center` (left-aligned bordered cards) — verify the block renders that
  combination as live does (measure the first card's rect + text-align against live with measure.mjs at 1440 before gating).
- diagnosis: 2 title-only cards (no media, no CTA); symptomes: 2 plain media-only cards (no title/CTA) and one card with an EMPTY
  pretitle (the live h6 keeps a 16px line box, −10px margin) → a `pretitle` row or an empty paragraph guard (`&#8203;`) that
  survives the pipeline; treatement: a `.text--small` footnote laid full-width as the 4th child of a 3-column card row → author it as
  default content directly after the cta-cards block in the same section and give the block/section the spacing live has (0 margins).
- Stats infographics: picture-only cta-cards rows (1 row = full width; `cols-2` for pairs); png renditions have no srcset on live.
- Page title is one line (h 40) on home / treatement / symptomes — the hero block already handles the height from content.
- Live card body padding 24px all round vs the shared 24px/16px rule: measure one bordered card per page against live before the gate;
  fix in cta-cards CSS only if the instrument shows the delta.

## Links and media
- PDF CTAs (`/content/dam/…OnePager….pdf`, 2 files) and the smw.ch targets: the render driver rewrote the PDF hrefs to relative
  `../../…/content/dam/…` paths — in content/ author them FULLY-QUALIFIED `https://www.myastrazeneca.ch/content/dam/…pdf` (brief rule:
  every out-of-scope source link stays fully-qualified; no PDF hosting here). `https://smw.ch/…` stays as captured. `target="_blank"`
  on three treatement links is captured behaviour — keep it. Internal links to the 10 in-scope pages are root-relative + extensionless.
- Images: upload each page's files from stardust/migrated/assets/** (or stardust/prototypes/assets/img/<slug>/) to DA scope `pattrns`
  through da-media-upload.mjs (one run for all four dirs if the script takes several --dir, else one per page, all through run-bg,
  slots 1). `warn-symbol-dup.jpeg` (symptomes) is the mobile file sharing the desktop name — keep both distinct. `mail.svg` (home
  social popup) already exists in the media ledger from the therapy-area archetype — reuse its URL.
- Presence root per page: add the sibling's `#container-…=main` line to stardust/replica/gates/all-<w>/presence.json as the
  archetype did (the live main is an id'd container; without it lang-nav links read MISSING 3).

## Gate (one run per width for all four pages)
`export GATE_DISMISS_EXTRA="a.wscrOk,button.self-certify-yes"`; delete stardust/current/measure/<slug>-units.json for the four slugs
before each width; then through run-bg (slots 1):
`node stardust/scripts/replica/gate-all.mjs --only <slug1>,<slug2>,<slug3>,<slug4> --eds-host main--bf989f9e--aemcoder.aem.page --width 1440 --eds-concurrency 1 --probe-concurrency 1 --origin-headless`
then `--width 360`. Bar per page: pixel ≤ 10 %, |Δh| ≤ 5 %, clipped 0, content MISSING+HIDDEN 0, required units within 4 px (font-shaped
sub-nav label boxes are the documented override class — reuse the archetype's overrides.json entries pattern). crop-compare header/footer
≤ 2 % on each page; the computed-style guard once for the template (reuse stardust/.work/rollout/probes/pattrns-computed-style.mjs with
the four URLs). Uppercase card titles at 360: run stardust/.work/rollout/probes/pattrns-title-lines.mjs over the four pages before
trusting the letter-spacing compensation. Fix rounds: cap 3 per page, fixes off the instruments; a block CSS fix rides one code push
for all pages, a content fix rides a re-PUT (`--force`) of that path only. After 3 rounds record the residual and move on.
Sidecar gates per page: migrate.mjs gate content-fidelity, gate-evidence.mjs --slug, state.mjs advance → migrated, update-coverage.

## Report (≤ 20 lines)
Verdict line first: `cluster-pattrns: pages 4/4 live, blocks k reused (+n variant classes), gate 1440 a/b/c/d% / 360 e/f/g/h%, Δh …, clipped 0, content 0, requests r`;
then per page both gate rows (pixel, text, Δh, clipped, content, units off/override), crop header/footer %, computed-style guard, variant
classes added (block → class), overrides recorded, foundation-request lines (if any), residuals with causes, commits pushed, and anything
the final gate-all run must know. Do NOT write ledger lines, do NOT edit stardust/rollout/progress.json, do NOT touch tools/replica/progress.html.
