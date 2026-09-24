# Foundation requests (appended by cluster subagents; one line each)
- home | header title "Nirav Manubhai" is authored/rendered as `<p>` where the source has `<span class="nmh-title-property">` (tag-only pair delta; no scoped override possible from a block) | chrome-parity pub1 @1440 and @360: header 1 delta, PAIR "Nirav Manubhai" tag <span> → <p>; 3/3 texts paired; full-page pixel 0.02 % / 1.02 %, height Δ 0 | home
- home | footer region root reads transparent — `var(--parch)` is painted on the inner `footer .nmh-footer` while the source paints it on the `<footer class="nmh-footer">` root the parity tool measures (no scoped override possible from a block) | chrome-parity pub1 @1440 and @360: footer 1 delta, REGION STYLE backgroundColor rgb(236, 227, 209) → rgba(0, 0, 0, 0); 6/6 texts paired | home

## C-final disposition (applied once, 2026-09-23)
- header title `<p>` → `<span>`: NOT APPLIED. The title is an authored paragraph in `/nav` moved by header.js (EW1: never retag authored text); crop diff 0.00 % at both widths, tag-only parity delta accepted as a documented residual.
- footer root background: APPLIED. `footer { background: var(--parch) }` added to blocks/footer/footer.css (the inner `.nmh-footer` already paints it; the host root now matches the source `<footer>`); re-gated at pub3.
