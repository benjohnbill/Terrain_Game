# 1v1 Duel Pivot — Founding Premises

Label: wayfinder:duel-pivot
Status: premises locked 2026-07-23 (user); formal Wayfinder draft pending
Relationship: subsumes the "war-termination pass" long pole (see Context)

## Context

The L3 war-termination pass was opened to answer DESIGN-RISKS R14: wars fizzle,
metric 5 measured ~68.7% no-material-outcome, decided% 0.000, ~18.2% wars that
never end. It resolved not by tuning bot stall but by a structural decision the
user reached 2026-07-23: **the game is a two-realm 1v1 duel, and a match is won
by capturing the enemy capital.**

Six independent lines converged on 1v1: the game's poker DNA (uncertainty duel +
commit + recon), five research surveys (mainline 4X, Paradox grand strategy,
casual/board conquest, 1v1 head-to-head, the three-player problem — FFA's three
pathologies are multiplayer-only; Polytopia "Might" is literal capital-fall;
fog structurally substitutes for alliance-politics depth), the product
constraints (casual 15–30 min, a chess.com-shaped subscription platform,
mobile + webview), a map-variation measurement, the BM cousin (poker solver =
judgment coach), and F2P liquidity economics. A three-faction (Three-Kingdoms)
structure was rejected as the kingmaking worst case; ROTK itself is a
many-warlord game, not a 3-player one.

This is a SPEC-identity change. Before the formal Wayfinder 1v1 draft opens,
these three premises are locked as the ground it stands on. The draft does not
re-litigate them.

## Premise 1 — Charter (what the draft may not re-open)

- Exactly two realms; the game is a head-to-head duel. Player count is decided,
  not a draft question.
- Victory = capital fall: capturing the enemy realm's capital wins the match.
  The draft designs the HOW (what a capital is, how it falls, early-rush
  guards), never the WHETHER.
- War and match are one: a match is a single sustained duel, not a multi-war
  arc; there is no separate hegemony-settlement match-terminus.
- Superseded, not narrowed: the multi-realm victory model — hegemony decision
  point, dominance, coalition unassailability (ADR 0030/0033) — is replaced.

## Premise 2 — Boundary (what the draft may not touch; its scope)

- **Combat/operational engine is FIXED and out of scope:** slice-1 decisive
  battle, slice-2 fatigue / movement / supply / field-army division / commit
  budget / intel, combat-formula (R-ratio, magnitude, matchup),
  operation-plan-catalog, the fog presentation contract, and the realm-internal
  economy (aging constitution, conscription register, recruitment). The
  blast-radius survey verified these are force-count-independent and survive
  intact. The draft touches only the MATCH FRAME above combat.
- **Opponent-agnostic:** capital-fall victory is identical whether the opponent
  is a bot or a human. PvE-primary, bot-archetype-as-content, and the
  subscription BM stay PARKED and do not enter this draft.
- **Map is PARALLEL:** the draft designs on an abstract board (a capital exists,
  fronts exist, reach/distance matters). The concrete 1v1 map — single vs pool,
  its shape — is a separate pass, not a blocking input. (The current
  terrain-cradle is a 5–6-seat multipolar map and is not the 1v1 board.)
- **Draft scope = the 1v1 match frame:** victory + war/match termination +
  draw/timeout handling + crisis fate. (Map parallel; combat fixed.)

## Premise 3 — Governance (what the draft triggers; its authority)

- **Mandatory-ADR trigger** (documentation law): a new victory-condition ADR
  lands in the same batch and, per the supersession protocol, supersedes ADR
  0030 (+0033) and the crisis stack (0034/0035/0036), amends 0037/0038,
  stale-stamps 0031/0032.
- **SPEC is Direction:** the ~11 contradictions become a single user-approved
  amendment PROPOSAL; the draft never drifts SPEC.
- **Birthplace:** the victory condition's new seal home is
  `docs/features/capital/` (CP-①). Superseded match-arc seals are stamped, not
  silently edited.
- **Autonomy line:** Projection (DOMAIN_MAP/DESIGN, ~22 rows) and Record stamps
  are the draft's autonomous doc-sync; each design decision is user-sealed, one
  question at a time (the Wayfinder rules that were never overridden).

## Appendix — Blast-radius inventory (evidence; the seal work-list)

Three read-only layer surveys, 2026-07-23. Headline: the combat engine survives
whole; the multi-realm victory machinery goes stale; the expensive rework is
concentrated in match-arc plus a re-authored 1v1 map.

**Record (ADR) — 9 of 41 affected**
- SUPERSEDE (5): 0030 hegemony (keystone), 0033 affordability bound,
  0034/0035/0036 crisis-ending stack.
- AMEND (2): 0037 war-model build direction; 0038 war-ending composite (capital
  fall promoted from backstop → primary win — the seam that absorbs the change).
- STALE-STAMP (2): 0031 force-geography defense, 0032 occupation geography.
- Survivors (checked): 0025 (uncertainty duel — becomes literal), 0026, 0019,
  0021, 0022, 0023, 0016/0028/0039/0040/0041.

**Direction (SPEC) — user-approved proposal**
- 11 contradictions (Core Principle #5 termination, realm-count 4–6, multipolar
  geometry, hegemony-settlement end, dominance, crisis-arc / Westphalian draw,
  Phase-2 diplomacy, …).
- 4 sharpenings/narrowed (Principle #2 uncertainty duel becomes literal, LoL
  positioning, Goal, Core Gameplay Promise).

**Projection (DESIGN/DOMAIN_MAP) — doc-sync ~22 rows**
- DESIGN 2 + DOMAIN_MAP 20, including 8 term-definitions embedding a multi-realm
  assumption: decision point, hegemony decision point, hermit clause, vassalage,
  and winning-archetypes 복속 사슬형 / 어부지리형 / 약탈 소모형 / 중원 내선형.

**Production (feature docs) — epicenter = match-arc**
- STALE seals: hegemony decision point, DT-③ dominance, hermit clause,
  vassalage-as-currency, ET-① ending taxonomy, frame decision (realm 4–6,
  multipolar map), crisis CE-①…⑳.
- SURVIVE (realm-internal): aging constitution, conscription register,
  mobilization, surge recruitment; occupation-geography (minus third-party
  branches); combat terms.
- war-model-build: B1 "hegemony gate works as sealed → reuse" verdict is now
  FALSE; §5 / ADR 0038 capital-fall path absorbs the change; D5 capital promoted
  from P2 support to the primary win condition (currently unwired).
- `capital/` (CP-①) becomes the victory condition's birthplace.

**Combat-survival verification: TRUE** — slice-1/slice-2 mechanics are
force-count-independent and port to 1v1 unchanged.

**Two consequences the user weighed**
1. The crisis system (CE-①…⑳ + ADR 0034/0035/0036) dissolves — it existed only
   to end matches the hegemony gate never tripped; capital fall removes its
   reason to exist. Built + parked work is retired, and the "someday-backstop"
   debt clears with it.
2. The authored world (terrain-cradle) is a 5–6-seat multipolar map and needs
   re-authoring for 1v1; the grid (TC-⑪) stays frozen, and new worlds are added
   as gate-06 artifacts (no seal broken).
