# Inconsistency register — https://new.express.adobe.com/webpage/DYft29Wzo0QLK

The ONLY permitted design deltas. Anything not listed here is out of scope for change.
Sources: no audit was run; no `--register` file was supplied. The three entries below are
platform/licensing constraints surfaced during extract, not taste preferences.

## R-01 — Footer "Report Abuse" control has no off-origin consumer

- **Evidence:** stardust/current/pages/webpage-dyft29wzo0qlk.html — footer link `href="#"` opening the `js-report-abuse-dialog` modal (dynamics finding f-form-report-abuse-form-no-action-js-wired-9-fields, posts to the Adobe Express moderation service).
- **Finding:** the control is an Adobe Express platform moderation feature bound to the Express origin; on the migrated page it would be a dead control.
- **Minimal change:** render the footer with Terms of Service and Privacy Policy only; the Report Abuse item and its dialog are omitted, as is the empty `cookie-preferences` anchor (`href="#"`, no text, 20px wide) that sits at the right edge. No other footer change.
- **Gate note:** content-diff reports the removed CTA as a 🔴 MISSING CTA and chrome-parity a MISSING "Report Abuse"; the two remaining links sit 128px further right at 1440 (the removed link + the empty anchor), and at 360 the live footer wraps to two lines (52px) while the trimmed footer stays on one (36px) — a 16px document-height residual at the tail. All justified by this entry.
- **Status:** applied
- **Where:** legal footer (one page)

## R-02 — Display face Poplar Std is a commercial Adobe Fonts face

- **Evidence:** stardust/current/assets/css/typekit-lid8wnz.css (kit header lists poplar-std EULA 775a3830); census aggregate.type.families: poplar-std on 10 headings.
- **Finding:** the kit is licensed to the source domain; rehosting it on the new domain is not permitted (recreation-procedure § Fonts policy).
- **Minimal change:** keep `poplar-std` first in the display stack and ship the metric-matched open substitute Anton (self-hosted) after it; sizes, weights, transforms unchanged. PT Sans (OFL) is self-hosted unchanged.
- **Status:** applied
- **Where:** h1, subtitle, h2, blockquote, link-button (one page). Gate note: heading glyph shapes differ until a licensed Poplar is dropped in; heading bands are a justified flag zone.

## R-03 — Fixed "Made in Adobe Express" badge is hosting-platform chrome

- **Evidence:** inline style block 5 (`.floating-adobe-express-button { position: fixed; bottom: 60px; left: 16px }`); visible in every stitched chunk of stardust/current/assets/screenshots/webpage-dyft29wzo0qlk.png.
- **Finding:** the badge advertises the hosting platform rather than the author's content; it may not be wanted on the migrated site.
- **Minimal change:** none in this run — replicated as captured (fixed, same position and look). Owner may remove it later.
- **Status:** deferred
- **Where:** every viewport (one page)
