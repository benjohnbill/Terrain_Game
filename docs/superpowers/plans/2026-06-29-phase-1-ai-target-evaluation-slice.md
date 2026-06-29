# Phase 1 AI Target Evaluation Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make AI attack and defense choices evaluate local terrain-mediated force, garrison strength, target value, and crossing friction instead of relying on the defender's global military pool.

**Architecture:** Keep AI decision execution in `js/ai.js`, but split target scoring into small pure-ish helpers that can be unit tested through the existing browser-script VM harness. `AIPlayer.chooseBestTarget()` should rank targets with `CombatSystem.computeAttackForce()`, `CombatSystem.computeDefenseForce()`, and `CombatSystem.forecast()`; defensive posture should use a new local vulnerability score instead of only adjacent enemy count. This slice changes AI evaluation only, not combat resolution, UI command cards, or diplomacy rules.

**Tech Stack:** Static HTML, Canvas, plain browser JavaScript on `window`, Node.js built-in test runner (`node --test`) for logic tests, local `python3 -m http.server` for browser verification.

---

## Scope Check

The Phase 1 spec still contains several independent subsystems after the map-command and combat-core slices:

- AI target evaluation from local terrain, garrisons, economy, and strategic tags.
- Command-card preview and mobilization UI.
- Result report improvements.
- Movement/supply/route constraints.
- Province numeric balancing.

This plan implements only AI target evaluation. It deliberately does **not** add a player-facing mobilized attack UI, change combat formulas, implement movement pathing, rebalance all province data, or rewrite diplomacy behavior.

## Current Problem

`AIPlayer.chooseBestTarget()` currently penalizes a target by `defender.calculateMilitary()`:

```js
const defMil = defender.calculateMilitary();
score -= defMil * 0.5;
```

After the combat-core slice, that is the wrong defensive signal. Defense is now local:

- `hex.localGarrison`
- `hex.terrain`
- `hex.defenseValue`
- building defense
- active defense posture
- crossing penalty into river/coast/strait terrain

The AI should be willing to attack a weak local garrison owned by a strong faction, and should avoid a strong mountain/pass garrison even if the owning faction has low standing forces.

## File Structure

- Create `tests/ai-targeting.test.js`: focused tests for AI attack target scoring, crossing/port mitigation, strategic value, and defensive target choice.
- Modify `js/ai.js`: add `scoreTarget`, `_hasPortMitigation`, `_countOwnAdjacent`, `scoreDefenseNeed`; rewrite `chooseBestTarget` and `_tryDefend` to use those helpers.

## Design Rules

- No new runtime dependencies.
- Keep `AIPlayer.takeTurn()` public behavior and return shape unchanged.
- Do not change `ActionSystem.attack()` or `CombatSystem` in this slice.
- Keep randomness only as a small tie-breaker in `chooseBestTarget()`. Tests must set `Math.random = () => 0.5` before scoring.
- AI scoring may use numeric heuristics, but each major term must correspond to a Phase 1 concept:
  - local combat forecast,
  - local target value,
  - adjacency/position,
  - diplomacy/war status,
  - crossing/port friction,
  - fortification/building value.
- Commit messages end with:

```text
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

---

## Task 1: Add AI Targeting Test Harness

Create a dedicated AI targeting test file with reusable stubs. This task only adds the harness and one failing test that proves the current AI still prefers a target by global defender military instead of local defense.

**Files:**
- Create: `tests/ai-targeting.test.js`

**Interfaces:**
- Consumes: `AIPlayer.chooseBestTarget(game, faction)`.
- Produces: tests that load `AIPlayer` with `CombatSystem`.

- [ ] **Step 1: Write the failing test**

Create `tests/ai-targeting.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts } = require('./helpers/load-browser-scripts');

function loadAIScripts() {
  return loadScripts([
    'js/domain-data.js',
    'js/buildings.js',
    'js/faction.js',
    'js/map.js',
    'js/combat.js',
    'js/actions.js',
    'js/ai.js'
  ]);
}

function newFaction(ctx, id, military) {
  const faction = new ctx.Faction({
    id,
    name: 'F' + id,
    color: '#000',
    colorLight: '#111',
    emoji: '⬛'
  }, id !== 0);
  faction.military = military;
  faction.gold = 1000;
  return faction;
}

function makeHex(ctx, q, r, owner, terrain, localGarrison, defenseValue, economyValue, population) {
  const hex = new ctx.HexCell(q, r);
  hex.owner = owner;
  hex.terrain = terrain;
  hex.localGarrison = localGarrison;
  hex.defenseValue = defenseValue;
  hex.economyValue = economyValue;
  hex.population = population;
  hex.provinceName = `${q},${r}`;
  return hex;
}

function makeTargetGame(ctx, { faction, defenders, ownHexes, targetHexes }) {
  const allHexes = [...ownHexes, ...targetHexes];
  const factionById = { [faction.id]: faction };
  defenders.forEach((defender) => { factionById[defender.id] = defender; });

  const byKey = new Map(allHexes.map((hex) => [hex.key(), hex]));
  const neighborsByKey = new Map();

  for (const target of targetHexes) {
    neighborsByKey.set(target.key(), ownHexes.map((hex) => ({ q: hex.q, r: hex.r })));
  }
  for (const own of ownHexes) {
    neighborsByKey.set(own.key(), targetHexes.map((hex) => ({ q: hex.q, r: hex.r })));
  }

  return {
    factions: [faction, ...defenders],
    map: {
      getAdjacentEnemyHexes: () => targetHexes,
      getNeighbors: (q, r) => neighborsByKey.get(`${q},${r}`) || [],
      getHex: (q, r) => byKey.get(`${q},${r}`) || null,
      getHexByKey: (key) => byKey.get(key) || null
    },
    diplomacy: {
      isAlly: () => false,
      isAtWar: () => true,
      getEnemies: () => defenders.map((defender) => defender.id)
    },
    getFaction: (id) => factionById[id] || null,
    getAliveFactions: () => [faction, ...defenders].filter((item) => item.alive)
  };
}

test('AI prefers a weak local garrison even when it belongs to a strong faction', () => {
  const ctx = loadAIScripts();
  ctx.Math.random = () => 0.5;

  const ai = newFaction(ctx, 0, 90);
  const strongOwner = newFaction(ctx, 1, 220);
  const weakOwner = newFaction(ctx, 2, 20);

  const staging = makeHex(ctx, 5, 4, 0, 'plains', 8, 8, 10, 20);
  ai.territories.add(staging.key());

  const weakLocalTarget = makeHex(ctx, 5, 5, 1, 'plains', 4, 6, 10, 20);
  strongOwner.territories.add(weakLocalTarget.key());

  const strongLocalTarget = makeHex(ctx, 6, 5, 2, 'mountain_pass', 24, 30, 8, 18);
  weakOwner.territories.add(strongLocalTarget.key());

  const game = makeTargetGame(ctx, {
    faction: ai,
    defenders: [strongOwner, weakOwner],
    ownHexes: [staging],
    targetHexes: [weakLocalTarget, strongLocalTarget]
  });

  const chosen = ctx.AIPlayer.chooseBestTarget(game, ai);
  assert.equal(chosen, weakLocalTarget);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test tests/ai-targeting.test.js
```

Expected: FAIL. Current scoring subtracts the strong owner's global military and is likely to choose `strongLocalTarget` instead of `weakLocalTarget`.

- [ ] **Step 3: Commit the failing test**

Do not commit a failing test by itself unless your workflow requires red commits. For this repo, keep it uncommitted and proceed to Task 2.

---

## Task 2: Score Attack Targets With CombatSystem Forecast

Introduce `AIPlayer.scoreTarget()` and rewrite `chooseBestTarget()` around it. The score should prefer favorable local combat ratios, local value, war targets, and multi-adjacent staging positions while penalizing crossing friction and walls already represented in local defense.

**Files:**
- Modify: `js/ai.js`
- Test: `tests/ai-targeting.test.js`

**Interfaces:**
- Produces:
  - `AIPlayer.scoreTarget(game, faction, hex) -> number`
  - `AIPlayer._countOwnAdjacent(game, factionId, hex) -> number`
  - `AIPlayer._hasPortMitigation(game, factionId, hex) -> boolean`
  - `AIPlayer.chooseBestTarget(game, faction)` uses `scoreTarget`.

- [ ] **Step 1: Implement `scoreTarget` helpers**

In `js/ai.js`, add these methods inside `AIPlayer`, immediately before `chooseBestTarget`:

```js
  static _countOwnAdjacent(game, factionId, hex) {
    const neighbors = game.map.getNeighbors(hex.q, hex.r);
    let ownAdj = 0;
    for (const n of neighbors) {
      const nh = game.map.getHex(n.q, n.r);
      if (nh && nh.owner === factionId) ownAdj++;
    }
    return ownAdj;
  }

  static _hasPortMitigation(game, factionId, hex) {
    if (hex.primaryFunction === 'port') return true;
    const neighbors = game.map.getNeighbors(hex.q, hex.r);
    return neighbors.some((n) => {
      const nh = game.map.getHex(n.q, n.r);
      return nh && nh.owner === factionId && nh.primaryFunction === 'port';
    });
  }

  static scoreTarget(game, faction, hex) {
    if (!hex) return -Infinity;
    if (hex.owner === faction.id) return -Infinity;
    if (hex.owner !== null && game.diplomacy.isAlly(faction.id, hex.owner)) return -Infinity;

    const defender = hex.owner === null ? null : game.getFaction(hex.owner);
    const portMitigation = AIPlayer._hasPortMitigation(game, faction.id, hex);
    const attackForce = window.CombatSystem.computeAttackForce(faction, hex, { portMitigation });
    const defenseForce = window.CombatSystem.computeDefenseForce(hex, defender && defender.alive ? defender : null);
    const forecast = window.CombatSystem.forecast(attackForce, defenseForce);
    const crossingPenalty = window.CombatSystem.crossingPenalty(hex.terrain, portMitigation);
    const ownAdj = AIPlayer._countOwnAdjacent(game, faction.id, hex);

    let score = 50;

    // Local combat outlook is the main term.
    score += forecast.expected * 42;
    score -= defenseForce * 0.65;

    // Valuable provinces are worth taking even when not effortless.
    score += (hex.economyValue || 0) * 1.8;
    score += (hex.population || 0) * 0.35;

    // Better staging positions are safer and strategically cleaner.
    score += ownAdj * 8;

    if (hex.owner === null) {
      score += 20;
    } else if (game.diplomacy.isAtWar(faction.id, hex.owner)) {
      score += 38;
    } else {
      score += 14;
    }

    // Infrastructure is valuable, but walls are already included in defense.
    if (hex.building && hex.building !== 'wall') score += 12;

    // Crossing friction should matter even if the raw ratio is still favorable.
    score -= (1 - crossingPenalty) * 35;

    // Strategic tags are light nudges, not substitutes for local force.
    if (hex.strategicTags && hex.strategicTags.includes('capital')) score += 14;
    if (hex.strategicTags && hex.strategicTags.includes('port')) score += 10;
    if (hex.strategicTags && hex.strategicTags.includes('pass')) score += 6;

    return score;
  }
```

- [ ] **Step 2: Rewrite `chooseBestTarget`**

Replace the full existing `chooseBestTarget(game, faction)` method with:

```js
  static chooseBestTarget(game, faction) {
    const adjEnemy = game.map.getAdjacentEnemyHexes(faction.id);
    if (adjEnemy.length === 0) return null;

    const candidates = [];
    for (const item of adjEnemy) {
      const hex = typeof item === 'string' ? game.map.getHexByKey(item) : item;
      if (!hex) continue;
      const score = AIPlayer.scoreTarget(game, faction, hex) + Math.random() * 12 - 4;
      if (isFinite(score)) candidates.push({ hex, score });
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0].hex;
  }
```

- [ ] **Step 3: Run test to verify it passes**

Run:

```bash
node --test tests/ai-targeting.test.js
```

Expected: PASS for the first AI targeting test.

- [ ] **Step 4: Run existing combat tests**

Run:

```bash
node --test tests/combat.test.js tests/combat-attack.test.js
```

Expected: PASS. This task must not change combat resolution or attack side effects.

- [ ] **Step 5: Commit**

```bash
git add js/ai.js tests/ai-targeting.test.js
git commit -m "feat: score AI attack targets from local combat forecast" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Cover Crossing, Port Mitigation, And Strategic Value

Add tests that prove the scoring function sees both terrain/crossing friction and target value. These are score-level tests, not end-to-end turn tests, so failures point directly at the evaluation formula.

**Files:**
- Modify: `tests/ai-targeting.test.js`
- Modify: `js/ai.js` only if the Task 2 score formula needs correction.

- [ ] **Step 1: Add crossing and port tests**

Append to `tests/ai-targeting.test.js`:

```js
test('AI scoring penalizes coast and strait attacks unless a port mitigates the crossing', () => {
  const ctx = loadAIScripts();
  ctx.Math.random = () => 0.5;

  const ai = newFaction(ctx, 0, 90);
  const defender = newFaction(ctx, 1, 60);

  const staging = makeHex(ctx, 1, 0, 0, 'plains', 8, 8, 10, 20);
  const portStaging = makeHex(ctx, 2, 0, 0, 'plains', 8, 8, 10, 20);
  portStaging.primaryFunction = 'port';
  ai.territories.add(staging.key());
  ai.territories.add(portStaging.key());

  const coastWithoutPort = makeHex(ctx, 1, 1, 1, 'coast_strait', 8, 10, 11, 20);
  const coastWithPort = makeHex(ctx, 2, 1, 1, 'coast_strait', 8, 10, 11, 20);
  defender.territories.add(coastWithoutPort.key());
  defender.territories.add(coastWithPort.key());

  const noPortGame = makeTargetGame(ctx, {
    faction: ai,
    defenders: [defender],
    ownHexes: [staging],
    targetHexes: [coastWithoutPort]
  });
  const portGame = makeTargetGame(ctx, {
    faction: ai,
    defenders: [defender],
    ownHexes: [portStaging],
    targetHexes: [coastWithPort]
  });

  const noPortScore = ctx.AIPlayer.scoreTarget(noPortGame, ai, coastWithoutPort);
  const portScore = ctx.AIPlayer.scoreTarget(portGame, ai, coastWithPort);

  assert.ok(portScore > noPortScore);
});
```

- [ ] **Step 2: Add strategic value test**

Append to `tests/ai-targeting.test.js`:

```js
test('AI scoring can prefer a richer province when combat outlook is comparable', () => {
  const ctx = loadAIScripts();
  ctx.Math.random = () => 0.5;

  const ai = newFaction(ctx, 0, 100);
  const defender = newFaction(ctx, 1, 70);

  const staging = makeHex(ctx, 3, 0, 0, 'plains', 8, 8, 10, 20);
  ai.territories.add(staging.key());

  const poorTarget = makeHex(ctx, 3, 1, 1, 'plains', 8, 10, 4, 10);
  const richTarget = makeHex(ctx, 4, 1, 1, 'plains', 8, 10, 20, 36);
  richTarget.building = 'market';
  defender.territories.add(poorTarget.key());
  defender.territories.add(richTarget.key());

  const game = makeTargetGame(ctx, {
    faction: ai,
    defenders: [defender],
    ownHexes: [staging],
    targetHexes: [poorTarget, richTarget]
  });

  assert.ok(ctx.AIPlayer.scoreTarget(game, ai, richTarget) > ctx.AIPlayer.scoreTarget(game, ai, poorTarget));
  assert.equal(ctx.AIPlayer.chooseBestTarget(game, ai), richTarget);
});
```

- [ ] **Step 3: Run AI targeting tests**

Run:

```bash
node --test tests/ai-targeting.test.js
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add js/ai.js tests/ai-targeting.test.js
git commit -m "test: cover AI crossing and target-value scoring" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Make Defensive AI Choose Locally Vulnerable Hexes

`AIPlayer._tryDefend()` currently chooses the border hex with the most enemy neighbors. That can waste defense posture on a strong pass while leaving a weak plain/garrison exposed. Add `scoreDefenseNeed()` and use it inside `_tryDefend()`.

**Files:**
- Modify: `js/ai.js`
- Modify: `tests/ai-targeting.test.js`

**Interfaces:**
- Produces:
  - `AIPlayer.scoreDefenseNeed(game, faction, hex) -> number`
  - `_tryDefend()` chooses the highest local vulnerability score.

- [ ] **Step 1: Add failing defensive test**

Append to `tests/ai-targeting.test.js`:

```js
test('defensive AI chooses the locally vulnerable border hex over a naturally strong pass', () => {
  const ctx = loadAIScripts();
  ctx.Math.random = () => 0.5;

  const ai = newFaction(ctx, 0, 90);
  const enemy = newFaction(ctx, 1, 100);

  const weakPlain = makeHex(ctx, 5, 5, 0, 'plains', 3, 6, 8, 20);
  const strongPass = makeHex(ctx, 6, 5, 0, 'mountain_pass', 28, 28, 8, 18);
  const enemyNearPlain = makeHex(ctx, 5, 6, 1, 'plains', 8, 8, 10, 20);
  const enemyNearPass = makeHex(ctx, 6, 6, 1, 'plains', 8, 8, 10, 20);
  ai.territories.add(weakPlain.key());
  ai.territories.add(strongPass.key());
  enemy.territories.add(enemyNearPlain.key());
  enemy.territories.add(enemyNearPass.key());

  const game = makeTargetGame(ctx, {
    faction: ai,
    defenders: [enemy],
    ownHexes: [weakPlain, strongPass],
    targetHexes: [enemyNearPlain, enemyNearPass]
  });
  game.map.getAdjacentEnemyHexes = () => [enemyNearPlain, enemyNearPass];

  const result = ctx.AIPlayer._tryDefend(game, ai);
  assert.equal(result.action, 'defend');
  assert.equal(result.params.targetHex, weakPlain);
  assert.equal(ai.defendingHex, weakPlain.key());
});
```

- [ ] **Step 2: Implement defensive score**

In `js/ai.js`, add this method before `_tryDefend`:

```js
  static scoreDefenseNeed(game, faction, hex) {
    if (!hex || hex.owner !== faction.id) return -Infinity;

    const localDefense = window.CombatSystem.computeDefenseForce(hex, faction);
    const neighbors = game.map.getNeighbors(hex.q, hex.r);
    let pressure = 0;
    let enemyCount = 0;

    for (const n of neighbors) {
      const nh = game.map.getHex(n.q, n.r);
      if (!nh || nh.owner === null || nh.owner === faction.id) continue;
      if (game.diplomacy.isAlly(faction.id, nh.owner)) continue;

      const enemy = game.getFaction(nh.owner);
      if (!enemy || !enemy.alive) continue;

      const portMitigation = AIPlayer._hasPortMitigation(game, enemy.id, hex);
      const enemyAttack = window.CombatSystem.computeAttackForce(enemy, hex, { portMitigation });
      pressure += enemyAttack;
      enemyCount++;
    }

    if (enemyCount === 0) return -Infinity;

    const value = (hex.economyValue || 0) * 1.4 + (hex.population || 0) * 0.25;
    const vulnerability = pressure / Math.max(1, localDefense);
    return vulnerability * 70 + enemyCount * 8 + value;
  }
```

- [ ] **Step 3: Rewrite `_tryDefend` selection loop**

Inside `_tryDefend(game, faction)`, replace the current "Find most vulnerable border hex" loop with:

```js
    let bestHex = null;
    let bestScore = -Infinity;

    for (const key of hexKeys) {
      const hex = game.map.getHexByKey(key);
      const score = AIPlayer.scoreDefenseNeed(game, faction, hex);
      if (score > bestScore) {
        bestScore = score;
        bestHex = hex;
      }
    }

    if (bestHex && isFinite(bestScore)) {
      const result = window.ActionSystem.defend(game, faction, bestHex);
      if (result.success) {
        game.addEvent(result.message, faction.id);
        faction.actionTaken = true;
        return { action: 'defend', params: { targetHex: bestHex }, result };
      }
    }
```

Keep the existing fallback that defends the first owned hex when no vulnerable border exists.

- [ ] **Step 4: Run defensive AI test**

Run:

```bash
node --test tests/ai-targeting.test.js
```

Expected: PASS.

- [ ] **Step 5: Run full suite**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add js/ai.js tests/ai-targeting.test.js
git commit -m "feat: choose defensive AI posture from local vulnerability" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Add End-To-End AI Turn Regression

Add one integration test that proves `AIPlayer.takeTurn()` uses the local target scoring through the normal AI action path, not only through `chooseBestTarget()`.

**Files:**
- Modify: `tests/ai-targeting.test.js`

- [ ] **Step 1: Add `takeTurn` regression test**

Append to `tests/ai-targeting.test.js`:

```js
test('takeTurn attacks the locally weak target through the normal AI action path', () => {
  const ctx = loadAIScripts();
  ctx.Math.random = () => 0.5;

  const ai = newFaction(ctx, 0, 120);
  const strongOwner = newFaction(ctx, 1, 120);
  const weakOwner = newFaction(ctx, 2, 20);

  const staging = makeHex(ctx, 8, 7, 0, 'plains', 8, 8, 10, 20);
  ai.territories.add(staging.key());

  const weakLocalTarget = makeHex(ctx, 8, 8, 1, 'plains', 4, 6, 12, 24);
  strongOwner.territories.add(weakLocalTarget.key());

  const strongLocalTarget = makeHex(ctx, 9, 8, 2, 'mountain_pass', 24, 30, 8, 18);
  weakOwner.territories.add(strongLocalTarget.key());

  const events = [];
  const game = makeTargetGame(ctx, {
    faction: ai,
    defenders: [strongOwner, weakOwner],
    ownHexes: [staging],
    targetHexes: [weakLocalTarget, strongLocalTarget]
  });
  game.rng = () => 0.5;
  game.addEvent = (message, factionId) => events.push({ message, factionId });

  const result = ctx.AIPlayer.takeTurn(game, ai);

  assert.equal(result.action, 'attack');
  assert.equal(result.params.targetHex, weakLocalTarget);
  assert.equal(weakLocalTarget.owner, ai.id);
  assert.equal(ai.actionTaken, true);
  assert.equal(events.length, 1);
});
```

- [ ] **Step 2: Run AI targeting tests**

Run:

```bash
node --test tests/ai-targeting.test.js
```

Expected: PASS.

- [ ] **Step 3: Run full suite**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add tests/ai-targeting.test.js
git commit -m "test: cover AI turn target choice with local defense model" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Browser Smoke Verification

Verify that the AI still takes turns in the browser without console errors after the targeting rewrite.

**Files:**
- No code changes expected.

- [ ] **Step 1: Run full tests**

Run:

```bash
npm test
```

Expected: PASS.

- [ ] **Step 2: Start static server**

Run:

```bash
python3 -m http.server 8007
```

Expected: server starts at `http://localhost:8007`.

- [ ] **Step 3: Browser smoke**

Open `http://localhost:8007`, start a singleplayer game, and verify:

- the game loads without console errors;
- `window.AIPlayer.scoreTarget` exists;
- `window.AIPlayer.scoreDefenseNeed` exists;
- clicking "다음 턴" lets at least one AI faction complete a turn;
- the event log receives an AI action message;
- no `CombatSystem is not defined` or `scoreTarget is not a function` errors appear.

If the canvas is blank under WSLg Chrome, dispatch a resize event and re-check:

```js
window.dispatchEvent(new Event('resize'));
```

- [ ] **Step 4: Commit if browser-only fixes were needed**

If no code changes were needed, do not create an empty commit. If fixes were needed:

```bash
git add js/ai.js tests/ai-targeting.test.js
git commit -m "fix: stabilize AI targeting browser turn flow" -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**

- AI evaluation based on local targets rather than raw global strength: covered by Tasks 1, 2, and 5.
- Terrain/garrison/fortification-aware target choice: covered by Tasks 1 and 2.
- Crossing and port mitigation relevance: covered by Task 3.
- Strategic target value from economy/population/building: covered by Task 3.
- Defensive key point/vulnerability behavior: covered by Task 4.
- Full movement/supply pathing: intentionally out of scope.
- Player command preview and result report: intentionally out of scope.

**Placeholder scan:**

- No placeholder markers.
- Every test task includes exact test code.
- Every implementation task includes exact method bodies or replacement code.
- Every verification step includes exact commands and expected output.

**Type/name consistency:**

- `scoreTarget`, `_countOwnAdjacent`, `_hasPortMitigation`, and `scoreDefenseNeed` are defined before use.
- Tests load `js/combat.js` before `js/ai.js`.
- `makeTargetGame()` provides every map/diplomacy method used by the new scoring helpers.
- Combat calls match existing `CombatSystem` signatures.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-29-phase-1-ai-target-evaluation-slice.md`. Two execution options:

1. **Subagent-Driven (recommended)** - Dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
