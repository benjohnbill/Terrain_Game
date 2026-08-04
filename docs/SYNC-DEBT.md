# Sync-Debt Ledger

Tracked ledger required by `DOCUMENTATION-LAW.md`
(conflict rule + session-close ritual duty 6). One line per unpaid
documentation debt; strike it (move to Paid) when paid. An unrecorded
debt is a law violation; an unpaid-but-recorded one is normal
operation.

Seeded 2026-07-05 from the Codex governance audit (verdict: ADOPT WITH
FIXES; session `019f3183…`, log in `.context/codex-session-id`).

## Open

- [ ] **Enemy-treasury uncertainty was routed through a surface that no longer
  exists — registered 2026-08-05, left open by ADR 0053 on purpose.** Gate 03
  C03.6 (user seal, 2026-07-17) puts enemy treasury **Absent from the
  projection** — no number, no band, no display convention — and lets its
  uncertainty survive **"only as 판세 band width"**. ADR 0053 ruled there is no
  in-play 판세 band, so the clause names a home that is gone. The Absent half is
  untouched and is not in question; what is homeless is the *residual presence*
  the clause deliberately preserved, so that a player feels there is something
  here they cannot see.

  Two readings, and **neither is written down**, which is why 0053 declined to
  pick one:

  (a) **The coverage band already carries it.** Treasury is one of the things the
  unobserved half contains, so "52% observed" is a true statement about the
  player's ignorance of the opponent's money as much as of their men. Costs
  nothing and adds no surface; the objection is that coverage is a *spatial*
  read and money is not on the map, so a player may read the band as saying
  nothing about the treasury at all.

  (b) **The summoned evidence surface carries it as an explicit unknown** — a
  row that names the treasury and shows no value. Honest and unmissable; the
  objection is that fog `RULINGS.md` ④ decision 6 (a) forbids a published
  "unaccounted N", and a row whose whole content is "unknown" is close enough to
  that line to need the user's eye rather than an agent's judgment.

  **It does not block build ticket 04.** Both readings agree that no treasury
  figure and no treasury-specific band is ever published, which is the only thing
  the shell needs in order to be built; the ticket carries that as an acceptance
  item. **Discuss when:** the coverage band is first rendered and can be looked
  at, or sooner if the user wants it settled on paper. **Delete this row when:**
  C03.6 names a live surface, or a ruling records that the residual presence is
  dropped and the treasury is simply absent with no trace.

- [ ] **The sealed band is invertible by a knowledgeable viewer, and the
  intersection floor does not stop it — registered 2026-08-04, build ticket 08,
  found by that ticket's own two-axis review.** This is a **decision-grade
  finding against `RULINGS.md` ④ decision 7 and FG-M①, not an implementation
  defect**; the code implements the seals exactly, and that is the problem.

  ④ decision 7 makes the displayed band asymptote at `w − a`, so no accumulation
  of normal reconnaissance reaches the ±5% floor — the sealed outcome that the two
  paid grades sell different **destinations** rather than different speeds. That
  holds for the band. It does not hold for what a viewer can *compute* from it.

  The arithmetic, in one line: a viewer who knows `a` — it is written in
  `MAGNITUDE.md`, so assume they do — knows each reported figure sits in
  `[x(1−a), x(1+a)]`, hence `x ∈ [max rᵢ/(1+a), min rᵢ/(1−a)]`. That interval
  shrinks **without bound** as looks accumulate. Measured: twelve normal-grade
  looks show a band at ±21.5%, correctly saturating, while the same evidence pins
  the truth to **±1.35%** and keeps closing. The floor is a property of the
  rendering, not of the information.

  **It is not fixed by hiding the history.** `composeBand` returns
  `[max rᵢ(1−w), min rᵢ(1+w)]`, so `max rᵢ` and `min rᵢ` are recoverable from the
  published band alone by dividing by `(1−w)` and `(1+w)`. The published
  `substanceHistory` and `garrisonHistory` make it easier to see, not possible.
  Removing them would cost ③ decision 4's trend read and buy nothing.

  This is **G2's own failure one level up** — "the range's own endpoints pin the
  truth" — reappearing after the fix that was supposed to remove it. G2 measured
  the intersection; nobody measured the estimator.

  **Not repaired here, deliberately.** Every repair is a new dial or a new rule:
  drawing the reported figure from an unbounded distribution instead of a uniform
  window, varying `a` per observation, or storing a perturbed interval. ④ decision
  7 rests on "no new dial", so choosing among these is the user's, not an agent's.
  Note what still holds meanwhile: the *absent* values (treasury, posture, commit)
  remain unrecoverable, so gate 03 invariant 8 as written is not breached — it is
  the **purpose** of the floor that this defeats.

  *Picked up by:* the next fog pass, ahead of the first playtest — the estimator
  is worth more than the band to any player who reads this ledger, so the ROI
  sweep already owed at FG-M① would measure the wrong thing until it is settled.
  *Deleted when:* a user ruling either accepts the estimator as intended play or
  re-cuts the sampling at `RULINGS.md` ④ decision 7.

- [ ] **A composition change closes a contact, and no seal says so — registered
  2026-08-04, build ticket 08.** Fog `RULINGS.md` ④ decision 2 rules that a
  division *weakens* a testimony — "it neither kills it nor leaves it intact" —
  and that "the count stays true of the aggregate that came out of the observed
  force". Implementing it needed a mechanism the ruling does not name, because
  the naive chain **breaks containment**: a force of 4,000 divides into 1,000 and
  3,000, the next look reports ~1,000, and the intersection of `[3600, 4400]` with
  `[900, 1100]` is empty. Ticket 08 therefore has the Runtime **close** the
  contact on a division, a consolidation, or a posture transfer out of the force
  (`game/src/domain/intel.ts` `closeContactsOn`, `ForceContact.closedOnTurn`): the
  statements stay in the ledger, dated and readable, and stop describing whatever
  now stands under that name. A fresh observation opens a new contact.

  **Why this is a decision and not an implementation detail.** ④ decision 3
  explicitly rejected "identity breaks on composition change" — but as the
  *definition of identity*, on the grounds that it "cannot read off existing
  state as it appears to", since `Detachment.id` survives both operations. The
  Runtime performing the split does not have that problem: it knows without
  reading an id. So the rejected reason does not reach this use, and the
  acceptance item it must not violate ("No code reads `Detachment.id` to decide
  whether a viewer's chain survives") is honoured — survival is decided by the
  composition event and by observation. That is a reading, and the user has not
  ruled on it.

  A second reading exists and was not taken: let the envelope's gain term cover
  reinforcement up to the realm's public force ceiling, so a chain survives
  everything. It was rejected because it relaxes every force band to complete
  ignorance one turn after it is bought, which contradicts ④ decision 5's "a
  force marker holds its figure while its position blurs".

  *Picked up by:* the first playtest (build ticket 13), where "I watched that
  army split and lost my count of it" is either right or obviously wrong.
  *Deleted when:* a user ruling either adopts the contact-closing mechanism at
  `RULINGS.md` ④ or names a different one.

- [ ] **The garrison's reinforcement channel is carried as an event, not a rate,
  and the consequence is asymmetric knowledge — registered 2026-08-04, build
  ticket 08.** ③ decision 5 derives the forward correction from three sealed
  inputs and no dial. Two of them compose cleanly at sector grain; the third —
  march speed against distance — does not, because **ready field men can step
  into the shield of the ground they stand on**, which moves whatever happens to
  be standing there rather than a bounded rate. Covering it by a bound means
  relaxing to the realm's whole force ceiling every turn, and since a realm's
  one-turn draft already exceeds any single shield's 900-man cap, that makes a
  garrison reading worthless **before the player can act on it** (a look resolves
  in its own turn's payoff, so it is one turn old when they next act).

  Ticket 08 therefore covers the channel **unconditionally**, and the shape that
  falls out is what the player will feel: **a shield reading's floor persists and
  its ceiling was public all along** — "at least this many" is the whole of what
  reconnaissance buys on immobile ground. That is 노화 헌법 P3's *decays* rather
  than *vanishes*, but it is not what "an unobserved sector's band re-widens per
  turn" reads like, which is the ticket's own acceptance wording.

  **The sharper alternative was built and then removed**, and the reason is worth
  keeping: marking the sector when a transfer actually happened kept the band
  sharp until one did — but a band that widens *because* men changed posture reads
  a posture change back to the opponent, and gate 03 § 4 puts enemy standing
  posture **Absent from the projection**. That is an information rule no seal
  grants, so the coarser honest version stands.

  The coarseness has a named cause: **the knowledge matrix carries no adjacency
  row** (gate 03 § 4), so a viewer cannot tell whether a force was standing there
  to step in. That absence is already registered as its own open question at
  `RULINGS.md` ④ § What this ruling does not settle.

  *Picked up by:* the first playtest (build ticket 13), together with the
  adjacency-row question it depends on. *Deleted when:* the adjacency question is
  ruled, or a user ruling accepts the event mechanism at `RULINGS.md` ③.

- [ ] **Three live documents state the turn's decision order, and gate 07
  reversed it — registered 2026-08-03.** The ladder in
  `docs/features/operation-plan-catalog/INDEX.md:35-42` and `DOMAIN_MAP.md`'s
  Tier-0 `Turn decision layers` both run *situation judgment → front-sector focus
  → core command (which plan) → fine adjustment (the commitment slider)*: land
  first, commit last. Gate 07 § Answer item 3
  (`.scratch/l3-playable-seam/issues/07-prototype-map-fog-presentation.md:148-154`,
  SEALED 2026-07-23 on the user's live reaction) runs **커밋량 → 행동 소환 → 세부
  작전 → 가능 지역 빛남 → 지목** — commit is the *entrance*, and the seal names
  land-first "a later variant". Both cannot be the order.

  **The newer seal governs**, so what is owed is a re-cut of the two older
  statements, not a re-decision. Note the ladder is not wholly wrong: its *stages*
  survive almost intact and only their **sequence** inverts, which is why this
  reads as correct on a skim and is easy to leave standing.

  **Third instance, and the public one:** the landing page's flagship interactive
  (`index.html` `#war-model`, *"One operation. Four connected judgments"* — Read →
  Position → Commit → Consequence) teaches the old order to visitors, directly
  above an iframe running the sealed one. Registered here rather than fixed
  because the landing revision is its own pass
  (`.context/handoff-landing-revision-grill-2026-08-03.md`, on
  `demo/school-submission`).

  *Picked up by:* the doc-sync batch that follows either build ticket 04 (the
  commit-first shell, which cannot be built against a contradicted order) or the
  landing revision grill — whichever comes first. *Deleted when:* both older
  statements name the sealed order, or a user ruling reopens it and picks one.

- [ ] **The reconnaissance ROI comparison was run at defender commit 0 only —
  registered 2026-08-03.** The 2026-08-03 fog grill compared reconnaissance
  precision tiers (25/10/5 against M8's 22/4) to decide where buying precision
  stops paying, and the run held **defender commit at 0**. The user named a
  fuller run — the same comparison with the defender also pouring — and it was
  never performed and never written down; `/final-check` caught the omission at
  that session's close and the note did not survive into the repository. Registered
  here because the crossover it feeds (ρ ≈ 1.49) is recorded at
  `docs/features/fog-of-war-discovery/MAGNITUDE.md` FG-M① as **emergent**, which
  means it is only as good as the sweep behind it, and a defender-commit axis is
  exactly the kind of term that moves an emergent crossover.
  **Discuss when:** ~~the testimony-attachment ruling lands and~~ ticket 08's
  numbers are exercised for real. *(First half fired 2026-08-03 — the ruling landed
  as `RULINGS.md` ④ / ADR 0050 without touching a price, so the sweep is still
  owed and now has one more term to carry: ④ decision 7's reporting spread changes
  what repeated reconnaissance actually converges to, which is an input to any ROI
  comparison.)* **Delete this row when:**
  the comparison is re-run with a non-zero defender commit and FG-M①'s crossover
  either survives or is re-cut against it.

- [ ] **Two governance principles are held at Working layer on purpose —
  registered 2026-08-03, user decision.** Wayfinder gate 12 produced two rules
  that outrank the gate that made them: **"citation is the invoice"** (R3 — a
  Production or Record document citing a tracker ruling *as authority* triggers
  promotion; an uncited ruling stays) and **"a discharged forward reference
  converts rather than promotes"** (R8 — once the referenced decision lands, the
  citation becomes evidence provenance plus a pointer at the live surface). Both
  currently live in `.scratch/l3-playable-seam/issues/12-…md` § Answer, which is
  the Working layer they exist to route work out of.
  **Held deliberately, not overlooked.** The user ruled 2026-08-03 to leave them
  and let R3 apply to itself: gate 12 is their only consumer, no Production or
  Record document cites them as authority, so no invoice exists. The alternative
  — a law clause with one consumer — is what this repo measured at **0 of 4**
  compliance (the `Summary` column, 2026-07-27).
  Standing counter-argument, recorded so the next reader need not re-derive it:
  R3 fired **four times in the session that made it** (`MAGNITUDE.md` twice, ADR
  0040 item 6, and 28 code citations), which is already past most definitions of
  recurrence.
  **Discuss when:** a second decision pass cites either principle as authority,
  or a third independent case of the same defect appears. **Delete this row
  when:** they are promoted to `DOCUMENTATION-LAW.md` or an ADR, or a later
  ruling records that they stay feature-local for good.

- [ ] **A "verification" is a verification only when every input it consumes is
  named — held at Working layer, registered 2026-08-03, user decision.** The
  general form of the defect that stopped build ticket 08. Fog `RULINGS.md` ③
  classified its envelope-composition check as "an implementation-time
  verification"; the check consumed a subject no seal had named, so it could not be
  performed at all, and it stopped a build rather than a review. The rule: when a
  row or a clause parks work as "confirm at implementation time", count the inputs
  it consumes and check each has a seal. One that does not makes the item an
  **unruled decision wearing a verification's label**, and the correct home is a
  ruling, not this ledger. It is cheap to apply — an item registered as a
  verification is registered in writing, so the count is available at registration
  time.
  **Held deliberately, not overlooked**, and by the same reasoning the user applied
  to gate 12's two principles above: one case is not a law. Promoting it now would
  add a clause to `DOCUMENTATION-LAW.md` with a single consumer, which is what this
  repo measured at **0 of 4** compliance.
  **Discuss when:** a second item registered as an implementation-time
  verification turns out to have consumed an unnamed input. **Delete this row
  when:** it is promoted to `DOCUMENTATION-LAW.md`, or a later ruling records that
  it stays an unwritten habit.

- [ ] **FG-M①'s ladder has one inversion, and its own paragraph denied it —
  registered 2026-08-03 (ruling ④ review).** The precision table makes **repelled
  assault ±20%, a free byproduct finer than the ±25% cheapest purchase**, while the
  paragraph beneath it read "Both free sources sit wider than the cheapest
  purchase". The false reason is corrected at FG-M① and the conclusion restated on
  its true grounds (the enhanced grade still beats ±20%, and a defender cannot
  *choose* to be assaulted). **What is not answered is whether ±20% was meant to
  land inside the paid range at all** — that is a value, the values are 가안 and L0,
  and they are the user's. Saturation does not repair it: every asymptote sits 5
  points inside its stated width, so the ordering is preserved rather than
  reordered. **Discuss when:** the first playtest re-seals FG-M①'s values (build
  ticket 13, TEST-LADDER L3) — the same sitting that retires its L0 paragraph.
  **Delete this row when:** the four widths are re-sealed with the ordering either
  intended or re-cut.

- [ ] **Garrison substance is sector-attached only while garrisons cannot move —
  registered 2026-08-03 (fog RULINGS ④ decision 1 rider).** Fog `RULINGS.md` ④ sets
  a testimony's subject by whether the subject can move, and puts garrison
  substance in the immobile row on the strength of the current build: garrison→field
  posture transfer is unwired and itself held in this ledger. The two rows are
  coupled and neither says so on its own, which is why this exists. If the transfer
  is built, garrison substance becomes mobile and its testimony must move to the
  force row — with everything that follows for it: unbroken contact, division,
  re-acquisition.
  **Discuss when:** the posture-transfer hold is lifted, in that same batch.
  **Delete this row when:** garrison substance is re-classified in `RULINGS.md` ④
  decision 1's table, or posture transfer is ruled out of L3 scope.

- [ ] **The knowledge matrix has no adjacency grade, and no seal says that is
  deliberate — registered 2026-08-03 (fog RULINGS ④).** Wayfinder gate 03 § 4 grants
  free intelligence from battle contact, repelled assault, and border alarm
  (existence + heading), and nothing for simply standing next to an enemy force.
  Ruling ④ decision 3 **leans on that absence**: it is what makes "unbroken contact"
  mean "paid again this turn", which is what prices target tracking. So the absence
  is now load-bearing, and it has never been examined — it may be right for a game
  where information is bought, or it may be the thing that reads as broken the first
  time an enemy army stands beside yours unseen.
  **Discuss when:** the first real playtest (build ticket 13, TEST-LADDER L3), where
  the question answers itself in one match. **Delete this row when:** an adjacency
  grade is added to gate 03 § 4, or a seal records that its absence is intended and
  ④ decision 3's pricing survives.
- [ ] **The landing's operation explainer teaches an arc the game no longer has, and
  its illustration cannot be relabelled into the sealed one — registered
  2026-08-03.** `#war-model` walks four panels across turns 11 → 16, and its SVG
  keys four map states to `read | position | commit | consequence` (terrain →
  forces → window → result). Gate 07 sealed the opposite grammar for a turn —
  커밋량 → 행동 소환 → 세부 작전 → 가능 지역 빛남 → 지목 — with commit as the
  *entrance*. The 2026-08-03 pass established these are **different altitudes**, not
  the same sequence in a different order: the section narrates one match, the demo
  above it plays one turn. Reframing the section to say so removed the
  contradiction, which is why this is deferred rather than urgent. What remains is
  the full re-cut: a commit-first turn primer needs its four map states redrawn as
  UI grammar, not terrain, so it is illustration work, not copy work.
  **Discuss when:** the next session that authors landing work — the user's stated
  plan is to open it after the main design and build tickets, when the landing is
  extended rather than patched. **Delete this row when:** the explainer is
  re-authored against the sealed turn grammar, or the section is retired in favour
  of the demo.

- [ ] **The landing revision is on a branch, and its approved design doc is stale
  in four places — registered 2026-08-03.** The duel-pivot re-cut of the landing
  landed on `demo/school-submission` (`c7be696`) and is deployed, because the
  submission deadline was that day and the branch is the deploy source. The user
  ruled the resting state is a **merge into `main`**; it was deferred, not
  declined. Two consequences are unpaid.

  (a) `main`'s `index.html` still sells the pre-pivot game, so a cold reader of the
  trunk gets the wrong product.

  (b) `docs/superpowers/specs/2026-07-16-strategy-ground-ax-landing-design.md`
  (Status: Approved) records three things that later rulings have moved past, with
  nothing at the doc saying so: the headline (L38), the primary/secondary CTA roles
  and `game.html` as the secondary's target (L40–41), and `game.html` as the
  retained development build (L103). These are **not defects in the doc** — it is an
  accurate 2026-07-16 record. What is missing is the stamp: the take-it-down ruling
  and ADR 0051 amended the `game.html` lines, and the 2026-08-03 duel re-cut amended
  the headline. Disposition is per-claim against the sealing ruling or the current
  code, not a rewrite from a reader's judgement.

  One item inside (b) has **no ruling behind it either way**: the primary and
  secondary CTA roles are now inverted from the approved design (primary opens the
  build, secondary scrolls to the model). That inversion arrived with the demo as a
  side effect, not as a decision. It is a question for the user, not a stamp.

  **Discuss when:** the submission is in and `main`'s working tree is clean (the
  documentation lane had 14 uncommitted files at the time of writing).
  **Delete this row when:** the branch is merged into `main`, the design doc carries
  its amendment stamps, and the CTA inversion is either ruled or reverted.


- [ ] **Treasury uncertainty has no propagation channel into the Standing band —
  registered 2026-08-03 (gate 12 batch, finding C3).** Gate 03 § 3 removes
  **Treasury (국고)** from the projection and expresses its uncertainty "solely by
  widening the banded **Standing (판세)** estimate", then hands the propagation off
  as "required by the existing 판세 seal regardless of this gate" — direction
  unspecified, and assigned to nobody. If that widening is computed from the true
  treasury, the width inverts to the figure, which is exactly what gate 03
  invariant 8 forbids; invariant 8 postdates the § 3 seal by seventeen days and
  the two have never been checked against each other. Home is match-arc (the
  Standing seal owns the band) plus `fog-of-war-discovery/MAGNITUDE.md` FG-M①
  (invertibility). Not ruled at gate 12: answering it would invent a mechanism,
  which R6 test (ii) forbids. **Discuss when:** ticket 08's projection sweep, or
  earlier if a Standing surface is designed first. **Delete this row when:** the
  propagation is built and passes invariant 8, or Treasury propagation is ruled
  out of L3 scope.

- [ ] **ADR 0049 does not cover everything Wayfinder gate 02 § 6 sealed —
  registered 2026-08-03.** Gate 12 R7 fixed the ADR's minimum scope and
  deliberately excluded API naming and implementation shape. Three clauses fall in
  that gap and still cite the gate: the concrete three-member surface
  (`game/README.md`, `tests/runtime.contract.test.js:20`), the
  internal-decomposition-is-an-internal-seam clause (`runtime.ts:18`), and the
  rejection-event shape (`runtime.ts:521`, `types.ts:251`). Each is marked in the
  code as a clause the ADR did not take. The honest reading is that they are
  implementation contracts whose home is the code and its tests, not the ADR —
  but that has not been ruled. **Discuss when:** the next time the Runtime surface
  changes shape, or a fourth such clause appears. **Delete this row when:** either
  the three are ruled implementation-owned, or ADR 0049 is widened to take them.

- [ ] **`blur` vocabulary survives in implementation prose — registered
  2026-08-03.** ADR 0048 retired the framing (the true value never enters the
  projection function, so nothing is blurred there). The gate 12 batch corrected
  it only where it sat inside a citation being repointed or in a front-door
  contract statement; **15 occurrences remain** in `game/src`, `game/tests` and
  test names — `preview.ts:235`, `fronts.ts:13`, `project.ts` (5),
  `types.ts` (3), `runtime.contract.test.js:48`, `boot.spec.js:101`,
  `realm-economy.test.js:373`. Left deliberately: renaming them is ticket 08's
  implementation work, not a citation repayment, and sweeping them here would
  have hidden the rename inside a governance batch. **Discuss when:** ticket 08 is
  implemented. **Delete this row when:** the term is gone from `game/` or a
  surviving use is justified in place.

- [ ] **Nothing checks disk→`docs/adr/README.md` — registered 2026-08-03.** ADR
  0048 was minted on 2026-08-03 and never added to the ADR index; the gate 12
  batch added it hours later. This is the same shape as `doc-registry.json`
  missing 8 governed files: the existing `dead-registry-path` check runs
  registry→disk only, so a file that exists but is unregistered is invisible to
  every check. Two indexes, one missing direction. **Discuss when:** the next
  `audit-lint.js` change, or the next time an index is found stale. **Delete this
  row when:** a disk→index check covers both the ADR README and
  `doc-registry.json`.

- [ ] **`AGENTS.md` still describes triage labels on a `Status:` line — TIER 3,
  registered 2026-08-03.** Its § Issue tracker reads "the five canonical roles,
  each label string equal to its name, recorded on a `Status:` line in the issue
  file." Ticket 14 R1/R3 moved state into front matter and R4 cut the vocabulary
  from five values to four; `docs/agents/triage-labels.md` was rewritten in the
  gate 12 batch to match, but `AGENTS.md` points at it with the old mechanism in
  the pointer. Not corrected here: `AGENTS.md` is Law layer and changes only by
  explicit user decision. **Discuss when:** the next law-layer edit the user
  approves. **Delete this row when:** the sentence names front matter, or the user
  rules the current wording acceptable.

- [ ] **Testimony history has no presentation — registered 2026-08-03.** Fog
  `RULINGS.md` ③ decision 4 rules that a sector's past observation testimonies
  are **shown** to the player, summoned on designation rather than always
  painted, because otherwise the trend read it enables ("it was this, now it is
  that") becomes a contest over who kept notes on paper. The **surface** is not
  designed: no encoding, no interaction, no place in the commit-first three-zone
  layout that gate 07 sealed. This is a DISPLAY-DEBT-class item living here
  because the ruling that created it is a fog seal.
  *Picked up by:* build ticket 04 (the commit-first UI shell) or the parked
  presentation pass, whichever reaches a fog surface first.
  *Deleted when:* the encoding is sealed at the fog birthplace or in
  `docs/DISPLAY-DEBT.md`, and ticket 08's acceptance item for a readable
  testimony history cites it.

- [ ] **The ageing envelope is derived on paper and uncomposed in practice —
  registered 2026-08-03.** Fog `RULINGS.md` ③ decision 5 forward-corrects a
  testimony using bounds that already exist in sealed form — the affordability
  bound's `rate` term (AB-①), the casualty curve (M4), and march reach (ADR
  0043) — so the ruling claims **zero new dials**. That claim is reasoned, not
  demonstrated: nobody has composed the three into a single conservative
  per-turn envelope and checked that it never widens by less than the truth
  could have moved. **If it under-widens, the dealer lies** — a band would stop
  containing the truth, which is the one property the whole model rests on.
  *Picked up by:* build ticket 08, at implementation, before any band is
  displayed.
  *Deleted when:* the composition is implemented with a test that fails on an
  under-widening envelope — or, if it cannot be composed, when the fallback dial
  is ruled by the user and sealed at FG-M① (a new decision, not an
  implementation choice).

- [ ] **`Information confidence`'s code contract points at six archive files
  whose model is retired — registered 2026-08-03.** Its `codeRefs` in
  `docs/audits/term-inventory.json` list `js/intel.js`, `js/game.js`,
  `js/map.js`, `js/situation.js`, `js/actions.js`, `js/command-preview.js`. The
  index is factually correct — the identifier does appear there — but every one
  of those files implements the model ADR 0048 replaced, so a reader following
  the contract lands on superseded behaviour. This is a **narrower, sharper
  instance** of the standing "term code contracts anchor to what is now a
  reference archive" row below: that row is about the archive being an archive;
  this one is about the archive being *wrong*, not merely old.
  *Picked up by:* build ticket 08, when the L3 implementation creates a real
  `codeRefs` target under `game/src/`.
  *Deleted when:* the row's `codeRefs` point at the L3 implementation, or the
  broader archive-anchoring row is paid and subsumes this one.

- [x] **Superseded staged starvation survives in two more surfaces — PAID
  2026-07-28** (registered and paid the same day, found while reading supply
  authority for build ticket 06b). Both surfaces now state the sealed continuous
  pump, carry the supersession explicitly, and point at WB-M① for values. Neither
  rewrite settles the subject question — each says in-line that the sector-versus-
  force reading belongs to R16 — so paying this debt did not pre-empt the design
  pass. Original registration below. slice-2 § 2 superseded D4's staged severity
  (holding → attack-incapable → defenseless) in favour of the continuous
  supply-ledger pump, and that supersession **was** stamped where it was looked
  for: ADR 0026's header carries `Amended by slice-2 design spec §2
  (2026-07-14)`, and the 2026-07-15 row below corrected DOMAIN_MAP
  `Standing rules`, with the birthplace divergence closed 2026-07-28. Two
  neighbours were missed because the paid row named only the similarly-titled
  entry:
  (a) **`DOMAIN_MAP.md` `Standing world rule`** still reads "a supply-cut
  **sector** degrades in **staged severity** each turn until the route state is
  repaired" — a live ✅ AGREED entry roughly 300 lines from the entry that
  declares that model superseded, so the file contradicts itself;
  (b) **`operation-plan-catalog/CATALOG.md` § Supply Interdiction**
  (Time-economics) still calls the staged curve "a magnitude-pass dial" — and
  this one is the **birthplace** of the AGREED Tier-1 term `Supply Interdiction`,
  so a superseded rule sits on an authoritative definition surface, which is the
  heavier of the two.
  Both are stamp work, not rulings: the continuous pump is sealed and
  implemented. Note the shape — this is the same class the 2026-07-15 row's own
  lesson warns about (verify every surface, not the one that shares a name), and
  the subject also drifts between the two models (sector-level route state versus
  a force's ledger), so the rewrite should say which subject it means. Related
  design work is registered separately as **R16** in `docs/DESIGN-RISKS.md`; this
  row is only the supersession debt.

- [ ] **QUICKREF gloss coverage — ~61 prose-born terms have no extractable
  gloss** (registered 2026-07-28, after the QUICKREF purpose ruling). The
  equal-weight rule (law ritual duty 4) makes a missing gloss a blank slot rather
  than a demotion, so this is no longer blocking anything — it is a quality
  question about how full the encyclopedia is. Measured with `audit-lint`'s
  `birthplaceRowText`: **126/267** terms yield a mechanical gloss today.
  Two separable pieces: (a) the **80 DOMAIN_MAP-native** entries are cheap —
  their bullet form already has a reader (`splitDomainMapRows`), taking coverage
  to ~206/267 — worth doing whenever the QUICKREF is next re-rendered at a lock
  point; (b) the residual **~61** are born in prose model docs (CATALOG 14,
  force-geography RULINGS 9, STRATEGY-SPACE 6, MAGNITUDE 5, MATCHUP 3, ADR 0019
  3, match-arc frame-decision bullets 19) with no row to extract, so they would
  need hand-written glosses — which is **backfill, and the 2026-07-27
  going-forward-only ruling refused backfill.** Do not quietly reverse that
  ruling to fill the file; if the coverage matters more than the ruling, that is
  a user call. Cheapest honest path is (a) only, and (b) fills in naturally as
  those terms are re-sealed.

- [x] **PAID 2026-08-03 — the landing embeds the L3 build, and ADR 0051 amends
  the "only" sentence.** The deferred half of the take-it-down ruling is executed
  rather than narrowed: `game.html` and `assets/game/`'s five modules left the
  hosting bundle, and all five landing references now point at `/play`, which
  serves the L3 duel build. So the public artifact demonstrates the game this
  project *does* build. The governance half is settled by **ADR 0051**, which
  amends ADR 0041 § Decision 1 — the landing may carry a playable demo, bounded to
  copying the emitted bundle as an opaque artifact, with the game build still
  taking nothing from the landing. That ADR supersedes this row's instruction not
  to fix the sentence: the sentence is what changed.
  **Still owed, and small:** `AGENTS.md` § Environments and `DESIGN.md` restate
  "the landing page only" in prose. Re-cut both to ADR 0051 in the next doc-sync
  batch; they are stale in exactly the direction that ADR names. *Delete this
  paragraph when they are re-cut.*

  Original row, kept because its analysis is what ADR 0051 answers:

- ~~**The landing page still embeds the retired design, and `AGENTS.md` says it
  serves "the landing page only"**~~ (registered 2026-08-02 while closing Wayfinder
  gate 11). `index.html:186` embeds `game.html` in an iframe labelled
  "strategy-ground · development build". `game.html` is the reference prototype:
  **multi-faction world conquest**, the design **ADR 0042 retired** in favour of
  the 1v1 duel. So the public artifact demonstrates a game this project no longer
  builds, and ADR 0041's "Firebase Hosting serves the landing page **only**" is
  inaccurate as written.
  The user ruled **take it down** (2026-08-02). Half was executed: `js/`'s 25
  loaderless prototype modules left the hosting bundle with **no rendered
  change** (`scripts/build-hosting.js`, gate 11 § Resolution). **The iframe
  itself is deferred** because removing it edits a rendered product surface whose
  surrounding copy may assume the demo exists — it needs someone who can see the
  page, and probably a decision about what replaces the slot (nothing / a static
  image / a capture of the L3 build). **Until it is done, do not "fix" the
  `AGENTS.md` sentence to match reality** — the sentence is the intended end
  state; the deployment is what is wrong.

- [ ] **This ledger has no way to know it has gone stale, and the check built to
  tell it has never once been right** (registered 2026-08-02, doc-audit Layer 1).
  `ledgerCurrency` / `ledger-possibly-paid` exists to answer "has this debt been
  paid?" by matching an Open row's distinctive title tokens against commit
  subjects dated after its registration. Its record, summed across the two audits
  that triaged it: **run #3 (2026-07-26) 8 of 8 spurious · this run
  (2026-08-02) 14 of 14 spurious — 0 true positives in 22.** *(The 14 had already
  become 15 within hours of this row being written — a live micro-instance of the
  problem, inside the row describing it. The tally is a moving figure; the
  0-true-positives record is the durable part. Noted 2026-08-02 by the
  cross-review below.)* The failure mode is
  identical six days apart: run #3 blamed "an incidental shared word (`re-cut`,
  `record`, `evidence`, `naming`)"; this run's misfires were `reason`, `re-cut`,
  `record`. Two implementation repairs are already recorded in the function's own
  comments (line-wrapped row parsing, shared-token matching), so this is not an
  untuned check — **the signal is wrong.** It watches *activity* (did a commit say
  a word) where the question is *state* (has this been decided at its birthplace).
  The check that would have caught this run's real finding already exists in
  another shape: `unstamped-adr-amendment` and `glossary-status-drift` compare
  declared status against actual status, and they are blocking because they are
  accurate.

  **Two things a ruling has to cover, and one it cannot.** (a) The
  activity-versus-state signal above. (b) **There is nowhere to record that a row
  was verified still-live**, so every audit re-verifies from scratch: run #3
  checked `Fog INDEX Status line still says "position fog"` against the file and
  found it live; this run independently did the same check, on the same row, and
  got the same answer. What a ruling **cannot** fix is the class this session's
  own evidence exposes — five stale statements were found on 2026-08-02 and
  **zero of them by any mechanism**, including one row (`DESIGN-RISKS` R20 as
  first written) that named a hazard the code never had, i.e. was false on the
  day it was registered. No discharge condition protects against a row that was
  wrong when written; only reading the thing it points at does.

  **The shape a ruling might take, recorded unranked.** The project already ruled
  this exact problem once, for the QUICKREF (user, 2026-07-28): stop demanding
  per-batch freshness, re-render at deliberate **lock points**, and let the lint
  report *drift size* as advisory rather than gate. `vocab:lock`'s marker /
  report / `--advance` is the same shape. Neither is applied to this ledger.
  Candidates: a lock marker plus drift report here · a machine-checkable
  discharge pointer per row (`DESIGN-RISKS`'s `Next to close` column is the
  in-house precedent, and this ledger has no equivalent) · recording a
  verified-live date on the row itself · leaving the check as-is and treating
  the tally as noise. **User-scope, all of it**: run #3 recorded that "moving or
  adding checks is a decided question, not an audit action", a required ledger
  field is a Law-layer change, and the lock-point model is a policy ruling of the
  same class as the QUICKREF one.

  **Cross-reviewed 2026-08-02 — the candidate list is now ranked by evidence.**
  Three independent reviewers refuted the richest candidate (structured
  status/discharge/premise fields per row, extended to all documents):
  `docs/audits/2026-08-02-doc-index-proposal-cross-review.md`. Headline: the
  shape is **already implemented twice in this repo** — `DESIGN-RISKS`'s
  `Status | Home / thread | Next to close` triple and `doc-registry.json` — and
  **both are stale today**; and `.scratch/doc-structure/research/design-history-survey.md`
  § E already refuses three of its components by name (#4 central seal registry
  DECIDED NO by the user 2026-07-05, #11 per-entry metadata, #13 blocking hooks).
  The surviving candidate is none of the four listed above: a **blocker-edge
  check on tracker tickets**, comparing the `Status:` and `Blocked by:` lines
  that already exist, advisory only, no new file. It fires today on Wayfinder
  gate 11. Still user-scope; the review is a report, not a ruling.

- [ ] **The Wayfinder's seals have no ADR, by a deliberate deferral**
  (registered 2026-08-02, user ruling). Gates 05–10 are all sealed and all live
  only in `.scratch/l3-playable-seam/issues/`, which is **Working layer** — so
  the acceptance standard for the entire L3 build is not in the seal chain. The
  user ruled to **defer, not decline**: write one ADR covering the Wayfinder
  when **gate 11** closes, rather than one per gate. The precedent that makes
  deferral safe is that gates 05–08 sealed the same way without complaint; the
  reason it is a debt anyway is gate 10's ruling that **fun is not judged by a
  build acceptance gate** — that binds `match-arc`'s TEST-LADDER, every
  DESIGN-RISKS row waiting on a playtest, and all thirteen tickets, which is
  cross-feature by any reading. **Trigger: gate 11's closure.** Until then the
  gate files are the citable source.

- [ ] **`L3` is one identifier with two live meanings, and only one is
  registered** (registered 2026-08-02, found by Wayfinder gate 10's grill —
  it is what kept that gate open). `docs/audits/term-inventory.json` carries
  `L3` as an **alias of the Tier-1 term `Test-trust ladder` (검증 신뢰 사다리)**,
  birthplace `docs/features/match-arc/TEST-LADDER.md`, where the rung means
  *human playtest — fun, tension, skill expression*. The project simultaneously
  uses `L3` for the **build generation** now under construction — `AGENTS.md`
  § Current Direction, ADR 0041, both `.scratch/l3-*` trackers, and the whole
  `game/` tree — and that sense is registered nowhere. This is a
  single-definition violation in the plainest form, and it has a mechanical
  consequence: the `alias-inject.js` UserPromptSubmit hook resolves `L3` to the
  ladder, so sessions about the *build* have been fed the *ladder's* meaning.
  Gate 10 spent its open life on the ambiguity and could not close until the two
  senses were separated by hand. The collision reaches Tier 0: `DOMAIN_MAP.md`
  carries the ladder sense at its `Test-trust ladder` entry ("L0 hand reasoning →
  L3 human playtest") and the build sense thirty-odd lines later ("the L3 build
  does not inherit its world"), so both live in the canon file itself.
  **Naming is the user's — this is a proposal, not an agent edit.** Options:
  rename the ladder rung (keeping `L3` as a 구칭 alias at the birthplace row per
  the vocabulary law), rename the build generation, or register the build sense
  as a second canonical term and accept a documented homonym. Gate 10's
  § Resolution states the distinction in prose meanwhile, so the ambiguity is
  described but not removed.

- [ ] **`DOMAIN_MAP.md`'s place-naming rule has no birthplace** (registered
  2026-07-28, enforcement-ladder stage 4). The `## World Direction` section was
  reduced to pointers, and every bullet resolved somewhere — except one: place
  naming (large geography may be historically legible, specific provinces use
  fictional East Asian-style names, player-facing names are never meta design
  labels). It is a live rule governing what the player reads, and it is written
  nowhere else: `SPEC.md` § World Model does not carry it, and terrain-cradle
  `RULINGS.md` has no naming ruling. Its natural home is SPEC § World Model,
  which is **Tier 3 — a proposal, not an agent edit.** It stays in DOMAIN_MAP
  marked as unhoused until that decision. Do not "fix" this by inventing a
  terrain-cradle ruling: the rule is product-facing, and it was never sealed at a
  feature.

- [ ] **The naval-system question has no owner** (registered 2026-07-28,
  enforcement-ladder stage 4). `DOMAIN_MAP.md`'s `## Open Questions` held four;
  three were archive-era and closed with the 30-province draft world they asked
  about (ADR 0041). The fourth — whether a true naval system (naval capacity /
  force role, blockade, sea movement) ever arrives — is genuinely open and
  belongs in a roadmap, not a glossary. Phase 1's answer IS settled (penalty
  crossing + port mitigation, no naval system: ADR 0015, `Strait`); what is open
  is the later-phase question, so its home is `SPEC.md` § Phase Roadmap — **Tier
  3.** Parked in DOMAIN_MAP, marked, until then.

- [ ] **`war-model-build/MAGNITUDE.md` has five unregistered named constructs**
  (registered 2026-07-26, audit run #3). The new model doc is a definition
  surface with zero inventory rows. Most of its content supplies values for
  already-registered GLOSSARY terms, which is correct — but `Operational
  distance`, `March speed (S)`, `Effectiveness floor`, `Capability inversion`,
  and `Movement graph` have no row anywhere. Not registered by the audit
  (S13: never auto-register without user sign-off). Two user calls owed:
  (a) a 한국어 표시어 for each — coining is a user act, and the
  intuitive-over-compact ruling makes it a real choice; (b) **`Movement graph`'s
  birthplace** — its authority is ADR 0043 item 7, and the law says ADRs never
  define, so registering it ADR-born would repeat the known-weak ADR-0019
  pattern. Clean fix is a `war-model-build/GLOSSARY.md` row the ADR then cites,
  which is a seal rather than an index patch.

- [x] **The status dictionary contradicts itself — PAID 2026-07-27.** The
  Vocabulary Law line now carries the fourth value (`SEALED`, strong form of
  `AGREED`) and the rule that status is the NAME axis only; `HARVEST.md` step 4
  gains the same, worded as a harvest instruction (*do not transcribe a
  birthplace's local status word*). Ten birthplace rows across capital /
  match-arc / terrain-cradle / combat-formula were normalized (status word
  only — every date, ruling ref, and `가안` parenthetical kept), combat-formula's
  local status dictionary retired, the five off-enum inventory rows patched, and
  `audit-lint.js` check 10 (`fieldDomains`) now enforces all three field domains
  as a **blocking** check. It ships with an EMPTY grandfather list because the
  normalization ran first. Residuals below. Original row and its correction
  rider follow, kept because they record why this was application, not decision.

- [ ] **`CONFIRMED` is still unreconciled with the term-status dictionary.**
  Carried from ticket 03's own unresolved list and unchanged by the 2026-07-27
  application. The Conflict rule's seal triad names `SEALED/AGREED/CONFIRMED` as
  *seal* status words; the Vocabulary Law dictionary types a *term's* status.
  The 2026-07-15 review's reading is that these are different fields, which
  would make the pairing a non-issue — but no ruling says so, so "the law
  resolves its own conflict" stays half-true. Decide the reading, then either
  reconcile or record that no reconciliation is owed.

- [ ] **Typed aliases (ticket 03 Q2) are still unimplemented, and one row was
  routed around them.** `aliases` remains a flat string array, so the ruled
  destination for `SUPERSEDED` — "routes through Q2's typed aliases" — did not
  exist on 2026-07-27. `Blinds` was normalized to `rejected-recorded` instead:
  its birthplace records a mechanism evaluated and retired with the record kept,
  which is what `⛔`/`rejected-recorded` means, and DOMAIN_MAP's marker moved
  `✅ → ⛔` to match. Revisit when the typed-alias migration lands; if `Blinds`
  belongs in the retired-name form instead, this is the row that says so.
  The other three pieces of the ruled `HARVEST.md` §4 amendment — typed-alias
  shape, derive-don't-store promotion, index-vs-audit ownership — are still
  owed with ticket 10's batch, as ticket 03's handoff sequenced them.

  *(The original row, kept verbatim below for its record — not a live debt.)*
  **The status dictionary contradicts itself — RULED 2026-07-15, unapplied**
  (registered 2026-07-26, audit run #3; **corrected the same day** — see the
  rider). Vocabulary Law names `AGREED/PROPOSED/rejected-recorded`, the Conflict
  rule separately names `SEALED/AGREED/CONFIRMED`, and the documents have grown
  past both (`AGREED-concept`, `AGREED-structure`, `가안`, `SUPERSEDED` all appear
  at birthplaces). The inventory indexes them faithfully; the divergence is in
  the law, not the baseline.
  **Rider — correcting this row's first wording (2026-07-26).** It was first
  registered as an open law-wording question needing a user decision. **That was
  wrong: the question was already ruled**, at
  `.scratch/doc-structure/issues/03-inventory-schema-v2.md` § Q1 (resolved
  2026-07-15, and the 2026-07-15 adversarial review recomputed every one of that
  ticket's measurements as exact). The ruling: **EXTEND** the dictionary —
  register `SEALED` as a fourth value, defined as the strong form of `AGREED`
  (`SEALED` implies `AGREED`), because the law contradicts *itself* here and
  normalizing would suppress a real distinction that re-drifted within 5 days
  when only prose forbade it. Remaining strays (`AGREED-concept` ×2,
  `AGREED-structure`, `가안`) normalize; `SUPERSEDED` routes through Q2's typed
  aliases. What is actually outstanding is therefore **application, not
  decision**: the Vocabulary Law line gains a fourth value (Tier-3, user seal)
  and `HARVEST.md` §4 gains the SEALED-implies-AGREED rule, batched together per
  ticket 03's handoff. Recorded as a correction rather than a silent edit because
  presenting a ruled question as open is the precise failure `AGENTS.md` § Read
  Order warns about ("a decision recorded here and never cited is how the project
  has actually gone wrong before").
  *(`PRODUCT.md`'s layer was the other half of this row; user delegated the
  classification 2026-07-26 and it is settled — Direction, scoped to the
  landing environment. No new doc type or status was created.)*

- [x] **Enforcement ladder: move governance checks from audit-time to commit-time**
  — **PAID 2026-07-27** for stage 1. `hooks/pre-commit` + `hooks/pre-push` +
  `.github/workflows/governance.yml`, all invoking `npm run lint:docs` and
  nothing else; `core.hooksPath` set. Findings now carry their prescription,
  both legitimate exits, and the `--no-verify` refusal, formatted in
  `audit-lint.js` so the four consumers share one wording. Verified live: a
  mismatched commit is rejected in the main checkout and in a fresh worktree;
  a clean commit passes silently.
  **One hole left open deliberately:** `core.hooksPath` is relative, so a
  worktree on a branch predating `hooks/` is ungated (measured against
  `war-model-slice2-ticket07`). Future Codex worktrees branch from main and are
  covered; CI is the backstop for the rest, which is why it is a required rung.
  **Stages 2–4 remain open but are no longer blocked.** Their one conflict was
  ruled 2026-07-27 (user): the enum check is **blocking**, and ticket 03 now
  carries the supersession stamp its handoff had been missing since 2026-07-17.
  A second ruling the same day: the `summary` column is **going-forward only** —
  no backfill of the ~260 registered terms, because a bulk summary written by
  someone other than the definition's author is the unowned text this program
  exists to remove. It leaves the QUICKREF generator's no-summary fallback as an
  open decision.
  Readiness is tracked **per piece, not per stage**, in
  `.scratch/doc-structure/issues/13-enforcement-ladder.md`: two pieces are
  `ready-for-agent`, four need the user (three Tier-3, one judgment-heavy), two
  need a decision first. A stage is not a unit of readiness — this row's earlier
  wording said "stages 2–4 ready-for-agent", which read *unblocked* as *fully
  specified* and is corrected here.
  Original registration below.

  (registered 2026-07-26, design conversation after audit run #3 — recorded here
  so the decisions reach the spec rather than dying in session context). The
  problem: `write-lint.js` is bound to a **Claude Code tool call**, so every
  other editing path — the user's editor, a Codex worktree, any script — bypasses
  it, and there is currently no git hook and no CI. Measured this session:
  `npm run lint:docs` takes **0.51s**; worktrees share the main repo's hooks
  (`/tmp/terrain-game-ticket-06a` resolves `--git-common-dir` to the main `.git`),
  so **one installed hook covers every Codex worktree**. Proven by isolated
  experiment: a normal commit and a **worktree** commit are both blocked, while
  **`--no-verify` bypasses** and — the finding that matters here — **`pre-commit`
  does NOT fire on merge commits at all**, which is exactly how Codex branches
  reach `main` (`5ce1cbc Merge branch 'codex/ticket-06c-battle-calculator'`).
  Proposed ladder: `pre-commit` (fast authorship feedback) → **`pre-push` (the
  real gate — covers merge commits)** → CI (backstop for `--no-verify` and for
  clones with no hooks installed). Resulting invariant, stated precisely:
  **"a GLOSSARY/inventory mismatch cannot enter the REMOTE history"** — local
  history may briefly hold one.
  **Sealed constraints (user, 2026-07-26)** — these are requirements on the spec,
  not suggestions:
  1. **The rejection message must carry the prescription, not just the
     diagnosis.** Naming the defect is not enough; a blocked agent needs the fix
     and its bounds — which file, which duty, and that only index fields may be
     touched (single-definition rule). A diagnosis-only message makes agents
     guess, and a guessing agent writes a junk row to get unblocked.
  2. **The message must forbid `--no-verify` explicitly** and say CI will catch
     the bypass. Reaching for the bypass is the natural response to being
     blocked mid-task; the prohibition has to be where the block is read.

- [x] **Candidate lint check: field-vocabulary validation on the baselines** —
  **PAID 2026-07-27/28** (registered 2026-07-26, audit run #3). Run #3 corrected
  13 inventory field values outside the baseline's own vocabulary (`kind` =
  mechanic / state / strategy ×8, `verdict` = standard-term ×5), all invisible to
  `lint:docs`; the failure mode is silent because `kind` routes the Ring B
  reference dictionary, so an unroutable value skips judging without saying so.
  Delivered as `audit-lint.js` **check 10 `fieldDomains`** (blocking, user-ruled
  2026-07-27, grandfather list empty because the batch normalized every
  off-domain row at its birthplace first), and extended 2026-07-28 by **check 11
  `glossaryStatus`**, which closes the adjacent hole the proposal did not see:
  field *values* were validated against a dictionary, but nothing compared a
  GLOSSARY's declared status to the inventory row indexing it.
  **One correction to this row's own proposal, worth keeping.** It specified
  `verdict ∈ {justified-coinage, standard-match, synonym-exists, null}` — and the
  check implemented that faithfully, which is how it shipped **missing
  `undetermined`**, a real S7 value that audit run #1 had already reached on three
  rows. A blocking check would therefore have rejected a verdict the audit is
  entitled to record, invisibly, until the next audit tried to use it. Restored
  2026-07-28 from a finding handed over in writing by an adjacent session
  (`.scratch/doc-structure/issues/13-enforcement-ladder.md`). The lesson: a
  proposal's enum is not automatically the spec's enum — check the vocabulary's
  own source (S7) before making a check blocking on it.

- [x] **Gate C's movement model has no Production birthplace** — **PAID
  2026-07-26**, the same day it was registered, by the Part 3 approval landing.
  `docs/features/war-model-build/MAGNITUDE.md` is new and is the owning model doc:
  **WB-M①** holds the fatigue/movement/supply dials, **WB-M②** holds march speed with
  its gate C measurement. The feature had no model doc at all, which is the actual
  reason the dials had no home. Shape authority stays with the slice-2 spec §2–§3 and
  with ADR 0043 where gate C amended it — and the spec's §3 must **not** be read as
  current, since it is now amended in three places (commit-free movement, per-hex
  fatigue, reachability legality).

- [ ] **Bot policy values are approved but have no birthplace** (registered
  2026-07-26). The user's Part 3 bulk approval covered them — the judged-value
  formula `mid − λ(high−low)/2`, the disposition presets, siege and field commit, and
  the per-plan physical eligibility gates — but they belong to **ticket 12**'s
  contract and block nothing now, so they were not landed with the rest of the batch.
  Note that `mockup/combat-calc/plan-ai.js` mixes them with fog-band constants
  (`DECAY_FLOOR 0.45`, `MAX_CONFIDENCE 0.9`, `WIDTH_PCT 0.35`, `WIDTH_ABS 1.0`) which
  are **excluded** from the approval by Part 3's own precondition — they conflict with
  `combat-formula/MAGNITUDE.md` M8 (Part 2 #5, unresolved). **Do not land the file's
  constants as one group.** Owed: a birthplace for the bot values at ticket 12, and
  Part 2 #5 before any fog constant is sealed.

- [ ] **Terrain re-authoring produces world revision `r2`, and only then a
  movement cost table** (registered 2026-07-26, gate C R15 item 6). The authored
  per-hex terrain is a region-painted placeholder: whole regions carry one layer,
  which is why 116 of 292 hexes are `plains` and five or six regions are
  uniformly so. The user confirmed the steppe/desert/oasis tendency is roughly
  trustworthy and will be kept, while the all-`plains` regions **must** be fixed.
  Movement cost is therefore uniform 1.0 today, and the cost table waits on that
  pass. TC-⑪ froze orientation and resolution, **not** terrain values, so
  re-painting is a revision bump rather than a seal violation. Out of this map's
  scope; recorded so the dependency is not lost.

- [ ] **The snowball counterweights are researched-only, by user ruling**
  (registered 2026-07-26, gate C R16). Growth from conquered land is *not* to be
  limited; counterweights live outside the transfer rule. Three directions:
  (a) the defender's structural advantage — already mechanical, M5 gives defence
  up to ×2.0 terrain × ×2.4 fortification = ×4.8 against M2's symmetric
  ×1.00–×2.00 lever; (b) holding out and counterattacking into an Opening;
  (c) breadth costing cognitive load and coarsening the commit-allocation unit so
  the risk unit grows with the realm — **(c) has no device anywhere and is the
  genuinely new work.** **Survey PAID 2026-07-26** —
  `docs/features/match-arc/research/snowball-counterweights.md` (user-confirmed
  structure; RESEARCH layer, adopts nothing). It found that (a) and (b) are largely
  already mechanical, that `conquest damage` is the half-named device for them (own
  row below), and that **(c) has no transplantable precedent** because the genre
  taxes breadth and this project excludes taxes. **Still owed:** the design session
  itself. Explicitly **not** a design pass here.

- [ ] **There is no L2 rung under the L3 build's values** (registered 2026-07-26,
  gate C). The test-trust ladder is L0 hand reasoning · L1 decision grid ·
  **L2 tournament / battery** · L3 playtest. The L3 build has L1 and L3 and
  **nothing between them**: the archive's L2 harness exists but ADR 0041 makes it
  evidence rather than a build source, so it cannot be pointed at these values.

  **Which values this covers:** everything landed on 2026-07-26 —
  `war-model-build/MAGNITUDE.md` WB-M①'s fourteen fatigue/movement/supply dials
  (L1) and the CATALOG delaying bands (L1). WB-M②'s march speed is the exception at
  **L2**, having been measured against the board during gate C.

  **Why it is a debt and not a footnote.** A played match falsifies **gross**
  failures — a device never chosen, a stock always full or always empty — and that
  much these tickets can instrument. It cannot say "180 should have been 150." So an
  L1 value moves only when play breaks visibly, and sits unexamined otherwise. The
  user named this directly at gate C: *"단순히 play로 넘기기만 하면 문제가 될 것
  같은 느낌."* The agent answered honestly — the *structure* of a value choice is not
  provable by play at all (there is no counterfactual to observe), only its symptoms
  are — and promised to register the gap. This row is that promise, paid late.

  **The pairing that makes it bite.** Unifying two behaviours onto one dial removes a
  tuning knob, and with no L2 rung there is also no instrument that would tell you the
  knob was needed. Where that happened this session the substitute knobs are elsewhere
  and **coupled** (a garrison's local cap changes both how expensive it is to fill and
  how strong it is when full).

  **Owed:** a decision on whether the L3 build gets a batch harness of its own, and —
  until it does — the discipline that an L1-stamped value is *provisional by
  construction*, not merely unverified. Ladder: `docs/features/match-arc/TEST-LADDER.md`.

- [x] **Recruitment siting is a deferred pass, and it reopens the turn budget** —
  **PAID 2026-07-26** by the R19 authority batch: match-arc MT-⑥ and ADR 0045
  seal sector grain, simultaneous settlement, province-origin accounting,
  one-turn readiness, and the retained 20-point / +1%p command economy. The
  topology complement is war-model-build WM-④. The original Working inputs remain
  recorded at `.scratch/l3-playable-build/DECISIONS-OWED.md` R19.

- [x] **Three stamps owed from gate C's R18 — PAID 2026-07-26.**
  (a) `DOMAIN_MAP` no longer presents local-garrison regeneration as a standing
  world rule and points replenishment to ADR 0045's paid recruitment / physical
  transfer contract. (b) ADR 0014 already carries the ADR 0045 amendment stamp.
  (c) combat-formula M13a now states that its coordinates govern setup only and
  that later posture rebalancing pays the existing movement price rather than a
  separate commitment or dial. The distinct 1v1 shield-density remeasurement row
  below remains open; this stamp does not pay that playtest question.

- [ ] **`conquest damage` is named in the seal chain and defined nowhere**
  (registered 2026-07-26, found by the gate C snowball survey). ADR 0029 and the
  match-arc `정산` GLOSSARY row both say settlement arrives undamaged "vs conquest
  damage + M6 inheritance cost", and **no rule or value anywhere defines either
  term.** Its only contrast was settlement, retired by ADR 0042, so the phrase now
  floats with nothing on the other side. It is simultaneously a live candidate
  device for the deferred snowball session ("freshly taken ground is weakly held" is
  what counterweight directions (a) and (b) want). **Ticket 06d therefore builds it
  as a named seam at identity 1.0**, so a later decision is a value change rather
  than a redesign. **Owed:** either a definition or an explicit retirement of the
  phrase, and the resolution of one tension — 노화 헌법 P2 permits permanent damage
  only through identity acts (초토화, out of scope by R9), so conquest damage could
  only act on recovery speed, which the ripening lag already does.

- [ ] **Morale (사기) is parked, and the reason should not be lost**
  (registered 2026-07-26, gate C R13). The user's read: commit already absorbs
  part of morale's role, so a separate device may not be needed at all — and if it
  is, complexity argues for it rather than against. **Owed:** its own grill, not a
  value. Do not implement a morale term in the 06 family.

- [ ] **The per-sector merge rule has no birthplace outside code** (registered
  2026-07-28 by ticket 06c). Ticket 03 deferred its enumerated **case 4** — one
  realm pressing two borders that share a sector — to combat, and 06c answered it:
  **the two fronts stay fronts and merge into one engagement**, because resolution
  is atomic per sector. The reasoning currently lives in `domain/turn.ts`'s header
  and `domain/engagement.ts`'s, plus that ticket's § Comments — which is the same
  shape ticket 03 left the resolve-order enumeration in, and the README already
  owes "a formal feature-doc birthplace for the **turn structure**". **Owed:** fold
  this ruling into that birthplace when it is created, as a RULINGS row rather than
  a code comment. Not urgent, and not a conflict — it is an unrecorded decision.
  **Amended 2026-07-31 (ADR 0046):** the ruling itself is unchanged and now has a
  recorded home in ADR 0046 item 1, so what is still owed is the *turn-structure
  birthplace*, not the ruling.

- [ ] **TC-⑬'s frontage half is unimplemented — re-pointed at the
  operational-manoeuvre pass** (registered 2026-07-28 by ticket 06c; re-scoped
  2026-07-31 by the geography-battle grill). TC-⑬ pairs the pass ×2.0 ground with a
  door that "throttles the assaulting body", citing the M5 validation "×2.0 is
  validated only as the residual AFTER a frontage cap; without it, ×2.0 is far too
  low." Four findings from the grill re-scope this row:
  - **The values are not missing.** M11 authors them (pass 1,000 · river 1,000 ·
    forest trail 1,500 · strait 500 · legendary 300–500) as **가안 sealed
    2026-07-03**, keyed on archetype — which the artifact already carries as
    `choke.class`.
  - **`choke.cap` is not that cap.** `schema.ts` calls it a "Projectable-mass
    ceiling", and `Projectable mass` is **⛔ stale** under ADR 0042 — it fed the
    retired hegemony arithmetic. Its numbers mostly coincide with M11 because the
    author read M11, but `hills 1300` and `strait 800` appear in no M11 row. Reading
    it as the frontage cap would be origination dressed as assembly. `Edge.frontageHexes`
    is likewise authored on all 17 edges and read by nothing.
  - **Implementing it today would be inert.** Measured: with cap 1,000 against a 900
    garrison at `pass` 2.0, R pins at **0.556** for any force from 1,500 to 5,000 —
    terrain chokes carry no erosion link (M11's `+500 per −0.3` is on the
    *wall-assault* table only), so the door becomes frontally unforceable. Its escape
    valve is D9's `Removability`, which this map honours geometrically on **24/24**
    doors but at **0 extra turns on 20/20 land doors** (straits alone cost 2–3).
    D9 names three removal-path kinds — bypass, timing/condition windows, tech — and
    this map has only the first, free. The defect is the removal economy, not the cap.
  - **Its stated justification weakened.** TC-⑮ (ADR 0046) retires the `pass`
    **terrain** value that "×2.0 as the residual" refers to.
  **Owed:** the whole question moves to `.scratch/operational-manoeuvre/`, whose
  subject includes R14 interception and the map-resolution row — the two upstreams a
  cap needs. **Not abolished:** D9 argues the cap deliberately ("a cap, never a
  multiplier … it *classifies* sectors rather than scaling them", with Thermopylae and
  Myeongnyang as anchors).
  **The gate got weaker, and the user's stated direction was the opposite** (found
  2026-07-31 by final-check, after 안2 was adopted — nobody had checked what 안2 did to
  gate strength). TC-⑬ validated `pass ×2.0` and the cap as a **pair**; 안2 retires the
  first and the second was never built, so the gate now has **neither**. Troops needed
  to break a 900 garrison, commit 0/0:

  | design state | troops needed |
  |---|---|
  | TC-⑬ `pass 2.0` + cap 1,000 (the intended pair) | **impossible** — R pins at 0.556 |
  | TC-⑬ `pass 2.0`, no cap (state through 2026-07-30) | **1,850** |
  | 안2 `Mountains 1.5` — the 관중 side | **1,400** |
  | 안2 `Plains 1.0` — the far side | **950** |

  One turn before adopting 안2 the user had asked the opposite — *"관문 방어가 너무
  쉬워지는 것 아닌가 … 거의 무조건 이기는 상한이 조금 높아야 하지 않을까"*. 안2 is
  right structurally (a plains sector has no geographic claim to a defile bonus) and
  went the wrong way in magnitude. **Accepted deliberately, 2026-07-31:** raising it
  without a cap would mean raising terrain, i.e. reverting 안2; and one played match will
  say whether 950 *feels* too cheap, which numbers cannot. Recorded so the pass inherits
  the direction rather than rediscovering it.

  **The commit axis, measured the same day**, because it is the other half of the
  baseline and it is what the user actually asked to be preserved. Attacker at the cap
  (1,000) against `pass 2.0`, defender commit 0 — chips the attacker must pour, out of
  the 20-chip stack:

  | garrison | 300 | 500 | 600 | 700 | 900 | 1,200 |
  |---|---|---|---|---|---|---|
  | chips needed to win | 0 | 1 | 4 | 7 | **16** | never |

  And with both sides pouring, **the diagonal is flat at R 0.83** — equal commit
  cancels, so commit is a pure contest and a defender's 4 chips force the attacker to 8
  to stand still. The user's requirement ("최소한 커밋양이라도 많이 갉아먹어야") is
  therefore already structural rather than owed.

- [x] **A routed force is reported but never displaced — RULED 2026-07-31**
  (registered 2026-07-28 by ticket 06c). `battle.ts` computes `routed` and `escaped`
  and nothing consumed `escaped`, so a routed force stood on the same hex. ADR 0046
  turned this from a gap into a defect: with engagements sited on hostile presence, a
  force that stays is re-engaged every turn, so "stay" becomes annihilation and M4's
  open-escape clause becomes a lie. **Ruled at war-model-build `RULINGS.md` WM-⑤**:
  anyone with an approach arc falls back along it one sector; anyone without one
  (structurally, every garrison) leaves service and stays on the register.
  **Implemented and landed 2026-07-31 by ticket 06e** (`Runtime.#displaceRouted`;
  the arc is `advanceOneTurn`'s, the price is R12's `MARCH_FATIGUE_PER_HEX`, and
  leaving service goes through `subtractOrigins` so the register is untouched).
  The residue is registered separately below (the military/civilian fraction).

- [x] **Only 27 of 56 sectors can ever be a battle site, so most capitals cannot
  be attacked at all** (registered 2026-07-28 by ticket 06c, which is the first
  ticket that could measure it). A front is an **authored region border**
  (`contestedFronts` walks `world.edges`, 17 of them), and 06c can only site an
  engagement on a front sector — because TC-⑬ keys the defensive ground to the
  *door*, and no seal maps a sector's hex `terrainLayer` onto M5's five rungs, so
  interior ground has no defensive multiplier to fight over. Measured on
  `terrain-cradle@r1`: the 17 edges have **27 distinct endpoint sectors**, leaving
  **29 sectors unreachable by any battle**; over 40 drawn partitions, **44 of 80
  capitals were not endpoint sectors**. Capturing a border sector does not help —
  the edge list is frozen content, so the front set can shift among those 17 edges
  but never grow inward.
  **Why it matters now:** ticket 07 is "a capital falls and the match ends", and
  R1 makes that an ordinary sector capture. On today's model a majority of matches
  have no legal way to attack the capital, and ADR 0043 item 7's graph lets an army
  walk into that interior unopposed — so the loop cannot close.
  **Not 06c's to answer** — it is kind 1/3 under the README's four-kind workflow:
  filling it means either a broader battle-site rule (adjacency-derived fronts) or
  a terrain source for interior sectors, and the latter is exactly the unsealed
  `terrainLayer` → M5 mapping. **Owed: a user ruling before ticket 07 is claimed**,
  with 06d's ownership transfer as the other input. Evidence in
  `.scratch/l3-playable-build/issues/06c-…md` § Comments.
  **DESIGN DISCHARGED 2026-07-31 (ADR 0046 + TC-⑮), and the implementation LANDED
  the same day by ticket 06e** — `engagementsOf` takes the world's sector list and
  applies the sector predicate, and `combatTerrainOf` supplies interior ground from
  TC-⑮'s binding. The user ruling was taken in the geography-battle grill, along the
  *second* path above — a terrain source for interior sectors — which raises
  battle-capable sectors from 27 to **all 56**. Two corrections to the text above,
  both load-bearing:
  - **The direction was reversed.** Re-measured over all 15 legal partitions
    (30 realm-seats): **30 of 30** seats could enter enemy ground without standing on
    a single fightable sector, mean **21.2** enemy sectors reachable with zero
    battles, and **41 of 45** authored-marker capitals reachable with zero battles.
    Capitals could not be *defended*, not "not attacked". `movementOrderRefusal` has
    no ownership check and there is no zone of control.
  - **The first path would not have worked.** Adjacency-derived fronts raise
    battle-capable sectors only from 27 to **33** of 56 (37 cross-region hex-adjacent
    sector pairs exist, 15 of them authored as edges), leaving 23 interior sectors
    still unfightable. Recorded so it is not proposed again.

- [ ] **What a front's commitment *is*, once no quantity is stored against it**
  (registered 2026-07-31 by ticket 06e's code review, spec axis). ADR 0046 item 4
  moved the stack's key from the front to the sector and left the front its
  territory reading, but no ruling says what `front-resolved` should then report as
  that border's commitment. 06e implemented the **sum over the front's two endpoint
  sectors**, which means a sector serving two borders is reported under both. That
  is a reading the ticket chose, not one it cited — kind 1 under the README's
  four-kind workflow, surfaced rather than settled.
  **Inert today:** `front-resolved` is a display event, nothing downstream computes
  from it, and the two obvious alternatives (report the endpoint sectors separately,
  or drop the field and let a front report contact only) are equally unsealed.
  **Owed:** a ruling when ticket 04's commit-first shell or ticket 09's EVAL BAR
  first needs a border-level number — those are the surfaces that would give the
  question a consumer. Code comment carries the same warning
  (`game/src/domain/turn.ts`, `FrontReading`).

- [ ] **Interception of a force in transit has no design anywhere**
  (registered 2026-07-26, gate C). Raised by the user while ruling R14 ("그 길목을
  친다는 전략적인 결정도 수비측에"), and it is a real defensive option that
  positioned armies make thinkable for the first time. Undesigned = kind 3 = out
  of this slice under the four-kind workflow. **Owed:** a scope ruling before any
  ticket touches it.

- [ ] **M13a's start-state coordinates were cut for a 5-seat board; a 1v1 cut
  of the same terrain thins the shield threefold** (registered 2026-07-26 by
  ticket 05, restated the same day after the cause was isolated).
  `garrisonPerBorderSector 900` and ρ = 0.75 reproduce M13a exactly at **15
  border sectors per seat**; enumerated over all 15 legal partitions of
  `terrain-cradle@r1`, a 1v1 realm gets **3–8 (mean 6)**, so ρ at war footing
  lands near 0.25. The cause is the realm count, not the map: five contiguous
  regions behind one frontier are mostly interior where two regions among five
  seats were mostly frontier.
  **Not a defect until measured.** The structural term is map-independent (the
  sustain fraction ⅓ puts a full field at 33.3% intensity anywhere), the surge
  curve's designed trigger is register erosion from deaths, and ticket 05 has no
  deaths in it — 429 cumulative casualties clear the 42% knee at B = 5, and the
  curve is live in peace at B ≥ 6. Restoring ρ = 0.75 by tripling garrisons would
  also risk re-importing the thick-shield freeze the duel pivot escaped
  (L2: decided 21%→7%).
  **Owed: a re-measurement, then a user decision if one is still needed** —
  after ticket 06 lands deaths and ticket 07 runs a whole match. Pairs with the
  treasury-sink row below; the user parked both as play questions 2026-07-26.
  Rider at `MAGNITUDE.md` M13a; measurement table at
  `.scratch/l3-playable-build/issues/05-…md` § Comments.

  **Re-measured 2026-07-28 by ticket 06c, which landed the deaths. The curve is
  live, and no user decision is owed — but not for the reason this row predicted.**
  Three seeds, both realms invading, 20 turns; full table in
  `.scratch/l3-playable-build/issues/06c-…md` § Comments.
  - Register erosion is real and far past the 429 the row names: **928–1,021 per
    realm within four turns**, and the *first* battle alone clears it (a wiped
    900-man shield plus the attacker's own dead).
  - **Erosion alone does not reach the knee.** This row's arithmetic held serving
    at its ceiling while the register fell; measured, the same deaths take serving
    down too, and a realm refilling only its **field** plateaus at **0.389–0.419**
    — under 0.42 in every seed, by a hair in one.
  - **Refilling the shield is what makes the curve live.** Garrison recruitment is
    an ordinary order in this slice (R18's transfer path), and it restores serving
    while the register keeps falling: intensity crosses the knee at **turn 7–8**
    and settles at **0.45–0.49, priced ×1.20–×1.41 of base** — the war ramp,
    engaged. So the second band is **behaviour-gated, not dial-gated**, and what
    switches it on is a player choosing to keep re-manning a contested shield —
    exactly the attrition the curve exists to price. Nothing needs tripling.
  - Honest caveat: 06d does not exist, so the invader never *takes* the sector and
    the shield is re-wiped every turn. The **turn 7–8 first crossing** is the
    robust figure; the 20-turn erosion totals (8,400–9,600) are an artifact of the
    missing capture and must not be read as an attrition rate. Re-read after 06d.
  - **06d landed 2026-07-31, so the caveat's premise is discharged and the
    re-measurement is now owed rather than blocked.** An invader takes the sector,
    and the shield does not survive to be re-wiped: a captured sector's shield is
    emptied on capture (WM-⑤ (v) for whatever is still standing, ADR 0045 item 7 for
    cohorts still forming). The 20-turn erosion totals should therefore be re-read
    against a run where ground actually changes hands — which is ticket **13**'s
    first full-depth match, since gate **10** owns the thresholds.

- [ ] **What happens to the wear ledger across a posture change — HELD, needs a
  user ruling** (registered 2026-07-31 by ticket 06d, found by its own code review).
  R18 (ii) grants transfers in **both** directions between field and garrison and
  prices them by movement alone: "turns and fatigue, never commit … Zero new pricing
  devices," with a free instant transfer rejected because "an action with no cost is
  not a decision." Filling a shield **from** the field is landed. Taking shield men
  **back out** is not, and the reason is a genuine hole rather than scope: no seal
  says what a man's wear is after he has been standing in a shield.
  - The naive reading is a **wear-laundering machine**. A garrison keeps no wear
    ledger (06c: an unattended shield fights at the unattended baseline), so men
    entering have nowhere to carry wear and men leaving would be minted at zero. Both
    transfers sit in one decision window and headroom reopens after each move out, so
    an exhausted army standing on any of its own muster hexes could round-trip its
    whole wear away, free and repeatedly — defeating 06b's convex wear curve, which
    is a core balance device.
  - **Each candidate fix needs a statement that does not exist:** give the garrison a
    wear ledger (the state 06c refused); charge the transfer a wear price (a new dial
    R18's "zero new pricing devices" forbids); or forbid the round trip inside one
    window (a new rule). So it is a seam, not a gap.
  - Meanwhile the intent is **unwired rather than half-implemented** — it falls
    through to the ordinary unwired-intent rejection, and a test pins that so the
    hole cannot close by accident. Ticket 06d § Comments carries the same note.

- [ ] **The realm economy has no sink after the field fills** (registered
  2026-07-26, measured by ticket 05). With recruitment the only spend in the
  slice, treasury grows without bound once the force limit is reached (345 yield
  by turn 12 against an income of 32). Expected — attrition, fortification and
  the rest of the spends arrive with ticket 06 and after — but it means the
  **income half of the D5.1 decay engine is not yet load-bearing**, and the
  ceiling half carries the whole anti-fizzle claim. **User ruling 2026-07-26:
  parked as a play question, not a calculation** — how much scarcity money should
  impose depends on how much a player actually spends executing strategies and
  how much they recruit, which only real play shows. Re-measure once 06 lands;
  nothing to decide before then.
  - **Trigger fixed 2026-07-31 by ticket 06d.** "Once 06 lands" is now specific:
    conquest is the first mechanism that moves **both** sides of this question — it
    raises the force limit the treasury has to chase, and it gives money a reason to
    exist beyond recruitment. 06d carried this as an acceptance item and left it
    deliberately unticked, because the sink only opens over a played match and every
    threshold that would judge it belongs to gate **10**. So the re-measurement fires
    with ticket **13**'s first full-depth run, not before.

- [ ] **R6 per-ticket authority waiver — gate-12 publication deferred behind the
  build** (registered 2026-07-25, user ruling). The L3 build's readiness rule
  required gate 12 to republish every accepted decision into Production docs
  before any ticket ran. Gate 12 (a) is blocked behind
  `.scratch/doc-structure/issues/10-audit-run-3.md`, which declares itself
  unsound, so the ritual had become the sole obstacle between the program and its
  redrawn destination (one played match). The user waived conditions 2/3/6 **per
  ticket**, on a two-part test: every cited gate `resolved`, and zero unlanded
  values. Ruling text + rationale: `.scratch/l3-playable-build/DECISIONS-OWED.md`
  § R6; the amended rule and the per-ticket table: that tracker's `README.md`
  § Amendment R6. **Owed:** gate 12 (a)'s publication batch still runs — the
  resolved gates' § Answer contracts land in Production docs and any required
  ADRs — but now alongside or after the build rather than in front of it. This
  row is the record that the debt is deliberate.

- [x] **Capital candidate set widened to any owned sector — PAID 2026-07-31**
  (registered 2026-07-25, user ruling R3). The user replaced "the player picks one
  of the **seat's main city sectors**" with free choice across every sector the
  realm owns, prompted at match start, and `CRADLE_META`'s `capitals` / `cities`
  tables became **advisory** (recommendation material, deferred) rather than the
  eligibility constraint. Paid by an `Amended by ruling R3` stamp on CP-①'s header
  (`docs/features/capital/RULINGS.md`).
  **Correction carried by the payment: it is CP-① item *1*, not item 3.** This row
  and `DECISIONS-OWED.md` § 1.8 both said item 3 — which is the *forced-vassalage*
  item, retired separately by ADR 0042 — so the designation staleness was filed
  under the wrong number and ticket 07's blocker list recorded only one stale item
  where there were two. 07 reads item 1 as the authority for its first acceptance
  item, so the misfiling was load-bearing rather than cosmetic. Found 2026-07-31 by
  the capital-guard investigation. Ruling text:
  `.scratch/l3-playable-build/DECISIONS-OWED.md` § R3.

- [ ] **L3 Wayfinder gate 08 — first-slice DEFINITION sealed; build + promotions
  owed** (registered 2026-07-25, user grill). Gate 08
  (`.scratch/l3-playable-seam/issues/08-define-first-playable-vertical-slice.md`,
  § Answer) defines the first playable slice as a **real, complete 1v1 duel match at
  full compound depth** (not a minimal tracer): terrain-cradle terrain reused under
  a **random balanced(population)-contiguous 2-realm partition per match** (ADR 0019
  pattern) + player-chosen capitals (CP-② D1.3); the full operation-plan selection +
  the plan-vs-plan roshambo/matchup layer; run to capital fall at natural length; a
  rational human-instrument bot (single balanced disposition). Owed: (a) the decision
  is Working-layer — the **cradle-reuse + random-partition** architecture promotes to
  a terrain-cradle doc note / ADR **when the build specs are authored** (relates to
  the 1v1-map-reauthoring row below — the 2-seat binding IS the first 1v1 world
  artifact, so that pass and this share a home); (b) **PAID 2026-07-25** — the
  `.scratch/l3-playable-build/` tickets were re-cut against this full-depth
  definition (nine pre-pivot tickets → thirteen, walking-skeleton order, loop
  closing at ticket 07; mapping in that tracker's README § Re-cut history). The
  re-cut is ticket SHAPES only. **Amended 2026-07-25 by R6** (row above): this
  clause originally read "no ticket can reach `ready-for-agent` until Wayfinder
  09/10/11 close and gate 12 publishes". Under the per-ticket waiver, a ticket
  whose cited gates are all `resolved` and whose values are all landed may run —
  tickets 01 and 02 now do; (c) implementation debts already
  tracked ride their own rows (gate-06 loader, code-contract tree, turn-structure /
  eval-bar birthplace, operation-plan magnitude graduation). No mandatory-ADR trigger
  at gate close (definition/scoping, Working-layer); promotion assessment belongs to
  build-spec authoring.

- [ ] **1v1 duel-pivot cascade — turn-structure + eval-bar formal birthplace
  deferred** (registered 2026-07-24, ADR 0042 cascade). The cascade landed the
  win-condition (ADR 0042 + capital CP-②) but Gate 6's **turn structure**
  (simultaneous blind commit → reveal, 행동력 single non-hoardable chip stack,
  3-tier phase skeleton, player-paced match length) and the **EVAL BAR signature
  UI** (single in-play TACTICAL confidence-band bar; strategic verdict → post-game
  COACH) have NO formal feature-doc home yet — their truth lives in the
  duel-pivot ledger (`.scratch/l3-playable-seam/duel-pivot-draft-ledger.md`,
  Gate 6). ADR 0042 names the ledger as the interim authoritative record. Pay by
  minting the read-layer / 형세판단 feature-doc seals (eval bar's stated
  birthplace) + a turn-structure home, and registering their vocabulary
  (행동력, EVAL BAR, capital fall already done). No mandatory-ADR trigger beyond
  0042 (turn structure = making ADR 0025's uncertainty duel literal, already
  confirmed). Sequencing: after the map pass / at the next L3 build gate.
  **Grew 2026-07-25 (ruling R7).** The same home now also owes the
  **commit-and-reveal visibility rule**: the *fact* of a realm's commitment is
  public, its *content* is not, and **both realms having committed is what
  advances the turn**. User-sealed with three reasons — deliberation time is a
  psychological read, it is the genre grammar, and the turn-advance rule needs
  the state observable anyway. Implemented for the capital beat in L3 ticket 02
  (`game/src/projection/project.ts`); inherited by every later commit. No clock
  is involved, so ADR 0040 is untouched. Full text:
  `.scratch/l3-playable-build/DECISIONS-OWED.md` § R7.
  **Grew again 2026-07-25 (L3 ticket 03).** The same home owes two more
  match-frame rules, both now running in code: ruling **R8**'s turn legality
  ("has this realm committed this turn / is the commit window open", with gate
  02's `currentActor` read as the current phase), and the in-build **resolve-order
  ruling TL-①** that D6.1a routed into the build — one engagement per front, fronts
  resolved in canonical key order, nothing consulting actor identity or submission
  order, with the four enumerated overlap cases and which of them the board makes
  impossible. Zero new values in either. Full text:
  `.scratch/l3-playable-build/issues/03-close-the-commit-reveal-turn-loop.md`
  § Ruling.

- [ ] **Linear-commit grammar for non-combat orders — no birthplace yet**
  (registered 2026-07-25, user ruling). Every non-combat order carries a
  **per-commit unit effect**, and what the player pours converts linearly into how
  much of that effect they get; fixed per-action prices are retired, and partial
  progress is kept (falling short of a fortification tier is not wasted). This is
  D6.3's free pour extended to non-combat orders, so one grammar now covers every
  order kind. Recon's 2 and 6 survive **re-cut as per-sector unit prices** for the
  normal and enhanced grades — which dissolves the graduated-versus-flat
  contradiction inside the candidate record, since cost now scales with how many
  sectors rather than which rung. It is a **match-frame** rule, not a fog rule, so
  its home is wherever the turn structure lands — the same home the row below
  already owes. Unit numbers for fortification, recruitment, and supply are unset
  by design (tuned in play); the recon unit prices are 가안 and still absent from
  the repository. Full text: `.scratch/l3-playable-build/DECISIONS-OWED.md` R2.

- [ ] **Decisiveness ladder not re-cut for a single-terminus duel** (registered
  2026-07-25, tactical-plan-ai ruling ⑦). Ruling ①'s five-rung ordinal objective
  ranks **vassalization** above **annihilation** above advance — the top two are
  multipolar-era objectives that ADR 0042 retired with the settlement terminus.
  Ruling ⑦ widened the disposition but explicitly did not settle the ladder. A
  duel bot's ordinal objective under "capital fall is the sole terminus" has never
  been authored. Blocks build ticket 12's plan-choice rule.

- [ ] **Production doc cites AGENT MEMORY as its record** (registered 2026-07-25,
  demand-driven value sweep). `docs/features/fog-of-war-discovery/RULINGS.md` and
  its `INDEX.md` route the recon economy's full record to the agent's project
  memory file `terrain-game-recon-fog-economy.md`, which holds the 가안 costs
  (일반 정찰 2 / 즉시 정찰 6 행동력) and the pricing principle. That file is not
  in git, is not version-controlled, is invisible to Codex, and cannot be read by
  the user — so a Production seal's stated evidence is unreachable to every reader
  but one agent on one machine. Pay by landing the values and the principle at the
  fog birthplace. Two contradictions inside the memory record need a user ruling
  first (graduated versus flat recon pricing; instant recon as an attack rider
  versus a standalone action) — tracked in
  `.scratch/l3-playable-build/DECISIONS-OWED.md` § 1.2. Standing rule adopted the
  same day: a value decided in conversation lands in the repository in that
  session.

- [ ] **Runtime interface predates the duel pivot — `currentActor` cannot express
  simultaneous commit** (registered 2026-07-25, demand-driven value sweep).
  Wayfinder gate 02 (2026-07-16) seals the surface `currentActor -> ActorId` plus
  "the Runtime rejects an intent submitted out of turn"; D6.1 (2026-07-23) seals
  both realms committing in secret and revealing together. A single current actor
  cannot express simultaneous submission, and no document defines what "out of
  turn" means once both realms commit at once — while build ticket 12 requires bot
  intents to be rejected "exactly as a human's would be". Never previously
  registered. **SEALED 2026-07-25 by ruling R8** (user), as proposed:
  `currentActor` keeps its name and is read as the current *phase* under D6.2's
  three tiers, and legality becomes per-realm-per-turn — "has this realm already
  committed this turn / is the commit window open" — with no alternating
  out-of-turn test. Gate 02's actual guarantee (the Runtime, not the caller,
  decides legality) survives verbatim; only its expression changed. **What stays
  owed is publication, not the decision**: this is a match-frame rule and belongs
  in the same turn-structure birthplace the R7 visibility rule and the
  linear-commit grammar are waiting on (rows above). Implemented in L3 ticket 03.
  Full ruling: `.scratch/l3-playable-build/DECISIONS-OWED.md` § R8 (§ 1.3 kept as
  its derivation).

- [ ] **Seal-versus-seal conflicts surfaced by the value sweep — twelve rows**
  (registered 2026-07-25; **eleven live as of 2026-08-02** — see the partial-payment
  note at the end of this row). A demand-driven sweep over the thirteen build tickets
  found conflicts that no reader had hit because nobody had assembled the design
  end to end: band centre wobble versus seed-stable position; Encirclement
  threshold 2.2 versus 1.92 (the latter is the rout-onset figure); the eval bar's
  live commit marker versus both prototypes' "no commit info, ever"; two recon
  economies (M8 +0.30/saturating versus the 0.45→0.70→0.90 ladder); two estimate
  band-width formulas; own-realm Exact versus `OWNED_CONFIDENCE 0.85`; plan effect
  axes as per-axis magnitude (ADR 0024) versus core/secondary/none (CATALOG);
  matchup filled-cell count 6 versus 12; the matrix's "Strategic Abandonment"
  column versus the catalog's "abandonment is not a plan"; capital guard 350×pop
  versus `capitalGarrison 1500`; the fatigue floor stated both 가안 and sealed in
  one file; and the bot decisiveness ladder's top rung (vassalization) retired by
  ADR 0042. Full table with citations:
  `.scratch/l3-playable-build/DECISIONS-OWED.md` § Part 2. Two are stamp-only
  rather than rulings: `capLandFrac`'s default flip is recorded as "NOT done" in
  AB-②'s rider though code and tests already treat it as the factory default, and
  the viewer knowledge matrix has carried eight rows since its 2026-07-23
  amendment while every citation still says "seven-grade".

  **Partial payment, noted 2026-08-02 (doc-audit Layer 1).** One of the twelve is
  closed at its birthplace and the enumeration above still lists it as live:
  **capital guard 350×pop versus `capitalGarrison 1500`** (Part 2 #10) was ruled
  **2026-07-31 by capital CP-⑤**, which also recorded that there were never two
  seals — `MAGNITUDE.md`'s `capitalGarrison 1500` is a parenthetical harness
  inventory carrying no status word, and CP-① item 2 had retired the flat 1500 by
  name on 2026-07-10. **Eleven remain live** (Part 2 #1–#9, #11, #12), plus #13
  판세 which this row never covered. Recorded rather than struck because the other
  eleven still stand; do not re-grill #10.

- [ ] **Dials named-but-unvalued in design docs, valued only in code**
  (registered 2026-07-25, demand-driven value sweep). The slice-2 operational
  design seals each fatigue/movement/supply dial by *number* — "dial (3)",
  "dial (6)" — and leaves the value blank, while `js/fatigue.js` and
  `js/movement.js` carry concrete numbers (march accrual 1.0, forced-march premium
  3.0, battle-fatigue coefficient 40, convexity 2.0, terminal ledger 10, supply
  pump 1.0, starvation entry 2, starvation loss 0.02/2.0, recovery 2.0/1.0, march
  speed 3). Same pattern in the bot layer (judged-value formula, disposition
  presets ±0.5, siege/field commits 8/14) and the delaying-defence dials
  (2.0 / 0.15). These already determine behavior and have never been user-seen.
  March speed 3 additionally sets the reach cone's radius, so it is a fog dial
  too. Pay by landing each at its owning model doc. Inventory:
  `.scratch/l3-playable-build/DECISIONS-OWED.md` § Part 3.

- [ ] **Build-ticket map source was wrong — corrected 2026-07-25.** Ticket 02 and
  the gate-08 § Answer both named `mockup/combat-calc/map-data.js` `CANONICAL_MAP`
  as the reuse basis. That is C-loop **iteration 1**; the seal chain points at
  `map-gen.js` `CRADLE_MAP` (**iteration 2**) in three places —
  `terrain-cradle/RULINGS.md`, `terrain-cradle/INDEX.md`, and `capital/INDEX.md`
  (the authored city/capital tables) — and gate 06's own evidence (5 `Infinity`
  choke caps, the `rN`/`rN_sN` identifier scheme) describes iteration 2.
  `CANONICAL_MAP` carries no city markers at all, which would make CP-②'s "the
  player picks one of the seat's main city sectors" unimplementable. Ticket 02 is
  corrected; **the gate-08 answer's citation still needs the same correction**
  (the decision it sealed is unaffected — reuse cradle terrain, random balanced
  partition, player-chosen capital). Consequence: the "balance tolerance trades
  against variety" finding is **withdrawn** — on the authoritative map every
  region's population is exactly 6.0 ("parity v5: equal pop totals"), so any
  contiguous five-region split is balanced to 0% and thirty exist. Also owed: B1/B2
  viability thresholds (`~1.7×`) were authored for 5-seat bindings and have never
  been re-cut for two realms.

- [ ] **Designed mechanisms whose only written home is the Working layer**
  (registered 2026-07-25, L3 build-ticket re-cut). The documentation law puts
  `docs/superpowers/` in the Working layer — "consult for context; CURRENT truth
  lives in the seal chain" — and `AGENTS.md` § Read Order does not list it. But
  `docs/superpowers/specs/` holds 15 design specs (~200 KB) carrying mechanism
  detail that has **no Production home**, so a law-compliant agent that reads only
  the seal chain cannot find it. Instance that exposed this: the reconnaissance
  mechanism (band narrows one rung along the 0.45 → 0.70 → 0.90 ladder; 즉시 정찰
  as a distinct commit-consuming action; scouted 동원 강도 read) is specified only
  in `2026-07-23-gate07-turn-loop-prototype.md` user stories 19–22, and an
  agent-side classification consequently mis-read the whole area as undecided.
  Related and worse: the **recon costs the user states as decided** (일반 정찰 =
  행동력 2, 즉시 정찰 = 행동력 6, instant raising two rungs) are **absent from the
  repository entirely** — a decision that exists only in conversation is invisible
  to every future reader regardless of how much they read. Pay by promoting
  spec-only mechanism content to its feature birthplaces and landing the stated
  values at a birthplace. This is substantially the work gate 12 (a) was blocked
  from doing.


- [ ] **1v1 map re-authoring — terrain-cradle is a 5–6-seat multipolar map**
  (registered 2026-07-24, ADR 0042 cascade). DOMAIN_MAP/DESIGN now assert the
  two-realm duel, but `docs/features/terrain-cradle/` + `map-gen.js` still author
  the 5–6-seat multipolar cradle world (the parity/geometry rows the DOMAIN_MAP
  banner marks "SURVIVES as principle, re-expressed for two realms"). The hex grid
  (TC-⑪) stays frozen; new 1v1 worlds are added as gate-06 map artifacts (no seal
  broken). This is the **parallel map pass** (ledger "capital-terrain gate" +
  premises "new worlds = gate-06 artifacts"), a design/build pass — recorded here
  only as the Projection↔terrain-cradle divergence it opens. Not a doc-only fix.

- [x] **SPEC amendment — PAID 2026-07-25.** The pivot's SPEC leg: grill-sealed
  one item at a time (2026-07-24, adversarial grill; several items changed from
  the original proposal), then applied verbatim to `SPEC.md` as E1–E12 — Goal,
  Core Gameplay Promise, Principle #2 (sharpen) / #5 (rewrite), Positioning
  (terrain-war-duel anchor; BM kept parked), Match envelope + Match structure
  (two realms, war=match, capital-fall terminus), the Resolved / Domination /
  How-a-match-ends blocks (superseded), Fun Pillars 1 & 3 (re-cut), and Phase 2
  (parked). Draft `docs/features/capital/SPEC-AMENDMENT-DRAFT-duel-pivot.md`
  updated to the sealed outcomes and stamped SEALED. The SPEC↔DOMAIN_MAP
  contradiction is closed. (Registered 2026-07-24, ADR 0042 cascade.)

- [ ] **Multi-realm terms marked HISTORICAL in prose, not in term-inventory
  status** (registered 2026-07-24, ADR 0042 cascade). The DOMAIN_MAP + match-arc
  victory terms superseded by ADR 0042 (hegemony decision point, decision point,
  hermit clause, vassalage, settlement cluster, winning archetypes, crisis
  CE-①…⑳, …) carry a `⛔ Superseded` prose stamp + doc-front-door banners, but
  their `docs/audits/term-inventory.json` rows still read `AGREED` — because the
  documentation-law status vocabulary has only AGREED / PROPOSED / rejected-recorded
  and NO "superseded / historical" state (single-definition record: the birthplace
  match-arc docs now carry the historical stamp, and the inventory indexes to
  them). Options: extend the Vocabulary Law status dictionary with a
  `superseded`/`historical` state (a law change, Tier-3), or accept prose-level
  supersession as sufficient. Recorded, not resolved. Related: the "Term lifecycle
  beyond promotion" Codex P1 row below (deprecated state) is the natural carrier.

- [ ] **Gate 07 seal — deferred duties** (registered 2026-07-23). The L3 Wayfinder
  gate 07 sealed the read-layer presentation contract + commit-first interaction
  skeleton + coupled-camera navigation (ticket § Answer;
  `docs/features/fog-of-war-discovery/RULINGS.md` ②). Left unpaid **by design**:
  (a) **throwaway-branch capture of the prototype** (`mockup/combat-calc/turn-loop-prototype.html`)
  is deferred — the user keeps iterating on it in play; capture when iteration
  settles. (b) **Gate-07 presentation vocabulary** (commit bar, read layer, etc.)
  is NOT registered as Tier-1 terms — the presentation-ruling birthplace is the
  open gate-12 publication question; kept as RULINGS ② prose meanwhile. (c) **Recon
  economy numbers** (instant recon, radar/detection pricing, value-driven
  differentials) stay candidate (RULINGS ② + memory `terrain-game-recon-fog-economy.md`);
  promote to a seal only when the map scale-up pass or a playtest settles them.
  (d) **Tier-3 PROPOSAL for the user:** promote the recurring "casual — info
  summoned by the commit decision, calm at rest, entrance-design (never
  spread-everything)" principle to a `DESIGN.md` / `DOMAIN_MAP.md` Design
  Principle. Recorded here, not applied (SPEC/DESIGN promotions are user-scope).

- [ ] **Spec-home divergence: config says `docs/features/<slug>/specs/`, practice says `docs/superpowers/specs/`** (registered 2026-07-23).
  `docs/agents/issue-tracker.md` routes design specs to
  `docs/features/<slug>/specs/` (doc-structure ticket-11 routing verdict), but
  all 14 existing specs live in `docs/superpowers/specs/` and no feature
  `specs/` directory exists yet. The gate-07 turn-loop prototype spec
  (`docs/superpowers/specs/2026-07-23-gate07-turn-loop-prototype.md`) followed
  live practice. Resolve by either migrating specs under their features or
  amending the config to match practice — a doc-structure decision, not settled
  here.

- [x] **L3 Seam Wayfinder 02 — ADR promotion undecided — PAID 2026-08-03** by the
  Wayfinder gate 12 batch. Promoted to **ADR 0049** (Runtime authority and the
  projection boundary). Both riders paid in the same batch: ADR 0039's header is
  stamped and its Decision 3 narrowed from "resulting state" to viewer
  projections, `DESIGN.md`'s mirroring sentence is corrected, and the
  caller-discipline principle is absorbed into ADR 0049's rationale rather than
  promoted to a root document. **The row's own reading was upheld and is worth
  keeping:** the mandatory-ADR trigger genuinely does not fire, and promotion ran
  on the Record layer's architecture-grade standard instead, against a measured
  28 authority citations from the canonical source into this tracker. The trailing
  "Same for Wayfinder 01 (parallel-strangler topology)" is **void, not owed** —
  ADR 0041 removed the premise and gate 11 closed as "nothing is retired". The
  original text follows unchanged, quoted so it does not read as an open item.

  > **L3 Seam Wayfinder 02 — ADR promotion undecided** (registered 2026-07-16).
  > Wayfinder 02 (`.scratch/l3-playable-seam/issues/02-define-game-runtime-authority.md`,
  > resolved 2026-07-16, user-sealed) settles Game Runtime authority: the Runtime
  > privately owns match truth, blur happens once at the projection seam, command
  > preview is a pure module outside the Runtime, bots are ordinary callers while
  > the Runtime enforces turn order without sleeping, and the intent log plus seed
  > is the canonical durable form. Parts of that — preview placement and the
  > serialization contract — are architecture-grade and are natural ADR promotion
  > candidates. It fires no mandatory-ADR trigger (no win condition, no cross-feature
  > *game* model, no SPEC direction change): ADR 0039 Decision 3 explicitly deferred
  > "the exact API shape" to implementation, and this answers inside that deferral
  > while honouring 0039/0040's framework-free seam. One loose-language flag for
  > whoever closes this: ADR 0039 Decision 3 says the runtime "exposes resulting
  > state and events", and `DESIGN.md:43` mirrors it as "renders returned game state
  > and events". The sealed direction had already moved past that phrasing before
  > this ticket — ADR 0040's Consequences name the viewer-projection seam, and the
  > umbrella spec says "events plus viewer-safe match projections" — so 02 elaborates
  > rather than contradicts. **User decision 2026-07-16: both Tier-3 follow-ups ride
  > gate 12's ADR batch rather than landing early** — (a) stamp ADR 0039 and correct
  > the `DESIGN.md:43` sentence in that same batch, so the supersession duty falls in
  > one place; (b) the session's recurring principle — *a protection that depends on
  > caller discipline is not a structural guarantee*, which drove three of 02's
  > rejections (opaque state token, Runtime-side preview, and the live
  > `js/ui.js:156-157` truth-fallback) — is absorbed into that ADR rather than
  > promoted to a root doc separately.
  > The ticket is the birthplace meanwhile, because the L3 Seam has no Production
  > home yet by the umbrella spec's own deferral. **Promotion decision belongs to
  > Wayfinder 12** (spec partition after the documentation audit); this row exists so
  > it is not lost there. Same for Wayfinder 01 (parallel-strangler topology).

- [ ] **L3 Seam Wayfinder 03 — fog RULING promotion undecided** (registered
  2026-07-17). Wayfinder 03
  (`.scratch/l3-playable-seam/issues/03-define-viewer-knowledge-contract.md`,
  resolved 2026-07-17, user-sealed) settles the L3 viewer knowledge matrix:
  Standard Fog publishes the land and its derivations — including **current
  political control** — and fogs only the mutable draw on that land; enemy
  treasury leaves the viewer projection entirely and survives only as 판세 band
  width; civilian register and 동원 강도 fall out as derived bands with zero new
  dials; seven non-leak invariants bind every projection.
  **Fires no mandatory-ADR trigger**: no win condition changes (the 패권 결정점
  arithmetic is untouched — only the already-sealed *readability* of 판세 is
  specified), no cross-feature game model changes (it fills the gap the Slice 2
  ladder left by classifying military state but never control), no SPEC direction
  changes. The governing precedent points at a feature RULING rather than an ADR:
  fog **RULING ①** (wall grade is public, SEALED 2026-07-08, user grill) settled a
  structurally identical visibility gap as a
  `docs/features/fog-of-war-discovery/RULINGS.md` row. The control decision is
  that ruling's sibling — a RULING ② candidate at the same birthplace — and §2 of
  the answer is literally RULING ①'s principle ("structures are visible; the
  manning is banded") reaching people instead of walls.
  Open for whoever closes this: the treasury and derived-band clauses cite
  match-arc GLOSSARY rows (패권 결정점, Affordability bound AB-①, 징집 명부 MT-②,
  동원 강도 MT-③) without amending any of them; whether they also owe match-arc
  RULINGS rows or ride the fog ruling alone is a partition call.
  The ticket is the birthplace meanwhile, because the L3 Seam has no Production
  home yet by the umbrella spec's own deferral. **Promotion decision belongs to
  Wayfinder 12**; this row exists so it is not lost there. Same handling as
  Wayfinder 01 and 02 above.

- [ ] **Fog INDEX Status line still says "position fog"** (noticed 2026-07-17
  while resolving Wayfinder 03; ritual duty 6 — divergence noticed, not caused).
  `docs/features/fog-of-war-discovery/INDEX.md` § Status reads "Scope is the
  Standard fog MVP (position fog)". "Position fog" is the retired map-discovery
  framing: the same file's § Idea already carries the 2026-07-14 supersession
  stamp ("geography is public from turn 0; only the mutable layer … is fogged"),
  but the Status line was not refreshed in that batch. Wayfinder 03 completes the
  retirement — the `[0, 0.45)` confidence interval that position fog occupied is
  now permanently dead and `DECAY_FLOOR = 0.45` (`js/intel.js:17`) is the sealed
  floor rather than an unimplemented instruction from the 2026-07-01 spec §4.
  Pay with the Wayfinder 03 fog-ruling promotion above, so the INDEX refresh and
  the ruling land in one batch.

- [ ] **Fog GLOSSARY Tier-1 row contradicts the Wayfinder 03 seal — seal-amends
  duty owed** (found 2026-07-17 by the gate audit, against work sealed hours
  earlier the same session). `docs/features/fog-of-war-discovery/GLOSSARY.md`
  defines Information confidence as "a scalar from **blind (0)** to fully known
  (1)" (Tier-1 birthplace, AGREED 2026-07-10). Wayfinder 03's C03.10 seals
  `[0, 0.45)` as permanently dead with `DECAY_FLOOR = 0.45` (`js/intel.js:17`)
  as the authoritative bottom, and C03.1 gives control no confidence channel at
  all — while the row still says confidence "gates status legibility". The
  birthplace is authoritative for the definition, so the row must be amended
  (not the seal restated elsewhere), and by the seal-amends duty that stamp was
  owed in the 2026-07-17 batch (`177f81f`) and was not paid. **The resolving
  session read this file the same day and did not catch it** — a grooming pass
  cannot see outside the active gate's radius, which is what the audit sweep is
  for. Pay with the fog RULING ② promotion batch above; all three fog rows land
  together. Related, needs a look before that batch: **ADR 0023**'s
  confidence-gated status vocabulary ("border-but-uncertain",
  "occupied-but-poorly-scouted", `threatened` requires "sufficient information
  confidence") is Accepted and unretired vs C03.1 — probably reconcilable (the
  gating reads as being on enemy reach/force, not on control), but Wayfinder 03
  never named ADR 0023. Evidence: `.scratch/l3-playable-seam/audit/SYNTHESIS.md`
  Finding D.

- [ ] **DESIGN-RISKS R14 "Answered" is falsified by the build it predicted would
  close it** (noticed 2026-07-17 by the gate audit; ritual duty 6 — divergence
  noticed, not caused; **unregistered until now**, though R14 is mentioned in
  four other rows). `docs/DESIGN-RISKS.md` R14 is stamped "**Answered
  2026-07-13** (four-survey synthesis → ADR 0037)" — the diagnosis being that
  the fizzle is a placeholder/harness artifact, "**NOT a property of the sealed
  war**", closing "when the build implements the sealed model". The build landed
  (slice-2 tickets 01–11, merge `edd0325`) and `docs/features/war-model-build/
  INDEX.md` reports the opposite: no-material-outcome only 80.7% → 68.7%, the
  fizzle survived **renamed** (~35.7% pre-emptive white peace + **~18.6% wars
  that never end**; "ADR 0038's composite fires none of 격멸/수도/정착"), and the
  same shape reproduces in the retired L2 harness after its own retirement
  (78.8% → 72.1%) — "**a property of the model, not of one loop**". R14 remains
  🟡 with an unchecked open action, and DESIGN-RISKS was last touched 2026-07-13,
  three days before the falsifying evidence. Correct read: **diagnosis answered,
  risk not closed.** Layer note: `docs/DESIGN-RISKS.md` is **Working**, not
  Projection (documentation-law:17). Two riders found with it: **ADR 0038** is
  L0-trust, pre-registered metric 5 as its own test, was falsified by it, and
  remains "Accepted (sealed 2026-07-14)" **unamended**; and **ADR 0030**
  (패권 결정점 — the accepted match-ending) has **zero implementation in `js/`**,
  living only in the harness ADR 0037 retired. Owner: the war-termination pass
  (`.scratch/l3-playable-seam/map.md` § Gate re-cut). Evidence:
  `.scratch/l3-playable-seam/audit/SYNTHESIS.md` Finding B.

- [ ] **Authored sector count is wrong in two Production docs** (found
  2026-07-17 by the gate audit; verified directly). `docs/features/terrain-cradle/
  INDEX.md` and `DOMAIN_MAP.md:440` both say "10 regions → **55** sectors → ~292
  hexes". The generator produces **56** and `tests/occupation-geography.test.js:13`
  asserts 56 ("all 56 cradle sectors present"); hexes (292) and borders (17)
  match. Code and tests are right; the docs are off by one. **Wayfinder 06
  resolved 2026-07-18**: the exported authored artifact is the source of truth,
  so 56 (code+tests) is authoritative and the two Production docs are off by one.
  The doc fix is a baseline/term-inventory correction, batched with gate 12's
  term registration (`DOMAIN_MAP.md:440` + terrain-cradle `INDEX.md`). Evidence:
  `.scratch/l3-playable-seam/audit/SYNTHESIS.md` E2.

- [ ] **Gate 06 authored-world contract — implementation deferred** (registered
  2026-07-18, gate 06). Gate 06 sealed the authored-world input contract
  (exported TS/ESM artifact; `(world id, revision)` identity; revision-local ids;
  three-tier validation; production/evidence split). Deferred to the first
  authored-world implementation ticket: (a) baking the frozen artifact from
  `map-gen.js` output into the `game/` tree; (b) the tier-1 runtime
  loader/validator, including the revision content-integrity check that D4's
  replay safety depends on; (c) the offline authoring/publication gates
  re-implemented from the authoritative contract (not translated from
  `map-gate.js`). Term registration for `world id` / `revision` /
  `authored-world identity` is owned by gate 12. Evidence:
  `issues/06-define-authored-world-input.md` Answer.

- [x] **Wayfinder 01 amendment — PAID 2026-07-17** (registered and paid the same
  day; ADR 0041 landed the correction the audit had only diagnosed). The user's
  environment-isolation statement supplied the missing frame: Firebase hosts the
  marketing landing only, the L3 game does not ship as a statically-hosted web
  page, its destination is a native shell, and `js/`/`tests/`/the L2 harnesses
  are a reference archive rather than a migration source. Paid as: **C01.5 and
  C01.6 VOID**, **C01.2/C01.4 RE-SCOPED**, **C01.7 CORRECTED** (retirement is
  not a data-loss operation — `game.html` is byte-for-byte `HEAD:index.html`);
  C01.1/C01.3 stand. Stamped in the gate-01 ticket, `ledger.md` § Gate 01, and
  `map.md` § Gate re-cut; ADRs 0016 and 0028 stamped; ADR index updated;
  `AGENTS.md` § Verification corrected and § Environments added; `DESIGN.md`
  given a summary + pointer. Original diagnosis below, kept for the record.

  Gate 01 (resolved 2026-07-16, user-sealed) chose a
  parallel-strangler topology resting on the legacy route as a bounded
  comparator. **The topology is not in question; its factual premises are.**
  (a) **C01.2/C01.4** — `game.html` loads 17 classic scripts and **none of the
  eight slice-2 war modules**, so the port targets have no comparator while the
  comparator runs `js/combat.js`, behavior the umbrella spec's *Settled-war
  eligibility* already declares ineligible; and "equivalent fixtures and seeds"
  is unachievable against a path with **38 unseeded `Math.random()` sites**
  unless the comparator gate 01 preserved is itself modified. (b) **C01.5** —
  "the accepted L3 build assumes the public `game.html` role" was written
  against the **working tree**: `game.html` is not in HEAD (the game's committed
  route is `/`), the move is uncommitted in-flight landing work, and
  firebase's `cleanUrls: true` makes the destination route **`/game`**, not a
  filename. (c) **C01.7** — retirement is **not** a data-loss operation: the
  gate-11 auditor inferred it was because `game.html` was never committed, but
  the file is **byte-for-byte `HEAD:index.html`**, so its content is in history.
  That inference was refuted only when this session went to act on it. Evidence:
  `.scratch/l3-playable-seam/audit/SYNTHESIS.md` Finding A + its CORRECTION;
  authority: `docs/adr/0041-environment-isolation-and-reference-archive.md`.

- [x] **Documentation law double-load — PAID 2026-07-17** (found and paid the
  same day; the user's authorization to land the Codex batch removed the
  blocker). **Found by observation, not inference:** both `AGENTS.md`'s generated
  block and the canonical law appeared in full as project instructions in a
  single session's loaded context — ~1,700 words twice, every Claude Code
  session. **Cause, verified:** the harness auto-loads project
  `.claude/rules/*.md` on its own; no `@`-import in `CLAUDE.md`/`AGENTS.md` and
  no `settings.json` entry asked for it. So the guard comment then in flight
  ("Do NOT re-add a separate `@`-import — a second import would load the full law
  twice") named the wrong mechanism: removing the import deduplicated nothing,
  because the import was never the cause. **Paid by:** `git mv
  .claude/rules/documentation-law.md DOCUMENTATION-LAW.md` (top level, alongside
  the other Law-layer files) — the mirror block stays the single delivery
  mechanism for **both** hosts, and the canonical file simply leaves the
  auto-loaded directory. **Not** by an `@`-import: Codex has no external-file
  auto-import (the block's whole rationale), so an `@` would lose the law for
  Codex *and* re-duplicate it for Claude. Also repointed: `sync-docs-law.js`'s
  SOURCE, the law's own Layer table, the `AGENTS.md` preamble, `CLAUDE.md`, and
  the live pointers in `DESIGN.md`/`DOMAIN_MAP.md`/`docs/adr/README.md`/
  `docs/audits/HARVEST.md`/`doc-registry.json`/`doc-audit` SKILL/fog + terrain-
  cradle docs/this ledger. Dated records (`.context/`, dated `docs/audits/`,
  superpowers plans, match-arc research) keep the old path on purpose — they
  record what was true then. **Caught during the move:** `write-lint.js`'s
  `GOVERNED` regex did not match the new path, so the hook would have silently
  stopped linting the law; regex and `tests/hooks.test.js` updated, old path kept
  matched for stray copies. **Not verifiable in-session** — the auto-load happens
  at session start, so the saving shows in the *next* session's context.
  **Verified single-load in a fresh session 2026-07-18:** the full law text
  (heading `# Documentation & Terminology Law — Terrain Game` + Layer-taxonomy
  table) appears exactly **once** in loaded project context — inside the AGENTS.md
  block only — and `.claude/` carries `skills/` with no `rules/` dir. Fix confirmed.
  Remaining sliver: `CLAUDE.md`'s `## Agent skills` section still duplicates
  AGENTS.md's authoritative `## Issue tracker`; slimmed to a pointer + a guard
  comment in the same batch.
  **One residual, named not fixed:** five `.scratch/doc-structure/` files
  (issues 01/04/05/07 and two research notes) still cite the old path as a live
  target. That tracker belongs to another effort and its terminal gate currently
  reads `⛔ DO NOT EXECUTE`, so a stale pointer harms nothing today — but whoever
  un-blocks it should re-point them first. `05-law-staleness-batch.md` is the
  natural carrier.

- [x] **`lint:docs`'s drift guard was dead behind an `&&`, and a permanent false
  positive was holding the gate open — PAID 2026-07-17** (found while landing the
  law move; both halves verified directly). Two defects that only mattered together:
  (a) **`ledgerCurrency` fuzzy-matches ledger row titles against commit
  messages.** It reports `ledger-possibly-paid` for the row *"L3 Seam Wayfinder
  02 — ADR promotion undecided"* against the commit *"docs(l3): audit every open
  wayfinder gate and re-cut the tracker"* — the word "wayfinder" is the whole
  match. The row is **not** paid: its promotion decision belongs to Wayfinder 12,
  which has not run. Every future commit containing "wayfinder" will flag every
  `L3 Seam Wayfinder NN` row. Triaged and dismissed repeatedly across
  `d7bd539`/`caf6772`/`acebded`; it is a heuristic doing its job badly, not a
  real finding.
  (b) **`npm run lint:docs` is `node scripts/audit-lint.js && node
  scripts/sync-docs-law.js --check`, and `audit-lint.js` exits 1 on *any*
  finding** (verified: exit code 1). So the `&&` short-circuits and the drift
  check never runs. The Codex parity batch added that guard (`6754c34`) to catch
  a hand-edited AGENTS.md block — but with (a) firing permanently, **the guard
  has never actually run inside `lint:docs`**. It works standalone
  (`node scripts/sync-docs-law.js --check` → OK), which is how the law move was
  verified.
  **PAID 2026-07-17** — `lint:docs` now exits 0 for the first time, with the drift
  guard actually running. Three fixes, each grounded in something the tool already
  claimed:
  1. **`ledgerCurrency` now sees every Open row.** `OPEN_ROW_RE` required
     `**title**` and `registered YYYY-MM-DD` on the *same line*, but rows wrap and
     the date lands wherever the prose put it — so the check watched **6 of 36**
     Open rows, and *which* debts it watched was decided by line-wrapping accident.
     It now parses each row as a block (header → line before the next row marker).
     This defect was invisible until the one below was fixed.
  2. **Matching is distinctive-token, as the code comment always said.** The
     comment read "whose *distinctive* title token appears in a commit subject";
     the implementation matched on any token ≥6 chars, so "wayfinder" — shared by a
     dozen sibling rows — fired forever. Token frequency is now counted across all
     Open rows and only tokens belonging to exactly one row can match. A row whose
     title is entirely shared vocabulary is honestly left unflagged rather than
     flagged always.
  3. **`ledgerCurrency` is advisory; it no longer sets the exit status.** It is the
     only check that guesses — its own finding says "possibly paid … verify and
     mark paid or dismiss" — and there is no way to record a dismissal, so letting
     it gate meant one unlucky word match shut `lint:docs` permanently. The tool
     printed "reports, never legislation" and then exited 1 on the next line; that
     contradiction is resolved in the reminder's favour. `lint:docs` was also
     reordered to `sync-docs-law --check && audit-lint` so the contract-grade drift
     check runs before the report-grade audit rather than behind it.
  **Left for `09-lint-hardening.md`:** giving the ledger a dismissal mechanism;
  and `commits.find()` returning the **first** match, which can surface a
  coincidental commit while hiding a real one.
  **Known residue, by design:** with the parser unblinded the check now reports 4
  advisory candidates. Triaged 2026-07-17 (below, in the classification note) —
  **all four are coincidental single-word matches** and none is paid. Advisory
  findings are expected to be non-zero; that is the check working as a reminder.

- [x] **The other seven audit-lint checks classified blocking vs advisory —
  DONE 2026-07-18** (the tail of the drift-guard fix above left only
  `ledgerCurrency` decided; this is the deliberate pass over the rest). Rule
  applied, per the `ADVISORY` comment in `scripts/audit-lint.js`: a check gates
  only if it (1) **asserts** a defect rather than guessing, and (2) has a
  **reachable green state** — doing the right thing clears it. The second rule is
  the one `ledgerCurrency` broke (no way to dismiss a false match), not the first.
  Verdicts:
  - `headerDiff`, `statusMarkers`, `numericRestatement`, `baselineSelf`,
    `adrStampDuty` — **blocking.** Each names a definite, verifiable, clearable
    defect (header divergence, marker/status disagreement, a dial restated off its
    owning doc, a self-inconsistent baseline, an unstamped ADR amendment).
  - `freshness` — **blocking, decided on its own merits** (the handoff flagged it
    as a possible reminder). Its date scoping is loose (`09-lint-hardening.md`
    item 3: any glossary date counts as a seal), so it *can* fire on an incidental
    date — but its green state is reachable and *is* the duty it guards
    (regenerate QUICKREF + stamp the date = ritual duty 4), and the law names this
    check as that duty's freshness target. A false positive cleared by performing
    the duty is a blunt reminder, not a trap. Measured 2026-07-17: passes with
    **zero margin** (QUICKREF `2026-07-14`, newest glossary date `2026-07-14`) —
    the next dated glossary line fires it, as intended.
  - `codeContract` — **blocking, but FLAGGED for gate 05, not settled here.** It is
    entangled with the ADR 0041 migration: the "Term code contracts anchor to what
    is now a reference archive" debt (below) says the first module ported to the L3
    tree will make it fire and break `lint:docs`. Whether it needs a
    migration-window exemption or should stay blocking with the debt repaid in the
    same batch is the gate-05 decision's to make. Left blocking (its current, safe
    default) and coordinated there, not forced blind here.
  Correction to the "battery is plausible" note above: on inspection all four
  advisory matches are spurious. `design`/`evidence`/`naming` are generic tokens
  landing in unrelated commit subjects; `battery` matched a commit that touched
  `mockup/decisive-battle/battery.js`, a **different file sharing the basename** —
  the debt is about `mockup/combat-calc/battery.js`, last touched 2026-07-07
  (before the debt was registered) and still referencing the retired `capPerSector`
  dials. That debt stays open and unpaid. The `commits.find()` first-match bug
  (left for 09) is exactly what let a same-basename commit surface here.
  Pinned by `tests/audit-lint.test.js` ("tally:" tests) so the whole set can't be
  quietly re-defaulted; the doc-audit skill's Layer-0 step now reads the blocking
  vs advisory tallies rather than a raw finding count.

- [ ] **Term code contracts anchor to what is now a reference archive**
  (registered 2026-07-17; caused by ADR 0041, not merely noticed). ADR 0041 names
  `js/` a reference archive and puts canonical L3 source in its own tree. But all
  **27 sealed terms carrying a code contract** point their `codeRefs` into
  `js/*.js` (`docs/audits/term-inventory.json`), and `scripts/audit-lint.js`
  builds its source map from a **flat, non-recursive** `readdirSync(root/js)`
  filtered to `.js` (:347-350), resolving only `jsFiles[ref] || jsFiles['js/' +
  ref] || ''` (`checkCodeContract`, :130-148). Two consequences, both certain:
  (a) every such contract now cites archived code as if it were the live
  implementation — the Vocabulary Law's code-identifier link points at the wrong
  tree the moment a term's behavior graduates; (b) the first module re-implemented
  in the new space reports `code-contract-violation` and **`npm run lint:docs`
  fails** — a session-close ritual duty (documentation-law duty 7) *and* the
  `write-lint.js` PostToolUse hook. This is a **designed** fracture with a known
  trigger date, not a latent bug: it fires on the first L3 vertical slice. **gate
  05 sealed the method 2026-07-18 (D5):** widen `audit-lint.js`'s source scan to
  recursive + `.ts` over `js/` and `game/src` (existing roots only — a no-op
  until `game/` exists); move each term's `codeRefs` to the new tree only at
  behavior graduation (parity-verified); keep `code-contract` **blocking** (fix
  the scanner's field of view, not its strictness); add `game/` to
  `write-lint.js`'s `GOVERNED`. Execution belongs to the **first port build
  ticket**, not gate 05 (a decision gate) — do not pre-emptively re-point, the
  target path does not exist yet.
  Evidence: `.scratch/l3-playable-seam/audit/SYNTHESIS.md` E3.

- [ ] **Gate 05 command surface — gate 10 fills thresholds, not names**
  (registered 2026-07-18, gate 05 D3). Gate 05 sealed the seven-command `:game`
  developer surface (`dev`, `typecheck`, `build:runtime`, `test`, `test:browser`,
  `build`, `verify`) and an ownership split: **gate 05 owns command existence,
  names, and structure; the verification gate (10) owns each acceptance command's
  pass/fail threshold.** The umbrella spec's Testing Decisions still assign "exact
  commands and thresholds" to gate 10 (`spec.md:438-439`); when gate 10 runs it
  fills thresholds only and does not re-design or re-name the surface. Acceptance
  commands fail `pending` until their threshold is filled, so a deferred gate
  cannot show green. This row exists so gate 10 does not reopen the command
  surface. Close when gate 10 runs. (Promotion assessment, if any, belongs to
  gate 12 — gate 05 is build topology, not architecture-grade, so likely no ADR.)

- [ ] **`docs/DISPLAY-DEBT.md` may owe rows to the gate-07 prototype**
  (noticed 2026-07-17 by the gate audit; ritual duty 6 — divergence noticed, not
  caused). The gate-07 auditor found DISPLAY-DEBT carries 12 open rows that
  explicitly defer their design "to B (the playable slice)" — i.e. to Wayfinder
  gate 07 — including the mobilization meter (동원 강도 zones), the
  scar/mobilization fog intel view, the expansion break-even card, and the
  reachability-filter display. The gate-07 ticket cites DISPLAY-DEBT nowhere.
  Separately, the sealed knowledge matrix's **derived-band grade** (판세 ·
  동원 강도 · civilian register) has **no encoding proposal anywhere** in the
  corpus. Pay when gate 07 opens: reconcile its prototype scope against the
  DISPLAY-DEBT rows already pointed at it. Evidence:
  `.scratch/l3-playable-seam/audit/SYNTHESIS.md` § re-cut, gate 07.

- [ ] **Designation law clause — application PENDING (Tier-3, user-sealed
  2026-07-16)**. The `## Designation — a ruling's body in a Working text` clause
  (doc-structure ticket 04) is user-sealed but not yet in
  `DOCUMENTATION-LAW.md`; insert it after the Mandatory-ADR-trigger
  clause (`:94`), before `## Vocabulary Law`. Verbatim text + rationale:
  `.scratch/doc-structure/issues/04-working-spec-authority.md` (§ "User-sealed law
  clause") + `docs/audits/2026-07-16-designation-ruling.md`. The original "batch
  with ticket 03" target is now conditional on ticket 09, so this may land in its
  own seal or the next unblocked doc-sync batch — sequencing is the user's.

- [ ] **war-model-build dial-sheet home — graduation owed** (2026-07-16,
  doc-structure ticket 04 designation ruling). Slice-2 dials live in the
  designated spec §2 as 가안; when the first magnitude pass runs (the one that
  grades the commit curve / resolves the HELD stationary-recovery dial — rows
  below), it builds `war-model-build`'s owning model doc (MAGNITUDE-class) and
  migrates the sheet out of the spec — an instance of the designation "detail
  graduates" clause. Until then the spec is the authoritative detail; it is
  disposable only after graduation.

- [x] **war-model-build INDEX refresh — PAID 2026-07-16** (slice-2 tickets
  07/10/11). The front door now reads tickets 01–11 all landed, points at both
  harnesses (`npm run metrics:slice2`, `npm run metrics:fizzle`), carries metric
  5's headline with the verdict withheld, and names the frozen comparison target.
  Confirmed at payment: **no Projection sync was owed** by the harnesses — they
  are Working-layer instruments that seal nothing; the terms ticket 11 DID touch
  (White peace / Settlement preset ladder / Personality coefficient) were patched
  in `docs/audits/term-inventory.json` in the same batch (index fields only, per
  HARVEST.md), and their birthplace definitions in match-arc are untouched.
  **Absorbed a duplicate 2026-07-17**: an earlier `[ ]` row for the same duty
  ("war-model-build INDEX refresh — slice-2 ticket 07 landing", registered
  2026-07-16 at `6fbd5ce`) survived uncommitted alongside this paid one, because
  payment wrote a new row instead of striking the old. Verified before removal —
  the row asked to "mark ticket 07 landed, point at the harness, correct the
  frontier to tickets 08–11", and the front door today reads `01–11`, names both
  harnesses, and reports `suite 466/466 green`. Same duty, already discharged.
  This resolves the duplicate-state question the 2026-07-16 handoff flagged for
  verification. **Ledger hygiene:** strike the row you are paying; do not write a
  second one beside it.

- [ ] **match-arc CE-⑳ enforcement-point stamp — registered** (2026-07-16,
  ticket 11 / RULINGS WM-③ ②). CE-⑳'s birthplace is `match-arc/RULINGS.md`; its
  ENFORCEMENT moved this session — from the stall timer's crisis lock
  (`totalWarLock`, deleted with its subject) to two live surfaces:
  `tournament.js availablePresets` (the ladder gate) and `js/bot-exit.js`'s new
  open-rungs input. The move is execution of ADR 0038's already-declared
  retirement, not a new decision, so **no ADR supersession is owed** — but the
  match-arc CE-⑳ row still describes an enforcement point that no longer exists
  and should carry a one-line pointer at its new homes. Owed at the slice-close
  doc-sync batch, with the rest of the cross-slice §12 stamps.

- [ ] **Retirement rationale is restated in five places — registered**
  (2026-07-16, ticket 11; single-definition rule). Birthplace = RULINGS WM-③.
  Non-birthplace surfaces owe a pointer/summary, never a normative copy, and
  today `baseline-l2.json` (`//why`), `fizzle.js`'s header, `tournament.js
  SPEC_GAPS`, and `REQUIREMENTS.md` A2 each restate the reasoning at length; the
  78.8% / 72.1% figures live in three docs whose owner is the JSON. Not urgent
  (nothing contradicts anything), but it is drift-in-waiting: the copies will rot
  apart at the first re-cut. Trim to pointers at the slice-close batch.

- [ ] **Field-army division-doctrine stamp — registered** (2026-07-15,
  slice-2 ticket 04 landed division/merge in code — merge 1950b36). Spec §12
  owed, now actioned by the code landing: amend the match-arc GLOSSARY 야전군
  row to free division/merge (retire "one at a time" → 구칭 alias) and refresh
  DOMAIN_MAP L666 ("one mobile main force" → freely divisible). Plus record the
  merge float-conservation implementation ruling (substance bit-exact;
  tiredness invariant up to ~1e-12 divide-then-multiply round-off, not
  laundering) at war-model-build RULINGS. Deferred to next doc-sync batch
  (user, 2026-07-15).

- [ ] **Catalog altitude-reclassification pass — registered** (2026-07-14,
  WM-②). Dedicated grill: stamp all 12 operation plans with their altitude
  (contact method / board verb / information·recovery verb), seat contact
  methods in the calculator's categorical socket (A4), author the
  present/predictive reconnaissance plan cards, and supersede the old
  "tactics sequenced = strategy" frame by ADR. Slice 2 performed only the
  minimal 2+2 defense split (spec §8).

- [ ] **Commit-curve grading session — registered** (2026-07-14, WM-②).
  M2 slope/max re-cut is out of slice 2 entirely; slice-2 battery carries a
  descriptive sweep only (spec §11). Decision in its own session, evidence
  first.

- [ ] **HCLM → SPEC Core Principles promotion — PROPOSED (Tier-3, user)**
  (2026-07-14). "High Complexity, Low Micromanagement" as the UX corollary
  of one-judgment (spec §3). User decides at a doc-sync.

- [ ] **Three-altitude reading → DESIGN promotion — PROPOSED (Tier-3,
  user)** (2026-07-14). Tactics / operational art / strategy as nested time
  scopes (spec §0). User decides at a doc-sync.

- [ ] **Stationary requirement for fatigue recovery — HELD dial**
  (2026-07-14, WM-②). Whether recovery requires not moving/fighting that
  turn, beyond the supply coupling (spec §2). Revisit at the magnitude pass
  or measurement. **Recorded HELD rather than valued at its birthplace**
  (`war-model-build/MAGNITUDE.md` WB-M① dial 9) and **wired 2026-07-28** by L3
  ticket 06b: `RECOVERY_REQUIRES_STATIONARY` is consulted by `turnUpkeep`, and
  the Runtime passes the real per-detachment fact, so answering the dial is a
  one-constant value change rather than a redesign.

  **What the wiring exposed, for whoever answers it.** Upkeep runs at the
  background tail of the same turn a march accrues in (D6.2), so at WB-M①'s L1
  values an ordinary full-speed march nets **+1 wear per turn** (3 accrued, 2
  recovered) and **one resting turn erases a whole normal march**. Wear
  therefore bites only under forced march or sustained pursuit. That follows
  from the accrual/recovery *ratio* rather than from dial 9 — but it is the
  measurement anyone re-cutting either dial will want, and it is the kind of L1
  relationship the "no L2 rung under the L3 build's values" row above says play
  can only falsify grossly.

- [ ] **Two inherited supply-ledger rulings have no birthplace**
  (registered 2026-07-28, L3 ticket 06b). Both ran in the archive while WB-M①'s
  values were being exercised, so changing them would invalidate those numbers
  rather than honour them; both are now carried forward in
  `game/src/domain/fatigue.ts`, pinned by test, and sealed nowhere: **(1)** any
  supplied turn resets the pump to zero — §2 says only that restoring the route
  ends the tick and is silent on residual depth, and a partial trickle resets too
  (the level only modulates recovery); **(2)** on a cut turn the pump runs first
  and the bleed is taken at the new depth, so turn N of a siege bleeds at depth
  N. Pay them on the same surface the **supply-base question** lands on — R16
  agenda item (b), "define the kitchen", where ticket 06b's BLOCKED note is
  homed. Both are inert while supply is uniform, which is why 06b closed without
  them.

- [ ] **Crisis dial table — sweep + co-analysis: RAN, PARKED
  2026-07-13** (registered 2026-07-11; LANDED 2026-07-12
  `e5d5c58..25192cb`; co-analysis pass 2026-07-13 commit `d64d48c`,
  294/294). The co-analysis grill ran the sweep and **parked** the
  crisis: the growth formula was reshaped (register-anchored; retires
  rate0/rateStep/crisisRate/sectorFuel + intensity factor), and
  **self-denial** (CE-⑦ reframe, `selfDenialFrac`) cut draws 0.369 →
  0.200 — but the sweep found (a) every remaining crisis dial is a
  *brake* (cranking denial converts late-trips to draws, not to faster
  resolution; elim flat 3-5 throughout), and (b) the crisis is causally
  confined to turns ≥26, so it cannot fill the 18-22 tripTurn
  sweet-spot nor create decisive endings. **Root cause moved to R14**
  (DESIGN-RISKS): the main arc yields ZERO annihilations (77%
  stall→white-peace, crisis-OFF), so the draw/spectacle problem is the
  war system, not the crisis. Crisis stays 가안 + PARKED as a backstop;
  the next lever is the war-decisiveness pass (R14). **R14 RAN 2026-07-13
  → ADR 0037**: the four-survey synthesis found the answer is a war-machine
  *implementation* gap (per-front uniform defense / non-atomic siege conveyor /
  static declare gate + bot stall-exit) — build the sealed model
  (`docs/features/war-model-build/`), don't tune L2 further; crisis un-parks in
  the build context.
  No Tier-3 default flip (crisis stays opt-in OFF).

- [ ] **Crisis co-analysis seal-sync — MOOTED by ADR 0042 (2026-07-24)** — the
  crisis system is now RETIRED (not un-parked): ADR 0042 supersedes the crisis
  stack (0034/0035/0036), so the crisis never un-parks in a build context and this
  deferred seal-sync is no longer owed as a live debt. The crisis's opt-in-off code
  is left dormant (no code change). Kept for the record; strike at the next tidy
  pass. Original deferral below.
  (2026-07-13, commit `d64d48c`). The pass landed code that AMENDS sealed rulings
  but the full Production/Projection seal-sync is deferred (pass is PARKED, dials
  stay 가안, so premature to final-seal): (a) RULINGS amend CE-④/⑭
  (growth reshape — register-anchored, additive baseline + scar
  amplifier, intensity factor retired) and CE-⑦ (denial self↔board
  reframe, `selfDenialFrac`); (b) record CE-㉑/⑳/㉒ as measured-INERT +
  CE-⑩ shield-drain BUILT-then-REVERTED; (c) GLOSSARY rows
  (unrestBase0/unrestStep/scarGain, selfDenialFrac, conquestPacifyFrac,
  noStallPeaceStage, rebelSiegeDrag); (d) QUICKREF regen; (e) ADR
  0035/0036 amend stamps (growth + denial reshape); (f) term-inventory
  patch. Recorded now, paid when the crisis un-parks (after R14) or in a
  dedicated doc batch.

- [ ] **`eliminate()` register non-conservation — pre-existing, Tier-3**
  (found 2026-07-12 during the crisis whole-branch review). In
  `mockup/combat-calc/tournament.js` `eliminate()`, the winner is
  credited `round(D.pool × 0.5)` but the defeated realm's `D.pool` is
  never zeroed (unlike `D.field`/`D.interior`), so the world reserve
  register can GROW on an elimination — a conservation break. The
  winner's inflated (alive) pool feeds the sealed affordability
  arithmetic and the cradle world-register-bounded test, so it is baked
  into the sealed record-world baseline; root-fixing it means
  **re-sealing that baseline (Tier-3, user decision)**. The crisis
  measurement (`crisisGateReport`) works around it by excluding
  `alive === false` realms from its register-exhaustion denominator
  (commit `25192cb`); no crisis metric depends on the bug. Owner: user
  — decide whether to root-fix + re-seal.

- [ ] **Suppression cost not deducted from garrisons — L2 fidelity gap**
  (registered 2026-07-12, crisis Task 5). `crisisTurn` MEASURES
  suppressor casualties per terrain (`record.crisis.suppressCostByTerrain`,
  the CE-⑯ watch item) but does not SUBTRACT them from `frontG`/
  `capitalGarrison`, so suppression budget stays constant turn-over-turn
  regardless of accumulated losses — a partial gap vs CE-⑩ ("walls
  hollow from within"). The harness has no dedicated reserve pool to
  deduct from cleanly; deferred as a measure-first simplification.
  Revisit if the co-analysis sweep shows it materially changes the
  chore-prevention / war-density read. Owner: the crisis co-analysis
  session.

- [ ] **L3 scar-intel fog layer** (registered 2026-07-11, CE-③). The
  fog-spec read of others' uprising fuel is design-sealed but L3-only;
  L2 measures true values. Pointer: `docs/DISPLAY-DEBT.md` (scar/
  mobilization fog intel view row).

- [ ] **Timing-ruler reframe — DOMAIN_MAP/DESIGN promotion scan** (registered
  2026-07-09; metric reframe SEALED same day as match-arc **DT-①**). The
  reframe (headline = decision timing, `envelopePct` / `medianTripTurn`;
  ET-① buckets demoted to descriptive) is sealed at its match-arc birthplace
  and the feature INDEXes are synced (force-geography U5 + "Next" line,
  match-arc INDEX) — those parts are PAID. RESIDUAL: two feature surfaces now
  consume the reading (match-arc DT-① defines it; force-geography `--fg`
  references it), which is the Tier-1→Tier-0 promotion trigger — but spec §13
  leaves "promote to DOMAIN_MAP/DESIGN vs stay a match-arc ruling" an OPEN
  doc-sync question. Held as a CHECKED non-promotion for now (match-arc-native
  reading); revisit at the next doc-sync batch or when a root doc needs it.
  The **instrument enhancement** for the re-measurement is now BUILT (main
  @f8655ad): `core1822Pct` (18-22 tight-core share, spec §4) + `meanTripTurn` /
  `stdTripTurn` (population) / `tripTurnHist` for a distribution-shape (normality)
  read, plus a `--fg` core line. §5 forced-resolution was SHAPED (RULINGS
  **DT-②**, 2026-07-09) and is now **IMPLEMENTED in the L2 harness
  (2026-07-10**, commits ceea2dc/cbe3b9a/b32a630/e7df309 — conquest-growth
  ripening wired into transfers + turn loop + `--growth` sweep driver;
  status corrected 2026-07-10 by the structure forensics, case F-10): a
  positive-sum growth-divergence engine resolves balanced boards emergently,
  so the §5 "no-draws" SPEC amendment is retired-as-unnecessary; mechanism
  NUMBERS remain deferred to the tuning pass against the timing ruler,
  ice-breaker is a measurement-gated contingency (Zhou seed parked). §6 domination victory arithmetic SEALED and now IMPLEMENTED +
  MEASURED (RULINGS **DT-③**, Combo 2 — trip = (leadership OR dominance) AND
  unassailable, reusing the gate's 1.7×+W6 clause; commit a29eb0a, 167/167
  green, task review + whole-branch review both Approved with zero
  Critical/Important). Same-N re-measurement (pre/post §6, reps=20 × 7
  bindings, seed 42) confirms the predicted `denied-dominant` wall absorption
  (ctrl 27.6%→1.7%, fgM9off 30.1%→2.6%) and a decided%/envelope/core rise
  across all three arms; fgM9off's median tripTurn moved from dead-center 19
  to 17 (now slightly ahead of the 18-22 core) — flagged as a §5 tuning
  watch-item, not a defect. The SPEC.md Direction amendment declaring the
  domination win-type is PAID (see Paid below). Open: whether "peaceful
  development" is a real growth path in the model or must be built; and
  whether the DT-① envelope target (≥78-80% final) is reachable purely
  through DT-②'s emergent growth engine without any clock-like device — the
  question the §5 tuning pass (next) will test empirically before it is
  revisited.

- [ ] **Derived-asymmetry machine-check** (registered 2026-07-08, seal
  TC-⑭): population parity (Σpop==6.0 per region) and the economy ladder
  are authored as literals in `map-gen.js sectorSpec`, not recomputed from
  geometry at load time — so SPEC #8 / TC-⑭ "derived, not baked" is
  doc-enforced, not machine-checked. Add a load-time assertion (per-region
  Σpop; econ == ladder(borders)) to harden it. Optional (compliant today);
  flagged by the 2026-07-08 independent audit.

- [ ] **Match-tilting pass — residual sync** (birthplace sync PAID
  2026-07-07, see Paid below; these items remain): (a) ~~ADR 0014
  header amendment stamp~~ — **PAID 2026-07-10** (user-sealed doc-
  governance package; header stamped under the new seal-amends-ADR duty,
  duplicate of the recovery-dial row's item (a) — ledger hygiene case
  F-11, single stamp paid both rows). (b) **Surge Draft Model curve numbers** — knees,
  band multipliers, surge exchange rate (+1%p/pt 가안), zone names —
  deferred to the magnitude session (structure sealed, numbers 가안).
  (c) Riders: **sheet-7 tempo revalidation** under f₀ 0.5 (was 0.7),
  **M14 flat blood-EV re-check** (band escalation bends it),
  **L2 re-verify registerPerPop** after tilting devices land.

- [ ] **Recovery-dial grill — residual sync** (doc-sync batch PAID
  2026-07-08, see Paid below; these remain): (a) ~~ADR 0014 header
  amendment stamp~~ — **PAID 2026-07-10** (see match-tilting row (a);
  one stamp, both rows). (b) **QUICKREF regeneration** (C-loop table + MT-⑤ + ADR 0027 +
  블라인드 supersession) — batched into the force-geography doc-sync
  **2026-07-09**: added the Force-geography term section + C-loop row +
  블라인드-supersession note + header date/addendum. Residual (a
  full row-by-row re-audit of every prior batch against canon) is NOT
  claimed done — QUICKREF is a convenience surface that may lag; treat
  this as targeted-current-through-2026-07-09, not a from-scratch regen.

- [ ] **L2 fidelity-boundary grill session** (registered 2026-07-10, §5
  conquest-growth measurement pass; user-requested). Standing principle
  (user, 2026-07-10): L2 implements EVERYTHING except the fun only a
  human can verify — mechanical, deterministic, document-specified
  behavior is never legitimately abstracted away. Trigger case: the L2
  board flattens sector transfer to a count while DOMAIN_MAP's cession
  currency is defined as "named sectors" with per-sector cap value
  varying 360–1,200 (3.3×) by region geography — the flat `capPerSector`
  dial both erased terrain from the growth engine and contaminated the
  2026-07-10 growth sweep. Owed: a dedicated grilling session producing
  the two lists — (1) "human-verify-only" items (stay out of L2) vs
  (2) "document-specified but currently simplified in L2" items (each an
  L2 fidelity debt with its own row/owner). Until that audit, treat any
  L2 conclusion that leans on a simplified mechanic as L1-grade for that
  mechanic (test-trust ladder, match-arc TEST-LADDER.md).
  **War-model half PAID 2026-07-13** (R14 four-survey synthesis →
  `docs/features/war-model-build/REQUIREMENTS.md`): list (2) "document-specified
  but simplified in L2" is enumerated for the war model — per-front uniform
  defense (sealed = per-sector 4-layer), non-atomic siege conveyor (contradicts
  ADR 0026), static declare gate + bot stall-exit — each a fidelity gap vs a
  sealed doc; ADR 0037 decides to build the sealed model rather than abstract
  it. The general two-list audit for NON-war subsystems remains owed.

- [ ] **Unsealed surge/economy 가안 — post-measurement reconsideration**
  (registered 2026-07-11, user ruling [conversation 2026-07-10]: keep 가안,
  re-examine only after an L2 measurement makes them bite). Four dials:
  `warMult 2` / `fullMult 12` (surge-curve multipliers — currently provably
  inert: treasury runs surplus all match, blinds autopsy 2026-07-07),
  surge SIZE exchange rate `+1%p/point` (axis unmodeled — commit economy,
  see the L2 fidelity-boundary grill row), `treasuryStartTurns 3`.
  Trigger to reopen: any measurement where the price curve or treasury
  actually binds (an economy-tightening pass, or commit-economy modeling).
  Do not tune before then — unverifiable numbers are decoration, not
  control. Owner: magnitude session. *(Checked 2026-07-11: the
  occupation-geography v2 seal run did not bind them — reopen trigger not
  hit; row unchanged.)*

- [ ] **battery.js growth probes reference retired dials** (registered
  2026-07-11, occupation-geography stage-① doc-sync). The
  `mockup/combat-calc/battery.js` WORLD-2/A-3 growth probes reference the
  dials retired by ADR 0032 (realm accumulator / flat capPerSector) —
  silent no-ops if re-run. Historical L1 rig; cleanup owed whenever
  battery.js is next touched.

- [ ] **Doc-governance promotion chain** (registered 2026-07-10, doc-audit
  session; sealed package, cold-review rider — gates must be owned rows, not
  a deferred-forever plan): (a) ~~P1 lint prototype~~ — **BUILT 2026-07-10**
  (TDD, 29 tests; `scripts/audit-lint.js`, `npm run lint:docs`; acceptance
  run on the live repo: 5 findings, all legitimate reports — 1 uncontrolled
  status word `candidate` @ Strike at half-crossing, 3 borderline numeric
  restatements for human ruling, 1 ledger-currency watch). (b) ~~/doc-audit
  skill codification~~ — **DONE 2026-07-10** (`.claude/skills/doc-audit/
  SKILL.md`, registered in doc-registry.json): codifies the S8 escalation
  ladder (Layer 0 `npm run lint:docs` script → Layer 1 targeted judgment
  or full HARVEST.md re-harvest, with the run-#2 cross-check-all-surfaces
  lesson folded in as an explicit step → Layer 2 git/claude-mem history)
  and ritual duty 7. Findings stay reports-only (S13) — no auto-rename/
  auto-register.
  (c) ~~hook promotion~~ — **DONE 2026-07-10** (`.claude/settings.json`,
  `scripts/hooks/write-lint.js` + `alias-inject.js`, `tests/hooks.test.js`
  15 tests, both hooks live-fire-tested via sentinel proof, not just piped):
  PostToolUse write-lint runs `npm run lint:docs` after Write/Edit on a
  governed doc path and injects findings as additionalContext, never
  blocking. UserPromptSubmit alias-inject flags an exact registered
  alias/구칭 match and injects a canonical-name note, also never blocking.
  Constraint resolutions: (a) exploration-exemption — both hooks are
  advisory-only, the fire/ignore judgment stays with the agent, never
  encoded as hook logic; (b) birthplace-구칭 exclusion — already satisfied
  structurally (checkHeaderDiff only scans DOMAIN_MAP+GLOSSARY, never
  docs/adr/* or RULINGS.md, so a correctly-historical old name never trips
  a finding) — no new code needed; (c) common-word scoping — exact,
  word-boundary matching only against the registered alias list (MIN_LEN
  guard + reuses `normalizeName` from audit-lint.js), verified "gold"
  never fires since it isn't a registered alias.
  (d) ~~audit run #2~~ — **DONE 2026-07-10**
  (`docs/audits/2026-07-10-audit-run-2.md`): baselines regenerated
  (222→221 terms, 107→118 registry rows), 1 genuine ruling-statement row
  dropped (2 of run #1's 3 "undetermined" rows were misclassified — they
  are real DOMAIN_MAP Tier-0 terms, restored with verdict null; the
  self-correction is recorded in the report), map-lore exemption narrowed
  to Ring-B-judging-only (not an inventory drop) with `HARVEST.md` amended
  to say so, 7 missing province-archetype-region aliases added, extended
  Ring A sweep of RULINGS/model docs/QUICKREF found no ghost-term drift,
  doc-registry reconciled (+11 rows for files created since run #1). Lint
  clean, suite 207/207. This session's edits are themselves the natural
  session-close `lint:docs` run gate (b)/(c) were waiting on.
  (e) smaller residues: ~~gold→treasury prose leak (SPEC:264)~~ — **fixed
  2026-07-10**, rewritten to "treasury yield"; ADR 0013:33 checked and is a
  false positive (`gold` names a map-legend color, not the resource — no
  change). Remaining residues: code-identifier drift actionCapacity↔
  `capacity`, computeProvinceStatus↔`classifyHex` (fold into the owed
  js/situation.js rework); `Estimate band` weak birthplace now homed at fog
  GLOSSARY (created 2026-07-10).

- [ ] **A-3 magnitude pass must ingest the L2 freeze evidence**
  (registered 2026-07-07, sheet-15 session): cap-growth-alone does not
  unfreeze the parity map (22→24% decided; on the asymmetric fixture
  it had looked sufficient) — the "national cap growth = ending
  mechanism" numbers (ruling ⑮, deferred to A-3) must be cut against
  the frozen-world autopsy in `mockup/combat-calc/NOTES.md`
  (2026-07-07 entry), alongside the blinds design outcome.

- [ ] **Term lifecycle beyond promotion** (Codex P1): define
  proposed → agreed → promoted → renamed → deprecated states in the
  Vocabulary Law; renames are the dangerous case for agents. Add an
  alias field (Korean casual phrases, code identifiers) to glossary
  schema (Codex P2).
- [ ] **Model-doc naming unification + promotion ladders to root**
  (registered 2026-07-05, A-4 B1 discussion): the bespoke per-feature
  model-doc names (MAGNITUDE / FORMULA / MATCHUP / CATALOG /
  STRATEGY-SPACE) are one function ("model/dials doc") under five
  names — a latent proliferation cost. Decide a disciplined convention,
  then give the model layer an explicit birthplace→root promotion
  ladder (model docs → DESIGN) symmetric with GLOSSARY→DOMAIN_MAP and
  RULINGS→ADR, so all three Production tiers connect to root the same
  way. NOT A-4 B1 scope; a deliberate separate pass (user-flagged).

- [ ] **DOMAIN_MAP `diplomacy` residue — 1v1 cleanup** (registered 2026-07-25,
  SPEC-amendment grill). The grill struck `diplomacy` from the SPEC Goal/Promise
  top-line combine-input list (a two-realm duel has no third party; the
  opponent-read is Principle #2). `DOMAIN_MAP.md` still lists `diplomacy` as a
  derivation input for `Province status` (~line 117) and `Border sector` (~144),
  and as a deferred `Action capacity` (~289). Verified **not a normative
  divergence** (in a duel the diplomatic state is a constant — at war with the
  one enemy; the Action-capacity mention is Phase-2-deferred, consistent with the
  now-parked Phase 2). Low priority. Pay by folding into the next DOMAIN_MAP
  doc-sync pass: drop `diplomacy` from the reading-model derivation lists, or note
  it collapses to the single-opponent war relationship in the duel.

## Deferred (user-decided 2026-07-06, A-4 B6 — revisit on trigger)

- [ ] **Working-layer sublabels** (Codex P2): distinguish staging
  verdicts / generated digests / planning scratch / risk register
  inside the Working layer. **User deferred: no misfiling observed —
  revisit if it occurs (emergence-limit).**

- [ ] **The map cannot express terrain inside a sector, and that is what makes a
  frontage cap inert** (registered 2026-07-31 by the geography-battle grill, at the
  user's instruction). What the map *cannot* express is terrain **variation inside**
  a sector; hard barriers already exist and work — Taishan's 4 hexes plus 52
  `rangeHexes`, **56 hexes belonging to no sector at all**, so they are not nodes of
  the movement graph and carry no adjacency (TC-⑩, and impassability by construction
  rather than by multiplier). Every one of the 56 sectors is terrain-**uniform**,
  which is exactly why TC-⑮'s binding needed no re-authoring.
  **Why it matters, measured:** sectors average **5.2 hexes** against march speed
  **3**, so routing around a door costs **0 extra turns on 20 of 20 land doors** and
  ≤2 extra fatigue (straits alone cost 2–3 turns). Any frontage cap is therefore
  removable for free, and D9's `Removability` obligation is satisfied in the letter
  and voided in the economy. Depth in the map is one of the two ways that changes;
  R14 interception is the other.
  **Owed:** intra-sector features (rivers, ravines, ridges) need per-hex or
  per-boundary authoring, and **TC-⑪ froze the grid resolution** — this is seed
  re-authoring tier, kind 3. Consumed by `.scratch/operational-manoeuvre/`; the
  directional-terrain idea (river current) has its seat reserved by ADR 0046 item 3's
  hex-arc contract.

- [x] **06d's register succession had a hole its own checklist hid — RULED 2026-07-31**
  (registered and ruled the same day; found by the user asking why the register is held
  per *province*).
  Ticket 06d rules that R17's proportional formula is "**superseded rather than
  implemented**, because per-province accounting makes it exact: a captured province
  carries its own register to the taker". But **provinces are not captured — sectors
  are** (`Realm.sectors: SectorId[]`), and a province split across the front line is
  the normal case. Measured: 관중 carries pop **0.5 and 0.97** in one province, so a
  partial capture cannot carry "its own register" without a within-province
  apportionment — which is what R17 was for. MT-② also *derives* the register from
  `Σ populationValue`, a **sector** field, while storing it per province (R18 iii).
  WM-⑤'s register return lands at a sector too, so it shares the answer.
  **RULED: the register moves to sector grain.** MT-② carries the amendment at its
  birthplace (match-arc `RULINGS.md`), R18 iii's grain clause is amended with its other
  content standing, and R17's proportional formula is superseded *for real* — at sector
  grain a captured sector carries its own register and succession needs no formula.
  Ticket 06d returns to `ready-for-agent` (still blocked by 06e) and its two register
  checkboxes are rewritten. Residual test owed there, not here: a bled-dry sector must
  carry few bodies, so it cannot resurrect the dead as its taker's draftees.

- [ ] **Rout survivors all leave service, and that is scope rather than judgement**
  (registered 2026-07-31 alongside WM-⑤). The user's judgement is that *some* routed
  survivors should stay soldiers, at a lower fraction — but a fraction needs a
  **destination**, and every candidate is an undesigned system: the capital guard
  (its magnitude and register backing are now ruled — Part 2 #10 and #16, CP-⑤ and
  CP-⑥ — but the guard itself is unbuilt until ticket 07 lands) or a garrison that can
  retreat (the mobile-garrison system 06b/06c refused). **Morale is not available as the basis** —
  R13 (2026-07-26, the user's own ruling) parks it with "do not implement a morale
  term in the 06 family". **Owed:** the fraction, once a destination lands. The
  capital guard landing is the trigger that wakes this row.

- [ ] **ADR 0044 has no reader in `game/src`, and two code comments contradict it**
  (registered 2026-07-31; the comments are fixed in the same batch, the *pattern* is
  what this row keeps). `git grep` finds **zero** citations of ADR 0044 under
  `game/src` (0045 is cited once, in `force.ts`), while `economy.ts`'s `holdsOf` said
  there is "no seal saying whether one is needed" and `state.ts`'s `homeland` called
  conversion "an open question owned by the ticket that first takes a sector". Both
  landed in `c44c98a`, **hours before ADR 0044 landed in `1593c32`** — same day,
  comment first, and nobody returned. Tickets 06d and 06e are the ones that read
  them, and this session argued a ruling from the stale reading before catching it.
  This is the failure `AGENTS.md` § Read Order names outright ("a decision recorded
  here and never cited is how the project has actually gone wrong before", ADR 0041
  § Context). **Owed:** nothing mechanical is proposed — the row exists so the
  same-day ordering that made it invisible is on the record. A code-comment-versus-ADR
  cross-check is a candidate `audit-lint` check if it recurs.

- [ ] **The operational-manoeuvre pass and ticket 13 each wait for the other**
  (registered 2026-07-31). The pass's `README.md` § Ordering step 3 fires its design
  gates only **after ticket 13's match report**; step 3's own § junction layer 2 —
  and the `Blocked by` lines this session added to tickets 10 and 11 — put **10 and
  11 downstream of the pass**. The build's dependency chain is strictly linear through
  **09 → 10 → 11 → 12 → 13**, so the two compose into a closed loop: the pass waits
  for 13, 13 waits for 11, 11 waits for the pass. Waiting does not open it.
  Classified a **`Seal conflict`** by the build runbook's own four-kind taxonomy
  ("two or more sealed statements that cannot both be implemented → **User.** Stop at
  the seam"). It went unseen because the linear chain was written at the ticket re-cut
  (2026-07-25) and the ordering steps at the pass's opening (2026-07-31), in different
  files, with no session holding both. **Owed: a user ruling**, not a mechanism. The
  tracker's § Ordering carries the three candidate shapes (split the pass · run 13
  with the four plans absent · fire the gates on ticket 07's match instead), recorded
  unranked. Until it is ruled, the pass's step 2 ("no design") still governs.

  **A fact the row could not carry when it was written, noted 2026-08-02
  (doc-audit Layer 1).** The third candidate — *fire the gates on ticket 07's
  match instead* — was speculative on 2026-07-31 because **07 had not merged**. It
  merged 2026-08-01 (`15877c1`), and a match now runs from setup to a capital
  fall, cross-host, with `capital-fall.spec.js` driving it. So that candidate's
  precondition **now exists**, where the other two still describe work. This
  changes what is *available*, not what is *chosen*: the three stay **unranked**
  and the ruling stays the user's. Note also that the row's premise "the chain is
  strictly linear through 09 → 10 → 11 → 12 → 13" is under review — the same audit
  session read the tickets as two branches (`08→09` and `10→11`) merging at 12 —
  but the deadlock survives either reading, since the pass gates 10 and 11 under
  both.
  **Deferred by user ruling the same day, with a trigger: rule it when ticket 09
  lands** — 09 is the last ticket before the loop binds, and by then the ruling is
  made against a running game rather than three paper shapes. The row stays open
  until then, and a session that lands 09 raises it as the next order of business.

## Paid

- [x] 2026-08-05 — **판세 in-play surface — two sealed positions conflict: PAID**
  (registered 2026-07-25). Ruled by user grill and recorded as **ADR 0053**:
  there is **no in-play 판세 meter** (Gate 6 fork A holds), and what rests in the
  top strip is **coverage** — how much of the opponent's ground this viewer has
  observed — from which the evidence contrast of fog `RULINGS.md` ④ decision 6 is
  summoned. This row's own 2026-08-03 note was right that ④ *"may dissolve rather
  than decide"* the conflict, and that is what happened: the two seals were never
  describing the same object, because an evidence surface is not a verdict
  surface. Gate 07 § Sealed 2 is stamped, and so is fog `RULINGS.md` ②, which
  restated the retired encoding in a form that reads as normative. The paired
  `DECISIONS-OWED.md` Part 2 #13 closed in the same batch, and build ticket 04 —
  which this row had left instructed to treat the surface as blocked — moved to
  `open`. **The treasury half did not close with it** and is now its own row in
  § Open above: C03.6 routed treasury uncertainty through a 판세 band width, and
  there is no 판세 band. 0053 declined to choose between the two available
  readings, which is why that half is registered rather than quietly resolved.

- [x] 2026-08-05 — **Tickets 04 and 09 describe work whose code is already on
  `main` — the scoping half PAID** (registered 2026-08-04). Ruled by user grill:
  ticket 04 **merges**. Neither horn of the recorded question was right, and the
  measurement is why — **neither file is a superset of the other.**
  `DemoShell.tsx` carries the sealed commit-first flow and the LEFT/RIGHT bands
  and none of recruitment (0 references against `App.tsx`'s 34), division, merge,
  garrisons, the battle card, or forced march as a choice; `App.tsx` carries all
  of those, none of the flow, and declares itself a probe in three places —
  `TurnStrip` says outright that it *"is meant to be deleted."* Adopting either
  as-is would have silently dropped the other half. So 04 builds one shell from
  `DemoShell.tsx`'s flow with `App.tsx`'s mechanical surface brought into it, and
  closes the second Vite entry; two duties ride with the ruling (a seam audit as
  the **first** act, asking whether tickets 09–13 can plug into this shape rather
  than whether the code is good; and correcting the three self-declaring comments
  that become false on adoption). Ticket 09 follows, inheriting `eval-r.ts`.
  Recorded at the birthplaces: ticket 04 § body and acceptance list, ticket 09 §
  body, and **ADR 0052** for the design decisions the grill reached on the way —
  those are not this row's and are not restated here. The structural half (b)
  left with `.scratch/doc-structure/issues/15-code-to-doc-derivation.md` on
  2026-08-04, as this row's own deletion condition said it would; **ticket 15 is
  still open and takeable.**

- [x] 2026-08-03 — **What does a testimony attach to — a sector, or a force? PAID**
  (registered 2026-08-03, same day). Ruled by user grill: **neither reading alone —
  the subject is set by whether it can move.** Field-army substance and fatigue
  attach to the force; garrison substance, 동원 강도 and civilian register attach to
  the sector; 판세 to the realm. The recorded either/or was a false dilemma, and the
  groundwork pass that raised it had both horns right about *different observables*:
  its sector-attached failure (lower edge to zero after one turn) is entirely the
  march-out channel, which a sector's population does not have, since a serving body
  keeps its sector origin wherever it stands (ADR 0047). The grill added the finding
  neither side had: **force-attachment with no coherence rule is unsafe**, because
  division is free — no commit, no fatigue, no per-turn cap, gated only by the commit
  lock — so a testimony surviving an unseen division either stops containing the
  truth or needs a decline channel that reaches zero every turn. Identity is
  therefore granted only under **unbroken contact**, and re-acquisition after a gap
  is a new contact the Runtime never joins to the old one, which is also what turns
  an opponent's division from an intelligence laundry into a deception play.
  Homes: `docs/features/fog-of-war-discovery/RULINGS.md` **④** (seven decisions with
  their reasons) · that feature's `MAGNITUDE.md` FG-M① § Consequence — the reporting
  spread (the one derived value) · **ADR 0050** (cross-feature; amends ADR 0048
  twice) · `GLOSSARY.md` rows `Testimony subject` and `Unbroken contact`. Ticket 08
  left `needs-info` in the same batch. Three riders this ruling created are open
  above: the verification-inputs rule, the garrison-mobility coupling, and the
  missing adjacency grade.

- [x] 2026-07-28 — **The single-definition rule was never swept for in
  `DOMAIN_MAP.md` — PAID** (registered 2026-07-26, audit run #3). Run #3 found 19
  entries over the 25% 5-word-shingle threshold against their birthplace row, 15
  with no pointer back, and reported rather than repaired because the summary
  wording is real judgment. Paid by enforcement-ladder stage 4: **all 56 promoted
  entries re-cut to summary + pointer + why-it-is-canon**, not just the detected
  19 — the 19 were the subset check 9 could see, and an entry below the shingle
  threshold can still be a divergent second definition, which is worse.
  `RESTATEMENT_GRANDFATHERED` is now **empty**, which was the stated acceptance
  test; `tests/audit-lint.test.js` pins empty as the invariant, so a future name
  added back fails a test rather than passing quietly. Five entries needed a
  second pass — they had kept the birthplace's phrasing, check 9 caught each, and
  they were rephrased rather than exempted. Every ``- ✅ `Term` `` header was
  retained (ruling 03 Q3 derives promotion from it; `checkHeaderDiff` scans it):
  117 headers before, 117 after, 61 native / 56 promoted unchanged.
  **Two divergences the re-cut surfaced, both now closed:** combat-formula's
  `Standing rules` birthplace row still carried the staged starvation severity
  (holding→attack-incapable→defenseless, stage 2 as an availability gate) that
  war-model slice-2 §2 superseded, plus garrison regeneration that ADR 0045
  retired — the 2026-07-15 row below corrected DOMAIN_MAP and never reached the
  birthplace, so cutting the Tier-0 entry to a pointer would have pointed at
  superseded text; and match-arc `모병` now cites ADR 0045 for the
  garrison-replenishment clause it already described. **The lesson worth keeping:
  a restatement cannot be safely cut until the birthplace is verified to hold the
  current truth — sometimes the copy is the fresher one.**

- [x] 2026-07-15 — **§2 recovery model — ground/ash gate note — PAID**
  (registered same day, slice-2 ticket 06 board verbs + emergent siege). The
  §2 sync note is written: the design spec §2 recovery paragraph now records
  recovery = supply × ground-recovery factor (ash = 0, `fatigue.turnUpkeep`'s
  recoveryFactor), and DOMAIN_MAP `Standing rules` was corrected from the
  superseded staged-starvation model (holding→attack-incapable→defenseless) to
  the sealed continuous supply-ledger pump. The two-ledger firewall is
  preserved (ground gates wear/recovery ONLY, never substance). Residual:
  ash-recovery grading (binary 0 today → partial-burn curve) folds into the
  §12 magnitude dial sheet — a dial candidate, not a doc debt.

- [x] 2026-07-15 — **`npm run docs:check` lint (Codex P2) — SUPERSEDED
  by audit-lint** (was Deferred 2026-07-06, A-4 B6). Not re-proposed —
  closed. All three grep-level checks it proposed now ship in
  `scripts/audit-lint.js` (landed 2026-07-10, `npm run lint:docs`,
  hook-wired) under other names, verified against the code: "amended
  references without ADR stamp" → `checkAdrStampDuty` (check 8);
  "quickref older than newest seal date" → `checkFreshness` (check 6);
  "duplicate term headers" → `duplicate-canonical` in
  `checkBaselineSelf` (check 7). One honesty note on the third:
  `docs:check` framed it as a grep over doc surfaces, while
  `duplicate-canonical` catches a canonical registered twice in the
  `term-inventory.json` baseline (law → registry → lint, S11) — same
  intent, different mechanism, so the supersession holds. The other A-4
  B6 Codex P2 — Working-layer sublabels — stays Deferred above.
  (doc-structure map, ticket 05.)
- [x] 2026-07-14 — **SPEC B2 amendment — PAID** (user approved same day).
  "A war is decided when the loser's capacity or will to resist breaks"
  composite applied at SPEC:147 with the ADR 0038 pointer; registered and
  paid within the slice-2 batch.

- [x] 2026-07-13 — **Decisive-battle spine vocabulary seal — PAID**
  (registered 2026-07-13, deferred until the slice was built & sealed).
  Slice 1 sealed at war-model-build `RULINGS.md` WM-① (same-session
  doc-sync batch, this commit): 방패 깨기 / 결전 ❓PROPOSED→AGREED,
  캐스케이드→연쇄 붕괴 rename (구칭 alias), 야전군 registered AGREED —
  birthplace match-arc GLOSSARY + term-inventory patch + QUICKREF
  regeneration.
- [x] 2026-07-12 — **Rebellion-body grill branch — PAID** (registered
  2026-07-11, CE-⑫ rider). The pass ran 2026-07-11/12 night and sealed
  the full body: suppression resolution (CE-⑬), rebellion five points
  (CE-⑭), seceded-sector behavior (CE-⑮), gate-5 terrain resonance
  resolved by structure (CE-⑯), peaceful-cession scar dissolved as a
  corollary (CE-⑰) — plus the unplanned canonization the grill forced:
  truce lock (CE-⑱), white peace as the ladder's 0% rung (CE-⑲), and
  the total-war stage-table shape (CE-⑳). ADR 0036; SPEC_GAPS ⑤/⑦
  stamped RESOLVED. Same-session doc-sync batch (this commit).
- [x] 2026-07-11 — **Crisis-ending SPEC amendment — user-sealed and
  applied** (registered under ADR 0034, drafted by the crisis-ending
  pass as `SPEC-AMENDMENT-DRAFT-crisis-ending.md`). User decision
  2026-07-11 (verbatim seal): the match-end declaration (decision point
  / crisis arc 25→35 / Westphalian draw <0.1%, no judged scorecard)
  applied to `SPEC.md` § "How a match ends (crisis arc)". Draft file
  restamped SEALED (drafting record); ADR 0035 Consequences updated.
- [x] 2026-07-11 — **Record-world harness default flip** (registered
  2026-07-11, AB-②) — `tournament.js` HARNESS.capLandFrac 0→1;
  `map-board.js` factory + cradle-tournament default gaan →
  FG_BOARD_GAAN (BOARD_GAAN survives as the explicit control world).
  Test adjudication (TDD, no silent updates): new AB-② seal-pin test;
  FG "default stays uniform walls" pin inverted; map-board fortAt pin
  re-cut to the FG crossing-class mapping; occ-geo frac-0 control tests
  given explicit `capLandFrac: 0`; tournament-board finalCheck pin
  corrected to the actual trip gate `(leadership || dominance) &&
  unassailable` (the old `leadership && unassailable` assertion was a
  world-specific accident — the record world trips seed 7 through the
  dominance arm). 248/248 green. Verified: a pure-default run (reps 20,
  seed 42) byte-reproduces the sealed [frac1] fgM9on baseline row
  (decided 67.8 · dd 98 · afford 20.4 · median 22 · stomp 2.2).
- [x] 2026-07-11 — **freeze-autopsy.js hand-rolled checkView replica**
  (registered 2026-07-11) — replica deleted, real `tournament.js`
  checkView export imported; script smoke-run verified (--quick).
- [x] 2026-07-11 — **Occupation-geography pass — deferred doc-sync batch —
  PAID** (stage-① doc-sync batch). Stage ① landed on main
  (2a9d8f3..9a64561, 238/238) and the v2 seal run measured; this batch
  paid: (1) match-arc RULINGS **OG-①…⑤** (occupation model, transfer
  channels + R2 conservation, interior redefinition R1, per-sector
  ripening migration + accumulator supersession, measured `capLandFrac`
  read — **0 sealed as the world of record**, L2) + **ADR 0032**
  (cross-feature model record); (2) **ADR 0029 sealed AS DRAFTED** (user,
  2026-07-11) + ADR 0022 header stamp + the DOMAIN_MAP/GLOSSARY
  Settlement-line reword; (3) SPEC Core Design Principle **#9** promotion
  (user-approved 2026-07-11, wording = design spec §2, carried by ADR
  0032); (4) match-arc INDEX refresh + QUICKREF regen + term-inventory
  patches (+9 rows). What remains OPEN (tracked at its home, not this
  row): **dominance-gate recalibration grill** (data ready — wall
  re-erection + fgM9on absorption, match-arc INDEX open q.1); **capital
  stage ②** (`docs/features/capital/`, untouched); item (5)
  development-lever reconsideration — folded into that future
  gate/§5-tuning session. Original registration 2026-07-11,
  occupation-geography design session.
- [x] 2026-07-10 — **Force-geography pass — the next spine — PAID** (lint
  run #1 flagged this row as overtaken; verified): (a) harness = FG-①…⑩
  landed on main @0e8dc52 with terrain-bound defense + reactive reserve;
  (b) the "may need a large ADR" question = ADR 0031 (backfilled
  2026-07-10) + the hegemony-bar answer measured via DT-③/fgM9off.
  Live residuals continue in their own rows (§5 tuning watch-item, DT-①
  envelope target). Original row kept below for history:
  (registered 2026-07-08,
  match-tilting close; source RULINGS MT-⑤ + `mockup/combat-calc/NOTES.md`
  §L2 fidelity audit). L2 diagnosed the frozen world as NON-economic; the
  next design pass is force-geography. Two things owed there, not now:
  (a) **harness**: replace uniform `startFort: 'walls'` (an artifact — map
  carries `fortTier: none`, hex terrain plains/hills/mtn/pass unused) with
  terrain-bound defense strength, both start placement AND in-match fort-
  build rules, so L2 measures the real terrain (user direction 2026-07-08);
  (b) **design**: the ~80% structural residual = the hegemony-bar / offense-
  defense-balance question — is leadership reachable among balanced realms
  on a parity map? May need a large ADR. Grill-worthy, fresh session.
  **UPDATE 2026-07-08 (terrain-fidelity session)** — the pass split. The
  fort sweep found fort strength is NOT the freeze lever (all-none 20% vs
  all-walls 10.2%; ceiling ~20%, 80% structural holds); force-geography-
  fort-by-class is therefore a *balance* lever (dormant opt-in
  `gaan.startFortByClass`), not the fidelity fix. The real fidelity fix
  (approved + **wired** this session): **combat terrain = border INTENT
  class** — open→plains, forest→forest, hills→hills, pass→pass(2.0),
  river→water riverOpposed 0.70, strait→water straitOpposed 0.55 + door
  choke (`combatFromBorderClass` in tournament.js; `frontClass`/`frontDoor`
  weakest-link in map-board.js; +5 tests, 116 green). Values sealed
  (terrain M5/D6, water ADR-0015 + ruling ⑦); binding is the approved
  decision. Also fixed: strait grammar now fires on the class (was hermit-
  gated → dead on cradle); `engine.js` straitOpposed comment synced
  (candidate→confirmed). Freeze re-measured on the un-flattened map ~12.6%
  decided, leadShortfall ~4600 — verdict holds. **Doc-sync PAID 2026-07-08
  (terrain-fidelity session, this integration batch)**: (i) border-class→
  combat seal recorded — RULINGS **TC-⑬** + terrain-cradle GLOSSARY row
  (values cite M5/ADR-0015, not restated); (ii) QUICKREF — item ② already
  regenerated it this day, so this batch adds only the TC-⑬ line + two
  C-loop rows + header addendum (no double-regen); (iii) NOTES gained the
  residual-freeze autopsy entry (`freeze-autopsy.js` committed alongside).
  **Design reframe RESOLVED 2026-07-08**: the tactical plan-AI suspect was
  built + battered (item ②, commits 7508b3a/162c158) and absorbed only
  **+0.8pp** (12.6→13.4%) — the freeze is NOT a bot artifact. The residual
  autopsy (this session) pins item (b) as the **hegemony ADR**: the
  leadership gate (own projection ≥ 1.7× the max live rival's shield) acts
  like last-man-standing — consolidation plateaus ~1.28, elim ~0, so the
  board freezes at parity. Terrain and tactics are both excluded by
  measurement. **Next = hegemony ADR grill** (SPEC-level victory condition
  — user-gated); knobs: shieldRatio, leadership shape, anti-snowball
  exposure-inheritance, consolidation strength. This force-geography Open
  item can close once that grill opens its own thread.
  **UPDATE 2026-07-08 (hegemony grill opened this thread).** The grill ran:
  (1) built the **ending-taxonomy panel** to classify the freeze bar-
  independently — sealed **ET-①** (match-arc RULINGS), committed `c082247` +
  doc-sync `926e1a9`. First finding: the ~87% timeout is ~56% standoff /
  **~28% denied-dominant** (dominant realms the check missed — statistically
  "hegemons the gate missed") / ~11% hegemon, plus a **crown inversion**
  (center pinned to standoffs, flanks dominate — evidence bearing on TC-②,
  not a rewrite). (2) Decomposed the fix into a **three-concept sequence**,
  user-sequenced: **(b) force-geography** (make defense uneven — IN DESIGN,
  see `.context/handoff-2026-07-08-force-geography-design.md`; skeleton
  approved: redistribution-not-growth "이불 한 장" principle, 5 units, U3+U5
  settled, U1/U2/U4 pending) → **(a) offense-dominance gate** (reshape
  leadership: `proj ≥ R×meanProj`; user's raw `proj≥1.7×meanShield` trips 0%
  = cross-axis magnitude bug; corrected R=2.0 → ~39% decided/79% wall fixed/
  7% leakage; SPEC-level, user-gated) → **(c) risk-gate + offense buff**
  (reward the risk-taker not the free-rider; needs blood to flow). **(a) and
  (c) are DEBT — each its own brainstorm→spec cycle, after (b).** Force-
  geography (b)'s harness item (this Open row's item a) is now the active
  design; it stays Open until (b) ships.
  **UPDATE 2026-07-09 (force-geography (b) design grill — v1 SEALED).**
  The (b) design ran the brainstorming flow; v1 **(최소)** design sealed in
  the new feature birthplace `docs/features/force-geography/` (INDEX +
  RULINGS **FG-①…⑨**). Key seals: **U1** = adopt the measured fort-by-class
  mapping (FG-②, L2 +33% — the "ceiling vs cost" question was re-litigation
  of an already-measured, dormant mapping); weak fronts come from
  **scarcity + value, NOT a defensibility-concentration policy** (FG-③,
  corrects the skeleton — a rational defender equalizes defense *power*,
  more bodies on weak terrain; and the bot RE-EQUALIZES, so differentiation
  alone is not durable, scarcity is); the **reactive mobile reserve is
  in-scope** (FG-④ — passive-defender measurement can only falsify not
  confirm, and that falsifier is exhausted) — reactive, first-blow vs raw
  defense, sealed **M9** wired into the (passive-today) defender,
  destination `deficit × value` reusing ADR 0019 (G8), whole-realm value
  for v1 with per-front (a) deferred (FG-⑤/⑥); attacker info = the sealed
  fog **estimate-range band** (derived, not chosen), band-weighting OPEN →
  U4 (FG-⑦); **commit-scarcity kept OFF** (FG-⑧, dormant `siege 8/field 14`
  = a third latent scarcity axis, off for scope); **sequencing** v1=(최소) /
  (정교) static standing-redistribution = deferred delta detailed after
  (최소) L2 data, measure minimal→sophisticated (FG-⑨). U3/U5 settled.
  **UPDATE 2026-07-09 (design continued — v1 DESIGN COMPLETE).** The
  session ran on and closed the last forks: **U4 SEALED FG-⑦** (band-
  weighting reuses the sealed disposition dial TP②, no new dial; pickTarget
  scores facing-front first-blow defense = judged garrison(λ) × public
  terrain × public fort); **reserve mass SEALED FG-⑩** = field-army
  operational counter + M9 tactical fill (BOTH, M9 swept — field-army-only
  rejected as a tactical-scale strawman per ladder rule 4). Design of v1
  (최소) is now COMPLETE (FG-①…⑩). **STILL OPEN**: (정교) standing-
  redistribution detail (after (최소) L2 data), plan-time scoping (M9
  abstraction cost — board has no sector routing; field-army late-arrival
  effectiveness), then the harness build. Next = **writing-plans**.
  (a)/(c) remain DEBT. Row stays Open until (b) ships.
  **UPDATE 2026-07-09 (v1 (최소) L2 HARNESS LANDED — SDD, main @ 0e8dc52).**
  Plan `docs/superpowers/plans/2026-07-09-force-geography-minimal.md`
  executed via subagent-driven-development: 7 TDD tasks + 2 review-fix
  waves + housekeeping, 159/159, whole-branch review (opus) = merge-ready,
  fast-forwarded to main. FG-①…⑩ wired opt-in (`FG_BOARD_GAAN`); engine/
  `DIALS`/`BOARD_GAAN` untouched, non-FG behavior byte-identical. Outcome +
  metric amendment recorded at the birthplace: `docs/features/force-
  geography/RULINGS.md` "L2 implementation + metric amendment".
  **STILL OWED (keeps this row Open):** (i) **high-reps measurement run**
  (the `--fg` sweep was smoke-tested at reps=2 only — plumbing, not a
  reading); headline read = **decided% + bucket deltas** across ctrl/
  fgM9on/fgM9off (within-realm variance + boostedShieldShare demoted to
  descriptive — they conflate garrison/terrain with the fort tier, user
  ruling 2026-07-09). (ii) **Projection sync** — DOMAIN_MAP/DESIGN summary
  entries for force-geography, owed when (b) is read as shipped. (iii)
  **note the non-FG battery baseline shift**: Task 4 changed field-army
  selection (biggest-field → biggest-**deficit**) UNCONDITIONALLY (intended
  per FG-⑥), so the existing plan-AI battery on `BOARD_GAAN` is no longer
  directly comparable to pre-branch numbers — record in the DOMAIN_MAP/
  DESIGN sync so the shift isn't misread as noise.
- [x] 2026-07-09 — **§6 domination victory — SPEC.md Direction amendment**
  — the win-type declaration owed by DT-③'s implementation landing, written
  to `SPEC.md` (new paragraph after the "Resolved (match-arc pass,
  2026-07-04)" block, principle #5 anchor): a summary + pointer to match-arc
  `RULINGS.md` DT-③ (birthplace stays authoritative; no arithmetic restated
  in SPEC per the single-definition rule). User-approved wording, 2026-07-09.
- [x] 2026-07-08 — **Ending-taxonomy pass → Production sync (ET-①)** —
  the hegemony grill's measurement-taxonomy design (grill Q1–Q4,
  user-sealed) written to its authoritative homes: match-arc RULINGS
  **ET-①** (the decision record — ruler B bar-independent, 8-metric
  panel, vassals fold full, provisional thresholds, first finding);
  match-arc GLOSSARY **종료 분류** row (definition + pointer to ET-①);
  INDEX refreshed (ending-taxonomy pass block + RULINGS range); QUICKREF
  header addendum + C-loop row (finding as UNSEALED evidence). Instrument
  itself committed c082247 (match.js/tournament.js/plan-battery.js +
  tests, 148 green). No DOMAIN_MAP change — feature-local, birthplace
  stays authoritative (promotes only if a second feature needs it). The
  crown-inversion finding is recorded as **evidence bearing on TC-②**,
  never a rewrite (TC-② is a user seal). Residual: threshold calibration
  + the wall/crown grill are live work, not doc debt.
- [x] 2026-07-07 — **Match-tilting seals → Production sync (birthplace
  batch)** — the session's NOTES-staged seals written to their
  authoritative homes so no session reads stale canon: match-arc
  RULINGS **MT-①…④** (aging constitution / register re-founding /
  Surge Draft Model / start-state coordinates — the decision record);
  match-arc GLOSSARY rows (모병 re-cut, 징집 명부 re-founded, +노화
  헌법 / 동원 강도 / 서지 모병 as new Tier-1 terms); combat-formula
  MAGNITUDE **M13 amended + M13a added** (registerPerPop 1,800,
  capPerPop derived ⅓, Surge Draft Model, f₀0.5/g₀1.0/ρ0.75) +
  **M12 amendment stamp** (garrison regen bills the register);
  DOMAIN_MAP (모병/징집 명부 rows re-cut as summary+pointer + 노화
  헌법 Design-Principle entry); QUICKREF rows re-pointed to birthplace.
  Residual (ADR 0014 stamp, curve numbers, riders) split to the Open
  row above.
- [x] 2026-07-08 — **Recovery-dial + blinds phase → Production sync
  (MT-⑤)** — the recovery-dial/blinds phase reached L2 wire-first and
  reversed the premise (freeze non-economic). Paid this batch: ADR 0027
  written + 0020 stamped + README index (main/surplus = magnitude
  labels, commit-gated force-shaping); match-arc RULINGS **MT-⑤** (full
  L2 record — recovery-gate +3pp, Q1 reversal, Option B inert, fidelity
  audit, freeze decomposed to force-geography + hegemony-bar);
  MAGNITUDE **M12-1 commit-gate amendment stamp**; GLOSSARY 블라인드 row
  SUPERSEDED-as-economic-device; DOMAIN_MAP `Command pool` floating-label
  framing; INDEX refreshed (economy phase closed). Residual (ADR 0014
  stamp, QUICKREF regen) → Open row above; force-geography = next spine
  (Open).
- [x] 2026-07-07 — **SPEC 중원-crown amendment (TC-②) APPLIED,
  user-approved** — SPEC §Match structure re-cut: survivability +
  starting-population parity balanced, geometry/economy asymmetry;
  crown economic only (traffic centrality + long-war stamina, never a
  population edge); center-protagonist stated as measured hypothesis
  with the stable-digestion premium framing. Proposed and approved in
  the 2026-07-07 doc-sync session (propose-never-drift honored).
- [x] 2026-07-07 — **Terrain-cradle → Projection sync (C-loop close
  doc-sync batch)** — DOMAIN_MAP gained a `Terrain Cradle (Authored
  Map)` section (summary + pointer, sync-stamped) promoting void
  terrain / parity start / battle-summoning placement; the Match
  structure parity row re-cut from "mass asymmetry, richer center" to
  parity-v5 wording (TC-①/②) with a supersession note; DESIGN
  §Map Representation Strategy gained the authored-map pipeline
  subsection (map-gen.js determinism, C-loop rhythm, carve principle);
  QUICKREF regenerated (Realm row + 3 promoted-term rows + header
  date). Definitions stay authoritative in
  `docs/features/terrain-cradle/` (single-definition rule). SPEC
  remainder split into its own Open row above.
- [x] 2026-07-06 — **L-level seal-stamp convention ADOPTED (Codex P2,
  A-4 B6)** — the optional validation-level stamp (L0 hand / L1 grid /
  L2 tournament / L3 playtest) codified into
  `DOCUMENTATION-LAW.md` § seal mechanics: seals MAY carry
  an L-stamp; applied going forward, retrofit optional, not a fourth
  mandatory field. The other two Codex P2s were user-deferred at the
  time; since then the `docs:check` lint was superseded by audit-lint
  (see the 2026-07-15 row above), and Working-layer sublabels remain
  deferred.
- [x] 2026-07-06 — **Economy-legibility surface relocated (A-4 B6)** —
  moved from a doc-sync debt to `docs/DISPLAY-DEBT.md` (the display-debt
  register), where the whole UI-read family now parks. Design deferred
  to B's UI work.

- [x] 2026-07-06 — **ADR header normalization sweep (Codex P1, A-4 B5)**
  — amendment-carrying ADR headers normalized to the law's structured
  fields: 0014 (`Amended by: ADR 0022 (2026-07-01)` + delta), 0015
  (self-amendment stamp for the 2026-07-03 magnitude pass), 0018
  (`Amended by: ADR 0020` + delta), 0020 (`Amends: ADR 0018` + delta).
  Status index table added to `docs/adr/README.md` (26 rows) with a
  pointer to the documentation-law supersession protocol; plain-Accepted
  ADRs carry no relationship field (index is their normalization
  surface — anti-noise reading). *ADR 0019 v5 front-sector amendment is
  a SEPARATE decision (a4-plan B5), user-gated — not part of this line.*
- [x] 2026-07-06 — **Sheet-12 spec gaps → canon (A-4 B4)** — the 7 open
  `mockup/combat-calc/tournament.js` §SPEC_GAPS given a canon home:
  disposition record in `docs/features/match-arc/RULINGS.md` §SPEC_GAPS
  disposition routes each to owning feature + B-design phase + harness
  candidate + recommended lean. All seven defer to B (AI-behavior /
  force-allocation / map-topology — playtest- and B-map-shaped; no paper
  rules authored, per the handoff over-authoring warning). GLOSSARY
  queue-8 and combat-formula INDEX Honest Gaps point to it. Indemnity
  spend (the 8th) was already paid by M14 treasury. Gap ③ (attacking a
  vassal) carries an identity choice surfaced to the user; the rest are
  structural/disposition closes.
- [x] 2026-07-05 — **DOMAIN_MAP slimming (Codex P1)** — Match Arc
  section entries (패권 결정점, 투사 가능 질량, 수락 산술, 복속) cut from
  duplicated mini-spec (sealed numbers, riders, dates) to qualitative
  definition + pointer to the feature GLOSSARY/RULINGS, matching the
  Combat Resolution section's existing discipline. Added the 5 missing
  promoted terms (긴급 투입/예비대, 동원 가시성, 항복 수확, 양동 후속타,
  기축통화 원칙). Sync metadata added at SECTION granularity (not
  per-entry — always-load/maintenance economy; flagged for review).
  A-4 batch B2. *Note: exposed a law-wording tension (single-definition
  rule "Tier 0 after promotion" vs DOMAIN_MAP-as-Projection-summary) —
  see A-4 plan law-gap log.*
- [x] 2026-07-05 — **glossary row splitting (Codex P1)** — match-arc
  GLOSSARY rows cut to definition + current value + seal stamp;
  ruling history (⑧–⑰) relocated to `docs/features/match-arc/
  RULINGS.md`. combat-formula GLOSSARY gained a Status column
  (AGREED / 가안 / candidate). A-4 batch B1.
- [x] 2026-07-05 — **seal registry DECIDED (user): no `docs/SEALS.md`**
  — this ledger + dated in-doc seal stamps remain the mechanism.
- [x] 2026-07-05 — law dial-ownership claim corrected (match-arc values
  acknowledged in GLOSSARY seal rows, not MAGNITUDE).
- [x] 2026-07-05 — mechanical seal definition added to the law
  (status word + date + verdict source).
- [x] 2026-07-05 — QUICKREF trust level made honest (agent-curated
  digest, no generator; dated header).
- [x] 2026-07-05 — this ledger created (Codex fix 2).
