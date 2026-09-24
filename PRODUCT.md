<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-09-23T18:38:54Z
  readArtifacts:
    - https://www.example.com/
    - stardust/current/pages/index.json
    - stardust/current/_brand-extraction.json
  synthesizedInputs: []
  stardustVersion: 0.25.0
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers, technical writers and documentation authors who need a domain name they can cite in examples without contacting anyone. Their job on this page is to confirm what the domain is for and, if needed, follow the single link to the authoritative policy.

_provenance: inferred — basis: the page's one paragraph names "documentation examples" as the use case._

## Product Purpose

The site exists to give the reserved example domain a real, stable landing page. It states the domain's purpose in one paragraph and points to the registry's policy page. Success is that the page loads, is understood at a glance, and never changes in a way that breaks the examples that cite it.

## Positioning

The only domain reserved by the internet standards process specifically for use in documentation. No other site can truthfully claim that reservation.

_provenance: inferred — basis: the "Learn more" link targets the registry's domain policy page._

## Capabilities and Constraints

- One page, one heading, two paragraphs, one outbound link (captured at stardust/current/pages/index.json).
- No navigation, header, footer, forms, scripts, images, or third-party requests.
- Content is fixed; the page must remain readable with no dependencies.

## Brand Commitments

- Register: static informational page (neither marketing nor tool). Treated as `brand` for the descriptive design record, with that caveat.
- Personality as observed: plain, neutral, utilitarian. A system font, a light grey page, one link colour.
- Anti-references as observed: no imagery, no decoration, no persuasion. Anything ornamental would read as off-brand.

## Evidence on Hand

- Rendered page record: stardust/current/pages/index.json (verbatim heading, paragraphs, link label and href).
- Settled DOM: stardust/current/pages/index.html.
- Screenshot: stardust/current/assets/screenshots/index.png (1440 × 900, full page).
- Computed-style census at 1440 and 360: stardust/current/_computed-styles.json.
- Brand surface: stardust/current/_brand-extraction.json.
- Absent, must not be fabricated: logo, favicon, imagery, additional pages, metadata description, Open Graph tags.

## Product Principles

- Say the one thing the page is for, then stop.
- Load with no dependencies and no scripts.
- Never alter cited text; documentation elsewhere depends on it.

## Accessibility & Inclusion

The page uses a semantic heading and paragraphs with a descriptive link label. Body text sits at roughly 11:1 contrast against the background after the 80% opacity; the link colour sits at roughly 7:1. No product-specific standard was stated on the site.
