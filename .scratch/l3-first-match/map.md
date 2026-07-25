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
- **R7 — commitment is visible, the choice is not; both-committed advances the
  turn** (2026-07-25, user) — the *fact* of a realm's commitment is public
  because deliberation time is a psychological read, because it is the genre's
  commit-and-reveal grammar, and because the turn advances on both sides having
  committed. The general rule, not a capital-beat special case. **Its rider
  narrows § 1.3**: "both done → turn advances" *is* the turn-advance rule the
  Runtime-interface re-expression has been proposing, so that fog item is now one
  confirmation rather than an open design question.
- **Ticket 03 landed** (2026-07-25) — **the turn turns.** Both realms allocate a
  whole turn from one 20-chip 행동력 stack in secret, lock, and the second lock
  reveals, resolves and opens turn N+1 inside the same call — no upkeep screen, no
  extra click. Resolution is deliberately a *reading* (`outcome:
  'pending-operations'`): combat is ticket 06. The resolve-order rule D6.1a routed
  into the build was designed here (ruling TL-①, four enumerated overlap cases, two
  of which this board makes impossible) with **zero new values**. Symmetry is
  asserted rather than argued — swapping the two realm ids leaves the board and the
  events equivalent under that relabelling. `verify:game` all PASS, parity PENDING
  by design; 94 Node + 14 browser; root 479/479. Full result:
  `.scratch/l3-playable-build/issues/03-…md` § Ruling and § Comments.
- **R8 — turn legality is per-realm-per-turn, not alternating** (2026-07-25,
  user) — the § 1.3 confirmation, taken as written: legality reads "has this
  realm committed this turn / is the commit window open", and gate 02's
  `currentActor` keeps its name while being read as the current phase. Gate 02's
  guarantee (the Runtime decides legality, not the caller) never depended on
  alternation, so it survives verbatim. **This was ticket 03's only blocking
  row** — the ticket went `ready-for-agent` the same session. Full text:
  `.scratch/l3-playable-build/DECISIONS-OWED.md` § R8.

- **R9 / R10 / R11 — ticket 05 is where realm substance is born** (2026-07-26,
  user). A pre-claim verification sweep found the waiver table's "decay dials
  unlanded" stale — all five are at their birthplaces — and found something the
  original sweep missed: **`MatchState` holds no military state at all**, and the
  authored world ships `garrison: 0` on every sector, so 05's force limit capped
  nothing and 06's battle had nothing to fight with. **R9** gives 05 the treasury,
  the force limit, the register, the starting field army and border garrisons, and
  recruitment — with the capital guard held for 07, garrison regeneration held for
  06, and 초토화 out. **R10** rejected the agent's proposed +10%/turn rate cap (it
  was read off a struck-through line) and landed the unit that MT-③ had already
  sealed: **+1%p of the force limit per 행동력 point, uncapped**, which reproduces
  both of MT-④'s buildup tempo anchors. **R11** adopted four archive-only numbers
  (1 부대 = 100 men, treasury start 5, surge ×2/×12) as recorded 가안 to be repaid
  in play. Full text: `.scratch/l3-playable-build/DECISIONS-OWED.md` § R9–R11.
- **Part 2 #14 — does the operational layer track and move armies?** (found
  2026-07-26 while sizing ticket 06.) A three-way conflict: `DOMAIN_MAP.md`'s
  ✅ `Position as product` forbids army counters and standalone movement, gate 08
  bought full compound depth, and the slice-2 movement contract needs both. Its
  march speed does not even transplant — 3 hexes/turn against a **median 5-hex
  sector** means an army would not cross one sector in a turn. **Ticket 06 is not
  one ticket**: its twelve items are the surface the archive built across eleven.
  **User ruling: a Wayfinder gate, opened once 05 lands** — and it is on the
  critical path, since ticket 07 (where the loop closes) is blocked by 06.

- **Ticket 05 landed** (2026-07-26) — **losing ground now costs.** Income and the
  land-derived force limit recompute from currently-held land every turn, folded
  into the reveal's tail; occupied ground pays neither side (OG-③); recruitment
  converts action points into men at MT-③'s integral price with no rate cap. Realm
  substance — treasury, field army, border garrisons, conscription register — is
  born here rather than nowhere. `verify:game` all PASS (parity PENDING by
  design), 119 Node + 15 browser, root 479/479. **Two measurements the ticket did
  not predict**, both registered in `docs/SYNC-DEBT.md` rather than patched: the
  surge price curve never fires on this board (mobilization peaks 41.7% under a
  42% knee, because M13a's per-border-sector garrison and its ρ anchor cannot both
  hold on a map with a third the border), and the economy has no sink once the
  field fills. The two-axis review also caught the implementation contradicting a
  seal (flat opening treasury against TC-⑭) and silently answering an open
  question (permanent limbo against M14 ⑮) — both corrected, the second registered
  as **Part 2 #15** for ticket 06. Full result:
  `.scratch/l3-playable-build/issues/05-…md` § Comments.

- **Gate C SEALED — the operational layer moves, and conquest integrates**
  (2026-07-26, user; rulings R12–R17, ADRs 0043 + 0044). The two kind-1 seal
  conflicts blocking ticket 06 are both closed, and neither closed the way the row
  predicted.

  **#14 → R12–R15.** The row was framed as three-way (`Position as product` vs
  gate 08 vs the slice-2 movement contract), but reading the landed build moved the
  question: `readFronts` resolves a front from **chips alone** while the sealed
  formula is `substance × lever × quality × fatigue`, so nothing said how *substance*
  reaches a front. Position now exists; **hex-denominated math with destination-grain
  orders** (a distinction the seals already drew and the row had collapsed); a march
  costs **turns and fatigue, never commit** — commit is a multiplier and a march has
  no multiplicand, and slice-2 §3 already refuses "a third resource"; march fatigue
  accrues **per hex**; and **commit legality is reachability**, which reuses the
  sealed reach cone with a second caller instead of adding a mechanism. Two holes
  closed by lookup rather than ruling: M2's `0 points = ×1.00` already makes an
  unattended garrison fight at its own strength, and `sectorAdjacency` was baked in
  at ticket 02 *for* sector-level movement. Amends the Tier-0 `Position as product`
  entry — what it protected (no hex-by-hex marching, no movement turn-toll) survives.

  **#15 → R16–R17.** Both sides were damaged by the same ADR, so neither could win:
  M14 ⑮ argued cap growth from a hegemony check ADR 0042 retired, and OG-③'s limbo
  lost its settlement exit to the same ADR. A third seal, D5.3, turned out to sit
  *downstream* of OG-③ — its "land loss never shrinks the register" was deduced from
  permanent limbo, so it **dissolves** rather than being overridden. Conquered land
  now transfers everything the land carries, on the unchanged ADR 0022/0029 ripening
  lag, and the register succeeds **in proportion to the accumulated stock** so that
  a bled-dry province cannot hand its taker fresh bodies. Snowball is accepted as
  inherent; the three counterweight directions are recorded as a later session's
  input and deliberately not designed.

  **Two measurements this gate paid for.** (a) The claim that the march-speed dial
  "does not transplant" is **retracted**: it compared 3 hexes/turn against sector
  *size* (median 5) when what a march crosses is sector *spacing* (median **2**).
  Speed 3 gives reinforcement in 1–2 turns, invasion in 2–3, lateral redeployment in
  3–4 — so movement introduces **no new value**, only a Part 3 bulk approval. (b) The
  pure hex graph has **two components**: only 15 of 17 authored edges are
  hex-adjacent, and the two that are not are the `strait` doors into **r10, an
  island**. Hex-only pathfinding would reject every march there as unreachable and
  report it as correct behaviour, so the movement graph is hex adjacency ∪ authored
  edges. Full text: `DECISIONS-OWED.md` § Rulings received 2026-07-26 (gate C).

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
