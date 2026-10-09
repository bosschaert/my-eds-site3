# Foundation report (C0) — conventions every cluster subagent relies on

Verdict: nav+footer live (published), chrome-parity 1440 4 deltas / 360 2 (font-inherent), crop-compare header
1.49% @1440 / 1.42% @360, footer 0.00% / 0.28%; geometry identical to live (strip 29px, header 57px, footer 249/485px).

Frozen files: stardust/runtime-contract.json, styles/styles.css, styles/fonts.css, fonts/{Inter-Regular,Inter-Medium,Inter-Bold}.woff2,
fonts/icomoon.woff, fonts/roboto-slab-variable.woff2, favicon.ico, blocks/header/*, blocks/footer/*, content/nav.html, content/footer.html.
Media ledger: stardust/deploy/media-ledger.json (logo https://content.da.live/aemcoder/bf989f9e/media/chrome/astrazeneca-logo.svg).

--nav-height: 86px at every width (29 strip + 57 header). `body > header` is position relative, z-index 10, white.

Fonts: Lexia (300/400/700) stays first as local()-only faces; substitute Roboto Slab variable (OFL) with
size-adjust 95.7%, ascent-override 99.27%, descent-override 26.12%, line-gap-override 0%. First-paint fallbacks
`lexia-fallback` (Times New Roman) and `inter-fallback` (Arial) with size-adjust/metric overrides in styles.css.
Use font TOKENS only, never literal family names: --font-display (Lexia stack), --font-body (Inter-Regular),
--font-medium (Inter-Medium), --font-bold (Inter-Bold), --font-icon (icomoon).
Glyph utilities: .glyph.glyph-{search,times,times-circle,chevron-right,arrow-down,arrow-up,play}.

Tokens (kebab-case, all in :root): --bg-color-core-1/2/3, --bg-color-secondary-1/2/3, --bg-color-supporting-1/2,
--text-color-body-1/2, --text-color-title-1/2, --text-color-interaction, --text-color-label-1/2,
--border-color-1/2/3/4/6/7/8, --button-primary-{bg,border,text}-color, --button-secondary-{bg,border,text}-color,
--table-bg-color-1, --container-max (1180px), --hero-content-max (1220px), --gutter, body/heading size + line-height
tokens, boilerplate aliases kept. Token gate (every var(--x) in blocks defined in :root) must stay clean.

Buttons: a.button.primary / .accent = canon .btn-primary (Inter-Bold 16/24, padding 8×16, radius 4, #d0006f);
a.button.secondary = canon .btn__el small (Inter-Medium 12/20, 6×16, outline). p.button-wrapper { margin: 0 }.

Sections: main > .section > div caps at 1180px with no horizontal padding (blocks own their gutters; default content
gets 16px below 768). Closed style vocabulary (one value per section): full-bleed (the one escape), tinted,
spaced (20/40px), centered, title-core. A block may also escape with `main .<name>-container > div { max-width: none }`.

Header hooks: header .lang-nav, .site-header, .site-header-grid, .site-header-logo, .main-nav-list,
.main-nav-item-l0…l3, .main-nav-parent, .open / open-col-3, .site-header-user, .site-search(.searchbox-enabled);
stock #nav[aria-expanded], .nav-brand/.nav-sections/.nav-tools/.nav-hamburger kept; burger breakpoint 1024px.
Footer hooks: footer .site-footer-wrap > .site-footer > .site-footer-grid > .site-footer-col-{brand,links}, .site-footer-links-col.

Lint: kebab-case classes (no BEM __/--), lines ≤ 100, one declaration per line; `npm run lint` is runnable
(devDependencies installed at the first checkpoint).

Known chrome residuals (font-inherent, Roboto Slab vs Lexia): uppercase strip labels shift 2–3px; two level-0 labels
3–4px wider. scripts/scripts.js sets documentElement.lang = 'en' (stock; pages are FR — candidate for C-final).
