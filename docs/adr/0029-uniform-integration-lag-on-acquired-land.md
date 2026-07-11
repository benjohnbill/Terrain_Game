# ADR 0029: Uniform Integration Lag on Acquired Land (amends ADR 0022)

Status: Accepted (sealed 2026-07-11)
Date: 2026-07-10
Amends: ADR 0022 (front-sector operational layer — usable-value placeholders)

## Context

ADR 0022 sealed usable-value ripening for newly captured sectors (economy
starts 50% usable, population 60%, +10pp per stable turn). The DOMAIN_MAP
`Settlement` entry, however, carried an exception: settlement territory
"arrives *alive* (undamaged usable value)". Read literally, settled land
skips the integration lag entirely.

The §5 conquest growth engine (DT-②) made the conflict load-bearing: the
military ceiling now derives from usable population (ripening via
capPending/capRipeFlow), so "alive" cession would mean instantly usable
ceiling from negotiated land — contradicting ADR 0022, the contestability
guardrail (the ~4-turn ripening transient is the counterattack window),
and DT-②'s Model A.

## Decision

Narrow "alive" to **undamaged**:

- Settlement cession arrives **undamaged** — no scorch, no conquest damage,
  no M6 inheritance cost. That is the surplus settlement trades on.
- The **integration lag applies uniformly to ALL acquired land** — conquered,
  ceded, or inherited. New land's productivity (yield AND military ceiling)
  starts at the ADR 0022 usable fractions and ripens +10pp per stable turn.
- Settling stays incentivized by the avoided grind (blood + turns + damage),
  not by skipping integration.

## Consequences

- DOMAIN_MAP `Settlement` entry rewording (the "arrives alive" sentence):
  "Settlement territory arrives *undamaged* (no scorch or conquest damage,
  vs conquest damage + M6 inheritance cost) but integrates on the same
  usable-ripening lag as all acquired land; the saved friction is the trade
  surplus, split naturally (no discount dial)."
- ADR 0022 header gains: `Amended by ADR-0029 (2026-07-10)` + one-line delta
  ("integration lag explicitly uniform across settlement cession too").
- L2 evidence note: the ripening engine is implemented and measured
  (2026-07-10 growth sweep); ceiling-growth magnitudes remain HARNESS gaan,
  unsealed — the lag-uniformity principle here is independent of those dials.

Implementation note (2026-07-11): per-sector usable ripening (occupation
geography stage ①, ADR 0032) now carries the lag — the pooled
capPending/capRipeFlow accumulator named in Context was retired the same
day; the decision is mechanism-independent.
