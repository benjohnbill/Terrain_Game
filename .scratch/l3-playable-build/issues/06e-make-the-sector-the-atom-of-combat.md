---
type: task
status: resolved
blocked_by: [06c]
---

# 06e — Make the Sector the Atom of Combat

> **Migrated to front matter 2026-08-03** (ticket 14 R3). The old
> header lines carried prose that the schema moves off the status line:
>
> - **status was:** **resolved** (created and landed 2026-07-31 — zero unlanded values; see
> - **blocked-by line was:** 06c — every item here consumes the engagement adapter it landed.

**What to build:** an engagement is sited wherever a hostile force stands, it is
fought on the ground that sector actually carries, the approach it was reached by is
recorded, and the chips it receives are keyed to it. This is the ticket that makes
ticket 07 reachable: without it a battle can only occur at an authored region
border, and **41 of 45** drawn capitals can be walked to with zero battles.

**Blocks:** 06d (capturing an interior sector requires an engagement to have been
sited there) and therefore 07.

§ Needs-info)

Specification gates: none outstanding. The geography-battle grill closed them.
Authority: **ADR 0046** (§ Decision items 1–5) · terrain-cradle **TC-⑮** (the
`terrainLayer` → M5 binding, and TC-⑬'s surviving crossing column) ·
war-model-build **WM-⑤** (rout displacement) · combat-formula **M5** (every terrain
value, cited never restated) · **ADR 0032** (the front sector is the operational
atom) · **ADR 0015** (the crossing prices the engagement, not the march) ·
`DOMAIN_MAP.md` § Design Principle `Hex is physical, sector is decisional`.
Session record: `.context/record-geography-battle-grill-2026-07-29.md`.

- [x] **An engagement is sited wherever a hostile force stands.** `engagementsOf`'s
      candidate sites stop being seeded from `contestedFronts`. The predicate is a
      sector predicate — an invading force standing on ground it does not hold — and
      resolution stays **atomic per sector**, unchanged from 06c. Note what is
      already correct and must not be "fixed": `engagement.ts`'s header already says
      the unit of resolution is the sector, and `engagementsOf` already fires on
      presence (`standing.sides[invader].men > 0`). Only the seed changes.
- [x] **A `Front` remains an authored edge and keeps its own job.** Fronts still
      exist for territory reading, projection, and the fog surface; what they stop
      being is the gate on where combat may occur. `contestedFronts` is not deleted.
- [x] **A sector's defensive terrain is its own** (TC-⑮). The `terrainLayer` → M5
      binding is a table over the seven authored layers; **every value is cited from
      M5** and appears nowhere else in code. An unknown layer **throws**, following
      06c's precedent for `fortTier` — a silent ×1.0 is exactly the failure that
      would hide a missing rung.
- [x] **The door contributes attacker-side terms only.** TC-⑬'s crossing column
      stands: a river door still supplies `riverOpposed`, a strait `straitOpposed`,
      and ADR 0015 keeps that out of 06a's movement graph. A regression test pins
      that a river-door battle is **numerically unchanged** by this ticket
      (1,800 v 900 → R 1.40 before and after).
- [x] **Passes become asymmetric, and a test says so.** 관중's three `mountain`
      sectors are exactly its three pass endpoints (`r6_s0`, `r6_s3`, `r6_s5`); they
      defend at M5's `Mountains` rung while the plains/desert sectors on the far side
      defend at `Plains`. Pin the pair — 1,800 v 900 gives R 1.33 defending `r6_s5`
      and R 2.00 defending `r1_s0` — because a symmetric result means the door is
      still supplying terrain.
- [x] **The approach is recorded as the traversed hex arc** (`{fromHex, toHex}`), a
      value movement already computes. Today the only read is "which authored door,
      if any, did this arc cross"; the arc is carried at hex grain because that is
      the seat for directional terrain later (river current, ravine axis). Do **not**
      add any read beyond the door projection — the reachable-weakest-link-over-
      approaches rule is **retired** (TC-⑮), and re-deriving it is the specific
      mistake this ticket exists to prevent.
- [x] **TC-⑬'s reachable-weakest-link still picks among doors.** When one sector is
      served by several authored borders, the softest crossing still wins. 06c's
      `softestClass` and its cited `CLASS_DEFENSE_RANK` ordering (including the
      pass/strait pair a derived order gets wrong) survive unchanged — keep its test.
- [x] **Commit is allocated per sector.** `Allocations` keys on the sector.
      06c's reconciliation for ticket 03's case 4 (two fronts pouring chips into one
      sector) is **deleted, not adapted** — it exists only because the key was the
      front. Preserve: the stack is one pool of 20, non-hoardable, shared across every
      order kind, and the order-key namespace already mixes kinds
      (`recruitmentOrderKeyOf` → `ORDER_RECRUIT:<id>`), so assert sector ids cannot
      collide with it.
- [x] **The commit key change is a public contract change.** It reaches `preview`,
      the UI's allocation surface, and `FrontAssignments`. Both callers must move
      together — `commitment.ts`'s whole point is that the Runtime and `preview`
      cannot drift into telling the player different things.
- [x] **Rout displacement per WM-⑤.** Anyone with an approach arc falls back along it
      one sector; anyone without one leaves service and stays on the register. The
      axis is **who entered this sector this turn**, not attacker/defender: a
      reinforcing defender has an arc, and a **garrison never does** (06b —
      `GarrisonForce` carries no wear ledger). Garrison-only defence is the common
      case on this board, so the no-arc branch is the main path.
- [x] **`escaped` gains its consumer.** It is `battle.ts`'s open-escape survivor
      count and had none, which is why a routed force stood on the hex it lost.
      Leaving service must decrement `serving` **without** touching the register —
      the opposite of 06c item 11's casualty path, which removes the dead from the
      register permanently. State the two laws separately and test them separately;
      06d's ticket makes the same point about transfer versus casualties.
- [x] **Fall-back must not become a free move.** A displaced force pays what R12
      prices movement at, or the displacement is a teleport. If the arc's origin is no
      longer a legal destination, the force leaves service — do not invent a second
      destination rule.
- [x] **Cross-host determinism holds.** Canonical sector order fixes the *report*,
      not the arithmetic (06c). Extend the replay fixture so an **interior** sector is
      fought over and a rout is displaced, and assert Node and browser produce
      identical projections — the arithmetic must cross `submit()` the way 06c's
      contact phase does.
- [x] **New events, if any, cost five edits.** A new public event must be whitelisted
      in `Runtime.#globallySafeResolutionEvents` **and** `game/acceptance/replay.js`'s
      `GLOBALLY_SAFE_EVENT_TYPES`, and four tests assert the exact event and tier
      lists (`turn-loop.test.js` ×2, `tests/browser/boot.spec.js` ×2). A rout's
      *occurrence* may cross `submit()`; its numbers stay behind `view(actor)`.
- [x] **Two stale code comments are corrected as part of this ticket's surface, if
      the doc batch has not already done it.** `economy.ts`'s `holdsOf` and
      `state.ts`'s `homeland` describe conquest conversion as unanswered; **ADR 0044
      answered it**, hours after those comments landed. See `docs/SYNC-DEBT.md`.
- [x] Baseline is not regressed: `npm run verify:game` (all lanes PASS, parity
      PENDING by design), root `npm test`, `npm run lint:docs` 0 blocking.

## Needs-info — none (2026-07-31)

Zero unlanded values. TC-⑮'s table is **AGREED / 가안 / L0** with every value cited
from M5, which is a sealed row and not a value this ticket originates. WM-⑤ is
sealed. ADR 0046 items 1, 3 and 4 are rules, not dials.

**Explicitly forbidden ground** — each of these is registered elsewhere and
building it here would originate a rule:

- **Frontage / 문폭.** Do not read `choke.cap` (a stale `Projectable mass` field, ⛔
  under ADR 0042) or `Edge.frontageHexes`. M11's cap values exist but the whole
  question moved to `.scratch/operational-manoeuvre/`.
- **Interception of a force in transit** (R14). An army still walks through ground it
  does not hold without stopping or fighting. That is the registered gap, and it is
  why a frontage cap would be inert.
- **Encirclement.** `escape` stays the named constant 06c planted. D10 designs the
  isolated-rout multiplier and Part 2 #2 owns its threshold.
- **The military/civilian fraction of rout survivors.** WM-⑤ rules that all of them
  leave service; a fraction needs a destination that does not exist, and morale is
  parked by R13.
- **Anything that lets the approach modify the defender's ground.** Retired by TC-⑮.
  The operational-manoeuvre pass may add it back through the amendment protocol; this
  ticket may not.
- **Supply.** Uniform by scope (06b, R16).

## Comments

### Implementation evidence — 2026-07-31

- Commit: `b591f4e` (branch `l3/ticket-06e-sector-atom`, cut from `1319b8c`)
- Production authority: `docs/adr/0046-the-sector-is-the-atom-of-combat.md`
  § Decision 1–5 · `docs/features/terrain-cradle/RULINGS.md` TC-⑮ (and TC-⑬'s
  surviving crossing column) · `docs/features/war-model-build/RULINGS.md` WM-⑤ ·
  `docs/features/combat-formula/MAGNITUDE.md` M5 (every terrain value cited,
  none restated) · ADR 0032 · ADR 0015 · `DECISIONS-OWED.md` R12 (movement is
  priced in turns and fatigue, never commit)
- Narrow tests: `node --test game/tests/battle-wiring.test.js` 23 pass —
  interior siting, the presence predicate, unowned ground, the TC-⑮ layer
  table, world-wide terrain uniformity, the 관중 pass asymmetry (R 1.33 v 2.00),
  the unchanged river door (R 1.40), both unbound-rung refusals, and the two
  rout branches. `node --test game/tests/turn-loop.test.js` 26 pass.
- Shared gates: `npm run verify:game` — typecheck / build:runtime /
  build:viewer / test:node / test:browser all **PASS**, parity **PENDING by
  design** (gate 10 owns the threshold), both hosts `29f214a11fc56ef8`, exit 2.
  `test:node` **217** (was 206), `test:browser` **21**. Root `npm test`
  **562/562**. `npm run lint:docs` **0 blocking / 12 advisory** (11 pre-existing
  plus one `main` added at `a0e0e3b`; the `conquest damage` row remains the
  verified-spurious advisory that must stay standing).
- Browser/runtime check: `game/tests/browser/boot.spec.js` and `viewer.spec.js`
  against the built viewer; world `terrain-cradle@r1`, replay seed
  `browser-lane-0001`, parity seed `parity-fixture-0001`. The replay fixture
  gained a **rout phase** and an **interior phase**, so both cross `submit()`
  rather than living only in a unit test; the fixture verifies its own subject
  (it throws if the forlorn hope leaves service or stays where it broke).
- Legacy evidence disposition: **accepted, re-implemented from contract.**
  `CLASS_DEFENSE_RANK`'s ordering stays cited from the 2026-07-08 fidelity seal
  as exercised in `mockup/combat-calc/map-board.js`; no archive file was read as
  a parity comparator.
- Follow-up: none owed by this ticket. Two readings are recorded rather than
  hidden — see § Reading the seams, below.

### Reading the seams — 2026-07-31

Two places where the authority admitted more than one implementation. Both were
resolved toward the least origination, and both are recorded so a later pass
re-decides rather than rediscovers.

1. **What the door's crossing ranges over.** ADR 0046 item 3 says the arc's only
   read is "which authored door, if any, did this arc cross", while the ticket
   says `softestClass` survives *unchanged* and ranges over the doors serving the
   sector. These differ for an attacker who reaches a river-door sector by an
   undoored neighbour. Implemented as the **ticket's** reading — the crossing is
   the softest of the sector's own contested doors, and an interior sector has
   none — because the other reading is a term selected by approach, which the
   forbidden-scope list names by name. The arc's door projection therefore has
   no consumer today; its consumers are the rout fall-back and the directional
   terrain the arc is the seat for.
2. **Which sectors a realm may pour chips onto.** The front-keyed predecessor
   asked whether the realm was a party to the border. In a two-seat duel that
   test has no sector-grain successor — a realm either holds a sector and may
   defend it, or does not and may invade it — so the legality check is now
   "names a sector of this world". Narrowing it by reach or by proximity to a
   border would be a rule nobody sealed.

### Why this is a separate ticket — 2026-07-31

Rulings 1–4 of ADR 0046 plus WM-⑤ needed an implementation home and no existing
ticket had one: 06d's seventeen checkboxes contain none of them, yet 06d cannot
capture an interior sector until siting exists. Folding them into 06d was rejected
because 06d already modifies ticket 05's landed code across seventeen items, and
"capture" is a different subject from "atom". The user approved a new ticket
2026-07-31.
