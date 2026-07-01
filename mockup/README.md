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

## Pages

- **`situation-map.html`** — **the model-faithful page.** Realigned to the code
  (`js/situation.js` + `HIGHLIGHT_TYPES`), which is the canonical, ADR-0013
  implementation. The earlier `payoff-loop.html` map used three invented
  *continuous* metrics; this page uses the real model instead:
  - **Unit = named province** (a hex cluster, per `DOMAIN_MAP`), owner color
    filling the whole cluster with a drawn perimeter.
  - **Situation = a category, not a score.** Each province is classified by a
    verbatim port of `classifyHex` into one of six ADR-0013 types
    (defense / threat / uncertainty / opportunity / route / growth) from the
    real Phase-1 stats (economyValue, localGarrison, informationConfidence,
    strategicTags, owner).
  - **Sparse.** Only the turn's top highlights are emphasized (situation.js
    caps at 7); everything else stays calm — ADR 0013 / DOMAIN_MAP "limit
    strong highlights to avoid noise."
  - **Briefing + click.** A briefing panel lists the highlights with reason and
    recommended command; clicking a province opens that recommended command
    prefilled. Command *adjustment* (the skill edge) is left OPEN.
  - `threat` is defined in the code enum but not emitted by `classifyHex`, so
    it is shown only via a clearly-marked proposed "위협 렌즈" toggle.

## Earlier exploration pages

- **`payoff-loop.html`** — the full payoff-loop representation model (below).
- **`encoding-compare.html`** — a focused A/B/C study of *how the map cell
  encodes multiple dimensions at once*, built to judge one question by eye:
  - **A · color-stack** — ownership as base hue, with value → opacity,
    threat → saturation, development → lightness all stacked on the *same* fill
    (the "everything in one color" proposal). Rendered honestly so its
    weakness is visible: the three metrics cross-contaminate and low-value
    cells lose their ownership color.
  - **B · separable channels** — ownership → base hue (always legible),
    development → brightness/glow, value → gold ◆ mark, threat → red border.
    Each dimension on a *different* channel, so they do not interfere.
  - **C · change toggle** — one toggle that swaps the steady-state view for an
    "이번 턴 변화량" overlay (dims everything, shows only what grew / flipped /
    was lost this turn).
  - A **decode-test strip** at the bottom shows the *same* five value/dev/threat
    scenarios rendered in A and B side by side, so discriminability can be
    compared directly. Keys: `1`=A, `2`=B, `D`=change overlay.

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
