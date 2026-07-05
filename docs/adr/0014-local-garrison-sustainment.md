# ADR 0014: Local Garrison Sustainment From Province Economy

Date: 2026-06-29

Status: Accepted
Amended by: ADR 0022 (2026-07-01) — local-garrison sustainment is now scoped to the front-sector operational layer; province economy becomes an aggregate/readout over its sectors (see § Consequences).

## Context

ADR 0009 split military strength into functional roles, including local
garrisons tied to a specific province or map unit. It did not specify how a
garrison is sustained economically. DOMAIN_MAP left this open: whether a local
garrison is recruited from population, paid from the treasury, or both.

The choice directly affects the Phase 1 goal of removing the global-strength
snowball described in SPEC.md. If every garrison is funded from one central
treasury, a wealthy faction can again be strong on every front at once, which is
the exact failure mode Phase 1 is meant to fix.

## Decision

Local garrisons are sustained by their own province's economy and population,
not by the national treasury. Standing forces carry national upkeep paid from
the treasury.

ADR 0022 later introduced front sectors as the MVP territorial ownership and
one-turn operational unit. Under that model, the local-garrison sustainment
principle attaches to the front sector: sector economy and population sustain
the sector's local garrison, while province economy is an aggregate/readout over
its sectors.

This means:

- garrison strength is bounded by local province economy and population, so it
  cannot be freely projected everywhere at once;
- a faction's ability to hold many fronts depends on the value of each province,
  not on a single national pool;
- standing forces remain the mobile, nationally funded arm used for attack,
  strategic movement, and critical defense, consistent with ADR 0009;
- the model creates a deliberate tradeoff: rich provinces defend themselves
  well, while poor or newly conquered provinces stay vulnerable until developed.

## Consequences

- Province data must expose economy and population weights sufficient to derive
  a sustainable garrison ceiling. These already exist as `economyWeight`,
  `populationWeight`, and `garrisonWeight` in `js/province-data.js`.
- The future combat and economy slice must compute garrison upkeep and
  reinforcement against local province output, not the treasury.
- This reinforces ADR 0009 and the anti-snowball goal without adding the
  domestic-governance depth reserved for later phases (ADR 0008).
