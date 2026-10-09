---
name: myAstraZeneca Suisse (FR)
description: AstraZeneca Switzerland HCP portal — magenta and mulberry on white, Lexia display headings, Inter body, photography hero bands.
colors:
  primary: "#D0006F"
  primary-deep: "#830051"
  primary-darkest: "#4F0031"
  text: "#3C4242"
  background: "#FFFFFF"
  surface: "#EBEFEE"
  border: "#D8DFDE"
  border-soft: "#D8DADA"
  muted: "#656969"
  muted-light: "#B2B4B4"
  label: "#8D8F8F"
  accent-mustard: "#F0AB00"
  accent-sage: "#9DB0AC"
  table-highlight: "#E6CCDC"
  inpage-pink: "#E366A9"
  dark: "#000000"
typography:
  display:
    fontFamily: "Lexia, Georgia, serif"
    fontSize: "56px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "normal"
  h2:
    fontFamily: "Lexia, Georgia, serif"
    fontSize: "46px"
    fontWeight: 400
    lineHeight: 1.2
  h3:
    fontFamily: "Lexia, Georgia, serif"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1.2
  h4:
    fontFamily: "Lexia, Georgia, serif"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.25
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 500
  button:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 700
rounded:
  sm: "4px"
  md: "8px"
  lg: "20px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-tertiary:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.background}"
    rounded: "{rounded.md}"
  tab-on:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
  tab-off:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
---
<!-- stardust:provenance
writtenBy: stardust:extract
writtenAt: 2026-10-07T09:27:00Z
stardustVersion: 0.27.0+e68296b7aee4
readArtifacts: stardust/current/_computed-styles.json, stardust/current/_brand-extraction.json, stardust/current/assets/css/*.css, stardust/current/pages/*.json
synthesizedInputs: none
-->

## Overview

The current myAstraZeneca Suisse (FR) site is a white, airy HCP portal. Large light Lexia headings in graphite sit over Inter body text; the brand magenta (#D0006F) is reserved for buttons, link hover, tab states and title accents, with mulberry (#830051) as the deeper title colour. Each disease page opens with a full-width photographic hero band carrying a white H1. The "See the PATTRNS" campaign pages switch to a dark starry visual language (black and deep purple panels, pink accents, Montserrat display) inside the same chrome. This file describes what exists; it is not a direction.

## Colors

- Primary magenta `#D0006F` — primary buttons, link hover, tabs on, warning/interaction text.
- Mulberry `#830051` and aubergine `#4F0031` — title colour 1 and dark core backgrounds.
- Graphite `#3C4242` — all body text and headings on light backgrounds; tertiary button border.
- White `#FFFFFF` page background; mist `#EBEFEE` supporting bands, borders, tabs off, alternate table rows; `#D8DFDE` header rows and borders.
- Rare accents: mustard `#F0AB00`, sage `#9DB0AC` (theme tokens, little measured use); table highlight `#E6CCDC`; in-page pink `#E366A9`.
- Black `#000000` is the measured surface of the PATTRNS campaign panels.

## Typography

- Headings: Lexia 400 at 56 / 46 / 36 / 26 px (h1–h4), an arithmetic 10 px step; light (300) and bold (700) cuts are loaded but headings measure 400.
- Body: Inter 16 px / 1.5; small print and labels 12 px (Inter-Medium for labels); buttons Inter-Bold 16 px.
- The source declares Inter as separate families (Inter-Regular, Inter-Medium, Inter-Bold); Montserrat 500/700/800 appears on the campaign pages.
- Lexia is a commercial Dalton Maag face self-hosted by the source; Inter and Montserrat are open (OFL).

## Layout

- AEM 12-column responsive grid; fixed-width containers (`container--fixed`) centre the content; measured container caps are recorded in DESIGN.json `extensions.breakpoints`.
- Section rhythm via `container--tb-space` / `container--tb-space-md` paddings; full-bleed hero bands; 3-up icon stat tiles; image + text two-column rows; 3-up image cards on the home page.
- Header: logo left, two nav items, search, language switcher, magenta login button; breadcrumb strip on all inner pages. Footer: logo, three link columns, legal line with Swiss approval code and revision date.

## Elevation & Depth

No box shadows and no gradients were measured. Depth comes from background bands (mist, black, deep purple) and photography, not from elevation.

## Shapes

- 4 px radius on buttons and inputs (element mode); 8 px on cards and tiles (area mode); 20 px on a few campaign cards. No pill shapes measured.

## Components

- Buttons: primary magenta/white, secondary white with magenta border and text, tertiary white with graphite border and text; all 4 px radius, Inter-Bold 16 px.
- Links: graphite, hover magenta.
- Tabs / pill sub-nav (campaign): on magenta, off mist.
- Tables: header `#D8DFDE`, alternate rows mist, highlight `#E6CCDC`.
- Icon stat tile, image + text row, product-info CTA band, therapy-area image card with link list, PATTRNS dark panel, paired CTA cards, references list, breadcrumb.

## Do's and Don'ts

- Do keep magenta for actions and hover only; body and headings stay graphite.
- Do keep the hero band photography per disease area and the white H1 on it.
- Don't add shadows, gradients or motion the source does not have.
- Don't restyle the campaign pages toward the portal's light palette; their dark panels are the design.
