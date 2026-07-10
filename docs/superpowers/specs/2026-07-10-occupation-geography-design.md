# Occupation Geography & Sector-Resolution Land Transfer — Design (stage ①)

- **Date:** 2026-07-10 (brainstorm session, all sections user-approved)
- **Status:** APPROVED design — feeds the implementation plan (writing-plans next)
- **Scope:** L2 harness (`mockup/combat-calc/`) world-model upgrade: land transfer
  gains sector identity; military ceiling and income derive from actually-held
  sectors; ripening moves to per-sector usable. Enables a clean re-measurement
  of the conquest-growth question (§5 / DT-②).
- **Supersedes (in part):** the 2026-07-10 conquest-growth engine implementation
  (realm-level accumulator) — see §9.
- **Related:** ADR 0022 (usable ripening), ADR 0029 (drafted: "alive"→"undamaged"),
  design spec `2026-07-10-conquest-growth-engine-design.md` (DT-②),
  `docs/features/capital/` (stage-② concept, this session).

## 1. Problem & evidence

The 2026-07-10 growth sweep (reps=20 × 7 bindings, 3 board arms) showed the flat
`capPerSector` growth dial is **monotonically negative** on every timing-ruler
metric (fgM9off decided 85.2→78.2%, envelope 55.7→48.7% across 0/300/600/1000).
Deep diagnosis: the lost decisions almost all migrate into the `denied-dominant`
bucket (109→372 of 4200), driven by the unassailability coalition term — rivals'
ceiling gains enter the defensive paper-potential sum instantly while the
leader's own gains must be recruited into real force.

Independently, the flat dial is unfaithful to the map: regions carry equal cap
(3,600) over 3–10 sectors, so true per-sector cap value spans 360–1,200 (3.3×).
A flat transfer constant both erases terrain from the growth engine and
contaminates the measurement (user diagnosis, 2026-07-10). Sector-level economy
values span 0.27–2.4 (≈9×) — the same distortion exists on the income side.

Standing principle (user, 2026-07-10, registered in SYNC-DEBT): **L2 implements
everything except the fun only a human can verify.** Which sector transfers on
conquest/cession is deterministic, document-specified behavior (DOMAIN_MAP
cession: "named sectors, ceiling = occupation reach") — it must not be
abstracted to a count.

## 2. Governing principle (SPEC promotion candidate)

> **Geography defines the set of what is possible; judgment chooses within it.**
> Levers, commits, board reading, and information confidence all act on the
> *choosing*; the set itself changes only through world rules (consequences of
> action).

This principle already governs the sealed combat formula (deterministic ratio
core × plan/commit choice), the v5 lens grammar (truth-invariance),
reachable-weakest-link, fog (estimates never alter the set), and settlement
(cession ceiling = occupation reach). This pass extends it to occupation.

**Doc action:** proposed for SPEC Core Design Principles at the next doc-sync
(Tier-3, user approval required; exact wording above).

## 3. World model: holdings become real

Realms carry their **held sector set** (the sector objects the map layer already
provides: id, regionId, populationValue, economyValue, usableEconomy, usablePop).
Two national quantities derive from live holdings:

- **Income** = Σ (economyValue × usableEconomy) over held sectors — always
  (user decision Q5(b): full economy fidelity). Identical to today's value at
  match start (all usable 1.0).
- **Military ceiling** — blended coupling:
  `fieldCap = (1−frac) × startingCap + frac × Σ(capPerPop 600 × populationValue × usablePop)`
  - Dial **`capLandFrac`** (HARNESS 가안, default 0): land–ceiling coupling
    strength. 0 = frozen ceiling (control, world of record until now);
    1.0 = full Model A (ceiling ∝ held land). The dial's meaning is uniform
    across realms and regions — a sector's worth is its own population.
  - Loss is immediate and whole (a sector leaving the set removes its full
    contribution); gains enter lagged via usablePop ripening (§6). Both emerge
    from the derivation — no separate wiring.
- **Register travels with land** (sealed rule, unchanged) — now keyed to the
  actual transferred sectors' population share.
- Sector adjacency graph derived once at board build from hex coordinates
  (deterministic).

## 4. Occupation model: named captures

`war.occupied` (count) becomes `war.occupiedIds` (identities; count preserved
as `.length` for compatibility).

1. **Geography fixes the candidate set (invariant):** frontier = defender-held
   sectors adjacent to (this war's occupied set ∪ the front's border sectors).
2. **Judgment picks within it (variable):** score = **value ÷ resistance**;
   value = populationValue + economyValue; resistance = **3 (border sector) : 1
   (interior)** — a proxy mirroring the sealed garrison start-state
   (900/border-sector vs 300 interior legacy constant). Ties break by sector id
   (deterministic, SPEC #4).
   - **The resistance term is a NEW 가안 (not user-sealed).** Historical
     direction validated (hard shell / soft interior: limitanei ≈2/3 at
     frontiers, Ming nine border garrisons, Imjin 20-day interior collapse,
     Vauban pré carré) — 3:1 is conservative. It is an ordering heuristic
     ONLY: it never enters `resolve()`; actual combat difficulty is already
     carried by real stocks (siege vs 900×sectors + fort vs cascade 500).
   - Hook: replace with real per-sector defense when sector garrisons/forts
     land. Hook: consume fog estimates for the attacker's read of value/
     resistance (reserved; bots read truth for now, current L2 standard).
3. **All bots use the same rule** (world rule, not brain judgment) — clean
   measurement comparability.
4. Emergent: authored gate-cities (high value, first in frontier) draw invasions
   — battle-summoning holds at the occupation layer with no special rule.

## 5. Transfer channels

| Event | Rule |
|---|---|
| Occupation during war (limbo) | Occupied sectors count toward **neither** side's derived quantities — the defender loses them immediately (occupied land pays no taxes), the attacker has not integrated them. Honest form of the current "occupied leaves interior" accounting. |
| Settlement cession | Ceiling = this war's occupiedIds (DOMAIN_MAP: "named sectors, ceiling = occupation reach"). Choice = **value descending + connectivity constraint**: each chosen sector must be adjacent to (winner territory ∪ already chosen). No enclaves by world rule. |
| White peace / stall return | Sectors return to the original owner at their pre-war usable (no new mechanism). |
| Elimination (possessor-keeps, user-sealed) | Each war's occupiedIds go to **that war's attacker** (third-party occupiers keep their bites — currently these evaporate); unoccupied remainder goes to the eliminator. Land conservation holds; the "ceiling without land" reviewer rider dissolves structurally. |
| Loss | Immediate and whole (see §3). |

## 6. Ripening: per-sector usable (ADR 0022 verbatim)

ADR 0022 is sector-scoped at source: newly captured sectors start at **50%
usable economy, 60% usable population, +10pp per stable turn**. The map's
sector fields (`usableEconomy`, `usablePop`) become live state:

- **Acquisition (any channel — cession, elimination share):** usableEconomy
  0.5, usablePop 0.6; ripen +0.10/turn each toward 1.0 in the per-turn
  recovery pulse. Uniform across channels per the ADR 0029 direction:
  cession arrives *undamaged* (no scorch; intrinsic values intact) but the
  integration lag applies to ALL acquired land.
- **One mechanism, both lags:** ceiling lag emerges through usablePop in the
  cap derivation; economy lag through usableEconomy in the income derivation.
  (Yesterday these were two separate wirings.)
- **Two usable layers coexist, different jobs:** sector usable = integration
  lag (new land maturing); realm `r.usable` = war wear (raid damage, 0.3
  floor, usableRecovery pulse) — untouched, multiplicative.
- Per-sector clocks structurally resolve the final-review pooled-flow finding
  (overlapping conquests no longer share one accumulator).

## 7. Capital package (stage ② — concept sealed, NOT in this pass)

Summary + pointer only; authoritative record: `docs/features/capital/`
(INDEX/RULINGS/GLOSSARY, created this session). Concept-sealed items:
designation (player picks one of the seat's main cities at start), land-derived
capital guard (가안 350 × capital sector populationValue; garrison-class,
place-bound, doubles as the final-battle stock), capital fall = regime event
(collapse / forced-vassalage trigger); mobilization-hub buff (×1.25 recruit)
REJECTED as bolted-on; integration-hub deferred. Two-stage wiring principle:
the capital package lands and is measured as its own pass so growth effects
and capital effects never entangle.

## 8. Measurement plan

1. **Re-baseline (mandatory before the sweep):** new world, `capLandFrac 0`,
   3 board arms vs the 2026-07-10 control rows (decided 43.9 / 63.6 / 85.2%).
   The drift quantifies the fidelity upgrade alone; the new control becomes the
   sweep's comparison base.
2. **Sweep:** `capLandFrac 0 / 0.25 / 0.5 / 1.0` × 3 board arms, reps=20 ×
   7 bindings, seed 42 (same instrument as §6/§5 measurements; upgrade the
   `--growth` flag).
3. **Headline metrics now include the deep diagnostics** (standing
   instrumentation, per user request): decided% / envelope(15-25) /
   core(18-22) / median / stomp(≤8) **+ denied-dominant count +
   coalitionOverhang mean (undecided) + elimination/vassalage activity**.
4. **Reading targets:** core1822 up; envelope toward ≥~50%; stomp ~0%;
   fgM9off median not pushed further below core; **does the denied-dominant
   wall re-erect as frac rises?** If yes even in the sector-faithful world,
   that is measured evidence for a dominance-gate recalibration conversation
   (explicitly OUT of this pass; decision taken with data afterward).

## 9. Supersession & known simplifications

**Retired by this design** (from the 2026-07-10 conquest-growth engine):
`applyCapGain` / `ripenCap` / `capPending` / `capRipeFlow` (realm accumulator),
`conquestUsableDrag` (economy lag now emergent), flat `capPerSector`; their 11
tests are replaced by sector-ripening tests. Not waste: the accumulator
validated the ripening arithmetic and the control-gating pattern, and its
measurement exposed the flat-dial distortion that produced this design.
Record supersession in the SDD ledger and the RULINGS entry.

**Known simplifications (register in the L2 fidelity ledger):**
- Cascade fights a flat 500 stock even when the frontier sector chosen is
  another front's border sector (its real 900 garrison lives in that front's
  frontG). The score's resistance term roughly compensates ordering; the
  combat accounting mismatch is a known seam until per-sector garrisons land.
- Resistance 3:1 proxy (see §4) — replace when sector defense is real.
- Fog estimates not consumed by the occupation score (hook comment in code).

## 10. Out of scope (stage ①)

Capital package wiring (stage ②); located capital / decapitation / rump state;
dominance-gate recalibration (measurement-informed, afterward); commit economy /
surge SIZE axis (fidelity grill session); per-sector garrisons & forts;
occupation scorch/devastation; development lever (deferred since §5);
troop-class conversion rules (stationing ③ semantics — capital feature open
question).

## 11. Documentation plan

1. This spec: committed now.
2. RULINGS (match-arc, doc-sync batch): geography-set/judgment-choice principle
   (L0), occupation/cession/elimination rules (L0–L1), per-sector ripening
   migration + accumulator supersession. `capLandFrac` value seal waits for
   measurement (L2 stamp).
3. ADR 0029 ("alive"→"undamaged", uniform integration lag): rides with this
   pass — now structurally implemented; user seal on wording before the
   DOMAIN_MAP edit lands.
4. SPEC Core Design Principles promotion proposal (§2) — Tier-3, user decision
   at doc-sync.
5. Capital feature scaffold: `docs/features/capital/` (this session).
6. SYNC-DEBT: L2 fidelity grill row already registered (7a9aa47); add unpaid
   duties at close.

## 12. Implementation sketch (for writing-plans)

Roughly 5–6 TDD tasks: (1) sector adjacency graph + holdings on board build;
(2) occupation identity (frontier + score, occupiedIds); (3) transfer channels
(cession pick, possessor-keeps elimination, returns, limbo accounting);
(4) derived income + blended cap (`capLandFrac`) + register share;
(5) per-sector ripening + retirement of the accumulator/drag (test migration);
(6) instrument upgrade (deep-metric headline) + re-baseline + sweep.
Control expectation: `capLandFrac 0` is the internal control; byte-identity
with the pre-upgrade world is NOT preserved (user decision Q5(b)) — the
re-baseline step quantifies the difference instead.
