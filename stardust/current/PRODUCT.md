<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-09-28T07:23:11Z
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/pages/index.html
    - stardust/current/_computed-styles.json
    - stardust/current/assets/screenshots/index.png
  synthesizedInputs: []
  stardustVersion: 0.25.1
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Developers, technical writers and documentation readers who encounter `example.com` as the reserved placeholder domain in specifications, tutorials and sample code. Their job is to recognise it as a documentation example and, if curious, find out why it exists.

_provenance: inferred — basis: the single captured paragraph ("This domain is for use in documentation examples without needing permission. Avoid use in operations.")._

## Product Purpose

The site is the landing page of a reserved example domain. It exists to state, in one sentence, that the domain is reserved for documentation use and must not be used in operations, and to point to the authoritative IANA page about reserved example domains.

## Positioning

The one claim no neighbouring site can truthfully make: this is the officially reserved documentation example domain, maintained by the registry itself.

## Capabilities and Constraints

- One page, one heading, one paragraph, one outbound link (`https://iana.org/domains/example`).
- No navigation, header, footer, forms, search, media or scripts (captured dynamic surface: 0 endpoints, 0 forms, 0 triggers).
- No favicon is served (`<link rel="icon" href="data:,">`).
- Terminology: "Example Domain", "documentation examples", "operations".

## Brand Commitments

- Register: `brand` (informational notice; ambiguous between brand and product — recorded as brand with this note).
- Personality observed: plain, neutral, institutional, deliberately unstyled. The page reads as a registry notice, not a marketing page.
- Anti-references observed: no imagery, no decoration, no colour beyond a light grey canvas and a muted blue link.
- Name: "Example Domain" (page title and h1).

## Evidence on Hand

- `stardust/current/pages/index.json` — captured structure and verbatim copy (title, h1, two body strings, one CTA).
- `stardust/current/pages/index.html` — the settled rendered DOM (559 bytes, inline stylesheet).
- `stardust/current/_computed-styles.json` — computed-style census at 1440 and 360.
- `stardust/current/assets/screenshots/index.png` — full-page capture at 1440.
- Absent, must not be fabricated: logo, favicon, imagery, testimonials, additional pages.

## Product Principles

- Say one thing and stop: the page exists to deliver a single notice.
- Defer to the authority: the only action is the link to IANA.
- Stay legible everywhere: system fonts, fluid width, no dependencies.
