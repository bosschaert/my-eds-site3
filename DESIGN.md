---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-13T14:43:31Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/lift/tokens.json
---

# Our Balbriggan — design (descriptive, bounded-single)

Every value below is lifted from the live site's CSS / computed styles (stardust/replica/lift/tokens.json).

## Palette
brand blue #2494d2 (header, newsletter, news cards, links) · hero blue #009bd9 (multiply overlay) ·
yellow #f5ee2f (buttons, main-nav text) / #f9ec31 · heading rule #ffff00 · text #3c3c3b / headings #3c3c3c ·
light gray band #f0f0f0 · footer #444.

## Type
Gotham family (Light body 16/24, Medium for nav/buttons/card titles, Bold for section headings 32/38.4
uppercase with a 10%-wide 5px yellow rule beneath). Gotham is a licensed commercial face: the rebuild keeps
the Gotham family names first in every stack and renders a metric-matched open substitute (Montserrat
300/500/700) until a licensed kit is dropped in. Hero heading uses the source's Helvetica/Arial stack.

## Components
Pill buttons (yellow, blue text, radius 2rem, padding .15rem 2rem, uppercase). News cards (blue, radius 1.5rem,
9rem image, centred title). Image grid tiles with a 70% charcoal scrim and uppercase labels. Document covers
212×300 with titles, alternating above/below. Newsletter form on blue.

## Layout
Bootstrap 4 container 1140px; sections padded 4rem; sticky 98px header that compacts after 100px of scroll;
hero 70vh. Breakpoints: navbar collapses below 1200px; columns stack below 768px.
