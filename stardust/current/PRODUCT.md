<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-10-05T10:15:09Z
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/_brand-extraction.json
  synthesizedInputs: []
  stardustVersion: 0.27.0
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People reading or writing technical documentation who need a domain name that is safe to
use as a placeholder, and anyone who arrives at the domain and needs to know what it is.
_provenance: inferred — basis: the page's own copy ("for use in documentation examples")._

## Product Purpose

The site explains, in six languages, that the domain is reserved for documentation
examples, may be used without permission, and is not a service to test or monitor
against. Success is a visitor understanding that in one glance and, if they want more,
following the single link to the IANA help page.

## Positioning

The reserved example domain itself: a name that documentation can use because a
standards body guarantees it will never be sold or turned into a service.
_provenance: inferred — basis: the copy and the IANA "help/example-domains" link._

## Capabilities and Constraints

- One static page, no navigation, no header or footer, no forms, no scripts, no analytics.
- Six paragraphs (English first, then Arabic, Chinese, French, Russian, Spanish) and one external link.
- Supports light and dark color schemes via `color-scheme: light dark`; the light scheme is the captured target.
- Terminology: "documentation examples", "not a service", "testing and monitoring".

## Brand Commitments

- Register: `brand` (a single informational landing page; ambiguous, recorded as brand with a note).
- Personality observed: plain, neutral, institutional, deliberately undecorated.
- Anti-references observed: no marketing imagery, no calls to action beyond "Learn more", no decoration.
- Assets: the inline line icon (`stardust/current/assets/logo.svg`); no wordmark, no favicon.

## Evidence on Hand

- Captured page record and rendered DOM: `stardust/current/pages/index.json`, `stardust/current/pages/index.html`.
- Full-page screenshot at 1440: `stardust/current/assets/screenshots/index.png`.
- Icon: `stardust/current/assets/logo.svg` (inline SVG, 44 × 44).
- Brand surface and computed styles: `stardust/current/_brand-extraction.json`, `stardust/current/_computed-styles.json`.
- Absent, and not to be fabricated: photography, testimonials, a logo wordmark, a favicon, any further pages.

## Product Principles

- Say the one thing the page exists to say, and say it in the reader's language.
- Stay a notice, not a service: no features, no tracking, nothing to depend on.
- Defer to the browser: system typeface, default link, default colors.

## Accessibility & Inclusion

Six languages are presented in sequence on one page; the document `lang` is `en` and the
individual paragraphs carry no `lang` attribute in the current markup. The icon is
`aria-hidden`. Text contrast is black on light grey at 60 % opacity for secondary copy.
