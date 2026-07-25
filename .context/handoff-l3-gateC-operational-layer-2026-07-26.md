# Handoff — the operational-layer gate ("C"), then ticket 06

Written 2026-07-26, end of the ticket-05 session.
Next session: **open a Wayfinder gate on Part 2 #14 and #15, grill them, then
fill ticket 06's `needs-info`.** User's stated plan, in that order.

**Narrative only.** Every load-bearing fact is in the repository — the standing
lesson of this effort (`.scratch/l3-first-match/map.md` § Notes: *"Values decided
in conversation land in the repository the same session"*). If this file and the
repo disagree, the repo wins.

---

## Where the work stands

`main`, clean. Tickets **01, 02, 03, 05 LANDED**. The loop turns, the board is
partitioned and capitalled, and the realm economy runs. Resolution is still a
stub (`outcome: 'pending-operations'`) that changes no ownership.

Baseline on `main`: `npm run verify:game` — typecheck / build:runtime /
build:viewer / test:node **119** / test:browser **15** all PASS, parity
**PENDING** by design (gate 10 owns the threshold; both hosts identical). Root
`npm test` **479/479**. `npm run lint:docs` 0 blocking, 7 advisory (known
ledger-currency false positives — ignore them).

Branching: merge to `main` when a ticket lands, fresh branch per ticket.

---

## What the next session is for

**Ticket 06 is blocked on two questions, and neither is a value.** Both are
recorded in `.scratch/l3-playable-build/DECISIONS-OWED.md` § Part 2:

### #14 — does the operational layer track and move armies at all?

A **three-way** conflict, not two-sided:

- `DOMAIN_MAP.md:246` ✅ `Position as product` — the MVP has **no standalone move
  action and no tracked army counters**; position is a product of operations. The
  runbook's own diff review (§ Implementation loop 7) lists "standalone movement"
  as forbidden scope.
- Gate 08 § Answer — the slice is **one real full-depth match**, and it bought
  depth over smallness knowingly.
- The slice-2 design spec §3 movement contract — armies hold hex positions,
  forced march is an explicit toggle, field armies divide and merge. That *is*
  army counters and standalone movement.

Two things make it bigger than a row:

1. **The dial does not transplant even if the conflict resolves toward slice-2.**
   Its march speed is 3 hexes/turn; L3 sectors are a **median of 5 hexes**
   (measured: 56 sectors, 3/5/8 min/median/max), so an army would not cross one
   sector in a turn. A sector-level speed is a genuinely new value — and it sets
   the fog reach cone's radius, so it moves ticket 08 too.
2. **Ticket 06 is not one ticket.** Its twelve acceptance items span the whole
   slice-2 operational layer plus the slice-1 combat core. The archive built that
   surface across **eleven** tickets. Resolving #14 re-cuts 06 rather than
   unblocking it.

### #15 — does conquered land ever start paying its taker?

Found by the ticket-05 code review, which caught the implementation answering it
by accident (a frozen homeland record made limbo permanent).

- `MAGNITUDE.md` M14 + ruling ⑮: **"conquest raises the national cap"**, at a
  usable discount (fresh capture 50/60%) — sealed as the match-closure lever;
  ADR 0022/0029 supply the ripening that integrates it.
- OG-③: occupied-untransferred land counts toward **neither** side — and the
  channel that ended limbo was **settlement**, which ADR 0042 retired for the
  duel, leaving no path from occupied to integrated.

Stakes: under permanent limbo, conquest is purely subtractive and land is taken
only to starve the opponent; under ripening, taking ground also grows you and
M14 ⑮'s closure lever survives the pivot. **Ticket 06 cannot take a sector
without this.**

Ticket 05 was corrected to leave it open: `MatchState.homeland` is ordinary
mutable state and `domain/economy.ts holdsOf` documents the question rather than
deciding it.

---

## Two measurements parked as play questions (user ruling 2026-07-26)

Both are in `docs/SYNC-DEBT.md`, both re-measure after 06 and 07. **Do not tune
either in the next session** — the user parked them deliberately.

1. **The economy has no sink once the field fills.** Recruitment is the only
   spend in the slice, so treasury grows unbounded at the ceiling (345 yield by
   turn 12 against income 32). The user: how much scarcity money should impose
   depends on what strategies cost to execute and how much a player recruits — a
   composite only play resolves, and one the seal system was built anticipating.
2. **The surge price curve is quiet in peacetime.** Cause isolated: same terrain,
   fewer cuts. M13a's coordinates reproduce exactly at **15 border sectors per
   seat**; a 1v1 partition gives **3–8 (mean 6)**, so ρ at war footing is ~0.25
   against a sealed 0.75. But the curve's designed trigger is **register erosion
   from deaths**, and ticket 05 has no deaths — 429 cumulative casualties clear
   the knee at B=5. **This one gets substantially more informative the moment 06
   lands**, so re-measure early in that ticket.

Note the trap in "fixing" #2: the L2 board's freeze (decided 21%→7%) was caused
by *thick* shields, so restoring ρ = 0.75 by tripling garrisons could re-import
the signature the duel pivot escaped.

---

## What ticket 05 built, that 06 plugs into

Read the code, not this summary — but these are the seams.

- **`domain/economy.ts`** — the land readings and their constants. Pure functions
  over plain values; imports no `MatchState`. `incomeOf` / `forceLimitOf` /
  `registerOf` / `landValueOf` / `holdsOf`.
- **`domain/recruitment.ts`** — the price curve (`marginalPrice`, `draftBill`) and
  the draft order (`draftOrder`, four affordability mins). Also `ORDER_RECRUIT`
  and `orderKeyOf` — the allocation-key namespace orders share with fronts.
- **`MatchState.forces`** — the two stored stocks per realm (treasury, register)
  plus `field`. `MatchState.garrisons` is per sector. Everything else is
  recomputed from land every turn; **do not add a stored derived quantity**.
- **`Runtime.#recomputeRealms`** is the background tier's whole body: draft, then
  income, then report. Order is chosen and documented — a draft bills the
  treasury the player saw at decision time.
- **`Runtime.#allocate`** is the single writer for both fronts and orders. One
  budget, one Σ ≤ budget check. Do not add a second writer.
- **`ownerOfSector` takes `Pick<MatchState, 'actors' | 'realms'>`** so setup can
  call it. The codebase has consolidated this closure twice; do not grow a copy.
- **`MatchView.economy`** is the own-realm-only stocks object (`null` for the
  observer). `RealmView` now names two scopes explicitly — `population`/`economy`
  are **control** sums, `landValue`/`yield`/`forceLimit` are **holdings** sums.
  They diverge from the first capture onward, which is ticket 06's business.
- **`App.tsx TurnStrip`** is still the grey-box probe ticket 04 will delete. It
  now carries an economy line and a recruit row, both priced through `preview`.

---

## Governance that binds here

- **The four-kind design-problem workflow** (`README.md` § When implementation
  meets a design problem) decides who rules on what. #14 and #15 are **both
  kind 1 (seal conflict) → user**. Stop at the seam; do not derive a way through.
- **R6 per-ticket waiver**: a ticket goes `ready-for-agent` on two tests — every
  cited gate `resolved`, and zero unlanded values. **Recompute (ii) yourself at
  claim time**; the table row is a snapshot. Ticket 05's row was stale and its
  recomputation is what unblocked it.
- **A landed decision goes into the repo the same session.** R7–R11 all did.
- **Session-close duties** fire if the session lands values at birthplaces:
  sync seals, refresh touched `INDEX.md`, regenerate `docs/GLOSSARY-QUICKREF.md`,
  stamp superseded/amended ADRs *and seals*, record unpaid duties in
  `docs/SYNC-DEBT.md`, patch `docs/audits/term-inventory.json`.

---

## Lessons this session paid for

- **Recompute the waiver row before believing it.** Ticket 05 was recorded as
  blocked on "decay dials unlanded"; all five were sealed. The block was stale by
  a day and cost nothing to disprove.
- **A struck-through line still reads like a rule.** `MAGNITUDE.md` M13 carries
  "+10% of cap per turn" with strikethrough; reading it as live produced a
  proposed rate cap the user rejected, and the correct answer (MT-③'s "+1%p per
  point") was already sealed two lines away. **Read the strikethroughs.**
- **The sweep that produced `DECISIONS-OWED.md` is not exhaustive.** It missed
  that `MatchState` had no military state at all, missed #14, missed #15, and
  cited the wrong birthplace for the treasury. Treat it as a strong index, not a
  closed set.
- **The code review earned its cost twice.** It caught a seal violation (flat
  treasury against TC-⑭) and an accidental ruling (permanent limbo against
  M14 ⑮). Run `/code-review` with a fixed point on every ticket, and give the
  Spec axis the hard constraint "the agent must have originated zero values" —
  that framing is what produced the numeric audit.

## Gotchas that cost time

- **`Infinity` does not survive JSON.** Five open borders carry
  `choke.cap === Infinity`; a round-trip turns them into `null`. Walk structures,
  do not round-trip them. Same trap across `page.evaluate`.
- **A typo'd sector id makes a Σ test pass vacuously.** `sumOver` skips unknown
  ids, so `incomeOf(SECTORS, ['nope'])` is 0 and equals a mis-derived expectation.
  `realm-economy.test.js` asserts its fixture ids exist for exactly this reason.
- **Rebuild the viewer before Playwright.** `npm run build:game`; a stale
  `dist-viewer` fails new UI selectors with a null-element error.
- **Float boundary in `draftOrder`.** A treasury holding exactly the price of N
  men may buy N−1. Deterministic on both hosts, one man wide, documented in place.
- **Tooling:** `/usr/bin/grep` for existence checks, `/usr/bin/git` for history.
  `rg` gives false negatives on recursive search; bare `git log` can report
  another worktree's tip.
- **Search `docs/superpowers/`** before calling anything undecided — 15 specs and
  18 plans, absent from `AGENTS.md` § Read Order. **This bites hardest on #14**,
  which is slice-2 spec material.

---

## Read order for the next session

1. `.scratch/l3-first-match/map.md` — destination, notes, decisions so far
2. `.scratch/l3-playable-build/DECISIONS-OWED.md` § Part 2 rows **#14 and #15**
   (each carries its own explanatory block beneath the table)
3. `DOMAIN_MAP.md:246` § `Position as product`, then the slice-2 spec
   `docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md` §3
   (movement contract) — the two sides of #14, in their own words
4. `docs/features/combat-formula/MAGNITUDE.md` M14 + ruling ⑮ and
   `docs/adr/0029-uniform-integration-lag-on-acquired-land.md` — the two sides
   of #15
5. `.scratch/l3-playable-build/issues/06-resolve-the-decisive-battle-core.md`
6. `.scratch/l3-playable-build/issues/05-…md` § Comments — what the engine
   measures, and what 06 inherits

Then: open the gate, grill #14 and #15 with the user, re-cut ticket 06 against
the answers, and only then fill its `needs-info`.
