# Rulings — Fog of War and Discovery

## ① Wall grade is public information — SEALED 2026-07-08 (user grill, tactical-plan-ai session Q3)

The design spec (2026-07-01, §4) classifies occupant information into
presence / identity / magnitude but never classifies fortification
grade — a genuine gap (verified: zero fort mentions in the spec; no
visibility clause in SPEC.md, DOMAIN_MAP.md, or any ADR).

**Ruling**: fortification grade (fieldworks / walls / fortress /
legendary) is classified with terrain — always visible, at every
confidence level. Physical structures are visible from outside; the
hidden quantity is how many defenders man them, which the magnitude
estimate band already covers.

Rejected alternative: blurring wall grade too ("the fort was harder
than it looked"). Reasons: it makes eligibility/threshold arithmetic
probabilistic (muddying the tactical-plan-ai freeze experiment, whose
design wants all misjudgment concentrated in magnitude), and it
contradicts physical intuition. Revisit candidate as Challenge-fog
flavor only.

First consumer: the L2 bot information model
(`docs/features/tactical-plan-ai/RULINGS.md` ③ — bot sees exactly what
a player sees).

## ② Read-layer presentation contract — SEALED 2026-07-23 (user live eval, L3 Wayfinder gate 07)

Gate 07 (`.scratch/l3-playable-seam/issues/07-prototype-map-fog-presentation.md`
§ Answer) resolved the **presentation** of the sealed 7-grade viewer matrix
(issue 03 §4) by live user reaction on a throwaway turn-loop prototype
(`mockup/combat-calc/turn-loop-prototype.html` — ADR 0041 evidence, not build
source). The validated presentation contract, sealed on the flow/feel axis
(graphics/asset polish held out of scope — the parked presentation pass):

- **Public layer reads at rest** — terrain / control / routes / fortification /
  seats, calm; no whole-board Fog dimming.
- **Own force = exact solid mark; enemy force = a dashed last-seen fix + an
  estimate band whose WIDTH is felt** (no comfortable midpoint — invariant 7
  made visceral). Reach cone grows with staleness. Border alarm = an
  existence+heading pulse only. Hole cards (posture / commit) are categorically
  absent, never a scoutable-looking `?`.
- **Derived-band grade encoding** (the gap map.md flagged as "no encoding
  proposal anywhere"): 판세 = a match-level mini-meter (banded, progress-bar
  banned); 동원 강도 = a sector-bound band summoned on command; civilian
  register = derived. (판세's match-level isolation is the issue 03 §4 formal
  amendment of 2026-07-23.)
- **Recon is a paid, deliberate act,** presented as a live band-narrowing (the
  confidence rung walks up the already-sealed 0.45 → 0.70 → 0.90 ladder) while
  intent (hole cards) stays dark — "I opened my eyes here" is felt without the
  visuals lying that everything is now known.
- **Casual presentation principle (user direction 2026-07-23):** three zones —
  a thin top strip / the map fills the middle (calm) / the commit bar is the
  hero. The info layer (bands, cones, eligible-target glow) is **summoned by the
  commit decision**, not always painted; the read layer lives inside a
  commit-first flow (커밋량 → 행동 → 세부 → 지역 빛남 → 지목). "커밋만 하세요."
- **DEV placeholder announces itself** (hatch + badge), never an enemy-truth
  fallback.

The deception disposition (ticket § Comments, 2026-07-19) holds: the dealer
never lies; deception lives in opponent actions read through honest instruments.
Renderer stays SVG (measurement-gated, ADR 0028); navigation settled to a
coupled continuous camera. This ruling is the fog-presentation **birthplace
tier**; the gate records it as Working evidence and the gate-12 publication
question (where presentation rulings ultimately live) stays open.

### Recon economy — REGISTERED CANDIDATES (가안, NOT sealed)

The crossing session (2026-07-23) designed a recon/fog economy on top of this
presentation. Its STRUCTURE is captured; its NUMBERS are measurement-gated and
**not sealed**. Full record: project memory `terrain-game-recon-fog-economy.md`.

- Recon on a **confidence-ladder axis** (0.45→0.70→0.90) — the ladder is the
  already-sealed intel scale (`js/intel.js`, slice 2); recon walks it up.
- **Instant reconnaissance** = a premium-to-ceiling attack rider (ADOPT WITH
  CONDITIONS, measurement-gated). Facade only in the prototype.
- **Detection (radar, defender) vs measurement (spotlight, attacker)** split;
  defender = a free warning floor (border alarm + threat board) + paid response;
  defensive UI = the attack-UI mirror.
- **Radar / detection pricing = value-driven differential** — numbers deferred
  to the map scale-up pass (the current world is parity-flat).

Promote any of these to a seal (and a GLOSSARY row) only when a dedicated pass
or a playtest settles the numbers — never on this gate.

> **Reason corrected 2026-08-03 (ruling ③), conclusions unchanged.** Ruling ②
> twice calls the 0.45 → 0.70 → 0.90 ladder **"already-sealed"** — once in the
> presentation contract above, once in the candidate list, the second time citing
> *"the already-sealed intel scale (`js/intel.js`, slice 2)"*. **A code constant is
> not a seal.** Under this project's law a seal is a Production-doc row carrying a
> status word, a date, and a verdict source; `SCOUT_GAIN = 0.25` and its
> neighbours carried none of the three and appeared in no Production document at
> all. Ruling ② was therefore resting a sealed presentation on an unsealed
> mechanism, and the candidate list contradicted the contract above it by calling
> the same ladder both sealed and 가안 in one section.
>
> **What stands:** everything ② decided about presentation. Reconnaissance is a
> paid, deliberate act shown as a live band-narrowing while the hole cards stay
> dark; that was sealed on live user reaction and is untouched.
> **What is corrected:** the ladder is not the mechanism behind that narrowing.
> Ruling ③ replaces it — precision is a property of an **observation testimony**,
> graded and priced at `MAGNITUDE.md` FG-M①, and the confidence rung is a readout
> of the result rather than the thing being bought. Read ② for the surface and ③
> for the model.

## ③ The estimate band is a witness record, not a blur of the truth — SEALED 2026-08-03 (user grill) · L0

Verdict source: user grill, 2026-08-03, opened to resolve `DECISIONS-OWED.md`
Part 2 #1, #4, #5 and #6 — the fog band blocking L3 build ticket 08. All four
close here. Values live at `MAGNITUDE.md` FG-M①; this ruling states shape and
carries no number.

### What the grill found

Row #1 was recorded as a conflict between two user seals. It was not. **노화 헌법
P3** (`../match-arc/GLOSSARY.md`, AGREED 2026-07-07 MT-①) — *"contact reveals the
immutable layer forever, the mutable layer decays"* — and the duel-pivot ledger's
witness-model seal of 2026-07-23 describe one model, sixteen days apart. What
disagreed with both was `js/intel.js`, which recomputes the band from the
**current** true value on every read. A five-turn-old reading therefore tracks
enemy reinforcement silently: the player's stale intelligence is never wrong, only
vaguer. That is a live feed going out of focus, not a snapshot fading.

Three independent findings converge on the same replacement:

1. **The archive band is invertible from a single observation.** Its width is
   proportional to the true value while both width and confidence are on screen,
   so the true figure solves out exactly. `../combat-formula/MAGNITUDE.md` M8's
   own conversion inverts identically. Neither side of the recorded conflict
   named this, and it defeats gate 03 invariant 6 — the residual sliver that
   invariant preserves is worthless if the width beside it gives the answer.
2. **P3 was not implemented**, and the slice-2 spec covered the gap with a reason
   that is false rather than merely thin: decay scalars exist in `js/intel.js` and
   they do not make the band a snapshot.
3. **Gate 03 §3 withheld the treasury to protect the 서지 모병 bluff.** A band that
   re-centres on current truth leaks the surge regardless, through the front door
   that decision was closing.

Rows #5 and #6 close by ADR 0041 §2 rather than by a ruling: the archive is
evidence and *"the source of truth [is] the contract, not the file."* The four
band constants and `OWNED_CONFIDENCE` appear in no Production document, so there
was never a second seal to weigh, and `game/src/projection/project.ts` already
holds a realm's own state at Exact.

### The model

1. **The band is a summary of observations, not a blur of the truth.** The true
   value does not enter the projection function at any point. *Reason (user): the
   band is not the object of judgment — it is the condition that makes judgment
   possible. Under a blur the player uncovers an answer; under a record the player
   weighs testimony, which is what 형세판단 names.*
2. **One act of observation yields a testimony: an honest but vague interval that
   contains the truth.** Containment is structural, because only true statements
   are ever stored. There is no clamp — a clamp would readmit the true value to
   the projection, undoing decision 1, and a band whose near edge is always the
   one pushed is itself a signal.
3. **Testimonies accumulate**, and each is corrected forward to the present before
   the intersection is taken. *Reason: plain intersection assumes a static world
   and returns the empty set the first time a force changes between two looks,
   which in a war is the normal case rather than the exception.*
4. **The testimony history is shown to the player**, summoned on designation
   rather than always painted, per ruling ② presentation contract. *Reason: the
   trend read — "it was this, now it is that" — is the capability this model adds
   and the current one cannot express at all; leaving it unshown converts it from
   a skill into a contest over who kept notes on paper.* The **UI method is
   deferred**; `docs/SYNC-DEBT.md` carries it.
5. **The forward correction is derived from sealed change bounds** — the
   recruitment rate term of the affordability bound, the casualty curve, and march
   speed against distance — never from a decay dial. **No new dial.** *Consequence
   worth stating: the rot rate of intelligence becomes land-derived, so a sector
   the enemy can quickly reinforce goes stale faster than a remote one.* This is
   the reach cone's grammar — a last-seen fact widened by what could have happened
   since — applied to magnitude instead of position.
6. **A substance band keeps an irreducible sliver.** No amount of observation pins
   an enemy force exactly. *Reason: the ledger's REDUCIBLE/IRREDUCIBLE split reads
   as shrinkable-to-zero only if "reducible" is taken to mean eliminable; read as
   shrinkable toward an asymptote, it and gate 03 invariant 6 both stand with
   neither reopened. Counting an army from outside does not become exact, and if
   it did, the uncertainty duel would resolve into a question of who can afford
   more reconnaissance.*
7. **A testimony's width is proportional to the figure it reports, never to the
   true value.** Derived rather than decided: proportional-to-truth restores the
   inversion in finding 1, and absolute width was already rejected by the 2026-07-01
   design §5.3 for making small garrisons exact and large hosts trivial.
8. **Paid observation is graded**, with the grade fixing the testimony's width and
   the unit price fixing how many sectors a pour covers (`MAGNITUDE.md` FG-M①).
9. **Free intelligence from contact is coarser than the cheapest purchase** — a
   battle tells you what struck you, not what you would have counted. *Reason
   (user): fighting a force realistically reveals its size, but the game must
   distinguish purposeful spying from incidental contact; if the two are worth the
   same, nothing is bought after first contact and the information market closes.*

   > **Scope corrected 2026-08-04 (build ticket 08's two-axis review), the user's
   > reason unchanged.** As a blanket statement this decision is **false at
   > FG-M①'s own values**: repelled assault is ±20%, *finer* than the ±25%
   > cheapest purchase, and only battle contact (±30%) sits wider. `MAGNITUDE.md`
   > FG-M① corrected the identical sentence in its own § Precision on 2026-08-03;
   > the correction did not reach here, and the still-false version then travelled
   > into the implementation as a code comment before the review caught it on both
   > axes — the birthplace-goes-stale pattern, one document further along.
   >
   > **What stands is the user's reason and the market it protects.** What
   > actually keeps that market open: the **enhanced grade (±10%) beats every free
   > reading**, and a defender cannot *choose* to be assaulted, so ±20% is a
   > windfall on a turn the opponent selected rather than a purchasable
   > substitute. What is genuinely lost is the normal grade against that one
   > target on that one turn.
   >
   > **Not settled here:** whether ±20% was meant to land inside the paid range at
   > all. That is a value, it is the user's, and `docs/SYNC-DEBT.md` carries it to
   > the first playtest with the rest of FG-M①.

### Derived, not decided — do not re-rule these

- **Scope was already fixed by 노화 헌법 P3.** The mutable layer becomes memory;
  the immutable layer is revealed permanently on contact. Enemy substance, enemy
  fatigue, and the bands derived from them (civilian register, 동원 강도) are the
  mutable layer, so they are all witness records. This required no new decision.
- **Army position already runs this grammar** — a last-seen fix plus a reach cone
  that grows with staleness. Magnitude joins position rather than inventing a
  parallel mechanism.
- **The reconnaissance crossover is emergent.** Where buying precision stops paying
  falls out of the unit prices against M2's commit lever; it is recorded as a
  consequence at `MAGNITUDE.md` FG-M① and must never be set directly.
- **`Information confidence` survives as a readout**, not as the cause of band
  width — it reports the grade and age of what is known. Its GLOSSARY row is
  re-cut accordingly in this batch.

### What this ruling does not settle

The presentation of the testimony history (ruling ② governs the surface, not this
control). Detection and radar pricing, still candidates under ruling ②. Whether
the derived forward-correction envelope composes cleanly from its three sealed
inputs — that is an implementation-time verification, registered in
`docs/SYNC-DEBT.md`.

> **Classification corrected 2026-08-03 (ruling ④), conclusion retained.** Calling
> the envelope's composition "an implementation-time verification" was **premature
> rather than wrong**. The check consumed a subject no seal had named — what the
> envelope is a bound *on* — so it could not be performed at all, and it stopped
> build ticket 08 on the morning of the day ruling ④ closed. With the subject set
> by ④ decision 1 the classification holds: the immobile observables have no
> march-out channel, and the mobile ones need the envelope for one turn at a time
> under unbroken contact (④ decision 3). The general form is registered at
> `docs/SYNC-DEBT.md` — **a verification is a verification only when every input it
> consumes is named**; otherwise it is an unruled decision wearing a
> verification's label, and it will stop a build rather than a review.
>
> This ruling also never said what a testimony is *about*. Ruling ④ answers that
> and leaves all nine decisions below standing; decision 3's accumulate-and-
> intersect gains a stated scope rather than a correction.

## ④ A testimony's subject is set by whether that subject can move — SEALED 2026-08-03 (user grill) · L0

Verdict source: user grill, 2026-08-03, opened on the blocker ruling ③ left
standing and `docs/SYNC-DEBT.md` registered as a user ruling owed. Ruling ③
settled what a testimony **is**; it never settled what a testimony is **about**,
and the forward-correction envelope cannot be composed until it does. This
ruling answers that and the six questions that fall out of it. It carries one
derived value, recorded at `MAGNITUDE.md` FG-M① rather than here, and no dial.

### What the grill found

The question was recorded as a choice — sector-attached or force-attached — and
it is a **false dilemma**. Both attachments are correct, for different
observables, and the discriminator is a property the board already has.

Three things the grill established that no seal had:

1. **Position got away without naming a subject; magnitude cannot.** A reach cone
   is never reconciled against a later sighting — it simply widens into a
   possibility region. Ruling ③ decision 3 makes magnitude testimonies
   *accumulate and intersect*, and intersection is precisely the operation that
   requires knowing two observations concern the same subject. That asymmetry is
   why the question surfaced here and not when position was designed, and it is
   why ③ could truthfully say position "already runs this grammar" while leaving
   the gap open.
2. **Sector-attachment is fatal only to subjects that can march.** Its measured
   failure — lower edge to zero after one turn, ticket 08 § Groundwork G1 — comes
   entirely from the march-out channel. A sector's population cannot march out:
   every serving body keeps the sector origin it was drawn from wherever it is
   standing (`../match-arc/GLOSSARY.md` 징집 명부, sector grain per ADR 0047), so
   the channel does not exist for the immobile observables and their bands decay
   instead of vanishing. 노화 헌법 P3's *decays* is literally true there.
3. **Force-attachment without a coherence rule is either a lie or a degeneration.**
   Division is free: no commit cost, no fatigue cost, no per-turn cap, gated only
   by the commit lock (`game/src/runtime/runtime.ts` `#splitDetachment`). A
   testimony that stays attached through an unseen division either stops
   containing the truth — the one thing ADR 0048 forbids — or opens a decline
   channel wide enough to reach zero every turn, which is the sector-attached
   failure reached by another road.

### The model

1. **A testimony's subject is set by whether the subject can move.**

   | Observable | Moves | The testimony attaches to |
   |---|---|---|
   | Field-army substance · field-army fatigue | yes | the **force** |
   | Garrison substance · 동원 강도 · civilian register | no | the **sector** |
   | 판세 | — | the **realm**, at match level |

   *Reason (user): a sector reading is void the moment the men walk out of it, and
   what the player is assembling is a census of the opponent's national strength.
   Only the force attachment conserves — the same army cannot stand in two
   sectors, so accounted mass has a ceiling the public register pool sets, and
   "how much is unaccounted for" becomes a question with an answer. Sector-level
   substance readings are independent intervals whose upper edges sum past
   anything the opponent could hold.*

   **Rider with a trigger.** Garrison substance sits in the immobile row *because
   garrisons are immobile today*: garrison→field posture transfer is unwired and
   held (`docs/SYNC-DEBT.md`). Build that transfer and garrison substance moves to
   the force row in the same batch.

2. **A division weakens a testimony. It neither kills it nor leaves it intact.**
   The count stays true of the aggregate that came out of the observed force;
   what is lost is the attribution.

   *Reason: keeping the attachment through a division makes the dealer lie —
   the interval no longer contains what it claims to describe — or else forces a
   decline channel that permits total collapse, which is decision-1's rejected
   reading again. Killing the testimony makes free division an
   intelligence-laundering move: division costs nothing, so an opponent would
   break every chain every turn and the model would collapse to "you know only
   what you saw this turn". Weakening preserves containment, preserves the count,
   and still charges the observer, because re-attributing the mass costs a fresh
   look. It is also how counting works: four thousand men seen crossing a pass are
   still four thousand men when they split into two columns.*

3. **Identity across observations is free only under unbroken contact.** While a
   viewer observes a force every turn the Runtime links those observations, the
   trend read accumulates, and a division is visible because the viewer is
   watching it happen. One unobserved turn cuts the chain.

   *Reason: defining identity by observation uses the grammar the rest of the
   model already runs on — free intelligence comes from contact, precision comes
   from purchase — and needs no stored state beyond the contact clock. The
   structural alternative (identity breaks on composition change) cannot read off
   existing state as it appears to: `Detachment.id` survives **both** operations,
   since division keeps the source id (`game/src/domain/force.ts`
   `splitDetachment`) and merge reuses one of its inputs' ids
   (`runtime.ts` `#mergeDetachments`). Because the knowledge matrix carries no
   adjacency row (gate 03 § 4), "unbroken contact" is in practice "paid again this
   turn" — which prices tracking directly, and prices it by the target's mobility,
   since a fast force's one-turn cone spans more sectors to buy. No dial: the
   price is FG-M①'s.*

4. **Re-acquisition is a new contact, never a resumed track.** After a gap the
   Runtime does not link a fresh observation to an older one. The viewer holds two
   contacts and reconciles them or does not.

   *Reason (user): this is where deception lives. An opponent who divides inside
   the viewer's blind spot leaves them holding a stale ~4,000 and a fresh ~1,000
   that do not reconcile — attrition and division both fit the evidence, and the
   dealer said nothing false. That is exactly ruling ②'s disposition: the dealer
   never lies, and deception lives in opponent actions read through honest
   instruments. A resumed track would also have to link by `Detachment.id`, making
   an information rule turn on which id a merging player happened to name first.*

5. **The two subjects age visibly differently, and that difference is the read.**
   A sector card holds its position while its figure blurs; a force marker holds
   its figure while its position blurs, the cone growing until the reading belongs
   to no sector at all. One reconnaissance purchase therefore carries a **certain**
   part (the land) and a **contingent** part (whatever force was standing there),
   and the pre-designation preview says which is which.

   *Reason: the player acquires a habit rather than a rule — readings taken off
   land keep, readings taken off armies do not — and the rule never has to be
   stated anywhere in the UI. It also splits reconnaissance into two products at
   one price: a rear sector sells durable knowledge, a front sector sells
   perishable knowledge that is actionable now. The two objects must stay visually
   distinct or the contrast in decision 6 reads as a defect; that is an acceptance
   condition on build ticket 04.*

6. **The census arrives as an evidence contrast, never as a computed remainder.**

   a. No published "unaccounted N".
   b. The Runtime aggregates the sector side and **refuses to sum** the force side
      — sector testimonies cannot overlap, force contacts can — and the refusal is
      visible: contacts render as a dated list, not a total.
   c. Coverage is shown beside the aggregate.
   d. It is **evidence, not a verdict**.

   *Reason: under decision 4 the Runtime cannot honestly total the contacts, since
   two of them may be the same force, so laying out the materials is the only
   honest render available — and what the player does with them is a gap read, not
   arithmetic. Showing nothing was closed by ③ decision 4's own reason: with
   forty-nine sectors summoned one at a time, an unshown contrast is a contest over
   who kept notes on paper. Clause (d) is what keeps this inside duel-pivot Gate
   6's prohibition on an in-play strategic or coach verdict, and it names the
   distinction those two seals appear to have been talking past — an evidence
   surface is not a verdict surface.*

   **Where the contrast is surfaced is not settled here.** That is
   `DECISIONS-OWED.md` Part 2 #13, build ticket 04's blocker; this ruling is an
   input to it and does not pre-empt it.

7. **The dealer does not spend all of its precision.** The figure a testimony
   reports is drawn from a range strictly narrower than honesty would permit, and
   the margin between the two **is** the irreducible sliver — the ±5% intersection
   floor, the **same margin at every grade**. A grade's asymptote is its stated
   width less that margin, so the cheap grade saturates short of the floor and only
   the expensive grade reaches it.

   *Reason: measured, not argued — ticket 08 § Groundwork G2. Drawing the reported
   figure from the whole honesty-feasible range lets that range's own endpoints pin
   the truth: about ten normal scouts, twenty commit and affordable inside a match,
   put the intersection inside the ±5% floor, and applying the floor by widening a
   collapsed interval then centres it on the true value — the device installed to
   preserve the sliver hands over the answer with decoration. Drawing narrower
   makes the floor a consequence of how the dealer speaks rather than a clamp
   bolted on afterwards, which is what FG-M① already claims when it says the floor
   holds "structurally rather than by a ceiling check". What the user ruled is the
   **outcome**: the two paid grades sell different **destinations** rather than
   different speeds — the expensive grade buys a floor the cheap one cannot reach,
   and a cheap grade that visibly saturates pushes commit onto a new target or an
   upgrade instead of onto more of the same look. A uniform margin is what delivers
   that outcome, and it is also what keeps the "no new dial" claim true: the margin
   is a number already sealed, whereas scaling it to each grade's width would need a
   proportionality constant, which is a dial.*

   > **Mechanism corrected 2026-08-03, hours after this ruling was written. The
   > outcome the user ruled is unchanged.** This decision first read *"the margin
   > scales with the grade's stated width"* and *"grade-proportional rather than
   > uniform"* — contradicting its own preceding sentence, and contradicting every
   > other surface (`MAGNITUDE.md` FG-M①, ADR 0050, ticket 08 § Groundwork G2), all
   > of which record uniform. The two readings are easy to confuse because they
   > **coincide exactly at the enhanced grade**, which is the grade the groundwork
   > measured; they part at the normal grade, where uniform gives ±20%. Recorded
   > rather than quietly rewritten because the wrong mechanism would have sent an
   > implementer to introduce a proportionality constant — the very dial this ruling
   > says it does not add. Caught by the batch's own two-axis review, on both axes.

### Derived, not decided — do not re-rule these

- **Ruling ③ stands entire.** This ruling names its subject and changes none of
  its nine decisions. Decision 3's accumulate-and-intersect gains a stated scope
  — within unbroken contact — rather than a correction.
- **The envelope's job shrinks to something checkable.** Immobile subjects have no
  march-out channel; mobile subjects need the bound for one turn at a time, under
  observation, and never for an unseen division, because a watched division
  deposits fresh testimony. This is what makes ③'s composition check a real
  implementation-time verification rather than a premature label — stamped there.
- **The archive already built position force-attached.** `js/intel.js` keys its
  records per detachment (`fixKey`, `turnsUnobserved`), consumed that way by
  `js/window-read.js`. Evidence, not contract (ADR 0041), and the reason ③ could
  say position already runs this grammar.
- **The reporting spread is not a free parameter.** The two sealed dials fix it;
  it is recorded at `MAGNITUDE.md` FG-M① beside the ρ crossover, as a consequence
  of the same kind. Never set it directly.

### What this ruling does not settle

- **Where the evidence contrast is surfaced** — `DECISIONS-OWED.md` Part 2 #13,
  build ticket 04.
- **The presentation of testimony history** — ③ deferred it; ruling ② governs the
  surface.
- **Whether garrison substance stays sector-attached.** It does while garrisons
  cannot move; the trigger is decision 1's rider.
- **Whether the knowledge matrix should carry an adjacency row.** Decision 3 leans
  on its absence, and the absence is deliberate as far as any seal says — but no
  seal says it deliberately. Registered; picked up at the first playtest (build
  ticket 13), where "an enemy army stood next to mine and I could not see it" is
  either right or obviously wrong.
- **Detection and radar pricing**, still candidates under ruling ②.
