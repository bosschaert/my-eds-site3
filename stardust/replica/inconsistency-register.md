# Inconsistency register — balbriggan.ie replica

One entry. Everything not listed here is frozen; any design delta found by the gate is a defect, not an improvement.

| # | area | evidence (captured) | minimal change | pixel effect | status |
|---|---|---|---|---|---|
| 1 | Accessibility: icon-only social links in the header and footer (Facebook, Twitter, LinkedIn, Instagram) | `stardust/current/pages/index.json` ctas[]: the anchors carry only a FontAwesome glyph, no text, no `aria-label`/`title` (empty accessible name) | `aria-label="<network>"` on each anchor in the `/nav` and `/footer` documents — no text node, no visible change | none (attribute only; chrome-parity/content-diff may list the attribute as EXTRA — accepted here) | accepted (hands-off; platform accessibility baseline; recorded in the handoff journal) |
