# Dynamic features — plan (niravmanubhai.com home)

## Phase: chrome interactions (ships with the archetype — replica Phase 3)
- **Deliverables:** menu drawer (open/close via button, overlay click, close button, Escape), styled from the lifted `.nmh-menu`/`.nmh-overlay` rules; entrance animation `nm-page-in` honoring `prefers-reduced-motion`.
- **Authoring contract:** behaviour lives in the header block JS on the delivery side; the prototype carries the same class toggles so `motion-observe.mjs` measures parity.
- **Verification:** `motion-observe.mjs` on live and on the build with the same `--click .nmh-menu-btn` poke; `motion-compare.mjs` reports parity; pixel gate returns to the gated value.
- **Owner decision:** none. **Effort:** small.

## Phase: tags (interim, owner batch)
- **Deliverables:** none on the preview host. At launch, the owner-confirmed gtag snippet (and optionally the Cloudflare beacon) is added to `head.html` once.
- **Verification:** at launch, one page view visible in the GA4 realtime report from the new host.
- **Owner decision:** property id + Cloudflare Web Analytics on/off. **Effort:** trivial.

## Phase: locale — none
Single-language, single page; `hreflang` alternates are decided out (see register).

## Phase: detect / settings — closed
`dataLayer` is only the gtag bootstrap object; nothing on the page reads it. Static snapshot, no work.
