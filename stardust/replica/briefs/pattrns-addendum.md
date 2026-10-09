# Addendum — unit 3: PATTRNS archetype (supersedes the brief where they differ)

Slug: fr-startseite-therapiegebiete-cvrm-see-the-pattrns-about-amylodosis-attr
Live: https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html
Proto: http://localhost:8791/fr-startseite-therapiegebiete-cvrm-see-the-pattrns-about-amylodosis-attr-proposed.html
Template: pattrns (5 pages: home, diagnosis, treatement, symptomes, about-amylodosis-attr). pageType article.
Prototype server already answers 200 on :8791 — never start or stop one.

## Inherited measurement policy (from the two gated archetypes — read their progress.json entries by query first:
`node -e 'const p=require("./stardust/replica/progress.json");console.log(p.archetypes["fr-startseite-therapiegebiete-cvrm-herzinsuffizienz"].notes.join("\n"))'`)
- `--main .root` on EVERY probe, both sides (the live `#restyle` is the <body>; the brief's "#restyle" is superseded).
  cap-probe: `--main .root --build-main .root`. Prototype content wrapper carries class `root`.
- Delete the unit-geometry live cache `stardust/current/measure/<slug>-units.json` before each new-width round.
- chrome-parity default header/footer regions match nothing (no landmarks on live); use explicit regions:
  `--no-defaults --region strip=.languagenavigation|.lang-nav --region header=.experiencefragment.cmp-experiencefragment--customMenu|.site-header --region breadcrumb=.breadcrumb|.breadcrumb-bar --region footer=.cmp-experiencefragment--footerSocial|.site-footer-wrap`
  (verify the PATTRNS page's chrome first — the campaign pages may carry a different header/footer; if so lift THAT chrome
  into a per-slug sheet, not canon, and record it under notes as template chrome).
- canon.css is the gated shared layer (tokens, Lexia via 400_Lexia_Rg.woff, Inter per-weight, icomoon/"Font Awesome", strip,
  header/mega-menu, breadcrumb, hero*, vivo*, text module). Import it unchanged; put everything new in
  stardust/prototypes/css/<slug>.css. A canon change is allowed only to fix a measured chrome delta on this page and
  must be re-checked on the two gated archetypes afterwards (one pixel round each at 1440 — numbers must stay 0.00/0.01%):
  home LIVE https://www.myastrazeneca.ch/fr/startseite.html, therapy LIVE …/cvrm/herzinsuffizienz.html; record under `homeRecheck`-style keys.
- js/motion.js carries nav toggle, close-on-scroll, social popup. Reuse; add only observed behaviors.
- Revision stamp #vivo-id-wrap: absolute, renders below the footer and extends the document — mirror (already in canon).
- Live overlays on PATTRNS pages: Cookie Reports banner `a.wscrOk` AND the HCP self-certification modal `button.self-certify-yes`
  — both in GATE_DISMISS_EXTRA and in every `--dismiss`. The modal is a dynamic-features row (self-handled): the prototype
  carries its markup in the captured state after dismissal (hidden), never a live-visible modal at capture.
- Kaltura player: replicate the POSTER state as captured (static poster image + play affordance), per capture-state policy;
  no embed, no source-host src. Log it under captureState.
- units.json already declares therapy-card and split-teaser; add this template's repeated families (cards/tiles) there.
- Image harvest: stardust/prototypes/assets/img/<slug>/ ; the 360 renditions too. Real-Chrome UA + Accept headers.

## Record
Write `archetypes.<slug>` in stardust/replica/progress.json per the brief schema (status gated | gated-with-residuals),
include `notes` with a MEASUREMENT POLICY line, `captureState` (Kaltura poster, HCP modal hidden), `unitsDeclared`,
`canonBackports` (empty if none), and the motion inventory. Also advance state:
`node stardust/scripts/stardust/state.mjs advance <slug> --to approved --by hands-off --prototype stardust/prototypes/<slug>-proposed.html`
Do NOT commit, do NOT write the ledger end line, do NOT touch tools/replica/progress.html — the coordinator does that.
Final report ≤ 25 lines as in the brief.
