<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-09-23T13:24:59Z
  readArtifacts:
    - stardust/current/_computed-styles.json
    - stardust/current/_brand-extraction.json
    - https://static-website.david-bosschaert.workers.dev/styles.css
  synthesizedInputs: []
  stardustVersion: 0.25.0
-->
---
name: Super Page
description: Playful pastel demo site — white rounded cards on a soft gradient, purple/teal/pink accents, tabbed team directory.
colors:
  surface: "#ffffff"
  primary: "#6a1b9a"
  primary-deep: "#4a148c"
  primary-tint: "#f3e5f5"
  text: "#333333"
  text-lead: "#5e35b1"
  text-block: "#444444"
  secondary: "#00897b"
  accent-cyan: "#26c6da"
  accent-pink: "#ec407a"
  tab-active: "#2196f3"
  tab-text: "#666666"
  footer-text: "#777777"
  rule: "#dddddd"
  rule-footer: "#e0e0e0"
  tabs-surface: "#f8f8f8"
  page-gradient-a: "#e0f7fa"
  page-gradient-b: "#f3e5f5"
  page-gradient-c: "#fff8e1"
  block-gradient-b: "#fce4ec"
typography:
  display:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.6
    letterSpacing: "-0.5px"
  heading-2:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.6
  body:
    fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  lead:
    fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 500
    lineHeight: 1.6
  nav:
    fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 600
  tab:
    fontFamily: "system default (button UA font)"
    fontSize: "1.1em"
    fontWeight: 700
rounded:
  sm: "8px"
  card: "10px"
  md: "12px"
  pill: "50%"
spacing:
  page: "2rem"
  page-mobile: "1rem"
  card: "1rem"
  block: "2rem"
  gap-tabs: "2em"
  table-gap: "1.5rem"
components:
  nav-link:
    textColor: "{colors.primary}"
    typography: "{typography.nav}"
    rounded: "{rounded.sm}"
    padding: "0.4rem 1rem"
  nav-link-hover:
    backgroundColor: "{colors.primary-tint}"
    textColor: "{colors.primary-deep}"
  tab-button:
    textColor: "{colors.tab-text}"
    typography: "{typography.tab}"
    padding: "1em 2em"
  tab-button-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.tab-active}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "1rem"
  team-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "1em"
---

## Overview

The current site is a small, cheerful demo: a soft 135° pastel gradient (cyan → lilac → cream) fills the page, and every piece of content sits in a white rounded card with a faint purple shadow. Headlines are serif (declared Playfair Display, rendered via the Georgia/serif fallback) in deep purple and teal; body copy is sans-serif (declared Poppins, rendered via the system fallback). Everything is descriptive of the captured state — the replica target is this state, unchanged.

## Colors

Purple `#6a1b9a` is the primary (h1, nav links), lilac `#5e35b1` the lead-paragraph colour, teal `#00897b` the h2 with a cyan `#26c6da` underline, pink `#ec407a` the content-block rule, Material blue `#2196f3` the active tab. Neutrals: `#333` body, `#444` block text, `#666` tabs, `#777` footer, `#ddd`/`#e0e0e0` rules, `#f8f8f8` tab surface, white cards.

## Typography

h1 3rem/700 centred with a soft text-shadow (2px 2px 4px rgba(106,27,154,.15)) and −0.5px tracking; h2 2rem/600 inline-block with a 3px cyan underline; paragraphs 1.15rem/500 centred, max-width 800px; content block 1.05rem, line-height 1.8; nav links 1.05rem/600; tab buttons 1.1em bold in the UA button font; team-card h4 UA default (16px/700). Mobile (≤768px): h1 1.8rem, h2 1.4rem. No web fonts are loaded on either page.

## Layout

Body padding 2rem (1rem ≤768px), header/footer/tables/content block max-width 1200px centred. Media tables: two cells per row, border-spacing 1.5rem, cells white cards; ≤768px the row stacks (flex column, gap 1rem, spacing 0). Tabs section: full body width, margin 2em 0, padding 1em; active panel flex with 2em gap, team cards 48% wide; ≤900px column with 1.2em gap, cards 100%.

## Elevation & Depth

Card shadow 0 4px 20px rgba(106,27,154,.12); team-card shadow 0 2px 8px rgba(0,0,0,.07); content-block shadow 0 4px 20px rgba(233,30,99,.1). Media cells lift on hover (translateY −4px, cyan border, 0 8px 30px rgba(0,150,136,.2)).

## Shapes

12px radius on header, cells, tabs section and content block; 10px on team cards; 8px on nav links and media; 50% on 120px portraits. Content block carries a 4px pink left border; h2 a 3px cyan bottom border; tabs bar a 2px #ddd bottom border, active tab a 3px blue bottom border.

## Components

Site header (white bar, 2 links), site footer (centred, 2px top rule), tabbed team section (3 tabs, panels of 2 team cards with round portrait, h4 name, description), media table (video + image / image + image), content block (gradient white→pink, pink left rule).

## Do's and Don'ts

- Do keep every value above exactly; this is a same-design migration.
- Don't load web fonts the source does not load; don't add a logo or favicon the source lacks.
