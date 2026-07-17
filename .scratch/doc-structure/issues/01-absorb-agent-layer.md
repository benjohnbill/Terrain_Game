# Absorb the agent-tooling layer into documentation-law?

Type: grilling
Status: resolved

## Question

Should `documentation-law.md` absorb the surfaces the 2026-07-14/15 skill setup
introduced or exposed — and if so, how much?

Sub-decisions:

1. **Register `.scratch/<feature>/issues/`** in the Working-layer table —
   tickets only, explicitly *never a spec home*.
2. **Register `docs/agents/`** — agent tooling config; Tier-2, USE/REFERENCE
   only, may not restate the law or define terms.
3. **Name the working-surface pipeline** — design spec (`docs/superpowers/`)
   → tickets (`.scratch/`) → handoff (`.context/`) → doc-sync → seal chain.
   Currently the law registers the first and third stations but not the middle
   link; the pipeline direction itself is unnamed.
4. **Give the `law` layer a lawful home** — doc-registry.json classifies
   AGENTS.md / CLAUDE.md / documentation-law.md as layer `law`, a layer the
   law's own taxonomy table does not define (cold-review FE-3 residue, never
   legalized). Either add the layer to the taxonomy or re-classify.
5. **AGENTS.md one-liner for the tracker location** — lean NO (auto-load
   economics; Codex reaches the law via the MUST-Read clause), but decide
   explicitly.

## Tension to resolve

- **Against absorbing**: the emergence-limit precedent — Working-layer
  sublabels deferred ("no misfiling observed — revisit if it occurs"), P4
  topology restructure rejected on evidence, B4 routing "WATCH, do not codify
  on first instance". Evidence for acting is ONE near-miss (the setup template
  almost seeded a competing `.scratch/spec.md` spec home — M-04 class), and
  registry layer fields are currently dead data (see ticket 02), so
  registration buys prose, not enforcement.
- **For absorbing**: the user's standing direction (2026-07-15: "법이 흡수는
  동의" — given before the emergence-limit evidence surfaced, so it needs
  re-confirmation, not silent execution); the near-miss shows the gap is
  load-bearing for skill-driven sessions; `.scratch/` is now the official
  issue tracker, a promotion the law doesn't know about.

## Output

A proposed law-amendment diff (user seals, Tier-3) or an explicit WATCH verdict
recorded in this ticket. Feeds ticket 08 (registry rows for the new surfaces).

## Evidence

`research/design-history-survey.md` (rejected/deferred list, emergence-limit
rulings) · `research/enforcement-survey.md` (dead registry fields).

## Answer (2026-07-15)

> **Status: rulings 1–2 APPLIED and user-sealed at `e35caf8`.** Corrections
> below from the adversarial review (`docs/audits/2026-07-15-doc-structure-review.md`).
>
> - **Structural defect fixed 2026-07-15**: this ticket carried **two divergent
>   `## Answer` blocks**. The earlier, superseded copy was removed; the block
>   below is the one the seal followed. (The M-04 disease inside the ticket that
>   legislates against it — noted for the retrospective.)
> - **Ruling 1's justification is a category slide (precedent review).** The
>   sublabels deferral waited for **misfiling** — a document in the wrong Working
>   sub-kind. What fired was a **restatement** violation: `domain.md` was in the
>   *right* place and broke a rule that already existed (this Answer concedes
>   Vocabulary Law "already covers it"). That is the forensics' enforcement class
>   (58%), which Diagnosis #1 says is explicitly *not* a topology/labels problem;
>   sublabels would not have prevented it. **The reopen was also unnecessary** —
>   the Working row already carries per-document write rules, so adding one more
>   is registration, not sublabels. The action is defensible; the "trigger fired"
>   claim is not, and it is now in the permanent record (see the ledger conflict
>   below). Sublabels remain genuinely deferred.
> - **`e35caf8` contradicts itself in one commit**: its message says the reopen
>   condition "**occurred**", while `docs/SYNC-DEBT.md` still reads "**no
>   misfiling observed** — revisit if it occurs" and the same commit's law edit
>   says "only the Working-layer sublabels **stay deferred**". A future agent
>   greps a fired trigger in the log and an unfired one in the ledger — freshly
>   minted F-10/F-11 ledger-currency disease, by the batch fixing that disease.
>   **Owed**: reconcile — either withdraw the "fired" claim or state the ledger
>   row's status. Not done here (Tier-3 wording, and the batch is sealed).
> - **Ruling 2 legalizes a gate with no mechanism (H-11).** `write-lint`'s
>   `GOVERNED` regex does **not** include `CLAUDE.md` or `AGENTS.md` — two of the
>   three files in the new Law row. The next identical Tier-3 violation is caught
>   by exactly what caught the last one: nothing. This ticket's own thesis
>   ("a dictionary without a check drifts again by next week") is unapplied to
>   itself. **No ticket owns wiring it.**
> - **Evidence status (fact-check)**: `docs/agents/domain.md` was **never
>   committed** — no blob in any ref — so its content claim is unverifiable
>   against the tree, only against a since-deleted working-tree file. The
>   `CLAUDE.md` edit itself is confirmed (uncommitted until `e35caf8`); the
>   "without user sign-off" clause is a claim about a conversation, with no
>   consent record in the repo.
> - **FE-3 framing**: the cold review called the `law` layer an *invention* — a
>   registry defect whose prescribed fix was "complete registry coverage". This
>   ruling resolves it the opposite way. Defensible, but adding a taxonomy row
>   **is** legislating topology, not merely "closing an inconsistency".

**Absorb, narrowly.** Three sub-decisions ruled; one deferred to ticket 11; one
rejected. Rulings 1–2 land as a user-sealed law diff (Tier-3), batched with
ticket 05's staleness corrections to minimise law churn.

### 1. `docs/agents/` — REGISTER (Working layer, line 17)

Documents cell gains `` `docs/agents/` (agent tooling config) ``; write rule
gains: *"`docs/agents/` is agent-tooling config (tracker location, triage
vocabulary): it points at this law and never restates it."*

- **Precedent settles the layer, not judgment**: `doc-registry.json` already
  classifies `.claude/skills/doc-audit/SKILL.md` as `working` — agent tooling
  in Working is established.
- **The deferral's reopen condition fired**: Working-layer sublabels were
  deferred with *"no misfiling observed — revisit if it occurs"*. It occurred —
  `docs/agents/domain.md` (written 2026-07-14) restates the law against its own
  header *"do not restate this law elsewhere"*. Not a near-miss; an executed
  violation. Ticket 07 deletes the file; this row prevents the next one.
- No Tier-2 "defines no terms" clause: Vocabulary Law's *"Tier 2 = everything
  else — USE and REFERENCE only, never define"* already covers it.

### 2. `law` layer — LEGALIZE (new taxonomy row)

```
| Law (법) | `AGENTS.md`, `CLAUDE.md`, `.claude/rules/documentation-law.md` |
The rules agents execute. Changes only by explicit user decision. |
```

- **Fixes a known inconsistency, not new legislation**: `doc-registry.json` has
  stamped these three files `layer: law` since 2026-07-10 while the law's own
  taxonomy defines no such layer (cold-review FE-3 residue, unlegalized for 5
  days).
- **The gate is stated here, not delegated** to the global agent-operating-model
  Tier-3 list: Codex reads `AGENTS.md` but does not load `~/.claude/rules/`. In
  a cross-agent repo a gate that lives only in the global rules does not exist
  for Codex. Anti-duplication does not apply across agents that read different
  files.
- **Evidence the gate is load-bearing**: `CLAUDE.md` was edited without user
  sign-off during the 2026-07-14 skill setup — a Tier-3 violation the global
  rule already forbade and nothing caught.
- **No S13 clause in the row**: line 17 already carries *"audit-lint findings
  are reports, never legislation"*, and `.claude/skills/doc-audit/SKILL.md`
  carries the constraint. A third copy is restatement.

### 3. Standalone pipeline clause — REJECTED

- Evidence is one near-miss → first instance → WATCH (B4 emergence-limit
  precedent: *"WATCH, do not codify on first instance"*).
- The drafted wording (*"None of the three is a seal surface"*) would have
  **pre-judged ticket 04** by contradicting the `Status: DESIGN SEALED` stamp
  the slice-2 build currently runs on — caught while drafting, against this
  ticket's own rider.
- Topology, if named at all, rides in the `.scratch/` row's text — now ticket
  11's to write.

### 4. AGENTS.md — NO CHANGE

- Tracker-location line fails always-load economics: skills are Claude-Code-only
  surfaces; Codex never invokes `/to-tickets`, and the user passes ticket paths
  directly.
- Trigger widening unnecessary — **verified**: the existing MUST-Read trigger
  (*"before any documentation or terminology work"*) fires on any edit to the
  Law layer, so ruling 2's gate reaches Codex as written.

### 5. `.scratch/` registration — DEFERRED to ticket 11

Drafting the row exposed that `.scratch/` is one of several **duplicate homes**
for the same work-product kinds (measured 2026-07-15): task decomposition lives
in both `docs/superpowers/plans/` and `.scratch/<f>/issues/`; research in three
places; and the template's word "feature" collides with `docs/features/<slug>/`.
Registering the row now would enshrine the duplicate in law. Routing is settled
first (ticket 11); the row is written from its verdict.
