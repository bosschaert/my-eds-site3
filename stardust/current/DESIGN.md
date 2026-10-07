---
name: Super Page
description: Playful pastel demo site — gradient canvas, deep-purple serif headings, soft white cards
colors:
  primary: "#6a1b9a"
  primary-deep: "#4a148c"
  text-lede: "#5e35b1"
  secondary: "#00897b"
  accent-cyan: "#26c6da"
  accent-pink: "#ec407a"
  tab-active: "#2196f3"
  surface: "#ffffff"
  surface-tabs: "#f8f8f8"
  surface-hover: "#f3e5f5"
  text-primary: "#333333"
  text-content: "#444444"
  text-tab: "#666666"
  text-muted: "#777777"
  border: "#dddddd"
  border-footer: "#e0e0e0"
  canvas-start: "#e0f7fa"
  canvas-mid: "#f3e5f5"
  canvas-end: "#fff8e1"
  block-end: "#fce4ec"
typography:
  display:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.6
    letterSpacing: "-0.5px"
  headline:
    fontFamily: "'Playfair Display', Georgia, serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: "normal"
  title:
    fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.6
    letterSpacing: "normal"
  lede:
    fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: "normal"
  nav:
    fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "'Poppins', 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  full: "50%"
spacing:
  xs: "0.4rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  xxl: "2.5rem"
components:
  nav-link:
    textColor: "{colors.primary}"
    typography: "{typography.nav}"
    rounded: "{rounded.sm}"
    padding: "0.4rem 1rem"
  nav-link-hover:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.primary-deep}"
  tab-button:
    textColor: "{colors.text-tab}"
    padding: "1em 2em"
  tab-button-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.tab-active}"
  card-media:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "1rem"
  card-team:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "1em"
---

# Design System: Super Page

## Overview

**Creative North Star: "Pastel Playground"**

The site is a light, playful presentation surface. A soft diagonal gradient (cyan → lavender → cream) fills the whole page; everything that carries content sits on it as a white, softly shadowed card with generously rounded corners. Deep-purple serif headings with a faint drop shadow give the page a storybook tone, while the body copy stays a friendly medium-weight sans-serif in violet and charcoal.

Density is low: one 1200 px column, 2 rem of outer padding, cards separated by 1.5 rem of spacing. Nothing is dark, dense or corporate. Colour is used as section signposting (teal subheading with a cyan underline, a pink-edged prose block, a blue active tab) rather than as a single brand accent.

**Key Characteristics:**
- Gradient canvas with white cards (12 px radius, tinted soft shadows)
- Deep-purple serif display headings, centered, with a 2 px text shadow
- Violet lede copy, centered, capped at 800 px
- Section-specific accents: teal + cyan (subheading), pink (prose block), blue (tabs)
- Circular 120 px portraits in a three-tab team roster

## Colors

A pastel canvas with a deep-purple primary and three section-bound accents.

### Primary
- **Deep Purple** (#6a1b9a): the display heading and the header navigation links. Its darker partner **Royal Purple** (#4a148c) is the link hover colour.
- **Violet Lede** (#5e35b1): the centered lede paragraph under the title.

### Secondary
- **Teal** (#00897b): the h2 subheading, underlined in **Cyan** (#26c6da, 3 px). Cyan also outlines a hovered media cell.

### Tertiary
- **Pink** (#ec407a): the 4 px left border of the highlighted prose block, whose fill fades white → **Blush** (#fce4ec).
- **Tab Blue** (#2196f3): the active tab's text and 3 px underline.

### Neutral
- **White** (#ffffff): every card, the header bar and the active tab.
- **Canvas** (linear-gradient 135deg #e0f7fa 0% → #f3e5f5 50% → #fff8e1 100%): the page background; **Lavender** (#f3e5f5) alone is the nav-link hover fill.
- **Tab Panel** (#f8f8f8): the tabs section background.
- **Charcoal** (#333333) body text; **Slate** (#444444) prose-block text; **Tab Grey** (#666666) inactive tab labels; **Muted** (#777777) footer text.
- **Line** (#dddddd) tab-bar rule; **Footer Line** (#e0e0e0) 2 px footer top border.

### Named Rules
**The Colour-Per-Section Rule.** Each section owns one accent (teal/cyan, pink, blue); accents never travel between sections.

## Typography

**Display Font:** Playfair Display (with Georgia, serif) — named but not loaded; renders as the system serif.
**Body Font:** Poppins (with 'Segoe UI', system-ui, sans-serif) — named but not loaded; renders as the system sans.
**Label/Mono Font:** none. Tab buttons use the browser's default button font (they do not inherit).

**Character:** A storybook serif title over a friendly rounded sans body; everything in the title region is centered.

### Hierarchy
- **Display** (700, 3rem / 48px, 1.6, −0.5px, text-shadow 2px 2px 4px rgba(106,27,154,.15)): the page title "Super page", centered. 1.8rem at ≤768px.
- **Headline** (600, 2rem / 32px, 1.6): the h2 subheading, teal, inline-block with a 3px cyan bottom border and 0.5rem bottom padding; 2.5rem top / 1.5rem bottom margin. 1.4rem at ≤768px.
- **Title** (700, 1rem / 16px): team-card names (h4), 0.2em vertical margin.
- **Lede** (500, 1.15rem / 18.4px, 1.6): every `<p>` — centered, violet, max-width 800px, 2rem bottom margin.
- **Body** (400, 1.05rem / 16.8px, 1.8): the highlighted prose block, slate.
- **Nav** (600, 1.05rem): header links. **Label** (400, 0.95rem): footer.
- **Tab** (bold, 1.1em / 17.6px, default button font): tab buttons.

### Named Rules
**The Centered Title Rule.** Title and lede are centered; everything below is left-aligned.

## Layout

One fluid column with `max-width: 1200px; margin: 0 auto` for the header, tables, prose block and footer; the body carries 2rem padding on every side (1rem at ≤768px) and `min-height: 100vh`. The header is a flex row (gap 1.5rem, padding 1rem 1.5rem, 2rem bottom margin). Media cells are a `<table>` with `border-collapse: separate; border-spacing: 1.5rem` (0 at ≤768px, where rows become a column flex with 1rem gap and cells stack with 1rem bottom margin). The tabs section spans the full body width (margin 2em 0, padding 1em); its active panel is a flex row with `justify-content: space-between; gap: 2em` of two 48 %-wide cards, becoming a column with 1.2em gap and 100 % cards at ≤900px. Footer: margin 2rem auto 0, padding 1.5rem, centered text. Breakpoints observed: 900px and 768px.

## Elevation & Depth

Soft tinted shadows on every card; no borders at rest (except the transparent 2px media-cell border that colours on hover).

### Shadow Vocabulary
- **Card** (`box-shadow: 0 4px 20px rgba(106, 27, 154, 0.12)`): header bar and media cells.
- **Team card** (`box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07)`): portrait cards.
- **Prose block** (`box-shadow: 0 4px 20px rgba(233, 30, 99, 0.1)`): the pink-edged block.
- **Media hover** (`box-shadow: 0 8px 30px rgba(0, 150, 136, 0.2)` + `translateY(-4px)` + cyan border, 0.3s ease).

### Named Rules
**The Tinted Shadow Rule.** Shadows take the hue of the section's accent (purple, pink, teal), never neutral black at full strength.

## Shapes

Rounded everywhere: 12px on the header, media cells and prose block; 10px on team cards; 8px on nav links and on the media (images and iframe, which are 16:9 `aspect-ratio`, `width: 100%`); 50 % circles for the 120px portraits (`object-fit: cover`). No clipping or diagonal geometry.

## Components

### Navigation
- Two text links in a white rounded bar; 600 weight, deep purple, padding 0.4rem 1rem, 8px radius; hover fills lavender (#f3e5f5) and darkens to #4a148c, 0.2s transition. No active-page state. Same on mobile (no hamburger).

### Buttons (tabs)
- **Shape:** square (no radius), no border, transparent background.
- **Default:** bold 1.1em, #666, padding 1em 2em; the tab bar has a 2px #ddd bottom rule and 1em bottom margin.
- **Active:** #2196f3 text, 3px #2196f3 bottom border, white fill. Colour transition 0.2s.

### Cards / Containers
- **Media cell:** white, 12px radius, 1rem padding, card shadow, 2px transparent border; content is one 16:9 image or iframe, 8px radius.
- **Team card:** white, 10px radius, 1em padding, team shadow, column flex centered; 120px circular portrait with 1em bottom margin, h4 name, lede-style paragraph.
- **Prose block:** white→blush gradient, 2rem padding, 12px radius, 4px pink left border, prose shadow.
- **Tabs section:** #f8f8f8, 12px radius, 1em padding, margin 2em 0.

### Inputs / Fields
None on the site.

## Do's and Don'ts

### Do:
- **Do** keep the 135° three-stop gradient on the body and white cards on top of it.
- **Do** keep the h1 text shadow and the −0.5px tracking.
- **Do** keep the source font stacks verbatim; no font files are loaded today.

### Don't:
- **Don't** introduce a logo, favicon or hamburger menu; none exist.
- **Don't** add ARIA tab roles or new states beyond `.active`; the tabs are plain buttons.
- **Don't** flatten the tinted shadows to neutral grey.
