# Instrument adaptations (documented, flagged for upstreaming)

1. `stardust/scripts/replica/gate.sh` — `GATE_PROBES_SERIAL=1` knob (commented in the script): runs the
   `--full` probes one after another. Cause: host limit of 3 concurrent headless Chromiums on a shared
   12 GiB runner; the parallel probe set holds 4–6. Verdicts/evidence unchanged; invalidates no run.
2. `stardust/scripts/local/fp-stitch.mjs` — live-side stitched capture for the home page (/en), a
   jquery.fullpage.js scroll-jacked page on which stitch-shot fails loud (scroll stall, gate doc
   § Hardening rule 13). Drives `$.fn.fullpage.moveTo(i)` per section with the stitch-shot freeze and
   live-session hardening; writes `gates/en-<w>/live.png` + `live.capture.json` (fixedLayers recorded,
   so gate.sh reuses it). The build side is captured by the stock stitch-shot. Retake: delete live.png
   and re-run fp-stitch (gate.sh would otherwise retake it with stitch-shot and fail on the scroll stall).
3. DEFECT FOUND in (2) `fp-stitch.mjs` (2026-11-02, home recreate): it calls `swiper.slideTo(0, 0)` AFTER the video
   freeze; when the live hero carousel is not on slide 1, Swiper's slideChangeTransitionStart handler replays
   video01 (`currentTime = 0; play()`), so `gates/en-<w>/live.png` shows the hero at ~1.3 s instead of t=0
   (frame-matched). Gate effect: /en hero band 44–65 % → full page 10.13 % (1440) / 11.70 % (360). Evidence-only
   scratch variant with the reset moved before the freeze: `stardust/.work/en/tools/fp-stitch-t0.mjs` →
   `stardust/.work/en/live-t0-<w>.png` (build vs it: 0.09 % / 0.11 %); it never feeds gate.sh. Fix pending owner
   approval: reorder in fp-stitch.mjs, then regenerate both live.png references (invalidates /en rounds iter1–3).
4. fp-stitch.mjs fixed (coordinator, 2026-11-02): carousel reset moved before the video freeze; live.png v1
   (hero at ~1.3 s) invalidated and retaken for en-1440/en-360. Confirm rounds: 0.09% / 0.11%.
