# ADR 0049: Runtime Authority and the Projection Boundary

Date: 2026-08-03

Status: Accepted

Decision source: Wayfinder gate 02
(`.scratch/l3-playable-seam/issues/02-define-game-runtime-authority.md`, resolved
and user-sealed 2026-07-16), promoted here by user ruling at Wayfinder gate 12,
2026-08-03. The gate ticket keeps its evidence and its rejected alternatives;
from this date the authority is here.

- Relationship:
  - **Amends ADR 0039** § Decision 3: "exposes resulting state and events"
    narrows to *viewer projections and events*. Decision 3's deferral of "the
    exact API shape" survives untouched — what a caller may *receive* was never
    part of that deferral. Stamped there.
  - Builds on **ADR 0040** (TypeScript-first canonical L3 source) and **ADR 0041**
    (environment isolation) without amending either.
  - Presupposed by **ADR 0048**: the estimate band is produced at the boundary
    this ADR names. 0048's fog conclusion rests on
    `docs/features/fog-of-war-discovery/RULINGS.md` ③ and stands without this
    ADR; its enumeration of projection consumers, its bot-parity claim, and its
    classification of the band as Runtime state rather than display rest on the
    caller topology recorded here.

## Context

The contract was settled at gate 02 on 2026-07-16 and has governed every L3
build ticket since — ten of them landed against it. It never left the Working
layer.

Measured at gate 12 on 2026-08-03: the canonical source tree cites gate 02 by
name in **28 places** in authored files, including as its declared authority
(`game/src/runtime/runtime.ts:4`, `game/src/runtime/types.ts:4`,
`game/README.md:13`) and inside a contract test's failure message
(`game/tests/runtime.contract.test.js:33`). The documentation law puts
`.scratch/` trackers in the Working layer, where "current truth lives in the seal
chain, not here". The L3 tree's foundational contract therefore had no permanent
home, and an accepted ADR had come to stand on it.

Promotion is **not** forced by the mandatory-ADR trigger. That trigger does not
fire: gate 02 answers inside ADR 0039 Decision 3's own declared deferral and
changes no win condition, cross-feature game model, or SPEC direction — the
reading recorded in `docs/SYNC-DEBT.md` when the promotion question was first
registered, which deferred the decision to this gate rather than refusing it.
What carries promotion is the Record layer's ordinary standard: this is an
architecture-grade contract that binds Runtime, projection, preview, bots, UI and
replay at once.

## Decision

1. **The Runtime privately owns authoritative match state.** No other module
   holds it, and no other module may reconstruct it.
2. **A caller receives a viewer-legal projection** — never truth, and never a
   live reference to truth.
3. **Information policy is applied exactly once, at the projection boundary.** No
   downstream surface re-derives a viewer-visible quantity from truth.
4. **No API hands a caller truth or a live handle on it.** Concretely and for as
   long as decisions 1–3 hold: no snapshot API and no subscription API. This is a
   semantic obligation on what may cross the boundary, not a freeze on the
   boundary's member names or arity.
5. **Command preview is a pure module outside the Runtime**, consuming
   `(viewer projection, candidate intent)` and nothing else. The same module
   serves the human UI and the bot.
6. **Bots are ordinary callers**, on the same projection and intent path as a
   human player.
7. **The Runtime enforces phase and per-realm turn legality.** Presentation
   pacing is owned outside the Runtime, which never sleeps or waits.
8. **The durable canonical form is `(authored-world identity and revision, rule
   revision, seed, ordered intent log)`.** Events are derived output, replayable
   from that tuple, and are not stored truth.

## Rationale — a protection that depends on caller discipline is not a structural guarantee

Three of gate 02's rejections were driven by this one principle, and it is
recorded here rather than promoted to a root document, per the user's decision of
2026-07-16:

- an **opaque state token** handed to callers — opaque by convention, not by
  construction;
- a **Runtime-side preview**, which puts a truth-holding module on the caller's
  side of the question;
- the archive's live `js/ui.js:156-157` **truth-fallback**, which is what the
  principle looks like once it has failed.

A boundary that callers must remember not to cross is not a boundary. Decisions
2, 4 and 5 are the structural form of the same requirement, which is why they are
stated as prohibitions on what may be *offered* rather than as guidance on what
should be *used*.

## Corrections carried at promotion

Gate 02's wording had four expired statements at promotion time. They are
corrected rather than carried forward, and named rather than silently dropped.

1. **"Blur happens once at the projection seam"** → decision 3's *viewer policy
   is applied once*. Under ADR 0048 the true value does not enter the projection
   function at all, so nothing is blurred there; the band is composed from stored
   testimony.
2. **`currentActor -> ActorId` and the out-of-turn framing** → ruling R8
   (2026-07-25) kept the member and re-read it as the current *phase*. Gate 02
   predated the simultaneous-commit pivot by a week. Decision 7 states the
   guarantee that never depended on alternation.
3. **"The intent log plus seed is the canonical durable form"** → an incomplete
   shorthand. Decision 8 restores authored-world identity and revision, without
   which a replay is not reproducible.
4. **"User-sealed", applied to a tracker ticket.** Under the documentation law a
   seal is a Production-doc row carrying status word, date and verdict source.
   Gate 02 is a resolved gate whose answer the user agreed; that is not the same
   mechanical object, and this ADR is what makes the contract sealed.

## What this ADR does not decide

Named so that a later batch does not absorb them here by drift:

- gate 03's viewer knowledge matrix and its non-leak invariants;
- fog's observation testimony model, grades and prices — ADR 0048,
  `docs/features/fog-of-war-discovery/RULINGS.md` ③ and `MAGNITUDE.md` FG-M①;
- React, the renderer, build and test topology, and the `:game` command surface —
  ADRs 0016, 0028, 0039, 0040, and Wayfinder gates 05 and 10;
- bot strategy, disposition or difficulty;
- concrete TypeScript type names, member names, or API naming;
- combat arithmetic and turn-structure rules;
- point-in-time measurements taken while gate 02 was argued.

## Consequences

- **Gate 02's 28 code citations acquire a promotion target.** Per gate 12's
  ruling the invoice is issued at promotion, scoped to the promoted gate, and is
  not retroactive: citations that claim *current authority* repoint here, while
  citations that *narrate what was decided when* keep naming gate 02, because
  repointing those would make them false.
- **ADR 0039 is stamped** and its Decision 3 narrowed in the same batch.
- **`DESIGN.md`'s "renders returned game state and events"** is corrected to the
  projection in the same batch; that sentence mirrored the pre-narrowing wording
  of Decision 3.
- **Gate 02's ticket stays where it is**, as the Working-layer record of how the
  contract was argued. It is no longer the place anything cites for the rule.
- Gates 05 and 06 are deliberately **not** promoted with it. Gate 05's decisions
  were discharged into the executable surface; gate 06's contract is feature-local
  to terrain-cradle and uncited from any Production or Record document.
