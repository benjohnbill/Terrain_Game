# Conquest Growth Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the sealed ADR-0022 usable-ripening into the L2 harness so conquest raises a realm's military ceiling *lagged* — the freshly-gained ceiling enters at a reduced fraction and ripens in over turns — breaking the frozen (zero-sum) world so matches resolve at turns 18-22.

**Architecture:** A realm's military ceiling (`fieldCap`) already moves on land transfer through the `capPerSector` seat (currently `0`). This plan (a) turns that seat into a *ripening* gain: only a start fraction of a conquest's ceiling is usable immediately, the rest ripens `+10pp` per turn via a small per-realm accumulator (`capPending` / `capRipeFlow`); (b) keeps land loss immediate; (c) adds an optional, default-off economy-lag (usable drag on conquest) for Position 1 fidelity. All new behavior is gated so that with `capPerSector: 0` (the control) the harness is byte-identical to today.

**Tech Stack:** Node.js built-in test runner (`node --test`), CommonJS, no external deps. All edits in `mockup/combat-calc/tournament.js` + a new `tests/conquest-growth.test.js`.

## Global Constraints

- Design source: `docs/superpowers/specs/2026-07-10-conquest-growth-engine-design.md` (DT-②) + ADR 0022.
- Ripening values (ADR 0022 placeholders, HARNESS gaan — bound proof power, NOT seal candidates): `capStartFrac: 0.60` (population/cap usable start), `capRipenPpPerTurn: 0.10` (+10pp per stable turn). A gain therefore reaches full ceiling in 4 turns.
- `capPerSector` stays `0` by default (the control). The growth engine only activates when a run overrides it `> 0`. With it `0`, every gain is `0`, so `applyCapGain` and `ripenCap` are no-ops and all non-growth behavior is byte-identical — every pre-existing test must stay green.
- Land loss is immediate (destruction fast, integration slow). Keep the existing `D.fieldCap = Math.max(2000, D.fieldCap - ceded * H.capPerSector)` loss line; only the winner's *gain* ripens.
- Economy-lag (`conquestUsableDrag`) defaults `0` (off) — it is a separate measurement lever isolated from cap-lag, not part of the control.
- Dials live in `HARNESS` (the measurement rig), beside the existing `capPerSector`. The sealed home (econ.js/MAGNITUDE) comes later, after measurement.
- Additive only: new realm fields (`capPending`, `capRipeFlow`) and new HARNESS dials; do NOT change `unassailable`, the leadership/dominance gate, blood/register accounting, or the settlement bundle arithmetic.
- Tests run with `npm test` (`node --test tests/*.test.js`). Baseline is 167/167 green.
- Commit style: `feat(match-arc): ...` / `test(match-arc): ...`, present tense, repo Co-Authored-By trailer.

---

### Task 1: Ripening dials + pure accumulator helpers

Add the two HARNESS dials and two pure helpers (`applyCapGain`, `ripenCap`) that implement the ripening arithmetic, with unit tests. No wiring yet — this task delivers tested pure functions.

**Files:**
- Modify: `mockup/combat-calc/tournament.js` (`HARNESS` block ~line 50-53; add helpers after `shieldOf` ~line 158; export list ~line 976)
- Create: `tests/conquest-growth.test.js`

**Interfaces:**
- Consumes: nothing (pure).
- Produces:
  - `applyCapGain(realm, gainCap, H = HARNESS)` — mutates `realm`: adds `round(H.capStartFrac * gainCap)` to `realm.fieldCap` immediately, puts the remainder into `realm.capPending`, and adds `round(H.capRipenPpPerTurn * gainCap)` to `realm.capRipeFlow`. No-op when `gainCap <= 0`.
  - `ripenCap(realm)` — mutates `realm`: moves `min(capPending, capRipeFlow)` from `capPending` into `fieldCap`; when `capPending` reaches `0`, resets `capRipeFlow` to `0`. No-op when `capPending <= 0`.
  - HARNESS gains `capStartFrac: 0.60`, `capRipenPpPerTurn: 0.10`.

- [ ] **Step 1: Write the failing tests**

Create `tests/conquest-growth.test.js`:

```javascript
'use strict';
// §5 conquest growth engine (DT-②): a conquest's military-ceiling gain ripens
// in over turns (ADR 0022 — start 60%, +10pp per stable turn → full in 4).
const test = require('node:test');
const assert = require('node:assert');
const T = require('../mockup/combat-calc/tournament.js');
const { applyCapGain, ripenCap, HARNESS } = T;

// a minimal realm carrying only the fields the helpers touch
function realm(over = {}) {
  return { fieldCap: 6000, capPending: 0, capRipeFlow: 0, ...over };
}

test('applyCapGain: 60% of the gain is immediate, 40% pends, ripe-flow is 10% of gain', () => {
  const r = realm();
  applyCapGain(r, 1000, HARNESS); // startFrac 0.60, ripenPpPerTurn 0.10
  assert.equal(r.fieldCap, 6600);   // 6000 + round(0.60 * 1000)
  assert.equal(r.capPending, 400);  // 1000 - 600
  assert.equal(r.capRipeFlow, 100); // round(0.10 * 1000)
});

test('applyCapGain: gain <= 0 is a no-op (the capPerSector:0 control guard)', () => {
  const r = realm();
  applyCapGain(r, 0, HARNESS);
  assert.deepEqual({ fieldCap: r.fieldCap, capPending: r.capPending, capRipeFlow: r.capRipeFlow },
    { fieldCap: 6000, capPending: 0, capRipeFlow: 0 });
});

test('ripenCap: a fresh gain reaches full ceiling in exactly 4 stable turns', () => {
  const r = realm();
  applyCapGain(r, 1000, HARNESS); // fieldCap 6600, pending 400, flow 100
  ripenCap(r); assert.equal(r.fieldCap, 6700); assert.equal(r.capPending, 300);
  ripenCap(r); assert.equal(r.fieldCap, 6800); assert.equal(r.capPending, 200);
  ripenCap(r); assert.equal(r.fieldCap, 6900); assert.equal(r.capPending, 100);
  ripenCap(r); assert.equal(r.fieldCap, 7000); assert.equal(r.capPending, 0);
  assert.equal(r.capRipeFlow, 0); // reset once fully ripened
});

test('ripenCap: no pending is a no-op', () => {
  const r = realm({ fieldCap: 7000 });
  ripenCap(r);
  assert.equal(r.fieldCap, 7000);
  assert.equal(r.capPending, 0);
});

test('ripenCap: last step never overshoots full (min(pending, flow))', () => {
  const r = realm({ capPending: 50, capRipeFlow: 100, fieldCap: 6950 });
  ripenCap(r); // step = min(50, 100) = 50
  assert.equal(r.fieldCap, 7000);
  assert.equal(r.capPending, 0);
  assert.equal(r.capRipeFlow, 0);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test tests/conquest-growth.test.js`
Expected: FAIL — `applyCapGain`/`ripenCap` are `undefined` (not yet exported).

- [ ] **Step 3: Add the two HARNESS dials**

In `mockup/combat-calc/tournament.js`, inside the `HARNESS` object, immediately after the `capPerSector` block (the lines ending `...cap growth is A-3's undesigned seat)`) and before the closing `};` (~line 52), add:

```javascript
  // -- §5 conquest growth engine (DT-②, ADR 0022 ripening). HARNESS gaan
  //    (bound proof power, not seal candidates). A conquest's ceiling gain
  //    enters at capStartFrac and ripens +capRipenPpPerTurn per turn → full
  //    in 4 turns. Active only when capPerSector > 0. --
  capStartFrac: 0.60,        // population-usable start (ADR 0022): 60% immediate
  capRipenPpPerTurn: 0.10,   // +10pp per stable turn (ADR 0022)
  conquestUsableDrag: 0,     // Position-1 economy-lag lever (default off; Task 3)
```

- [ ] **Step 4: Add the pure helpers**

In `mockup/combat-calc/tournament.js`, right after the `shieldOf` definition (~line 158) and before the `// adapt a realm to match.js's hegemonyCheck shape` comment, add:

```javascript
// §5 conquest growth (DT-②, ADR 0022): a conquest's ceiling gain is not
// fully usable at once. capStartFrac lands immediately; the remainder waits
// in capPending and ripens capRipeFlow per stable turn (10% of the gain →
// full in 4 turns). This transient is the contestability window. gainCap <= 0
// (the capPerSector:0 control) is a no-op, so non-growth runs are unchanged.
function applyCapGain(realm, gainCap, H = HARNESS) {
  if (gainCap <= 0) return;
  const imm = Math.round(H.capStartFrac * gainCap);
  realm.fieldCap += imm;
  realm.capPending += gainCap - imm;
  realm.capRipeFlow += Math.round(H.capRipenPpPerTurn * gainCap);
}

// move one stable turn's worth of pending ceiling into usable fieldCap.
function ripenCap(realm) {
  if (realm.capPending <= 0) return;
  const step = Math.min(realm.capPending, realm.capRipeFlow);
  realm.fieldCap += step;
  realm.capPending -= step;
  if (realm.capPending <= 0) { realm.capPending = 0; realm.capRipeFlow = 0; }
}
```

- [ ] **Step 5: Export the helpers**

In `mockup/combat-calc/tournament.js`, add `applyCapGain, ripenCap` to the `module.exports` list (~line 976-980). Change the final line of the exports from:

```javascript
  frontDefense, pickMainDefWar, frontSoftness };
```

to:

```javascript
  frontDefense, pickMainDefWar, frontSoftness, applyCapGain, ripenCap };
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `node --test tests/conquest-growth.test.js`
Expected: PASS — all 5 tests green.

Then run the full suite: `npm test`
Expected: 172/172 green (167 baseline + 5 new). No pre-existing test changes, because the helpers are not yet called anywhere and the new HARNESS dials are unused.

- [ ] **Step 7: Commit**

```bash
git add mockup/combat-calc/tournament.js tests/conquest-growth.test.js
git commit -m "feat(match-arc): add conquest-growth ripening helpers + dials

The §5 growth engine's core arithmetic (DT-②, ADR 0022): applyCapGain lands
capStartFrac (0.60) of a conquest's ceiling gain immediately and ripens the
rest at capRipenPpPerTurn (0.10) per stable turn via a per-realm accumulator
(capPending/capRipeFlow) -> full in 4 turns. ripenCap advances one turn.
Pure helpers, not yet wired; gainCap<=0 is a no-op so the capPerSector:0
control stays byte-identical. HARNESS gaan (not seal candidates).

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Wire ripening into the transfer sites and the turn loop

Initialize the two new realm fields, route both cap-gain sites (`applySettlement`, `eliminate`) through `applyCapGain`, clamp the loser's pending on loss, and call `ripenCap` in the per-turn recovery loop.

**Files:**
- Modify: `mockup/combat-calc/tournament.js` (`mk` realm literal ~line 114-128; `applySettlement` ~line 527-528; `eliminate` ~line 573; recovery loop ~line 860-863)
- Modify: `tests/conquest-growth.test.js` (add the wiring tests)

**Interfaces:**
- Consumes: `applyCapGain`, `ripenCap` (Task 1); `runMatch(assignment, opts)` where `opts = { seed, board, harness }` and `opts.harness` shallow-overrides `HARNESS`; `makeBoard()` returning the 5 cradle realms; `ASSIGN` below.
- Produces: realms now carry `capPending`/`capRipeFlow`; a run with `harness: { capPerSector: N>0 }` grows winners' `fieldCap` lagged.

- [ ] **Step 1: Write the failing tests**

Add to `tests/conquest-growth.test.js` (append at end):

```javascript
// A fixed all-'표준' assignment so runMatch is deterministic under a seed.
const ASSIGN = Object.fromEntries(
  ['중원', '서령', '동평', '남곡', '북하'].map(
    (n) => [n, { archetype: 'shield-first', temperament: '표준' }]));

test('new realm fields are initialized on the board', () => {
  const board = T.makeBoard();
  for (const r of board) {
    assert.equal(r.capPending, 0);
    assert.equal(r.capRipeFlow, 0);
  }
});

test('ripenCap is invoked in the per-turn loop (a pre-set pending drains)', () => {
  const board = T.makeBoard();
  board[0].capPending = 1000;   // 중원 carries a pending ceiling
  board[0].capRipeFlow = 100;
  const startCap = board[0].fieldCap;
  T.runMatch(ASSIGN, { seed: 42, board, harness: { maxTurns: 3 } });
  // 중원 survives the opening turns; 3 loop passes ripen 3 x 100 = 300.
  assert.ok(board[0].capPending <= 700, `pending should drain, got ${board[0].capPending}`);
  assert.ok(board[0].fieldCap >= startCap, 'ripened ceiling never drops below start');
});

test('capPerSector > 0 makes conquest change the ceiling trajectory (wiring live)', () => {
  const off = T.runMatch(ASSIGN, { seed: 7, board: T.makeBoard(), harness: { capPerSector: 0 } });
  const on  = T.runMatch(ASSIGN, { seed: 7, board: T.makeBoard(), harness: { capPerSector: 600 } });
  // Precondition: the growth engine can only fire if a conquest happened (a
  // settlement cession or an elimination). If this seed produces neither,
  // switch to a seed that does — the test is otherwise vacuous.
  assert.ok(on.settlements.length > 0 || on.eliminations > 0,
    `seed 7 produced no conquest to test; pick a seed with a settlement/elimination`);
  // Same seed/assignment: with growth on, at least the winner or trip turn or a
  // settlement-bearing field must diverge from the zero-growth control.
  const diverged = off.winner !== on.winner
    || off.tripTurn !== on.tripTurn
    || off.settlements.length !== on.settlements.length
    || off.eliminations !== on.eliminations;
  assert.ok(diverged, 'growth engine must change outcomes vs the capPerSector:0 control');
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test tests/conquest-growth.test.js`
Expected: FAIL — `board[...].capPending` is `undefined` (fields not initialized), and the divergence test fails because `capPerSector` gains are not yet routed through the ripening (so `capPerSector:600` still adds the full gain immediately in `applySettlement`, which may or may not diverge — the field-init test fails deterministically regardless).

- [ ] **Step 3: Initialize the new realm fields**

In `mk` (`makeBoard`), inside the realm object literal, add the two fields right after the `recruitBonus: 0,` line (~line 124):

```javascript
      recruitBonus: 0,                // indemnity credit, men
      capPending: 0, capRipeFlow: 0,  // §5 growth: ceiling not yet integrated
```

- [ ] **Step 4: Route the settlement cap-gain through ripening**

In `applySettlement`, replace this line (~line 527):

```javascript
  A.fieldCap += ceded * H.capPerSector;
```

with:

```javascript
  applyCapGain(A, ceded * H.capPerSector, H); // §5: winner's ceiling ripens in
```

Then, on the very next line, after the existing loser-loss line (~line 528):

```javascript
  D.fieldCap = Math.max(2000, D.fieldCap - ceded * H.capPerSector);
```

add a pending clamp so a shrinking realm never carries pending above its ceiling:

```javascript
  if (D.capPending > D.fieldCap) D.capPending = D.fieldCap; // loss is immediate
```

- [ ] **Step 5: Route the elimination cap-gain through ripening**

In `eliminate`, replace this line (~line 573):

```javascript
  A.fieldCap += D.interior * (H?.capPerSector ?? 0);
```

with:

```javascript
  applyCapGain(A, D.interior * (H?.capPerSector ?? 0), H ?? HARNESS); // §5 ripen
```

- [ ] **Step 6: Call ripenCap in the per-turn recovery loop**

In `runMatch`, in the `--- M12/M13 pulse` loop (~line 860-863), add the `ripenCap(r)` call:

```javascript
    for (const r of alive) {
      r.usable = Math.min(1, r.usable + H.usableRecovery);
      ripenCap(r);                                        // §5: integrate conquered ceiling
      r.treasury = (r.treasury ?? 0) + realmIncome(r);  // Option B income accrual
    }
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `node --test tests/conquest-growth.test.js`
Expected: PASS — all 8 tests green (5 from Task 1 + 3 wiring).

Then the full suite: `npm test`
Expected: 175/175 green (167 baseline + 8). IMPORTANT — the pre-existing integration tests (`tournament-board.test.js`, `cradle-tournament.test.js`, `force-geography.test.js`, `match-panel.test.js`, `plan-brain.test.js`) run with the default `capPerSector: 0`, so every gain is `0` and `applyCapGain`/`ripenCap` are no-ops → outcomes must be byte-identical. If any pre-existing test changes outcome, STOP and report it — with `capPerSector: 0` there is no legitimate reason for a change.

- [ ] **Step 8: Commit**

```bash
git add mockup/combat-calc/tournament.js tests/conquest-growth.test.js
git commit -m "feat(match-arc): wire conquest-growth ripening into transfers + turn loop

Initialize capPending/capRipeFlow on the board; route both cap-gain sites
(applySettlement, eliminate) through applyCapGain so a conquest's ceiling
ripens in; clamp the loser's pending (loss stays immediate); call ripenCap
in the per-turn recovery pulse. With capPerSector:0 (control) every gain is
0 so the paths are no-ops and non-growth runs are byte-identical.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Optional economy-lag on conquest (Position 1 fidelity)

Add the default-off `conquestUsableDrag` lever: on a settlement gain, drag the conqueror's realm-level `usable` down in proportion to the fresh-land fraction, so the economy (yield + recruit rate) also ripens back up via the existing `usableRecovery` pulse. This honors the sealed Position 1 (economy also lags) while staying isolated from cap-lag for measurement.

**Files:**
- Modify: `mockup/combat-calc/tournament.js` (`applySettlement`, right after the cap-gain wiring from Task 2)
- Modify: `tests/conquest-growth.test.js` (add the economy-lag test)

**Interfaces:**
- Consumes: `HARNESS.conquestUsableDrag` (Task 1 dial, default `0`); `applySettlement`'s locals `A` (winner realm, `A.interior` already incremented by `ceded`), `ceded`, `H`.
- Produces: when `conquestUsableDrag > 0`, a settlement lowers `A.usable` (floored at `0.3`, matching the raid floor); default `0` leaves runs unchanged.

- [ ] **Step 1: Write the failing test**

Add to `tests/conquest-growth.test.js` (append at end):

```javascript
test('conquestUsableDrag: off (0) leaves the usable trajectory identical', () => {
  const off = T.runMatch(ASSIGN, { seed: 5, board: T.makeBoard(),
    harness: { capPerSector: 600, conquestUsableDrag: 0 } });
  const off2 = T.runMatch(ASSIGN, { seed: 5, board: T.makeBoard(),
    harness: { capPerSector: 600 } }); // dial absent → default 0
  assert.equal(off.winner, off2.winner);
  assert.equal(off.tripTurn, off2.tripTurn);
});

test('conquestUsableDrag: on changes the outcome vs off (lever is live)', () => {
  const off = T.runMatch(ASSIGN, { seed: 5, board: T.makeBoard(),
    harness: { capPerSector: 600, conquestUsableDrag: 0 } });
  const on = T.runMatch(ASSIGN, { seed: 5, board: T.makeBoard(),
    harness: { capPerSector: 600, conquestUsableDrag: 0.5 } });
  // Precondition: a settlement must occur for the drag to fire. If seed 5
  // produces none, pick a seed that does.
  assert.ok(on.settlements.length > 0,
    `seed 5 produced no settlement; pick a seed with a cession for the drag to fire`);
  const diverged = off.winner !== on.winner || off.tripTurn !== on.tripTurn
    || off.settlements.length !== on.settlements.length;
  assert.ok(diverged, 'economy-lag lever must be able to change outcomes');
});
```

- [ ] **Step 2: Run the tests to verify they fail (or pass trivially) and confirm the lever is absent**

Run: `node --test tests/conquest-growth.test.js`
Expected: the "off leaves identical" test PASSES already (dial defaults 0, unused); the "on changes outcome" test FAILS — `conquestUsableDrag` is read nowhere, so `0.5` behaves like `0` and nothing diverges.

- [ ] **Step 3: Apply the usable drag on a settlement gain**

In `applySettlement`, immediately after the Task-2 pending-clamp line (`if (D.capPending > D.fieldCap) D.capPending = D.fieldCap;`), add:

```javascript
  // §5 Position 1: fresh conquest also lags the economy — drag usable down in
  // proportion to the new-land fraction; the existing usableRecovery pulse
  // ripens it back. Default 0 (off) — an isolated measurement lever.
  if (H.conquestUsableDrag > 0 && ceded > 0) {
    const freshFrac = ceded / Math.max(1, A.interior); // A.interior already includes ceded
    A.usable = Math.max(0.3, A.usable - H.conquestUsableDrag * freshFrac);
  }
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test tests/conquest-growth.test.js`
Expected: PASS — all 10 tests green.

Then the full suite: `npm test`
Expected: 177/177 green (167 baseline + 10). Pre-existing tests unaffected (`conquestUsableDrag` defaults 0).

- [ ] **Step 5: Commit**

```bash
git add mockup/combat-calc/tournament.js tests/conquest-growth.test.js
git commit -m "feat(match-arc): add optional economy-lag on conquest (Position 1)

conquestUsableDrag (default 0, off): a settlement drags the conqueror's
usable down by the fresh-land fraction, so yield and recruit rate also
ripen back via the existing usableRecovery pulse — the sealed Position 1
(economy lags too), kept as an isolated measurement lever so cap-lag and
economy-lag can be read separately.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## After implementation (controller close-out — not TDD tasks)

Handled by the controller after Task 3's review is clean.

1. **Battery measurement (the pass's real validation).** Sweep the growth dials against the timing ruler on the cradle board. Minimum sweep, each vs the `capPerSector: 0` control, reading `envelopePct` / `core1822Pct` / `medianTripTurn` / normality per arm:
   - control (`capPerSector: 0`);
   - cap-lag only at a few `capPerSector` magnitudes (e.g. 300 / 600 / 1000, `conquestUsableDrag: 0`);
   - cap-lag + economy-lag (best cap magnitude, `conquestUsableDrag: 0.5`).
   Run via the existing cradle tournament with `harness` overrides (mirror how `--fg` drives arms). If a `--growth` flag on `plan-battery.js` is the cleanest driver, add it modeled on `runFgSweep` (it already prints the timing-ruler headline). Read for: decisions landing **18-22** (core1822 up), envelope(15-25) rising toward the ≥~50% first checkpoint, **~0% early stomp (trip ≤ turn 8)**, and the fgM9off median NOT pushed further below the core (it moved 19→17 after §6). Record before/after in the match-arc INDEX / a NOTES entry.

2. **Documentation fix (ADR-level, USER-SEALED — do NOT edit silently).** Per the design §6: the `DOMAIN_MAP` `Settlement` line "arrives *alive* (undamaged usable value)" is a stale exception conflicting with ADR 0022 + the guardrail + DT-②. Narrow "alive" to "undamaged" (no scorch) while the integration lag (ripening) applies to all acquired land including settlement cession. Record the reconciliation as an ADR (amend ADR 0022 or a new ADR) with the supersession stamp the documentation law requires; get the user's seal before the `DOMAIN_MAP` edit lands. (User has verbally sealed the decision 2026-07-10; this is the formal write-up.)

3. **Doc-sync close-out.** After measurement, add a RULINGS entry (DT-④ or the next number) sealing the conquest-growth engine with the measured dial values, refresh the match-arc INDEX §5 line, and update `docs/SYNC-DEBT.md`. Then **reconsider whether peaceful development is needed at all** (the deferred second path) based on the read.

## Out of scope (do NOT implement here)

- Peaceful **development** as a second growth path (deferred; revisit post-measurement).
- Settlement bundle **re-pricing** (관대/표준/최대).
- Full **per-sector usable** fidelity (the accumulator is the L2 stand-in).
- Any change to `unassailable`, the leadership/dominance gate (§6/DT-③), or blood/register accounting.
- Sealing the dial magnitudes as game canon (that is the later magnitude session; here they are HARNESS gaan).
