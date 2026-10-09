<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-10-08T09:25:15Z
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/_brand-extraction.json
  synthesizedInputs: []
  stardustVersion: 0.29.1
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People who meet "example.com" in documentation, code samples or tests and follow it to see what it is. They arrive once, read one notice, and leave.

## Product Purpose

The site exists so that a reserved domain used in documentation resolves to a clear, harmless explanation. Success is a reader understanding in one glance that this is a placeholder, not a service, and that it may be used in examples without permission.

## Positioning

The one domain reserved by the IANA for documentation examples: it never belongs to a company and never becomes a service.

## Capabilities and Constraints

- A single static page; no navigation, header, footer, forms or search.
- The notice is repeated in six languages (en, ar, zh, fr, ru, es), the English version leading.
- One outbound link, "Learn more", to the IANA help page on example domains.
- Declares light and dark colour schemes; the migration captures and reproduces the light scheme.

## Brand Commitments

- Register: `product` — a utilitarian notice, not marketing.
  _provenance: inferred_ — basis: plain system type, no imagery, no CTA beyond a reference link.
- Personality: neutral, institutional, deliberately unremarkable.
- Assets: a decorative book-and-quotes glyph (inline SVG); no wordmark, no favicon (`rel=icon` is `data:,`).

## Evidence on Hand

- Rendered page record and DOM: `stardust/current/pages/index.json`, `stardust/current/pages/index.html`.
- Screenshot at 1440: `stardust/current/assets/screenshots/index.png`.
- Glyph: `stardust/current/assets/logo.svg`.
- Computed-style census at 1440 and 360: `stardust/current/_computed-styles.json`.
- Absent, not to be fabricated: headings, images, a favicon, a tagline, any second page.

## Product Principles

- Say one thing, once per language, and stop.
- Never look like a product or a company.
- Stay legible on any device with no dependencies.
