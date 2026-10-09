---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-06T10:47:53Z
  mode: bounded-single
  synthesizedFrom:
    - stardust/current/pages/webpage-dyft29wzo0qlk.json
    - stardust/current/assets/css/inline-theme.css
    - stardust/replica/lift/measure-static.json
colors:
  canvas: "#FFEF36"
  display: "#006E04"
  text: "#111A0B"
  heading-3: "#000000"
  title-on-photo: "#FFEE35"
  title-fallback-bg: "#484848"
  overlay: "rgba(0,0,0,0.25)"
typography:
  display: "poplar-std, Anton, Impact, sans-serif"
  text: "pt-sans, 'PT Sans', Arial, sans-serif"
rounded: none
spacing:
  content-gutter: "20% (12.5% ≤ 768px)"
  section-padding-block: "2.5rem (1.25rem ≤ 767px); 5rem large (2.5rem ≤ 767px)"
components: [title-section, text-section, image-text-section, card-gallery, pull-quote, legal-footer]
---

# Design — descriptive (bounded-single)

Every value below is lifted from the source theme CSS (`stardust/current/assets/css/inline-theme.css`, selector prefix `.custom-…-theme`) or measured on the static page mode (`stardust/replica/lift/measure-static.json`). Nothing is invented.

## Colors
| role | value | source |
|---|---|---|
| canvas (article + every section) | rgba(255,239,54,1) | theme `.article, .section` L106 |
| display headings (h2, blockquote, link-button) | rgba(0,110,4,1) | theme `.content-container h2` L293 |
| body text (p, li, caption) | rgba(17,26,11,1) | theme `.content-container p` L332 |
| h3 | rgba(0,0,0,1) | theme `.content-container h3` L315 |
| title + subtitle on photo | rgba(255,238,53,1), text-shadow 0 2px 2px rgba(0,0,0,.25) | theme `.title-header .title` L161 |
| title section fallback | #484848 | theme `.title-section` L129 |
| title gradient overlay | linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.25) …) | theme `.gradient-overlay` L71 |
| link hover | rgba(1,38,2,1); link-button hover border rgba(0,187,7,1) | theme L540 / L502 |

## Typography (type ramp)
| element | family | size 1440 | size ≤767 | weight | line-height | transform | source |
|---|---|---|---|---|---|---|---|
| h1 .title | poplar-std | 86px | 46px | normal | 1.2 | uppercase | L161 / L275 |
| p .subtitle | poplar-std | 24px | 20px | 300 | 1.3 | uppercase | L178 / L283 |
| h2 | poplar-std | 55px | 33px | 100 | 1.2 | uppercase | L293 / L310 |
| h3 | pt-sans | 28px | 21px | bold | 1.5 | uppercase | L315 / L328 |
| p, li, caption | pt-sans | 19px | 17px | normal | 1.6 | none | L332 / L347 |
| blockquote | poplar-std | 29px | 21px | 100 | 1.3 | uppercase, centered, padding .75em 0 | L394 / L444 |
| a.link-button | poplar-std | 20px | 19px | 100 | 1.4 | uppercase; 1px solid display; padding 8/17/6/17 | L478 |

**Font delivery policy.** The source serves both faces from an Adobe Fonts kit (`lid8wnz`) that is licensed to the source domain. The kit is never rehosted. PT Sans is an OFL face and is self-hosted from its open source. Poplar Std is a commercial face: the delivered stack keeps `poplar-std` first so a licensed drop-in wins, and ships the metric-matched open substitute Anton (self-hosted). The substitution is surfaced in the inconsistency register (R-02).

## Container and sections (measured, static page mode)
| box | 1440 | 360 |
|---|---|---|
| document height | 9327 | 6670 |
| title section | 1440 × 720 (80 vh), photo cover, centred hgroup; h1 x338 w765; subtitle 16px below | 360 × 720; hgroup x36 w288 |
| text column | x360 w720 (20 % gutters); h2 at +80 (5 rem large spacing) | full width, 12.5 % gutters (x45 w270) |
| paragraph rhythm | 19/1.6 → 30.4px lines; 40px between paragraphs | 17/1.6 |
| image + text sections | photo full-bleed 1440 × 450 above (image-on-left) or below (image-on-right) a 394–485px text block; 2px spacer between sections | photo 360 × 450 |
| card gallery | 32px band; lead image 1024 × 542 centred; h2 centred; 3 cards each 950 tall: image 1024 × 682 centred, h3 + p at x64 w1312 | cards 332 wide at x14, 396–423 tall |
| tips photo | 720 × 476 inline at x360 | full column |
| pull quote section | 241 tall | 166 tall |
| legal footer | 36px: Terms of Service · Privacy Policy · Report Abuse | same |

## Components
title-section · text-section · image-text-section (image-above / image-below) · card-gallery (lead + 3 cards) · pull-quote · legal-footer · fixed "Made in Adobe Express" badge (bottom 60px, left 16px; see register R-03).
