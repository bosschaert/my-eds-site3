---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-01T13:48:12Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/lift/tokens.json
---

# The Beast Is Back Inc — design spec (preserved current state)

Values lifted from the live site's CSS and computed styles (`stardust/replica/lift/tokens.json`, machine form in `DESIGN.json`). Descriptive, not creative.

## Palette
White page (#fff), black text (#000), accent orange #f26447 (logo, title overlays, Instagram icon, mobile rules), button orange #f26245, thumbnail placeholder #dfddc6, nav links #000 with active/hover #c4a03f, mobile nav links rgba(0,0,0,.7), newsletter block black (#000) with white text.

## Type
- Body: PT Serif 400, 14px / 1.6em.
- Nav: Source Sans Pro 700, 15px, uppercase, letter-spacing 1px; mobile nav 16px / 2.5em; mobile "Menu" link 16px.
- Project title (overlay, transparent until hover): Source Sans Pro 600, 18px / 1.6em, capitalize.
- Newsletter title: Source Sans Pro 700, 30px / 1.2em, capitalize (27px at ≤320px / small container); description PT Serif 15px / 24px; footnote 12px at 80% opacity.
- Fonts self-hosted from their open source (Google Fonts, OFL): PT Serif 400 and Source Sans 3 variable (600–700).

## Container model
- Canvas: max-width 1200px content + 76px padding (content-box), margin 10px auto; ≤750px: padding 0 20px 20px.
- Header: logo image 140px (120px at mobile) centred, nav 22px below, header margin-bottom 44px (30px mobile); page padding 57px 0.
- Grid: autocolumns masonry — columns = max(1, floor(W/300)), 12px gutters, shortest-column placement, wrapper margin-top −1.2%; images 300w renditions at desktop, 500w at mobile.
- Footer: blocks padded 17px; spacer 61px (desktop only); newsletter block padding 34px 17px, input 244×52, button 135×52 (border 1px #f26245, radius 3px); copyright centred; social icon 26px anchor with 52px glyph, margin-top 17px.

## Breakpoints
Source: one breakpoint at 750px (mobile nav, canvas padding, column collapse by the masonry). Gate breakpoints for this run: 1440 and 360.
