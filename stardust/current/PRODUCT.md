<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-09-22T09:10:00Z
  readArtifacts:
    - https://www.example.com/
    - stardust/current/pages/index.json
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
  synthesizedInputs: []
  stardustVersion: 0.22.1
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Readers of technical documentation, RFCs, tutorials and test fixtures who encounter `example.com` as a placeholder domain and follow it to find out what it is. The page speaks to one audience only: people who want to know whether the domain is safe to use in their examples.

_provenance: inferred_ — basis: the single captured paragraph addresses "use in documentation examples".

## Product Purpose

The site exists to document the reserved status of the domain: it states, in one paragraph, that the domain is for use in documentation examples without needing permission and must not be used in operations, then links to the IANA registry entry for the reservation. Success is a reader leaving with that fact and, if needed, the authoritative reference.

## Positioning

The one placeholder domain that is reserved by the IANA and therefore safe to cite without asking anyone. No other site can truthfully make this claim for this name.

_provenance: inferred_ — basis: the paragraph copy plus the sole CTA target (`https://iana.org/domains/example`).

## Capabilities and Constraints

- One static page, one heading, two paragraphs, one external link. No navigation, header, footer, forms, media, scripts, third-party requests or dynamic surface (`pages/index.json § dynamic` is empty on every field).
- Terminology: "documentation examples", "operations" as used in the captured copy; the CTA label is "Learn more".
- Constraint carried into the migration: the copy is verbatim and the composition is the target (replica mode). Nothing on the page is undecided.

## Brand Commitments

- Name: "Example Domain" (document title and h1).
- Register: `brand` — a single public informational landing page with no product tooling; noted as a default because the page carries neither marketing nor tool indicators.
- Personality as observed: plain, terse, utilitarian, unstyled beyond a grey field, a system font and a muted blue link.
- Anti-references as observed: no imagery, no logo, no decoration, no motion. The migration must not introduce any.

## Evidence on Hand

- Rendered page record: `stardust/current/pages/index.json` (Playwright, 200, medium wait 2500 ms) and settled DOM `stardust/current/pages/index.html`.
- Capture: `stardust/current/assets/screenshots/index.png` (1440 × 900, full page).
- Computed-style census at 1440 and 360: `stardust/current/_computed-styles.json`.
- The site's entire stylesheet (130 bytes, inline): `stardust/replica/capture/live-inline.css`.
- Absences that later work must not fabricate: no logo, no favicon (the page declares `data:` as its icon), no `og:*` metadata, no meta description, no images, no fonts served (system-ui only).

## Product Principles

1. Say the one thing and stop: the page carries exactly the information a reader needs and nothing else.
2. Point to the authority rather than restating it: the only action is the link to the IANA registry.
3. Zero dependencies: no scripts, fonts, images or third-party requests; the page must render anywhere.

## Accessibility & Inclusion

Semantic outline (one `h1`, paragraphs, a descriptive link label), `lang="en"`, and a viewport meta are present on the captured page; the migration preserves them. No further product-specific requirement was established.
