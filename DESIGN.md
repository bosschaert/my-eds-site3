---
_provenance:
  writtenBy: stardust:replica
  mode: bounded-single
  writtenAt: 2026-10-13T10:43:04Z
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/lift/tokens.json
---

# DESIGN — current-design.jp (preserve, bounded-single)

Values lifted from the source site's own CSS (STUDIO-generated) and computed styles at 1440 / 360. Machine-readable twin: DESIGN.json.

## Palette
Primary blue #009bdd · text #444040 · muted #717171 · sand #f4f2ef · rule #d0cac4 · white. Nav pill rgba(255,255,255,.804). About scrim rgba(0,0,0,.33); contact-band scrim rgba(0,0,0,.17) + blur(3px) over a #717171 band; hero gradient 0deg rgba(0,0,0,.6)→0.

## Type
- Japanese: 秀英角ゴシック金 B / M JIS2004 (TypeSquare, licensed). Delivered with a metric-matched open substitute (Noto Sans JP) behind the brand family name — see stardust/replica/inconsistency-register.md R-01.
- Latin labels / nav / buttons: Montserrat 400/500.
- Ramp (desktop / mobile): H1 40/20 lh 1.8 ls .04em · section title 28/20 lh 1.8 ls .08em · News title 24 · section label Montserrat 14/500 lh 1.8 blue · body 15 lh 2.11 ls .06em · card body 14 lh 1.8 ls .18em palt justified · card title 18/16 · item title 16/14 lh 1.6 · tag 13/12 · date 12 muted.

## Components
- Pill buttons: radius 999px, padding 18px 32px (12px 32px mobile), 1px border, Montserrat 14 label; variants blue / sand / white.
- Header: fixed, top 24px, padding 0 40px (24px mobile); centred translucent pill nav; blue Contact pill 24px 38px; hamburger (sand pill) under 840px.

## Layout
Container max 1280px; gutters 80px desktop / 24px mobile; section padding 120px / 80px. Source breakpoints: max-width 840px and 540px.
