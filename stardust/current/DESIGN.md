<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-09-23T18:39:20Z
  readArtifacts:
    - https://www.example.com/
    - stardust/current/_computed-styles.json
    - stardust/current/_brand-extraction.json
  synthesizedInputs: []
  stardustVersion: 0.25.0
-->
---
name: Example Domain
description: A single plain informational page in a system font on a light grey ground.
colors:
  page-bg: "#eeeeee"
  text: "#000000"
  link: "#334488"
typography:
  heading:
    fontFamily: "system-ui, sans-serif"
    fontSize: "1.5em"
    fontWeight: 700
    lineHeight: "normal"
    letterSpacing: "normal"
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "normal"
    letterSpacing: "normal"
rounded:
  none: "0"
spacing:
  page-top: "15vh"
  content-width: "60vw"
components:
  link:
    textColor: "{colors.link}"
    typography: "{typography.body}"
---

## Overview

The current site is one page whose entire stylesheet is five rules: a light grey body, a 60vw centered column with a 15vh vertical margin, a 1.5em bold heading, an 80% opacity content wrapper, and a single link colour. The browser's default user-agent styles supply everything else (heading and paragraph margins, underlined links, line-height). Descriptive record; nothing here is a recommendation.

## Colors

- `page-bg` #eeeeee: the body background (source: `body { background: #eee }`).
- `text` #000000: computed colour of the heading and paragraphs. The content wrapper is rendered at `opacity: 0.8`, so the perceived text is a dark grey over the page ground.
- `link` #334488: `a:link, a:visited` colour. Underline is the user-agent default.

## Typography

- Family: `system-ui, sans-serif` for everything. No web fonts are loaded; the rendered face is the platform's system font.
- Heading (h1): 1.5em of the 16px body, i.e. 24px, weight 700, user-agent margins (0.67em above and below).
- Body (p): 16px, weight 400, user-agent margins (1em above and below). Line-height is the user-agent `normal`.
- Scale: two sizes only (16 → 24); no modular scale is in use.

## Layout

- The body is the container: `width: 60vw; margin: 15vh auto`. At 1440 px the column is 864 px wide and starts 135 px from the top; at 360 px it is 216 px wide and starts at 15% of the viewport height.
- There is no header, footer, navigation, or grid. Content order is heading, paragraph, paragraph containing the link.
- Fully fluid: no media queries.

## Elevation & Depth

Flat. No shadows, borders, gradients or layered surfaces. The only depth cue is the 80% opacity of the content wrapper.

## Shapes

No border radius anywhere; nothing is a shape beyond the text.

## Components

- `link`: inline text link, colour #334488, underlined by default, no hover or focus styling beyond the user agent's.

## Do's and Don'ts

- Do keep the system font stack and the fluid 60vw column exactly as they are.
- Do keep the wrapper opacity; it is part of the perceived text colour.
- Don't add fonts, imagery, chrome or a fixed-width container; the page has none.
