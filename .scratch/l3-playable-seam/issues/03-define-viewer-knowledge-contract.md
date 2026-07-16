# Define What Each Viewer Can Know

Type: grilling
Status: resolved
Blocked by: none

## Question

For the L3 Standard Fog experience, which map and match facts are public,
exact to the owner, estimated, last-seen, or categorically hidden from each
viewer? Resolve the old/new document tension around territorial control and
specify the non-leak invariants that every viewer projection must satisfy.

## Decision constraints

- The Runtime privately owns match truth and applies Fog exactly once when it
  creates a viewer projection. Forbidden values must be absent from that
  projection, not present under a display convention
  ([issue 02](02-define-game-runtime-authority.md)).
- Preview is a pure consumer of `(viewer projection, candidate intent)`. The
  projection must therefore contain every viewer-legal fact needed to decide
  command eligibility and calculate a banded preview without a truth fallback.
- Geography is public from turn 0. Terrain and fortification grade are public;
  own-force projections are exact; enemy substance and fatigue use
  true-containing estimate bands; standing posture and current commit remain
  unreachable before resolution
  (`docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md:248-292`).
- Reconnaissance narrows substance and fatigue bands and fixes last-seen army
  position. Unobserved position becomes a deterministic reach cone; border
  alarm reveals an entering force's existence and heading but not magnitude or
  posture (`docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md:267-277`).
- Standard Fog must remain skill-piercable and deterministic. It cannot invent
  false signals or reveal the truth through a range midpoint
  (`docs/superpowers/specs/2026-07-01-fog-of-war-discovery-design.md:87-148`).

## Recorded tension to resolve

The earlier Fog design says an unknown hex reveals neither whether it is
occupied nor who owns it, and makes occupant identity contact-gated
(`docs/superpowers/specs/2026-07-01-fog-of-war-discovery-design.md:48-85`). The
later Slice 2 ruling retires map discovery, says the unknown thing is the
opponent's state, and explicitly lists substance, fatigue, army position,
posture, and commit as the fogged layer — but it does not classify current
political control (`docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md:248-260`).
L3 cannot leave that gap implicit because control affects map color, target
identity, ally/self checks, route access, province status, and event feedback.

## Preview input audit

The legacy attack preview reads all of the following: target control and
diplomatic relationship, adjacency, the actor's military and economy, public
terrain and fortification, and defending force
(`js/command-preview.js:37-104`). It then returns both truth-derived
`defenseForce`/`forecast` and banded `defenseEstimate`/`forecastRange`
(`js/command-preview.js:119-157`). The new projection must replace that shape
with viewer-legal inputs only:

- exact own resources, force, action capacity, relationships, and legal actor;
- public geography, routes, terrain, fortification, and the control treatment
  selected here;
- enemy estimate bands and confidence metadata, never the true defending force;
- last-seen fix, age, and derived reach cone for tracked detachments;
- categorical border alarms and post-resolution reports without hidden
  magnitude fields.

If preview ever accepts a truth value and promises not to render it, the
structural guarantee from issue 02 has failed.

## Evidence-based option space

### A. Public political control; Fog only the military state

Current realm/sector control and diplomatic identity are public map facts.
Mutable enemy military substance, fatigue, detachment position, posture, and
commit follow their accepted bands or hidden categories.

- **Strength:** preserves a legible political map, gives preview legal target
  identity without a secondary reveal rule, and matches the later Slice 2 list.
- **Cost:** retires the earlier fantasy that an uncontacted hex hides its owner;
  surprise comes from force disposition and intent rather than secret borders.

### B. Contact-gated control from the earlier Fog design

An unseen sector shows public terrain but no current owner; contact reveals
presence and identity.

- **Strength:** preserves the older position-fog discovery experience.
- **Cost:** requires separate rules for stale control, captures outside vision,
  route legality, diplomacy, province status, and map recoloring. Those rules do
  not exist in the later Slice 2 contract and would enlarge L3 substantially.

### C. Last-seen political control

Show the last observed owner with an age marker until a report or observation
updates it.

- **Strength:** makes territorial intelligence perishable without rendering the
  map blank.
- **Cost:** adds a new history and notification model not currently sealed, and
  risks showing a legal target whose displayed control is known to be stale.

## Recommendation

Choose A for Standard Fog. Treat region/sector identity, terrain,
fortification, routes, diplomacy, and current political control as public;
show own mutable state exactly; show enemy substance and fatigue only as
estimate bands; show detachment position as last-seen plus reach cone; expose
border alarm as existence plus heading; and keep standing posture/current
commit categorically absent until post-resolution reporting.

The honest cost is giving up hidden political borders in Standard Fog. That is
the smaller and more coherent cost than inventing an unsealed stale-control
game inside the L3 integration pass. This recommendation does not resolve the
gate; the user must choose the control treatment and confirm the resulting
knowledge matrix.

## Answer

Adopt option A. Standard Fog makes the land and everything derived from the
land public, and fogs only the **mutable draw** a realm makes on that land —
its serving force, that force's condition and position, and the intentions
behind it. The matrix below is user-sealed; the invariants are consequences of
[issue 02](02-define-game-runtime-authority.md), not new decisions.

### 1. Current political control is public

Region/sector identity, terrain, fortification grade, routes, diplomatic
relationships, and **current political control** are public map facts from turn
0, at every confidence level. Control is not placed under the
`informationConfidence` layer at all.

Decision basis (user, 2026-07-17): *situation judgment* (형세판단, `DOMAIN_MAP.md`
`Situation judgment`) is the stage-1 structured reading the player performs
before issuing any command. A board whose political map is unreadable gives that
reading nothing to read — public control is a precondition of the reading
existing, not a concession inside it. The user additionally ruled that subjecting
control to a confidence judgment is "too harsh" — control has no confidence
channel, rather than a permanently high one.

The recorded old/new tension dissolves rather than being overruled. The
2026-07-01 design's rule — "must not reveal whether the hex is owned or by whom"
(`docs/superpowers/specs/2026-07-01-fog-of-war-discovery-design.md:82`) — hides a
single `occupant`, which in the pre-Slice-2 hex model was simultaneously the
political owner and the garrison standing on it. Slice 2 split that entity: field
armies became independent mobile forces with their own position model
(`docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md:274-277`).
What the old rule protected — enemy force disposition — survives intact under A,
because army position remains fogged as last-seen plus reach cone. Only the other
half of the split concept, political border secrecy, is retired.

Consequence: the confidence interval `[0, 0.45)` is permanently dead. The
2026-07-01 spec §4 directed widening `informationConfidence` from `[0.45, 0.90]`
to `[0, 0.90]`, where `0` meant an undiscovered occupant
(`docs/superpowers/specs/2026-07-01-fog-of-war-discovery-design.md:77-78`). That
widening was the map-discovery model's territory and was never implemented —
`js/intel.js:61` still clamps to `[DECAY_FLOOR, MAX_CONFIDENCE]` = `[0.45, 0.90]`.
Slice 2 retired map discovery ("Geography is public from turn 0", user stamp
2026-07-14) and A completes that retirement. The live floor is therefore correct
and now sealed rather than an unimplemented instruction: `DECAY_FLOOR = 0.45`
("ambient awareness floor for non-owned hexes", `js/intel.js:17`) is the
authoritative bottom of the scale.

### 2. Land-derived economy is public; the draw on it is banded

The register and the economy are already sealed as functions of land, so
option A settles them by derivation rather than by a second decision:

- 징집 명부 is "**land-derived and finite within a match**: 명부 = registerPerPop ×
  Σ populationValue" (`docs/features/match-arc/GLOSSARY.md`, 징집 명부 row,
  AGREED 2026-07-04 / re-founded MT-②).
- A sector's "derivations (**economy/register/population**) leave with the land"
  (`docs/features/match-arc/GLOSSARY.md`, 방치 이탈 row, CE-⑮).
- `capLandFrac` is sealed at **1** — "the ceiling follows conquered-population
  reality" (`docs/features/match-arc/GLOSSARY.md`, AB-②).

Public control plus public terrain therefore make land value, yield, and the
**register pool** computable from public facts. What stays hidden is what the
realm *did* with that endowment: how many bodies it moved into serving status.

This is fog **RULING ①** applied to people instead of walls. That ruling
(`docs/features/fog-of-war-discovery/RULINGS.md`, SEALED 2026-07-08, user grill)
holds that "physical structures are visible from outside; the hidden quantity is
how many defenders man them, which the magnitude estimate band already covers."
Land and the people on it are the visible structure; `serving` is the manning.
The register decision is not new law — it is the existing ruling's principle
reaching its second subject.

Two quantities then fall out with **zero new dials**, because each is a public
term combined with an already-banded one:

- **civilian register** = register pool (public) − serving (banded) → banded.
  This is exactly the `bodies` term of the affordability bound.
- **동원 강도** (mobilization intensity) = serving (banded) ÷ register (public) →
  banded. Reading "that realm is scraping the bottom" becomes a scoutable
  judgment for free.

### 3. Treasury is absent from the projection; it survives only as 판세 band width

Enemy treasury is **not a field in the viewer projection** — no number, no band,
no display convention. Its uncertainty is expressed solely by widening the
banded 판세 estimate the player already reads.

Decision basis (user, 2026-07-17). The sealed 패권 결정점 row already fixes this
shape: "The system trips on true values; players read a **banded 판세 estimate**"
(`docs/features/match-arc/GLOSSARY.md`, AGREED 2026-07-04, rulings ⑨⑪⑮⑰). The
player's contract is with 판세, not with the treasury underneath it. Treasury is a
true-side input to unassailability via the affordability bound — futures =
`min(headroom, rate, money, bodies)`, money fitted against "treasury +
regenWindow × income" (`docs/features/match-arc/GLOSSARY.md`, Affordability bound
row, AGREED 2026-07-11 AB-① · L2, ADR 0033) — and the Runtime must propagate that
input's uncertainty into the 판세 band. That propagation work is required by the
existing 판세 seal regardless of this gate; this decision adds no channel to it.

Spending channels confirmed by the user (2026-07-17): recruitment, fortification,
development, and supply — supply being a future concept outside L3.

Rejected alternatives:

- **Public treasury.** Retires economic surprise: the exact turn a rival can
  afford a surge becomes calculable, and the 서지 모병 depth axis loses its bluff.
- **Independent treasury band.** Requires a new realm-level confidence channel.
  Every existing band is driven by per-sector `informationConfidence`
  (`js/intel.js:81`, `estimateRange(trueValue, confidence, seed)`), and treasury
  has no spatial anchor. A capital anchor was considered and rejected as
  unsealed invention: `docs/features/capital/GLOSSARY.md` registers only
  `capital (수도)` and `capital guard (근위대)`, with no treasury location.
- **Derived band from accumulated history** (treasury = Σ public income − Σ
  inferred spend). Proposed and withdrawn during this grill. It is the same
  historical-snapshot model that the 2026-07-01 spec itself deferred as "a richer
  but heavier model"
  (`docs/superpowers/specs/2026-07-01-fog-of-war-discovery-design.md:153-154`),
  and the same shape rejected above as control option C. It also contradicts the
  live band contract: `estimateRange(trueValue, confidence, seed)` takes the
  **current** true value and **current** confidence (`js/intel.js:81`), so a
  history-convolved treasury would be the only quantity in the game computed by
  accumulation. Its inputs were sound — fortification spend is public by RULING ①
  and development is a visible work on public land — but its shape was wrong.

### 4. The sealed knowledge matrix

User-sealed 2026-07-17.

| Grade | Facts | Basis |
|---|---|---|
| **Public** (at every confidence level) | terrain · fortification grade · routes · diplomatic relationships · **current political control** · land value / yield · **register pool** | fog RULING ① · this gate §1 · land-derived (§2) |
| **Exact** (own realm only) | own substance · fatigue · position · treasury · register · action capacity · commit pool | Slice 2 D1, "no fog on self" |
| **Estimate band** (`[0.45, 0.90]`) | enemy substance · enemy fatigue | Slice 2 information ladder |
| **Estimate band, derived** (zero new dials) | civilian register (pool − serving) · 동원 강도 (serving ÷ pool) · **판세** (includes treasury uncertainty) | this gate §2, §3 |
| **Last-seen fix + reach cone** | enemy field-army position | Slice 2 (도달 원뿔) |
| **Categorical** (existence + heading only) | border alarm | Slice 2 (국경 경보) |
| **Absent from the projection** | enemy standing posture · enemy commit allocation · **enemy treasury** | 깜깜이 시장 · this gate §3 |

### 5. Non-leak invariants

Consequences of [issue 02](02-define-game-runtime-authority.md) and the seals
above. Every viewer projection must satisfy all seven:

1. Forbidden values are **absent** from the projection — not present under a
   display convention.
2. Blur is applied **exactly once**, when the Runtime builds the projection. No
   downstream surface re-derives an estimate from truth.
3. Preview consumes `(viewer projection, candidate intent)` only. It never
   receives a truth value, including one it promises not to render.
4. No `estimate || truth` fallback anywhere. A falsy estimate is a contract
   failure, not an occasion to reach for the true value.
5. **A missing confidence record yields the floor band (0.45), never truth.**
6. Enemy bands never collapse: ceiling `MAX_CONFIDENCE = 0.90`, residual sliver
   preserved (`js/intel.js:18`, spec §5.4).
7. Bands are true-containing and the midpoint is not the truth — the hidden
   position `p` is seed-derived and stable (`js/intel.js:81-95`, spec §5.2).

### 6. Named violations in current code

The build must not inherit these; they are cited as the concrete shape of what
invariants 1, 4, and 5 forbid.

- `js/command-preview.js:102-103` — when `confidence === null` the estimate is
  `{ low: defenseForce, high: defenseForce, mid: defenseForce, width: 0 }`: the
  **true** defense returned as a zero-width band. Violates invariants 1 and 5.
- `js/command-preview.js:104` — `estimateRange(defenseForce, confidence,
  defenseSeed)` blurs at read time from a truth the preview already holds.
  Violates invariants 2 and 3.
- `js/command-preview.js:78` and `:155-156` — truth-derived `forecast` (from the
  true `defenseForce`) returned alongside banded `defenseEstimate` /
  `forecastRange`, with UI fallbacks preferring the estimate only when it is
  truthy. Violates invariants 1 and 4.
