# ADR 0032: Sector-Resolution Occupation Geography — The L2 World Model

Date: 2026-07-11

Status: Accepted
Supersedes (in part): the 2026-07-10 conquest-growth engine implementation
(realm-level accumulator — applyCapGain/ripenCap/capPending/capRipeFlow,
conquestUsableDrag, flat capPerSector). The implementation is retired; the
DT-② intent (positive-sum growth divergence) stands unchanged.
Decision source: occupation-geography design spec
`docs/superpowers/specs/2026-07-10-occupation-geography-design.md` (12
sections, user-approved section-by-section 2026-07-10) + match-arc RULINGS
OG-①…⑤ (stage ① landed on main 2a9d8f3..9a64561, 238/238 green; v2 seal
run 2026-07-11).

## Context

The 2026-07-10 growth sweep showed the flat `capPerSector` growth dial was
monotonically negative on every timing-ruler metric, and — independently —
unfaithful to the map: per-sector cap value spans 3.3× and sector economy
9× by geography, so counting sectors instead of naming them both erased
terrain from the growth engine and contaminated the measurement. DOMAIN_MAP
already defines the cession currency as "named sectors"; the L2 harness
abstracting that to a count violated the standing fidelity principle ("L2
implements everything except the fun only a human can verify").

## Decision

The L2 tournament world model gains sector resolution end to end:

- **Sector world**: map boards build a shared world of live sector copies
  with hex-derived adjacency and a static seat-border set.
- **Named occupation**: captures carry sector identity (`war.occupiedIds`);
  geography fixes the candidate set (occupation frontier = adjacency from
  the occupied set ∪ the front border), a value ÷ resistance score orders
  the pick (border 3 : interior 1 — a 가안 ordering proxy that never enters
  `resolve()`); all bots use the same rule (world rule, not brain judgment).
- **Id-exact transfer channels**: cession picks value-descending under a
  connectivity/no-enclave constraint; stall and white-peace return the same
  ids; elimination is possessor-keeps (each war's occupier keeps its bites,
  and conservation holds both ways — a dead attacker's bites return to
  their defenders, a dead third-party attacker's bites flow to the
  eliminator; nothing is silently discarded).
- **Holdings-derived income and ceiling**: income and the military ceiling
  derive from actually-held sectors (limbo — occupied-untransferred land —
  pays neither side); the land–ceiling coupling is the blend dial
  `capLandFrac`, and **0 (frozen control) is sealed as the world of
  record** (L2, RULINGS OG-⑤).
- **Per-sector ripening**: ADR 0022's usable ripening (as made uniform by
  ADR 0029) runs as per-sector state; the realm-level accumulator and drag
  are retired.
- **Interior redefinition**: `interior` = holds minus hex-derived
  `world.borderIds` (was a curated per-region border count) — covered by
  design Q5(b): byte-identity with the pre-upgrade world is deliberately
  NOT preserved; the frac-0 re-baseline quantifies the drift bundle.
- **SPEC promotion (mandatory-ADR-trigger duty)**: the governing principle
  — *geography defines the set of what is possible; judgment chooses within
  it* — is promoted to SPEC Core Design Principles (#9) in this batch,
  wording from design spec §2, user-approved 2026-07-11.

## Rejected alternatives

Recorded per-ruling in match-arc `RULINGS.md` OG-①…⑤ (including keeping the
flat count-based transfer and adopting the land-ceiling coupling at any
magnitude — the frac sweep re-erected the denied-dominant wall).

## Consequences

- The 2026-07-10 pre-upgrade L2 records are no longer directly comparable:
  any future `--fg` or growth comparison against them must note the fidelity
  drift (re-baselined 2026-07-11, RULINGS OG-⑤).
- The measured frac sweep re-erects the §5 unassailability wall
  (denied-dominant rises monotonically with frac) as a clean causal read;
  the fgM9on reserve arm absorbs it — both findings feed a future
  dominance-gate recalibration grill (explicitly out of this pass).
- Resistance 3:1 and the ripening floors remain HARNESS 가안 (reconsider
  triggers unchanged); capital package wiring is stage ②
  (`docs/features/capital/`).

## Authoritative homes

- Rulings, measured values, and riders: match-arc `RULINGS.md` OG-①…⑤;
  terms in match-arc `GLOSSARY.md`.
- Design and implementation record: the design spec above + plan
  `docs/superpowers/plans/2026-07-10-occupation-geography.md`.
