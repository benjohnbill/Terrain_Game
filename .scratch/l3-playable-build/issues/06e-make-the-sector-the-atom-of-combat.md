# 06e — Make the Sector the Atom of Combat

**What to build:** an engagement is sited wherever a hostile force stands, it is
fought on the ground that sector actually carries, the approach it was reached by is
recorded, and the chips it receives are keyed to it. This is the ticket that makes
ticket 07 reachable: without it a battle can only occur at an authored region
border, and **41 of 45** drawn capitals can be walked to with zero battles.

**Blocked by:** 06c — every item here consumes the engagement adapter it landed.

**Blocks:** 06d (capturing an interior sector requires an engagement to have been
sited there) and therefore 07.

Status: **ready-for-agent** (created 2026-07-31 — zero unlanded values; see
§ Needs-info)

Specification gates: none outstanding. The geography-battle grill closed them.
Authority: **ADR 0046** (§ Decision items 1–5) · terrain-cradle **TC-⑮** (the
`terrainLayer` → M5 binding, and TC-⑬'s surviving crossing column) ·
war-model-build **WM-⑤** (rout displacement) · combat-formula **M5** (every terrain
value, cited never restated) · **ADR 0032** (the front sector is the operational
atom) · **ADR 0015** (the crossing prices the engagement, not the march) ·
`DOMAIN_MAP.md` § Design Principle `Hex is physical, sector is decisional`.
Session record: `.context/record-geography-battle-grill-2026-07-29.md`.

- [ ] **An engagement is sited wherever a hostile force stands.** `engagementsOf`'s
      candidate sites stop being seeded from `contestedFronts`. The predicate is a
      sector predicate — an invading force standing on ground it does not hold — and
      resolution stays **atomic per sector**, unchanged from 06c. Note what is
      already correct and must not be "fixed": `engagement.ts`'s header already says
      the unit of resolution is the sector, and `engagementsOf` already fires on
      presence (`standing.sides[invader].men > 0`). Only the seed changes.
- [ ] **A `Front` remains an authored edge and keeps its own job.** Fronts still
      exist for territory reading, projection, and the fog surface; what they stop
      being is the gate on where combat may occur. `contestedFronts` is not deleted.
- [ ] **A sector's defensive terrain is its own** (TC-⑮). The `terrainLayer` → M5
      binding is a table over the seven authored layers; **every value is cited from
      M5** and appears nowhere else in code. An unknown layer **throws**, following
      06c's precedent for `fortTier` — a silent ×1.0 is exactly the failure that
      would hide a missing rung.
- [ ] **The door contributes attacker-side terms only.** TC-⑬'s crossing column
      stands: a river door still supplies `riverOpposed`, a strait `straitOpposed`,
      and ADR 0015 keeps that out of 06a's movement graph. A regression test pins
      that a river-door battle is **numerically unchanged** by this ticket
      (1,800 v 900 → R 1.40 before and after).
- [ ] **Passes become asymmetric, and a test says so.** 관중's three `mountain`
      sectors are exactly its three pass endpoints (`r6_s0`, `r6_s3`, `r6_s5`); they
      defend at M5's `Mountains` rung while the plains/desert sectors on the far side
      defend at `Plains`. Pin the pair — 1,800 v 900 gives R 1.33 defending `r6_s5`
      and R 2.00 defending `r1_s0` — because a symmetric result means the door is
      still supplying terrain.
- [ ] **The approach is recorded as the traversed hex arc** (`{fromHex, toHex}`), a
      value movement already computes. Today the only read is "which authored door,
      if any, did this arc cross"; the arc is carried at hex grain because that is
      the seat for directional terrain later (river current, ravine axis). Do **not**
      add any read beyond the door projection — the reachable-weakest-link-over-
      approaches rule is **retired** (TC-⑮), and re-deriving it is the specific
      mistake this ticket exists to prevent.
- [ ] **TC-⑬'s reachable-weakest-link still picks among doors.** When one sector is
      served by several authored borders, the softest crossing still wins. 06c's
      `softestClass` and its cited `CLASS_DEFENSE_RANK` ordering (including the
      pass/strait pair a derived order gets wrong) survive unchanged — keep its test.
- [ ] **Commit is allocated per sector.** `Allocations` keys on the sector.
      06c's reconciliation for ticket 03's case 4 (two fronts pouring chips into one
      sector) is **deleted, not adapted** — it exists only because the key was the
      front. Preserve: the stack is one pool of 20, non-hoardable, shared across every
      order kind, and the order-key namespace already mixes kinds
      (`recruitmentOrderKeyOf` → `ORDER_RECRUIT:<id>`), so assert sector ids cannot
      collide with it.
- [ ] **The commit key change is a public contract change.** It reaches `preview`,
      the UI's allocation surface, and `FrontAssignments`. Both callers must move
      together — `commitment.ts`'s whole point is that the Runtime and `preview`
      cannot drift into telling the player different things.
- [ ] **Rout displacement per WM-⑤.** Anyone with an approach arc falls back along it
      one sector; anyone without one leaves service and stays on the register. The
      axis is **who entered this sector this turn**, not attacker/defender: a
      reinforcing defender has an arc, and a **garrison never does** (06b —
      `GarrisonForce` carries no wear ledger). Garrison-only defence is the common
      case on this board, so the no-arc branch is the main path.
- [ ] **`escaped` gains its consumer.** It is `battle.ts`'s open-escape survivor
      count and had none, which is why a routed force stood on the hex it lost.
      Leaving service must decrement `serving` **without** touching the register —
      the opposite of 06c item 11's casualty path, which removes the dead from the
      register permanently. State the two laws separately and test them separately;
      06d's ticket makes the same point about transfer versus casualties.
- [ ] **Fall-back must not become a free move.** A displaced force pays what R12
      prices movement at, or the displacement is a teleport. If the arc's origin is no
      longer a legal destination, the force leaves service — do not invent a second
      destination rule.
- [ ] **Cross-host determinism holds.** Canonical sector order fixes the *report*,
      not the arithmetic (06c). Extend the replay fixture so an **interior** sector is
      fought over and a rout is displaced, and assert Node and browser produce
      identical projections — the arithmetic must cross `submit()` the way 06c's
      contact phase does.
- [ ] **New events, if any, cost five edits.** A new public event must be whitelisted
      in `Runtime.#globallySafeResolutionEvents` **and** `game/acceptance/replay.js`'s
      `GLOBALLY_SAFE_EVENT_TYPES`, and four tests assert the exact event and tier
      lists (`turn-loop.test.js` ×2, `tests/browser/boot.spec.js` ×2). A rout's
      *occurrence* may cross `submit()`; its numbers stay behind `view(actor)`.
- [ ] **Two stale code comments are corrected as part of this ticket's surface, if
      the doc batch has not already done it.** `economy.ts`'s `holdsOf` and
      `state.ts`'s `homeland` describe conquest conversion as unanswered; **ADR 0044
      answered it**, hours after those comments landed. See `docs/SYNC-DEBT.md`.
- [ ] Baseline is not regressed: `npm run verify:game` (all lanes PASS, parity
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

### Why this is a separate ticket — 2026-07-31

Rulings 1–4 of ADR 0046 plus WM-⑤ needed an implementation home and no existing
ticket had one: 06d's seventeen checkboxes contain none of them, yet 06d cannot
capture an interior sector until siting exists. Folding them into 06d was rejected
because 06d already modifies ticket 05's landed code across seventeen items, and
"capture" is a different subject from "atom". The user approved a new ticket
2026-07-31.
