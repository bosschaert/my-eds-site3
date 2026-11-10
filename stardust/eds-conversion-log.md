# EDS conversion log

## Publish decision (2026-11-02)
Publish: decided by the run owner. Every delivered page, the redirects sheet and the chrome documents (nav, footer and locale variants) go live on the aem.live origin (deploy-batch.mjs without --no-publish / admin.hlx.page live).

## C0 foundation (2026-11-02)
- Runtime contract: `stardust/runtime-contract.json` (vanilla boilerplate: formatted-only buttonization in `p a[href]`, `.block` wrapper, fragments decorated with `decorateMain`).
- Styles: `styles/styles.css` = canon tokens + base.css reset + root font-size model (62.5% / 58% <=1470 / 55% <=1240 / 53% <=767); structural layer kept (body gate, chrome reservation, section scaffold). `--nav-height: 0px` — overlay chrome (#108): the header is `position: fixed` on every page; pages offset their own first section (esg `.sub_top` margin/padding). Section scaffold uncapped: every block is full-bleed and caps its own `.inner` (`--container` 150rem, `--container-w` 94%).
- Global CTA paint: `a.button` = source `.btn_more_type01` (white underline + arrow, `styles/media/main-button_more_arrow.png`); blocks override where the source differs.
- Fonts: Pretendard 400/500/600/700 (woff2) + Noto Sans KR 300/400/500/700 (woff), both SIL OFL 1.1 — no licensing alert. `@font-face` in `styles/fonts.css`; `pretendard-fallback` (Arial; size-adjust 101.34%, ascent 93.95%, descent 23.8%, computed latin-weighted from Pretendard-Regular) in styles.css. Roboto removed.
- Favicon: `favicon.ico` = `stardust/current/assets/favicon.ico`.
- Header (`blocks/header`, decode tier: template-slotted): canon chrome DOM, kebab-case classes; authored `/nav` nodes MOVED by role (brand h2+link, menu h2 + nested list, external-link paragraphs, language list, h1 logo). States on the block root: `type-white`, `is-hover` (>=1470 hover mega menu), `menu-open` (<=1470 drawer); `body.index` (Template: index) = transparent header with white logos, every other page = white header. Active item derived from the URL (longest-prefix match on depth-2 links). Language links rewritten to the current page (metadata `source-path` wins — EDS folds `_` to `-` in paths). Search layer posts `headerKeyword` to https://www.doosanbobcat.com/en/search/result (interim, dynamic-features row 2). Chrome-only deviation from EW2: classes are added to the moved nav/footer nodes (fragments are edited as their own documents, never inline in the page).
- Footer (`blocks/footer`, template-slotted): sitemap columns (heading + list pairs; nested list = Products groups), bottom row (h2 logo, copyright, hidden "Footer" heading + links with external-link icons, Related Sites dropdown), TOP button (scroll-progress ring; on `body.index` the image variant `.fullpg-top-btn`, shown by the home scroller via `body.fp-viewing-5`).
- Footer variance on the source: the home page footer lacks "Human Rights Management" and links Doosan Corporate → /kr, Material Handling → /en/. Authored as a second chrome document `/footer-home` (home page metadata `Footer | /footer-home`); `/footer` carries the sub-page version.
- Lint: `.eslintignore` gains `stardust/` (tooling, not runtime); `no-descending-specificity` disabled in the ported chrome CSS (canon cascade order is load-bearing). `lint:breakpoints` wired (DESIGN.json has no `breakpoints.target` → skipped).
- Chrome document fixes for delivery-lint P1s: the Bobcat logo text is a plain `<p>` in `/nav` (a fragment carries no `<h1>`); the header block renders it as the chrome `h1.logo-bobcat` like the source. Footer "Portable Power" href `/en/products/portable/list.html` → `/en/products/portable/list` (EDS serves extensionless; same target as the nav's link).

## C-deliver archetype-landing — /en (2026-11-02)
- Blocks (all decode tier template-slotted; repeat groups reconstructive): `home-visual` (hero video fade carousel, slides = label + code-origin video link `/media/home/*.mp4`, @ew-exempt video links), `home-company`, `home-products` (cards = product/hover/background images + text; card-as-link EW6, hover CTA is an EW4 clone), `home-esg`, `home-news` (news rows: category | date + linked title; YouTube row: heading/text | image | channel list).
- Widget `widgets/home/home-scroller` (mounted in the NEWS section): fullPage replacement on native scroll, fp-nav from section `Tooltip` metadata, body `fp-viewing-<n>`, header `type-white` (panels 3/5/6), section `.active` entrances, `.fullpg-top-btn` → panel 1, copyright current year. Page metadata: `Template: index`, `Footer: /footer-home`.
- Editorial images on DA `media/home/` (20; ledger `stardust/deploy/media-ledger-archetype-landing.json`); decorative icons in block `media/`.
- Gate (preview origin, origin = fp-stitch live.png t=0 of the archetype round): 1440 0.53% Δh 0, 360 1.76% Δh 0, clipped 0, missing 0 (`presence.json` en: `main body=body` — source footer sits inside `<main>`, EDS footer is chrome).

## C-deliver archetype-static — en-management-esg-result (2026-11-02)
- Page: DA `/en/management/esg-result` (source `/en/management/esg_result`; EDS folds `_` to `-`,
  metadata `source-path` keeps the language links on the source path). Live + preview.
- `sub-top` (template-slotted): title h1 + local nav list (strong = active), breadcrumb (hidden
  "Page Location" h2 + list), visual as an authored picture (object-fit cover, wipe in end state).
  Offsets the overlay header itself (11.5rem margin + 10rem padding). Bespoke component: D1
  advisory (prose-only rows) accepted — the composition is fixed and reused by every sub page.
  Page h1 = "ESG" (source h2; delivery-lint needs exactly one h1 in content).
- `esg-result` (template-slotted, 14 fixed-order panel rows; repeat lists reconstructive inside
  their row): wrappers carry the source layout classes (kebab-case), authored nodes moved; inline
  spans/`.wrap` added around moved nodes only. Scroll reveal `.con-ani` via IntersectionObserver
  (rootMargin +100px = source layout-top trigger). EW2 deviation: the EHS diagram orders its
  authored `li` with `:nth-child` (source composition). `no-descending-specificity` disabled
  in block CSS (source cascade order, as in the chrome CSS).
- Media: 22 editorial images on DA `media/esg-result/` (ledger
  `stardust/deploy/media-ledger-archetype-static.json`); decorative backgrounds/icons as block CSS.
- Not-yet-migrated targets stay absolute to www.doosanbobcat.com (esg_strategy, esg_report,
  human-rights, ethics_canon, society).
- Gate (preview origin): 1440 2.1% Δh -4, 360 5.88% Δh -23, clipped 0, missing 0; header crop
  100%/100%, footer 99.76%/98.57%.

## D-site (2026-11-02)
- Redirects sheet `/redirects.json` (from `stardust/redirects.tsv`, 5 rows): source root `/` 302s to `/en` on the source, so `/` and `/index.html` → `/en`; `/en/` → `/en`; `/en/management/esg_result(.html)` → `/en/management/esg-result` (EDS sanitises `_` to `-`). PUT, previewed, published live.
- Coverage row for ESG now carries the delivered path `/en/management/esg-result` (`sourcePath` keeps the source one).
- Sitemap served 2 = assembled 2; chrome documents /nav, /footer, /footer-home noindex; `/` 200 on page and live.

## E-full-site / E2 links (2026-11-02)
- Out-of-scope internal targets (pages not in the 2-page plan) repointed to the source origin `https://www.doosanbobcat.com/…` in /en (8), /nav (44), /footer (41), /footer-home (40); `/en/management/esg_result` → `/en/management/esg-result`. Republished. Redirect `/en/management/esg-result/` → leaf added.
- verify.mjs: esg-result verified; /en flagged only `/widgets/home/home-scroller.html` (the home-scroller widget reference, served 200 on aem.live — verify's asset filter does not know widget `.html` refs). /en recorded verified via update-coverage with this evidence; gate row PASS at 1440/360.
