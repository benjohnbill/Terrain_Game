# Verification brief — should document registers become machine-readable indexes?

**This is a request to REFUTE a proposal, not to evaluate it.** Three reviewers are
being run independently against this same brief (a cold Claude Code session, a Codex
session, and a subagent). Agreement between reviewers is only worth something if each
tried hard to break the idea first. **Default to "this fails" and see whether the
proposal survives.** If you find yourself agreeing, say precisely what evidence would
have changed your mind.

The proposal's author is the repository owner. Do not soften findings to be agreeable,
and do not assume the proposal is good because it is theirs.

---

## The problem being solved

Documents in this repo that list **what is undecided** go stale. Observed 2026-08-02,
five statements in one day were found to describe a world that had already moved:

| # | What a register said | What was true |
|---|---|---|
| 1 | "Wayfinder gate 09 blocks gate 10" | ADR 0041 had removed gate 09's premise entirely |
| 2 | "gate 10 has three open residues" | The answer was inside gate 10's own § Gate 7 list |
| 3 | "twelve seal conflicts are live" | #10 had been ruled by capital CP-⑤ two days earlier |
| 4 | "deadlock candidate 3 is speculative" | Ticket 07 merged the next day; its precondition now exists |
| 5 | "ticket 13 waits on acceptance thresholds" | Gate 10 closed and supplied them |

**None of the five was caught by any mechanism.** All five came from an agent reading
with current context.

A sixth case is different in kind and matters for judging the proposal:
`docs/DESIGN-RISKS.md` row **R20**, as first registered, named a hazard the code did not
have. It was **false on the day it was written**, and was caught only by reading the
acceptance scripts it referred to. Its correction is preserved in the file.

**Why this happens is structural, not negligent.** `DOCUMENTATION-LAW.md` (mirrored
into `AGENTS.md`) puts a decision's authoritative text at its **birthplace** and makes
every other surface a pointer — the single-definition rule. So when a ruling lands at a
birthplace, the registers that said "this is open" do not follow. A human must walk
them over, and that leaks across session boundaries.

## The existing mechanism, and its record

`scripts/audit-lint.js` has a check for exactly this: `ledgerCurrency` /
`ledger-possibly-paid`. It reads Open rows from `docs/SYNC-DEBT.md` and matches each
row's *distinctive title tokens* against commit subjects dated after the row's
registration.

Its record across the two audits that triaged it:

- `docs/audits/2026-07-26-audit-run-3.md` § Advisory triage — **8 of 8 spurious**
- 2026-08-02 doc-audit run — **14 of 14 spurious**
- **0 true positives in 22**, with the same failure mode six days apart (matching on
  incidental shared words: `re-cut`, `record`, `evidence`, `naming`, `reason`)

The function's own comments record two prior implementation repairs, so it is not
untuned. The full finding is registered as a debt row in `docs/SYNC-DEBT.md`
("This ledger has no way to know it has gone stale…").

---

## The proposal to refute

**Core claim.** Move register rows from prose to a **machine-readable, row-level
structured form** carrying at minimum: `status` (active/closed), a timestamp, and
relational pointers (what discharges this, what it blocks, what premise it rests on).
Then:

1. Reading "what is open" becomes `grep status: active` plus a summary scan, rather than
   reading a ~2,100-line prose ledger.
2. Deterministic checks become possible — a row claiming `active` whose `discharged_by`
   target now carries a seal, or whose premise ADR is stamped superseded, can be flagged
   **blocking** rather than advisory.
3. Hooks, skills, and the documentation law can enforce it, because there is finally
   something enforceable to point at.
4. Type-based search becomes available across documents, in the way an IDE indexes
   functions or a graph database indexes relations.

**Scope claim (the part the author is least sure of).** That this should extend beyond
the debt ledgers to **all document files** — on the reasoning that "the kinds of thing
that can be applied mechanically to these documents already appear in the inventory."

**Acknowledged but deferred by the author:** a documentation-diet pass would be needed
later.

## What the repo already has, so you do not rediscover it

- `docs/audits/term-inventory.json` — a JSON index of ~220 registered terms with
  fields `canonical` / `korean` / `aliases` / `birthplace` / `tier` / `status` /
  `kind` / `codeIdentifier` / `codeRefs` / `verdict` / `verdictRef`. This is already
  the proposed pattern, applied to **terms**.
- `docs/audits/doc-registry.json` — a companion index of document files.
- `docs/audits/HARVEST.md` — the two-mode maintenance model for those baselines.
- `scripts/audit-lint.js` — ~11 check kinds. Three already compare *declared* status
  against *actual* status and are **blocking** because they are accurate:
  `status-marker-mismatch`, `glossary-status-drift`, `unstamped-adr-amendment`.
  `ADVISORY` (near the file's end) is the set that never gates.
- The documentation law requires a session that seals/renames/re-statuses a term to
  patch its inventory row in the same batch — **"index fields only"**, never definition
  text.
- ADR supersession stamping is already mandatory and already linted.
- `.claude/skills/doc-audit/SKILL.md` — the escalation ladder (Layer 0 script → Layer 1
  judgment → Layer 1.5 vocabulary dashboard) and the separation-of-powers rule: findings
  are **reports, never legislation**; adding or moving a check is a decided question,
  not an audit action.
- A precedent for the opposite approach: the **QUICKREF lock-point ruling** (user,
  2026-07-28, law ritual duty 4). It *retired* a per-batch freshness duty in favour of
  deliberate re-reads, and demoted its staleness lint to advisory. Documented reasoning:
  the enforced-freshness model cost more than it returned.

## Questions to answer, in order of how badly the author needs them

1. **Is the term→ledger analogy sound?** A term is an atom with a birthplace. A debt row
   is a *task or open question*, and some have no birthplace at all (`SYNC-DEBT.md`
   contains rows such as "the naval-system question has no owner" and
   "`DOMAIN_MAP.md`'s place-naming rule has no birthplace"). Does the pattern survive
   contact with rows that cannot name a pointer?

2. **Does the "all document files" scope claim hold?** Test the author's stated
   reasoning directly: is it true that the mechanically-applicable content is already in
   the inventories? Name what would be newly indexed and what would not.

3. **What is the failure mode when the index itself goes stale?** The fields are written
   by hand, not derived. If `grep status: active` becomes the primary read path, does a
   wrong field become *more* damaging than wrong prose — because it now looks
   machine-verified and short-circuits reading? Is there a way to distinguish
   machine-derived fields from hand-asserted ones?

4. **Does dual maintenance scale?** Every indexed row must be updated in two places.
   `term-inventory.json` already pays this cost for ~220 terms and is kept honest by
   three blocking checks. What happens at N indexes? At what point does the index
   become the stale artifact?

5. **Is the IDE / graph-DB analogy load-bearing or misleading?** Code symbols have
   compiler-verified existence; prose rows do not. Does the analogy import a guarantee
   that is not actually available here?

6. **Which of the six observed cases above would this proposal actually have caught?**
   Answer case by case. Case 2 (the answer sitting inside the gate's own document) and
   case 6 (R20, false when written) are the ones to be most careful about.

7. **Has this already been decided?** This repo has a documented habit of re-opening
   settled questions — three times on 2026-08-02 alone. Check
   `docs/audits/2026-07-26-audit-run-3.md`, `docs/SYNC-DEBT.md`, `docs/adr/`, and the
   `.scratch/doc-structure/` tracker before assuming this is a new question. If a prior
   ruling covers it, that finding outranks any analysis.

## Output

Be concrete and cite files and line numbers. Prefer "this fails because X, here is the
case" over general commentary. Explicitly state:

- the **strongest single argument against** the proposal,
- the **narrowest version of it that survives** your objections (if any),
- and anything in the brief you found to be **factually wrong** — the brief was written
  by an agent and may contain errors.

Do not edit any repository file. This is analysis only.
