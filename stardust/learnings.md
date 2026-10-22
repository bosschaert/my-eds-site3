# Learnings — skerriesmills.ie replica (2026-10-14)

- chrome-compare cannot pair unnamed source controls whose kind is outside FAMILIES (here `menu`): a permanent false 🔴. Run-local fix pairs unnamed controls in order by kind — upstream candidate.
- stitch-shot refuses the 404 shell, so the C0 shell pixel/crop gate moves to the first page unit on one-page runs.
- gate-all selects `status: deployed` rows from state.json, a status state.mjs cannot write; a --state copy carried the deployed row.
- Live theme wraps header/footer inside `<main>`; content-presence needs presence.json scoping to `main > div.flex-1`.
- Compressed asset responses: grep served JS with `curl --compressed`.
