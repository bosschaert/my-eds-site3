<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-10-08T09:24:52Z
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
    - stardust/current/pages/index.html
  synthesizedInputs: []
  stardustVersion: 0.29.1
-->
---
name: Example Domain
description: A single, centered explanatory page in system type on a light grey ground.
colors:
  page-bg: "#eeeeee"
  text: "#000000"
  link: "#0000ee"
typography:
  body:
    fontFamily: "system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-secondary:
    fontFamily: "system-ui, sans-serif"
    fontSize: "0.875em"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded: {}
spacing:
  inline: "2em"
  bottom: "2em"
  top: "25vh"
  measure: "26em"
components:
  link:
    textColor: "{colors.link}"
    typography: "{typography.body}"
---

# Example Domain — current state

## Overview

One centered column of text, 26em wide, vertically offset by a quarter of the viewport, on a flat light grey page. A small decorative glyph (book with quotation marks) sits above the copy at 55% opacity. Six paragraphs repeat the same notice in six languages; the first is full size, the rest smaller and at 60% opacity. One underlined link closes the page. The page declares `color-scheme: light dark`; the captured state is the light scheme.

## Colors

- Page background `#eeeeee` (light scheme of `light-dark(#eee,#222)`).
- Text `#000000` (user-agent default; paragraphs after the first render at opacity .6).
- Link `#0000ee` (user-agent default, underlined; visited and focus colours are defaults too).

## Typography

- One family, `system-ui, sans-serif`, weight 400, line-height 1.6.
- Body 16px; secondary paragraphs 0.875em (14px). No headings exist on the page.
- Text is centered. Arabic paragraph is `dir="rtl"`.

## Layout

- `body`: `max-width: 26em; margin: auto; padding: 25vh 2em 2em; text-align: center`.
- The glyph: 44×44, `display: block; margin: -2.75em auto 0`.
- No breakpoints: the layout is fluid down to 2em side padding.

## Elevation & Depth

None. Flat surface, no shadows, no borders.

## Shapes

No radii. The only shape is the inline SVG glyph.

## Components

- Link: default underlined anchor, `#0000ee`, 16px.

## Do's and Don'ts

- Do keep the six-language sequence and order verbatim.
- Do keep the opacity steps (.55 glyph, .6 secondary paragraphs) rather than approximating with grey.
- Don't add headings, a header or a footer: the page has none.
