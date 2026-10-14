# Learnings — balbriggan.ie replica (2026-10-13)

- **Site-shadowed `window.scrollTo`.** The theme declares a global `function scrollTo(target)`; every instrument's
  numeric `scrollTo(0, y)` threw. The NATIVE_SCROLL_SHIM in `diff/live-session.mjs` fixes the diff instruments;
  `dynamics-detect.mjs` and `crawl.mjs` need it too (project copies patched). Upstream candidate.
- **`unit-geometry.mjs` origin cache was per slug, not per width** — a 360 gate reused the 1440 inventory and printed
  a false "FAIL (elements)". Key now `<slug>-<width>-units`. Upstream candidate.
- **`chrome-explore` default header root missed a `div#wrapper-navbar` header** (0 controls); `--root` fixed it.
- **Licensed font → substitute** passes page and band gates (≤ 2.3%) but fails the header contract's 2% open-state
  crop bar on every small menu panel (4.6–7.3%): those findings need the site owner's sign-off by design.
- **Flaky source captures:** a fresh live capture came back with unloaded images (+122px); the gate reused the
  archetype's verified live captures rather than measuring against a broken origin.
- **gate-all reads `status: deployed` from state.json** while `state.mjs` stops at `migrated`; the published gate ran
  from a copy (`stardust/.work/rollout/gate-state.json`) with `liveUrl` + `deployedPath`.
