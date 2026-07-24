# SPEC Amendment — 1v1 Duel Pivot (GRILLED & SEALED)

> **Status: GRILLED & SEALED 2026-07-24 (apply-ready). Applied to `SPEC.md`: see
> stamp at end.** SPEC is Direction — it changes only by explicit user decision.
> This draft's items were stress-tested one at a time in an adversarial grill
> (2026-07-24); several were **changed by the grill** and now differ from the
> original proposal. The text below is the **authoritative apply-spec** — the
> sealed outcome, not the first draft. Prior cascade (ADR 0042, DOMAIN_MAP/DESIGN,
> capital CP-②, match-arc reseal) already landed; this is the SPEC leg.

The pivot: **the game is a two-realm head-to-head duel won by capturing the enemy
capital.** War and match are one; there is no hegemony settlement, no multi-realm
decision point, and no crisis-arc / draw terminus. The combat + realm-internal
engine survives whole (premises Boundary). Authoritative record: ADR 0042 +
`docs/features/capital/` (CP-②) + the ledger.

**How the grill changed the original proposal (summary):**
- **#5 (Principle 5)** split: identity keeps only the *design commitment* (capital
  fall = sole terminus); the *anti-fizzle-sufficiency bet* is demoted out of the
  identity layer to the lower "How a match ends" block with an L3-deferred stamp.
- **Resign** newly addressed: accepted as a product-layer forfeit **below SPEC**;
  the identity claim is re-scoped to *system* judgment. "capital concession" is
  NOT adopted as a SPEC term. (Original draft did not treat resign.)
- **"diplomacy"** struck from Goal + Promise (original only re-scoped Phase 2).
- **Phase 2** parked (with the multiplayer/PvP axis), not reframed as
  opponent-psychology (original C11 reframe rejected).
- **S2 BM** removed: the subscription BM / "competitive product" framing stays
  PARKED (premises P2); only "1v1 head-to-head duel + EVAL BAR signature" lands.
- **Positioning** re-anchored on a terrain-war duel (Civilization demoted from
  template to catalyst); original kept the "simple Civilization" lead.
- **Fun Pillars 1 & 3** re-cut (original claimed all pillars survive untouched;
  the grill found Pillar 3 in literal contradiction with the sealed land-decay
  engine, and Pillar 1 mis-ranking growth as the core).

---

## Part 1 — SPEC edits (final apply text, by location)

### E1 — § Goal (was C1 + S4 + diplomacy strike)
**Current:** "…where terrain, regional economy, population, local military
strength, **diplomacy**, and events combine into a **world-conquest** strategy
experience."
**Apply:** "…— a **two-realm head-to-head duel won by capturing the enemy
capital**. Terrain, regional economy, population, local military strength, and
events combine into the strategy of that duel." (Duel identity up front;
"diplomacy" struck — a two-realm duel has no third party, and the opponent-read
is Principle #2, not diplomacy.)

### E2 — § Core Gameplay Promise (was C2 + S4 + diplomacy strike)
**Current:** "…uses that state's geography, economy, population, military
deployment, **diplomacy**, and timing **to conquer the map**."
**Apply:** "…uses that state's geography, economy, population, military
deployment, and timing **to capture the enemy realm's capital — the sole win
condition of the duel**." ("diplomacy" struck.)

### E3 — Principle #2 (was S1, append only)
**Apply — append to the end of #2:** "In the duel this is literal: both realms
commit the whole turn's orders blind, then reveal and resolve together — poker's
bet → showdown, not chess's perfect-information alternation (ADR 0025 made
literal; ledger Gate 6)."

### E4 — Principle #5 (was C3 — SPLIT by the grill)
**Current:** "**The ending is the detection of irreversibility.** A match ends
… when the system detects that no realm or coalition can reverse the balance —
that moment opens settlement negotiation…"
**Apply (retitle "The ending is capital fall"):** "**The ending is capital
fall.** A match ends when a realm's capital falls; the **system** names a winner
by nothing else — no points-victory, no timeout-draw, no scorecard. (ADR 0042;
capital CP-②; DOMAIN_MAP § Match Arc.)"
**Grill note:** the anti-fizzle *sufficiency* claim ("stalemate is prevented
structurally") is deliberately NOT in the identity layer — it is a bet measured
at L3, so it lives in E10 with an L3-deferred stamp. "system" is load-bearing:
player resignation is a product-layer forfeit below SPEC, not a counter-example
to this identity.

### E5 — § Positioning (was S2 — re-anchored, BM removed)
**Current:** "A 'simple Civilization': a Civilization-depth *world* … operated
with a League-of-Legends-shaped *hand* … *expressed* interaction complexity is
opt-in."
**Apply:** "**Positioning.** A **1v1 terrain-war duel, read like poker under
fog — won by taking the enemy capital.** It began as the wish for a 'simple
Civilization' — Civilization-scale terrain-and-war depth through a
low-micromanagement hand — and that depth remains the *world's* character; but
the shape is a duel, the tension is poker under fog, and the tempo is a casual,
short competitive match, operated with a **League-of-Legends-shaped *hand***
(low skill floor via posture presets and prefilled commands, optional skill
ceiling for mastery), not a 4X campaign. The signature read/feedback organ is
the **EVAL BAR (판세)**. System complexity is high; *required* interaction
complexity is low; *expressed* interaction complexity is opt-in."
**Grill note:** "Civilization" is the catalyst, not the template ("grand-strategy"
avoided for the same over-anchor reason). The subscription BM / "chess.com-shaped
competitive product" framing is **NOT** written here — it stays PARKED
(premises P2); only the sealed duel shape + EVAL BAR (Gate 6) land.

### E6 — § Match envelope (was S3)
**Current:** "…a match must end at a **decision point** rather than by map
completion…"
**Apply:** replace "a decision point" → "**capital fall**". (Wall-clock envelope
target unchanged; only the terminus name.)

### E7 — § Match structure (was C4 + C5 + C6 + C7 — combined rewrite)
**Apply — replace the Match-structure paragraph with:** "The map is fully
partitioned from turn 1 — **exactly two realms**, bordering each other, no
expand-into-empty-land opening; player count is decided, not an authoring
variable. **Growth comes only from taking enemy ground, never from settling empty
land — this is what forces confrontation (mutual-exposure) rather than a
builder's race.** Realms start as mature states (fortresses at chokes, armies
raised) balanced on *survivability and starting population* — every region opens
with the same population total, so lifetime blood budgets are equal and
divergence comes only from play — but asymmetric in geometry and economy. The
concrete two-realm board (capital placement, forward/rear geometry, terrain) is
authored at the parallel 1v1 map pass. **War and match are one** — a single
sustained duel, not a multi-war arc; the match runs at the player's pace until a
capital falls (target: casual 15–30 min), its length induced by land-derived
decay, not a fixed clock (turn structure: simultaneous blind commit → reveal,
ledger Gate 6). A war is pressed by field-army destruction and encirclement —
pressures **toward capital capture**, no longer independent match-terminators
(amends ADR 0038's three-channel composite → capital fall is the sole terminus).
The match ends when a **capital falls**, not at 100% map control and not at a
settlement. The sealed model and vocabulary live in `docs/features/capital/`
(CP-②), `docs/features/match-arc/`, and `DOMAIN_MAP.md`."
**Grill note:** removed the multipolar 중원/coalition/anti-snowball-loop geometry
and the ~2–3-war arc; kept the parity principle; C7's "the loser's concession"
dropped from the pressures list (concession = resign = product layer, E-P1).

### E8 — "Resolved (match-arc pass, 2026-07-04)" block (was C8)
**Apply — replace whole block with:** "**Resolved — superseded by the 1v1 pivot
(ADR 0042).** The decision-point / settlement / hegemony victory model is
retired; capital fall is the sole win condition. The multi-realm machinery
(hegemony decision point, domination, unassailability, settlement bundles,
acceptance arithmetic) is historical (DOMAIN_MAP § Match Arc, match-arc feature
docs). Open playtest questions carry over in duel form: showdown staging (the
read-vs-reality reveal — now the EVAL BAR + simultaneous reveal) and the
loser-side experience."

### E9 — "Domination victory — second win-type (2026-07-09)" block (was C9)
**Apply — replace whole block with:** "**Domination victory — superseded by ADR
0042.** There is no hegemony gate (and so no leadership/domination win-types) in
a two-realm duel; capital fall is the sole win condition."

### E10 — "How a match ends (crisis arc, sealed 2026-07-11)" block (was C10 + the demoted #5(b))
**Apply — replace whole block with:** "**How a match ends (1v1 pivot, ADR
0042).** A match ends in exactly one way: **a capital falls.** There is no
hegemony decision point, no crisis arc, and no Westphalian draw — the crisis /
internal-uprising system (ADR 0034/0035/0036) is retired. 'No judged scorecard'
stands, strengthened: nothing but capital fall ever names a winner. Stalemate is
not resolved by any scoring terminal; **the current design bet** is that
structural forces make the duel resolve without a forced-termination device —
1v1 removes the multipolar deadlock, mutual-exposure makes sitting unsafe, and
land-derived decay pushes the trailing player to gamble — **but that sufficiency
is measured in L3 playtest, and an explicit device stays deferred behind that
measurement (ADR 0042 §3); it is a design bet, not an always-true identity
claim.**"
**Grill note:** this block is the home of Principle #5's demoted (b) — the
anti-fizzle-sufficiency bet — carried with its L3-deferred stamp so an
L3-added device never falsifies a Core Principle.

### E11 — Fun Pillars (Pillars 1 & 3 re-cut; 2 & 4 untouched)
**Apply — replace Pillar 1:** "1. **The psychological duel.** The core
satisfaction is out-reading and out-planning the opponent under fog — inferring
the hidden picture piece by piece, allocating each turn's tactics and 행동력, and
chaining several turns into one well-planned war that lands a 명량-shaped comeback
(매드무비). Growth is felt — taking ground genuinely strengthens you — but it
serves the duel; the fun is the read and the 수싸움, not the size of the empire."
**Apply — replace Pillar 3:** "3. **The lead never ends the duel early.**
Land-derived decay pressures the trailing side toward a decision (anti-fizzle),
but the lead is never a safe automatic steamroll: pressing it forward exposes
your own capital (mutual-exposure), and the match stays a live judgment to the
end — a read-driven comeback stays available, not foreclosed by an early
state-lead. The intent, measured in play, is that skill, not an early state-lead,
decides who converts pressure into a win."
**Grill note:** Pillar 3's old wording ("not a state-driven … loop") literally
contradicted the sealed land-derived decay engine (match-arc AB-②/capLandFrac 1 +
OG-① income + mutual-exposure D2.5, all durably sealed); re-aimed from "how
advantage accumulates" to "why the lead never ends the duel early," so it now
protects Pillar 1's core. Pillars 2 & 4 unchanged.

### E12 — § Phase Roadmap, Phase 2 (was C11 — parked, not reframed)
**Current:** "**Phase 2: Diplomacy and International Order.** Expand diplomacy
beyond alliance/war into tribute, vassalage, threats, betrayal, peace terms, war
justification, and relationship risk."
**Apply — replace with:** "**Phase 2: Diplomacy and International Order —
parked.** Diplomacy and inter-realm order are multi-party concerns with no
referent in a 1v1 (or future 2v2) duel: there is no third party to ally with or
betray, and tribute / vassalage / settlement were multi-realm currencies retired
by the pivot (ADR 0042). This phase is parked together with the multiplayer / PvP
axis — itself a separate SPEC-level decision (premises Boundary), not assumed
here — and is revived only if that axis is opened. (Epidemic, nomad-incursion,
and similar multi-actor content is likewise a future-mode candidate, not folded
in now.)"

---

## Part 2 — Sealed, but NOT entering SPEC (product / parked homes)

These grill outcomes are real decisions but live below or beside SPEC Direction.

- **E-P1 — Resignation (product layer).** A human duel has a resign/forfeit
  affordance; it is a **product/UX** feature **below SPEC**, not a SPEC identity
  terminus (E4 re-scopes the win-condition to *system* judgment, which resign
  does not violate). "capital concession" is not adopted as a SPEC term.
  **cheap-resign** (bailing on slight disadvantage) is a product-layer problem —
  managed post-L3 by ranked incentives / friction, as chess.com does, not by a
  rule-layer mechanic. Home: `docs/DESIGN-RISKS.md`.
- **E-P2 — Business model (parked).** F2P free core (chess.com/lichess-shaped,
  bot play for user-base growth); PvE-primary revenue (bot archetypes / higher
  difficulty / diversification / coaching-feedback subscription targeting
  improvers); PvP as the depth/fun axis (continuous matches vs a chosen
  opponent). "Money ≠ fun/design," so this stays out of SPEC. Consistent with
  premises P2 (PvE-primary + subscription BM PARKED). Home: parked product note.
- **E-P3 — Post-playable dev priority (parked).** Bot AI + archetype development
  is the top post-system dev focus (bot-fun is load-bearing: revenue + user-base
  → PvP activation). 2v2 bot variations (human team vs bot team; user-picked
  archetype matching) are future-mode candidates. Home: parked product note.
- **E-P4 — 2v2 team mode (parked).** Hidden-teammate 2v2 (Tichu-shaped) as a
  future axis; a unanimity-resign idea was raised. Not decided; parks with the
  multiplayer/PvP axis (premises Boundary). Grill flagged a real risk
  (hidden-teammate + no-comms makes unanimity hard, can trap a player who wants
  to concede) for that future pass. Home: parked product note.

---

## Part 3 — Downstream doc-sync (after SPEC lands)

- **Projection check:** DOMAIN_MAP/DESIGN already re-cut to 1v1 in the prior
  cascade; verify the grill's re-cuts (Positioning anchor, Pillar 1/3, diplomacy
  strike, Phase 2 park) do not open a new Projection divergence. Patch if so.
- **SYNC-DEBT:** strike the row **"SPEC amendment PROPOSAL pending — Tier-3,
  user approval"** to Paid once E1–E12 land.
- **DESIGN-RISKS / parked product note:** record E-P1…E-P4.
- **term-inventory + `npm run lint:docs` + QUICKREF regen** if any upstream term
  status changed (none expected — the grill re-cut prose, not term status).

---

## Notes for the record

- Items sealed one at a time by the user in the 2026-07-24 grill; each E-item's
  wording is the sealed outcome, not the first proposal.
- Core Design Principles that SURVIVE untouched: #1 land-derived, #3 one
  judgment, #4 deterministic resolution, #6 skill-piercable, #7 blood permanent,
  #8 emergent asymmetry, #9 geography-defines-the-set. #5 rewritten (E4), #2
  sharpened (E3).

---

## Applied stamp

**SEALED & APPLIED 2026-07-25.** E1–E12 applied verbatim to `SPEC.md` (repo root)
in one batch. E-P1 (resign) recorded in `docs/DESIGN-RISKS.md` R15;
E-P2/E-P3/E-P4 (BM vision / bot-AI dev priority / 2v2) held in Part 2 above as
their durable parked home. SYNC-DEBT row "SPEC amendment PROPOSAL pending —
Tier-3" struck to Paid (2026-07-25). QUICKREF freshness bumped. DOMAIN_MAP/DESIGN
checked — no normative divergence from the grill's re-cuts (the remaining
`diplomacy` mentions are reading-model derivation inputs or Phase-2-deferred
capacity, not top-line core-input claims; recorded as a candidate for the next
DOMAIN_MAP cleanup). `npm run lint:docs`: 0 blocking (5 pre-existing
ledgerCurrency advisories, unrelated). No term-inventory patch (no term status
changed). Grill + apply completed in one session.
