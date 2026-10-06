<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-10-05T10:13:55Z
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
    - stardust/current/pages/index.html
  synthesizedInputs: []
  stardustVersion: 0.27.0
-->
---
name: Example Domain
description: A single centered notice page in the operating system's own typeface on a light grey ground.
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
rounded:
  none: "0px"
spacing:
  inline: "2em"
  top: "25vh"
  bottom: "2em"
  icon-pull: "-2.75em"
components:
  link:
    textColor: "{colors.link}"
    typography: "{typography.body}"
---

# Design System: Example Domain

## Overview

The current site is one page: a short notice, repeated in six languages, under a small
line-drawn icon, centered in a narrow column on a flat light-grey ground. Nothing is
decorated. The page relies entirely on the browser's defaults — the system font stack,
the default link blue, the default underline — plus four authored rules. The register
reads as neutral and institutional.

## Colors

- **page-bg** `#eeeeee` — the only authored color; set on `html` as `light-dark(#eee, #222)`.
  The captured and target state is the light scheme.
- **text** `#000000` — browser default body text. All six paragraphs; the icon inherits it via `currentColor`.
- **link** `#0000ee` — browser default `:link`, underlined. One link on the page.

Tone is carried by opacity, not by extra colors: the icon sits at 55 % opacity and every
paragraph after the first at 60 %.

## Typography

One family, one weight. `body { font: 16px/1.6 system-ui, sans-serif }`.

- **body** — 16px / 1.6 (25.6px), 400. The first paragraph and the link.
- **body-secondary** — `.875em` (14px) / 1.6 (22.4px), 400, opacity .6. Every paragraph after the first (`p + p`).

There are no headings on the page. The two sizes relate by a single authored ratio (.875).

## Layout

A single centered column: `body { max-width: 26em; margin: auto; padding: 25vh 2em 2em; text-align: center }`.
At 16px the column is 416px wide plus 2em side padding; the top padding is a quarter of
the viewport height, so the block sits in the upper-middle of the screen on desktop and
near the top on a short phone. The icon is a 44 × 44 block pulled up by 2.75em
(`svg { display: block; margin: -2.75em auto 0 }`) so it overlaps into the top padding.
No breakpoints are authored; the layout is fluid below 26em + 4em.

## Shapes

No radii, borders, or shadows anywhere. The icon is a stroked line drawing (`fill: none; stroke: currentColor`).

## Components

- **Icon** — inline SVG, 44 × 44, `currentColor`, opacity .55, centered above the copy.
- **Notice paragraph** — plain `p`, centered text; first at body size, the rest at body-secondary.
- **Link** — a bare anchor, browser default styling, text "Learn more", external target.

## Do's and Don'ts

- Do keep every value exactly as captured; the design is the browser default plus four rules.
- Do keep the paragraph order and the opacity steps — they are the page's only hierarchy.
- Don't introduce headings, a header or a footer, a web font, or any color beyond the three above.
