# ADR 0019: Situation Judgment as a Structured, Posture-Lensed Province Reading

Date: 2026-07-01

Status: Accepted
Amended: 2026-07-06 (situation-map v5 front-sector pass) — posture becomes a pure annotation lens (overview salience/recommendation retired), the dissonance signal is succeeded by leak-through, and the recommendation moves to the summoned work surface; the reading model itself is unchanged. See § Amendment.

## Context

Stage 1 of a turn — situation judgment (형세판단) — is the reading the player
performs before issuing any command (ADR 0013 map-first UX; SPEC "reading the
map"). The term was used but never defined, and the implementation
(`js/situation.js`) under-delivered it: `classifyHex` produced a flat, per-hex,
priority-sorted top-7 highlight list from hardcoded thresholds, never emitted the
`threat` type at all, did no relational (adjacency/reachability) reasoning, and
ignored strategic posture. Before the MVP payoff-loop mockup can be trusted or
the loop built, the intent of situation judgment and its bridge to stage 2
(command) had to be concretized.

## Decision

Define situation judgment as a **structured, posture-lensed reading at the
province level**, not a flat list of salient cells.

1. **Structured reading.** It answers a small fixed question set: `판세`
   (standing — am I winning; aggregate/faction-level) plus the located axes
   `위협` (threat to me), `기회` (opening), `불확실` (blind spot / scouting need).
   Map highlights are the located evidence under each axis. This replaces the
   flat six-type sorted list.

2. **Province unit, sector drill-down, hex evidence.** The reading is per Named
   province; the player drills into front sectors beneath it for one-turn
   occupation and defense focus, then into specific hexes/map units for terrain
   evidence (progressive disclosure). Combat and movement calculations may still
   inspect hexes. Hex→sector→province aggregation per axis: 위협/defense =
   weakest link, 기회/value = sum, 불확실 = minimum confidence, route = any sector
   carrying a pass/river/strait-crossing tag.

3. **Relational threat.** A province is `위협` when it borders or is reachable by
   an enemy province whose estimated force exceeds the province's weakest-link
   defense, gated by information confidence (ADR 0013 already assumes an
   "estimated enemy strength range"). The former `defense` (my-weakness) and
   `threat` (enemy-pressure) types merge into one `위협` axis; which drives it is
   a drill-down reason. A border province with low enemy-info confidence routes
   to `불확실` instead of `위협`; scouting is the bridge that resolves it
   (`js/intel.js`, fog-of-war-discovery).

4. **Posture is a lens; truth is invariant.** The reading has three layers:
   truth (which provinces are 위협/기회/불확실 and their magnitude —
   posture-invariant), salience (posture tilts the order/emphasis of the finite
   top-N), and recommendation (posture shapes the prefilled command). Posture
   never edits the truth layer. Three hard constraints keep the lens from
   deceiving: (a) coverage — every non-empty axis keeps at least one surfaced
   highlight; (b) legibility — collapsed counts are always shown; (c) dissonance
   — a strong posture-vs-truth mismatch surfaces first ("this posture may not fit
   this turn"). This honors ADR 0011 (posture guides without taking agency away)
   and the fog guardrail (a loss must trace to a decision, not to a hidden
   filter). The dissonance signal is a concrete first piece of the skill edge
   left OPEN by the payoff-loop spec (SPEC pillars 2-3).

5. **Variety contract with fog.** Situation judgment is a lens: it transmits and
   amplifies the variety of its inputs but does not generate variety.
   Cross-playthrough content variety is the fog-of-war-discovery feature's
   responsibility (random spawn + fog over the authored map; no procedural
   generation required). The model is designed to carry that variety —
   confidence-gated threat and the `불확실` axis make readings path-dependent, and
   the intel MAX_CONFIDENCE 0.90 ceiling plus decay forbid an oracle so readings
   stay fresh even on a known map. An over-legible analyzer is the variety risk:
   the surface carries the average read, the game-specific edge lives in opt-in
   depth.

6. **Stage-1 → stage-2 bridge.** Attention (surfaced highlights,
   coverage-guaranteed, capped ~5–7 for legibility) is decoupled from and larger
   than the per-turn action budget. The gap — seeing more than can be acted on —
   is the stage-1 decision: which surfaced tensions earn this turn's limited
   action. Posture never shrinks what is seen (coverage), only what the player
   leans toward spending on. The MVP turn is one *primary* action drawing from a
   single divisible action-capacity pool (ADR 0020): the recommendation prefills
   the statistical-average commit, and skill is committing tighter than average
   and redirecting the surplus (economy/scouting). Concretely: "of the ~5-7
   surfaced tensions, which single one do I focus this turn on, and how much
   capacity do I commit?" The four-capacity / carryover / overclock system stays
   deferred (ADR 0018); the invariant is budget < attention.

## Considered Options

- **Flat highlight list** (keep `classifyHex` behavior): rejected — freezes
  situation judgment as a set of heuristic cells with no definable intent.
- **Hex-unit reading**: rejected — contradicts the Named-province meaning
  (DOMAIN_MAP) and blocks relational reasoning. This does not reject hexes as
  terrain evidence under a front sector.
- **Absolute threat** (garrison below a fixed floor): rejected — "understaffed"
  is not "in danger"; it cannot express an incoming invasion and fires on safe
  interior provinces.
- **Fixed cross-axis priority order**: rejected — leaves posture inert,
  violating ADR 0011.
- **Posture filters the truth layer**: rejected — concealment turns skill-loss
  into fate-loss (fog guardrail) and takes agency away (ADR 0011).

## Consequences

- `js/situation.js` is reworked: `classifyHex` → a province-level classifier
  with front-sector drill-down and hex evidence aggregation; add relational
  threat with adjacency/reachability and confidence gating; wire posture into
  salience and recommendation only; add the coverage guarantee, collapsed-count
  legibility, and dissonance signal. The `threat` type gets a real emitter;
  `defense` folds into `위협`.
- Replayability depends on fog-of-war-discovery; this ADR defines the contract
  that feature must satisfy (path-dependence, no oracle). The MVP mockup
  demonstrates the lens and the stage-1→stage-2 bridge, not variety.
- The MVP uses one primary action per turn with variable capacity commitment and
  limited surplus redirection; the four-capacity/carryover/overclock system
  stays deferred (ADR 0018, ADR 0020). Larger budgets remain a later balance
  lever.
- Updates DOMAIN_MAP `Situation judgment`. Complements ADR 0013 (map-first UX),
  ADR 0011 (posture as guidance), ADR 0017 (opt-in depth), ADR 0018 (MVP scope).

## Amendment (2026-07-06, situation-map v5 front-sector — A-4 B5)

The situation-map v5 design pass (2026-07-02 design session; the mockup
landed on main via SDD — `docs/superpowers/plans/2026-07-02-situation-map-v5-map-only.md`)
refines the *surface* of this decision. The reading MODEL above is
unchanged: truth-invariance, the 판세/위협/기회/불확실 question set,
province→sector→hex drill-down, weakest-link / sum / min-confidence
aggregation, relational fog-gated 위협, the variety contract, and the
budget < attention bridge all stand. What changes is how posture and
the recommendation reach the player.

- **Posture becomes a pure annotation lens — retires the salience and
  recommendation layers of § Decision 4 on the overview.** The overview
  is map-only: no sidebar top-N list, no rec-ring, no advice text. Each
  posture answers a different question with on-map annotations over the
  invariant truth — 방어 = "where can I be breached" (reachable-weakest-link
  labels on own border provinces), 공세 = "what can I take"
  (force-comparison chips on reachable foes), 정찰 중시 = "what can't I
  see" (confidence labels on foes), 균형 = base view. The active lens
  brightens its axis and dims the others; it never edits truth. Judgment
  is the player's — the overview no longer recommends.
- **Leak-through succeeds the dissonance signal (§ Decision 4c).** While a
  lens is active, any suppressed-axis tension whose magnitude exceeds
  `LEAK_RATIO (1.5) ×` the strongest active-lens tension stays at full
  brightness with a red pulse ring — same guardrail intent (an urgent
  fact cannot be hidden by the lens), expressed as a persistent on-map
  encoding instead of a warning line. Constraints 4a (coverage) and 4b
  (legibility) survive as on-map encodings.
- **Recommendation moves off the overview onto the summoned work
  surface.** The ADR 0020 statistical-average commit prefill (§ Decision
  6) is unchanged, but it now lives only on the transient work surface
  summoned when a target is named — not as a map rec-ring. The overview
  reads; the work surface commits.
- **Unified action grammar: name target → summon surface → seal plan.**
  The front sector is the unit of strategic action (ADR 0022): the hero
  province routes through its sector drill; fog / opportunity provinces
  summon a sectorless minimal card. One grammar for every action.

Consequence delta: the `js/situation.js` rework in § Consequences now
targets posture → annotation-lens (not salience + recommendation) and
leak-through (not dissonance); the commit prefill is owned by the
command / work-surface layer. The v5 mockup demonstrates this; the
game-code rework remains an owed follow-up (front-sector-drill deferred
items). SPEC was re-read at amendment time and is already consistent
(posture guides analysis rather than granting bonuses; the preset-first
skill floor survives via the work-surface prefill), so no SPEC change.
DOMAIN_MAP `Situation judgment` synced this batch.
