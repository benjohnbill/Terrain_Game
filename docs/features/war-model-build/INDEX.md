# War Model Build — Feature Index

**Status:** OPENED 2026-07-13 (R14 war-decisiveness co-analysis). Spec
skeleton sealed; design not yet started. L2 combat simulation slated for
retirement.

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
  its war-model half); crisis PARKED row.

## Open questions (for the build design sessions)

1. **What first, and on which stack?** (ADR 0028 — UI-shell/renderer axis;
   sequencing the P1 rows A1/A2/B2/C1/D7 into a first buildable slice.)
2. **The opportunism read (C1)** — how a bot reads a pinned rival's exposed
   front and commits; the load-bearing undesigned piece.
3. **Atomic resolution vs the war spine (A2 × B2)** — how "shield-break →
   decisive battle → cascade" expresses inside ADR 0026's one-turn atomic
   resolution (emergent chain, not a scripted multi-turn machine); grill the
   ❓PROPOSED vocabulary to AGREED.
4. **Per-sector defense (A1/D7)** — porting force-geography's terrain-bound
   defense + reactive reserve from `FG_BOARD_GAAN` into the real map's
   per-sector four-layer stack.
5. **Where the crisis re-enters** — as a lean turn-30 backstop (AB-③
   sudden-death framing) once decisive war is the default.
