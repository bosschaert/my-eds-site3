---
_provenance:
  writtenBy: stardust:replica
  mode: bounded-single
  writtenAt: 2026-10-05T15:15:00Z
  synthesizedFrom:
    - stardust/current/pages/index.json
    - stardust/replica/tokens.json
---

# PRODUCT — Garden Eight (bounded single-page spec)

Descriptive record of the one captured page, https://garden-eight.com/. Nothing here is a target to change; every line traces to the captured JSON.

- **Title:** Garden Eight. **Description (meta):** "Garden Eight is a digital design studio…" (captured verbatim in index.json `description`).
- **Who:** "We are a digital design studio based in Tokyo" (hero lead). Canonical https://garden-eight.com/, hreflang en + ja (/ja/) + x-default.
- **Page structure (in order):** fixed header (logo "Garden Eight" as h1, MENU/CLOSE toggle, nav: Home, Cases, About, Archives, Contact, AI, JA) · hero with the display headline "What can we make next" (aria-label on the `.h1` wrapper) and the lead · intro paragraph ("We approach every projects with wonder fueled by a boundless spirit of inquisitiveness.") · case marquee: Takamitsu Motoyoshi (/cases/photoyoshi/), Phil Studio (/cases/phil-studio/), Anai Wood (/cases/anai-wood/) · "View Cases" link (/cases/) · footer block: TOP button, about image link (/about/), statement paragraph ("Our goal has always been to make a great website in a playful, yet humble way. We are driven by a willing mind and a sincere attitude to make cool things."), ABOUT US link · site strip: logo, ©2022, FAQ (/faq/), PATIO (https://patio.garden-eight.com/), IG / TW / IN social links, "M : hello@garden-eight.com" copy-to-clipboard button ("Copy to clipboard" / "Copied").
- **Media:** no `<img>`/`<video>` elements; the visual background is a fixed WebGL canvas (three.js, GLTF models); case thumbnails are lazily attached background videos (`.js-bg-video-inview`), empty in the settled capture.
- **Forms / search:** none. **Dynamic surface:** see stardust/dynamic-features.md.
