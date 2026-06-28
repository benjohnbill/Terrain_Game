# ADR 0009: Force Roles and Mobilization Risks

Date: 2026-06-29

Status: Accepted

## Context

The original prototype uses a broad faction military value. This makes strong
states powerful on every front at once and contributes to military snowballing.

The desired Phase 1 model should make war depend on where force is stationed,
what can be mobilized, and what risks mobilization creates for population and
economy.

## Decision

Use functional military roles rather than a single global military number.

Phase 1 design should distinguish four force roles:

1. Standing forces.
2. Local garrisons.
3. Offensive mobilization.
4. Local defense / latent mobilizable population.

Attacks should be standing-force centered. Offensive mobilization can support
attacks, but it should be less efficient and riskier than using trained
standing forces.

Defense should combine local garrison and local defense support. Latent
mobilizable population remains an economic population in peacetime but can
become local defense, levy, resistance, or rebellion force under pressure.

## Role Definitions

### Standing Forces

Professional or maintained troops that can be directly commanded.

Uses:

- main attack force;
- strategic movement;
- critical defense;
- AI war confidence.

Risks:

- high upkeep;
- economic pressure when oversized;
- slower recovery after defeat;
- cannot defend every front if concentrated elsewhere.

### Local Garrisons

Troops tied to a province or map unit.

Uses:

- default local defense;
- fortress, pass, and city defense;
- occupation control.

Risks:

- limited mobility;
- local economic burden if excessive;
- can be isolated, depleted, or forced to surrender;
- strengthens defense but not overall offensive flexibility.

### Offensive Mobilization

Temporary support force used to enlarge an attack.

Uses:

- supplement standing forces in invasions and sieges;
- exploit nearby population and military infrastructure;
- provide emergency numbers at real cost.

Risks:

- losses translate into population and economy damage;
- long mobilization reduces tax, food, and growth;
- defeat can create future unrest or rebellion hooks;
- overuse can make victory strategically costly.

### Local Defense / Latent Mobilizable Population

Non-military population such as farmers, fishers, miners, and craftsmen that
can become defense, resistance, levy, or revolt force under pressure.

Uses:

- automatic defensive support during invasion;
- occupation resistance;
- rebellion or militia events;
- future naval/coastal defense hooks.

Risks:

- production loss when mobilized;
- population and economic damage from battle;
- coercive mobilization creates unrest hooks;
- plundered or abused populations may resist the occupier.

## Consequences

The game can model why aggressive conquest is costly even when battles are won.

Population and economy become military foundations without turning directly
into free global troops.

Turn structure becomes a core design concern because mobilization, deployment,
upkeep, recovery, and risk must happen at clear moments.
