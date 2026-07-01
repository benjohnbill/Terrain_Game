# Fog of War and Discovery — Design (Standard Fog MVP)

Date: 2026-07-01

Status: Design approved (brainstorming complete); ready for implementation planning.

## 1. Purpose

Limit information at game start so that locating and reading opponents becomes a
high-stakes skill, terrain matters from the first turn, and every match is a
fresh discovery. Opponent count and ratio are known; opponent positions are not.

This feature deepens the existing information/scouting pillar (`js/intel.js`) by
giving it real stakes, and it answers the macro-replayability gap: random spawns
plus fog make every playthrough different.

## 2. Design Guardrail — Skill-Piercable Uncertainty, Not Fate

Every loss must trace to a decision (did not scout, ignored intel, misjudged the
response), never to the spawn roll alone.

**Test:** could a perfect player in the same seat have survived? If yes, the fog
is fair. If no, it is fate.

The design below satisfies this test by construction (see Section 6).

## 3. Ratified Decisions (from the brainstorming session)

1. **Scope = position fog (A).** Terrain is fully visible from turn 1. Only the
   *occupant* of a hex (who holds it and how strong) is hidden. Full terrain fog
   (B) is deferred to the Challenge dial setting.
2. **AI information model = contact-gating.** Each faction holds a lightweight
   `contactedFactions` set. No per-hex AI knowledge map. The AI only targets
   factions it has made contact with; before contact it expands into neutral or
   undiscovered space, exactly like a fair human.
3. **Reveal model = passive border vision + active scout.** Owned hexes passively
   reveal the occupant of adjacent (ring-1) hexes at no action cost. The active
   scout action (one turn action) either sharpens a ring-1 glimpse toward
   reliable or reveals an undiscovered ring-2 hex.
4. **Intensity dial = define three, ship one.** Casual / Standard / Challenge are
   defined in this spec; the MVP implements Standard only. The dial UI and the
   Casual/Challenge behaviors are deferred.
5. **Ambiguity model = estimate ranges (2b), not advisory labels (2a).** In the
   ambiguous middle state the magnitude of an occupant is shown as a
   true-containing estimate range that scouting narrows. Identity is revealed at
   glimpse; identity fog is deferred to Challenge.

## 4. The Knowledge Model

A hex's occupant sits in one of three knowledge states. Terrain is always known
(position fog); only the occupant is fogged.

```
UNKNOWN (no contact) ── AMBIGUOUS (glimpsed) ── KNOWN (scouted-reliable / owned)
   nothing shown          <— the design space —>        truth shown
```

The design work is entirely in the AMBIGUOUS middle. Within it, an occupant has
three information dimensions that resolve at different fidelities:

| Dimension | Meaning | Nature |
|-----------|---------|--------|
| Presence  | Is anyone here? | binary |
| Identity  | Exactly which faction | discrete |
| Magnitude | How much military strength | continuous (estimate) |

Fidelity per state:

| State | Presence | Identity | Magnitude |
|-------|----------|----------|-----------|
| Unknown   | ✗ | ✗ | ✗ |
| Ambiguous | ✔ | ✔ (Standard; fogged only under Challenge) | estimate range |
| Known     | ✔ | ✔ exact | exact (owned) / near-exact residual (scouted enemy) |

### Mapping to `informationConfidence`

The existing single scalar per hex is reused. Its range widens from
`[0.45, 0.90]` to `[0, 0.90]`, where `0` means the occupant is undiscovered.

| Confidence | State | Map treatment (terrain always drawn) |
|------------|-------|--------------------------------------|
| `0` | Unknown | Terrain only. Occupant layer replaced by a neutral "unknown" treatment — no faction color, no owner cue. Must not reveal whether the hex is owned or by whom. |
| `> 0` and `< RELIABLE_THRESHOLD` (0.75) | Ambiguous (glimpse/partial) | Occupant shown with the existing low-confidence styling (purple/uncertain). Magnitude shown as a bucket or wide band. |
| `>= RELIABLE_THRESHOLD` (enemy, ceiling `MAX_CONFIDENCE` 0.90) | Known (scouted) | Occupant shown; magnitude shown as a narrow band or bucket. A residual sliver never fully collapses (see Section 5). |
| Owned | Known (owned) | Full detail; exact magnitude. |

## 5. Estimate-Range Mechanics (the AMBIGUOUS magnitude)

Magnitude in the ambiguous state is a deterministic, true-containing range that
narrows as confidence rises. The mechanics below are the fairness core.

### 5.1 True value is always inside the range

A range that excludes the truth would make scouting-then-losing feel like fate.
The truth is guaranteed to lie within the displayed range at every confidence
level.

### 5.2 The range is not centered on the truth

A symmetric range `[T - D, T + D]` leaks the answer: the midpoint equals the
true value `T`. Instead, the truth sits at a stable, hidden fraction `p` of the
range:

```
band = [ T - p*W , T + (1-p)*W ]
```

- `W` is the range width (see 5.3).
- `p ∈ [0, 1]` is derived deterministically from a per-hex seed (`hexSeed`), so
  the range is stable across renders and turns (no jitter) and the player cannot
  infer `T` from the endpoints.
- The player's best point-estimate is the midpoint, but `T` may be anywhere in
  the range — committing on the midpoint is a genuine judgment risk, not a dice
  betrayal.

`hexSeed` is derived from the hex coordinates (a deterministic hash), independent
of any gameplay RNG, so the estimate never flickers.

### 5.3 Width is proportional to the true value

Absolute-width ranges misbehave at the extremes (a small garrison becomes exact,
a huge host becomes trivially known). Width is proportional, with a small
absolute floor:

```
D = trueValue * PCT * u  +  ABS_FLOOR * u
W = 2 * D
```

`u` is the normalized uncertainty derived from confidence: maximal at the glimpse
floor, shrinking as confidence rises.

### 5.4 Scouting asymptotes; it never collapses (residual ceiling)

Enemy confidence is capped at `MAX_CONFIDENCE = 0.90` (already in the code:
"enemy land is never perfectly known"). Therefore `u` never reaches `0` for enemy
hexes, and `W` floors at a small residual. A very-well-scouted enemy hex reads as
"~10 give or take", never a bare exact number. The last sliver is the ownership
premium: only taking the ground yields an exact value. Committing on scouted
intel always carries a hair of risk, which is the intended tension.

### 5.5 Estimates are perishable (live-fuzzed + decay)

The displayed range is computed live from the current true value and current
confidence (`estimateRange(currentTrue, currentConfidence, hexSeed)`). Confidence
decays each round when a hex is not re-observed, so a scouted near-exact estimate
widens back toward vague over time. Stale intel becomes *vaguer*, never *wrong*
(the range still contains the truth). Owned land stays exact and permanent.

- Scouted enemy: near-exact, temporary, costs actions/gold, never perfect.
- Owned land: exact, permanent.

Genuinely stale/incorrect snapshot intel (a remembered value that no longer
contains the current truth) is a richer but heavier model and is deferred.

### 5.6 Preview forecasts over the range

The attack preview already shows an outcome band (`forecast.low..high`) that comes
from the combat dice. Under this model the preview forecasts across the magnitude
range as well (evaluate the forecast at the range's low / mid / high defender
strength). The single outcome band the UI already shows then reflects *both*
information uncertainty and combat uncertainty:

- Poor information → wider outcome band → risky to commit.
- Scouting → narrower outcome band → confident commit.

Actual combat still resolves on the true value. This is preview-only; combat
formulas are unchanged.

## 6. Spawns and the Skill-vs-Fate Guardrails

### 6.1 Random spawns

`Map._getStartPositions` currently assigns a fixed anchor per faction id
(deterministic corners/edges). Replace the fixed pick with a spacing-constrained
random placement. Keep the current starting-territory shape (an anchor hex plus
two neighbors).

### 6.2 Minimum spawn spacing (the one remaining guardrail knob)

The nearest owned hexes of any two factions must be separated by a buffer of
undiscovered hexes such that:

- passive ring-1 vision never reveals another faction on turn 1;
- there is at least one turn of buffer before contact;
- the buffer is crossable by a scout in time to react.

Start from a minimum separation of roughly three hexes and scale with map size
and faction count; relax gracefully when the map cannot satisfy the target. The
exact value is a tuning knob (Section 11).

### 6.3 The four guardrails are satisfied by construction

| Guardrail | Mechanism |
|-----------|-----------|
| Warning signal before blindness | Passive ring-1 vision — total blindness at the border is impossible. |
| Scout reachability in time | Active scout reveals ring-2, catching a threat before it reaches the border. |
| Viable counter-response | Existing defend / garrison mechanics. |
| Minimum spawn spacing | Section 6.2. |

Together these make the answer to the guardrail test "yes": a perfect player
always has border warning, forward reconnaissance, a response, and a buffer.

## 7. AI Contact-Gating

- Each faction holds `contactedFactions: Set<factionId>`.
- Contact with faction X is established when: the faction's territory becomes
  adjacent to a hex owned by X; the faction scouts a hex owned by X; or combat
  occurs with X.
- AI target selection (`js/ai.js`) filters candidate targets to hexes whose owner
  is `null` (neutral) or in the AI's `contactedFactions`. Before contact the AI
  expands into neutral/undiscovered space (its existing behavior already favors
  neutral and border hexes).
- Optional refinement: the AI does not open diplomacy (war/alliance) against an
  uncontacted faction.
- This is behavioral symmetry: the AI acts only on factions it has plausibly
  found, so a human who scouts well is never rushed from an unknowable direction.
  No per-hex AI knowledge map is required.

## 8. Presets and the Map-First Briefing Under Fog

### 8.1 Briefing operates on discovered information only

- Threats and opportunities are ranked among *discovered* hexes only.
- New blind-spot briefing items are emitted when a contiguous undiscovered region
  borders the player, or when a known-to-exist faction (from the start-of-game
  count/ratio) remains uncontacted. These use the ADR 0013 purple = "scouting
  need" color and point at the blind direction.

### 8.2 The scout-early preset is emergent, not forced

- The prefilled command for an undiscovered or uncertain hex already defaults to
  `scout` in the situation analyzer. Clicking a purple blind-spot ping opens a
  prefilled scout card — one click, no forced automation.

### 8.3 The casual floor

Passive ring-1 vision (cannot be blindsided) + spawn spacing (buffer) + the
purple blind-spot nudge (told where to look) + the one-click prefilled scout
means a casual player who simply follows the briefing's prefilled suggestions
scouts adequately and survives. Skill is deviating from that baseline: scouting a
high-threat direction earlier, or skipping a scout for tempo when the situation is
judged safe.

## 9. Fog Intensity Dial

The dial axis is "how much is hidden / how much free help is given". A
`FogProfile` object is injected at game setup; the MVP hardcodes Standard.

| Setting | Starting knowledge | Passive vision | Spawn spacing | Terrain |
|---------|--------------------|----------------|---------------|---------|
| Casual (deferred) | Approximate opponent region hints | ring-1 + ring-2 | generous | fully visible (A) |
| **Standard (MVP)** | Count + ratio only | ring-1 | default | fully visible (A) |
| Challenge (deferred) | Count + ratio only | weaker (e.g., ring-1 costs an action) | tight | terrain fog (B), identity fogged |

The seam is the `FogProfile` injection point. Adding a setup toggle later is
additive; no core rework is required.

## 10. Scope

### In the MVP (Standard fog)

- Extend `informationConfidence` to `[0, 0.90]` with `0` = undiscovered.
- Passive ring-1 vision each round: reveal presence + identity + magnitude
  estimate for hexes adjacent to owned territory.
- Active scout: reveal an undiscovered ring-2 hex to glimpse, or sharpen a ring-1
  glimpse toward reliable. Scout reach extends to distance 2.
- Deterministic `estimateRange(trueValue, confidence, hexSeed)`: off-center
  stable position, proportional width, residual ceiling, live-fuzzed.
- Attack preview forecasts over the magnitude range.
- Random spawns with minimum spacing (replace the fixed anchor pick).
- AI contact-gating via `contactedFactions`.
- Briefing blind-spot items + prefilled scout.
- Occupant-fog rendering (terrain always drawn; occupant hidden/graded by
  confidence).
- `FogProfile` seam, Standard hardcoded.

### Deferred (YAGNI / ADR 0018 / Challenge dial)

- Terrain fog (B): reveal radius, per-hex terrain memory, terrain fog rendering,
  scout movement units.
- Casual and Challenge profiles and the dial UI toggle.
- Identity fog.
- Snapshot/stale-incorrect intel (MVP is live-fuzzed only).
- Re-fogging discovered hexes back to `0`.
- A seedable gameplay RNG for replay (recommended for testability but not
  required; the estimate `hexSeed` is deterministic regardless).
- Economy/population magnitude fuzzing (MVP fuzzes military strength only; the
  same `estimateRange` extends to other stats trivially later).
- Per-hex AI fog map (the contact set replaces it).
- Espionage / diplomacy intel channels; multiplayer.

## 11. Open Tuning Knobs (to the plan / playtest)

- Scout gain: whether one scout nearly reaches the ceiling (thin middle) or
  several scouts are needed (textured middle). Current `SCOUT_GAIN = 0.25`
  reaches near-ceiling in one action.
- Estimate width: `PCT` and `ABS_FLOOR`.
- Residual ceiling size at `MAX_CONFIDENCE`.
- Spawn spacing value and its scaling with map size / faction count.
- Reconcile `OWNED_CONFIDENCE` (0.85) with `MAX_CONFIDENCE` (0.90): owned land
  should read as exact (range width 0); decide whether owned confidence stays
  0.85 for display or is treated as exact for magnitude.

## 12. Relationship to Existing Code

- `js/intel.js` — widen the range to `[0, 0.90]`; add an undiscovered sentinel;
  add `estimateRange`; add a passive-reveal helper; adjust `maintainConfidence`
  for passive ring-1.
- `js/situation.js` — distinguish undiscovered from ambiguous; emit blind-spot
  signals.
- `js/command-preview.js` — forecast over the magnitude range; expose bucket/band.
- `js/ui.js` — render the magnitude bucket/band and the occupant-fog card states.
- `js/map.js` — random spawn with spacing (replace the `_getStartPositions` pick);
  occupant-fog rendering in `_renderHex`; passive vision each round.
- `js/game.js` — passive vision in `_startRound`; contact-tracking hooks; scout
  reach to distance 2.
- `js/ai.js` — `contactedFactions` set and target filtering.
- New: a small `FogProfile` configuration (module or constant).

## 13. Testing

Pure-function and logic tests (`node --test`):

- `estimateRange`: truth is always inside the range; the range narrows
  monotonically as confidence rises; a nonzero residual remains at the enemy
  ceiling; output is deterministic/stable for fixed inputs; the midpoint is
  generally not the truth.
- Passive vision and scout reveal transitions (unknown → glimpse → reliable).
- Contact-gating: the AI does not target an uncontacted faction.
- Spawn spacing: generated spawns satisfy the minimum-separation rule.
- Briefing: blind-spot items are emitted for uncontacted factions / undiscovered
  border regions.

Rendering and the end-to-end feel are browser-verified (no automated browser
harness): `python3 -m http.server 8007`.

## 14. Success Criteria

- A player starts blind, uses passive border vision plus scouting to locate and
  estimate opponents, and every loss traces to a decision (the guardrail test
  passes).
- A casual player on prefilled commands is never blindsided (passive ring-1 +
  spacing).
- Scouting visibly tightens the attack preview's outcome band (the felt payoff).
- Random spawns make each match a fresh discovery.

## 15. Related

- `SPEC.md` — "Positioning and Fun Pillars" (skill is fitting the situation;
  information has confidence and uncertainty).
- `docs/features/fog-of-war-discovery/INDEX.md` — the feature thread this design
  resolves.
- `docs/adr/0013-map-first-situation-ux.md` — the briefing and the purple
  scouting-need color.
- `docs/adr/0017-positioning-civ-depth-lol-shaped-interaction.md` — opt-in depth;
  the low floor / opt-in ceiling test.
- `docs/adr/0018-phase-1-mvp-core-fun-first.md` — MVP discipline; defer heavy
  systems until the core is validated.
- `docs/adr/0009-force-roles-and-mobilization-risks.md`,
  `docs/adr/0014-local-garrison-sustainment.md` — anti-snowball counterplay.
- `docs/superpowers/plans/2026-06-29-phase-1-scouting-information-slice.md` — the
  shipped scouting slice this design extends.
