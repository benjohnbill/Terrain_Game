# L3 First Match Wayfinder Map

Label: wayfinder:map
Status: open
Charted: 2026-07-25 (user, destination redraw)

## Destination

**A human plays one complete 1v1 duel match on the L3 build, to a capital fall,
and comes back with a verdict on how it felt to operate.** Reaching the end of
this map means two questions are answered by play rather than by argument: does
everything already designed actually work when assembled, and what is the UX
like. Fun is not the bar here — it is the *next* map's subject, opened by the
complaints this one's play session produces.

## Why this map exists — the destination was redrawn

This supersedes the destination of `.scratch/l3-playable-seam/` (the L3 Playable
Seam Wayfinder). That map's stated destination was
*"…playable through a React + Vite + TypeScript/TSX UI and framework-free
TypeScript Game Runtime, emitted as ESM JavaScript for browser and Node, for one
complete match."* Every clause is **plumbing**. The effort's own name is
"Playable **Seam**". Nothing in it says the match should be *enjoyable to
operate*, because at charting time the goal was reachability, not experience.

The user's ruling, 2026-07-25: the game's direction has since settled into a 1v1
duel, and what is wanted now is *"우리가 가진 설계와 로직을 기반으로 수치들이 어느
정도 가상일지라도 하나의 완성된 한 판을 즐길 수 있는 게임"* — so the map should be
re-planned around what the build is actually for, with the well-designed gates
carried forward as inputs.

Under the documentation law and the Wayfinder's own rules, a redrawn destination
is a **fresh effort, not a resumption**. Hence this map. The seam Wayfinder is
**not discarded**: its four sealed grill gates are inputs here (see § Inherited),
and it stays the record of how they were decided.

**What was NOT relitigated, and must not be:** the seam gates' decisions are all
pivot-consistent, and the user re-confirmed that carrying them forward is
correct. This map redraws the *destination*, not the settled decisions beneath it.

## Notes

- **This map carries execution.** The Wayfinder default — plan, don't do — is
  **overridden here by explicit user decision.** UX cannot be verified without a
  running build, so the map's last ticket is a played match, and the thirteen
  implementation tickets in `.scratch/l3-playable-build/` are this map's
  execution arm rather than work handed off past its edge.
- **The mandate is wiring, not new systems.** *"기능상으로 설계된 모든 것들이 실제로
  구현되도록 배선을 까는 것."* The scope test follows: is this wiring an existing
  design, or introducing a system? Wiring is in; a system is out even when fully
  designed elsewhere (worked example: capital relocation / 천도 is out).
- **Graphics are the single carve-out.** Functional design — click behaviour,
  button UI, whether a reading is legible, whether an action is operable — is
  **in scope**, because UX cannot be judged without it. Visual beauty, asset
  production, and art direction are **out**: they belong to fun, and they get
  layered on while playing. Grey-box is therefore the *correct* end state of this
  map, not a compromise. This ratifies gate 07's SVG-stays / measurement-gated
  renderer seal and ADR 0028's parked PixiJS trigger without touching either.
- **The board is a working surface, not a showcase.** The cradle terrain split
  into two realms is where *operation and flow* get confirmed. The user's own
  framing: it will not be fun yet, and that is expected — *"아무런 증명 없이 바로
  재밌다고 느껴질 리가 없으니까요."* Carving for fun starts after operation and flow
  read clean.
- **Design problems met during wiring follow a fixed workflow.** Seal conflicts
  and undetermined 가안 values go to the user (values batched with a derived
  starting proposal); undesigned systems are out of scope; only plan omissions
  are the agent's to act on, and only with a citation list proving zero new
  values or rules. Ambiguity defaults to the user. Full table:
  `.scratch/l3-playable-build/README.md` § When implementation meets a design
  problem.
- **Values decided in conversation land in the repository the same session.**
  Adopted after finding that the recon unit prices existed only in agent memory,
  which is ungit-tracked, invisible to Codex, and unreadable by the user — while
  a Production doc cited that memory file as its record.
- **Before calling anything undecided, search `docs/superpowers/`.** Fifteen
  design specs and eighteen plans sit there, Working-layer by the law and absent
  from `AGENTS.md` § Read Order, yet carrying mechanism detail with no Production
  home. Reading only the seal chain produced false "undecided" verdicts twice.
- **Read the artifact before asserting about it.** This effort has been wrong
  about the cradle map twice: once from not opening it, once from opening the
  superseded draft while three feature docs pointed at the right file. A partial
  correction is still a wrong answer.
- **Tooling:** `/usr/bin/grep` for existence checks (`grep`/`rg` are wrapped here
  and give false negatives on recursive searches — quote the glob, zsh expands
  it); `/usr/bin/git` (bare `git log` is unreliable across worktrees). Parallel
  subagents reading large docs hit the session limit at six; three at a time with
  grep-then-read-a-slice instructions works.
- **Voice:** conversation in Korean 존댓말; artifacts in neutral professional
  English.

## Inherited — sealed inputs, not open questions

From `.scratch/l3-playable-seam/` (all four real grill gates resolved; see that
map's § Decisions so far for the full text):

| Input | What it fixes |
|---|---|
| Gate 02 — Runtime authority | the Runtime privately owns truth; projection is the single blur seam; preview is pure; bots are ordinary callers. **One clause needs re-expression** for a simultaneous turn — see fog. |
| Gate 03 — viewer knowledge contract | what each viewer may know; the grade matrix; seven non-leak invariants |
| Gate 05 — build/module/test topology | the nested `game/` TS/ESM tree; the `:game` command surface; single-emit parity |
| Gate 06 — authored world input | a checked-in TS/ESM world artifact; `(worldId, revision)`; three-tier validation |
| Gate 07 — map/fog presentation | commit-first interaction skeleton; coupled continuous camera; SVG measurement-gated |
| Gate 08 — first playable slice | the slice **is** one real full-depth 1v1 match to capital fall — which is why this map's destination and that gate's answer coincide |
| ADR 0041 | environment isolation; the archive is evidence, never a build source or a parity comparator |
| ADR 0042 + capital CP-② | capital fall is the sole win condition, and how a capital falls |
| Duel-pivot ledger, gates 1–6 | the 1v1 match frame: capital mechanics, no draw, land-decay convergence, simultaneous commit→reveal, the single 행동력 chip stack, the EVAL BAR |

Also inherited, and **closed by this map's Notes rather than by a gate**: the seam
map's demoted gate 10 residue *"is 10 the admission gate to L3 playtesting or its
verdict?"*. Under this destination it is the **admission** gate — the verdict is
the play session, and fun is the next map's business.

## Decisions so far

<!-- Closed ticket pointers append here. Open tickets are found by scanning
     issues/, not listed on the map. -->

- **Destination redrawn** (2026-07-25, user) — from a plumbing seam to one played
  match judged on operation, flow, and UX; execution carried inside the map;
  graphics carved out. Recorded above rather than as a ticket, because it is this
  map's founding act.
- **Rulings R1–R5** (2026-07-25, user) — capital fall is an ordinary sector
  capture; non-combat orders are linear in commit with fixed per-action prices
  retired; phase ③ is dropped rather than invented; the bot's disposition governs
  three axes with variety from seeded randomness; capital-candidate free choice
  recorded as a lean awaiting confirmation. Full text with derivations:
  `.scratch/l3-playable-build/DECISIONS-OWED.md` § Rulings received.
- **R6 — per-ticket authority waiver** (2026-07-25, user) — the build's readiness
  rule required gate 12 to republish every decision into Production docs first,
  and gate 12 (a) is blocked behind a doc-structure gate that declares itself
  unsound. The user waived that condition **per ticket**, on a two-part test:
  every cited Wayfinder gate `resolved`, and zero unlanded values. The bar
  against inventing values is untouched — it *is* the second half of the test.
  Gate 12's publication became a doc-sync debt paid alongside the build. **This
  is what turned the map from planning into building:** tickets 01 and 02 went
  `ready-for-agent` the same session.
- **R3 confirmed — capital candidates are any owned sector** (2026-07-25, user) —
  the lean sealed. Eligibility is ownership, so `DECISIONS-OWED.md` § 1.6
  dissolves entirely and `CRADLE_META`'s city tables become advisory. Owes a seal
  at `docs/features/capital/` (SYNC-DEBT registered).
- **Ticket 01 landed** (2026-07-25) — **the L3 build exists and runs.** The
  `game/` TS/ESM island, the seven `:game` commands, and a Runtime holding
  exactly gate 02's three-method surface. `verify:game`: typecheck / build /
  18 Node contract tests / 3 Playwright tests all PASS; parity reports **PENDING**
  with identical digests in both hosts, because gate 10 owns the pass threshold —
  the safety valve doing its job rather than a defect. Root regression 479/479
  untouched. Full result: `.scratch/l3-playable-build/issues/01-…md` § Result.
- **Ticket 02 landed** (2026-07-25) — **the board exists and is playable to the
  capital prompt.** The cradle terrain is baked into a frozen `terrain-cradle@r1`
  artifact (10 regions · 56 sectors · 17 edges · 292 hexes, five open borders
  keeping their native `Infinity`), guarded by a fail-closed tier-1 loader; match
  setup draws one of 15 contiguous population-equal partitions from the seed; and
  both players choose a capital on any owned sector, simultaneously and in
  secret. Full result and measurements:
  `.scratch/l3-playable-build/issues/02-…md` § Result.

## Owed right now

Small, sharp, and not worth a ticket each — but they are owed, so they are listed
here rather than left to memory.

- **One citation fix:** the gate-08 § Answer in `.scratch/l3-playable-seam/issues/`
  still names `map-data.js CANONICAL_MAP` as the reuse basis. That is C-loop
  iteration 1; the authoritative map is `map-gen.js CRADLE_MAP` (iteration 2).
  Ticket 02 is corrected and carries the full evidence; the gate is not. **The
  decision that gate sealed is unaffected** — reuse cradle terrain, random
  balanced partition, player-chosen capital — only its supporting citation is
  wrong, so this is a stamp, not a re-grill.
- **Two seal amendments** already recorded as SYNC-DEBT duties rather than gates:
  a birthplace for the linear-commit grammar, and the decisiveness ladder re-cut
  for a single-terminus duel (its top two rungs are objectives ADR 0042 retired).

## Not yet specified

<!-- In-scope fog: real questions not yet sharp enough to ticket. -->

- **The twelve seal-versus-seal conflicts** in
  `.scratch/l3-playable-build/DECISIONS-OWED.md` § Part 2. Each is sharp enough
  to *state* but they are a batch to work through with the user, not thirteen
  separate tickets. They graduate as they are ruled on. Sharpest first: does the
  estimate band's centre wobble (a user seal against gate 03's invariant plus the
  code); the Encirclement threshold (2.2 versus 1.92, where 1.92 is the
  rout-onset figure); whether a commit marker appears on the eval bar (a seal
  twice over against both prototypes' "never").
- **Re-expressing gate 02's turn-order clause for a simultaneous turn.** Proposal
  standing (read `currentActor` as the current phase; legality becomes "has this
  realm locked / is the window open"), user confirmation owed. Sharp, but it may
  resolve inside the batch above rather than needing its own ticket.
- **Which surfaces the values single-source.** The supervision design turns on
  values living in exactly one declared place with a lint forbidding numeric
  literals in rule modules. Whether that place is a birthplace document with a
  generation step, or a values file the documents point at, is undecided — and
  the answer partly depends on how many values there are, which the value index
  will show.
- **Amending the seals that R2 and R4 widened.** The disposition seal
  (tactical-plan-ai ruling ②) sets a single λ point and now needs three axes; the
  linear-commit grammar is a match-frame rule with no home yet. Both are Tier-2
  recordings of decided things rather than open questions, so they are duties
  rather than gates — tracked in `docs/SYNC-DEBT.md`.
- **How the play session is run and its verdict captured.** The destination ends
  in a human verdict; what gets recorded, and against what, is not yet settled
  (the seam map's gate 10 owns the mechanics and is still open).
- **The next map's subject.** The complaints this map's play session produces —
  what is not fun, which UI to change, what the graphics should become — are
  deliberately out of scope here and are the seed of the following effort.

## Out of scope

- **Visual beauty, asset production, art direction, animation polish, a renderer
  upgrade.** Carved out by user ruling; layered on during play.
- **Fun.** Not a synonym for the above. Balance carving, tuning for tension, and
  the judgment of whether the match is enjoyable all belong to the next map. This
  map ends when operation, flow, and UX have been *seen*.
- **New systems, however well designed elsewhere.** Capital relocation (천도) is
  the worked example. Also: settlement negotiation, reserves, multi-stage
  operations, the Moscow-trap fall path, disposition variants beyond the one that
  ships.
- **Human-versus-human play, PvP pacing, accounts, servers, networking.**
- **The subscription judgment-coach BM**, and any live in-play coach — the latter
  is barred by seal, not merely deferred.
- **Re-authoring the map for 1v1.** A parallel pass; this map uses the cradle
  terrain partitioned in two.
- **Native shell packaging.** A browser is the development and playtest host;
  the shell choice stays deferred (ADR 0016 stage 2).

## Relationship to the other trackers

- `.scratch/l3-playable-seam/` — **closed as a decision effort.** Its four grill
  gates are inputs above; gates 09/10/11/12 remain open there and still gate
  ticket readiness (gate 10 owns every acceptance threshold; gate 12 (a) is
  blocked by `.scratch/doc-structure/issues/10`). Those are inherited
  obstacles, not this map's decisions to re-make.
- `.scratch/l3-playable-build/` — **this map's execution arm.** Thirteen tickets,
  walking-skeleton order, the loop closing at ticket 07 (capital fall). Its
  `README.md` carries the runbook, the readiness chain, and the design-problem
  workflow; its `DECISIONS-OWED.md` is the user's decision surface.
