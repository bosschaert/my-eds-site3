---
_provenance:
  writtenBy: stardust:replica
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/tokens.json
name: Nirav Manubhai — a home on the web
description: Descriptive design record of the live home page, promoted as the fixed replica target.
colors:
  paper: "#f4efe3"
  parch: "#ece3d1"
  cream: "#f5eddc"
  surface: "#e9e2d4"
  paper-light: "#fbf8f1"
  ink: "#2c2519"
  ink-soft: "#6b5f47"
  taupe: "#8a7f66"
  noir: "#0f0d09"
  leaf: "#4e5d44"
  leaf-dark: "#3c4934"
  gold: "#b2843e"
  gold-text: "#8a6a2f"
  line: "#cabfa3"
  line-faint: "rgba(44,37,25,.16)"
  focus: "#e6c77d"
  whatsapp: "#1f8f4e"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.2rem, 5vw, 3.6rem)"
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: "normal"
  card-title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "21.6px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "normal"
  lede:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "18.88px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  small:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14.4px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  eyebrow:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.68rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.2em"
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11.84px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.07em"
rounded:
  control: "3px"
  image: "14px"
  room: "16px"
spacing:
  s1: "0.5rem"
  s2: "0.75rem"
  s3: "1rem"
  s4: "1.5rem"
  s5: "2rem"
  s6: "3rem"
  s7: "4.5rem"
  gutter: "clamp(1rem, 3.2vw, 2.25rem)"
components:
  button:
    backgroundColor: "transparent"
    textColor: "{colors.leaf}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1rem"
    height: "44px"
  button-hover:
    backgroundColor: "rgba(78,93,68,.08)"
  button-primary:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1rem"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.leaf-dark}"
  button-whatsapp:
    backgroundColor: "{colors.whatsapp}"
    textColor: "#ffffff"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1rem"
    height: "44px"
---

# Nirav Manubhai — a home on the web (design record, replica target)

Provenance: `bounded-single`. Every value below is lifted from the live site's own CSS
(`stardust/current/assets/css/home.css`), its `:root` custom properties, or the computed-style
census at 1440 and 360 (`stardust/current/_computed-styles.json`). Nothing is a proposal.

## Overview

A warm paper page with ink text and one leaf-green accent. Playfair Display carries headings and
ledes, Inter carries running text and labels, Rasa carries the Gujarati glyphs. Rooms are
separated by hairline rules; photographs sit in soft shadows with 14–16px corners.

## Colors

Backgrounds: paper `#f4efe3` (page, header), parchment `#ece3d1`, surface `#e9e2d4`. Text: ink
`#2c2519` (body, headings), soft ink `#6b5f47` (ledes, notes), taupe `#8a7f66` (some eyebrows),
gold text `#8a6a2f`. Accent: leaf `#4e5d44` (buttons, links, the Story Nursery heading), leaf dark
`#3c4934` (hover). Rules: line `#cabfa3`, header rule `rgba(44,37,25,.10)`. WhatsApp button
`#1f8f4e`. Focus ring `#e6c77d`.

## Typography

Body `Inter 17px / 1.7` (1.68 at ≤720px), antialiased, `optimizeLegibility`. Section headings
`Playfair Display 400`, `clamp(2.2rem, 5vw, 3.6rem)` → 57.6px at 1440, 35.2px at 360 (the
welcome heading measures 28px at 360; the Story Nursery heading 48px/32px in leaf). Card titles
21.6px/500 (16.8px at 360). Books heading 30.4px. Ledes Playfair 18.88px soft ink. Small notes
Inter 14.4px soft ink. Eyebrows 0.68–0.7rem, 600, 0.2–0.22em tracking, uppercase. No
`text-wrap: balance` anywhere.

## Layout

Fluid shell, no shell cap. Content column `.wrap`: `max-width: 74rem` (1184px), centered,
`padding: 0 7vw`. The Story Nursery band is a fixed 1100px wrap with a 920px inner frame. Readers
46rem/44rem. Seven top-level sections: full-bleed courtyard hero (photo only; the words are in
the image), host, story nursery, rooms (door-card grid), story bouquet, conversation, farewell.
Global `box-sizing: border-box`. Source layout breakpoints (max-width): 920, 900, 820, 760,
720 (primary), 700, 640, 520, 480, 430. Spacing scale 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 4.5rem;
gutter `clamp(1rem, 3.2vw, 2.25rem)`.

## Elevation & Depth

`0 10px 34px rgba(44,37,25,.13)` (ambient), `0 3px 16px rgba(44,37,25,.12)` (cards),
`0 2px 14px rgba(44,37,25,.12)` with a 1px `rgba(44,37,25,.25)` border (host portrait). No
gradients.

## Shapes

3px on controls, 14px on images, 16px on room cards. Image frames: 16/10 room cards, 16/9
reading, 4/5 poster, 3/2 story, 5/7 book.

## Components

Button: inline-flex, min-height 44px, `.75rem 1rem`, 1px leaf border, 3px radius, 11.84px/600
uppercase 0.07em, transparent/leaf; hover `rgba(78,93,68,.08)` + `translateY(-1px)`; full width
at ≤430px. Primary: leaf fill, paper text, leaf-dark hover. WhatsApp: `#1f8f4e`. Header: sticky,
grid `1fr auto 1fr`, `18px 28px` (16px at ≤720), paper, hairline bottom rule, 81px tall at 1440;
"Home" Inter 14px 0.08em; wordmark Playfair 14px; ☰ 26px in a 44px hit area.

## Do's and Don'ts

Do keep every value above. Don't change anything that is not listed in
`stardust/replica/inconsistency-register.md` (currently empty: pure replica).
