# Inconsistency register — sorra.jp replica

Design is frozen: palette, type, spacing, composition and content are verbatim. The two entries below are
motion-timing deltas forced by capture determinism; neither changes a rendered pixel at rest.

## R-01 — Hero autoplay and zoom pause while the hero is scrolled out of view

- **Evidence:** live `#front-fv-splide` autoplays every 7000 ms on a frame timer from mount regardless of
  visibility (theme main.bundle.js: `interval:7e3, speed:4e3, autoplay:!0`); nine timed live captures
  (`stardust/replica/gates/index-1440/live-iter1-unpinned.png` = slide 04, `…/counters-6.png`) show the
  capture instrument landing on an arbitrary slide, so the live side had to be captured in the 63–70 s
  slide-1 window (`--wait 48000` @1440, `--wait 47000` @360).
- **Minimal change:** `stardust/prototypes/js/index.js` — an IntersectionObserver (threshold .2) clears the
  autoplay timeout and adds `.is-paused` (CSS `animation-play-state: paused` on the slide images) while the
  hero is off-screen; autoplay resumes when it re-enters. On-screen behaviour is unchanged (7000 ms interval,
  4000 ms fade, rewind, dots, counter, progress ring, per-slide title/link).
- **Status:** adopted (instrument-induced; same class of exception as scroll-state chrome).

## R-02 — Slide 1 does not replay the mount-time zoom-out

- **Evidence:** live `.is-active img { animation: zoomOut 9s }` starts on mount and again on every slide
  change; the gate freeze pauses it mid-animation, so the live hero frame is scale 1.036–1.038 in the cached
  captures (fit series `zfit` 1.00→1.05: 45.8 % → 1.10 % @1.038 / 1.48 % @1.036).
- **Minimal change:** the static frame is `transform: scale(1.037)` on the active image
  (`stardust/prototypes/css/index.css`, capture-state fit); the zoom-out animation runs on every slide change
  (`.is-zooming`), not at mount. Visible only during the first 9 s after load.
- **Status:** adopted (capture-state policy: replicate as captured + log).
