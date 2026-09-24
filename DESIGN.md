---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-09-23T19:11:52Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/community-development.json
    - stardust/replica/lift/tokens.json
---

# Design — captured current state of balbriggan.ie/community-development/

Every value below is a computed style measured on the live page (1440 and 360 px) or a rule in the theme stylesheets. See DESIGN.json for the machine form.

## Palette
- Brand blue rgb(36, 148, 210): header background, button text.
- Brand yellow rgb(245, 238, 47): primary-menu link colour, button fill and border.
- Text rgb(60, 60, 59) on white rgb(255, 255, 255).

## Type
- Body: Gotham-Light, sans-serif · 16px/24px · 400.
- H1 (page title): GothamBold · 40px/48px · weight 500 · centred · margin 0 0 8px.
- H4 (Chair, Members): GothamMedium · 24px/28.8px · weight 500 · margin 0 0 8px.
- Top utility menu: GothamMedium · 12px/18px · white. Primary menu: Gotham-Light · 12px/18px · uppercase · yellow.
- The Gotham families are declared but never loaded by the site (no @font-face); the page renders in the browser's fallback face. The stacks are kept verbatim.

## Layout
- Bootstrap 4 container: max-width 1140px centred, 15px side padding (1110px content at 1440; 330px at 360).
- Sticky header: blue bar 98px tall at 1440 (90px at 360), padding 8px 16px; logo 176×72 at left; two stacked menu rows at right; hamburger at 360.
- Intro: three flex columns, gap 32px, centre column holds the paragraph (837px wide) and button; margin-bottom 48px + padding-bottom 48px.
- Membership: two flex columns, gap 32px; chair card is itself two columns (image 165px wide, text) at 1440 and stacks at 360.
- Page height 1970px at 1440, 3778px at 360.

## Buttons
- .btn-secondary ("View Objectives"): yellow fill, blue text, 2px yellow border, radius 32px, padding 2.4px 32px, GothamMedium 16px/24px weight 700, uppercase.
- Header "Get Involved": same colours and radius, padding 2.4px 16px, 12px/18px weight 400, uppercase.
