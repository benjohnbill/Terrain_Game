# Define the L3 Verification and Acceptance Gates

Type: grilling
Status: open
Blocked by: 02, 03, 05, 08, 09

## Question

What executable evidence must pass before the L3 playable seam is accepted:
type safety, deterministic browser/Node parity, legacy regressions, viewer
information non-leakage, authored-map fidelity, one-match completion, runtime
browser behavior, and human Fog/scouting comprehension?

## Decision constraints

- Selected-behavior parity, canonical-rule conformance, and L3 product
  acceptance are different claims. None may stand in for another
  (`.scratch/l3-playable-seam/spec.md:342-350`).
- Tests should enter through the highest useful seam: authored input plus
  viewer intent, then ordered events and refreshed viewer projection. Private
  Runtime helpers and React hook arrangement are not acceptance surfaces
  (`.scratch/l3-playable-seam/spec.md:353-367`).
- Browser and Node must execute the emitted ESM behavior selected by gate 05.
  A successful Vite transform or source-level unit test alone does not prove
  loader/artifact parity
  (`.scratch/l3-playable-seam/research/toolchain-coexistence.md:158-172`).
- Human comprehension is L3 evidence. Automation can prove absence, event
  ordering, and deterministic state transitions; it cannot prove that the user
  correctly reads Fog or understands what scouting changed.
- The retained CommonJS suite, authored-map gates, Fog/Intel tests, combat
  batteries, and browser loader are evidence inventories. They are not all
  automatically canonical behavior.

## Evidence stack to settle

### Gate 1 — static and module integrity

- TypeScript typecheck passes independently of Vite.
- Production build and emitted Runtime build pass.
- Forbidden dependencies are absent from framework-free Runtime/rule modules:
  React, DOM, renderer objects, browser globals, implicit clock, and implicit
  entropy.

### Gate 2 — deterministic Runtime contract

- Equal world identity, revision, binding, seed, and intent log yield equal
  ordered events and viewer projections in repeat runs.
- Actor order is enforced; invalid/stale/out-of-turn intents return a reportable
  rejection without transition.
- A scripted scenario replays from the canonical durable representation without
  snapshots.

### Gate 3 — viewer-information non-leakage

- Projection payloads, preview cards, events, renderer inputs, serialized DOM,
  accessibility text, and ordinary UI surfaces contain no forbidden truth keys
  or values.
- Strong relational checks vary only a hidden truth value and confirm that a
  viewer output stays equal wherever the knowledge contract says it must; when
  a band is allowed to change, its output remains true-containing without
  exposing the midpoint as truth.
- Bots pass the same checks against their own projections.

### Gate 4 — authored-world fidelity

- Identity/revision, stable IDs, referential integrity, sector/map-unit
  membership, topology, choke/route data, landmarks, and accepted seat binding
  pass the Production validator.
- The production artifact is compared with the accepted authoring export, while
  B1/B2 and other offline admission gates are reported separately from Runtime
  schema validation.

### Gate 5 — canonical rule conformance and selected legacy parity

- Every L3-invoked operation names its Production birthplace and passes its
  contract tests.
- Legacy tests/fixtures are classified as accepted, structurally obsolete,
  superseded, or incidental before use. Only accepted carried-forward behavior
  receives a parity report.
- R14 placeholders, standalone movement, bot stall closure, and legacy victory
  checks are negative-path tests, not untested conventions.

### Gate 6 — real-browser product path

- The production artifact loads over HTTP at the accepted viewport and static
  hosting path.
- Map focus, command preview, reconnaissance, atomic operation, bot-event
  pacing, round progression, legal war outcome, complete match ending, and new
  match reset work without developer controls.
- At least one deterministic acceptance scenario runs in Node and through the
  browser harness selected by gate 05; a production-app smoke test covers its
  actual Vite/static-hosting assembly.

### Gate 7 — live L3 comprehension

A human playtester must, without developer explanation:

1. distinguish public, own-exact, estimated, last-seen, and hidden information;
2. explain what a border alarm reveals and withholds;
3. predict what reconnaissance should change, perform it, and identify the
   actual change in both map reading and preview;
4. explain one bot action and one battle result from the event presentation;
5. finish one match and state why it ended.

Record viewport, build identity, world revision, seed, intent log, outcome, and
observed misunderstanding. This is evidence, not a usability opinion omitted
from the gate.

## Evidence-based option space

### A. Require the complete stacked gate

All seven layers pass before canonical-route promotion. Fast layers run on each
ticket; slower browser and live layers run at named milestones.

- **Strength:** localizes failures and prevents a green unit suite from being
  misreported as a playable L3 match.
- **Cost:** requires maintaining a small deterministic browser scenario and a
  human acceptance record in addition to unit tests.

### B. Automate everything except an informal playtest

- **Strength:** simpler CI status.
- **Cost:** contradicts the project's L3 ladder: Fog comprehension and map
  legibility are precisely the claims automation cannot establish.

### C. Treat one successful manual match as acceptance

- **Strength:** fastest apparent route to a demo.
- **Cost:** cannot prove determinism, non-leakage, reproducibility, or the
  absence of legacy/R14 shortcuts. This is not an eligible L3 gate.

## Recommendation

Choose A. Gate each implementation ticket with the narrowest applicable subset,
then require the full stack before issue 08 promotes the route. Gate 05 should
give every automated layer one named command, while the live comprehension run
produces a dated record tied to a build/world/seed rather than pretending to be
CI.

The honest cost is one maintained browser acceptance path and deliberate human
time at prototype/promotion milestones. This recommendation does not resolve
the gate; the user must confirm the required layers, exact parity strength, and
human pass criteria.
