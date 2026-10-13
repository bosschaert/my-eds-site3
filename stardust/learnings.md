
## current-design.jp — single-page replica (2026-10-13)

- chrome-compare pairs header controls by accessible name; a source control with an empty name (here the logo link, `<img alt="">`, with a hover twin-slide) never pairs, so its hover state reads as `control-missing` even when the build implements it identically. Only an owner decision clears it.
- One-page scope: every other internal target is a scope extension → repoint to the source host at E2 (verify.mjs flags them as broken until then).
- dynamics-check runs at 1440; a mobile-only menu's click-dialog flow belongs to the header contract at 390, not to parity.json.
