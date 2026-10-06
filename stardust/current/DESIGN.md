---
_provenance:
  writtenBy: stardust:replica
  mode: bounded-single
  writtenAt: 2026-10-05T15:15:00Z
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/tokens.json
---

# DESIGN — Garden Eight (bounded single-page spec)

Values lifted from the page's own SSR stylesheets and computed styles (stardust/replica/tokens.json); the full machine-readable set is DESIGN.json.

- **Palette:** `--col-black #1e1f1f` (html background and body text), `--col-black2 #1c1d1d`, `--col-black3 #141414`, `--col-gray #3c3c3c`, `--col-white #dbd6d0`, `--col-orange #dc5648`. The visible page surface is the canvas paint, a soft beige around `#e3ded7` (sampled: `#e8e3dc` mid-left, `#dcd7d0` bottom).
- **Type:** body `lausanne, sans-serif` (TWK Lausanne 200/300/400, self-hosted woff2), `line-height 1.42`; main font-size `1.076vw` (14.85px ≤1366px, 15px ≤640px, 17.98px ≥1680px, .861vw ≥1920px); logo/small `.f-logo 1.041vw` (13.05px ≤1366px). Display `.serif`: `gunsan` 600, letter-spacing 0, line-height .51; the home headline `.h1` is `14.93vw` (11.944vw in short landscape), set as word blocks (`.words .w` inline-block, .125em gap) with per-word offsets (what .4em, can we 1.3em, make 0, next 1.3em) inside a 4.4em-wide `.page-title`. Lead and intro weight 200; lead line-height 1.6; uppercase chrome (`.Hd`, `.ui-link`).
- **Container:** fluid, no caps (cap-probe: contentMaxWidth null, probeWidth 2560, three full-bleed sections). Gutters in vw: logo 3.125vw, menu 2.625vw, columns ±2.0833vw (two 50% columns). Rules `.hr` 1px at 20% opacity.
- **Sections (1440 / 360):** hero `.Ph` 1034 / 870 px, intro+cases `.Pb` 1399 / 977 px, main 3671 / 2767 px. The document itself is 900 px (scroll-jacked by the site's scroller); the header, menu and canvas are fixed.
- **Buttons / links:** `.ui-btn` (overflow hidden, colour/border transitions .3s cubic-bezier(.32,.94,.6,1), fill/ghost padding 0 1em), `.ui-link` uppercase flex, `.ui-link-hn` uppercase inline with a light-weight `.num`; text links reveal with a clipped line (`.clip-y .o` 1.25em).
- **Motion (captured classes only; observed in Phase 3):** `.clip-y .t` translate3d(0,140%,0) reveal, marquee `.mq-anim` transform, hover line `.b`.
