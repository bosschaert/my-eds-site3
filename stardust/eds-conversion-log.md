# EDS conversion log — niravmanubhai.com replica (single page)

## Target
- DA org `of1-labs`, repo `stardust-replica-38f927f4`, branch `main`; preview `https://main--stardust-replica-38f927f4--of1-labs.aem.page/`, live `…aem.live`.
- Runtime contract: `stardust/runtime-contract.json` (vanilla EDS, formatted-only buttonization, `p.button-wrapper` / `a.button`).

## Publish decision (recorded once)
Preview AND live (`deploy-batch.mjs` without `--no-publish`): rollout D-site verifies the served sitemap on the live origin and the root must answer there; the site is a single page and its owner sees the preview link. The visual gate is judged on the preview origin (`aem.page`).

## Decode tiers per section (index / home)
| section | block | tier |
|---|---|---|
| courtyard hero (h1 sr-only + desktop/mobile art-directed image) | `hero` | template-slotted |
| host (h2, intro, three paragraphs, portrait) | `host` | template-slotted |
| story nursery (eyebrow, h2, image, copy, text CTA) | `story-nursery` | template-slotted |
| rooms (head, 8 door cards as links, closing line) | `rooms` | reconstructive (repeat group) |
| conversation (image · eyebrow, h2, 4 ledes, 6 CTAs) | `conversation` | template-slotted |
| departure (sr-only h2, eyebrow, blessings, now-link · portrait, thanks) | `departure` | template-slotted |
| header (Home link, title, hamburger drawer with 13 links) + scroll chrome | `header` (foundation) | template-slotted |
| footer (6 links) | `footer` (foundation) | template-slotted |

## Links
27 internal hrefs target sibling pages outside the single-page scope → authored as absolute `https://www.niravmanubhai.com/<path>` (scope extension → repoint). `/` stays root-relative.

## Fonts
Self-hosted Google faces exactly as the gated prototype declares them (`stardust/prototypes/fonts.css` = Google's css2 response for the site's request, per-weight single-value faces; 19 files + Rasa Gujarati) → `styles/fonts.css` + `fonts/gf/`. Never the crawl's `fonts/*.woff2` (range-declared faces changed glyph advances 1–5%).

## Lint
Boilerplate ESLint airbnb-base + Stylelint standard; `stardust/` tooling copies are excluded in `.eslintignore` (not runtime files).

## C1 home cluster — decode notes
- Tiers as tabled above: `hero`, `host`, `story-nursery`, `conversation`, `departure` template-slotted (empty wrappers with the prototype's class names; authored nodes MOVED by role — heading / link-free pre-heading `<p>` = eyebrow / whole-link `<p>` = CTA / media); `rooms` reconstructive (rows classified by content: picture row = door card, `<h2>` row = head, trailing picture-less row = closing line; card CTA `<p>` gives the card `<a>` its href and the inner anchor is unwrapped, EW6).
- Alt-anchored variant: the live `.poster-insert` on the 4th door is `.rooms .courtyard-door-media:has(img[alt="Come, Sit – Just Ask"]) img { object-fit: contain; background: #efe4cf }` — anchored to the authored alt, not to card position.
- Authoring shape deviation (departure): the portrait is authored `<p><img></p><p>Thank you for visiting.</p>` (DA's own image shape) instead of a bare `<img>` beside the `<p>` — the runtime's `wrapTextNodes` folds a picture-led mixed cell into one `<p>`, which the workspace stamps as the editable and the decode would have to discard (block-roundtrip: DEAD TEXT). Same rendered DOM.
- Hero renders 2 `<img>` (desktop + art-directed mobile slot toggled at 640px) vs the prototype's one `<picture>` with a `<source media>` — block-roundtrip 🟡 IMG COUNT is the intended slot difference.
- Conversation CTAs: `target="_blank" rel="noopener noreferrer"` set by decorate() on `http(s)` anchors (attribute, not text); the mailto stays same-tab.
- davids-model-lint 🟡 D1/D3 on hero, host, story-nursery, rooms: bespoke layouts (sr-only h1 + art-directed pair; head row + note|portrait row; head + figure + copy; head row + 8 image|text card rows + closing row) — kept as blocks.
- Published-origin gates (preview origin, pub2 final, --full): 1440 → 0.02 % pixel, height Δ 0, overflow 0, content 0 🔴; 360 → 1.02 %, Δ 0, overflow 0, 0 🔴. Header/footer crop-compare: 0.00 % / 0.00 % @1440, 0.00 % / 1.09 % @360. Residual: chrome-parity 2 deltas at both widths (header title tag <span>→<p>; footer region background on the inner .nmh-footer, not the root) — both in the frozen foundation, filed in stardust/rollout/foundation-requests.md; iteration stopped after pub2 since a pub3 cannot change frozen files. ai-readability code score 100.
