# EDS conversion log — Jamaica Travel Guide (Adobe Express webpage) replica

Source: https://new.express.adobe.com/webpage/DYft29Wzo0QLK · Target: aemcoder/b7aaf274 (DA), code branch `main`, preview `main--b7aaf274--aemcoder.aem.page`, live `main--b7aaf274--aemcoder.aem.live`.

## Publish decision (recorded once, 2026-10-06)

**Publish.** Every delivered page, the redirects sheet and the chrome documents (`/nav`, `/footer`) go live on the aem.live origin: `deploy-batch.mjs` runs without `--no-publish`. Decision made by the run owner before C-deliver; not a question for this run.

## Decode tiers (replica default: template-slotted for fixed compositions)

| Block | Tier | Why |
|---|---|---|
| hero | template-slotted | fixed composition: background photo + title stack + scroll hint |
| photo-band | template-slotted | fixed composition: photo on one side, prose on the other (variant `image-left` / `image-right`) |
| figure | template-slotted | single photo with caption text |
| cards | reconstructive | repeat group (card flipbook) |
| photo-grid | reconstructive | repeat group (photo tiles) |
| header | template-slotted | the source page has no header; the block renders nothing and reserves no height |
| footer | template-slotted | the fixed "Made in Adobe Express" badge (register R-03) |

## Delivered paths

| Source path | DA path | Note |
|---|---|---|
| /webpage/DYft29Wzo0QLK | /webpage/dyft29wzo0qlk | folded lowercase; site root `/` resolves to it (D-site) |

## Lint residue

(none yet)

## C-deliver — archetype unit `archetype:webpage-dyft29wzo0qlk` (2026-10-06)

**Delivered:** `/webpage/dyft29wzo0qlk` PUT → preview → live (ledger `stardust/deploy/ledger-archetype.json`); 13 editorial images rehosted to `content.da.live/aemcoder/b7aaf274/media/webpage-dyft29wzo0qlk/` (`stardust/deploy/media-ledger.json`). Delivered `.plain.html` on both origins: 200, one `<h1>`, 0 `about:error`, 0 `/img/`, 13 `<img>` with the captured (empty) alt, 4 `<h2>`, 5 `<h3>`, 1 `<blockquote>`. ai-readability code 100 % (strict 100 %).

**Decode tiers confirmed:** hero template-slotted (bg picture / headline / subtitle slots, overlay generated); photo-band template-slotted (media / body slots, variants `image-left` / `image-right`, optional config row `focus | <x%> <y%>` = the source background-position of the Food & Drink photo, applied as `object-position`, declared `@ew-exempt`); figure template-slotted (media / `caption-wrap` slots); cards reconstructive (one row per card, title card = the row whose heading is one level above the others → `.center`); photo-grid reconstructive (one row per group, one cell per tile; 3 tiles → 50/25/25, 2 tiles → 50/50). Sixth block `bumper` (template-slotted: the authored link paragraph moves into `<nav aria-label="Adobe links">`) carries the Terms / Privacy line — it is page content, not chrome, and no section style of the closed set renders a 36 px right-aligned serif line; `rollout/coverage/blocks.json` has no row for it (`update-coverage --block bumper` refused), recorded here instead.

**Section model:** Overview = default content `large-spacing`; the two 2 px spacers = empty sections `spacer` / `spacer-bottom-shadow`; Tips = three sections (`large-spacing-top` prose → `figure` block → prose "My personal faves") so the source rhythm (5rem / 2.5rem gaps) is reproduced by the foundation's wrapper padding without any override; the source's `top-shadow` on Tips is NOT authored (landing.css suppresses it after the card section — `.card-flipbook-section + .section.top-shadow { box-shadow: none }`); quote = default `<blockquote>` in a `large-spacing` section (source: 2.5rem pad + 2.5rem block margin = 5rem). Source `<a class="image-viewer-link">` / `.photo-image` links (Express lightbox to the raw media file) are not authored: the target would be an auth-gated content.da.live URL (401 for visitors) and the lightbox is Express platform behaviour. Heading "Copy link" anchors shipped static (foundation-requests.md line 2).

**Gate (preview host, recorded verdict):** 1440 PASS 2.34 % Δh 0 clip 0 content MISSING 0 / HIDDEN 0 (`stardust/replica/gates/all-1440/runs/2026-10-06T12-30-02-247Z-webpage-dyft29wzo0qlk.json`); 360 PASS 5.21 % Δh +8 clip 0 content 0 (`stardust/replica/gates/all-360/runs/`). Round 1 @1440 (first run 19 % / Δh -118): anchor.mjs placed the whole delta in the card section (3921 vs 3807) and measure.mjs named it — `.cards-list` was flex, so the 32 px card margins did not collapse (3 × 32), and the image line box used the 19px/1.6 body metrics where the source `.image` is 16px/normal (4 px vs 8.4 px descender, ×4 cards + figure). Fix: `.cards-list { display: block }`, image wrappers `font-size: 16px; line-height: normal`. No fix round at 360. Chrome-parity (footer = `nav.footer` | `nav.bumper-nav`, header n/a — the source has none): the two links sit +135 px right of live (register R-01: Report Abuse + empty cookie anchor omitted), `fontFamily "times new roman" → "serif"` is a name delta of the same UA standard font (both link pairs measure 133 px apart on both sides); footer crop band 98.43 % match (PASS ≥ 98). Residual: blockquote renders 19px/400 on one line box 30.4 px instead of 29px/100 at 37.7 px (-7 px) — foundation-requests.md line 1 (`blockquote p` inherit); fixable in styles.css only.

**Lint residue:** `block-roundtrip` reports ROLE SWAP 🔴 for every `<h2>/<h3>` (Best Beaches, Food & Drink, Highlights, Waterfall Tours, Montego Bay Fishing Boats, The Blue Mountains): the prototype (verbatim source DOM) wraps heading text in `<span>`, and the classifier reads own text nodes, so the proto side classifies them as body while EDS authors real headings — the EDS side is the correct role (the gate's content-presence h1–h3 bands pass with 0 MISSING); EW gate 19/21 editable, 0 dead, 0 duplicated, 2 exempt (focus config row); "Copy link" MISSING BODY 🟡 = the static-anchor decision; IMG COUNT 🟡 = source CSS-background photos authored as editorial `<img>`. `qa-gate` (harness): ✗ `block header renders non-empty` — the frozen header renders nothing by design (source has no header); ✗ `units:` rows map schema sections to blocks by order with all schema sections named "section" (name collision → hero) — verified manually: 4 `.cards-card` rendered, 4 headings / 4 img round-trip; ✗ `content cap 395px` — DESIGN.json's `containerMaxWidth` derives from `#…-heading-text > span` inline text spans (caps[] selectors), not a container; the source column is percentage-gutter fluid and the foundation (`--content-max-width: none`) is correct. `davids-model-lint` 🟡 D1 (template-slotted single-column blocks — bespoke compositions per the tier table) and D3 (photo-band config row 2 cells / photo-grid rows 3 and 2 tiles — container shape, one row per group). `delivery-lint` P2 cross-origin-optimize ×5 — content.da.live media inside hero/cards; neither block calls `createOptimizedPicture` (media-reconcile: 13 hosted). `npm run lint` clean (one pre-existing no-console warning in stardust/scripts/deploy/sanitise.js). `.plain.html` carries no `<body>` tag (pipeline main-fragment format, same as `/nav` and `/footer`).

## C-deliver — C-final: foundation request queue applied once (2026-10-06)

- **blockquote ramp:** the pipeline wraps the quote in `<p>`, whose base rule reset the ramp to body size. Added `blockquote p { font-size / font-weight / line-height / letter-spacing: inherit }` to `styles/styles.css` (evidence: measure.mjs @1440 live h 81.19 vs preview 73.89, Δh −7 px).
- **heading "Copy link" anchors (dynamic-features row 9):** `scripts/scripts.js` gains `decorateHeadingAnchors` (runs after `loadSections`, so no block decoration sees it): one out-of-flow sibling `button.page-heading-anchor` (`.small` for the cards' h3s) after every `h2[id]/h3[id]` in main, hover/focus-revealed, click → clipboard + the "Link copied to clipboard." toast for 3 s. Anchor + toast rules in `styles/styles.css` with the source runtime values (fonts fall back to the body family; adobe-clean is not rehosted). Heading text and the `* + *` block rhythm are untouched (the button is `position: absolute`, margin override at higher specificity).
- Foundation re-frozen after the edits (`foundation-freeze.mjs freeze`); lint clean (1 pre-existing warning in a stardust script).

## C-deliver — unit `gate-all` (2026-10-06)

Roster gate on the preview host after the C-final foundation fixes (`gate-all.mjs --skip-existing`, origin captures reused, EDS side re-shot): 1440 PASS 2.39 % Δh −8 clip 0 MISSING 0 / HIDDEN 0 (`stardust/replica/gates/all-1440/summary.json`); 360 PASS 5.23 % Δh +7 clip 0 MISSING 0 / HIDDEN 0 (`stardust/replica/gates/all-360/summary.json`). Coverage gate rows written (`update-coverage.mjs --gate`, both widths). Verification of the two applied requests: `measure.mjs` blockquote @1440 live h 81 / preview h 81, computed type equal; `motion-observe` on the served page records the `toast-message-fade-in` entrance and `.toast-container.show` after a click on `button.page-heading-anchor` (`stardust/replica/motion/webpage-dyft29wzo0qlk-eds.json`). Residual: the page is 8 px taller than the source at 1440 (+7 px accumulates above the quote; within the |Δh| ≤ 8 bar), 7 px shorter at 360.

## D-site — site assembly (2026-10-06)

- **Redirects sheet** `/redirects.json` (DA, columns Source / Destination; PUT → preview → publish via the admin API, 3 rows from `stardust/redirects.tsv`): `/` → `/webpage/dyft29wzo0qlk`, `/index.html` → same, `/webpage/DYft29Wzo0QLK` (the source's mixed-case path, which the pipeline does not fold) → same. The source root is a different page (the Adobe Express home, out of scope), so the root is a redirect, not a root `index` document. Verified: `curl -sIL` on `/`, `/index.html` and the mixed-case path ends in 200 on aem.page and aem.live (301 → 200).
- **Chrome documents** `/nav`, `/footer`: live on aem.live, each with `<meta name="robots" content="noindex">`.
- **Sitemap**: `assemble.mjs --verify-origin https://main--b7aaf274--aemcoder.aem.live` exits 0 — served 1 url = assembled 1 (`/webpage/dyft29wzo0qlk`). The coverage row's `path` was corrected from the source-cased `/webpage/DYft29Wzo0QLK` to the delivered DA path `/webpage/dyft29wzo0qlk` (DA folds paths to lowercase; `inventory.mjs` would re-derive the mixed case from the migrated tree on a re-run — re-apply if inventory is re-run). `plan.json` keeps the source-cased path (plan input, not served).
- `stardust/rollout/site/{sitemap.xml,robots.txt,manifest.json}` staged (the expected set; the platform serves its own sitemap).
