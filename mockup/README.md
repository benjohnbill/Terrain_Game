# Payoff Loop UI Mockup

A judgment mockup of the Phase 1 MVP **payoff-loop representation model**
(`docs/superpowers/specs/2026-07-01-phase-1-mvp-payoff-loop-design.md`).

**This is not production UI.** It is a fast, hands-on mockup so the representation
model can be judged by feel before it is finalized. All data is dummy
(`payoff-loop.data.js`), and no game logic is wired — it is a pure presentation
layer, kept separate from the real `js/` domain modules (ADR 0016).

## Open it

```bash
python3 -m http.server 8007
# then open http://localhost:8007/mockup/payoff-loop.html
```

## What to judge

Principle from the spec: **see state, read only the *why*.**

| Surface | Where | Represents |
|---|---|---|
| **"Am I winning?" glance** | top HUD + right rail | power-differential bar (self vs strongest rival), ranking ladder (re-orders), map area share, momentum (recent gains/losses, both directions) |
| **Map growth = visual weight** | center hex map | development shown by color intensity + icon density + glow; 4 overlay lenses (value / development / threat / control) in the ADR 0013 color language |
| **Hover** | any hex | a compact stat chip (icons + mini-bars), never prose |
| **Click / Enter** | any hex | a prefilled command card (an action), not a lore dump |
| **The loop, as motion** | `다음 턴 ▶` | replays 3 canned turns: development brightens, provinces flip owner, the power bar moves, the ladder re-orders, momentum records the swing, and a conquest highlights the opportunities it opens |

Press `다음 턴 ▶` a few times and watch the whole board respond; `↺` resets.

## Deliberately unresolved (OPEN)

Pillars 2–3 — **making the skill edge visible** — are the spec's primary open
problem. The mockup only carries **placeholders**, marked `OPEN ?` in purple:

- the command card's "내 판단 vs 프리셋 기본값" slider (a "+X% over default" delta),
- the "opportunity chaining" highlight after a conquest.

These are direction-exploration stand-ins, not committed design. The design
questions they raise are collected in `DESIGN-QUESTIONS.md` for the planning
session.

## Files

- `payoff-loop.html` — DOM skeleton
- `payoff-loop.css` — styles (reuses the game's dark-glass identity + ADR 0013 tokens)
- `payoff-loop.data.js` — dummy provinces, factions, and the canned turn script
- `payoff-loop.js` — presentation logic (rendering only; no domain logic)
