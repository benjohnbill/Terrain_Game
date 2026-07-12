# War Model Build — Requirements Checklist

**Status:** Spec skeleton SEALED 2026-07-13 (the requirement *list* is a
synthesis of already-sealed docs; the *design* of each item belongs to the
build design sessions that follow). · **L-trust:** L1 (document synthesis).

**Purpose.** The baseline of requirements the real build (game code, `js/`)
must satisfy when it implements Terrain Game's war model — after the L2
combat simulation (`mockup/combat-calc/tournament.js`) is retired. This is
the "what the sealed design already requires" baseline that the R14
war-decisiveness co-analysis (2026-07-13) produced by reading SPEC + DESIGN +
DOMAIN_MAP + feature docs + ADRs across four parallel surveys.

**Why this exists.** R14 diagnosed that the L2 war machine does not deliver
the SPEC "madmovie" (shield-break → decisive battle → cascade): ZERO
annihilations/match, ~77% of wars fizzle to white-peace. The four-survey
synthesis found the fizzle is **not a property of the sealed SPEC war** but of
placeholder / harness-abstraction / bot-policy layers that diverge from the
sealed design. The fix is therefore to build the sealed model, not to keep
tuning L2. This document is that build's requirement spine; ADR 0037 records
the decision; DESIGN-RISKS R14 tracks the risk.

**Reading rule.** Every row points to its *authoritative birthplace* for the
definition/values (single-definition rule). This file is a REFERENCE surface
(a checklist), never a birthplace — it restates nothing normatively.

---

## 1. Requirement checklist

Legend — **fizzle contamination?**: does the L2-vs-sealed gap on this row
materially generate R14's fizzle (77% white-peace, 0 annihilation)?
**Build priority**: P1 = load-bearing for R14 / must land early · P2 =
required but not on the fizzle path · reuse = L2 already implements it
faithfully, carry it over.

### A. How combat is fought (per-turn resolution)

| # | Sealed requirement | Birthplace | L2 today | fizzle? | Build |
|---|---|---|---|---|---|
| A1 | **Defense is per-front-sector, four layers** composed as `garrison(substance) × defenseCommitment(lever) × terrain(mult) × fortification(mult)` | ADR 0022/0031; DOMAIN_MAP Sector defense layers; combat-formula FORMULA D6 | **per-front** aggregate `frontG = sectors×900` — flagged "ABSTRACTION to be replaced" | **YES** (uniformity is the measured freeze driver, +33% decided) | **P1** |
| A2 | **Combat resolves atomically in its turn** — no operation-in-progress spans turns; long campaigns are emergent chains | ADR 0026 | multi-turn siege→field→cascade→capital conveyor accumulating `war.stalled` — **not sealed anywhere; contradicts ADR 0026** | **YES** (2-turn stall exit fires before the decisive battle) | **P1** |
| A3 | Deterministic ratio core `R = attack ÷ defense`, no dice; all uncertainty is fog | combat-formula FORMULA D1/D5 | implemented (`resolve()`) | no | reuse |
| A4 | **Categorical plan-vs-plan (roshambo) layer** required in the combat formula | ADR 0025 (must-eventually-exist) | plan *selection* exists; no categorical interaction layer | maybe | P2 |
| A5 | Under-commit to a contested defense → **immediate front-sector loss** (deliberate sacrifice legitimate) | ADR 0021 | partial | maybe | P2 |

### B. How a war / match is decided

| # | Sealed requirement | Birthplace | L2 today | fizzle? | Build |
|---|---|---|---|---|---|
| B1 | **Match ends at the hegemony decision point** `trip = (leadership OR dominance) AND unassailable` (shield 1.7× + W=6, affordability-bounded) | ADR 0030/0033; match-arc DT-③, ⑨⑪ | faithfully implemented | **NO — works as sealed** | reuse |
| B2 | **A war is decided by field-army destruction** — shield-break (crack fort line → expose field army) → decisive battle → cascade (victory lap) | SPEC:147; DOMAIN_MAP:657 (vocab ❓PROPOSED) | siege-first: the fort wall gates the field battle, so decisive battle rarely fires | YES (bound to A1/A2) | **P1** (+ grill the ❓PROPOSED wording) |
| B3 | **Territory transfers by settlement acceptance arithmetic**, not sector grind (ladder 백지0/관대50/표준75/최대100; ×0.6 continued-war discount; sovereignty premium 0.25) | match-arc ⑧⑫⑬⑭⑯; DOMAIN_MAP Settlement | implemented, but rarely triggers (2.4/match) because wars don't decide upstream | downstream of B2 | reuse (unblocks when B2 does) |
| B4 | **Rout cliff → escape state**: rout ≈ R 1.92; escape OPEN loses 50% of remainder, BLOCKED = annihilation | combat-formula FORMULA D10 | implemented | no | reuse |

### C. How bots fight (AI war behavior)

| # | Sealed requirement / lean | Birthplace | L2 today | fizzle? | Build |
|---|---|---|---|---|---|
| C1 | **War appetite = the opportunism read** — check the ratio against screen + garrison when a rival's field army is pinned on another front (the motion sheet-8 had to hand-script). *Not sealed — SPEC_GAP ①, "B's AI must produce this motion, not a static ratio gate."* | match-arc SPEC_GAP ① (UNDESIGNED, lean only) | static ~1.7 declare gate → symmetric board freezes | **YES** | **P1 (design)** |
| C2 | **Stall→white-peace auto-exit is BOT POLICY ONLY** — an L2 approximation of "when a rational court takes the 0% rung"; **never force-closes a war over a human player** | match-arc CE-⑲ | patience 2 / near-miss R<1.1 → directly generates the 77% white-peace | **YES** (bot artifact) | redesign (meaningless for a human player) |
| C3 | Bot info = contact-gating (only wars factions it has met); walls are public info | fog-of-war-discovery | implemented | no | reuse |
| C4 | Single mobile field army's allocation across simultaneous wars | match-arc SPEC_GAP ② (UNDESIGNED) | 20% screen harness rule | maybe | P2 |

### D. Supporting systems (settlement · occupation · supply · reserve · capital)

| # | Sealed requirement | Birthplace | L2 today | fizzle? | Build |
|---|---|---|---|---|---|
| D1 | **Named-capture id-exact transfer channels**: cession (no-enclave) / white-peace return / limbo (counts for neither) / elimination possessor-keeps (conservation both ways) | ADR 0032; match-arc OG-③ | implemented | no (white-peace *return* is downstream of C2) | reuse |
| D2 | MVP settlement = 3 auto-priced presets (관대/표준/최대); free negotiation + bluffing deferred to Phase 2 | DOMAIN_MAP Settlement | implemented | no | reuse |
| D3 | **Reactive reserve (M9)** — route-connected same-province stock awakens, arrives march-worn ×0.5, stays garrisoned; reserve mass = field-army counter + M9 fill | combat MAGNITUDE M9; force-geography FG-⑤/⑩ | L2 harness (`FG_BOARD_GAAN`) | maybe | P2 (engine adoption) |
| D4 | **Supply starvation** as a standing world rule — staged severity holding → attack-incapable → defenseless; ends when route restored by an action | ADR 0026; DOMAIN_MAP Supply | structure present; stage rates 가안 | maybe | P2 |
| D5 | **Capital = political designation**; guard land-derived (coeff × capital-sector pop) doubling as final-battle stock; capital fall = regime event; rump state impossible by rule | capital CP-① (concept sealed, no wiring) | not wired | maybe | P2 (capital stage ②) |
| D6 | **Uniform integration lag** on all acquired land: usable econ 50% / pop 60%, +10pp per stable uncontested turn; control + route apply immediately | ADR 0029 | implemented | no | reuse |
| D7 | **Terrain → defense**: invariant terrain multiplier (plains 1.0 … pass 2.0 … legendary 2.5), fortification damageable multiplier, water = attacker-side penalty (never a defense mult), frontage caps by terrain/wall class | combat MAGNITUDE M5/M11; ADR 0015; force-geography TC-⑬ | partial (`frontClass`, opt-in) | YES (bound to A1) | **P1** (with A1) |

---

## 2. R14 root-cause summary (fizzle contamination)

The rows marked **YES** are: **A1** (per-front uniform defense), **A2**
(multi-turn siege conveyor vs sealed atomic resolution), **B2** (field-army
destruction pushed behind the fort wall — bound to A1/A2), **C1** (static
declare gate vs the undesigned opportunism read), **C2** (bot-policy
stall→white-peace), **D7** (terrain-into-defense, bound to A1).

Every one is a **placeholder / harness-abstraction / bot-policy** layer —
never a sealed design decision. The sealed model is *innocent* of the fizzle:
the match-decision gate (B1) works exactly as sealed. **Conclusion: build the
sealed model (per-sector terrain-distributed defense + atomic resolution +
opportunism bot) and R14's fizzle is addressed at the source; tuning L2
circles on top of these artifacts.**

## 3. Explicitly undesigned — the build's own design work

These are sealed docs' own "deferred / undesigned / 가안" markers on the
fizzle path or adjacent — each needs its own design pass before or during
build:

- **Bot war appetite — the opportunism read** (SPEC_GAP ①, load-bearing).
- **Categorical plan-vs-plan roshambo** (ADR 0025 must-eventually-exist).
- **Two-front field-army allocation** (SPEC_GAP ②); **front-graph redraw
  after cession** (SPEC_GAP ⑧).
- **Capital stage ②** wiring (guard magnitude, decapitation check, bot
  designation — capital INDEX open-Qs).
- **The ❓PROPOSED war-decision vocabulary** (shield-break / decisive battle /
  cascade) still needs a grill to move AGREED.
- **Numerous 가안 dials**: frontage caps, reserve forced-march/points ratio,
  supply stage rates, occupation resistance 3:1, capLandFrac value.

## 4. What carries over unchanged (build reuses the sealed L2 logic)

A3 (ratio core), B1 (decision gate), B4 (rout/escape), D1 (transfer
channels), D2 (settlement presets), D6 (integration lag), C3 (contact-gating)
— these are faithful implementations of sealed design; the build ports the
*logic*, not the stage-machine scaffolding around it.

## 5. Authoritative sources (pointers, not restatements)

- **SPEC.md** — Match structure (war decided by field-army destruction),
  Core Design Principles, front-sector value profile.
- **DESIGN.md / DOMAIN_MAP.md** — sector defense layers, combat ratio
  grammar, settlement, projectable mass, arc phases.
- **combat-formula** FORMULA / MAGNITUDE — the resolution core + all combat
  dials (M1–M13).
- **force-geography** RULINGS FG-①…⑩ + ADR 0031 — terrain-bound defense +
  reactive reserve (design sealed, engine adoption owed).
- **match-arc** RULINGS — decision gate (⑨⑪ DT-③), settlement ladder
  (⑧⑫⑬⑭⑯), occupation channels (OG-③), SPEC_GAPS ①②④⑧ (undesigned).
- **ADR** 0021/0022/0025/0026/0029/0030/0031/0032/0033 — the record-layer
  decisions; **ADR 0037** — this build direction; **ADR 0028** — the stack.
- **DESIGN-RISKS R14** — the risk this build closes.
