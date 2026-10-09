# Addendum — unit `archetype-pattrns` (supersedes stardust/rollout/briefs/archetype-brief.md where they differ)

Slug: fr-startseite-therapiegebiete-cvrm-see-the-pattrns-about-amylodosis-attr
Path: /fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr → content/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html
Live: https://www.myastrazeneca.ch/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html
Proto: http://localhost:8791/fr-startseite-therapiegebiete-cvrm-see-the-pattrns-about-amylodosis-attr-proposed.html (server running; never start/stop it)
Prototype sheet: stardust/prototypes/css/fr-startseite-therapiegebiete-cvrm-see-the-pattrns-about-amylodosis-attr.css (+ canon.css, the herzinsuffizienz sheet for .split-teaser); js/sub-nav.js, js/video.js, js/motion.js.
Migrated input: stardust/migrated/fr/startseite/therapiegebiete/cvrm/see-the-pattrns/about-amylodosis-attr.html (+ ._meta.json).
Media scope: `pattrns`. Unit paths file: stardust/rollout/units/archetype-pattrns.paths. Ledger: stardust/deploy/ledger-archetype-pattrns.json.

## Plan (stardust/rollout/plan.json step 9)
- convert (new blocks): selfcert-modal (template-slotted; the captured state is the EMPTY wrapper after dismissal — author the
  block with the modal markup hidden, cookie-persisted like the source is a dynamic-features row, deliver the hidden state;
  nothing may be visible at capture), sub-nav (template-slotted; `--active` per page, centring of the active item observed on
  live → mirror js/sub-nav.js; the gated prototype records the scroller initial state as captured), video-poster
  (template-slotted; Kaltura POSTER state: static thumb in the 16:9 box, no iframe at load — load on click only, no
  source-host src), cta-cards (reconstructive; the .ta-card teasers with variants plain / border / center / bgColor —
  unify with tile-grid ONLY if tile-grid's DOM already fits without changing tile-grid's existing pages; otherwise cta-cards
  is its own block with variant classes 1:1 with the source modifiers), questions-cta (template-slotted).
- reuse: breadcrumb, hero, image-text-band, references (existing blocks; variant classes only when this instance differs —
  check the grey-link list for breadcrumb: therapiegebiete.html and cvrm.html are grey, see-the-pattrns/home.html is not).
- This template has NO revision stamp (#vivo-id-wrap) — do not author vivo-stamp.

## Inherited findings from the therapy-area units (apply, do not rediscover)
- gate-all: ALWAYS pass `--origin-headless` (the headed origin stitch wraps one line longer than the archetype's headless
  captures); `--eds-host main--bf989f9e--aemcoder.aem.page --eds-concurrency 1 --probe-concurrency 1 --only <slug>`;
  `export GATE_DISMISS_EXTRA="a.wscrOk,button.self-certify-yes"`; delete stardust/current/measure/<slug>-units.json before each width.
- The pipeline drops `<p>&nbsp;</p>`; author `<p>&#8203;&nbsp;&#8203;</p>` where the live line box must survive (references,
  trailing &nbsp; per <li>). Reference-marker guards in <sup> produce a units-key artefact → documented override, not a fix.
- The pipeline trims trailing NBSP in headings (`Diagnostic&nbsp;`): a 10 px shrink-to-fit heading-box delta with zero visible
  pixels is an override, not a fix.
- h4 sub/sup = 16 px and `.cmp-teaser__description b *` inherits size/line-height: these ride the block CSS (slug sheet), never styles/.
- Sub-nav aria-labels carry a trailing space on live; the video thumbnail alt is the literal "undefined"; desktop teaser images
  carry title attributes — all mirrored verbatim (content-diff names them).
- Fonts: Roboto Slab substitutes Lexia (foundation decision) — the breadcrumb strip residual (3–5 % band at 1440) is known
  and recorded; not a block defect, no request line needed.
- units.json already declares therapy-card (with this slug), sub-nav-item (n 5, required) and split-teaser-text-image; keep the
  build-side selectors it expects or update stardust/replica/units.json with the block's actual selectors (both widths).

## Report additions
Also list: which selectors units.json now maps for this template, and anything the 4 sibling pages (home, diagnosis,
treatement, symptomes) will need (Kaltura posters, 2/3-column teaser grids, stats infographics as plain images).
