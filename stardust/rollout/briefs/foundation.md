# Unit C0 — foundation (author AND deploy)

Read stardust/rollout/briefs/common.md first; it binds you. You are the ONLY agent running.

## Goal
Author and deploy the site foundation so every later unit only adds blocks + content:
1. `styles/styles.css` (+ `styles/lazy-styles.css`, `styles/fonts.css`): the canon layer of
   stardust/prototypes/canon.css that is NOT a module — tokens/custom properties, @font-face (owner
   CDN URLs, exact weights as canon.css), base typography (h1–h6, p, lists, links), buttons
   (`.c-button` look applied to EDS button links `a.button` / `.button-container`), container widths
   and page gutters (DESIGN.json extensions.breakpoints — the 1460 content cap), section spacing for
   `main > .section`, helper/utility classes the archetypes use. Remove boilerplate defaults that
   conflict (Roboto fonts, colors) — the delete of fonts/roboto-*.woff2 is fine. Keep the boilerplate
   `scripts/scripts.js` flow; add only what is needed (e.g. icon decoration, a shared lazy/
   count-up helper module under scripts/ if several blocks need it — later units cannot add to
   scripts/ after freeze, so put shared runtime helpers there now: icons from
   stardust/prototypes/assets/icons → /icons/*.svg, lightbox/modal helper for `data-lightbox`, the
   sticky-header morph, scroll-to-top).
2. `blocks/header/` + `blocks/footer/`: recreate the canon chrome exactly (sticky header with its
   scroll morph, mega dropdown, search trigger, language switch, mobile off-canvas menu; footer
   columns, social list, legal row) from stardust/prototypes/canon.css + canon.js + the chrome markup
   in stardust/prototypes/en-proposed.html. Header/footer read their content from fragment
   documents (`/fragment` loader, EW rules: move authored nodes, never textContent-copy).
3. Chrome documents in DA, one pair per locale root present in stardust/state.json:
   en, de, and every country root (cs-cz, sk-sk, pt-pt, en-pt, es-mx, fr-fr, ro-ro, en-us — check
   each page's captured header/footer in stardust/current/pages/<slug>.html: country sites may carry
   different nav entries / footers; author each locale's chrome verbatim from its own capture).
   Paths: /<locale>/nav and /<locale>/footer (root `/` page uses the en chrome unless its capture
   says otherwise); the header/footer blocks resolve `/<first path segment>/nav` with the en
   fallback, or honour a `nav`/`footer` metadata row. Every chrome document carries a metadata
   block row `Robots | noindex`. Author them as DA HTML under `content/<locale>/nav.html` etc.
4. Deploy: lint (`npm run lint`), commit, `git push` (code), wait for code sync with a bounded
   curl poll (≤ 5 s apart, ≤ 5 min) on https://main--d9ddbc54--aemcoder.aem.page/blocks/header/header.js;
   then the chrome documents through `node stardust/scripts/deploy/deploy-batch.mjs --org aemcoder
   --repo d9ddbc54 --branch main --content content --paths stardust/rollout/units/foundation.paths
   --ledger stardust/deploy/ledger-foundation.json --log stardust/.work/rollout/foundation/deploy.log
   --concurrency 2 --token-file "$ADOBE_IMS_TOKEN_FILE"` via run-bg (PUT → preview → live).
5. Shell page for the foundation gate: deploy the legal archetype's content as DEFAULT CONTENT ONLY
   (no new blocks; h1 + its text, verbatim from stardust/current/pages/en-general-legal-notice.html,
   with a metadata block: Title, Description from the capture) at `content/en/general/legal-notice.html`
   → path /en/general/legal-notice (the legal archetype unit later replaces it with its blocks).
   Run the per-page chain on it (delivery-lint, localize-links over content/ then --check,
   davids-model-lint, sanitise.js, deploy-batch). Verify `.plain.html` 200, one h1, 0 about:error.
6. Self-check before returning (the coordinator runs the real gate): on the preview URL of the shell
   page at 1440 and 360, run
   `stardust/scripts/replica/gate.sh en-general-legal-notice "https://www.continental.com/en/general/legal-notice/" "https://main--d9ddbc54--aemcoder.aem.page/en/general/legal-notice" <w> pub1 --full --main main --marker Continental`
   via run-bg (both widths queued, then wait), and
   `node stardust/scripts/replica/chrome-parity.mjs <live> <preview> --width <w>`.
   Header and footer must reach chrome parity; iterate on header/footer/styles (cap 3 rounds) on
   the published origin (edit → lint → commit → push → poll → re-gate). Body pixel of the shell is
   NOT your bar (its blocks come later) — header/footer bands are (crop-compare ≤ 2 %:
   `node stardust/scripts/replica/crop-compare.mjs --help` for flags).
7. Write stardust/runtime-contract.json (what the foundation provides to blocks: CSS custom
   properties, helper modules under scripts/, icon names, chrome document paths) — later units read
   it instead of the code.

## Return
Verdict line: `foundation: chrome docs n/n live, shell live, gate 1440 x% / 360 y%, header/footer
crop a%/b%, chrome-parity <quiet|n deltas>` + the list of foundation files + any residual.
