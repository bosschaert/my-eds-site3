# Dynamics parity check — https://main--stardust-replica-38f927f4--of1-labs.aem.page — 2026-09-23T20:17:01.795Z

Replayed 7 checks over 7 features · pass 7 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| Cloudflare Web Analytics beacon | T | interim | consent-gate | PASS | no request to 1 gated host pattern(s) before consent |  |
| gtag.js loader (G-00QDEH6N5W) | T | interim | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |
| GA4 collect + house-analytics event helpers | T | interim | consent-gate | PASS | no request to 1 gated host pattern(s) before consent |  |
| Hamburger menu drawer (.nmh-menu-btn → .nmh-menu.open + .nmh-overlay, close button, Escape) | M | done | dom-count | PASS | 1 × nav#nmh-drawer.nmh-menu (min 1) |  |
| Hamburger menu drawer (.nmh-menu-btn → .nmh-menu.open + .nmh-overlay, close button, Escape) | M | done | dom-count | PASS | 1 × button.nmh-menu-btn[aria-expanded] (min 1) |  |
| Hamburger menu drawer (.nmh-menu-btn → .nmh-menu.open + .nmh-overlay, close button, Escape) | M | done | no-page-errors | PASS | none on 1 page(s) |  |
| body entrance fade (nm-page-in .42s, disabled under reduced motion) | M | done | dom-count | PASS | 1 × body.appear (min 1) |  |

## Features without checks

- dataLayer global (gtag bootstrap) (A) — decided-out
- hreflang en / x-default alternates (I18N) — decided-out · owner: none needed: single page, single language; the replica emits no hreflang alternates
