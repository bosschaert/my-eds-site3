---
name: Nirav Manubhai — A Home on the Web (replica)
description: Descriptive design spec of the captured home page — paper and parchment surfaces, Playfair Display headings, Inter body, leaf-green accents.
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-23T18:47:00Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/lift/tokens.json
colors:
  paper: "#f4efe3"
  parch: "#ece3d1"
  ink: "#2c2519"
  ink-soft: "#6b5f47"
  taupe: "#8a7f66"
  leaf: "#4e5d44"
  leaf-dark: "#3c4934"
  line: "#cabfa3"
  gold: "#b2843e"
  eyebrow-gold: "#a47c3d"
  guj-green: "#43533b"
  card-media-bg: "#e9e2d4"
  poster-insert-bg: "#efe4cf"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.2rem, 5vw, 3.6rem)"
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: "normal"
  section-title-centered:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "normal"
  card-title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "1.35rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  lede:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.12rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  eyebrow:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.68rem"
    fontWeight: 600
    lineHeight: 1.7
    letterSpacing: "0.2em"
  serif-note:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  gujarati-blessing:
    fontFamily: "Rasa, Playfair Display, serif"
    fontSize: "2.2rem"
    fontWeight: 600
    lineHeight: 1.8
    letterSpacing: "normal"
  chrome-link:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "0.065em"
rounded:
  none: "0px"
  sm: "3px"
spacing:
  gutter: "7vw"
  card-pad: "1rem"
  card-gap: "1.25rem"
  section-y: "clamp(4rem, 8vh, 6rem)"
  story-y: "3rem"
  departure-y: "4rem"
  header-pad: "18px 28px"
  footer-pad: "30px 20px"
components:
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.leaf}"
    rounded: "{rounded.sm}"
    padding: "0.72rem 1rem"
    height: "44px"
  room-card:
    backgroundColor: "rgba(255,255,255,.22)"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.card-pad}"
  header:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "{spacing.header-pad}"
  footer:
    backgroundColor: "{colors.parch}"
    textColor: "{colors.ink-soft}"
    padding: "{spacing.footer-pad}"
---

# Design — Nirav Manubhai home page (replica, descriptive)

## Overview
This file describes the captured state of https://www.niravmanubhai.com/ on 2026-09-23. It is the target spec for a same-design migration: every value traces to the site's own CSS or to a measured box (`stardust/replica/lift/`). Nothing here is a recommendation.

## Colors
Paper (#f4efe3) is the page and header surface; parchment (#ece3d1) marks the alternate sections (conversation) and the footer. Ink (#2c2519) is body text, ink-soft (#6b5f47) is secondary prose and lede text, taupe (#8a7f66) is card numbering. Leaf green (#4e5d44) carries every accent: eyebrows, buttons, card links, the Story Nursery title. The Story Nursery eyebrow alone uses a warm gold (#a47c3d); the Gujarati blessing uses a deeper green (#43533b). Lines are #cabfa3.

## Typography
Playfair Display for all headings and for italic serif notes (taglines, "first visit" note, farewell). Inter for body, eyebrows, buttons and chrome. Rasa for the Gujarati blessing. Body is 17px/1.7 (line-height 1.68 at ≤720px). Section headings use `clamp(2.2rem, 5vw, 3.6rem)` (57.6px at 1440, 35.2px at 360); the host heading drops to 1.75rem at ≤640px. Global `text-rendering: optimizeLegibility` and `-webkit-font-smoothing: antialiased`.

## Layout
One content container `.wrap`: max-width 74rem, padding 0 7vw, centred. The Story Nursery section uses its own `min(1100px, 92vw)` wrap and a `min(920px, 86vw)` 2:1 image. Sections: full-viewport hero (100vh, image cover, mobile: intrinsic height with a dedicated mobile image), host (flex figure: note ≤44rem beside a 340px portrait), Story Nursery (centred stack), Rooms (3-column card grid → 2 at ≤920px → 1 at ≤600px), Conversation (2-column grid `minmax(320px,.95fr) minmax(0,1.05fr)` → 1 at ≤820px), Departure (2-column grid → 1 centred at ≤640px). Header is sticky, 3-column grid (home link · title · menu button), 81px tall at desktop. The root reserves a stable scrollbar gutter.

## Elevation & Depth
Header: `0 1px 8px rgba(40,50,34,.25)` plus a 1px bottom line. Host portrait: `0 2px 14px rgba(44,37,25,.12)` with a 1px border. Conversation image: `0 3px 16px rgba(44,37,25,.12)`. Hero carries a faint top-to-bottom scrim (paper 5% → ink 10%). Cards have no shadow; they lift 3px on hover.

## Shapes
Square corners almost everywhere (cards, images, header). Buttons and the conversation image use a 3px radius.

## Components
- **Header**: sticky paper bar; "Home" (14px Inter, .08em tracking), centred site name (Playfair), ☰ button (26px, 44px hit area). Opens a right-hand drawer (min(340px,70vw), paper, Playfair 19px links) behind a 28% black overlay.
- **Room card**: 1px line border, 22% white fill, 1rem padding; 16:10 media frame (#e9e2d4, 1px line), number small-caps in taupe, Playfair 1.35rem title, .9rem note, uppercase leaf link.
- **Outline button**: inline-flex, 44px min height, 1px leaf border, 3px radius, Inter 600 .74rem uppercase .07em; full-width at ≤430px.
- **Eyebrow**: Inter 600 .68rem uppercase .2em leaf, .6rem below.
- **Footer**: parchment, centred flex of uppercase 13px links (ink-soft), 22px gaps, wraps at ≤720px.

## Do's and Don'ts
- Do keep every value above verbatim; the inconsistency register (`stardust/replica/inconsistency-register.md`) is empty, so there are no permitted deltas.
- Don't add `text-wrap: balance`, a universal box-sizing change beyond the source's own `*{box-sizing:border-box}`, or any new colour.
