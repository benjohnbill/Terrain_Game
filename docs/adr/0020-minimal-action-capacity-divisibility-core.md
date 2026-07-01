# ADR 0020: Minimal Action-Capacity Divisibility is Core (Amends ADR 0018)

Date: 2026-07-01

Status: Accepted (amends ADR 0018)

## Context

ADR 0018 deferred "the capacity/overclock layer" as the heaviest, least-proven
part, not required to deliver the core fun. A grill-with-docs session on the
payoff loop's skill edge found the opposite for one sliver of it.

The core skill fun (SPEC pillars 2-3) is efficiency against the statistical-
average preset: the recommendation prefills the *average* commitment for a
situation (e.g., "commit 14 to hold this front"), and skill is reading that the
specific situation is below average — 10 holds — committing tighter, and
redirecting the freed capacity (economy, scouting, reserve). Scouting is the
engine of this loop: higher information confidence narrows the estimated-force
band, which shrinks the safety margin you must add, which frees more surplus; the
intel `MAX_CONFIDENCE` 0.90 ceiling leaves an irreducible residual, so every
engagement keeps a real element of risk. This is also what makes deliberately
ceding a low-value region a legitimate play (commit zero, invest elsewhere).

That skill loop requires action-capacity to be a *divisible quantity*. ADR 0018
bundled this thin, core substrate together with the heavy system — four separate
capacities, focus split, carryover/decay, overclock/emergency-mobilization — and
deferred the whole bundle, accidentally deferring the core fun and making it
impossible to design or discuss.

## Decision

Separate action-capacity **divisibility** from the capacity **system**, and treat
the former as MVP core, the latter as still deferred.

- **Core (un-deferred):** a single, no-carryover, divisible action-capacity pool
  per turn. The turn's primary action commits a variable amount of it (the
  recommendation prefills the statistical-average commit); capacity not spent on
  the primary is redirectable (economy, scouting, reserve). This is the concrete
  form of SPEC pillar 2 and the concrete metric for the payoff-loop spec's OPEN
  skill-edge delta ("+X over default" = capacity freed by committing below the
  average).
- **Still deferred (unchanged from ADR 0018):** the four separate capacities
  (command/administration/diplomacy/scholarship), focus split across them,
  carryover with decay, and overclock / emergency mobilization.
- ADR 0018's rationale survives: a single opt-in commit slider does not raise
  *required* interaction complexity (leave it at the prefilled average and play
  the low floor); the heavy multi-capacity system does, and stays deferred.

## Considered Options

- **Keep ADR 0018 as-is (one indivisible action):** rejected — the core skill fun
  cannot exist without divisibility; the MVP would reduce to clicking the
  recommendation, with no skill ceiling.
- **Un-defer the full ADR 0012 capacity system now:** rejected — that is the
  heavy, complexity-raising system ADR 0018 rightly deferred; the skill fun needs
  only single-pool divisibility, and a single pool also removes the need for typed
  capacities in the MVP.

## Consequences

- Amends ADR 0018: its "defer the capacity layer" now means defer the
  four-capacity / carryover / overclock **system**, not capacity divisibility
  itself.
- Refines ADR 0019's stage-1→stage-2 bridge and the DOMAIN_MAP `Situation
  judgment` / `Action capacity` entries: the MVP turn is "one *primary* action
  drawing from a single divisible capacity pool, surplus redirectable," not "one
  indivisible action." Attention > what one turn can act on still holds.
- The concrete mechanism — how the commit level is chosen, the penalty for
  under-committing, where surplus goes, how scouting/confidence sets the
  safe-commit margin, and how deliberate territory sacrifice falls out — is being
  defined in ongoing design (a follow-on ADR/spec), not fixed here.
- Guardrail against scope creep: the MVP pool stays single, no-carryover, with at
  most a small number of surplus outlets; anything heavier is explicitly
  post-MVP.
- Surplus outlets are the friendly-direction operation activities (scouting,
  economy/recovery, defensive build) plus reserve, selected via a single outlet
  control on the command card (ADR 0024). Because the pool is single, surplus can
  go to any of these freely; diplomacy/scholarship are not outlets. When typed
  capacities are later introduced, same-type redirection stays cheap while
  crossing types needs overclock, so this outlet set is a revisit point.
