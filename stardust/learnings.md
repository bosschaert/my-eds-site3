# Learnings — replica migration of https://balbriggan.ie/ (2026-09-28)

### Stitched live capture exits at the document end when the page shrinks during scroll
- failure class: capture-gap (stitch-shot stall guard fired on a sticky-nav morph)
- evidence: both live captures of https://balbriggan.ie/ at 360 exited 1 — the sticky nav's `.scrolled` state shortens the document by 13 px while stitch-shot scrolls, and the stall guard read the shrink as a stalled scroll at the last band (journal § Recreate, 2026-09-28)
- proposed change: `skills/replica/scripts/stitch-shot.mjs` — the stall guard must not fire once `scrollY + innerHeight >= scrollHeight` (document end reached), and must tolerate a shrinking `scrollHeight`; the project copy carries the commented fix
- status: pending

### gate.sh --full cannot probe chrome on a site without `<header>` / `<footer>` landmarks
- failure class: dynamic-gap (instrument assumes landmark roots)
- evidence: the source's chrome roots are `#wrapper-navbar` / `#wrapper-footer-full` (WordPress theme); `gate.sh … --full` had no way to pass them to content-diff / chrome-parity, so the project copy gained a `GATE_CHROME_ARGS` pass-through (journal § Recreate, 2026-09-28)
- proposed change: `skills/replica/scripts/gate.sh` — accept `--chrome-header <sel>` / `--chrome-footer <sel>` (or `GATE_CHROME_ARGS`) and document them in `skills/replica/reference/source-fidelity-gate.md` § Hardening
- status: pending

### Published-origin build capture ends before the last block decorates
- failure class: silent-render (a partially decorated build page measured as the build)
- evidence: `pub1` / `pub4` at 360 on https://main--22880d22--aemcoder.aem.page/ reported Δh +49 px with the footer block still undecorated when the stitched capture started; the number vanished with a settle pass (`GATE_BUILD_SETTLE=1`, project-copy pass-through, off by default) — journal § Rollout C-deliver units home and final, 2026-09-28
- proposed change: `skills/replica/scripts/gate.sh` + `stitch-shot.mjs` — on an EDS build target wait for `body.appear` and for `header`/`footer` to have children (or a `--settle` flag on by default for `.aem.page`/`.aem.live` hosts); name it in `skills/replica/reference/source-fidelity-gate.md` § The published-origin gate
- status: pending

### Live-origin sitemap keeps a noindex chrome document after republish
- failure class: index-empty (sitemap/index propagation lag misread as a defect)
- evidence: `https://main--22880d22--aemcoder.aem.live/sitemap.xml` still lists `/nav` after `/nav` was republished with `robots noindex`; `/footer` dropped on the first republish, `/nav` had not by E-full-site (ledger rows D-site and E-full-site, 2026-09-28)
- proposed change: `skills/rollout/SKILL.md` § Phase D — verify the served sitemap on the preview origin first, re-check the live origin with a bounded poll, and record a remaining entry as a re-index follow-up rather than a failed check
- status: pending

### Font census names faces the page never loads
- failure class: capture-gap (computed `font-family` reported as the rendered face)
- evidence: the style census for https://balbriggan.ie/ computes Gotham-Light / GothamMedium / GothamBold, but no stylesheet declares a Gotham `@font-face`; the live page renders fallback fonts, and the recreation had to discover this by width probes (journal § Preserve direction, 2026-09-28)
- proposed change: `skills/extract/SKILL.md` § Fonts — cross-check every computed family against the intercepted `@font-face` declarations and the network font requests, and flag `declared-but-not-loaded` families in `DESIGN.json` / the census so recreation keeps the stack and knows the rendered face is a fallback
- status: pending
