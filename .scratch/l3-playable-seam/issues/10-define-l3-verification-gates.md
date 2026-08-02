# Define the L3 Verification and Acceptance Gates

Type: grilling
Status: **resolved — SEALED 2026-08-02 (user grill); see § Resolution**
Blocked by: 02, 03, 05, 08, 09 — all resolved (09 closed 2026-08-02 from above by
ADR 0041; see its § Resolution, which also hands this gate a residue)

> **Read Gate 5 below with ADR 0041 in hand.** Its "selected legacy parity" half
> describes a comparison ADR 0041 retired — the archive is "not a parity
> comparator for behavior they never ran," and accepted behavior reaches L3 by
> re-implementation from its authoritative contract. Gate 09's resolution
> transfers one residue here: the guarantee that re-implementation does not
> silently drop undocumented-but-valuable archived behavior is Gate 5's
> birthplace-and-contract-tests clause, not a migration inventory.

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

## Resolution — SEALED 2026-08-02 · L1 (user grill)

Option **A** stands as recommended: the seven layers above are the required
stack. Three rulings settle the residue the 2026-07-17 audit left.

### R10-① Gate 10 is the ADMISSION gate to L3 playtesting, not its verdict

**The unasked question, asked.** "L3" carries two meanings in this project — the
top rung of the test-trust ladder (`docs/features/match-arc/TEST-LADDER.md`:
"Human playtest — fun, tension, skill expression, actual human choices") and the
build generation now under construction (`AGENTS.md`, ADR 0041). This gate's
title uses the second; its Gate 7 was being read as the first, and that is what
kept the residue open.

**The gate's own Gate 7 already chose.** Its five tasks — distinguish the
information tiers, explain what a border alarm reveals and withholds, predict
and identify what reconnaissance changed, explain a bot action and a battle
result from the event presentation, finish a match and say why it ended — are
*comprehension*, every one. Not one of them measures fun, tension, or skill
expression. The author's hand had already picked admission; only the name was
missing.

**Why admission is the right reading and not merely the convenient one.**
TEST-LADDER defines each rung by what it can **establish**, not by a pass mark;
it is an epistemology, and a build-acceptance gate that demanded "fun" would be
misreading it. Comprehension is the *precondition* for L3 evidence: a playtester
who cannot tell an estimate from an exact value produces a "this isn't fun" that
says nothing about the design. And the verdict reading is circular in practice —
this gate owns every acceptance command's pass/fail threshold (gate 05 D3), so
it gates all thirteen build tickets; making it wait on a playtest would put the
tickets behind the playtest that needs them.

**What therefore leaves this gate.** Fun, tension and skill expression are not
judged here. They are TEST-LADDER's L3 rung and they belong to the standing
design risks that already wait on a playtest — `docs/DESIGN-RISKS.md` **R12**
(the immersion charter's three unverified claims), with **R1** and **R2**. This
gate certifies that a playtest of this build would *mean* something; it does not
pronounce on what the playtest finds.

### R10-② Parity proof strength is BIT-EXACT

`parity.equality` is filled in `game/acceptance/thresholds.js`, which carries the
seal and its reopening condition; not restated here.

The ruling **authorises the check that was already running** rather than
tightening anything: the lane compares a sha256 digest of a canonically
serialized turn-0 projection, so it was bit-exact by construction. Epsilon was
not chosen partly because a digest cannot carry one — it would mean rewriting the
comparison to walk the projection field by field.

**Measured at seal time, and the reason a reopening condition exists at all.**
Both hosts agree (`d50337ddf67c813b`) because both are V8 — an accident of host
choice, not a language guarantee. ECMAScript leaves `Math.pow`
implementation-approximated. The domain calls it four times; three exponents are
integers (2.0, 2.0, 1.0), and `domain/battle.ts`'s `CASUALTY_EXPONENT` of **1.4**
is the only non-integer one, so it takes the genuine transcendental path.
Casualties feed capital fall. **That single site is the only known way the two
hosts could come to disagree about who won**, and the trigger that would expose
it is the shell decision ADR 0016 Stage 2 defers.

### R10-③ The human rung: all five tasks, the user judges, one miss is a FAIL

A run PASSes only if the playtester performs **all five** of Gate 7's tasks.
There is no partial credit: the tasks are not a score, and admitting a build that
fails one would admit a playtest whose findings that failure contaminates. The
judge is **the user**. The record the gate already requires — viewport, build
identity, world revision, seed, intent log, outcome, observed misunderstanding —
is the evidence, and a FAIL names which task failed.

**One tension, recorded rather than resolved.** Gate 7 says "without developer
explanation", and the user is the designer, so the condition cannot be satisfied
structurally by the person now named to judge it. The user ruled anyway, and the
ruling stands: an early admission judgement by the designer is worth more than a
blocked gate. But the reading is **optimistic by construction** — the designer
cannot un-know what the screen is supposed to say — so a comprehension PASS
judged this way is weaker evidence than the same PASS from a third party. When a
non-designer plays, that run is the stronger record.

### Gate 5 re-cut, inherited from gate 09

Gate 09 closed on 2026-08-02 because ADR 0041 removed its premise, and it handed
one residue here: the guarantee that greenfield re-implementation does not
silently drop undocumented-but-valuable archived behavior. That is Gate 5's
birthplace-and-contract-tests clause, and Gate 5's other half — "selected legacy
parity" — describes a comparison ADR 0041 retired. Read Gate 5 as: **every
L3-invoked operation names its Production birthplace and passes its contract
tests**, with the archive consulted as verification evidence and never as a
parity comparator for behavior it never ran.

### What changed the moment this sealed

`npm run verify:game` reached **exit 0** for the first time (six lanes PASS).
Until this seal no run could go green by design, so its red carried no
information — the hazard `docs/DESIGN-RISKS.md` **R20** records. A future PENDING
now means a threshold was added and left unfilled, which is a real signal rather
than business as usual.
