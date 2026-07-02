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

- **`situation-map.html`** — **the model-faithful page (v5, ADR 0019 + fog +
  front-sector drill + map-only shell).** The stage-1 situation-judgment model, with fog-of-war
  folded in as the `불확실` axis and rendered in the A2 military-cartographic
  (block-wargame) visual language (fog-of-war-discovery). v1 ported `situation.js`'s
  flat six-type list; v2 rebuilt the structured ADR 0019 reading; v3 integrated
  fog + the A2 skin; v4 stitches the front-sector drill (①→③→④) into one turn flow;
  v5 removes the sidebar entirely — map-only reading with lens annotations and a
  leak-through warning, a summoned work surface, and one unified action grammar
  (name target → summon surface → seal plan):
  - **Structured reading, not a flat list.** 판세 (aggregate "am I winning"
    glance) + three located axes 위협 / 기회 / 불확실. Growth folds into 판세
    (owned-development glow); route folds into reachability.
  - **Unit = named province** (a hex cluster, per `DOMAIN_MAP`); adjacency is
    computed from the hexes; hover is the cell-level drill-down.
  - **Fog = the `불확실` axis (A2 military-cartographic).** Each foe province
    carries a knowledge state derived from information confidence — **undiscovered**
    (murk wash + `?`, occupant unseen) / **glimpsed** (dim block-counter + a faded
    *estimate-range band* on the 4-segment strength meter, width ∝ 1−confidence) /
    **reliable** (crisp counter, exact meter) / **owned** (your crisp counters).
    Terrain stays visible under murk (position fog). Low-confidence borders route
    to 불확실.
  - **Scout = the axis transition.** Clicking a 불확실 province opens a 정찰
    command; scouting raises confidence (→ MAX 0.90) and re-runs the classifier —
    murk lifts, the meter narrows, and the axis resolves to 위협/기회, on the
    province *or a neighbour* (fog can hide a threat: revealing an under-scouted
    border can light up your adjacent province as 위협). Scouting spends the turn's
    **one action**, so you see the resolution but respond next turn — attention >
    budget, made tangible. 되돌리기 resets the turn.
  - **Relational threat.** 위협 needs an adjacent enemy whose *estimated* force
    beats the province's weakest-link garrison, gated by confidence — drawn as an
    arrow from the enemy driver to the threatened province. `defense` + `threat`
    are merged into one 위협 axis.
  - **Lens annotations, no recommendation (v5).** The posture control (균형 / 공세 /
    방어 / 정찰 중시) is a pure reading lens — the rec-ring, advice text, and
    dissonance warning are retired; posture never changes what is classified, only
    what the map annotates. Each lens answers a different question with on-map
    annotations over an invariant truth: 방어 = "where can I be breached"
    (weakest-garrison labels on own border provinces), 공세 = "what can I take"
    (force-comparison chips on reachable foes), 정찰 중시 = "what can't I see"
    (confidence % labels on foes), 균형 = base view. The active lens brightens its
    axis; other axes dim. **Leak-through** is the dissonance successor: while a
    lens is active, any suppressed-axis tension whose magnitude exceeds
    `LEAK_RATIO` (1.5×) the strongest active-lens tension stays at full brightness
    and gets a red pulse ring — the lens may dim things, but a sufficiently urgent
    fact bleeds through.
  - **Stage-1 → stage-2 bridge (1 action).** You see ~5–7 tensions but hold one
    action; for a normal province, clicking a highlight opens the prefilled floating
    command card, and 확정 (or 정찰) spends the single action (others dim). Choosing
    *which* tension to spend it on is the stage-1 decision.
  - **Front-sector drill (v4, hero-only path).** For the one wired hero province
    (`소현`, under 위협 from `철옹`), clicking its tension *drills in* instead: the
    camera focuses 소현 (surroundings dim, viewBox tweens), and its three front
    **sectors** appear as bordered, named, clickable areas *on the map itself*
    (sector identity is spatial — ADR 0022). Each sector shows one collapsed defense
    meter, a ★ on the reachable weakest link (`남부 전선`), and one value chip (the
    stake). A `철옹 → 남부` pressure arrow carries the estimate band `12–16 · 75%`.
    Clicking a sector swaps the right rail to a **compact command card** (transplant
    of `command-card-hybrid.html`): the faced sector gets the full 방어/정찰 card
    (base defense unpacked into 주둔+지형+축성, confrontation axis, 승률); rear sectors
    get a read-only stake readout. On 확정, the **duel beat** seals both orders in the
    same tick — the player's `봉인` on 남부 and a face-down `?` on 철옹 ("적도 이번 턴
    계획을 굳혔다. 내용은 안개 속.", ADR 0025) — then the camera rewinds to the
    overview. Every state transition is animated and the mission label morphs
    (긴장 선택 → 구역 선택 → 커밋 결정 → 명령 봉인) so each state answers "what am I
    here to do?". Command *adjustment* (the skill edge) is left OPEN.
  - **Veil tuning.** A collapsible slider panel (murk / glimpse brightness /
    estimate-band fade / recon marker / counter size) is retained to keep dialing
    in the fog visual language against live data.

  **v5 known limitations (grammar probe, not a systems probe):** only 소현 is wired
  for the drill (mixed-control / split encoding never demonstrated); the card shows
  only the *magnitude* layer of the ADR 0025 uncertainty duel (categorical
  plan-vs-plan is out of scope); duel-beat resolution is deferred ("해소는 다음
  슬라이스"); the plan list (방어 강화 / 정찰) predates the operation-plan catalog
  roster; all magnitudes are illustrative; the leak threshold and all annotation
  values are illustrative; the minimal-card plan list (정찰/공세 준비) predates the
  operation-plan catalog roster.

  **Charter bar (v5):** hover is mechanism-explanation only; state needed for
  cross-province comparison must be readable ON the map; every meaningful state
  change must be confirmable on the map without opening the work surface.

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
