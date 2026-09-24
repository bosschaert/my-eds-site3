<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-09-23T13:24:02Z
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/pages/page1.json
    - stardust/current/_brand-extraction.json
  synthesizedInputs: []
  stardustVersion: 0.25.0
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Visitors of a small demonstration website ("Super page") who browse two pages: a home page with media and a team overview, and a second page with the team overview only.
_provenance: inferred — basis: the captured copy is placeholder/demo text and the site has no product or sales surface._

## Product Purpose

A two-page static demo site: it presents a headline, a lead paragraph, a video and photo showcase, a short story block, and a tabbed team directory (three teams, two members each), with a shared header and footer.

## Capabilities and Constraints

- Two pages: `/` (home) and `/page1`; both share the header (Home, Page 1), the tabbed team section and the footer.
- Tabs switch with JavaScript (class toggle, 0.4 s fade-in); no forms, no search, no data endpoints.
- Third-party media: YouTube embed (b4Rr_7y068U), picsum.photos photos, randomuser.me portraits.
- Terminology: "Team Alpha / Team Beta / Team Gamma", "Super Page".

## Brand Commitments

- Register: brand (marketing/landing shape) — a playful pastel demo site.
- Personality as observed: light, colourful, friendly; pastel gradient page, white rounded cards, purple/teal/pink accents.
- Name: "Super Page" (footer), page title "Good Morning!".

## Evidence on Hand

- Page records: stardust/current/pages/index.json, stardust/current/pages/page1.json (+ rendered .html, screenshots under stardust/current/assets/screenshots/).
- Computed styles: stardust/current/_computed-styles.json; brand surface: stardust/current/_brand-extraction.json.
- Absent: no logo, no favicon, no self-hosted fonts (declared Poppins/Playfair Display are not loaded on either page), no icon font. Future work must not fabricate them.

## Product Principles

- Keep the content verbatim — including placeholder copy.
- Keep the two-page structure and shared header/footer/team tabs.
- Keep third-party media references as they are.
