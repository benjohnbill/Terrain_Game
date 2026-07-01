# Stage-2 Command: The Skill-Edge Core (Commitment, Forecast, Scout Gambit)

Date: 2026-07-02

Status: Draft — design mockup validated; pending implementation plan

## Context

Stage 1 (situation judgment, ADR 0019) surfaces province-level tensions and
points the player at where to look. Stage 2 is the command: the player picks one
tension and spends the turn's single action on a front sector (ADR 0022),
choosing and tuning an operation plan (ADR 0024). In the situation-map mockup the
command card was a stub — a prefilled command plus an "OPEN" adjustment
placeholder.

This spec defines the first stage-2 slice: the **skill-edge core** — the
commitment decision, its forecast under fog, and the scout-versus-defend choice.
It was validated as an interactive mockup (`mockup/command-card-hybrid.html`). It
does not build game code. It fixes the representation and the decisions the real
command card must embody, and marks what stays open.

Scope is deliberately narrow and defense-led. It draws on:

- ADR 0019 — stage-1 to stage-2 bridge: see ~5-7 tensions, act on one.
- ADR 0020 — divisible action-capacity; commitment is the efficiency skill edge.
- ADR 0021 — an under-committed contested defense that fails loses the front
  sector; scouting narrows the estimate band so the risk is skill-piercable.
- ADR 0022 — the front sector is the one-turn operational target; four defense
  layers (terrain, fortification, local garrison, current-turn commitment).
- ADR 0024 — operation plan presets; six effect axes (including `confidenceGain`);
  the commitment slider is the always-adjustable field; the card generates a small
  valid plan set.
- fog-of-war-discovery / situation-map v3 — the enemy estimate range that narrows
  with scouting is the input to the forecast.

## The slice

Defense-led. The demo scenario continues the situation-map hero tension: 소현 (my
weak border province) is under 위협 from 철옹 (enemy estimate 12-16, confidence
75%). The player has focused 소현's 남부 전선구역 and opened the command card.

### 1. Two exclusive alternative plans

The card offers the small valid plan set (ADR 0024). For this slice, two:

- **방어 강화 (recommended)** — commit capacity to hold the sector this turn.
- **정찰** — spend the action on reconnaissance of this front instead.

They are mutually exclusive: one primary action per turn (ADR 0020). Choosing
between them is the stage-1 to stage-2 decision itself — act now on a wide
estimate, or buy information and act next turn. The player cannot scout and defend
in the same turn.

### 2. Defense view: confrontation axis (model) plus win-rate verdict (result)

The commitment decision is shown in two coupled layers:

- **Confrontation axis (the "why").** A force axis on which the enemy's fogged
  estimate band (12-16, hatched) meets the player's sector-defense marker (base
  defense plus committed capacity). Outcome zones sit behind the axis: lose /
  contested / hold. The player sees whether their defense clears the enemy band,
  and the band width is the uncertainty made visible.
- **Win-rate verdict (the "what").** The forecast outcome as a **hold
  probability** ("사수 76%"), not a loss rate. Framing by win-rate rather than by
  loss avoids the loss-aversion bias that pushes players toward over-safe
  turtling.

The commitment slider moves the marker; the verdict and zone update live. A
recommended-commitment tick marks the statistical-average safe hold (ADR 0024).
Committing below the safe threshold surfaces the under-commit risk (section 5).

### 3. Forecast semantics: a probabilistic estimate under fog

The win-rate is a forecast under uncertainty, not a deterministic outcome. Its
dominant uncertainty is the fogged enemy estimate: the true enemy force lies
somewhere in the band, so whether the defense holds depends on where the truth
actually falls. The band above the number is where that uncertainty lives; the
number is a point estimate of it.

Principle (ADR 0021 plus the fog guardrail): the risk must be **skill-piercable,
not fate-driven**. The player reduces it by scouting (narrowing the band), and a
loss must trace to the player's decision (under-committed, or chose not to scout),
never to hidden randomness. The forecast is an informed, chosen risk.

Whether to render the outcome as a single percentage or as a range is a
sub-decision. The chosen representation is a single hold-percentage with the band
shown above it; rendering a range would double-encode the same uncertainty.

### 4. Scout as a gambit

Choosing 정찰 spends the action on reconnaissance and leaves the sector undefended
this turn. The card frames the gamble honestly:

- **If the enemy does not attack this turn** — the player gains information: next
  turn the estimate band is narrower (confidence up), so they commit only what is
  needed (surplus if the enemy proved weak) or confirm the real threat (if it
  proved strong). Either way they act on knowledge instead of a wide guess.
- **If the enemy attacks this turn** — the sector is lost (undefended,
  commitment zero).

**Enemy intent is a second fog.** The game surfaces the enemy's estimated force
but never an explicit "will they attack" probability. Whether the enemy will
strike is read from force, exposure, and positioning; that read is the skill that
makes the gambit a genuine gamble. An explicit intent meter is forbidden here — it
would over-legibilize the read and remove the skill.

**No-spoiler principle (a spec-wide rule).** The command card projects only what
the player legitimately knows. The scout plan's payoff is described as reduced
uncertainty (confidence up, band narrower) — never the specific post-scout values.
Scouting may reveal good news (enemy weaker than feared) or bad news (stronger);
the result is unknown until the action resolves. Pre-revealing it would remove the
reason to scout and break the fog.

This preserves an emergent dynamic worth keeping: **information is a compounding
resource.** A side that scouts a front in advance acts on certainty and wastes no
commitment; the attacker, who chooses when and where to strike, gains an
information and initiative advantage. Defensive counterplay (scouting the buildup,
the terrain and fortification layers, pre-emption) keeps this from collapsing into
pure reaction. The magnitudes are combat-balance concerns (section 7).

### 5. Under-commitment risk

Committing below the safe-hold threshold to a contested defense that fails loses
the front sector (ADR 0021), not gradual damage. The card marks this: below the
threshold the confirm control reads as a risk ("저커밋 확정 — 실패 시 구역 상실"),
and the win-rate falls into the contested and lose zones. Deliberate
under-commitment (or scouting, or a zero-commit sacrifice) is a real strategic
choice; the downside is what makes the efficiency loop (ADR 0020) meaningful.

### 6. Surplus

Committing below capacity frees surplus, shown as a number ("+30 여력"). Working
surplus redirection — spending it on a second sub-action — is deferred to a later
slice. This slice shows surplus only as the visible payoff of tight commitment.

## Numeric model (illustrative only)

The mockup uses dummy magnitudes purely to make the encoding legible: base sector
defense 9 (garrison plus terrain plus fortification), enemy estimate band 12-16 at
75% confidence, a capacity pool of 100, a linear capacity-to-defense conversion,
and a safe-hold recommended commitment of 70. These are not balance decisions. How
capacity commitment, the plan's authored magnitude, and the four defense layers
combine into an applied result is combat balancing, defined in the numeric combat
pass (ADR 0024), not here.

## Components / files

- `mockup/command-card-hybrid.html` — the validated slice: two plans,
  confrontation axis, win-rate verdict, scout gambit, under-commit risk, surplus.
  Self-contained; reuses the A2 map-table palette from situation-map.
- `mockup/command-card-variants.html` — the earlier A/B/C encoding comparison
  (confrontation axis / forecast gauge / efficiency ledger) that led to the
  hybrid; kept as design rationale.
- Consumes: situation-map v3 (`mockup/situation-map.*`) — the enemy estimate range
  is the forecast input.

## What stays open

- Front-sector focus as a real map drill. This slice assumes the sector is already
  focused; the province-to-sector selection UI is a later slice.
- The full operation-plan catalog and attack plans (six effect axes, availability
  generation, per-axis magnitudes). This slice hand-authors two defense-side plans.
- Result and resolution reporting (front-sector outcome plus province status
  transition, ADR 0021 and 0023).
- Working surplus redirection (ADR 0020) as a second sub-action.
- The combat magnitude formula (commitment to applied effect), deferred to the
  numeric combat pass.
- Whether scouting is a standalone action only, or also a bundled recon component
  of an attack/defense plan (the `confidenceGain` effect axis). This slice treats
  scout as a standalone alternative plan.

## Verification

Static HTML/CSS/JS mockup; no unit tests. Verified in-browser (browser-harness):
both plan views render; the win-rate and outcome zones update across the full
commitment range; the scout gambit shows the undefended marker and the no-spoiler
framing; and the under-commit risk surfaces below the safe-hold threshold.

## References

ADR 0019, 0020, 0021, 0022, 0023, 0024; fog-of-war-discovery design; situation-map
v3 mockup.
