# Inconsistency register — balbriggan.ie replica

Everything not listed here is frozen; any design delta found by the gate is a defect, not an improvement.

## R-01 — Licensed Gotham webfonts are rendered by a metric-matched open substitute

- **Evidence:** the theme self-hosts Gotham Light / Medium / Bold (`wp-content/themes/balbriggan2024/fonts/font.css`,
  captured in `stardust/current/assets/asset-log.json`); Gotham is a commercial Hoefler&Co face — the replica fonts
  policy forbids rehosting it. Width calibration at 100px (`/tmp/fontcal` run, 2026-10-13): Montserrat/Gotham
  ratio uppercase bold 0.996, mixed bold 0.965–0.968, medium 0.988–1.013, light 0.989–1.022.
- **Finding:** not a design inconsistency — a licensing constraint on the delivery domain.
- **Minimal change:** stacks keep `GothamBold` / `GothamMedium` / `Gotham-Light` first (a licensed kit dropped in
  later wins); a Montserrat 700 / 500 / 300 face with `size-adjust` (100% / 98% / 99%) renders meanwhile. No other
  type change.
- **Status:** applied
- **Where:** every text node set in Gotham (all sections, header, footer, map labels).
