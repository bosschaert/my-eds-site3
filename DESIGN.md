<!-- stardust:provenance writtenBy=stardust:extract writtenAt=2026-11-05T16:55:31Z stardustVersion=0.36.7 source=styles.css + _computed-styles.json -->
---
name: Super Page (current state)
colors:
  primary: "#6a1b9a"
  primary-hover: "#4a148c"
  primary-tint: "#f3e5f5"
  secondary: "#00897b"
  accent: "#26c6da"
  lede-text: "#5e35b1"
  text: "#333333"
  muted: "#777777"
  tab-active: "#2196f3"
  callout-accent: "#ec407a"
  surface: "#ffffff"
typography:
  body: "'Poppins', 'Segoe UI', system-ui, sans-serif — 16px / 1.6 (Poppins never loaded; system fallback renders)"
  h1: "'Playfair Display', Georgia, serif — 3rem/700, 1.8rem ≤768px"
  h2: "'Playfair Display', Georgia, serif — 2rem/600, 1.4rem ≤768px"
rounded:
  card: 12px
  nav-link: 8px
  team-card: 10px
spacing:
  body-padding: 2rem (1rem ≤768px)
  container: 1200px
components:
  site-header: white rounded nav bar with purple text links
  media-table: two-cell card table (border-spacing 1.5rem), hover lift
  gallery: two-column grid (images / videos), single column ≤768px
  callout: white→pink gradient panel, 4px pink left border
  team-tabs: three tabs, two team cards per panel; stacks ≤900px
  site-footer: centered muted line, 2px top rule
---

# Design — current state

## Overview
A single-column page on a fixed pastel diagonal gradient (cyan → lavender → cream), body padded 2rem. Content is centred in a 1200px max container; the tabs section alone is full-width.

## Colors
Purple (#6a1b9a) owns the brand: nav links and h1. Teal (#00897b) h2 with a cyan (#26c6da) underline; violet (#5e35b1) lede. Tabs use material blue (#2196f3) for the active state.

## Typography
Serif display (Playfair Display named, Georgia/serif fallback renders) for h1/h2 — h1 centred with a soft purple text-shadow; sans body (Poppins named, system fallback renders).

## Elevation
Soft purple-tinted shadows (0 4px 20px rgba(106,27,154,.12)) on the header and media cells; pink-tinted on the callout; neutral on team cards.

## Components
See frontmatter. Breakpoints in the source: 768px (layout stacks, type shrinks) and 900px (team cards stack).
