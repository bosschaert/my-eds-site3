# Inconsistency register — balbriggan.ie/community-development/

Written by stardust:replica at 2026-09-23T19:12:11Z. Sources: none (no audit requested, no --register file).

**One entry (R-01).** No other design deltas are permitted; every other difference between the live
page and the prototype is a fidelity bug to be fixed or a gate residual to be logged in
stardust/replica/progress.json.

## R-01 — Licensed Gotham webfonts substituted by Montserrat

- **Evidence:** the live page loads three self-hosted commercial faces from the theme — `fonts/Gotham-Light.woff`, `fonts/gotham-medium_2-webfont.woff2`, `fonts/gotham-bold_2-webfont.woff2` (network capture in `stardust/replica/lift/live-fonts.txt`; CDP platform-font probe: every text node renders Gotham-Light / Gotham-Medium / Gotham-Bold). Width ranking of open candidates against the live glyph advances: `stardust/replica/lift/font-candidates-ranking.txt` (Montserrat 300 / 500 / 600 → mean width ratio 0.999 / 1.002 / 1.013, rms 2.1 / 1.8 / 2.2 %).
- **Finding:** Gotham (Hoefler&Co) is a licensed commercial kit; the fonts policy forbids rehosting it on the new domain. Without a substitute the page renders in the browser default face (Liberation Sans/Serif), 4–15 % narrower — wraps and heights diverge.
- **Minimal change:** self-host Montserrat (SIL OFL, Google Fonts) latin + latin-ext woff2 as alias families `Montserrat-300` / `Montserrat-500` / `Montserrat-600`, each a single face like the live kit; keep the brand family FIRST in every stack (`'Gotham-Light', 'Montserrat-300', sans-serif` …) so a licensed drop-in wins later. No other type change (sizes, weights, line-heights, transforms verbatim).
- **Status:** applied — a permanent, justified gate residual (glyph shapes differ; widths within ~2 %). Owner decision: supply the licensed Gotham kit for the new domain to remove it.
- **Where:** every text node on the page (header, title, intro, membership, footer).
