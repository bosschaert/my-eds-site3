<!-- stardust:provenance
  writtenBy:        stardust:extract
  writtenAt:        2026-10-09T17:25:38Z
  mode:             --prep (replica, same-design migration)
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
    - stardust/current/_vision-check.json
    - stardust/current/_crawl-log.json
    - stardust/current/pages/en.json
    - stardust/current/pages/de.json
    - stardust/current/pages/*.json (99)
  synthesizedInputs: []
  stardustVersion:  0.31.0
-->
# Product

<!-- impeccable:product-schema 1 -->

Descriptive snapshot of the **current** www.continental.com, not a target. Written from captured evidence; no interview was run.

## Platform

web

## Users

_provenance: inferred — basis: the top-level navigation and footer contact routes (Press, Careers, Investors, Sustainability, Products & Solutions, Company, Stories; contact links for press, jobs, IR, sustainability, products, suppliers, integrity hotline)._

- **Investors and analysts** — share price, IR news, reports and presentations, events, debt and rating, IR contact (18 `ir-content` pages, 2 `ir-hub`, 2 `ir-downloads` in `_vision-check.json`).
- **Journalists** — press releases, media library, studies and publications, trade fairs and events, press contacts.
- **Job seekers** — career hub, career levels, range of jobs, application process, FAQs, job search widgets; country career sites (es-mx, fr-fr, ro-ro, en-us, pt).
- **Suppliers, business partners and regulators** — supplier pages, technical compliance, corporate governance, integrity hotline.
- **General public and customers looking for products** — products & innovation hub that routes out to continental-tires.com and continental-industry.com (ContiTech).

## Product Purpose

The corporate website of Continental AG. It presents the group ("a leading tire manufacturer and industry specialist that develops and produces sustainable, safe and convenient solutions for automotive manufacturers as well as industrial and end customers worldwide" — `pages/en.json` body), publishes mandatory and voluntary disclosures (results, annual report, governance, legal), and routes visitors to the business-specific product sites. Success, as evidenced on the home page, is keeping investors and press current (stage slides lead with "Results Q2 2026" and the ContiTech sale) while recruiting talent and communicating sustainability performance.

## Positioning

Group-level voice of a German automotive supplier in transformation: the home stage currently frames the company as becoming "a pure-play tire manufacturer" after the ContiTech sale (`pages/en.json` ctas / stage). The brand signature is the orange flag carrying the Continental logo and the slogan "The Future in Motion" (`assets/logo.svg`, `assets/slogan.svg`).

## Capabilities and Constraints

- Bilingual core: parallel **EN** (`/en/…`) and **DE** (`/de/…`) trees with matching IA; language switch in the header (`.c-language-menu`, 93 pages). Country sites: cs-cz, sk-sk, ro-ro, pt-pt / en-pt, es-mx (career), fr-fr (career), en-us (career, data protection); global `/country-selector/`.
- CMS: TYPO3 (t3js-icon markup, `tx_solr` search, `fileadmin/_processed_` image derivatives); BEM component classes `c-*` / `o-*` on a Bootstrap-derived grid with breakpoints 767 / 1023 / 1279 / 1680px.
- Dynamic surfaces: Solr site search and press-release search, job search widgets (`c-job-widget-*`), web forms (`c-webforms`), share-price chart, download cart, video.js / AdmiralCloud video players, IP-based country-redirect banner, cookie consent (auto-handled in capture).
- Media: CDN-hosted images (`cdn.continental.com`, `images.admiralcloud.com`); ~80% of captured `<img>` have empty alt.
- Typeface ContinentalStagSansW is a **licensed corporate font — do not rehost**; any rebuild must load it from a licensed source or fall back to the system stack.
- Open: 25 pages failed in the style census and one crawl URL returned 404 (`/en/investors/api-events/`); country roots have uncaptured first-level pages (`_crawl-log.json#captureGaps`).

## Brand Commitments

- **Register:** `brand` (public corporate/IR marketing site; see `_brand-extraction.json#registerBasis`).
- **Name and marks:** Continental / Continental AG; logo (`assets/logo.svg`, 220×41, currentColor) rendered black on the orange (#ffa500) flag; slogan "The Future in Motion".
- **Color:** orange #ffa500 as the single brand color on black/white, with greys #f0f0f0 / #cdcdcd / #6b6b6b and amber #e38702 for hover.
- **Type:** ContinentalStagSansW throughout (Light 300 body, Book, Med for buttons/nav).
- **Observed personality:** sober, factual, corporate; sentence-case headings (1% uppercase); verb-led CTAs ("Find out more", "Read the press release"); formal "Sie" in German.
- **Observed anti-references:** no gradients beyond a faint image placeholder, no drop-shadow cards, no decorative illustration; photography and orange carry the brand.

## Evidence on Hand

- `stardust/current/pages/<slug>.json` + `.html` — 99 rendered pages (EN, DE, 7 country roots).
- `stardust/current/_computed-styles.json` — style census, 85 pages × 1440/360.
- `stardust/current/assets/css/site.css` — merged live stylesheet.
- `stardust/current/assets/logo.svg`, `slogan.svg`, `favicon.ico`.
- `stardust/current/_vision-check.json` — per-page template labels (22 template labels: ir-content, content-hub, career-content, legal, company-content, …).
- `stardust/current/_brand-extraction.json`, `DESIGN.md`, `DESIGN.json`, `brand-review.html` — derived from the above.
- Absent: font files (licensed, not captured), page screenshots (being recaptured), testimonials or customer quotes (none; one `c-quote` instance only).

## Product Principles

_provenance: inferred — basis: recurring structure across the captured IA and home page._

1. **Disclosure first.** Financial results, reports and governance are always one click from the home stage.
2. **One group, many audiences.** A single IA serves investors, press, candidates and partners side by side, each with its own contact route.
3. **Bilingual parity.** The EN and DE trees mirror each other section for section (en-investors ↔ de-investoren, en-career ↔ de-karriere, …).
4. **The group site routes, product sites sell.** Product detail lives on continental-tires.com and continental-industry.com.

## Accessibility & Inclusion

_provenance: inferred — basis: captured markup._ No stated standard was found. Observed: ~80% of images carry empty alt text (886 / 1111), content-free "here" link labels on data-protection pages, consent modal overlaying the hero on first load. Body copy is set at 17.5px / weight 300 — light weight on white is a legibility risk worth tracking.
