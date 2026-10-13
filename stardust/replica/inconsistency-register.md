# Inconsistency register — current-design.jp replica

Everything not listed here is frozen; any design delta found by the gate is a defect, not an improvement.

## R-01 — Licensed Japanese web font replaced by an open substitute

- **Evidence:** the source loads 秀英角ゴシック金 B/M JIS2004 from wf.typesquare.com with a licence bound to the source domain (`location=current-design.jp` in the font URL; stardust/current/css/inline.css style#11–14); crop stardust/replica/crops/live-hero-text.png.
- **Finding:** a licensed commercial kit cannot be rehosted on the new domain (fonts policy) — not a design change but a licence constraint.
- **Minimal change:** keep the brand family name first in every stack; self-host Noto Sans JP (SIL OFL) as the metric-matched fallback. Glyph shapes of Japanese text differ slightly; sizes, line heights, letter spacing and wrapping are unchanged. A licensed drop-in later wins automatically.
- **Status:** applied
- **Where:** all Japanese text, all page types (header excluded — Montserrat only).
