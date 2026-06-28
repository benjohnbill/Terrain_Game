# ADR 0007: Settlement and Function Layer

Date: 2026-06-29

Status: Accepted

## Context

Province archetype regions and terrain layers provide geographic structure and
physical rules, but they do not fully express how people use a region. Strategy
games inspired by Three Kingdoms-style regional identity benefit from cities
and provinces having roles such as capital, market, fortress, port, or frontier
outpost.

The project needs one more lens that creates variety without mixing together
geography, terrain, and human development.

## Decision

Add a settlement/function layer.

Map units and named provinces should be described through three complementary
lenses:

1. province archetype region: broad geographic and historical frame;
2. terrain layer: physical combat, movement, and economic conditions;
3. settlement/function layer: how people use and organize the place.

Initial function categories:

- capital/administrative center;
- commercial city;
- agricultural center;
- military base;
- fortress pass;
- port city;
- mining/workshop district;
- scholarly/religious center;
- frontier settlement.

Each province should normally have one primary function and optionally one
secondary function. Avoid attaching every possible role to a single province.

## Consequences

The design can create rich but legible combinations such as:

- Central Plains + plains + administrative center;
- Guanzhong Passes + mountain/pass + fortress pass;
- Jiangnan Grain Belt + grain basin/river + agricultural center;
- Southeastern Coast and Straits + coast/strait + port city;
- Northwestern Oasis and Desert Corridor + frontier basin + commercial city.

With 12 archetype regions, 7 terrain categories, and 9 function categories, the
theoretical combination space is 756. The actual authored map should only use
plausible combinations, likely far fewer than the theoretical maximum.

The function layer should later support economy, recruitment, unrest, events,
diplomacy, and AI priorities.
