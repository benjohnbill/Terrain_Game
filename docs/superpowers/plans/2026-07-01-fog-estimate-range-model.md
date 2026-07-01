# Fog Estimate-Range Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `informationConfidence` into a real information *resource* — the defender's strength on an attack target is shown as a deterministic, true-containing estimate range that narrows as confidence rises (never collapsing to exact), and the attack preview forecasts across that range so scouting visibly tightens the outcome band.

**Architecture:** Add a pure `estimateRange` transform (plus a stable per-hex seed and a coarse magnitude bucket) to `IntelSystem`, the single source of truth for confidence numbers. The attack preview computes the true effective defense force as today, then wraps it in an estimate range and forecasts at the range's worst/best/mid defense to produce a range-aware outcome band. The command card shows the estimate (a qualitative bucket at a glimpse, a near-exact numeric band when reliable) instead of the raw true defense number. Combat math is unchanged; this is preview/display only.

**Tech Stack:** Static HTML, Canvas, plain browser JavaScript on `window`, Node.js built-in test runner (`node --test`) for logic tests, local `python3 -m http.server 8007` for browser verification.

## Slice Context

This is **slice 1 of the Fog of War and Discovery MVP** (design spec:
`docs/superpowers/specs/2026-07-01-fog-of-war-discovery-design.md`). It builds the
estimate-range accuracy layer (the "ambiguous magnitude" of spec §5) on the
already-visible map. It deliberately does **not** hide anything yet.

Deferred to later slices (named here so scope is clear, not implemented now):

- **Slice 2 — Occupant visibility fog:** widen confidence to `[0, 0.90]` with `0`
  = undiscovered, passive ring-1 border vision, active scout reaching ring-2,
  occupant-fog map rendering, scout-reveal wiring.
- **Slice 3 — Fog world:** random spawns with minimum spacing, AI contact-gating
  (`contactedFactions`), briefing blind-spot items, the `FogProfile` seam.

## Global Constraints

- No new dependencies. Standard library / platform / existing modules only.
- Do not change `CombatSystem` formulas. The preview reads combat outputs and
  forecasts over a range; it does not alter combat math. Actual combat still
  resolves on the true value.
- All confidence thresholds and transforms live in `IntelSystem`; no other file
  hard-codes a confidence threshold or transform.
- User-facing in-game text is Korean, matching the current UI. Code comments and
  plan text are neutral professional English.
- The estimate range must always contain the true value at every confidence
  level, must be stable per hex (deterministic, no jitter), and must not be
  centered on the truth (the midpoint is a guess, not the answer).
- Run `npm test` (`node --test tests/*.test.js`) for logic; use the static server
  (`python3 -m http.server 8007`) for browser verification.

## File Structure

- `js/intel.js` — add the estimate-range model: `hexSeed`, `estimateRange`,
  `magnitudeBucket`, plus the private uncertainty/seed helpers and their tuning
  constants. This file remains the only source of truth for confidence numbers.
- `js/command-preview.js` — in `buildAttackPreview`, wrap the true defense force
  in an estimate range, forecast across it, and expose `defenseEstimate` (with a
  display label) and `forecastRange`; carry the same shape through `invalid()`.
- `js/ui.js` — the attack command card shows `defenseEstimate.label` instead of
  the raw defense number and uses `forecastRange` for the outcome band/range.
- `tests/intel.test.js` — property tests for `estimateRange` / `hexSeed` /
  `magnitudeBucket`.
- `tests/command-preview.test.js` — tests for the range-aware preview fields.

No new files. No `index.html` change (`js/intel.js` is already loaded).

---

## Task 1: Add the Estimate-Range Model to `IntelSystem`

Add the pure transform first. The preview (Task 2) depends on it.

**Files:**
- Modify: `js/intel.js`
- Test: `tests/intel.test.js`

**Interfaces:**
- Consumes: existing `round2`, `DECAY_FLOOR`, `MAX_CONFIDENCE` (already in the module).
- Produces (added to `window.IntelSystem`):
  - `hexSeed(q, r) -> number` — a stable unsigned 32-bit seed from hex coordinates.
  - `estimateRange(trueValue, confidence, seed) -> { low, high, mid, width }` — a
    true-containing range; width shrinks as confidence rises, floors at a nonzero
    residual at `MAX_CONFIDENCE`, and is positioned off-center by `seed`.
  - `magnitudeBucket(value) -> '소'|'중'|'대'|'특대'` — coarse qualitative bucket.

- [ ] **Step 1: Write the failing tests**

Append to `tests/intel.test.js`:

```js
test('estimateRange always contains the true value', () => {
  const ctx = loadIntel();
  const seed = ctx.IntelSystem.hexSeed(3, 4);
  for (const t of [1, 5, 10, 27, 100]) {
    for (const c of [0.45, 0.55, 0.7, 0.85, 0.9]) {
      const r = ctx.IntelSystem.estimateRange(t, c, seed);
      assert.ok(r.low <= t && t <= r.high, `true ${t} must be inside [${r.low}, ${r.high}] at c=${c}`);
    }
  }
});

test('estimateRange is deterministic for the same inputs', () => {
  const ctx = loadIntel();
  const seed = ctx.IntelSystem.hexSeed(2, 9);
  const a = ctx.IntelSystem.estimateRange(20, 0.5, seed);
  const b = ctx.IntelSystem.estimateRange(20, 0.5, seed);
  assert.deepEqual(a, b);
});

test('estimateRange narrows as confidence rises', () => {
  const ctx = loadIntel();
  const seed = ctx.IntelSystem.hexSeed(6, 1);
  const glimpse = ctx.IntelSystem.estimateRange(20, 0.45, seed);
  const reliable = ctx.IntelSystem.estimateRange(20, 0.85, seed);
  assert.ok(glimpse.width > reliable.width, `glimpse width ${glimpse.width} > reliable width ${reliable.width}`);
});

test('estimateRange keeps a nonzero residual at the enemy ceiling (never exact)', () => {
  const ctx = loadIntel();
  const seed = ctx.IntelSystem.hexSeed(6, 1);
  const ceiling = ctx.IntelSystem.estimateRange(20, 0.9, seed);
  const overCeiling = ctx.IntelSystem.estimateRange(20, 0.99, seed); // clamped to 0.9
  assert.ok(ceiling.width > 0, 'width must not collapse to zero for a scouted enemy hex');
  assert.equal(overCeiling.width, ceiling.width);
});

test('estimateRange position varies with the hex seed (not centered on the truth)', () => {
  const ctx = loadIntel();
  const lows = [1, 2, 3, 4, 5].map((s) => ctx.IntelSystem.estimateRange(20, 0.45, s).low);
  assert.ok(new Set(lows).size > 1, 'range position must depend on the hex seed');
});

test('hexSeed is a stable nonnegative integer per coordinate', () => {
  const ctx = loadIntel();
  assert.equal(ctx.IntelSystem.hexSeed(3, 4), ctx.IntelSystem.hexSeed(3, 4));
  assert.ok(ctx.IntelSystem.hexSeed(3, 4) >= 0);
  assert.notEqual(ctx.IntelSystem.hexSeed(3, 4), ctx.IntelSystem.hexSeed(4, 3));
});

test('magnitudeBucket classifies strength into coarse tiers', () => {
  const ctx = loadIntel();
  assert.equal(ctx.IntelSystem.magnitudeBucket(5), '소');
  assert.equal(ctx.IntelSystem.magnitudeBucket(16), '중');
  assert.equal(ctx.IntelSystem.magnitudeBucket(28), '대');
  assert.equal(ctx.IntelSystem.magnitudeBucket(50), '특대');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
node --test tests/intel.test.js
```

Expected: FAIL — `estimateRange` / `hexSeed` / `magnitudeBucket` are not functions.

- [ ] **Step 3: Implement the model in `js/intel.js`**

In `js/intel.js`, immediately after the `tierOf` function (its closing `}` on the
line before the comment `// The only mutator: ...`) and before that comment,
insert:

```js
  /* ── Estimate-range model (fog "ambiguous" magnitude — design spec §5) ──
   * Tuning knobs live here (see spec §11). Uncertainty maps a confidence scalar
   * to a band half-width: maximal at the glimpse floor, a small nonzero residual
   * at the enemy ceiling. It never collapses to exact — only ownership is exact. */
  const U_AT_FLOOR = 1.0;   // uncertainty at/below DECAY_FLOOR (0.45)
  const U_AT_CEIL = 0.15;   // residual uncertainty at/above MAX_CONFIDENCE (0.90)
  const WIDTH_PCT = 0.35;   // band half-width as a fraction of the true value at u = 1

  function _clamp(value, lo, hi) {
    return Math.max(lo, Math.min(hi, value));
  }

  // Normalized uncertainty (U_AT_FLOOR .. U_AT_CEIL) from a confidence scalar.
  function _uncertainty(confidence) {
    const c = _clamp(typeof confidence === 'number' ? confidence : 0, DECAY_FLOOR, MAX_CONFIDENCE);
    const frac = (c - DECAY_FLOOR) / (MAX_CONFIDENCE - DECAY_FLOOR); // 0 at floor, 1 at ceiling
    return U_AT_FLOOR + frac * (U_AT_CEIL - U_AT_FLOOR);
  }

  // Stable unsigned 32-bit seed from hex coordinates (independent of gameplay RNG).
  function hexSeed(q, r) {
    const a = ((q | 0) * 73856093) | 0;
    const b = ((r | 0) * 19349663) | 0;
    return (a ^ b) >>> 0;
  }

  // Stable pseudo-random position in [0, 1) from a seed (no gameplay RNG).
  function _seedToUnit(seed) {
    const s = Math.sin(((seed >>> 0) + 1) * 12.9898) * 43758.5453;
    return s - Math.floor(s);
  }

  // A true-containing estimate range whose width shrinks as confidence rises and
  // whose center is offset from the truth by a stable per-hex position `p`, so the
  // midpoint is a guess rather than the answer.
  function estimateRange(trueValue, confidence, seed) {
    const t = typeof trueValue === 'number' && trueValue > 0 ? trueValue : 0;
    const u = _uncertainty(confidence);
    const half = t * WIDTH_PCT * u;
    const width = 2 * half;
    const p = _seedToUnit(typeof seed === 'number' ? seed : 0); // hidden position of the truth, [0,1)
    const low = Math.max(0, round2(t - p * width));
    const high = round2(t + (1 - p) * width);
    return { low, high, mid: round2((low + high) / 2), width: round2(width) };
  }

  // Coarse qualitative magnitude bucket for display. Thresholds are tuning knobs.
  function magnitudeBucket(value) {
    const v = typeof value === 'number' ? value : 0;
    if (v < 12) return '소';
    if (v < 22) return '중';
    if (v < 35) return '대';
    return '특대';
  }

```

- [ ] **Step 4: Export the new functions**

In `js/intel.js`, in the `window.IntelSystem = Object.freeze({ ... })` block,
change:

```js
    isReliable,
    tierOf,
    maintainConfidence
  });
```

to:

```js
    isReliable,
    tierOf,
    maintainConfidence,
    hexSeed,
    estimateRange,
    magnitudeBucket
  });
```

- [ ] **Step 5: Run tests to verify they pass**

Run:

```bash
node --test tests/intel.test.js
```

Expected: PASS (existing tests plus the seven new ones).

- [ ] **Step 6: Commit**

```bash
git add js/intel.js tests/intel.test.js
git commit -m "feat: add estimate-range model to IntelSystem"
```

---

## Task 2: Forecast the Attack Preview Over the Estimated Defense Range

Wrap the true defense force in an estimate range, forecast at the range's
worst/best/mid defense, and expose `defenseEstimate` (with a display label) and
`forecastRange`. The existing `defenseForce` (true) and `forecast` (point) fields
are kept unchanged for combat and back-compat.

**Files:**
- Modify: `js/command-preview.js`
- Test: `tests/command-preview.test.js`

**Interfaces:**
- Consumes: `IntelSystem.hexSeed`, `IntelSystem.estimateRange`,
  `IntelSystem.tierOf`, `IntelSystem.magnitudeBucket`, `CombatSystem.forecast`.
- Produces (added to `buildAttackPreview`'s return, and to `invalid()` for parity):
  - `defenseEstimate: { low, high, mid, width, label, tier } | null`
  - `forecastRange: { low, expected, high, band } | null`

- [ ] **Step 1: Write the failing tests**

Append to `tests/command-preview.test.js`:

```js
test('attack preview estimates defender strength as a true-containing range that narrows with confidence', () => {
  const ctx = loadPreviewScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);

  const ownHex = new ctx.HexCell(4, 4);
  ownHex.owner = 0;
  attacker.territories.add(ownHex.key());

  function target(confidence) {
    const targetHex = new ctx.HexCell(4, 5);
    targetHex.owner = 1;
    targetHex.terrain = 'plains';
    targetHex.localGarrison = 12;
    targetHex.defenseValue = 14;
    targetHex.informationConfidence = confidence;
    return targetHex;
  }

  const lowConf = target(0.45);
  const gameLow = makeGame(ctx, { attacker, defender, targetHex: lowConf, ownHex });
  const pLow = ctx.CommandPreview.buildAttackPreview(gameLow, attacker, lowConf, { mobilize: false });

  const highConf = target(0.85);
  const gameHigh = makeGame(ctx, { attacker, defender, targetHex: highConf, ownHex });
  const pHigh = ctx.CommandPreview.buildAttackPreview(gameHigh, attacker, highConf, { mobilize: false });

  // True defense force is always inside the estimate.
  assert.ok(pLow.defenseEstimate.low <= pLow.defenseForce && pLow.defenseForce <= pLow.defenseEstimate.high);
  assert.ok(pHigh.defenseEstimate.low <= pHigh.defenseForce && pHigh.defenseForce <= pHigh.defenseEstimate.high);
  // Higher confidence -> narrower estimate.
  assert.ok(pLow.defenseEstimate.width > pHigh.defenseEstimate.width);
});

test('attack preview widens the outcome forecast when information is poor', () => {
  const ctx = loadPreviewScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);

  const ownHex = new ctx.HexCell(4, 4);
  ownHex.owner = 0;
  attacker.territories.add(ownHex.key());

  const targetHex = new ctx.HexCell(4, 5);
  targetHex.owner = 1;
  targetHex.terrain = 'plains';
  targetHex.localGarrison = 12;
  targetHex.defenseValue = 14;
  targetHex.informationConfidence = 0.45;

  const game = makeGame(ctx, { attacker, defender, targetHex, ownHex });
  const preview = ctx.CommandPreview.buildAttackPreview(game, attacker, targetHex, { mobilize: false });

  const pointSpread = preview.forecast.high - preview.forecast.low;
  const rangeSpread = preview.forecastRange.high - preview.forecastRange.low;
  assert.ok(rangeSpread >= pointSpread, 'information uncertainty must not shrink the outcome band');
  assert.ok(rangeSpread > pointSpread, 'a low-confidence target should widen the outcome band');
});

test('attack preview shows a bucket label at a glimpse and a numeric label when reliable', () => {
  const ctx = loadPreviewScripts();
  const attacker = newFaction(ctx, 0);
  const defender = newFaction(ctx, 1);

  const ownHex = new ctx.HexCell(4, 4);
  ownHex.owner = 0;
  attacker.territories.add(ownHex.key());

  function labelAt(confidence) {
    const targetHex = new ctx.HexCell(4, 5);
    targetHex.owner = 1;
    targetHex.terrain = 'plains';
    targetHex.localGarrison = 12;
    targetHex.defenseValue = 14;
    targetHex.informationConfidence = confidence;
    const game = makeGame(ctx, { attacker, defender, targetHex, ownHex });
    return ctx.CommandPreview.buildAttackPreview(game, attacker, targetHex, { mobilize: false }).defenseEstimate.label;
  }

  assert.ok(!labelAt(0.45).startsWith('약'), 'a glimpse should show a qualitative bucket');
  assert.ok(labelAt(0.85).startsWith('약'), 'reliable info should show a near-exact numeric label');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
node --test tests/command-preview.test.js
```

Expected: FAIL — `preview.defenseEstimate` and `preview.forecastRange` are `undefined`.

- [ ] **Step 3: Carry the new fields through `invalid()`**

In `js/command-preview.js`, in the `invalid(kind, targetHex, message)` helper,
change:

```js
      confidence: null,
      intel: null,
      intelReliable: false,
      scout: { available: false, confidenceAfter: null },
      warnings: []
    };
```

to:

```js
      confidence: null,
      intel: null,
      intelReliable: false,
      scout: { available: false, confidenceAfter: null },
      defenseEstimate: null,
      forecastRange: null,
      warnings: []
    };
```

- [ ] **Step 4: Build the estimate and range forecast in `buildAttackPreview`**

In `js/command-preview.js`, in `buildAttackPreview`, immediately after the block:

```js
    const intel = confidence === null ? null : window.IntelSystem.tierOf(confidence);
    const intelReliable = confidence === null ? true : window.IntelSystem.isReliable(confidence);
    if (!intelReliable) {
      warnings.push({ level: 'medium', text: '정보 신뢰도가 낮아 예측이 부정확할 수 있습니다. 정찰로 정확도를 높이세요.' });
    }
```

insert:

```js
    // Estimate the defender's strength as a true-containing range (spec §5).
    // Combat still resolves on the true defenseForce; this is preview-only.
    const defenseSeed = window.IntelSystem.hexSeed(targetHex.q, targetHex.r);
    const estimate = confidence === null
      ? { low: defenseForce, high: defenseForce, mid: defenseForce, width: 0 }
      : window.IntelSystem.estimateRange(defenseForce, confidence, defenseSeed);

    const dTier = confidence === null ? 'reliable' : window.IntelSystem.tierOf(confidence).id;
    let defenseLabel;
    if (estimate.width === 0) {
      defenseLabel = `${Math.round(estimate.mid)}`;
    } else if (dTier === 'reliable') {
      defenseLabel = `약 ${Math.round(estimate.low)}~${Math.round(estimate.high)}`;
    } else {
      const bLow = window.IntelSystem.magnitudeBucket(estimate.low);
      const bHigh = window.IntelSystem.magnitudeBucket(estimate.high);
      defenseLabel = bLow === bHigh ? bLow : `${bLow}~${bHigh}`;
    }
    const defenseEstimate = { ...estimate, label: defenseLabel, tier: dTier };

    // Forecast across the estimated defense band: strongest defense is the
    // attacker's worst case, weakest defense the best case, mid the best guess.
    const dLow = Math.max(1, estimate.low);
    const dMid = Math.max(1, estimate.mid);
    const dHigh = Math.max(1, estimate.high);
    const fMid = window.CombatSystem.forecast(attackForce, dMid);
    const forecastRange = {
      low: window.CombatSystem.forecast(attackForce, dHigh).low,
      expected: fMid.expected,
      high: window.CombatSystem.forecast(attackForce, dLow).high,
      band: fMid.band
    };
```

Then, in the same function's returned object, change:

```js
      scout: {
        available: true,
        confidenceAfter: confidence === null ? null : window.IntelSystem.applyScout(confidence)
      },
      warnings
    };
```

to:

```js
      scout: {
        available: true,
        confidenceAfter: confidence === null ? null : window.IntelSystem.applyScout(confidence)
      },
      defenseEstimate,
      forecastRange,
      warnings
    };
```

- [ ] **Step 5: Run tests to verify they pass**

Run:

```bash
node --test tests/command-preview.test.js
```

Expected: PASS (existing preview tests plus the three new ones).

- [ ] **Step 6: Run the full suite**

Run:

```bash
npm test
```

Expected: PASS for all `tests/*.test.js`.

- [ ] **Step 7: Commit**

```bash
git add js/command-preview.js tests/command-preview.test.js
git commit -m "feat: forecast attack preview over the estimated defense range"
```

---

## Task 3: Show the Estimate on the Command Card

The attack card currently prints the raw true defense force (`🛡{defenseForce}`),
which leaks perfect information. Show `defenseEstimate.label` instead, and use the
range-aware `forecastRange` for the outcome band and range. No new CSS.

**Files:**
- Modify: `js/ui.js`

**Interfaces:**
- Consumes: `preview.defenseEstimate.label`, `preview.forecastRange.{band,low,high}`,
  with a fallback to the existing `preview.forecast` when `forecastRange` is absent.

- [ ] **Step 1: Read the estimate and range into locals**

In `js/ui.js`, in `updateCommandCard()`, in the attack branch, change:

```js
    if (command.preview && command.preview.kind === 'attack') {
      const preview = command.preview;
      const forecast = preview.forecast;
```

to:

```js
    if (command.preview && command.preview.kind === 'attack') {
      const preview = command.preview;
      const forecast = preview.forecast;
      const range = preview.forecastRange || forecast;
      const defenseText = preview.defenseEstimate ? preview.defenseEstimate.label : String(preview.defenseForce);
```

- [ ] **Step 2: Render the estimate and range instead of the raw defense number**

In the same attack branch, change these three rows:

```js
        <div class="command-card-row"><span>예상 전력</span><strong>⚔${preview.attackForce} vs 🛡${preview.defenseForce}</strong></div>
        <div class="command-card-row"><span>전황</span><strong>${forecast ? forecast.band : '-'}</strong></div>
        <div class="command-card-row"><span>예상 범위</span><strong>${forecast ? `${forecast.low.toFixed(2)}-${forecast.high.toFixed(2)}` : '-'}</strong></div>
```

to:

```js
        <div class="command-card-row"><span>예상 전력</span><strong>⚔${preview.attackForce} vs 🛡${this._escape(defenseText)}</strong></div>
        <div class="command-card-row"><span>전황</span><strong>${range ? range.band : '-'}</strong></div>
        <div class="command-card-row"><span>예상 범위</span><strong>${range ? `${range.low.toFixed(2)}-${range.high.toFixed(2)}` : '-'}</strong></div>
```

- [ ] **Step 3: Run the full suite (no regressions)**

Run:

```bash
npm test
```

Expected: PASS. (The command card is browser-verified in Task 4; the logic tests
confirm no module regressions.)

- [ ] **Step 4: Commit**

```bash
git add js/ui.js
git commit -m "feat: show defense estimate and range on the command card"
```

---

## Task 4: Runtime Browser Verification

Verify the estimate range renders and that scouting visibly narrows it. This
project has no automated browser harness, so use the local server and a manual
pass.

**Files:**
- No source edits expected.

- [ ] **Step 1: Start the local server**

Run:

```bash
python3 -m http.server 8007
```

Expected: the server serves on port 8007 and stays running.

- [ ] **Step 2: Open the app and select a low-confidence enemy target**

Open `http://localhost:8007`, start a singleplayer game, and click an enemy hex
adjacent to the player faction so the attack card opens.

Expected:

- The `예상 전력` row shows `⚔<number> vs 🛡<bucket>` (e.g. `🛡중` or `🛡중~대`),
  not a bare defense number.
- The `전황` and `예상 범위` rows reflect a wider outcome band than a
  fully-known target would show.
- The `정보` row shows a low/partial tier with its percentage, and the `정찰`
  button is present with the medium "정보 신뢰도가 낮아…" warning.

- [ ] **Step 3: Scout the target and confirm the estimate tightens**

Click `정찰`, end the turn, cycle back, and reopen the same hex's attack card.

Expected:

- The `정보` tier rises; once it reaches the reliable tier the `예상 전력`
  defense reads as a near-exact numeric band (e.g. `🛡약 24~27`), never a bare
  exact number.
- The `예상 범위` outcome band is visibly narrower than at the glimpse.
- No console errors throughout.

- [ ] **Step 4: Run the full suite again**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 5: Commit any verification-only fixes**

If runtime verification required a small fix, commit it with the touched files.
If no changes were needed, do not create an empty commit.

```bash
git add js/intel.js js/command-preview.js js/ui.js
git commit -m "fix: align estimate-range runtime behavior"
```

---

## Self-Review

### Spec Coverage

- Spec §5.1 (true always inside the range): Task 1 `estimateRange` construction +
  the containment test.
- Spec §5.2 (not centered on the truth; stable per-hex position): Task 1 `p`
  from `_seedToUnit(seed)` + the seed-variance test.
- Spec §5.3 (width proportional to the true value): Task 1 `WIDTH_PCT` +
  the narrowing test.
- Spec §5.4 (residual ceiling — never collapses to exact for enemy): Task 1
  `U_AT_CEIL` + the nonzero-residual test.
- Spec §5.6 (preview forecasts over the range): Task 2 `forecastRange` + the
  band-widening test.
- Spec decision A (bucket → exact display): Task 2 `defenseEstimate.label`
  (bucket at glimpse, numeric when reliable) + Task 3 card rendering.
- Combat math unchanged: `CombatSystem` is not modified; the preview only reads
  `forecast`/`computeDefenseForce` outputs.
- Explicitly out of this slice (deferred to slices 2–3): occupant visibility fog,
  passive vision, random spawns, AI contact-gating, briefing blind-spots,
  `FogProfile`.

### Placeholder Scan

No `TBD`/`TODO`/"handle edge cases"/"similar to Task N" placeholders. Every
code-changing step contains exact code or exact old→new replacement text.

### Type Consistency

- `IntelSystem.hexSeed(q, r) -> number`, `IntelSystem.estimateRange(trueValue,
  confidence, seed) -> { low, high, mid, width }`, and
  `IntelSystem.magnitudeBucket(value) -> string` are defined in Task 1 and
  consumed unchanged in Task 2.
- `preview.defenseEstimate` (with `label`, `tier`) and `preview.forecastRange`
  (with `band`, `low`, `high`) use identical names across Task 2 (producer) and
  Task 3 (consumer), and `invalid()` carries the same keys (as `null`).
- `preview.defenseForce` (true) and `preview.forecast` (point) are unchanged, so
  existing preview tests still pass.
