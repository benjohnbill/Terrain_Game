# ADR 0026: One-Shot Plan Effects, Persistent State, and Standing World Rules

Date: 2026-07-02

Status: Accepted — Amended by slice-2 design spec §2 (2026-07-14): the D4
supply-starvation standing rule's staged severity (holding → attack-incapable
→ defenseless) is superseded — starvation is realized on the fatigue supply
ledger as recovery lock + a continuous, convexly accelerating substance-loss
conversion. Substance only: no capability stages — combat incapacity emerges
from shrinking substance, and continuation choices stay with the player.

## Context

The operation-plan catalog work (ADR 0024, 0025) raised how long operations —
sieges, strangle-then-assault chains, encirclements — exist in a
one-primary-action-per-turn model without multi-turn scripted actions
(DOMAIN_MAP: `Atomic turn resolution`). The supply-interdiction design settled
that a route cut is *inflicted state* persisting until repaired, and that a
cut sector keeps degrading without anyone spending capacity. That ongoing
effect needed a formal owner: if the plan itself kept applying its axes each
turn, plans would silently act autonomously across turns (auto-hunt
semantics) and authored axis magnitudes would silently become per-turn rates.

## Decision

Effect ownership is split three ways:

1. **Plans stamp once.** An operation plan's authored effect axes apply
   exactly once, at the resolution of the turn it is issued. The
   march/deploy/search fiction is compressed inside that single resolution.
2. **State persists.** Applied effects are recorded as world state — a cut
   route, damaged fortification, reduced usable value, changed ownership —
   which remains until another action or rule changes it.
3. **Standing world rules tick.** Per-turn world processes read persistent
   state and apply consequences without consuming any faction's action
   capacity. They are authored globally, never per plan.

Phase 1 standing world rules (magnitudes deferred to the combat pass):

- **Usable-value recovery** (existing, ADR 0022): +10 percentage points per
  stable, uncontested turn toward full usable economy/population.
- **Local-garrison regeneration** (existing, ADR 0014/0024 background): a
  sector's garrison regenerates while its economy and population survive.
- **Fog confidence decay** (existing, fog-of-war-discovery design): estimates
  decay when a location is not re-observed.
- **Supply starvation** (new): a sector whose supply/route access is cut
  degrades in staged severity each turn the cut state persists — staged in
  the Unity-of-Command shape (holding → attack-incapable → defenseless)
  rather than as one-shot damage. The tick ends when the route state is
  restored, which is an action (repair, or relief that reopens the route),
  not automatic. Stage count and rates are combat-pass dials constrained by
  the SPEC match envelope.

**Amendment (same day) — surplus vs actions:** removing a stamped state (for
example, repairing a cut route) requires a *primary* action; surplus
redirection only feeds standing flows (accelerating usable-value recovery and
garrison regeneration). "States are changed by actions; surplus feeds flows."
This keeps stamp and unstamp symmetric, and preserves the interdiction duel's
1:1 action economy — a full-turn cut cannot be erased by another turn's
leftovers.

## Considered Options

- **Plan-owned recurring effects** (the plan "keeps working" after its turn):
  rejected — plans become autonomous agents, authored magnitudes silently
  turn into per-turn rates, and the model drifts toward fire-and-forget
  auto-resolution.
- **Presence-based maintenance** (effects last only while a force stays
  committed): rejected for the MVP during the supply-interdiction decision —
  it mortgages the single per-turn action to upkeep and blurs the atomic-turn
  rhythm.
- **One-shot stamps + persistent state + standing rules**: accepted — plans
  stay atomic, time itself does the long-war work, and the enemy's
  counterplay (repair, relief) is a real action with real cost.

## Consequences

- Long operations are emergent and legible: my action stamps a state, the
  world's rules make the state matter each turn, the enemy spends actions to
  remove it. The ADR 0025 capacity duel runs through this loop.
- Turn processing needs a world-rules phase; the 2026-06-29 design's turn
  stages ("income and baseline recovery", "scouting and information updates")
  already reserve this family — starvation joins it.
- Any future ongoing effect must be authored as a standing rule reading
  state, never as a plan that re-applies its axes.
- The combat pass owns starvation stage counts and rates, tuned against the
  match envelope.
