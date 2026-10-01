---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-28T09:10:07Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/lift/tokens.json
---

# DESIGN — www.niravmanubhai.com (captured current state, bounded single-page)

Descriptive spec of the live home page as captured on 2026-09-28. Every value traces to the
captured page JSON (`customProps`) or to the source site's own CSS (`stardust/replica/lift/cascade.css`,
computed at 1440 and 360 in `stardust/replica/lift/computed-*.tsv`). Nothing here is a design decision.

## Palette (source custom properties)
paper #f4efe3 (page) · parch #ece3d1 (alt sections, hero fill) · ink #2c2519 (text) · ink-soft #6b5f47 (secondary text) ·
leaf #4e5d44 (accent: eyebrows, buttons, links) · leaf-dark #3c4934 · line #cabfa3 (rules, borders) · gold #b2843e ·
taupe #8a7f66 (card indices) · cream #f5eddc · noir #0f0d09 · focus #e6c77d. Solid button text #fbf8f1.

## Typography
- Display: "Playfair Display", Georgia, serif — weight 400 (500 on door card titles), line-height 1.16.
- Body: Inter, system-ui, sans-serif — 17px / 1.75 on body copy; 14.4px / 1.55 on cards; 17.92px ledes.
- Eyebrows: Inter 600, .68rem, letter-spacing .2em, uppercase, leaf (gold variant rgb(164,124,61) on the nursery, rgb(138,106,47) on "also"/"follow").
- Gujarati blessing: Rasa 600, 2.2rem, rgb(67,83,59).
- Section h2: 3.6rem (57.6px) at 1440. Story Nursery title: 48px in leaf. Books h3 30.4px; door h3 21.6px/500; also-title 20.8px leaf.
- Rendering: text-rendering optimizeLegibility, -webkit-font-smoothing antialiased. Fonts come from Google Fonts (open faces).

## Container model
`.wrap`: max-width 74rem, margin 0 auto, padding 0 7vw. `.split`: grid .86fr 1.14fr, gap clamp(1.6rem,4vw,3rem), collapses to one column ≤ 820px.
Sections: padding clamp(4rem,8vh,6rem) 0; `.room-section` carries a 1px top rule in line; `.alt` uses parch. Departure: padding 4rem 0.
Header height 72px (--nav-h), sticky. Hero: 100vh cover image with a subtle top-to-bottom scrim; at ≤ 640px it becomes natural-height contain below the header.

## Buttons and links
`.btn`: inline-flex, min-height 44px, padding .72rem 1rem, 1px leaf border, radius 3px, Inter 600 .74rem, letter-spacing .07em, uppercase, leaf on transparent; hover tint rgba(78,93,68,.08) and translateY(-1px). `.r24-btn-solid`: leaf fill, #fbf8f1 text. At ≤ 430px buttons are full width.
Underlined CTAs (`.story-nursery-home-cta`, `.r24-arriving`): Inter 600 uppercase, 1px bottom border.

## Source breakpoints
920 · 900 · 820 · 760 · 720 · 640 · 600 · 520 · 480 · 430 · 400 · 380 (max-width). Gate widths: 1440 and 360.
