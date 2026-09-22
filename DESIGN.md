<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-09-22T09:11:00Z
  readArtifacts:
    - https://www.example.com/
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
    - stardust/replica/capture/live-inline.css
  synthesizedInputs: []
  stardustVersion: 0.22.1
-->
---
name: Example Domain
description: A single reserved-domain notice page, rendered as plain system-font text on a light grey field.
colors:
  field: "#eeeeee"
  ink: "#000000"
  link: "#334488"
typography:
  heading:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1.5em"
    fontWeight: 700
    lineHeight: normal
    letterSpacing: normal
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: normal
    letterSpacing: normal
rounded: {}
spacing:
  column-width: "60vw"
  block-margin: "15vh"
  h1-margin: "0.67em"
  p-margin: "1em"
components:
  link:
    textColor: "{colors.link}"
    typography: "{typography.body}"
  link-visited:
    textColor: "{colors.link}"
---

# Design System: Example Domain

Descriptive record of the live site as captured on 2026-09-22. This is the current state, not a proposal: every value below is lifted from the page's 130-byte inline stylesheet (`stardust/replica/capture/live-inline.css`) or measured by the computed-style census.

## Overview

One page, one column, no chrome. A light grey field carries a bold system-font heading, one paragraph and one underlined blue link, all wrapped in a container at 80% opacity, so nothing is fully black. The design does nothing beyond making the text legible.

## Colors

- `field` #eeeeee is the page background (`body{background:#eee}`).
- `ink` #000000 is the browser default text colour; through `div{opacity:0.8}` it renders at roughly #303030 over the field.
- `link` #334488 is the only authored colour (`a:link,a:visited{color:#348}`), identical for visited links, with no hover or active rule. It also renders at 80% opacity.

## Typography

- Family: `system-ui, sans-serif` for everything. No web fonts are served.
- `h1` at 1.5em (24 px at the 16 px root), weight 700, UA default line-height and margins (0.67em).
- Body and link at 16 px, weight 400, UA default line-height.
- Scale audit: ad-hoc. Two sizes with a 1.5 ratio.

## Layout

- The `body` is the content column: `width: 60vw; margin: 15vh auto`. At 1440 px that is an 864 px column starting 135 px from the top; at 360 px a 216 px column starting 15vh down.
- No breakpoints, no media queries. The viewport-relative box is the entire responsive behaviour.
- No header, footer or navigation landmarks.

## Elevation & Depth

None. No shadows, no layering, no gradients. The only depth cue is the 80% opacity wrapper.

## Shapes

No radii, no borders, no shapes. Plain text on a flat field.

## Components

- Link: underlined, colour `{colors.link}`, `:link` and `:visited` identical, no hover state. Label "Learn more", target `https://iana.org/domains/example`.
- No buttons, cards, inputs, navigation or repeated modules exist.

## Do's and Don'ts

- Do keep the body-as-column model (60vw / 15vh) and the opacity wrapper; they define the whole composition.
- Do keep system fonts; nothing is served and nothing should be.
- Don't add a logo, favicon, imagery, hover state, motion or chrome. None exist on the captured page.
