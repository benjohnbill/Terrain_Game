# Handoff — build the 06c decisive-battle **calculator** (parallel branch)

Written 2026-07-26 for **Codex**. This is a **narrowed** handoff: it covers the pure
calculation half of ticket 06c and nothing else.

## ⚠ Read this before anything else — another session is editing this repo right now

**Ticket 06a is being built concurrently.** It owns the shared state shape and the
Runtime's wiring, and it is changing them as you read this.

You are safe only because your work is **pure**: plain functions over plain numbers,
importing nothing that 06a touches. That is not a style preference here — it is the
entire reason these two tickets can run at the same time.

**Do not touch any of these. They belong to 06a right now:**

- `game/src/domain/state.ts` — `MatchState`, `RealmForces`, `Realm`, `ownerOfSector`,
  `frontsOf`, `holdingsOf`, `garrisonOf`
- `game/src/runtime/runtime.ts` — especially `#resolveTurn` and `#allocate`, which are
  single-writer by invariant ("do not add a second writer")
- `game/src/domain/turn.ts` — `readFronts`, `revealTurn`
- `game/src/domain/fronts.ts`, `game/src/projection/`, `game/src/preview/`,
  `game/src/ui/`, `game/src/world/`

If your change requires editing one of those, **you have left this handoff's scope**.
Stop and record it rather than proceeding — see § 6.

**One shared file you *must* edit, and how to do it safely.**
`game/src/runtime/index.ts` is the barrel that tests import through — they load
`../dist/runtime/index.js`, never the source (gate 05 D6) — so `battle.ts` is
unreachable until it is re-exported there. It is deliberately **not** on the list
above. 06a adds exports to the same file, so: **append one line at the end, do not
reorder or tidy the existing exports, and if a merge conflict appears, resolve it by
keeping both sides' exports.** Deleting the other session's export line to "clean up"
the conflict is the failure mode this note exists to prevent.

**Branch from current `main` — two of the birthplaces this handoff cites were created
today.** `docs/features/war-model-build/MAGNITUDE.md` (WB-M①/WB-M②) is a brand-new
file, and the Delaying Defense bands (breakthrough R 2.0, erosion 0.15) were
documented for the first time in `CATALOG.md`. Both landed in commit `2d3f752`. A
checkout older than that makes those values look **missing** — which would walk you
straight into the § 5 trap by way of the environment rather than by way of reasoning.
If a value is not where this handoff says it is, suspect your checkout before you
suspect the documentation.

---

## 1. Start with the family handoff

Read **`.context/handoff-codex-ticket-06-build.md` first, in full.** Everything in it
applies to you: the read order, where authority lives, the four-kind design-problem
rule, the traps, the archive-is-not-source rule, verification, branch and commit
conventions, the do-not-touch list, and the session-close duties.

**This file does not repeat any of it.** It adds only what is specific to building
06c's calculator ahead of its wiring.

Then read your ticket:
`.scratch/l3-playable-build/issues/06c-resolve-the-decisive-battle.md`.

## 2. What you are building

**One pure module: `game/src/domain/battle.ts`, plus its tests.** It is new; nothing
else creates it.

It answers exactly one question: *given two sides already described as numbers, what
happens when they fight over one sector?* It does not know what a `MatchState` is, it
does not know how anyone got there, and it does not write anything.

This is the codebase's established pattern, not an invention for this ticket —
`domain/economy.ts` states it in its own header: *"Pure functions over plain values;
imports no `MatchState`."* `domain/fronts.ts` takes `ownerOf` as a parameter for the
same reason. Follow it exactly.

**The hard interface rule:** `battle.ts` imports **nothing** from `domain/state.ts`
and takes **no** state object. Inputs are plain numbers and small plain records you
define locally. The adapter that maps real match state onto these inputs is written
later, during wiring, by whoever holds the whole picture. As long as you obey this,
your work cannot conflict with 06a's — and if you break it, the conflict will be
semantic rather than a merge marker, which is much worse.

## 3. In scope

Your ticket's items, restricted to what needs no state:

- [ ] A battle resolves from a **symmetric per-side power product** — `substance × commit lever × quality × fatigue`. Neither side gets an attacker-only or defender-only term the other lacks. Verify the symmetry with a test that swaps the two sides' inputs and asserts the mirrored outcome.
- [ ] **The commit lever follows the sealed M2 curve**: 0/4/8/14/20 points → ×1.00/1.25/1.50/1.75/2.00, linear between the anchors, two slopes with the knee at 8.
- [ ] **A side that committed nothing still fights at ×1.00.** M2 seals this — "an unattended garrison fights at its own strength" — and on this board most fronts are garrison-only most turns, so it is the common case rather than an edge case.
- [ ] **The defending side carries its own commit lever.** The retired flat march-worn default must not reappear as a hidden constant; where a test needs it, pass it explicitly as `fatigue: 0.75` so the retirement stays visible in the test rather than buried in a default.
- [ ] **Terrain and fortification enter defence through the sealed M5 magnitudes**, and they are defence-only.
- [ ] **Rout and escape follow M4**, and **defeat-in-detail is emergent** from the convex casualty exponent against a thinned ratio. Write no special defeat-in-detail rule — test that it emerges.
- [ ] **Defence method**: `STRONGHOLD` default and `DELAYING` available, per slice-2 §8, using the bands now sealed at `docs/features/operation-plan-catalog/CATALOG.md` (breakthrough R 2.0, erosion 0.15 per turn — both 가안).
- [ ] **River crossing prices the engagement, not the march** (ADR 0015). It belongs here, as an engagement term — never as a movement cost.
- [ ] Resolution is **deterministic for equal inputs** and **identical across Node and browser hosts**.
- [ ] The result is a **plain value describing what happened** — casualties per side, rout and escape, whether the sector falls — with no board mutation and no event emission. Naming the ordered events is wiring; producing an outcome is yours.

Values you will need are all landed. Combat magnitudes: `docs/features/combat-formula/`
`FORMULA.md` D1–D11 and `MAGNITUDE.md` M2/M4/M5. Delaying bands: `CATALOG.md`.
**Originate none of them** — if a number seems missing, re-read the family handoff's
§ 5 traps, because that exact mistake was made three times by the session that wrote
these tickets.

## 4. Explicitly out of scope — these are wiring, or another ticket's

Your ticket file lists items that are **not** in this handoff. Leave them:

- **Replacing ticket 03's `outcome: 'pending-operations'` stub.** That is
  `#resolveTurn`, which 06a is inside right now.
- **Where substance comes from.** "The detachment present or arriving at that front"
  is 06a's answer. Your calculator receives a number.
- **How fatigue accrued.** The dual ledger is 06b. Your calculator receives a
  multiplier and must not compute or accrue it.
- **Casualties shrinking the conscription register.** That is a state write, and 06d
  additionally re-cuts the register to per-province (ruling R18 iii).
- **The `turn.ts` case-4 adjudication** — one realm pressing two fronts that share a
  sector. It needs the front set and the turn's allocations; wiring.
- **The surge-curve re-measurement.** It needs a running game producing deaths.
- **The Encirclement threshold** (`DECISIONS-OWED.md` Part 2 #2 — M7 says 2.2, the
  ledger says 1.92, which is the rout-onset figure). Unresolved, not in your items,
  bites at tickets 09–11. **Do not resolve it by implication** — if your rout code
  seems to want a threshold above rout onset, that is the trap, and it means you have
  wandered into Encirclement.

## 5. The archive is your comparator, not your source

`js/battle.js` implements the R-ratio core plus Stronghold and Delaying, and
`mockup/decisive-battle/battery.js` exercised it. Under ADR 0041 these are **evidence
to verify against, never a module to import or a file to port line by line.**
Re-implement from the contract in § 3, then check your numbers against the archive's
behaviour and explain any difference deliberately.

Classify anything you carry forward as accepted / superseded / incidental before you
use it, and let your tests cover only what you deliberately carried.

**One carried behaviour is already known to be retired**: the flat march-worn 0.75
default. It is retired as a *default*, not as a *value* — see § 3.

## 6. When you are blocked

Same rule as the family handoff, with one addition for parallel work: **if you are
blocked because you need something 06a or 06b owns, that is not a block — it is the
boundary working.** Record the seam you needed and finish what is yours.

Record blocks in your ticket's § Comments, or `docs/SYNC-DEBT.md` for a documentation
duty, or `.scratch/l3-playable-build/DECISIONS-OWED.md` for something the user must
rule on. State both sides and cite them. Do not derive a way through.

## 7. Verification and landing

```bash
npm run verify:game   # every lane; parity reports PENDING BY DESIGN — not your bug
npm test              # root regression suite, currently 479/479 — must stay green
npm run lint:docs     # 0 blocking is the bar; 7 advisory findings are known false positives
```

Baseline verified 2026-07-26: `verify:game` all lanes PASS with parity **PENDING**,
root `npm test` **479/479**, `lint:docs` **0 blocking / 7 advisory**. The family
handoff § 7 explains why those three are not defects.

Branch fresh from `main` for this work. **Expect to merge after or alongside 06a** —
coordinate with the person holding both, and do not merge on top of a half-landed
06a without checking.

## 8. Before you write any code, state these back

Your handler will check your understanding here.

1. **What single rule makes it safe for you to work while 06a is editing this repo?**
   Name the concrete import restriction, not the general idea.
2. **Name three files you must not open**, and say who owns them right now.
3. **What does your module receive for `fatigue`, and what must it never do with it?**
4. **A side commits zero points. What is its lever, and why is that the common case
   rather than an edge case on this board?**
5. **Where does defeat-in-detail come from?** If your answer contains the words "a
   rule for", you have it wrong.
6. **Your rout code seems to want a threshold above rout onset.** What is happening,
   and what do you do?
7. **You need to know which detachment is standing at the front.** Is this a block?
8. **`verify:game` reports `parity PENDING`.** Is your build broken?
9. **What is `js/battle.js` to you**, in one sentence, and what are you forbidden to
   do with it?
10. **A magnitude your formula needs is not in `MAGNITUDE.md` where you expected.**
    What do you do, and what do you *not* do?

Answer 6 and 7 carefully — they are the two ways this branch most plausibly goes
wrong, one by scope creep into another ticket's unresolved conflict and one by
mistaking a boundary for a blocker.
