# EDS conversion log — static-website.david-bosschaert.workers.dev

## Publish decision
Decided by the run brief (owner): **publish**. Every delivered page, the redirects sheet and the chrome documents (nav, footer) go live on the aem.live origin (`deploy-batch.mjs` without `--no-publish`, or `POST https://admin.hlx.page/live/…`).

## Decode tiers
(per block, appended during C-deliver)

## Foundation (C0)
- Files: styles/styles.css, styles/fonts.css (no @font-face; source loads no web fonts), blocks/header/header.{js,css}, blocks/footer/footer.{js,css}, scripts/martech.js (scaffold, everything off) + scripts/scripts.js (scaffold hooks: loadConsent in loadEager, loadTags in loadDelayed), content/nav.html, content/footer.html (both `Robots | noindex`, published live), .hlxignore (+content/), stardust/runtime-contract.json, stardust/deploy/ledger-foundation.json.
- Global: canon.css body/h1/h2/p rules verbatim; boilerplate section/wrapper padding, margins, max-width, nav-height and link/button/heading defaults removed; EDS wrappers layout-neutral (nav margin-bottom collapses with h1 top margin as in the prototype).
- Decode tier: header — template-slotted (authored `<a>` nodes from /nav moved into `nav.site-header[aria-label=Main]`); footer — template-slotted (`<footer>` itself becomes `.site-footer`, authored paragraph moved in, `p` lede rules neutralised inside it).
- Sanity probe (not a gate): nav and footer boxes on aem.page match the source to 0.1px at 1440 and 360.
- Lint: `npm run lint` clean (0 errors; 1 pre-existing no-console warning in stardust/scripts/deploy/sanitise.js).

## Archetypes
Units archetype-landing (`/` ← content/index.html) and archetype-static (`/page1` ← content/page1.html); both published (preview + live), Title metadata "Good Morning!".

### Blocks and decode tiers
- `media-table` (index ×2) — blocks/media-table/{media-table.js,media-table.css}. **Template-slotted**: the authored row/cell grid IS the prototype's `div` table (`display: table/table-row/table-cell`), pictures stay where authored; a cell whose lone link points at YouTube becomes the `<iframe>` (560×315, title from the link text, allow list, allowfullscreen, frameborder 0; `@ew-exempt` declared). Delivered images carry 800×600 attributes — decorate resets them to the source's 560×315 so table auto-layout matches (cells 324/804 px at 1440, measured equal to the source), `picture { display: contents }` keeps the img the cell's only box.
- `callout` (index) — blocks/callout/{callout.js,callout.css}. **Template-slotted** (block element = panel, no DOM change); `.callout p` resets the global lede rule (source text is a bare text node). davids-model 🟡 D1 (single prose cell): kept as a block because the panel is a bespoke component on the source.
- `gallery` (page1 ×2, variants `images`, `videos`) — blocks/gallery/{gallery.js,gallery.css}. **Reconstructive** (repeat group: every cell is a grid item, rows `display: contents`); `videos`: the cell's authored paragraph (fallback text + download link to /vids/*.mp4) is MOVED into a generated `<video controls playsinline preload=metadata width=362 height=308 aria-label="Recording n">` + `<source type=video/mp4>`; videos served root-relative from the code origin.
- `tabs` (both) — blocks/tabs/{tabs.js,tabs.css}. **Reconstructive**: one row per tab (label cell + one cell per team card); the label paragraph/text is MOVED into the generated `<button role=tab>` (EW7 exception), card cells become `.team-card` inside `.tabs-panel` (first `active`); click switches `aria-selected` + `active`, `fadeIn` 0.4s. R-01 applied (`overflow-x: auto; scrollbar-width: none`). Override in block CSS (not foundation): button `line-height: normal` because styles.css `button { font: inherit }` would otherwise give the tab buttons the body's 1.6 line-height. units.json `build` selector `.tabs-panel.active .team-card` unchanged (matches).
- h1, lede paragraph, h2 — default content.

### Checks
- `npm run lint` clean (0 errors; the pre-existing sanitise.js no-console warning). foundation-freeze check: unchanged.
- localize-links --check PASS; delivery-lint 0/0/0 both pages; media-reconcile 9 / 8 hosted; sanitise no-op.
- davids-model-lint: page1 PASS; index 🔴 D1 "embed/video URL authored inside a block" (media-table row 1 cell 1). Not fixable inside the frozen foundation: the model's remedy is a buildAutoBlocks() rule in scripts/scripts.js (frozen), and the embed must sit in a table cell beside an image; the media-table decode performs the same link→iframe conversion. Deployed with this 🔴 recorded; foundation request filed.
- block-roundtrip --ew (local, no dev server needed): index 0 🔴, editable 10/11 + 1 exempt (embed link); page1 0 🔴, editable 11/11. No `aem up` harness/qa-gate run: block-roundtrip covers the structural asserts and the published-origin gates were run directly.
- Delivered .plain.html: `/` 200, 1 h1, 0 about:error, 9 img with alt; `/page1` 200, 1 h1, 0 about:error, 8 img with alt.

### Published-origin gate (pub2, aem.page)
- index: 1440 0.00 % Δh 0 · 360 0.09 % Δh 0; content-diff 0 🔴 / 0 nothing-lost 🟡; clip 0; overflow ok; unit-geometry PASS (6/6 within 0 px).
- page1: 1440 0.00 % Δh 0 · 360 0.12 % Δh 0; content-diff 0 🔴 / 0 🟡; clip 0; overflow ok; unit-geometry PASS.
- pub1 rounds were invalid captures: the CDN served a cached 404 for /blocks/tabs/tabs.css for ~5 min after Code Sync (fixed by a forced code sync, no code change).
- Instrument notes: (1) unit-geometry caches the origin inventory per slug, not per width — the gate.sh 360 run compared against the 1440 inventory (false FAIL); re-run with --force at each width PASS. (2) chrome-parity: source has no `<header>`; with `--region header=nav.site-header|nav.site-header` header ✓ parity at 1440/360; footer reports EXTRA because the source footer text is a bare text node (box and pixels match). (3) content-presence excludes the EDS header chrome while the source nav is plain body content → 2 false MISSING LINKs; gates/all-<w>/presence.json marks `nav.site-header` variable with that reason.
- gate-all (--only index,page1, presence allowance for chrome nav): 1440 **2 PASS / 0 FAIL / 0 error** (0 % / 0 %, Δh 0); 360 **2 PASS / 0 FAIL / 0 error** (index 0.09 %, page1 0.12 %, Δh 0); clip 0, content MISSING 0, units off 0.
