# Handoff — build the ticket 06 family (06a → 06d)

Written 2026-07-26 for **Codex**, by the session that specified these tickets.

You are picking up a build whose design work is finished. Four tickets are
`ready-for-agent` and their decisions are all in the repository. **This file is
orientation, not authority** — it tells you where authority lives, what order to
read in, what the traps are, and what you must not touch. Where this file and the
repository disagree, the repository wins.

**You cannot ask the people who wrote these tickets anything.** That is the single
constraint that shapes everything below: when you are blocked, the correct move is
to stop and record, never to derive a way through.

---

## 1. What you are building

The **operational layer** of a 1v1 turn-based strategy game, on top of a turn loop
that already runs. Today the game partitions a board, gives both players a capital,
and cycles a blind simultaneous commit → reveal turn — but resolution is a stub that
changes no ownership, and a field army is a positionless number.

By the end of 06d, armies stand somewhere and march, marching and fighting tire
them, battles resolve for real, and ground changes hands and starts paying its new
owner.

## 2. Read in this order, before writing anything

1. **`AGENTS.md`** — the project guide, including the full documentation and
   terminology law. Note especially § Documentation & Terminology Law (what a seal
   is, layer authority, the conflict rule) and § Environments (the archive is
   evidence, never a source to port).
2. **`.scratch/l3-playable-build/README.md`** — the runbook. § *When implementation
   meets a design problem* is the rule you will actually need; § *Readiness* explains
   the R6 waiver you must re-check.
3. **`.scratch/l3-playable-build/issues/06-resolve-the-decisive-battle-core.md`** —
   the re-cut index: why 06 became four tickets, and the contract all four inherit.
4. **Your ticket** — `06a`, `06b`, `06c` or `06d`. Read it completely, including
   § Needs-info and § Comments.
5. **`docs/adr/0043-…md` and `docs/adr/0044-…md`** — the two decisions that unblocked
   this family. 0043 is movement, position and reachability; 0044 is what a captured
   sector pays and when.
6. **`.scratch/l3-playable-build/DECISIONS-OWED.md` § Rulings received 2026-07-26** —
   R12 through R19 in full, with derivations and two retractions. The ADRs summarise;
   this has the reasoning.
7. **`.scratch/l3-first-match/map.md`** — the effort's destination and standing
   notes. Read § Notes; it is short and every line was paid for.

Only then, the model docs your ticket cites.

## 3. The four tickets are a chain, and the reason matters

06a → 06b → 06c → 06d. **One implementation session claims one ticket.**

The order is not arbitrary and it is not the order the work was originally planned
in. The original ticket 06 put combat first. Reading the landed code moved it: the
turn loop resolves a front from **committed action points alone**, while the sealed
battle formula is `substance × commit lever × quality × fatigue` — so nothing
anywhere said how *substance* reaches a front, and a field army had no position at
all. Combat cannot be built on that gap.

So position (06a) is **upstream** of combat, fatigue (06b) is an input to it, and
capture (06d) is its consequence. If you find yourself wanting to start at 06c, you
have missed this.

## 4. Where authority lives

| Layer | Files | Weight |
|---|---|---|
| Law | `AGENTS.md` | how to work |
| Direction | `SPEC.md` | what the product is |
| Record | `docs/adr/` | why decisions were made |
| Production | `docs/features/<slug>/` | **where truth is minted** — glossaries, rulings, model docs |
| Working | `.scratch/`, `docs/superpowers/`, `mockup/*/NOTES.md` | what is *being* decided |

**Values live in exactly one owning model doc.** For this family: fatigue, movement
and supply dials are `docs/features/war-model-build/MAGNITUDE.md` (WB-M① and
WB-M②); combat magnitudes are `docs/features/combat-formula/MAGNITUDE.md`; realm
economy is the same file's M13/M13a/M14 plus match-arc MT-②/MT-③. Never restate a
number outside its owning doc — reference it.

### The rule you will need most

From the runbook, four kinds of design problem and who decides each:

| Kind | What it looks like | Who decides |
|---|---|---|
| Seal conflict | two sealed statements that cannot both be implemented | **User.** Stop. |
| Undetermined value | the design says a value exists, nothing records it | **User**, batched. |
| Undesigned system | mentioned, never specified | **Out of scope.** |
| Plan omission | design complete, no ticket was building it | **You**, with a citation list proving **zero** new values or rules. |

The boundary test, in order: (1) does this require me to write a normative statement
that does not exist? → not yours; (2) do two seals disagree? → stop; (3) otherwise
it is assembly, and yours. **When the call is ambiguous, treat it as (1).**

**You must originate zero values.** All four tickets were verified to have zero
unlanded values. If a number seems missing, you have almost certainly not found its
birthplace yet — see the traps below, because this exact mistake was made three
times by the session that wrote these tickets.

## 5. Traps — all three fired during specification, in this repository

**1. A summary is not the artifact. Read the artifact.**
Three separate "this is undecided / this does not transplant / this value is
missing" verdicts were produced from summaries and then overturned by reading the
actual file or measuring the actual board. In every case the truth was already in
the repository. `DECISIONS-OWED.md` is a strong index, **not a closed set**, and it
carries at least one retraction in place.

**2. A struck-through line still reads like a rule.**
`MAGNITUDE.md` M13 carries a struck-through "+10% of cap per turn". Reading it as
live produced a proposed rate cap that was rejected, while the correct sealed answer
sat two lines away. The same document also carries amendment banners that change
what the text below them means. **Read the strikethroughs and read the banners.**

**3. Readiness rows go stale; recompute them.**
A ticket was recorded as blocked on values that were all sealed at their
birthplaces. The block was a day old and cost nothing to disprove. **Re-run R6's
second test yourself at claim time** — every cited gate resolved, and zero unlanded
values — rather than trusting the table.

Two smaller ones, both real:

- **`Infinity` does not survive JSON.** Five open borders carry
  `choke.cap === Infinity`; a round trip turns them into `null`, which reads the most
  permeable border in the world as the most sealed. Walk structures; do not
  round-trip them. Same trap across `page.evaluate`.
- **A typo'd sector id makes a Σ test pass vacuously.** `sumOver` skips unknown ids,
  so a sum over a misspelled id is 0 and can equal a mis-derived expectation.
  `game/tests/realm-economy.test.js` asserts its fixture ids exist for this reason;
  do the same.

## 6. The archive is evidence, not source (ADR 0041)

`js/`, `tests/`, `mockup/` and the L2 harnesses implement much of this behaviour.
**They are not a build source and not a parity comparator.** Accepted behaviour
reaches the build by being re-implemented from its authoritative contract — the
feature's GLOSSARY / RULINGS / model docs — and *verified against* the archive.
Never import from it, never port a file line by line.

Classify anything you carry forward as accepted / superseded / incidental before you
use it, and let your tests cover only what you deliberately carried.

## 7. Verification

The canonical L3 source is the nested `game/` TypeScript tree. Tests run against the
**emitted** artifact, never the source (gate 05 D6).

```bash
npm run verify:game   # typecheck, build:runtime, build:viewer, test:node, test:browser, parity
npm test              # root regression suite (the archive's; must stay green)
npm run lint:docs     # documentation-governance audit
```

**Baseline on `main` before you start** (verified 2026-07-26): `verify:game` — every
lane PASS with **parity PENDING**; root `npm test` **479/479**; `lint:docs` **0
blocking, 7 advisory**.

Three things about that baseline that are **not** defects:

- **`parity` reports PENDING by design.** Wayfinder gate 10 owns the pass threshold
  (bit-exact versus epsilon) and is still open, so the check runs, observes identical
  projections in both hosts, and refuses to report green. Do not "fix" it.
- **The 7 advisory lint findings are known false positives** (ledger-currency
  heuristics). 0 blocking is the bar.
- **Rebuild the viewer before Playwright** — `npm run build:game`. A stale
  `dist-viewer` fails new UI selectors with a null-element error that looks like a
  code bug.

## 8. Branch and commit

- Fresh branch per ticket, **from current `main`**, merged back when it lands. Do not
  combine tickets. Branching from a stale `main` is a real hazard here: several
  birthplaces these tickets cite were created on 2026-07-26 (notably
  `docs/features/war-model-build/MAGNITUDE.md`, a new file holding the fatigue,
  movement and supply dials, and the Delaying Defense bands in `CATALOG.md`). An old
  checkout makes landed values look **missing**, which walks you into trap 1 by way
  of the environment rather than by way of reasoning. **If a value is not where a
  ticket says it is, suspect your checkout first.**
- **`game/src/runtime/index.ts` is a shared barrel.** Tests import through
  `../dist/runtime/index.js`, so anything a test must reach is re-exported there —
  which means most tickets in this family touch it. Append at the end, do not reorder
  or tidy existing exports, and if a merge conflict appears, **keep both sides**.
  Deleting another ticket's export to clean up a conflict is the failure this note
  exists to prevent.
- Commit messages: neutral professional English, explaining **why**, not just what.
- **Tooling note for this environment:** use `/usr/bin/grep` for existence checks
  (`rg` gives false negatives on recursive searches here) and `/usr/bin/git` for
  history (a bare `git log` can report another worktree's tip).

## 9. Do not touch

Each is excluded by a specific decision, not by oversight. Building any of them is a
scope violation even if the code seems to invite it.

- **Recruitment siting and the turn budget** (ruling R19). Where a realm raises men
  is deferred to its own pass, and it reopens the action-point stack size. Do not
  give recruitment a location.
- **`conquest damage`'s definition.** 06d builds it as a named seam at identity 1.0
  precisely so a later session can decide it. Do not define it.
- **The Encirclement threshold** (Part 2 #2 — 2.2 versus 1.92). Not in 06c's items;
  it bites at tickets 09–11 and stays there. Do not resolve it by implication.
- **Fog band constants** (Part 2 #5, unresolved). They conflict with M8. Sealing one
  side by accident is the risk.
- **Morale (사기)** — parked by ruling. Do not add a morale term.
- **Interception of a force in transit** — undesigned everywhere.
- **Terrain movement costs** — uniform 1.0 today by ruling R15; the authored per-hex
  terrain is a region-painted placeholder and pricing against it would harden the
  placeholder into a rule.
- **`docs/teach/`** — the user's own space. Agents do not touch it.

## 10. When you are blocked

Stop. Do not derive a way through, do not pick the reasonable-looking value, and do
not widen the ticket to make the problem go away.

Record the block where the next reader will find it: the ticket's § Comments for
something ticket-local, `docs/SYNC-DEBT.md` for an unpaid documentation duty, and
`.scratch/l3-playable-build/DECISIONS-OWED.md` for something the user must rule on.
State both sides and cite them. **An unrecorded block is the failure; a recorded and
unresolved one is normal operation.**

## 11. When a ticket lands

Standing duties, from the documentation law's session-close ritual:

1. Sync any verdict you reached into the Production docs — a seal needs **status word
   + date + verdict source**, or it is not a seal.
2. Doc-sync into `DOMAIN_MAP.md` / `DESIGN.md` if seals changed. `SPEC.md` only via a
   user-approved proposal.
3. Refresh the touched feature's `INDEX.md`.
4. Regenerate `docs/GLOSSARY-QUICKREF.md` after any seal batch, **including this
   session's own seals**.
5. Stamp any superseded or amended ADR — and any amended seal — in the same batch.
6. Record every unpaid duty in `docs/SYNC-DEBT.md`.
7. Patch `docs/audits/term-inventory.json` if you sealed, renamed or re-statused a
   term, then run `npm run lint:docs`.

---

## 12. Before you write any code, state these back

The person handing you this will check your understanding here. If you cannot answer
one of these from the repository, re-read § 2 rather than guessing.

1. **Why is 06a before 06c?** Name the specific gap in the landed code that makes
   position upstream of combat.
2. **What does a march cost, and what does it explicitly not cost?** Give the reason,
   not just the rule.
3. **What makes an order to a front legal?** Name the existing function this reuses
   and why a second implementation of it would be a defect.
4. **Why is the movement graph not simply the hex graph?** Name what breaks and how
   the failure would disguise itself as correct behaviour.
5. **What does a captured sector pay its taker, and when?** Name the lag and what it
   does *not* apply to.
6. **How does a garrison get filled, and what is the rate?** This is a trick
   question; answer it exactly.
7. **You find a number the design clearly needs and no document records.** What do
   you do, and what do you *not* do?
8. **Name three things on the do-not-touch list and why each is excluded.**
9. **`verify:game` reports `parity PENDING`.** Is your build broken?
10. **Where does the authoritative definition of a term live, and what is every other
    mention of it?**

Answer 6 carefully. It is the one where the obvious answer is wrong, and the ticket
tells you why.
