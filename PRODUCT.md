<!-- stardust:provenance
writtenBy: stardust:replica
writtenAt: 2026-09-23T18:47:00Z
mode: bounded-single
againstInput: https://www.niravmanubhai.com/
synthesizedFrom:
  - stardust/current/pages/index.json
  - stardust/replica/lift/tokens.json
note: descriptive target spec for a same-design replica of ONE page; no site-wide claims
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Readers who arrive at Nirav Manubhai's personal site: people curious about his stories, books, field notes and essays, and contacts (organisations, brands, readers) who want to write to him. Copy on the page addresses a single visitor as a guest entering a house.

## Product Purpose
The home page is the front door to a set of "rooms": The Story Nursery, STILLS, Axiom Stories, Kabir Vaidya, Come, Sit – Just Ask, House Specials, My Books, My Study and The Quiet Signal. It introduces the host, lists the rooms with a short description and a door link each, invites conversation (email, WhatsApp, Substack, LinkedIn, Instagram, Facebook) and says goodbye.

## Positioning
Title: "Nirav Manubhai — Writer, Observer & A Home on the Web". Description: "Enter Nirav Manubhai's home on the web: literary rooms, chamber mysteries, still-image stories, essays and books shaped by observation, slowness and human attention." The site frames itself as a home, not a portfolio: slow, hospitable, literary.

## Capabilities and Constraints
- Static, hand-authored HTML with ten stylesheets and a small navigation script (hamburger drawer). No forms, search, players or client-rendered content.
- Scope of this migration: the home page only (`/`). The room pages linked from it stay on the source site for now; links keep their paths.
- Third-party tags (GA4, Cloudflare Web Analytics) are not loaded on the preview host; see `stardust/dynamic-features.md`.

## Brand Commitments
- Register: `brand` (a literary personal site; marketing/landing structure).
- Observed personality (from the captured copy): hospitable, unhurried, observational, warm; bilingual touches in Gujarati ("આવો, બેસો.", "આવજો.").
- Observed anti-references: nothing loud, no marketing gradients, no dense grids; the site avoids urgency.

## Evidence on Hand
- `stardust/current/pages/index.json` — captured content and metadata (Playwright, 2026-09-23).
- `stardust/current/pages/index.html` — settled rendered DOM.
- `stardust/current/assets/screenshots/index.png` — full-page capture at 1440.
- `stardust/current/assets/css/` — the ten linked stylesheets, inline style blocks, Google Fonts CSS.
- `stardust/current/assets/fonts/` — Inter, Playfair Display (+italic), Rasa (variable woff2, OFL).
- `stardust/current/assets/media/` — all 14 page images plus responsive renditions.
- `stardust/replica/lift/` — measured boxes at 1440/360/1920 and the lifted tokens.

## Product Principles
_provenance: inferred — basis: the page's own copy ("Come in. Look around. Stay as long as you like.", "There is no order to follow.")_
- Hospitality over conversion: every section ends with an invitation, never a push.
- Slowness: generous vertical rhythm, one idea per section.
- Verbatim fidelity: this replica changes no word, image, colour or measurement of the source.

## Accessibility & Inclusion
Source page has a visually hidden `h1`, descriptive alt text on every image, `aria-label`s on landmark sections and the menu button, 44px minimum hit targets, `prefers-reduced-motion` handling. The replica preserves all of these as captured.
