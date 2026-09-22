# Learnings — stardust-replica-20ec2d57 (replica of www.example.com)

- 2026-09-22 · replica gate · `chrome-parity.mjs` reports header/footer as a REGION "no element matches" delta on a
  page that has no chrome on either side, so `gate.sh --full` exits 2 even when every other probe passes. Read
  `chrome-parity-<label>.txt`: absence on both sides is not a delta. Re-probe with
  `--no-defaults --region "page=<liveRoot>|<buildRoot>"` (an empty region list exits 1 with usage).
- 2026-09-22 · replica gate · on the EDS side the empty boilerplate `<header>`/`<footer>` elements exist even when
  hidden, so `--main "body > :first-child"` is not symmetric against a live page whose root is `body > div`; a
  selector list (`"body > div, main .default-content-wrapper"`) keeps `--main` symmetric.
- 2026-09-22 · deploy · the code origin serves CSS gzip-encoded; `curl -s | grep` on it is silent — use `--compressed`.
- 2026-09-22 · deploy · `deploy-batch.mjs --log <path>` does not create the log's directory (fatal ENOENT); `mkdir -p` first.
- 2026-09-22 · deploy · an earlier `npm i --no-save` of the gate deps had pruned `@babel/core`, so `npm run lint`
  failed to load its parser; reinstalling `@babel/core playwright pixelmatch pngjs` in ONE `--no-save` call restores both.
- 2026-09-22 · rollout · `gate-evidence.mjs` lints `stardust/migrated/<page>.html` (prototype-form), not the DA doc under
  `content/`, so a clean delivered doc can show `FAIL` P1s on the sidecar; declare `delivery-lint` on the sidecar with the
  `content/` lint evidence.
- 2026-09-22 · rollout · `dynamics-check.mjs` requires `stardust/dynamics/parity.json` even when the dynamic inventory is
  empty; author the empty report before phase D2, and write the D2 `end` ledger line only after the check ran.
- 2026-09-22 · EDS · a default-content page with a lone `<p><a>` gets auto-buttoned (`.button-wrapper`/`.button`); when the
  source renders a plain link, leave the classes unstyled instead of altering content.
