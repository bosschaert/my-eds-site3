# Rollout report — www.example.com replica → main--stardust-replica-20ec2d57--of1-labs.aem.page

Run: attempt 1, sessions 1–2, 2026-09-22 (hands-off).

| | |
|---|---|
| Pages | 1 total · 1 delivered · 1 verified · 0 pending · 0 failed |
| Templates | 1 (`static`, archetype `index`) — no siblings |
| Blocks | 0 distinct (the page is default content: `h1`, two `p`, one link); header/footer blocks unused — the source has no chrome |
| Quality | published-origin gate: 1440 0.00 % / Δ0 px, 360 0.00 % / Δ0 px; content-diff none; visual-diff 0 flags; chrome parity (content root as sole region) exit 0; motion parity PASS (0 behaviours live); ai-readability 100; qa-gate 6/6; optimize health 100/100 (1 P2 accepted: no JSON-LD, faithful to source) |
| Dynamic surface | 0 features detected (3rd-party hosts 0, APIs 0, forms 0, triggers 0); nothing to replay |
| To deliver | nothing — the site is one page and it is live on preview and live origins (`/` → 200 on both) |

Inconsistency register: empty (pure replica). Deviations from the boilerplate are recorded in
`stardust/eds-conversion-log.md` (canon styles.css, no header/footer loading, publish decision).
