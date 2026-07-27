# L3 Playable Build — Independent Ticket Execution Runbook

Layer: Working (local issue-tracker operations)
Current state: **building** — tickets 01, 02 and 03 landed 2026-07-25 under the R6
waiver; **05 and 06a landed 2026-07-26**; **06b landed 2026-07-28** (its supply
half deferred to R16 by the same day's re-cut); every other ticket retains its
recorded status behind the values in `DECISIONS-OWED.md`
Ticket set: **re-cut 2026-07-25** against the 1v1 duel pivot (ADR 0042) and the
gate-08 full-depth-match definition. See § Re-cut history.

This runbook makes each implementation ticket executable from a fresh session
without treating Working-layer text as game canon. Production documents and
ADRs remain authoritative; ticket files point to them after the Wayfinder closes.

## What the program delivers

Wayfinder gate 08 (§ Answer, sealed 2026-07-25) defines the first playable slice
as **one real, complete 1v1 duel match, human versus bot, at full compound
depth**, run to a capital fall at its natural length. That is not a small tracer,
and gate 08 recorded the trade knowingly: the slice's *smallness* was given up to
buy undistorted real-play data.

What was **not** given up is the build's *incrementality*. This tracker stays a
walking skeleton: a thin end-to-end loop closes early — **ticket 07 is the first
point at which a whole match can be played from setup to victory** — and each
later ticket thickens one layer of an already-terminating game. Failures still
localize to a demoable increment.

## Hard readiness rule

Do not implement any ticket while its status is `needs-info`.

A ticket becomes `ready-for-agent` only after:

1. every listed Wayfinder gate is `resolved`;
2. gate 12 has published the accepted decision set into Production documents
   and any required ADRs;
3. the ticket's `Specification gates:` line has been replaced by exact
   Production/ADR pointers;
4. every war behavior the ticket invokes is implemented against its accepted
   contract, and named;
5. its acceptance criteria can be verified without inventing a mechanic or
   reading Working-layer recommendations as authority;
6. `npm run lint:docs` passes after the publication batch.

`ready-for-agent` means fully specified. The ticket's `Blocked by:` line still
controls whether it is the next executable frontier.

### Amendment R6 — per-ticket authority waiver (user ruling, 2026-07-25)

Conditions 2, 3 and 6 above are **waived per ticket** when both of the following
hold. Conditions 1, 4 and 5 are untouched.

- **(i) sealed authority** — every Wayfinder gate the ticket cites is
  `resolved`, so its contract exists in a sealed § Answer that the ticket may
  read as authority directly;
- **(ii) zero unlanded values** — no acceptance item needs a value or rule that
  is undetermined, in conflict, or recorded only outside the repository.

The waiver moves *where the contract is read from*; it does not soften the bar
against inventing values, because test (ii) **is** that bar. Gate 12's
publication is now a doc-sync debt paid alongside the build, not a gate in front
of it. Rationale and the ruling text: `DECISIONS-OWED.md` § R6.

**Waiver status, 2026-07-25** — recompute (ii) at claim time; a ticket only
leaves this table by having its blocking value landed at a birthplace.

| Ticket | (i) | (ii) | Result |
|---|---|---|---|
| 01 | ✅ gates 05, 06, 02 | ✅ no value at all; gate 10's unfilled thresholds are already designed to fail `pending` | **LANDED 2026-07-25** |
| 02 | ✅ gate 06 | ✅ R3 sealed the capital rule; partition balance was withdrawn (every region is pop 6.0) | **LANDED 2026-07-25** |
| 03 | ✅ gate 02 | ✅ **R8 sealed § 1.3** (2026-07-25); the 행동력 stack size is recorded (ledger D6.3, 가안 20) and the non-combat unit prices R2 left unset are not invoked by this ticket | **LANDED 2026-07-25** |
| 04 | ✅ gate 07 | ❌ 판세 in-play surface (Part 2 #13) | needs-info |
| 05 | ✅ | ✅ **recomputed 2026-07-26** — the row's "decay dials unlanded" was stale: all five verified at their birthplaces (`capLandFrac 1` AB-②, `registerPerPop 1,800` / `capPerPop 600` / sustain ⅓ MT-②+M13, ripening ADR 0022/0029). The scope widened by **R9** (force model + recruitment) adds no undetermined value: **R10** found the commit→recruitment unit already sealed (MT-③ +1%p/point) and **R11** adopted the four archive-only numbers as recorded 가안 | **LANDED 2026-07-26** |
| 06 | — | — | **re-cut 2026-07-26 into 06a–06d** (gate C); the file is an index |
| 06a | ✅ | ✅ **R19 authority batch and implementation landed 2026-07-26** — ADR 0045 + match-arc MT-⑥ resolve recruitment siting, province-origin accounting, readiness, and the retained 20-point/+1%p command economy; war-model-build WM-④ publishes opening placement and authored-edge endpoints. Cross-host replay: 149 Node / 18 browser, actor-safe summary `0ca0eb0d6bd4a9d7`, identical `29f214a11fc56ef8` parity observations; gate-10 threshold remains PENDING | **LANDED 2026-07-26** |
| 06b | ✅ | ✅ **the fourteen fatigue/movement/supply dials landed at `war-model-build/MAGNITUDE.md` WB-M①** (2026-07-26, user bulk approval; L1 — exercised in the L2 harness, never the subject of a sweep). Part 2 #11 was a **stamp** and is paid there: both sides always said ×0.5. Dial 9 stays deliberately **HELD** and is wired so a later answer is a value change | **LANDED 2026-07-28** — re-cut the same day to the wear half: the supply **predicate** moved to R16 (`docs/DESIGN-RISKS.md`), the supply arithmetic stays landed and dormant, and supply is uniform because the plans that would cut it are not built. Ticket 07's negative guarantee is satisfied by construction and asserted by test |
| 06c | ✅ | ✅ 06b's batch landed, and the delaying 가안 (breakthrough R 2.0, erosion 0.15) landed at `operation-plan-catalog/CATALOG.md`. M2/M4/M5 were already sealed. Part 2 #2 (Encirclement) is **not** in scope here and must not be resolved by implication | **ready-for-agent** |
| 06d | ✅ | ✅ **the last question dissolved rather than being answered** (R18, 2026-07-26). The garrison-regen rate *was* landed all along — M5 exported it and **M12 received it**, twice amended — and then R18 removed the need for it: garrison regeneration is recruitment plus a destination, and a garrison fills by **transfer** at the movement price R12 already sealed. The register also returns to **per-province** (R18 iii), which restores MT-②'s wording and makes R17's proportional succession exact rather than approximate. R19 recruitment siting is now the upstream MT-⑥ / ADR 0045 authority batch, not an unlanded 06d concern | **ready-for-agent** |
| 07 | ✅ | ❌ capital guard magnitude (Part 2 #10); CP-① item 3 stale (§ 1.8) | needs-info |
| 08 | ✅ | ❌ Part 2 #1, #4, #5, #6 — the whole fog band | needs-info |
| 09 | ✅ | ❌ Part 2 #3; the tactical-R composition | needs-info |
| 10 | ✅ | ❌ Part 2 #7; the fit-ranking function (§ 1.5) | needs-info |
| 11 | ✅ | ❌ Part 2 #2, #8, #9 | needs-info |
| 12 | ✅ | ❌ Part 2 #12; R4's three axes are unvalued | needs-info |
| 13 | ✅ | ❌ every acceptance threshold belongs to gate 10 | needs-info |

Each ticket carries an interim `Contract (interim pointers):` line so a reader can
find today's truth before that publication happens. Those pointers are **reading
aids, not the authority rule 3 requires** — they do not make a ticket ready.

## The readiness chain — read this before planning work

> **Amended 2026-07-25 by R6.** This section previously opened "No ticket can
> reach `ready-for-agent` today". That is no longer true: tickets 01 and 02 pass
> the per-ticket waiver above. The gate table below still describes the *gates*
> accurately — what changed is that an open gate 12 no longer bars a ticket whose
> own gates are resolved and whose values are all landed.

State as of 2026-07-25:

| Gate | Status | What still blocks it |
|---|---|---|
| 05, 06, 07, 08 | **resolved** | — the four real grill gates are sealed |
| 09 | open (demoted) | residue = classifying the port targets (accepted / superseded / incidental); folded into slice work by the 2026-07-17 re-cut |
| 10 | open (demoted) | residue = proof strength, who judges the human rung and what counts as a FAIL, and whether 10 is the *admission* gate to L3 playtesting or its *verdict*. **Gate 10 owns every acceptance command's pass/fail threshold**, so it gates all thirteen tickets |
| 11 | open (re-framed by ADR 0041) | residue = whether anything is retired at all, and on what evidence |
| 12 (a) governance batch | **blocked** | its declared precondition `.scratch/doc-structure/issues/10-audit-run-3.md` reads `Status: BLOCKED — the gate itself is unsound` / `⛔ DO NOT EXECUTE` |
| 12 (b) ticket re-pointing | open, mechanical | needs (a); no grill required |

So the path to executable tickets is: close 09 / 10 / 11 (small residues), then
resolve the doc-structure blocker or take a user decision to route around it, then
run 12 (a) and 12 (b). Do not assume the re-cut alone made these tickets
actionable — it re-cut their *shapes*, not their authority.

## Build dependency chain

| Ticket | Player-visible increment | Direct blocker |
|---|---|---|
| 01 | a deterministic L3 viewer boots from the new `game/` tree | none after specification publication |
| 02 | a two-realm board is drawn, partitioned, and given capitals | 01 |
| 03 | a turn cycles: blind commit → simultaneous reveal → resolve → N+1 | 02 |
| 04 | the commit-first shell is the way the game is actually operated | 03 |
| 05 | holding less land visibly costs income and force ceiling | 03 |
| 06a | a field army stands somewhere, marches, divides and merges | 03, 05 |
| 06b | marching and fighting tire an army; a cut supply line starves it | 06a |
| 06c | a real decisive battle resolves | 06b |
| 06d | ground changes hands and starts paying its taker | 06c |
| 07 | **a capital falls and the match ends — the loop closes** | 06d |
| 08 | reconnaissance changes what the player knows | 07 |
| 09 | the EVAL BAR reads the engagement and the commitment | 08 |
| 10 | plans are a real choice, not one generic attack | 09 |
| 11 | plan beats plan for a legible reason | 10 |
| 12 | a bot plays the same instruments the human does | 11 |
| 13 | one full-depth match runs to capital fall, undistorted | 12 |

**Ticket 06 was re-cut into 06a–06d by Wayfinder gate C (2026-07-26)**; the old
`06-…md` is now an index, not a work unit. The cut is a chain — the operational
layer's position substrate (06a) turned out to be *upstream* of combat rather than
beside it, because the landed turn loop resolves a front from committed chips alone
while the sealed formula needs substance, and a field army had no position at all.
07 needs 06d, since R1 makes a capital fall an ordinary sector capture.
Everything else is a chain.

One implementation session claims one ticket. Do not combine adjacent tickets
to save setup time: the demoable boundary is also the failure-localization and
review boundary.

## Design threads that are designed IN-build, not before

These need the wired engine or real play as inputs. **Do not open a pre-build
grill for them** — the decisions they depend on are already sealed, and these are
the parts that cannot be pre-sketched.

- **The resolve-order algorithm** (ledger D6.1a) → ticket 03. The principle is
  sealed; the case enumeration and the symmetric rule are their own rule-design
  pass, run against the real board.
- **The EVAL BAR's tactical-R composition formula, its name, and its visual**
  (ledger Gate 6, explicitly left open) → ticket 09. The name is the user's call.
- **The reconnaissance economy numbers** → ticket 08, measurement-gated. The
  presentation contract is sealed; the prices are candidates.
- **Capital-terrain and encirclement dynamics** → deferred with the Moscow-trap
  fall path; tuned in the parallel map pass once the engine plays.

## The scope test — wiring, not new systems

**User ruling, 2026-07-25:** this program's mandate is to **lay the wiring so that
everything already designed actually gets implemented**. That gives a scope test
sharper than a feature list: for anything in question, ask *is this wiring an
existing design, or is it introducing a system?* Wiring is in. A system is out,
even when it is fully designed elsewhere.

Worked example: **capital relocation (천도) is OUT** — ruled out by the user under
exactly this test. Ledger D6.3 names it as an order kind and capital CP-② item 4
specifies its mechanics completely, so it is not an undesigned hole; it is a large
system and a core strategic element, and building it is not wiring. Recorded in
ticket 07 so a later reader of CP-② does not mistake the absence for a gap.

## When implementation meets a design problem — the confirmed workflow

**Confirmed by the user 2026-07-25.** Assembling everything designed will keep
surfacing design problems; this is the standing rule for who decides, by kind.
Only the last row is the agent's to act on alone.

| Kind | What it looks like | Who decides |
|---|---|---|
| **Seal conflict** | two or more sealed statements that cannot both be implemented | **User.** Stop at the seam. The user also corrects seals that are wrong or that their thinking has moved past. |
| **Undetermined 가안 value** | the design says a value exists and is tuned in play, but no value is recorded | **User** — batched, not one interruption at a time. The agent brings a table: value name / why nothing runs without it / a starting value derived from a neighbouring seal / that derivation / what play would reveal. The user approves or edits. The agent never originates the number, and the user is never asked to invent one from nothing. |
| **Undesigned system** | mentioned but never specified | **Out of this slice.** Never filled in, never coded. |
| **Plan omission** | the design is complete and self-consistent; no ticket was building it | **Agent, autonomously** — with a duty to cite the seals it assembled and to have written **zero** new values or rules. If that citation list cannot be produced, it was not a plan omission and the work stops. |

**The boundary test the agent runs**, in order: (1) does implementing this require
me to write a normative statement that does not exist? → if yes, not mine; (2) do
two or more seals disagree? → if yes, stop; (3) otherwise it is assembly, and mine.
**When the call is ambiguous, treat it as (1).**

Precedent, both from 2026-07-25: the 판세 display conflict went to the user
(kind 1); the land-derived decay engine was built as ticket 05 by assembling
D5.1/D5.2/D5.3 + D6.2/D6.4 + OG-①/AB-②/MT-② with zero new values (kind 4).

## What the user must decide before this runs

`DECISIONS-OWED.md` in this directory is the decision surface, assembled
2026-07-25 from a demand-driven sweep: six read-only agents started from these
thirteen tickets' contract pointers, enumerated every value and rule an
implementer needs, and searched the repository for each. It keeps only what the
user must rule on, and shows a derivation for every proposal so the user edits
rather than invents. Read it before treating any ticket as buildable.

## Promotions owed while these tickets run

Already registered in `docs/SYNC-DEBT.md`; they fire during build-spec authoring
rather than at gate close:

- the **cradle-reuse + random two-realm partition** architecture → a
  terrain-cradle doc note or ADR (shares a home with the 1v1 map-re-authoring
  row: the two-realm binding *is* the first 1v1 world artifact);
- a formal feature-doc birthplace for the **turn structure** and the **EVAL BAR**;
- the **판세 conflict** surfaced by this re-cut (see ticket 04): gate 07 encoded a
  live match-level 판세 mini-meter and gate 03 routes treasury uncertainty through
  its band width, while duel-pivot Gate 6 later dropped the in-play strategic bar;
- the gate-06 loader, the code-contract tree scan, and the operation-plan
  magnitude graduation.

## Re-cut history

The pre-pivot ticket set (2026-07-16, nine tickets) was cut before ADR 0041/0042
and before the gate-08 slice definition. It is superseded; git history holds the
files. Mapping, so older references resolve:

| Old | Fate |
|---|---|
| 01 boot deterministic L3 viewer | → **01** (survives, expanded with the gate-05 command surface and audit-lint re-aim) |
| 02 read and focus authored world | → **02** (expanded: two-realm partition + capital placement) |
| 03 scout and change player knowledge | → **08** (moved later; the migration-grade projection now lands in 03) |
| 04 first atomic war operation | → exploded into **06** (combat core), **10** (plan selection), **11** (matchups), **07** (capital) |
| 05 complete a human–bot round | → **03** (turn loop) + **12** (bot); the pre-pivot alternating-actor round is void — the turn is simultaneous |
| 06 carry a war to an accepted outcome | → **07**; war and match are one, and the terminus is capital fall alone (ADR 0042 collapses the ADR 0038 composite) |
| 07 complete one L3 match | → **13** |
| 08 verify and promote canonical play path | **mostly void** (ADR 0041: the game never occupies a public route, so route promotion and static-artifact rollback are the landing page's concern). Surviving residue folded into **13** |
| 09 retire legacy comparison path | **void as a build ticket** — the archive has no traffic to assume. The residue is Wayfinder 11's open question, not implementation work |
| — | **NEW 04** commit-first UI shell (gate 07 sealed it; the old set had no home for it) |
| — | **NEW 05** land-derived decay engine (D5.1/D5.2/D5.3 + D6.2 background tier; the old set and the re-cut sketch both had no home for it, and D6.4's "natural length" depends on it) |

## Fresh-session preflight

1. Read the repository `AGENTS.md`, then this runbook and the selected ticket.
2. Read every Production/ADR pointer in the ticket; do not substitute the
   umbrella Working spec for those sources.
3. Confirm the ticket is `ready-for-agent`, every direct blocker is `resolved`,
   and no new `needs-info` comment has been appended.
4. Inspect `git status --short`. Preserve unrelated user work. When the main
   worktree is dirty or another ticket is active, use an isolated Git worktree
   based on the exact accepted commit; `git worktree` is available in this
   repository. Never stash, reset, or absorb unrelated changes.
5. Change only the selected ticket to `Status: claimed` before implementation
   and commit that claim with the ticket work or as a small claim commit.
6. State the ticket's observable success criterion before editing code.

If any preflight condition fails, stop implementation, return the ticket to its
prior status if this session claimed it, and record the exact missing authority
or prerequisite under `## Comments`.

## Implementation loop

1. Add the narrowest failing contract test for Runtime, projection, preview,
   validation, replay, or rule behavior before production logic.
2. For visual-only behavior, make the smallest change and verify it through the
   real browser path and agreed viewport instead of forcing a low-value unit
   test.
3. Keep authoritative state behind the Runtime. React and the renderer consume
   viewer projections; preview consumes only `(view, intent)`; bots are ordinary
   callers.
4. Reimplement accepted behavior from its Production contract. The archive
   (`js/`, `tests/`, `mockup/`) is evidence only, and only after its behavior is
   classified — never an import, never a line-by-line port, and never a parity
   comparator for behavior it did not run (ADR 0041).
5. Run the ticket-specific checks first, then the shared gates required by the
   ticket. Do not claim browser behavior from Node tests or type safety from a
   Vite build.
6. Exercise the ticket's player-visible increment. Capture the world identity and
   revision, seed, intent fixture/log, browser path, and viewport when they matter.
7. Review the diff for forbidden scope: new canonical JavaScript, truth fields in
   viewer surfaces, React-owned rules, Runtime sleeps, standalone movement,
   forced-termination devices, unclassified legacy behavior, or duplicated
   definitions.
8. Append verification evidence and any deliberate follow-up under the ticket's
   `## Comments`, then set `Status: resolved` only when every acceptance item is
   satisfied.
9. Commit only the selected ticket's implementation, tests, and directly owed
   documentation. Leave unrelated worktree changes untouched.

## Verification evidence format

Append this compact record to the ticket:

```md
## Comments

### Implementation evidence — YYYY-MM-DD

- Commit: `<sha>`
- Production authority: `<exact pointers>`
- Narrow tests: `<commands and pass counts>`
- Shared gates: `<commands and results>`
- Browser/runtime check: `<path, viewport, world id + revision, seed>`
- Legacy evidence disposition: `<accepted / structurally obsolete /
  superseded / incidental; files used>`
- Follow-up: `<none or exact ticket/debt pointer>`
```

Evidence records outcomes; they do not define mechanics or dials.

## Suggested fresh-session invocation

```text
Implement only L3 playable-build ticket NN from
.scratch/l3-playable-build/issues/NN-<slug>.md.

Follow AGENTS.md and .scratch/l3-playable-build/README.md. Verify the ticket is
ready-for-agent and unblocked, claim it, read every Production/ADR pointer, use
an isolated worktree if the current tree is dirty, implement test-first where
the behavior is deterministic, run the ticket and shared verification gates,
record evidence in the ticket, set it resolved only if all criteria pass, and
commit only this ticket's scope. Do not infer unresolved mechanics from the
reference archive or from the Working umbrella spec.
```

## Status lifecycle

```text
needs-info
  -> ready-for-agent   # gate 12 publication and audit completed
  -> claimed           # one implementation session owns the ticket
  -> resolved          # acceptance and evidence completed
```

If an implementation discovery reveals a genuine design gap, change the ticket
to `needs-info`, record the question and authoritative conflict, and stop at the
seam. Do not hide a design decision inside code.
