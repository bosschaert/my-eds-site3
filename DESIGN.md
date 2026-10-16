<!-- stardust:provenance
  writtenBy:        stardust:extract
  writtenAt:        2026-10-09T17:25:38Z
  mode:             --prep (replica, same-design migration; descriptive of the live site)
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
    - stardust/current/assets/css/site.css
    - stardust/current/pages/*.html (99)
  synthesizedInputs: []
  stardustVersion:  0.31.0
-->
---
name: Continental
description: Corporate site of Continental AG — "The Future in Motion" (current state, descriptive)
colors:
  continental-orange: "#ffa500"
  hover-amber: "#e38702"
  black: "#000000"
  white: "#ffffff"
  light-gray: "#f0f0f0"
  mid-gray: "#cdcdcd"
  slate-gray: "#6b6b6b"
  pastel-yellow: "#f4cf9b"
typography:
  display:
    fontFamily: "ContinentalStagSansW, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "52.5px"
    fontWeight: 500
    lineHeight: "61.25px"
    letterSpacing: "0.2px"
  headline:
    fontFamily: "ContinentalStagSansW, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "39.375px"
    fontWeight: 500
    lineHeight: "43.75px"
    letterSpacing: "0.2px"
  title:
    fontFamily: "ContinentalStagSansW, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "35px"
    fontWeight: 300
    lineHeight: "42px"
    letterSpacing: "0.2px"
  subtitle:
    fontFamily: "ContinentalStagSansW, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "26.25px"
    fontWeight: 500
    lineHeight: "28px"
    letterSpacing: "1px"
  card-title:
    fontFamily: "ContinentalStagSansW, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "ContinentalStagSansW, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "17.5px"
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "ContinentalStagSansW, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  none: "0px"
  pill: "24px"
  icon: "28px"
  input: "48px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  2xl: "64px"
  gutter-lg: "104px"
components:
  button-primary:
    backgroundColor: "{colors.continental-orange}"
    textColor: "{colors.black}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.slate-gray}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.black}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.continental-orange}"
  button-tertiary:
    backgroundColor: "{colors.slate-gray}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
  button-hollow:
    textColor: "{colors.black}"
    rounded: "{rounded.pill}"
    padding: "10px 24px"
  button-hollow-hover:
    backgroundColor: "{colors.continental-orange}"
  nav-link:
    textColor: "{colors.slate-gray}"
    typography: "{typography.label}"
    padding: "6px 10px"
  nav-link-hover:
    textColor: "{colors.hover-amber}"
  header-logo-flag:
    backgroundColor: "{colors.continental-orange}"
    textColor: "{colors.black}"
    width: "255px"
    height: "160px"
  breadcrumb:
    textColor: "{colors.slate-gray}"
  footer:
    backgroundColor: "{colors.light-gray}"
    textColor: "{colors.black}"
  input-search:
    backgroundColor: "{colors.light-gray}"
    rounded: "{rounded.input}"
  teaser-card:
    textColor: "{colors.black}"
    typography: "{typography.card-title}"
    rounded: "{rounded.none}"
---

# Design System: Continental

## Overview

**Creative North Star: "The Orange Flag"**

Continental's corporate site is a white, photo-led, grid-disciplined system hung from one unmistakable device: the orange (#ffa500) logo flag that drops from the top-left of a white meta bar on every page. Orange is the only brand hue; everything else is black type, white ground and a short ladder of greys. Depth comes from full-bleed photography in the stage slider and section background images, not from shadows or gradients.

Density is moderate and corporate. Fluid containers with wide side margins (104px at ≥1279px) hold Bootstrap-style 12-column rows of teaser cards and text-image blocks, separated by a steady 64px content rhythm. Type is a single licensed family, ContinentalStagSansW, set Light (300) for body and Book/Med for headings and UI, which keeps the voice calm and factual. Interaction is quiet: links and nav turn amber (#e38702), orange pill buttons turn slate grey with white text, all on a 150ms ease-in-out.

**Key Characteristics:**
- One brand color (#ffa500) on black and white; greys for structure.
- Orange logo flag + white meta bar + mega-menu main nav on every page.
- Full-bleed hero stage slider with h1-size headline and orange pill CTA.
- Pill-shaped CTAs (24px radius, 48px tall); square-cornered cards and images.
- Light-weight body copy at 17.5px root.
- Flat surfaces: shadows only on the sticky header and slider arrows.

## Colors

A single saturated orange carries the brand against pure black and white, supported by three neutrals and one hover amber.

### Primary
- **Continental Orange** (#ffa500, CSS `orange`): logo flag, mobile meta bar, primary pill buttons, hollow-button hover fill, `.o-container.is-yellow` bands, job-card borders.

### Secondary
- **Hover Amber** (#e38702): hover color for every text link, main-nav link and breadcrumb link. Never a fill.
- **Slate Gray** (#6b6b6b): main-nav link color, meta-bar items, primary-button hover fill, tertiary button background.

### Neutral
- **Black** (#000000): all body and heading text, button labels, hollow-button border.
- **White** (#ffffff): page ground, desktop meta bar, `.o-container.is-white` bands, secondary buttons.
- **Light Gray** (#f0f0f0): footer, `.is-lightgray` bands, search inputs, tab borders.
- **Mid Gray** (#cdcdcd): dividers, country-selector rules, `.is-gray` bands.
- **Pastel Yellow** (#f4cf9b): occasional `.is-pastel-yellow` bands on home and press hubs. Pastel red/blue/green bands are defined in CSS but rare or unused.

### Named Rules
**The One Hue Rule.** Orange is the only chromatic brand color; it appears as fills (flag, buttons, bands), never as body text.

**The Amber Hover Rule.** Hover on text means #e38702; hover on an orange button means slate grey with white text.

## Typography

**Display Font:** ContinentalStagSansW (with -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif)
**Body Font:** ContinentalStagSansW (same stack)

**Character:** A single corporate grotesque in three faces (Light 300, Book 400, Med 700). Light body copy and Book-weight headings give a restrained, technical tone; Med appears only on interactive and card labels. The font is licensed: do not rehost.

### Hierarchy
- **Display** (500 → Book face, 52.5px / 61.25px at ≥1279px; 43.75px at ≥767px; 32.8px mobile): page and stage h1 (`h1, .u-text-h1`, `.c-heroteaser__title`).
- **Headline** (500, 39.375px / 43.75px at ≥1279px; 32.8px tablet; 26.25px mobile): section h2.
- **Title** (300, 35px / 42px at ≥1279px; 32.8px tablet; 26.25px mobile): h3. The census also records 30px/600 h3 instances inside components.
- **Subtitle** (500, 26.25px / 28px, letter-spacing 1px; 21.9px mobile): h4.
- **Card title** (600 → Med face, 24px / 1.2): `.c-teaser__header`, fact-box numbers (24px; 42px at ≥1023px).
- **Body** (300, 17.5px / 1.4): paragraphs and rich text; root font-size is 17.5px and all spacing is authored in rem.
- **Label** (600, 16px): main-nav links; buttons use 600 at 17.5px; footer column headers 600 at 20px.

### Named Rules
**The Light Body Rule.** Running text is weight 300. Bold emphasis uses the Med face (700) because no 500/600 face exists.

**The Ad-hoc Ramp Rule.** Sizes are rem multiples of 17.5px (3, 2.25, 2, 1.5, 1.25, 1), not a modular scale (h1→h4 ratios 1.33 / 1.13 / 1.33).

## Layout

Fluid, not capped: `.container` uses side margins of 8px (mobile), 40px (≥767px) and 104px (≥1279px); the header meta bar caps at 1920px. Content sits in `.o-container` section bands (padding 48px top / 64px bottom; 76px side padding ≥767px) that carry a background variant (`is-white`, `is-lightgray`, `is-gray`, `is-pastel-yellow`, or a `has-image` background photo). Inside, a Bootstrap-derived 12-column row with 16px gutters (32px between columns) lays out teaser grids at col-12 → col-sm-6 → col-md-4/3 → col-lg-3. Consecutive content elements are spaced 64px apart (`.o-page__ce`). Spacing steps are 8px multiples authored in rem (8, 16, 24, 32, 40, 48, 64, 76, 104).

Source breakpoints (site.css, `--current-breakpoint`): sm 767px, md 1023px, lg 1279px, xl 1680px; max-width counterparts at 766.98 / 1022.98 / 1278.98px. The header switches from burger/off-canvas to the full main nav at 1279px; the logo flag grows from 150×56px (mobile) to 220×136px (≥767) to 255×160px (≥1023).

## Elevation & Depth

Flat by default. Depth comes from photography (full-bleed stage slides, section background images) and tonal bands, not shadows. Only two shadows recur.

### Shadow Vocabulary
- **Sticky header** (`box-shadow: 0 0 5px #969696`): `.o-header__meta.is-sticky` once the page scrolls.
- **Slider arrow** (`box-shadow: 0 0 3px 0 rgba(0,0,0,.4)`): white-ringed circular arrows on hero sliders, for legibility over photos.
- **Overlay panel** (`box-shadow: 0 3px 20px rgba(0,0,0,.2)`): dropdown and modal panels.

### Named Rules
**The Flat Card Rule.** Teaser cards have no shadow, border or radius; the image edge and the type do the work.

## Shapes

Two shape vocabularies coexist: rectangles for content and pills/circles for controls. Images, teaser cards and section bands are square-cornered. Buttons are pills (24px radius on a 48px height), form inputs are rounded at 48px (search 34px), icon backgrounds are 28px circles (the cross-page radius mode), and slider arrows, play buttons and radios are 50% circles. A faint 120° grey gradient (5–10% alpha) fills lazy-loading image placeholders.

## Components

### Buttons
- **Shape:** pill (24px radius), min-height 48px, padding 10px 24px, Med 600 at 17.5px.
- **Primary:** orange #ffa500 fill, black label; optional leading 14px icon (internal chevron, download, external, mail).
- **Hover / Focus:** fill → slate #6b6b6b, label → white, 150ms ease-in-out.
- **Secondary:** white fill, black label, orange icon; hover fills orange. **Tertiary:** slate fill, white label; hover #969696. **Hollow:** 1px black border, transparent; hover fills orange. On orange bands, primary buttons flip to white.

### Cards / Containers
- **Corner Style:** square (0).
- **Background:** inherits the section band.
- **Shadow Strategy:** none (see Elevation).
- **Internal Padding:** image then 24px gap, header 24px/600, text, link.

### Inputs / Fields
- **Style:** light-gray #f0f0f0 fill, no border, 48px radius (search 34px), orange or icon submit circle.
- **Focus:** browser default; no custom ring captured.

### Navigation
- **Meta bar:** fixed, white at ≥767px (orange on mobile), 80–84px tall, holding the orange logo flag (logo + "The Future in Motion" slogan), country selector, language menu and quick search.
- **Main nav:** `c-main-nav` links in slate #6b6b6b, 600 at 16px, hover amber; mega dropdowns with title, text and link lists. Below 1279px: burger + off-canvas.
- **Breadcrumb:** `c-breadcrumb` 500-weight links in black/slate, hover amber, paired with `c-pageoptions` share.
- **Footer:** #f0f0f0, social icon row, four link columns (Contact Us, Quick Access, Websites, Terms & Conditions) that collapse to accordions on mobile, copyright line.

### Hero stage (signature)
`c-heroteaser-fixed--slider`: full-bleed photographic slides with an h1-size title (black or white text variant), description and one or two orange pill CTAs, white-ringed circular arrows and dots. Interior pages use the single `c-heroteaser` / `--small` stage.

## Do's and Don'ts

### Do:
- **Do** keep #ffa500 as the only chromatic fill, with black text on it.
- **Do** use 24px-radius pills at 48px height for every CTA, hovering to #6b6b6b with white text.
- **Do** keep cards, images and bands square-cornered and shadowless.
- **Do** set body copy in ContinentalStagSansW Light 300 at 17.5px / 1.4, from a licensed source only.
- **Do** hover text links to #e38702 over 150ms ease-in-out.

### Don't:
- **Don't** rehost the ContinentalStagSansW files; they are licensed.
- **Don't** introduce gradients, card shadows or rounded image corners; the live site uses none.
- **Don't** use orange for body text or long runs of copy.
- **Don't** apply the stylesheet's Bootstrap `--primary: #007bff`; it is an unused framework default.
