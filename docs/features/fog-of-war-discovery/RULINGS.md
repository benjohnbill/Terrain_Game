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
