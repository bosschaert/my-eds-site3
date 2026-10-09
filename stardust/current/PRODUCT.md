<!-- stardust:provenance
writtenBy: stardust:extract
writtenAt: 2026-10-07T09:25:00Z
stardustVersion: 0.27.0+e68296b7aee4
readArtifacts: stardust/current/pages/*.json, stardust/current/_brand-extraction.json, stardust/current/_crawl-log.json
synthesizedInputs: none
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Healthcare professionals in Switzerland (physicians, specialists in cardiology, nephrology, diabetology, rheumatology) who consult the French-language portal for disease-area information, diagnostic and treatment guidance, and product information. Access to the content is gated by a self-certification step ("Je suis médecin"); patients are redirected to a separate patient site.

_provenance: inferred — from the self-certification modal copy ("Le contenu de ce site web est réservé exclusivement aux professionnels de santé en Suisse") and the header navigation (Nos médicaments, Aires thérapeutiques)._

## Product Purpose

myAstraZeneca Suisse (French edition) is AstraZeneca Switzerland's HCP portal. It presents the company's therapy areas — cardiovascular, renal and metabolic diseases; respiratory and immunology; oncology and haematology — with per-disease pages (incidence, mortality, symptoms, diagnosis, treatment, references) and useful product information. The "See the PATTRNS" campaign microsite on transthyretin amyloidosis (ATTR-CM) adds a disease-awareness track with its own sub-navigation (À propos de l'ATTR, Symptômes, Diagnostic, Traitement).

## Positioning

An authoritative, referenced, French-language medical information hub from the manufacturer itself, with gated HCP-only access and direct links to Swiss product information.

## Operating Context

Pages run on AEM Sites (intelligentcontent "WESE HCP portal" theme). Each page carries a Swiss approval code and revision date in the footer, a cookie-consent banner (Cookie Reports) and an HCP self-certification modal on the campaign pages. A site search and a language switcher (DE / EN / FR / IT) sit in the header; this run covers the French tree only.

## Capabilities and Constraints

- Ten pages in scope: the French home page, four therapy-area disease pages (insuffisance rénale chronique, diabète, insuffisance cardiaque, lupus) and five PATTRNS campaign pages.
- Regulatory elements (approval codes, revision dates, references lists) are content and must be carried verbatim.
- Login ("Se connecter"), search and the language switcher are dynamic features triaged separately; the self-certification gate and cookie consent are host-bound behaviours.
- Terminology follows the source: Symptômes, Diagnostic, Traitement, Informations utiles sur les produits, Aires thérapeutiques.

## Brand Commitments

- Register: `brand` — an informational marketing portal with a corporate identity (AstraZeneca logo, magenta #D0006F / mulberry #830051 palette, Lexia headings, Inter body).
- Personality observed: clinical, calm, authoritative; large light-weight serif-less display headings over generous white space; photography-led hero bands per disease area; the PATTRNS campaign adds a dark "starry" cosmic visual language with pink accents.
- Anti-references observed: no gradients, no shadows, no decorative animation beyond link hover colour.

## Evidence on Hand

- Per-page content and structure: `stardust/current/pages/<slug>.json` (10) and the settled DOM `pages/<slug>.html`.
- Screenshots at 1440: `stardust/current/assets/screenshots/<slug>.png`.
- Brand surface: `stardust/current/_brand-extraction.json`; computed styles at 1440 and 360: `stardust/current/_computed-styles.json`.
- Logo `stardust/current/assets/logo.svg`, favicon `assets/favicon.ico`, font files `assets/fonts/` (Lexia, Inter, Montserrat, icomoon), source stylesheets `assets/css/`.
- Absent: no testimonials, no case studies, no video assets captured; nothing of that kind may be fabricated.

## Product Principles

1. Verbatim medical content — every claim, number and reference is carried exactly as published.
2. Gated-but-open structure — the HCP gate and consent are behaviours around the content, never baked into it.
3. One template per content family — home, therapy-area page, campaign page — reused without variation.
4. Regulatory footer intact — approval code, revision date and legal links are part of every page.

## Accessibility & Inclusion

Content is French medical text for professionals; images carry alt text in the source and keep it. No product-specific standard was established beyond the source's own markup.
