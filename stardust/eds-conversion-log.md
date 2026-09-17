# Balbriggan EDS conversion

- Scope: home page, `/nav`, and `/footer` only.
- Runtime: vanilla EDS; `scripts/aem.js` and `scripts/scripts.js` remain unchanged.
- Blocks: `hero`, `news-carousel`, `explore-grid`, `balbriggan-map`, `document-cards`, and `newsletter`; intro prose remains default content.
- David's Model D1: `hero` is intentionally a block because its fixed media/card overlay is a bespoke composition, not plain prose.
- Chrome: authored nav/footer fragments with custom header/footer presentation and behavior.
- Decode tiers: bespoke hero, map, and newsletter are template-slotted; repeating card groups are reconstructive.
- Map media: the oversized raster-embedding SVG is a fixed code asset under `/img/balbriggan/`, not DA-authored media.
- Hero media: the measured final source state is the solid cyan treatment; the stale broken `hero-new2.jpg` reference from an overridden prototype rule is intentionally not authored.
- Fonts: Gotham was not rehosted because no commercial webfont license was supplied; Arial is the documented substitute.
- Newsletter: UI and validation are preserved, submission is prevented, and the authored “No backend connected.” status is shown.
- Tracking: GTM, Google Analytics/Ads, and Facebook Pixel remain excluded.
- Links: pages outside the home-only migration remain absolute links to `balbriggan.ie`.
- Round-trip normalization: the prototype's root-relative map links resolve to `balbriggan.ie`; authored delivery keeps their equivalent absolute source URLs because those destination pages are intentionally out of scope.
- Excluded existing work: no importer files or unrelated content pages were modified.
