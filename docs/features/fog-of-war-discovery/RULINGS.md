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
