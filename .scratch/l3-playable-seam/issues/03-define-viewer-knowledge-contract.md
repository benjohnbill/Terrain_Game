# Define What Each Viewer Can Know

Type: grilling
Status: open
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
