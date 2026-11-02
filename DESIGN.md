---
_provenance:
  writtenBy: stardust:replica
  mode: bounded-single
  writtenAt: 2026-10-28T14:20:33Z
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/lift/tokens.json
---

# Our Balbriggan — design (captured current state, preserve mode)

Descriptive spec of https://balbriggan.ie/ as captured on 2026-10-28. Every value traces to the source CSS or a
measured box (stardust/replica/lift/). Nothing here is a new design decision.

## Palette
- Brand blue `#2494d2` (header, news cards, newsletter band, links); hero overlay blue `#009bd9` (multiply over video).
- Yellow `#f5ee2f` (buttons, main-menu links), heading rule `yellow`, hover yellow `#f9ec31`.
- Text `#3c3c3b`, headings `#3c3c3c`, light-gray bands `#f0f0f0`, footer `#444`.

## Typography
- Gotham family (Light body 16/24; Medium for top nav, buttons, card titles, grid labels; Bold for h2 32/38.4 uppercase).
- Gotham is a licensed commercial kit: the new site uses Sora (OFL) as the metric-matched substitute, with the Gotham
  names first in every font stack.
- The hero heading names "Gotham Bold", which does not exist on the source, so it renders in Arial/Helvetica bold.
- Section headings carry a 5px yellow rule (10% of the heading width) under the text.

## Components
- Yellow pill button (radius 2rem), nav CTA pill, square-cornered submit button.
- News card: blue, radius 1.5rem, 9rem image over a 9rem centred title.
- Explore grid tile: photo under a 70% charcoal overlay with an uppercase label.

## Layout
- Bootstrap 4 containers (1140 at ≥1200), section padding 4rem.
- Sticky blue header that shrinks after 100px of scroll; full-width 70vh hero with a centred white card;
  full-bleed illustrated map; dark footer.
