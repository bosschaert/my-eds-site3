# Dynamic features — plan (niravmanubhai.com home page)

## Phases
1. **static** (replica Phase 3–5): every section ships as static content; the hero photo, door cards and link lists are plain content. Deliverable: the gated page. Verification: source-fidelity gate + content-presence.
2. **locale metadata** (deploy, head metadata): emit `hreflang="en"` and `hreflang="x-default"` alternates to the delivered `/`. Verification: `curl -sI` + grep on the published origin. Effort: minutes.
3. **tags** (owner decision, not scheduled): GTM/gtag `G-00QDEH6N5W` and Cloudflare Web Analytics stay off. If the owner opts in, run `dynamics-plan.mjs --martech`, author `scripts/martech.js` disabled-by-default per `reference/martech.md`. Effort: small.

## Authoring contract
No block needs JavaScript for data. The header menu button (`.nmh-menu-btn`) is chrome interaction — observed and decided in replica's interaction-parity step (motion-observe), not here.

## Owner decision
See `stardust/dynamic-features.md` § Decision batch (one item: tags on the new host).
