---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-24T09:52:37Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/lift/tokens.json
---

# SORRA — design (bounded-single, descriptive)

Every value below is lifted from the live theme stylesheet (`stardust/current/assets/css/main.css`) or measured on the live page (`stardust/replica/lift/measure-*.txt`). Nothing is invented; the full value table is `stardust/replica/lift/tokens.json` and `DESIGN.json`.

- **Palette:** black #000 text on white #fff; gray #94999f (category chips); dark gray #83888e (dates); greens #eff5f1 / #e5ebe7 defined but unused on the home page.
- **Type:** "Kulim Park" (Latin, 400/600) falling back to "Noto Sans JP" (400/500) for Japanese, sans-serif; body 1rem, letter-spacing .1em; sizes are viewport-fluid `clamp()` ramps (e.g. JOURNAL title clamp(1.875rem → 3.125rem), CONTACT title clamp(1.875rem → 4.0625rem)). Google Fonts is the live source.
- **Container:** 86.67vw on small screens; min(62.5rem, 73.2vw) from 960px, 73.2% from 1025px. Section spacing min(12.5rem, 14.64vw) desktop / min(6.25rem, 26.67vw) mobile.
- **Header:** fixed white bar, height min(6.6875rem, 7.83vw) desktop / min(3.125rem, 13.33vw) mobile; pill CONTACT button (1px black border, 50vh radius); hamburger + full-screen drawer on mobile.
- **Hero:** fade slideshow filling 100vh minus header, object-fit cover, multiply-blended white→gray gradient scrim, white slide title + underlined arrow link, circular progress page counter, dot pagination.
- **Buttons/links:** pill outline buttons; "underline-arrow" links (text, bottom hairline, small arrow icon).
- **Motion (captured classes):** body fadeIn 1s; active hero slide zoomOut 9s; hover: journal card opacity .7 + image scale 1.1; underline border animation; drawer show/hide.
