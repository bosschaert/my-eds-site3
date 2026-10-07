<!-- stardust:provenance
writtenBy: stardust:extract
writtenAt: 2026-10-06T10:14:00Z
readArtifacts:
  - https://static-website.david-bosschaert.workers.dev/
  - https://static-website.david-bosschaert.workers.dev/page1
  - stardust/current/pages/index.json
  - stardust/current/pages/page1.json
  - stardust/current/_brand-extraction.json
synthesizedInputs: []
stardustVersion: 0.27.0
-->

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Visitors of a small demonstration website ("Super Page"): people arriving at the home page or the secondary page to view sample media, a short passage of placeholder prose and a tabbed team roster. No sign-in, no transactions, no forms.

_provenance: inferred_ — basis: the captured copy is placeholder/demo text ("Tralalala ladida…", a whimsical pangolin paragraph); the site exhibits layout patterns rather than a real audience proposition.

## Product Purpose

A static two-page sample site that exhibits a handful of content patterns: a page title with a lede, side-by-side media cells (an embedded YouTube video next to a photo, then two photos), a highlighted prose block, and a three-tab team section with portrait cards. Success for a migration is that every pattern survives on the new platform exactly as it looks today.

## Positioning

Not applicable: the captured copy carries no product claim. The site exists as a reference of layout patterns.

_provenance: inferred_ — basis: no positioning statement exists anywhere in the captured text.

## Capabilities and Constraints

- Two pages: `/` (home) and `/page1`; both share the header navigation ("Home", "Page 1") and the footer.
- The home page embeds a YouTube video (`https://www.youtube.com/embed/b4Rr_7y068U`) and three remote photos (picsum.photos); the team section uses six remote portraits (randomuser.me).
- One interactive behaviour: the team tabs switch the visible pair of team cards (inline `onclick` → `showTabSection(i)`, toggling an `active` class; a 0.4 s fade-in on the revealed panel).
- No forms, no search, no data endpoints, no cookies/consent, no analytics.
- Page background is a fixed three-stop gradient; content column caps at 1200 px; the stylesheet has two responsive breakpoints (≤900 px stacks the team cards, ≤768 px shrinks headings and stacks the media cells).

## Brand Commitments

- Name: "Super Page" (footer copyright); document title "Good Morning!".
- Register: `brand` (a marketing-style presentation page, not a tool) — note: the copy is demo text, so the register is a guess from layout, not from voice.
- Personality as observed: playful and pastel — a soft cyan→lavender→cream gradient canvas, deep-purple serif display headings with a faint text shadow, white cards with soft tinted shadows, a pink-edged highlight block, a blue active tab.
- No logo, no favicon and no web-font files exist on the site; headings name "Playfair Display" and body names "Poppins" but neither is loaded, so the site renders in system fallbacks. The migration keeps that behaviour (same font stacks, no new font files) unless the owner supplies the fonts.
- Observed anti-references: none stated; nothing on the site is dark-themed, dense or corporate.

## Evidence on Hand

- `stardust/current/pages/index.json`, `page1.json` — structure, verbatim copy, CTA labels, media inventory (+ `.html` rendered DOM sidecars).
- `stardust/current/assets/screenshots/index.png` (1440×2110), `page1.png` (1440×900) — ground-truth captures.
- `stardust/current/assets/media/` — the nine remote images, downloaded (3 photos, 6 portraits).
- `stardust/current/_brand-extraction.json`, `_computed-styles.json` — palette, type, motifs with sources; `styles.css` of the source is the authoritative value source.
- Absent, must not be fabricated: logo, favicon, font files, meta description, OG image, any copy beyond the captured strings.

## Product Principles

1. Every captured string, image and embed appears on the new platform unchanged.
2. The two shared surfaces (header navigation, footer) are one component each, reused by both pages.
3. The team tabs keep their behaviour: the first tab is active on load; a click reveals the matching pair of cards.
4. Nothing is added: no new sections, copy, imagery or chrome.

## Accessibility & Inclusion

No product-specific requirement was established. Observed: every image carries alt text; the tab buttons are native `<button>` elements without ARIA tab semantics (replicated as-is; recorded in the dynamic surface).
