# Timing Ruler Instrumentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote the decision-timing ruler (`tripTurn` → envelope% + median + histogram) from a scratch driver into `plan-battery.js aggregate()`, so every future lever can be measured against the timing target in-repo.

**Architecture:** `aggregate(records)` already iterates match records once and returns an outcome object. Add a second read of the same loop that accumulates `record.tripTurn` (an integer on decided matches, `null` on timeouts) into three new fields: `envelopePct` (fraction of ALL matches that tripped in turns 15–25), `medianTripTurn` (median trip turn among decided matches), and `tripTurnBins` (a fixed 5-bin histogram). Then surface those fields in the existing `--fg` sweep report. No engine, board, or winner-rule change; the sealed `runFgSweep` / `runCradleTournament` are untouched.

**Tech Stack:** Node.js built-in test runner (`node --test`), CommonJS modules, no external deps.

## Global Constraints

- This is instrumentation only (spec §10). It does NOT change match outcomes, the hegemony gate, or any dial. `aggregate()` is a pure read over records.
- The timing ruler is additive: all existing `aggregate()` return fields and the existing `--fg` bucket/mean output stay exactly as they are. The demoted `meanWithinRealmVariance` / `meanBoostedShieldShare` remain in the output (descriptive per the 2026-07-09 metric amendment).
- Bins are fixed and match the scratch driver the user already reviewed: `1-8`, `9-14`, `15-20`, `21-25`, `26-32`. The SPEC envelope is turns 15–25; `envelopePct` counts trips in `[15, 25]` inclusive.
- `medianTripTurn` uses the upper-median (median_high) convention: `sorted[Math.floor(n/2)]` over decided trip turns — the higher of the two central turns for an even count — `null` when there are no decided matches.
- Tests run with `npm test` (`node --test tests/*.test.js`). Follow the existing fixture pattern in `tests/plan-battery.test.js` (the `rec(over)` helper).
- Commit style: `feat(match-arc): ...` / `test(match-arc): ...`, present-tense, and end the commit body with the repo's Co-Authored-By trailer.

---

### Task 1: Timing fields in `aggregate()`

Add `envelopePct`, `medianTripTurn`, and `tripTurnBins` to the object returned by `aggregate()`.

**Files:**
- Modify: `mockup/combat-calc/plan-battery.js:28-74` (the `aggregate` function)
- Test: `tests/plan-battery.test.js` (append one test; reuse the existing `rec` helper)

**Interfaces:**
- Consumes: each record's `winner` (truthy on decided) and `tripTurn` (integer turn on decided, `null`/absent on timeout). These are set by `tournament.js` (`record.winner = r.name; record.tripTurn = t;` on trip; initialized `winner: null, tripTurn: null`).
- Produces (new fields on the existing `aggregate()` return object; all other fields unchanged):
  - `envelopePct: number` — `(count of records with 15 ≤ tripTurn ≤ 25) / matches * 100`
  - `medianTripTurn: number | null` — upper-median (median_high) of decided `tripTurn`s, `null` if none decided
  - `tripTurnBins: { '1-8': number, '9-14': number, '15-20': number, '21-25': number, '26-32': number }` — counts of decided matches per bin

- [ ] **Step 1: Write the failing test**

Append to `tests/plan-battery.test.js`:

```javascript
test('aggregate reports decision-timing ruler (envelope%, median, bins)', () => {
  const records = [
    rec({ winner: 'A', tripTurn: 6 }),   // 1-8 bin, pre-envelope
    rec({ winner: 'B', tripTurn: 12 }),  // 9-14 bin, pre-envelope
    rec({ winner: 'C', tripTurn: 18 }),  // 15-20 bin, ENVELOPE
    rec({ winner: 'D', tripTurn: 22 }),  // 21-25 bin, ENVELOPE
    rec({ winner: 'E', tripTurn: 25 }),  // 21-25 bin, ENVELOPE (inclusive upper)
    rec({ winner: 'F', tripTurn: 30 }),  // 26-32 bin, post-envelope
    rec(),                               // timeout (winner null, no tripTurn)
    rec(),                               // timeout
  ];
  const a = aggregate(records);
  assert.equal(a.matches, 8);
  // 3 of 8 matches tripped inside 15-25
  assert.ok(Math.abs(a.envelopePct - (3 / 8) * 100) < 1e-9);
  // decided trip turns sorted: [6,12,18,22,25,30] → upper median (median_high, floor(n/2)) = index 3 = 22
  assert.equal(a.medianTripTurn, 22);
  assert.deepEqual(a.tripTurnBins, {
    '1-8': 1, '9-14': 1, '15-20': 1, '21-25': 2, '26-32': 1,
  });
});

test('aggregate timing ruler handles an all-timeout batch', () => {
  const a = aggregate([rec(), rec()]);
  assert.equal(a.envelopePct, 0);
  assert.equal(a.medianTripTurn, null);
  assert.deepEqual(a.tripTurnBins, {
    '1-8': 0, '9-14': 0, '15-20': 0, '21-25': 0, '26-32': 0,
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — the two new tests error because `a.envelopePct` / `a.medianTripTurn` / `a.tripTurnBins` are `undefined` (assertion mismatch). Existing tests still pass.

- [ ] **Step 3: Write minimal implementation**

In `mockup/combat-calc/plan-battery.js`, inside `aggregate()`, add timing accumulation. First, initialize a bins object and a trip-turn list alongside the existing accumulators (near line 36–38, after `let varSum = 0, boostSum = 0;`):

```javascript
  const tripTurnBins = { '1-8': 0, '9-14': 0, '15-20': 0, '21-25': 0, '26-32': 0 };
  const tripTurns = [];
```

Then, inside the existing `for (const r of records)` loop, after the `if (r.panel) { ... }` block closes (the `}` on line 55) and before the loop's own closing brace (line 56), add:

```javascript
    if (r.winner && typeof r.tripTurn === 'number') {
      tripTurns.push(r.tripTurn);
      const t = r.tripTurn;
      const bin = t <= 8 ? '1-8' : t <= 14 ? '9-14' : t <= 20 ? '15-20' : t <= 25 ? '21-25' : '26-32';
      tripTurnBins[bin] += 1;
    }
```

Then, just before the `return {` (after the `shortfalls` computation at line 57–59), add the median and envelope derivations:

```javascript
  const sortedTrips = [...tripTurns].sort((a, b) => a - b);
  const medianTripTurn = sortedTrips.length ? sortedTrips[Math.floor(sortedTrips.length / 2)] : null;
  const envelopeCount = tripTurns.filter((t) => t >= 15 && t <= 25).length;
```

Finally, add the three fields to the returned object (inside the `return { ... }`, e.g. right after the `buckets, bucketByLeaderSeat,` line at 66):

```javascript
    envelopePct: (envelopeCount / records.length) * 100,
    medianTripTurn,
    tripTurnBins,
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all tests green, including the two new timing tests and the pre-existing `aggregate reports decided%...` test (unchanged fields).

- [ ] **Step 5: Commit**

```bash
git add mockup/combat-calc/plan-battery.js tests/plan-battery.test.js
git commit -m "feat(match-arc): add decision-timing ruler to aggregate (envelope%, median, bins)

The tripTurn timing read (spec 2026-07-09 hegemony-decision-timing-target
§10) promoted from scratch driver into aggregate(): envelopePct (trip within
the SPEC 15-25 envelope), medianTripTurn, and a fixed 5-bin tripTurn
histogram. Pure additive read over records; no engine/winner-rule change.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Surface timing in the `--fg` sweep report

Print the new timing fields for each arm in the `--fg` report so a battery run reads the timing headline directly.

**Files:**
- Modify: `mockup/combat-calc/plan-battery.js:184-187` (the per-arm print loop inside the `if (fg)` branch)

**Interfaces:**
- Consumes: `aggregate()`'s new `envelopePct`, `medianTripTurn`, `tripTurnBins` (Task 1), already present on each `sweep[arm]` aggregate because `runFgSweep` calls `aggregate()`.
- Produces: report text only. No return-value change; no other code depends on this.

- [ ] **Step 1: Replace the per-arm print loop**

In `mockup/combat-calc/plan-battery.js`, replace the existing loop body (lines 184–187):

```javascript
    for (const [id, agg] of Object.entries(sweep)) {
      console.log(`[${id}] decided ${pct(agg.decidedPct)} · meanWithinRealmVariance ${agg.meanWithinRealmVariance === null ? '—' : agg.meanWithinRealmVariance.toFixed(1)} · meanBoostedShieldShare ${agg.meanBoostedShieldShare === null ? '—' : agg.meanBoostedShieldShare.toFixed(3)}`);
      console.log(`  buckets ${JSON.stringify(agg.buckets)}`);
    }
```

with:

```javascript
    for (const [id, agg] of Object.entries(sweep)) {
      console.log(`[${id}] decided ${pct(agg.decidedPct)} · envelope(15-25) ${pct(agg.envelopePct)} · median trip ${agg.medianTripTurn === null ? '—' : agg.medianTripTurn}`);
      console.log(`  tripTurn bins ${JSON.stringify(agg.tripTurnBins)}`);
      console.log(`  buckets ${JSON.stringify(agg.buckets)} · meanWithinRealmVariance ${agg.meanWithinRealmVariance === null ? '—' : agg.meanWithinRealmVariance.toFixed(1)} · meanBoostedShieldShare ${agg.meanBoostedShieldShare === null ? '—' : agg.meanBoostedShieldShare.toFixed(3)}`);
    }
```

(The demoted descriptive means move to the third line, preserved but visually secondary to the timing headline — consistent with the metric amendment.)

- [ ] **Step 2: Run the sweep report to verify output**

Run: `node mockup/combat-calc/plan-battery.js --fg --quick`
Expected: prints three arms (`ctrl` / `fgM9on` / `fgM9off`), each showing a `decided ... · envelope(15-25) ... · median trip ...` line, a `tripTurn bins {...}` line, and a `buckets {...} · meanWithinRealmVariance ... · meanBoostedShieldShare ...` line. Values are noise at `--quick` (reps=2); this step checks the output shape and that the run does not error.

- [ ] **Step 3: Run the full suite to confirm no regression**

Run: `npm test`
Expected: PASS — all tests green (this task is display-only; the Task 1 tests still cover the fields).

- [ ] **Step 4: Commit**

```bash
git add mockup/combat-calc/plan-battery.js
git commit -m "feat(match-arc): print decision-timing headline in --fg sweep report

Surface envelopePct / medianTripTurn / tripTurnBins per arm; demote the
descriptive within-realm-variance and boostedShieldShare means to a
secondary line, per the 2026-07-09 metric amendment.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Notes for the implementer

- `pct(...)` is an existing helper in `plan-battery.js` used by the report (it formats a percentage; reuse it verbatim as shown). Do not redefine it.
- Do NOT touch `runFgSweep`, `runCradleTournament`, `runArm`, `runDArm`, or any file under the sealed engine/board set (`engine.js`, `map-board.js`, `match.js`, `tournament.js`). This plan changes only `plan-battery.js` (a measurement harness) and its test.
- If `npm test` reports an unrelated pre-existing failure, stop and report it rather than "fixing" it — this plan's scope is the three timing fields and their report line only.

## Out of scope (spec §9 / gated — do NOT implement here)

- Domination-victory check-fix (spec §6): a SPEC-5 amendment (user seal) plus two dial decisions; a separate plan once sealed.
- Escalation ramp (spec §5) and topology mechanics (spec §8): follow-on design passes.
