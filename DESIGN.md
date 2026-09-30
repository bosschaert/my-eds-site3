---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-28T09:18:13Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/tokens.json
---

# Design — Our Balbriggan (preserved current state)

Every value below is lifted from the site's own stylesheets (`stardust/current/assets/css/style.css`, Bootstrap 4 base in `theme.min.css`) or measured by the computed-style census. Full table: `stardust/replica/tokens.json`.

## Palette
Brand blue #2494d2 (links, primary buttons, navbar, newsletter band) · accent yellow #f5ee2f (secondary buttons, primary menu links, form submit) · hero heading yellow #f9ec31 · hero overlay #009bd9 (multiply) · body text #3c3c3b · headings #3c3c3c · light band #f0f0f0 · card surface #e5eff9 · footer #444 · white.

## Typography
Body: `'Gotham-Light', sans-serif`, 1rem/1.5. Headings inherit the body family, weight 500, line-height 1.2; h2 2rem uppercase. Hero heading `'Gotham Bold', Helvetica, Arial, Lucida, sans-serif` 1.5rem/700, letter-spacing 1px. Buttons and top menu `'GothamMedium'`. No `@font-face` declares a Gotham face anywhere on the site, so browsers render these stacks with their fallback fonts; the recreation keeps the identical stacks (no substitution, no rehosting). Icon font: FontAwesome 4.7 (social icons).

## Layout
Bootstrap 4 grid: border-box, container 1140px at ≥1200 (960/720/540 below), 15px gutters. Sections pad 4rem vertically. Hero 70vh (min 15rem) with the video covering and a blue multiply overlay. Sticky blue navbar, expands at 1200px, logo 11rem × 4.5rem (shrinks when scrolled). Footer #444 with a 12rem logo and right-aligned contact widget.

## Components
Primary button: blue pill (radius 2rem, padding .15rem 2rem, uppercase 700). Secondary: yellow pill, blue text, 2px yellow border; hover inverts. Newsletter submit: yellow, radius .25rem, padding .5rem 1.5rem. Section intro headings centred with a 10%-wide 5px yellow rule beneath. News cards on #e5eff9, 1rem padding, black titles, .9rem #333 text. Transitions 300ms.

## Motion
Nav links and buttons: 300ms all. Hero carousel (slick) autoplay. Map pins scale animation on load. Everything else static. Observed behaviour is confirmed with the motion instrument in the gate phase; only behaviours that fire are implemented.
