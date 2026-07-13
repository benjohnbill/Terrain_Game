# War Model Build — Feature Index

**Status:** OPENED 2026-07-13 (R14 war-decisiveness co-analysis). **Slice 1
— decisive-battle spine calculator — LANDED 2026-07-13**: `js/battle.js` +
`mockup/decisive-battle/battery.js` merged to main (6 commits, suite 305/305,
whole-branch review clean). Measurement pass not yet run. L2 combat
simulation retired (ADR 0037).

**One-line.** The front door for building Terrain Game's war model in real
game code (`js/`) — implementing the sealed sector-resolution combat the L2
tournament (`mockup/combat-calc/`) only approximated.

## Scope

- **In:** the requirement baseline (`REQUIREMENTS.md`) the build must satisfy
  for combat, defense, war-decision, settlement, and bot war behavior; the
  design sessions that turn each undesigned/가안 item into buildable spec; the
  eventual game-code implementation.
- **Out:** the L2 harness itself (retired, not extended); UI/render work
  (its own axis — ADR 0028); crisis arc (PARKED backstop — revisit after this
  lands); Phase-2 systems (free-negotiation settlement, betrayal, naval).

## Why this feature exists

R14 (DESIGN-RISKS) found the L2 war machine produces no decisive climax —
0 annihilations/match, ~77% of wars fizzle to white-peace, the SPEC madmovie
(shield-break → decisive battle → cascade) never fires. A four-survey
synthesis of SPEC + DESIGN + DOMAIN_MAP + feature docs + ADRs (2026-07-13)
established that the fizzle is **not a property of the sealed SPEC war** but of
placeholder / harness-abstraction / bot-policy layers that diverge from it:

- defense built **per-front-uniform** instead of the sealed **per-sector,
  terrain-distributed** four-layer stack (A1),
- combat run as a **multi-turn siege conveyor** instead of the sealed
  **atomic single resolution** (A2 — actually *contradicts* ADR 0026),
- war appetite as a **static ratio gate** instead of the (undesigned)
  **opportunism read** (C1),
- a **bot-policy stall→white-peace** auto-exit that returns all occupied land
  (C2).

So the answer to R14 is to **build the sealed model**, not to keep tuning L2.
This feature is that build.

## Pointers

- `REQUIREMENTS.md` — the requirement checklist (A combat / B decision /
  C bots / D support), each row with birthplace + L2-gap + fizzle-contamination
  + build priority. **The spec skeleton.**
- **ADR 0037** — the decision to retire the L2 stage-machine and build the
  sealed war model; R14 re-diagnosis.
- **DESIGN-RISKS R14** — the risk this feature closes.
- **ADR 0028** — L3 build-out stack direction (the "which stack" input for
  the build design session).
- **SYNC-DEBT** — "L2 fidelity-boundary grill session" row (this synthesis is
  its war-model half); crisis PARKED row; "Decisive-battle spine — vocabulary
  seal DEFERRED" row.
- Slice 1: `docs/superpowers/specs/2026-07-13-decisive-battle-spine-design.md`
  (design spec, user-confirmed decisions) +
  `docs/superpowers/plans/2026-07-13-decisive-battle-spine.md` (executed TDD
  plan) → `js/battle.js` (pure isomorphic calculator) +
  `mockup/decisive-battle/battery.js` (measurement battery).

## Slice ladder / next steps (2026-07-13, slice 1 landed)

1. **Measurement pass** — RAN 2026-07-13 (battery metric-5 extension +
   2,880-scenario grid + defense-layer restoration probe,
   `mockup/decisive-battle/probe-defense-layers.js`). §7 metrics 1–4 PASS
   (field-army destruction 82.7% of decisive battles vs L2's zero; all
   three branches; Myeongnyang-class terrain flips; pinned fronts fall).
   Metric 5 first read: the 결전 is strongly attacker-favored
   (98.5% conditional win), BUT the co-analysis decomposed this into
   (a) grid under-manning (a manned shield repels — garrison 2000 at
   pass+walls holds the grid's maximum attack), (b) two sealed defense
   layers deliberately stubbed in slice 1 (M9 fill — FG-⑩ calls
   field-army-only a strawman; defender commit — ADR 0021 fourth layer,
   FG-⑧ stub). With all layers restored the picture normalizes to
   repulse 71.9% / decisive-win 80.9% / field-army rout 39.5%: the
   balance surface is the SHIELD GATE, not the 결전 — an attacker only
   reaches the 결전 by pre-assembling ≥1.5× local superiority
   (selection, not formula favoritism). Verdict pending user seal.
2. **Slice 2 — opportunism bot (C1 / SPEC_GAP ①)**: the bot reads
   field-army reach/pinning off the board; the defender-choice wiring
   (catalog Defense plan family) enters here. **Grill agenda (registered
   2026-07-13, user):** distance-proportional march wear for BOTH sides
   (hex-distance-scaled combat-power decay, replacing/subsuming the flat
   ×0.75 rider) — generalizes ADR 0015's attack-side water tax to land
   approach; must check double taxation against the supply system (M7
   principle) and design against the real map geometry (terrain-cradle
   mockup exists).
3. **Slice 3 — settlement (B3)**: territory/indemnity/vassalage conversion.
   When this touches the outcome contract, add winner-side 결전 casualties /
   a survivors block (spec §6 "casualties both sides" — user decision
   2026-07-13) and settle the absolute-bodies vs fraction unit convention
   in the same stroke.
4. **Slice 4 — per-sector defense 4-layer (A1/D7)** — porting
   force-geography's terrain-bound defense + reactive reserve from
   `FG_BOARD_GAAN` into the real map's per-sector stack.
5. **Vocabulary seal** (방패 깨기/결전 → AGREED, 캐스케이드 → 연쇄 붕괴
   rename, 야전군 registration + term-inventory patch) stays DEFERRED to the
   slice-seal doc-sync — see the SYNC-DEBT row; until then the slice-1 spec
   is truth for these terms.

## Open questions (remaining)

1. **The opportunism read (C1)** — how a bot reads a pinned rival's exposed
   front and commits; the load-bearing undesigned piece (slice 2's design
   session).
2. **Where the crisis re-enters** — as a lean turn-30 backstop (AB-③
   sudden-death framing) once decisive war is the default.

_Resolved 2026-07-13 (slice 1): "what first, on which stack" → this slice
ladder, plain isomorphic js (ADR 0028, `map-gen.js` precedent); "A2 × B2
atomic-vs-spine" → expressed as `resolveEngagement`'s one-turn emergent
chain (slice-1 spec §4); vocabulary grill → deferred per SYNC-DEBT._
