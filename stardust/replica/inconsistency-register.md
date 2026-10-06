# Inconsistency register — Garden Eight replica

The ONLY permitted design deltas. Sources: none (no audit run, no `--register` file).

**Empty — pure replica.** Anything that differs from the captured current state of
https://garden-eight.com/ is a fidelity defect, not a change.

Append-only during recreation: a new inconsistency found mid-recreation gets an entry
(usually `deferred`), never a silent fix. Capture-state items (WebGL canvas, lazily attached
case videos) are not register entries — they are replicated as captured and logged in
stardust/replica/progress.json residuals.

## Entries

### R1 — accessible name of the third case link (`/cases/anai-wood`)
- **Status:** accepted (C-deliver, archetype-home, 2026-10-05)
- **Evidence:** live DOM `a.pickup-a[href="/cases/anai-wood/"][aria-label="Anai"]` while the rendered title reads "Anai Wood" (captured index.json; content-presence at 360: origin key "anai", served key "anai wood" — stardust/replica/gates/all-360/index/content.json finding 0). The other two case links carry an aria-label equal to their title.
- **Minimal change:** the delivered link's accessible name is its authored text "Anai Wood" (no aria-label constant in block code; the authored anchor is the editable node). Visual rendering identical.
- **Scope:** accessibility tree only; no pixel, layout or copy change.
