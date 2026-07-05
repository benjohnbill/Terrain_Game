# Feature: Operation Plan Catalog (Seed Content)

## Purpose

Author the concrete operation plans that fill the catalog schema fixed by
ADR 0024. The schema (what an operation plan *is*) is done; this workspace fills
it with real plans and grounds each one in plausible warfare, not abstract
multipliers.

## Status

**Shape pass COMPLETE (2026-07-02): all 12 plans authored at shape level**
(identity, core/secondary/none axes, risk character, availability gates).
Schema fixed (ADR 0024). **Claim blocks COMPLETE (2026-07-05, A-4 B3): all 12
plans carry a claim block** (핵심 이득 / 핵심 대가 / 반목표 조건 + briefing
sentence + off-label cost test; schema in combat-formula MAGNITUDE § Authoring
principle). Off-label test: all 12 pass (none dominated — each plan has a
defining zero or a unique core axis). Remaining: the magnitude pass (relative
calibration with the combat-balancing formula) and ADR promotion once the
shapes have survived a review. Content may still churn at magnitude level.

Authoring method (user-approved): **shape first, magnitude later**. Each plan
first fixes its identity — core axes, deliberate zeros, sibling contrasts, risk
character (`CATALOG.md` § Authoring Method). Exact magnitudes are calibrated in
a later relative pass with the full roster side by side, joined with the
combat-balancing formula.

## Workspace Files

- `CATALOG.md` — the working catalog records (shape pass in progress).
- `RESEARCH.md` — real-war grounding, method observations, open hypotheses.

## Where This Sits

Turn decision ladder (see `DOMAIN_MAP.md` "Turn decision layers"):

1. Situation judgment (province) — where to look.
2. Front-sector focus — the hinge.
3. **Core command — which operation plan.  ← this catalog is the content here.**
4. Fine adjustment — commitment slider + surplus (the skill layer).
5. Resolution (combat) — how the choices become an outcome (separate thread:
   the combat-balancing formula, deferred per ADR 0024).

## Catalog Schema (from ADR 0024)

Each plan is a record with four authored fields:

- `name` — the operational intent label.
- `availabilityConditions` — when the plan appears on the command card (sector
  value profile, status, adjacency/reachability, terrain tags, confidence).
- `effectAxes` — a magnitude per operation effect axis (the six below). Not a
  primary/secondary split; each axis carries its own strength.
- `riskProfile` — the plan's typical risk tolerance.

No authored "target traits" field. Fit is derived by matching `effectAxes`
against the target sector's value profile.

Six effect axes, each mapped to one front-sector element and each bidirectional
(the axis that damages an enemy element builds/recovers a friendly one):

- `controlShift` — controlWeight share / sector ownership.
- `garrisonDamage` — `localGarrison` only (temporary; regenerates while
  economy/population survive).
- `fortificationDamage` — `fortificationDefense`.
- `routeDisruption` — `routeValue` / route access.
- `usableValueDamage` — actively destroys usable economy/population; independent
  of capture; the permanent-weakening path ("burn the base").
- `confidenceGain` — information confidence (fog).

## Roster

Attack:

- [x] Swift Seizure (신속 점령) — *shape complete (template plan); magnitude deferred*
- [x] Deliberate Pressure (신중 압박) — *shape complete; magnitude deferred*
- [x] Flanking Breakthrough (우회 돌파) — *shape complete; kept as one plan*
- [x] Crossing / Landing Securement (도하·상륙 확보) — *shape complete;
  exclusive water-attack grammar; movement-as-fiction, position-as-product*
- [x] Supply Interdiction (보급 차단) — *shape complete; persistent cut,
  repair is an enemy action; rear-access geometric gate*
- [x] Encirclement and Annihilation (포위 섬멸) — *shape complete; chain
  capstone with two-branch isolation gate*
- [x] Raid (약탈) — *shape complete; destruction + skill-bound loot; added
  2026-07-02 from survey convergence*

Non-combat:

- [x] Reconnaissance (정찰) — *shape complete; sector-targeted, sole
  confidenceGain core, risk = opportunity cost*
- [x] Recovery / Consolidation (정비·회복) — *shape complete; multi-core build
  plan; states need actions, surplus feeds flows*

Defense:

- [x] Stronghold Defense (거점 방어) — *shape complete; failure = garrison
  dissolution, population persists*
- [x] Delaying Defense (지연 방어) — *shape complete; resolution-layer bargain
  (cheap contest, no repulsion, erosion)*
- [x] Strategic Abandonment (전략적 포기) + Scorched Earth (청야 소각) —
  *shape complete; free declaration + turn-consuming burn plan; Moscow trap*

## Decisions

- `docs/adr/0024-operation-plan-presets-for-core-commands.md` — the catalog
  schema, six effect axes, bidirectionality, and the attack/defense/non-combat
  unification this content authors into.

## Supporting Context

- `docs/adr/0020-minimal-action-capacity-divisibility-core.md` — commitment and
  surplus, which the combat-balancing thread will convert into applied effect.
- `docs/adr/0021-undercommit-failure-causes-front-sector-loss.md` — under-commit
  on contested defense loses the sector; `riskProfile` must account for this.
- `docs/adr/0022-front-sector-operational-layer.md` — the four sector defense
  layers and value profile the effect axes act on; captured sectors open at
  50%/60% usable value.
- `docs/adr/0023-province-status-and-control-summary.md` — status is derived, so
  no plan authors a status effect directly.
- `docs/adr/0026-one-shot-effects-persistent-state-standing-rules.md` — plans
  stamp state once; standing world rules (supply starvation, usable-value
  recovery, garrison regeneration, confidence decay) read persistent state
  each turn without consuming action capacity.

## Related

- `docs/features/phase-1-fun-core/` — the MVP thrust this catalog serves.

## Open Threads

- Single-survey candidates parked as per-plan materials: mobile defense
  (third defense posture), feint (enemy-facing confidenceGain; standing
  raised by ADR 0025), soften-first bombardment, no-retreat/entrenchment
  modifiers.
- Magnitude pass: exact per-axis strengths, calibrated relatively once several
  plan shapes exist; joined with the combat-balancing formula thread.
- Combat-balancing formula (commitment × plan magnitude × sector defense →
  applied effect and success/failure) — a separate deferred thread. New
  requirement from ADR 0025: must also include attacker-plan × defender-plan
  interaction (the categorical layer of the uncertainty duel), so reading an
  opponent pays off in plan choice, not only commitment sizing. Also owns the
  raid loot conversion dial (fraction of destroyed usable value returned as
  income, optional late-match decay).
- Code rework: current hex-level binary combat (`js/combat.js`, `js/actions.js`)
  is superseded by the sector/six-axis design; rework after seed content and
  the combat formula stabilize (RESEARCH.md code audit).

Settled this pass: `availabilityConditions` gate on physical applicability
only; advisability is expressed through statistical fit ordering and forecast,
never hiding (recorded in ADR 0024).
