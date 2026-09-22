# EDS conversion log — www.example.com replica

## index (archetype, page type `static`) — 2026-09-22

- **Decode tier:** none needed. The page is default content only (one `h1`, two `p`, one link);
  no composite section, so no block. `_meta.json.modules[]` is legitimately empty.
- **Content doc:** `content/index.html` — verbatim strings from `stardust/current/pages/index.json`
  (byte-equal to the gated prototype's `<main>`), one section, no metadata block (the live title
  is the `h1` text and the page has no meta description).
- **Canon → styles.css:** the boilerplate design system is replaced by the replica canon
  (`stardust/prototypes/css/canon.css` + `css/index.css`): 60vw column, 15vh block margins,
  `#eee` field, `#348` links, `system-ui`, `h1 1.5em`, one `opacity: 0.8` content wrapper.
  Heading/paragraph margins and line-height revert to UA defaults, as on live. Section
  gutters/max-width removed (the body is the column on live). No button styles: the
  boilerplate auto-buttons the lone `<p><a>` (`.button-wrapper`/`.button`) and the source
  renders it as a plain link, so the classes are inert.
- **Chrome:** the source has no header or footer. `scripts/scripts.js` no longer calls
  `loadHeader`/`loadFooter` (the boilerplate header/footer blocks throw on a missing `/nav`
  or `/footer` fragment → pageerror); `header, footer { display: none }`. The blocks stay in
  the repo unused. No `/nav` or `/footer` document is delivered.
- **Served-tree hygiene:** `content/` added to `.hlxignore` (the DA source doc must not ship
  from the code origin).
- **Publish decision:** deploy to preview AND publish to live (`deploy-batch.mjs` default).
  Hands-off run, single page, no staging owner to defer to; the readiness probe is the
  preview host's `/`.
