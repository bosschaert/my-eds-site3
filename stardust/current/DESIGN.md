<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-09-28T07:23:11Z
  readArtifacts:
    - stardust/current/pages/index.html
    - stardust/current/_computed-styles.json
    - stardust/current/assets/screenshots/index.png
  synthesizedInputs: []
  stardustVersion: 0.25.1
-->
---
name: Example Domain
description: A single-notice landing page on a light grey canvas, set in the system UI font.
colors:
  canvas: "#eeeeee"
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
rounded: {}
spacing:
  page-top: "15vh"
  paragraph: "1em"
components:
  link:
    textColor: "{colors.link}"
    typography: "{typography.body}"
---

## Overview

The page is a plain browser-default document with five authored CSS rules. Everything not named by those rules is the browser's user-agent stylesheet: heading and paragraph margins, underlined links, black text. The content sits in one `div` at 80% opacity, so all text and the link render slightly softened against the grey canvas.

## Colors

- Canvas `#eeeeee` on `body`.
- Text `#000000` (user-agent default) inside a container at `opacity: 0.8`, so it paints as a dark grey.
- Links `#334488` for `:link` and `:visited`; no hover or focus rule.

## Typography

- Family: `system-ui, sans-serif` for everything (measured as `system-ui` at both widths).
- `h1`: `1.5em` (24px measured), weight 700 from the user-agent default, default margins.
- Body: 16px, weight 400, default paragraph margins (1em).

## Layout

- Single column: `body { width: 60vw; margin: 15vh auto }`. The content block is 60% of the viewport width and offset 15% of the viewport height from the top at every width; there are no media queries.
- At 1440px the column is 864px wide; at 360px it is 216px wide with text wrapping onto several lines.
- Document order: `h1`, paragraph, paragraph containing the link.

## Elevation & Depth

None. No shadows, gradients or layered surfaces.

## Shapes

None. No radii or borders.

## Components

- Link: inline text link, `#334488`, user-agent underline, same state for visited. It is the page's only interactive element.

## Do's and Don'ts

- Do keep the user-agent defaults where the source names no value (margins, underline, heading weight).
- Do keep the 80% opacity on the content block; it is the reason the text is not pure black.
- Don't add a header, footer, favicon, imagery or hover styling; none exist on the source.
